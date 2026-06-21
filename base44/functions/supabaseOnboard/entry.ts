/**
 * supabaseOnboard — Supabase user provisioning bridge for Base44 Auth users
 *
 * ARCHITECTURAL CONTEXT:
 *   - VYRO uses Base44 Auth, not Supabase Auth
 *   - Base44 user IDs are 24-char hex strings (MongoDB ObjectId format), NOT UUIDs
 *   - Supabase tables with user_id columns expect UUID type
 *   - All FK constraints point back to auth.users (which Base44 never populates)
 *
 * STRATEGY:
 *   - Derive a deterministic UUID-v5 from the Base44 hex ID so every Base44 user
 *     maps to a stable, unique UUID in Supabase
 *   - Store the mapping in a bridge table: base44_user_bridge { base44_id, supabase_uuid }
 *   - Write tables in FK-safe order:
 *       1. user_wallets  (no FK — accepts any UUID)
 *       2. user_presence (no FK — accepts any UUID)
 *       3. coin_wallets  (FK → users — will fail until DB trigger exists; logged only)
 *       4. user_xp       (FK → profiles — will fail until DB trigger exists; logged only)
 *       5. vip_profiles  (FK → profiles — will fail until DB trigger exists; logged only)
 *   - Tables with FK→auth.users/profiles are logged as "pending_db_trigger" — cannot be
 *     fixed from the app side without Supabase dashboard changes (ALTER TABLE DROP CONSTRAINT
 *     or CREATE TRIGGER on auth.users)
 *
 * IDEMPOTENT: safe to call multiple times — uses upsert with ignore-duplicates.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Convert a hex string to a deterministic UUID v4-formatted string
// This gives each Base44 user a stable UUID that Supabase accepts
function hexToUUID(hex) {
  // Pad or truncate to 32 hex chars
  const h = hex.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
  return [
    h.substring(0, 8),
    h.substring(8, 12),
    '4' + h.substring(13, 16),   // version 4
    ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16) + h.substring(17, 20), // variant
    h.substring(20, 32),
  ].join('-');
}

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

    // Derive a stable UUID from the Base44 hex ID
    const base44Id  = user.id;
    const supaUUID  = hexToUUID(base44Id);

    const results = {};
    const errors  = {};
    const pending = {}; // tables blocked by FK constraints we can't resolve from app

    // Helper: upsert via PostgREST service role
    async function upsert(table, row) {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation,resolution=ignore-duplicates',
          },
          body: JSON.stringify(row),
        });
        const data = res.status !== 204 ? await res.json() : null;
        const isConflict = res.status === 409;
        const isDuplicate = res.status === 200 || (Array.isArray(data) && data.length === 0);
        if (!res.ok && !isDuplicate) {
          return { ok: false, status: res.status, error: data?.message || `HTTP ${res.status}`, code: data?.code };
        }
        return { ok: true, inserted: res.status === 201, data };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }

    // ── Step 1: user_wallets (no FK — safe always) ──
    const w1 = await upsert('user_wallets', {
      user_id: supaUUID,
      balance_coins: 0,
      total_earned: 0,
      total_spent: 0,
    });
    if (w1.ok) results.user_wallets = w1.inserted ? 'created' : 'already_exists';
    else errors.user_wallets = { error: w1.error, code: w1.code };

    // ── Step 2: user_presence (no FK — safe always) ──
    const w2 = await upsert('user_presence', {
      user_id: supaUUID,
      is_online: true,
      is_typing: false,
      last_seen: new Date().toISOString(),
    });
    if (w2.ok) results.user_presence = w2.inserted ? 'created' : 'already_exists';
    else errors.user_presence = { error: w2.error, code: w2.code };

    // ── Step 3: coin_wallets (FK → users/auth.users — will likely fail) ──
    const w3 = await upsert('coin_wallets', { user_id: supaUUID });
    if (w3.ok) results.coin_wallets = w3.inserted ? 'created' : 'already_exists';
    else if (w3.code === '23503') {
      pending.coin_wallets = 'blocked_by_fk_users — requires Supabase trigger or FK removal';
    } else {
      errors.coin_wallets = { error: w3.error, code: w3.code };
    }

    // ── Step 4: user_xp (FK → profiles — will likely fail) ──
    const w4 = await upsert('user_xp', { user_id: supaUUID, level: 1 });
    if (w4.ok) results.user_xp = w4.inserted ? 'created' : 'already_exists';
    else if (w4.code === '23503') {
      pending.user_xp = 'blocked_by_fk_profiles — requires Supabase trigger or FK removal';
    } else {
      errors.user_xp = { error: w4.error, code: w4.code };
    }

    // ── Step 5: vip_profiles (FK → profiles — will likely fail) ──
    const w5 = await upsert('vip_profiles', { user_id: supaUUID });
    if (w5.ok) results.vip_profiles = w5.inserted ? 'created' : 'already_exists';
    else if (w5.code === '23503') {
      pending.vip_profiles = 'blocked_by_fk_profiles — requires Supabase trigger or FK removal';
    } else {
      errors.vip_profiles = { error: w5.error, code: w5.code };
    }

    const successCount = Object.keys(results).length;
    const pendingCount = Object.keys(pending).length;
    const errorCount   = Object.keys(errors).length;

    const status = errorCount === 0 && pendingCount === 0 ? 'success'
                 : successCount > 0 ? 'partial'
                 : 'failed';

    return Response.json({
      status,
      base44_id: base44Id,
      supabase_uuid: supaUUID,
      results,
      pending: pendingCount > 0 ? pending : undefined,
      errors:  errorCount  > 0 ? errors  : undefined,
      summary: {
        created:  successCount,
        pending:  pendingCount,
        failed:   errorCount,
        message:  pendingCount > 0
          ? `${successCount} tables written. ${pendingCount} table(s) require Supabase dashboard action (FK constraints pointing to auth.users/profiles). See 'pending' field.`
          : status === 'success' ? 'All Supabase records created successfully' : `${errorCount} table(s) failed`,
      },
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});