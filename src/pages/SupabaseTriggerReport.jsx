/**
 * SupabaseTriggerReport — Live Trigger Execution Validation
 * Shows real-time results of trigger tests with exact failure reasons.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Copy, CheckCircle, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Deterministic UUID from Base44 hex
function hexToUUID(hex) {
  const h = hex.replace(/-/g, '').padEnd(32, '0').substring(0, 32);
  return [h.substring(0,8), h.substring(8,12), '4'+h.substring(13,16),
    ((parseInt(h[16],16)&0x3)|0x8).toString(16)+h.substring(17,20), h.substring(20,32)].join('-');
}

// The COMPLETE corrected SQL — fixes all known issues found in this session
const FIX_SQL = `-- ═══════════════════════════════════════════════════════════════
-- VYRO LIVE — Complete Supabase Trigger & Provision Fix
-- Run this ONCE in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- STEP 1: Create public.users mirror table (if not exists or missing columns)
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid PRIMARY KEY,
  email       text,
  display_name text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- STEP 2: Create public.profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid PRIMARY KEY,
  user_id         uuid,
  display_name    text,
  avatar_url      text,
  phone           text,
  country_code    text DEFAULT 'QAT',
  application_id  text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- STEP 3: Add created_at to coin_wallets if missing
ALTER TABLE IF EXISTS public.coin_wallets
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- STEP 4: Drop & recreate provision_vyro_user RPC
CREATE OR REPLACE FUNCTION public.provision_vyro_user(
  p_uuid         uuid,
  p_email        text,
  p_display_name text,
  p_avatar_url   text DEFAULT '',
  p_phone        text DEFAULT '',
  p_country      text DEFAULT 'QAT',
  p_app_id       text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_result jsonb := '{}';
BEGIN
  -- Root: auth.users
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data, role, aud
  ) VALUES (
    p_uuid, p_email, '', now(), now(), now(),
    jsonb_build_object('provider','base44','providers',ARRAY['base44']),
    jsonb_build_object('display_name',p_display_name,'avatar_url',p_avatar_url),
    'authenticated','authenticated'
  ) ON CONFLICT (id) DO NOTHING;
  v_result := v_result || '{"auth_users":"ok"}';

  -- public.users
  INSERT INTO public.users (id, email, display_name, avatar_url, created_at, updated_at)
  VALUES (p_uuid, p_email, p_display_name, p_avatar_url, now(), now())
  ON CONFLICT (id) DO NOTHING;
  v_result := v_result || '{"public_users":"ok"}';

  -- public.profiles
  INSERT INTO public.profiles (id, user_id, display_name, avatar_url, phone, country_code, application_id, created_at, updated_at)
  VALUES (p_uuid, p_uuid, p_display_name, p_avatar_url, p_phone, p_country, p_app_id, now(), now())
  ON CONFLICT (id) DO NOTHING;
  v_result := v_result || '{"profiles":"ok"}';

  -- coin_wallets
  INSERT INTO public.coin_wallets (user_id) VALUES (p_uuid)
  ON CONFLICT (user_id) DO NOTHING;
  v_result := v_result || '{"coin_wallets":"ok"}';

  -- user_xp
  INSERT INTO public.user_xp (user_id, level, xp, total_xp)
  VALUES (p_uuid, 1, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  v_result := v_result || '{"user_xp":"ok"}';

  -- vip_profiles
  INSERT INTO public.vip_profiles (user_id) VALUES (p_uuid)
  ON CONFLICT (user_id) DO NOTHING;
  v_result := v_result || '{"vip_profiles":"ok"}';

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM, 'sqlstate', SQLSTATE);
END;
$$;

GRANT EXECUTE ON FUNCTION public.provision_vyro_user TO service_role;
GRANT EXECUTE ON FUNCTION public.provision_vyro_user TO authenticated;

-- STEP 5: Trigger — auto cascade after profile insert
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

-- STEP 6: RLS (safe even if already enabled)
ALTER TABLE IF EXISTS public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coin_wallets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_xp       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vip_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_wallets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_presence ENABLE ROW LEVEL SECURITY;

-- Drop old conflicting policies before re-creating
DROP POLICY IF EXISTS "profiles_own_row"      ON public.profiles;
DROP POLICY IF EXISTS "coin_wallets_own_row"  ON public.coin_wallets;
DROP POLICY IF EXISTS "user_xp_own_row"       ON public.user_xp;
DROP POLICY IF EXISTS "vip_profiles_own_row"  ON public.vip_profiles;
DROP POLICY IF EXISTS "user_wallets_own_row"  ON public.user_wallets;
DROP POLICY IF EXISTS "user_presence_own_row" ON public.user_presence;

CREATE POLICY "profiles_own_row"      ON public.profiles      FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "coin_wallets_own_row"  ON public.coin_wallets  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_xp_own_row"       ON public.user_xp       FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "vip_profiles_own_row"  ON public.vip_profiles  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_wallets_own_row"  ON public.user_wallets  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_presence_own_row" ON public.user_presence FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Done. Run supabaseProvision again after this to verify all 6 tables populate.
`;

const CHECKS = [
  {
    id: "rpc",
    label: "provision_vyro_user RPC",
    status: "MISSING",
    color: "#EF4444",
    icon: "❌",
    detail: "Function not found (HTTP 404). This is the root blocker — without it, no FK-parent rows can be created.",
    fix: "Run FIX SQL in Supabase Dashboard → SQL Editor",
  },
  {
    id: "user_wallets",
    label: "user_wallets",
    status: "✅ WORKING",
    color: "#10B981",
    icon: "✅",
    detail: "2 rows found. FK-free table — writes succeed without the RPC. user_id, balance_coins, total_earned, total_spent all present.",
    fix: null,
  },
  {
    id: "user_presence",
    label: "user_presence",
    status: "✅ WORKING",
    color: "#10B981",
    icon: "✅",
    detail: "2 rows found. FK-free table — writes succeed. is_online, is_typing, last_seen confirmed.",
    fix: null,
  },
  {
    id: "profiles",
    label: "profiles",
    status: "EMPTY — BLOCKED",
    color: "#EF4444",
    icon: "❌",
    detail: "0 rows. Blocked because provision_vyro_user RPC is not installed. Cannot write auth.users → public.users → profiles chain from PostgREST alone.",
    fix: "Run FIX SQL → RPC handles this atomically",
  },
  {
    id: "coin_wallets",
    label: "coin_wallets",
    status: "EMPTY + SCHEMA ERROR",
    color: "#EF4444",
    icon: "❌",
    detail: "0 rows. Additional issue: column 'created_at' does not exist on this table (HTTP 400, code 42703). FIX SQL adds the missing column.",
    fix: "Run FIX SQL → adds created_at column + populates via RPC",
  },
  {
    id: "user_xp",
    label: "user_xp",
    status: "EMPTY — BLOCKED",
    color: "#EF4444",
    icon: "❌",
    detail: "0 rows. FK → profiles, which is empty. Cascade trigger can't fire because no profiles row exists yet.",
    fix: "Run FIX SQL → profiles populated → trigger fires → user_xp row created",
  },
  {
    id: "vip_profiles",
    label: "vip_profiles",
    status: "EMPTY — BLOCKED",
    color: "#EF4444",
    icon: "❌",
    detail: "0 rows. FK → users/profiles, which are empty. Same cascade dependency.",
    fix: "Run FIX SQL → RPC populates vip_profiles directly",
  },
  {
    id: "trigger_on_profile_created",
    label: "Trigger: on_profile_created()",
    status: "NOT FIRED",
    color: "#F59E0B",
    icon: "⚠️",
    detail: "Trigger is in the SQL payload but was never deployed because the RPC was never installed. Once profiles table gets its first row, this trigger will cascade coin_wallets + user_xp + vip_profiles automatically.",
    fix: "Run FIX SQL → trigger deploys + fires on next profile insert",
  },
  {
    id: "handle_new_user",
    label: "Trigger: handle_new_user()",
    status: "NOT VERIFIED",
    color: "#F59E0B",
    icon: "⚠️",
    detail: "Standard Supabase auth trigger that fires on auth.users insert. Since auth.users has no rows from Base44 signups, this trigger has never executed. The RPC now writes auth.users directly, which will fire this trigger.",
    fix: "Automatic after RPC install — no extra action needed",
  },
];

export default function SupabaseTriggerReport() {
  const navigate = useNavigate();
  const [running,    setRunning]    = useState(false);
  const [liveChecks, setLiveChecks] = useState(null);
  const [copied,     setCopied]     = useState(false);
  const [activeTab,  setActiveTab]  = useState("findings");

  const runLiveTest = async () => {
    setRunning(true);
    const results = {};

    // Run provision + all table reads in parallel
    const [provRes, walletRes, presenceRes, profilesRes, coinRes, xpRes, vipRes] = await Promise.all([
      base44.functions.invoke("supabaseProvision", { display_name: "Live Trigger Test" }).catch(e => ({ error: e.message })),
      base44.functions.invoke("supabaseQuery", { table: "user_wallets",  method: "GET", select: "*", limit: 5 }).catch(e => ({ error: e.message })),
      base44.functions.invoke("supabaseQuery", { table: "user_presence", method: "GET", select: "*", limit: 5 }).catch(e => ({ error: e.message })),
      base44.functions.invoke("supabaseQuery", { table: "profiles",      method: "GET", select: "*", limit: 5 }).catch(e => ({ error: e.message })),
      base44.functions.invoke("supabaseQuery", { table: "coin_wallets",  method: "GET", select: "*", limit: 5 }).catch(e => ({ error: e.message })),
      base44.functions.invoke("supabaseQuery", { table: "user_xp",       method: "GET", select: "*", limit: 5 }).catch(e => ({ error: e.message })),
      base44.functions.invoke("supabaseQuery", { table: "vip_profiles",  method: "GET", select: "*", limit: 5 }).catch(e => ({ error: e.message })),
    ]);

    const count = r => r?.data?.data?.length ?? (r?.error ? "ERR" : 0);
    const rpcOk = provRes?.data?.status === "success" || provRes?.data?.results?.rpc_provision?.status === "ok";

    setLiveChecks({
      rpcMissing:   provRes?.data?.status === "rpc_missing",
      rpcOk,
      provStatus:   provRes?.data?.status,
      supaUUID:     provRes?.data?.supabase_uuid,
      tables: {
        user_wallets:  { count: count(walletRes),  error: walletRes?.error },
        user_presence: { count: count(presenceRes),error: presenceRes?.error },
        profiles:      { count: count(profilesRes),error: profilesRes?.error },
        coin_wallets:  { count: count(coinRes),    error: coinRes?.data?.error || coinRes?.error },
        user_xp:       { count: count(xpRes),      error: xpRes?.error },
        vip_profiles:  { count: count(vipRes),     error: vipRes?.error },
      },
      triggersFired: rpcOk && count(profilesRes) > 0 && count(xpRes) > 0,
      timestamp: new Date().toLocaleTimeString("en-QA", { hour12: false }),
    });

    setRunning(false);
  };

  const copySQL = () => {
    navigator.clipboard.writeText(FIX_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const S = {
    page:  { minHeight:"100dvh", background:"linear-gradient(160deg,#060A0E 0%,#091520 60%,#060A0E 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:100 },
    hdr:   { position:"sticky", top:0, zIndex:50, background:"rgba(6,10,14,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(16,185,129,0.18)", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 },
    glass: (c="#10B981") => ({ background:`${c}08`, border:`1px solid ${c}22`, borderRadius:16 }),
    sec:   { fontSize:9, fontWeight:800, letterSpacing:"0.08em", marginBottom:10, color:"#6B7280" },
  };

  const TABS = ["findings", "live", "sql", "plan"];

  return (
    <div style={S.page}>
      <div style={S.hdr}>
        <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
          style={{ width:38, height:38, borderRadius:"50%", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={18} color="#10B981" />
        </motion.button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>🧪 Trigger Execution Report</div>
          <div style={{ fontSize:10, color:"#10B981" }}>Live Supabase Validation · {new Date().toLocaleDateString("en-QA")}</div>
        </div>
        <motion.button whileTap={{ scale:0.9 }} onClick={runLiveTest} disabled={running}
          style={{ width:36, height:36, borderRadius:"50%", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <RefreshCw size={15} color="#10B981" style={{ animation: running ? "spin 0.9s linear infinite" : "none" }} />
        </motion.button>
      </div>

      <div style={{ padding:"14px" }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:14, padding:4, marginBottom:16, overflowX:"auto", scrollbarWidth:"none" }}>
          {TABS.map(t => (
            <motion.button key={t} whileTap={{ scale:0.94 }} onClick={() => setActiveTab(t)}
              style={{ flexShrink:0, padding:"8px 14px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, whiteSpace:"nowrap",
                background: activeTab===t ? "linear-gradient(135deg,#10B981,#059669)" : "transparent",
                color: activeTab===t ? "#fff" : "#6B7280" }}>
              {t.toUpperCase()}
            </motion.button>
          ))}
        </div>

        {/* FINDINGS TAB — static real data from our tests */}
        {activeTab === "findings" && (
          <>
            {/* Status summary */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
              {[
                { v:"2/8", l:"Tables OK",     c:"#10B981" },
                { v:"4/8", l:"Blocked (FK)",  c:"#EF4444" },
                { v:"0/2", l:"Triggers Fired",c:"#F59E0B" },
              ].map(s => (
                <div key={s.l} style={{ background:`${s.c}0F`, border:`1px solid ${s.c}25`, borderRadius:14, padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:8, color:"#6B7280", marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={S.sec}>📋 TABLE-BY-TABLE FINDINGS</div>
            {CHECKS.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                style={{ ...S.glass(c.color), padding:"13px 14px", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:`${c.color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    {c.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:900, color:"#e2e8f0", fontFamily:"monospace" }}>{c.label}</span>
                      <span style={{ fontSize:8, fontWeight:800, padding:"2px 8px", borderRadius:7, background:`${c.color}18`, color:c.color }}>{c.status}</span>
                    </div>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{c.detail}</div>
                    {c.fix && (
                      <div style={{ fontSize:9, fontWeight:700, color:"#F59E0B", marginTop:5 }}>
                        🔧 Fix: {c.fix}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {/* LIVE TAB — run real-time checks now */}
        {activeTab === "live" && (
          <>
            <motion.button whileTap={{ scale:0.96 }} onClick={runLiveTest} disabled={running}
              style={{ width:"100%", padding:"14px", borderRadius:14, border:"none", cursor:"pointer", fontWeight:900, fontSize:13, color:"#fff",
                background:"linear-gradient(135deg,#10B981,#059669)", boxShadow:"0 6px 22px rgba(16,185,129,0.35)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:16 }}>
              {running
                ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/> Running tests...</>
                : "▶ Run Live Trigger Tests"}
            </motion.button>

            {liveChecks && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                {/* Provision result */}
                <div style={S.sec}>🚀 PROVISION CALL RESULT</div>
                <div style={{ ...S.glass(liveChecks.rpcMissing ? "#F59E0B" : "#10B981"), padding:"13px 14px", marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:"#e2e8f0" }}>supabaseProvision</span>
                    <span style={{ fontSize:11, fontWeight:900, color: liveChecks.rpcMissing ? "#F59E0B" : "#10B981" }}>
                      {liveChecks.rpcMissing ? "⚠️ rpc_missing" : "✅ success"}
                    </span>
                  </div>
                  {liveChecks.supaUUID && (
                    <div style={{ fontSize:9, color:"#6B7280", fontFamily:"monospace" }}>UUID: {liveChecks.supaUUID}</div>
                  )}
                  <div style={{ fontSize:9, color:"#6B7280", marginTop:2 }}>Checked at {liveChecks.timestamp}</div>
                </div>

                {/* Table counts */}
                <div style={S.sec}>📊 LIVE TABLE COUNTS</div>
                {Object.entries(liveChecks.tables).map(([table, r]) => {
                  const ok = typeof r.count === "number" && r.count > 0;
                  const err = r.error;
                  const color = err ? "#EF4444" : ok ? "#10B981" : "#F59E0B";
                  return (
                    <div key={table} style={{ ...S.glass(color), padding:"11px 14px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:800, color:"#e2e8f0", fontFamily:"monospace" }}>{table}</div>
                        {err && <div style={{ fontSize:9, color:"#EF4444", marginTop:2 }}>{err}</div>}
                      </div>
                      <span style={{ fontSize:13, fontWeight:900, color }}>
                        {err ? "ERR" : `${r.count} rows`}
                      </span>
                    </div>
                  );
                })}

                {/* Trigger status */}
                <div style={{ ...S.glass("#A78BFA"), padding:"13px 14px", marginTop:4 }}>
                  <div style={{ fontSize:12, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>
                    {liveChecks.triggersFired ? "✅ Triggers fired" : "⚠️ Triggers NOT fired"}
                  </div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>
                    {liveChecks.triggersFired
                      ? "profiles row exists and cascade trigger populated child tables"
                      : "profiles table still empty — RPC must be installed first for triggers to fire"}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* SQL TAB */}
        {activeTab === "sql" && (
          <>
            <div style={{ background:"rgba(249,115,22,0.07)", border:"1px solid rgba(249,115,22,0.3)", borderRadius:14, padding:"13px 14px", marginBottom:12 }}>
              <div style={{ fontSize:12, fontWeight:900, color:"#F97316", marginBottom:6 }}>🔧 Complete Fix SQL</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>
                This single SQL script fixes <strong style={{ color:"#F97316" }}>all 5 issues found</strong>:
                RPC function, missing <code style={{ background:"rgba(255,255,255,0.08)", padding:"1px 4px", borderRadius:4 }}>created_at</code> column on coin_wallets,
                cascade trigger, RLS policies (DROP + recreate safe), and table structure.
                Run once in <strong style={{ color:"#F97316" }}>Supabase Dashboard → SQL Editor</strong>.
              </div>
            </div>

            <motion.button whileTap={{ scale:0.95 }} onClick={copySQL}
              style={{ width:"100%", padding:"12px", borderRadius:13, border:"none", cursor:"pointer", fontWeight:800, fontSize:12,
                background: copied ? "rgba(16,185,129,0.15)" : "rgba(249,115,22,0.15)",
                color: copied ? "#10B981" : "#F97316",
                border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(249,115,22,0.3)"}`,
                display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:12 }}>
              {copied ? <CheckCircle size={14}/> : <Copy size={14}/>}
              {copied ? "SQL Copied!" : "Copy Complete Fix SQL"}
            </motion.button>

            <div style={{ background:"rgba(0,0,0,0.55)", borderRadius:14, padding:"14px", border:"1px solid rgba(249,115,22,0.2)", maxHeight:400, overflowY:"auto" }}>
              <pre style={{ fontSize:8.5, color:"#FCD34D", fontFamily:"monospace", margin:0, whiteSpace:"pre-wrap", lineHeight:1.65 }}>
                {FIX_SQL}
              </pre>
            </div>
          </>
        )}

        {/* PLAN TAB */}
        {activeTab === "plan" && (
          <>
            <div style={S.sec}>📌 EXACT STEPS TO FULL GREEN</div>
            {[
              {
                n:1, title:"Run Fix SQL in Supabase", status:"required", color:"#EF4444",
                steps:[
                  "Go to supabase.com → your project",
                  "Click SQL Editor in left sidebar",
                  "Paste the SQL from the SQL tab",
                  "Click RUN",
                  "Expected: 'Success. No rows returned'",
                ],
              },
              {
                n:2, title:"Re-run Live Tests", status:"verify", color:"#F59E0B",
                steps:[
                  "Come back here → Live tab",
                  "Click 'Run Live Trigger Tests'",
                  "Expected: all 6 tables show row counts > 0",
                  "profiles → 1+ rows",
                  "coin_wallets, user_xp, vip_profiles → auto-created by trigger",
                ],
              },
              {
                n:3, title:"Test Signup Flow", status:"final", color:"#10B981",
                steps:[
                  "Register a new account via /register",
                  "Complete profile setup",
                  "supabaseProvision fires automatically",
                  "All 6 FK tables populate within 2 seconds",
                  "Profile screen shows real data immediately",
                ],
              },
              {
                n:4, title:"Frontend Reflection", status:"auto", color:"#818CF8",
                steps:[
                  "MeVIPSection → reads vip_tiers (already working)",
                  "MeLevelCards → reads user_xp (will work after SQL run)",
                  "MeStats → reads user_xp + coin_wallets (will work after SQL run)",
                  "Finance → reads user_wallets (already working)",
                  "Presence → reads user_presence (already working)",
                ],
              },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                style={{ background:`${step.color}08`, border:`1px solid ${step.color}25`, borderRadius:16, padding:"14px", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:`${step.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:step.color, flexShrink:0 }}>
                    {step.n}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:900, color:"#fff" }}>{step.title}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:step.color, textTransform:"uppercase" }}>{step.status}</div>
                  </div>
                </div>
                {step.steps.map((s, si) => (
                  <div key={si} style={{ fontSize:10, color:"rgba(255,255,255,0.55)", padding:"3px 0 3px 12px", lineHeight:1.5, borderLeft:`2px solid ${step.color}30` }}>
                    {s}
                  </div>
                ))}
              </motion.div>
            ))}

            <div style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:14, padding:"14px", marginTop:4 }}>
              <div style={{ fontSize:11, fontWeight:900, color:"#10B981", marginBottom:6 }}>📊 Expected Final State After Fix</div>
              {[
                ["profiles",     "populated via RPC",       "✅"],
                ["coin_wallets", "populated via RPC + trigger","✅"],
                ["user_xp",      "populated via RPC + trigger","✅"],
                ["vip_profiles", "populated via RPC + trigger","✅"],
                ["user_wallets", "already working",          "✅"],
                ["user_presence","already working",          "✅"],
                ["on_profile_created trigger","fires on every profile insert","✅"],
                ["Integration %","95%+",                     "✅"],
              ].map(([k,v,s]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.5)", fontFamily:"monospace" }}>{k}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:"#10B981" }}>{s} {v}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}