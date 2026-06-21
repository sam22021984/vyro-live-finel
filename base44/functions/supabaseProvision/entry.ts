/**
 * supabaseProvision — Full FK-chain user provisioning for VYRO
 *
 * STRATEGY:
 *   The root FK issue is: coin_wallets/user_xp/vip_profiles/support_tickets all
 *   have FK → public.users or public.profiles, which themselves reference auth.users.
 *   Since VYRO uses Base44 Auth (not Supabase Auth), auth.users is never populated,
 *   so the entire FK chain is broken.
 *
 *   FIX (no schema changes, no FK drops):
 *   1. Call Supabase RPC function `provision_vyro_user` via /rest/v1/rpc
 *      This SQL function runs as SECURITY DEFINER (bypasses RLS, runs as postgres)
 *      and inserts directly into auth.users + public.users + public.profiles in
 *      one atomic transaction — satisfying all FK parents before children.
 *   2. After the RPC succeeds, write all child rows via PostgREST (FKs now satisfied)
 *   3. Full chain: auth.users → public.users → public.profiles → coin_wallets/user_xp/vip_profiles
 *
 *   If the RPC function doesn't exist yet in Supabase, we return the SQL needed to create it
 *   along with a "rpc_missing" status so the audit page can surface it clearly.
 *
 * IDEMPOTENT: all inserts use ON CONFLICT DO NOTHING via PostgREST upsert.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Deterministic UUID from Base44 hex ID (same as supabaseOnboard)
function hexToUUID(hex) {
  const h = hex.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
  return [
    h.substring(0, 8),
    h.substring(8, 12),
    '4' + h.substring(13, 16),
    ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16) + h.substring(17, 20),
    h.substring(20, 32),
  ].join('-');
}

// The SQL to create the RPC function in Supabase — returned if RPC is missing
const PROVISION_RPC_SQL = `
-- Run this in Supabase Dashboard → SQL Editor to enable full FK chain provisioning
CREATE OR REPLACE FUNCTION public.provision_vyro_user(
  p_uuid        uuid,
  p_email       text,
  p_display_name text,
  p_avatar_url  text DEFAULT '',
  p_phone       text DEFAULT '',
  p_country     text DEFAULT 'QAT',
  p_app_id      text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_result jsonb := '{}';
BEGIN
  -- Step 1: Insert into auth.users (FK root — owned by Supabase Auth schema)
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud
  ) VALUES (
    p_uuid, p_email, '', now(),
    now(), now(),
    jsonb_build_object('provider', 'base44', 'providers', ARRAY['base44']),
    jsonb_build_object('display_name', p_display_name, 'avatar_url', p_avatar_url),
    'authenticated', 'authenticated'
  ) ON CONFLICT (id) DO NOTHING;
  v_result := v_result || '{"auth_users": "ok"}';

  -- Step 2: Insert into public.users (FK → auth.users)
  INSERT INTO public.users (
    id, email, display_name, avatar_url, created_at, updated_at
  ) VALUES (
    p_uuid, p_email, p_display_name, p_avatar_url, now(), now()
  ) ON CONFLICT (id) DO NOTHING;
  v_result := v_result || '{"public_users": "ok"}';

  -- Step 3: Insert into public.profiles (FK → users or auth.users)
  INSERT INTO public.profiles (
    id, user_id, display_name, avatar_url, phone, country_code, application_id, created_at, updated_at
  ) VALUES (
    p_uuid, p_uuid, p_display_name, p_avatar_url, p_phone, p_country, p_app_id, now(), now()
  ) ON CONFLICT (id) DO NOTHING;
  v_result := v_result || '{"profiles": "ok"}';

  -- Step 4: coin_wallets (FK → users)
  INSERT INTO public.coin_wallets (user_id) VALUES (p_uuid)
  ON CONFLICT (user_id) DO NOTHING;
  v_result := v_result || '{"coin_wallets": "ok"}';

  -- Step 5: user_xp (FK → profiles)
  INSERT INTO public.user_xp (user_id, level, xp, total_xp)
  VALUES (p_uuid, 1, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  v_result := v_result || '{"user_xp": "ok"}';

  -- Step 6: vip_profiles (FK → users or profiles)
  INSERT INTO public.vip_profiles (user_id) VALUES (p_uuid)
  ON CONFLICT (user_id) DO NOTHING;
  v_result := v_result || '{"vip_profiles": "ok"}';

  -- Step 7: support_tickets seed row is NOT needed (created on demand)
  -- user_wallets and user_presence are FK-free, written separately

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM, 'sqlstate', SQLSTATE);
END;
$$;

-- Grant execute to service role and authenticated users
GRANT EXECUTE ON FUNCTION public.provision_vyro_user TO service_role;
GRANT EXECUTE ON FUNCTION public.provision_vyro_user TO authenticated;

-- ────────────────────────────────────────────────────────────────────
-- BONUS: RLS policies so authenticated users can manage their own rows
-- ────────────────────────────────────────────────────────────────────

-- Enable RLS on all affected tables (safe to run even if already enabled)
ALTER TABLE IF EXISTS public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coin_wallets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_xp        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vip_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_wallets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_presence  ENABLE ROW LEVEL SECURITY;

-- Profiles: own row
CREATE POLICY IF NOT EXISTS "profiles_own_row"
  ON public.profiles FOR ALL TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- coin_wallets: own row
CREATE POLICY IF NOT EXISTS "coin_wallets_own_row"
  ON public.coin_wallets FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- user_xp: own row
CREATE POLICY IF NOT EXISTS "user_xp_own_row"
  ON public.user_xp FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- vip_profiles: own row
CREATE POLICY IF NOT EXISTS "vip_profiles_own_row"
  ON public.vip_profiles FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- user_wallets: own row
CREATE POLICY IF NOT EXISTS "user_wallets_own_row"
  ON public.user_wallets FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- user_presence: own row
CREATE POLICY IF NOT EXISTS "user_presence_own_row"
  ON public.user_presence FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Service role bypasses RLS by default — no additional policy needed

-- ────────────────────────────────────────────────────────────────────
-- BONUS TRIGGERS: Auto-cascade on profile creation (optional safety net)
-- ────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.on_profile_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.coin_wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_xp (user_id, level, xp, total_xp) VALUES (NEW.id, 1, 0, 0) ON CONFLICT DO NOTHING;
  INSERT INTO public.vip_profiles (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_profile_created ON public.profiles;
CREATE TRIGGER trg_on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.on_profile_created();
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return Response.json({ error: 'Supabase secrets not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      display_name   = user.full_name || 'VYRO User',
      avatar_url     = '',
      phone          = '',
      country_code   = 'QAT',
      application_id = '',
    } = body;

    const base44Id  = user.id;
    const supaUUID  = hexToUUID(base44Id);
    const email     = user.email || `${base44Id}@vyro.app`;

    const results = {};
    const errors  = {};

    // ── Helper: raw PostgREST upsert (service role) ──
    async function upsert(table, row) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal,resolution=ignore-duplicates',
          },
          body: JSON.stringify(row),
        });
        if (res.status === 204 || res.status === 200 || res.status === 201) {
          return { ok: true, inserted: res.status === 201 };
        }
        const data = await res.json().catch(() => ({}));
        return { ok: false, status: res.status, error: data?.message || `HTTP ${res.status}`, code: data?.code };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }

    // ── Step 1: Call provision RPC (handles auth.users + users + profiles + FK children) ──
    let rpcMissing = false;
    try {
      const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/provision_vyro_user`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_uuid:         supaUUID,
          p_email:        email,
          p_display_name: display_name,
          p_avatar_url:   avatar_url,
          p_phone:        phone,
          p_country:      country_code,
          p_app_id:       application_id,
        }),
      });

      if (rpcRes.status === 404) {
        rpcMissing = true;
        results.rpc_provision = 'missing — run SQL from provision_sql field in Supabase Dashboard';
      } else if (!rpcRes.ok) {
        const rpcData = await rpcRes.json().catch(() => ({}));
        errors.rpc_provision = {
          error: rpcData?.message || `HTTP ${rpcRes.status}`,
          code:  rpcData?.code,
        };
      } else {
        const rpcData = await rpcRes.json().catch(() => ({}));
        if (rpcData?.error) {
          errors.rpc_provision = { error: rpcData.error, sqlstate: rpcData.sqlstate };
        } else {
          results.rpc_provision = { status: 'ok', chain: rpcData };
        }
      }
    } catch (e) {
      errors.rpc_provision = { error: e.message };
    }

    // ── Step 2: user_wallets (no FK — always safe) ──
    const w1 = await upsert('user_wallets', {
      user_id:       supaUUID,
      balance_coins: 0,
      total_earned:  0,
      total_spent:   0,
    });
    if (w1.ok) results.user_wallets = 'ok';
    else errors.user_wallets = { error: w1.error, code: w1.code };

    // ── Step 3: user_presence (no FK — always safe) ──
    const w2 = await upsert('user_presence', {
      user_id:   supaUUID,
      is_online: true,
      is_typing: false,
      last_seen: new Date().toISOString(),
    });
    if (w2.ok) results.user_presence = 'ok';
    else errors.user_presence = { error: w2.error, code: w2.code };

    // ── Step 4: If RPC succeeded, verify child rows exist ──
    if (results.rpc_provision) {
      // Attempt to re-upsert child rows in case RPC column names differ
      const xp = await upsert('user_xp', { user_id: supaUUID, level: 1, xp: 0, total_xp: 0 });
      if (xp.ok && !results.rpc_provision?.chain?.user_xp) results.user_xp_verify = 'ok';

      const cw = await upsert('coin_wallets', { user_id: supaUUID });
      if (cw.ok && !results.rpc_provision?.chain?.coin_wallets) results.coin_wallets_verify = 'ok';
    }

    const successCount = Object.keys(results).length;
    const errorCount   = Object.keys(errors).length;

    const overallStatus = rpcMissing ? 'rpc_missing'
                        : errorCount === 0 ? 'success'
                        : successCount > 0 ? 'partial'
                        : 'failed';

    return Response.json({
      status:        overallStatus,
      base44_id:     base44Id,
      supabase_uuid: supaUUID,
      results,
      errors:        errorCount > 0 ? errors : undefined,
      // If RPC is missing, return the SQL so it can be copy-pasted into Supabase
      provision_sql: rpcMissing ? PROVISION_RPC_SQL : undefined,
      summary: {
        created: successCount,
        failed:  errorCount,
        message: rpcMissing
          ? 'RPC function not found. Copy the provision_sql field and run it in Supabase Dashboard → SQL Editor, then call this function again.'
          : overallStatus === 'success'
            ? 'Full FK chain provisioned successfully'
            : `${successCount} succeeded, ${errorCount} failed`,
      },
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});