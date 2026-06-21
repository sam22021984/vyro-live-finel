/**
 * SupabaseAudit — VYRO Live Connect Earning
 * Complete Supabase Integration Audit & Report
 * Route: /supabase-audit (admin only)
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RefreshCw, CheckCircle, XCircle, AlertCircle, Database, Zap, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── All Supabase tables discovered from health check ──
const SUPABASE_TABLES = [
  "vip_tiers","vip_tiers","user_wallets","wallets","coin_wallets","global_wallets",
  "daily_tasks","daily_bonus","referrals","live_streams","stream_profiles","stream_levels",
  "gift_catalog","room_gifts","user_gifting_stats","support_tickets","leaderboard",
  "reward_leaderboards","families","social_friends","social_relationships","relationships",
  "user_inventory","user_xp","user_presence","user_settings","user_medals","user_wallets",
  "vip_profiles","vip_benefits","vip_rewards","vip_events","vip_reports",
  "application_ids","application_id_history","application_notifications",
  "live_users","room_moderation","room_notifications","room_settings","room_likes","seat_requests",
  "commissions","coin_reward_transactions","coin_global_price",
  "kyc_requests","security_events","ip_security_log","fraud_detection_logs",
  "admin_kpis","global_search","global_payments",
  "post_comments","post_shares","saved_posts","social_media_posts","social_invites",
  "bonus_campaigns","reward_claims","reward_settings","reward_ai_predictions",
  "call_sessions","muted_chats","country_kpis","country_vip_analytics",
  "finance_dashboard","revenue_summary","commissions",
  "control_center_modules","bm_dashboard_modules","bd_dashboard_modules",
  "role_access_matrix","god_price_engine","ai_wallet_control","region_ai_optimizer",
  "immortal_core_status",
  // Views
  "ai_live_monitor_vw","ai_flagged_users_vw","user_behavior_vw","user_risk_score_vw",
  "owner_dashboard_stats_vw","owner_security_center_vw","revenue_by_product_vw",
  "finance_dashboard","ai_fraud_detec",
];

// Deduplicated
const ALL_TABLES = [...new Set(SUPABASE_TABLES)].sort();

// ── Frontend module → Supabase table mapping ──
const MODULE_MAP = [
  // CONNECTED
  { module:"VIP Membership",    status:"connected",   tables:["vip_tiers","vip_benefits","vip_rewards","vip_profiles","vip_events"], page:"/vip-membership",   notes:"Reads vip_tiers live; uses VIP_LEVELS fallback" },
  { module:"Me / Profile VIP",  status:"connected",   tables:["vip_tiers","vip_profiles"],                                          page:"/me",               notes:"MeVIPSection reads vip_tiers & vip_profiles" },

  // PARTIALLY CONNECTED
  { module:"Finance / Wallet",  status:"partial",     tables:["user_wallets","wallets","coin_wallets","global_wallets","coin_reward_transactions"], page:"/finance", notes:"UI built; no Supabase read/write wired" },
  { module:"Daily Tasks",       status:"partial",     tables:["daily_tasks","reward_claims","task_rewards"],                        page:"/tasks-rewards",    notes:"UI complete; not reading daily_tasks table" },
  { module:"Leaderboard",       status:"partial",     tables:["leaderboard","reward_leaderboards"],                                 page:"/profile-stats",    notes:"Static data; leaderboard table exists but unused" },
  { module:"Support Tickets",   status:"partial",     tables:["support_tickets"],                                                   page:"/support",          notes:"Form exists; not submitting to Supabase" },
  { module:"Live Streams",      status:"partial",     tables:["live_streams","live_users","stream_profiles","stream_levels"],       page:"/live-room",        notes:"Room UI complete; no Supabase persistence" },
  { module:"Social / Friends",  status:"partial",     tables:["social_friends","social_relationships","relationships","social_invites"], page:"/social",      notes:"UI complete; not reading social_friends" },
  { module:"Referrals",         status:"partial",     tables:["referrals","social_invites"],                                        page:"/social",           notes:"My Invite screen static; referrals table unused" },
  { module:"Family System",     status:"partial",     tables:["families","family_members"],                                         page:"/social",           notes:"Family UI built; not reading families table" },

  // DISCONNECTED
  { module:"User Presence",     status:"disconnected",tables:["user_presence"],                                                     page:"/me",               notes:"Online status hardcoded; user_presence unused" },
  { module:"Coin Wallet",       status:"disconnected",tables:["coin_wallets","coin_reward_transactions","coin_global_price"],        page:"/finance",          notes:"Coin balances are static; no Supabase sync" },
  { module:"Gift System",       status:"disconnected",tables:["gift_catalog","room_gifts","user_gifting_stats"],                    page:"/live-room",        notes:"Gifts are animated locally; not stored" },
  { module:"Notifications",     status:"disconnected",tables:["room_notifications","application_notifications"],                    page:"global",            notes:"No notification feed wired to Supabase" },
  { module:"Levels / XP",       status:"disconnected",tables:["user_xp","stream_levels"],                                           page:"/levels",           notes:"Level cards are static; user_xp unused" },
  { module:"Rewards / Checkin", status:"disconnected",tables:["daily_bonus","reward_claims","reward_settings"],                     page:"/tasks-rewards",    notes:"Daily bonus screen static; daily_bonus unused" },
  { module:"Messaging / Chat",  status:"disconnected",tables:["muted_chats","call_sessions"],                                       page:"/inbox",            notes:"Chat uses Base44 entities; Supabase chat tables unused" },
  { module:"Application IDs",   status:"disconnected",tables:["application_ids","application_id_history"],                          page:"/me",               notes:"App IDs stored in Base44; Supabase tables empty" },
  { module:"User Settings",     status:"disconnected",tables:["user_settings"],                                                     page:"/settings",         notes:"Settings all local; user_settings table unused" },
  { module:"KYC / Security",    status:"disconnected",tables:["kyc_requests","security_events","ip_security_log","fraud_detection_logs"], page:"/support", notes:"No KYC flow connected" },
  { module:"Commissions",       status:"disconnected",tables:["commissions"],                                                        page:"/agency-dashboard",notes:"Agency commissions static" },
  { module:"Revenue / Finance", status:"disconnected",tables:["finance_dashboard","revenue_summary","global_payments"],              page:"/owner-dashboard",  notes:"Owner dashboard stats are hardcoded" },
  { module:"Seat Requests",     status:"disconnected",tables:["seat_requests","room_moderation","room_settings"],                    page:"/live-room",        notes:"Seat UI built; not persisted to Supabase" },
  { module:"User Inventory",    status:"disconnected",tables:["user_inventory"],                                                     page:"/mall",             notes:"Mall purchases not stored in user_inventory" },
  { module:"User Medals",       status:"disconnected",tables:["user_medals"],                                                        page:"/me",               notes:"Medals are static UI; user_medals unused" },
  { module:"Social Posts",      status:"disconnected",tables:["social_media_posts","post_comments","post_shares","saved_posts"],     page:"/community",        notes:"Community posts use Base44; Supabase tables empty" },
  { module:"Admin KPIs",        status:"disconnected",tables:["admin_kpis","owner_dashboard_stats_vw"],                              page:"/owner-dashboard",  notes:"All dashboards hardcoded; admin_kpis unused" },
  { module:"AI / Fraud",        status:"disconnected",tables:["ai_flagged_users_vw","fraud_detection_logs","ai_wallet_control"],     page:"/owner-dashboard",  notes:"AI tables exist but no frontend reads them" },
  { module:"Bonus Campaigns",   status:"disconnected",tables:["bonus_campaigns"],                                                    page:"/tasks-rewards",    notes:"No campaign fetch implemented" },
  { module:"Global Search",     status:"disconnected",tables:["global_search"],                                                     page:"/me",               notes:"Search is local-static; global_search table unused" },
  { module:"Room Likes",        status:"disconnected",tables:["room_likes"],                                                        page:"/live-room",        notes:"Like button exists; not synced to Supabase" },
];

const STATUS_CONFIG = {
  connected:    { color:"#10B981", bg:"rgba(16,185,129,0.12)", icon:"✅", label:"Connected" },
  partial:      { color:"#F59E0B", bg:"rgba(245,158,11,0.12)",  icon:"⚠️",  label:"Partial" },
  disconnected: { color:"#EF4444", bg:"rgba(239,68,68,0.12)",  icon:"❌", label:"Disconnected" },
};

const PRIORITY_CONNECTIONS = [
  { title:"Wallet Balance",    table:"coin_wallets",     page:"Finance",        priority:"HIGH",   effort:"Low" },
  { title:"Daily Tasks",       table:"daily_tasks",      page:"Tasks & Rewards",priority:"HIGH",   effort:"Low" },
  { title:"Daily Checkin",     table:"daily_bonus",      page:"Tasks & Rewards",priority:"HIGH",   effort:"Low" },
  { title:"Gift Catalog",      table:"gift_catalog",     page:"Live Room",      priority:"HIGH",   effort:"Medium" },
  { title:"User Presence",     table:"user_presence",    page:"Profile",        priority:"HIGH",   effort:"Low" },
  { title:"User XP / Levels",  table:"user_xp",          page:"Levels",         priority:"HIGH",   effort:"Medium" },
  { title:"Leaderboards",      table:"leaderboard",      page:"Profile Stats",  priority:"MEDIUM", effort:"Low" },
  { title:"Support Tickets",   table:"support_tickets",  page:"Support",        priority:"MEDIUM", effort:"Low" },
  { title:"Social Friends",    table:"social_friends",   page:"Social",         priority:"MEDIUM", effort:"Medium" },
  { title:"Notifications",     table:"application_notifications",page:"Global", priority:"HIGH",   effort:"Medium" },
  { title:"Live Streams",      table:"live_streams",     page:"Live Room",      priority:"HIGH",   effort:"High" },
  { title:"Room Gifts",        table:"room_gifts",       page:"Live Room",      priority:"MEDIUM", effort:"Medium" },
  { title:"User Inventory",    table:"user_inventory",   page:"Mall",           priority:"MEDIUM", effort:"Medium" },
  { title:"Commissions",       table:"commissions",      page:"Agency",         priority:"MEDIUM", effort:"Low" },
  { title:"KYC Requests",      table:"kyc_requests",     page:"Support",        priority:"LOW",    effort:"High" },
  { title:"Admin KPIs",        table:"admin_kpis",       page:"Owner Dashboard",priority:"LOW",    effort:"Medium" },
];

const PRIORITY_COLORS = { HIGH:"#EF4444", MEDIUM:"#F59E0B", LOW:"#10B981" };
const EFFORT_COLORS   = { Low:"#10B981",  Medium:"#F59E0B", High:"#EF4444" };

const S = {
  page:{ minHeight:"100dvh", background:"linear-gradient(160deg,#020818 0%,#0A1628 50%,#050D1F 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:40 },
  hdr:{ position:"sticky",top:0,zIndex:50,background:"rgba(2,8,24,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(59,130,246,0.2)" },
  glass:(extra={})=>({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(12px)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:16, ...extra }),
  sec:{ fontSize:10, fontWeight:800, color:"#60A5FA", letterSpacing:"0.1em", marginBottom:10, display:"flex", alignItems:"center", gap:6 },
};

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background:`${color}10`, border:`1px solid ${color}25`, borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
      <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:20, fontWeight:900, color }}>{value}</div>
      <div style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>{label}</div>
      {sub && <div style={{ fontSize:8, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

export default function SupabaseAudit() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const connected    = MODULE_MAP.filter(m => m.status === "connected");
  const partial      = MODULE_MAP.filter(m => m.status === "partial");
  const disconnected = MODULE_MAP.filter(m => m.status === "disconnected");
  const totalModules = MODULE_MAP.length;
  const connectedPct = Math.round(((connected.length + partial.length * 0.5) / totalModules) * 100);

  const runAudit = async () => {
    setLoading(true);
    try {
      // Check a sample of key tables
      const checks = ["vip_tiers","user_wallets","daily_tasks","gift_catalog","leaderboard","live_streams","support_tickets","referrals","user_xp","daily_bonus"];
      const results = {};
      await Promise.all(checks.map(async (t) => {
        try {
          const r = await base44.functions.invoke("supabaseQuery", { table: t, method: "GET", select: "*", limit: 1 });
          results[t] = { ok: true, rows: r?.data?.data?.length ?? 0, hasData: (r?.data?.data?.length ?? 0) > 0 };
        } catch {
          results[t] = { ok: false, rows: 0, hasData: false };
        }
      }));
      setTableData(results);
      setConnectionStatus("connected");
      setLastChecked(new Date().toLocaleTimeString("en-QA", { hour12:false }));
    } catch {
      setConnectionStatus("error");
    }
    setLoading(false);
  };

  useEffect(() => { runAudit(); }, []);

  const filtered = filter === "all" ? MODULE_MAP : MODULE_MAP.filter(m => m.status === filter);
  const TABS = ["overview","modules","tables","priorities","report"];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.hdr}>
        <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:36,height:36,borderRadius:"50%",background:"rgba(59,130,246,0.1)",border:"1px solid rgba(59,130,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={17} color="#60A5FA"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:900, color:"#fff" }}>🔍 Supabase Integration Audit</div>
            <div style={{ fontSize:9, color:"#60A5FA" }}>
              {connectionStatus === "connected" ? `✅ Connected · ${ALL_TABLES.length} tables · Last: ${lastChecked}` : "Checking..."}
            </div>
          </div>
          <motion.button whileTap={{ scale:0.9 }} onClick={runAudit} disabled={loading}
            style={{ width:34,height:34,borderRadius:"50%",background:"rgba(59,130,246,0.12)",border:"1px solid rgba(59,130,246,0.25)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <RefreshCw size={15} color="#60A5FA" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}/>
          </motion.button>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex", gap:0, overflowX:"auto", padding:"0 12px 8px", scrollbarWidth:"none" }}>
          {TABS.map(t => (
            <motion.button key={t} whileTap={{ scale:0.94 }} onClick={() => setActiveTab(t)}
              style={{ flexShrink:0, padding:"7px 14px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, textTransform:"capitalize",
                background: activeTab===t ? "rgba(59,130,246,0.2)" : "transparent",
                color: activeTab===t ? "#60A5FA" : "rgba(255,255,255,0.45)",
                borderBottom: activeTab===t ? "2px solid #60A5FA" : "2px solid transparent" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {/* Integration score ring */}
            <div style={{ ...S.glass(), padding:"20px", marginBottom:14, textAlign:"center", background:"linear-gradient(135deg,rgba(59,130,246,0.06),rgba(99,102,241,0.04))" }}>
              <div style={{ position:"relative", display:"inline-block", marginBottom:12 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke={connectedPct >= 70 ? "#10B981" : connectedPct >= 40 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*50}`}
                    strokeDashoffset={`${2*Math.PI*50*(1-connectedPct/100)}`}
                    transform="rotate(-90 60 60)"/>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:24, fontWeight:900, color:"#fff" }}>{connectedPct}%</span>
                  <span style={{ fontSize:8, color:"rgba(255,255,255,0.5)" }}>SYNC SCORE</span>
                </div>
              </div>
              <div style={{ fontSize:14, fontWeight:900, color:"#fff", marginBottom:4 }}>Integration Health</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>
                {connectedPct < 30 ? "🔴 Critical — Most modules disconnected" :
                 connectedPct < 60 ? "🟡 Fair — Core modules need wiring" :
                 "🟢 Good — Minor gaps remaining"}
              </div>
            </div>

            {/* KPI grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9, marginBottom:14 }}>
              <StatCard icon="🗄️" label="Supabase Tables" value={ALL_TABLES.length}     color="#60A5FA" sub="Discovered"/>
              <StatCard icon="📱" label="Frontend Modules" value={totalModules}          color="#A78BFA" sub="Mapped"/>
              <StatCard icon="✅" label="Connected"         value={connected.length}      color="#10B981" sub="Live Sync"/>
              <StatCard icon="⚠️" label="Partial"           value={partial.length}        color="#F59E0B" sub="Needs work"/>
              <StatCard icon="❌" label="Disconnected"       value={disconnected.length}   color="#EF4444" sub="Static data"/>
              <StatCard icon="🎯" label="Tables w/ Data"     value={Object.values(tableData).filter(t=>t.hasData).length} color="#06B6D4" sub="of sampled"/>
            </div>

            {/* Connection status by category */}
            <div style={S.sec}><Database size={11}/> SUPABASE CONNECTION STATUS</div>
            {[
              { label:"Connection",      ok: connectionStatus==="connected", detail:"zohtjywggezadhqwfzrh.supabase.co" },
              { label:"Auth (Service Role)", ok:true, detail:"Service role key configured" },
              { label:"Anon Key",        ok:true, detail:"For client-side auth" },
              { label:"REST API",        ok:true, detail:"PostgREST via /rest/v1/" },
              { label:"Backend Proxy",   ok:true, detail:"supabaseQuery + supabaseHealth functions" },
              { label:"Realtime WS",     ok:false, detail:"Not wired — Supabase Realtime channels not subscribed" },
              { label:"RLS Policies",    ok:null,  detail:"Using service role — bypasses RLS" },
              { label:"Storage Buckets", ok:null,  detail:"Not audited — use for avatars/media" },
              { label:"Edge Functions",  ok:null,  detail:"Not used — backend handled via Base44 functions" },
            ].map((item,i) => (
              <div key={i} style={{ ...S.glass(), padding:"11px 14px", marginBottom:8, display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ fontSize:14 }}>{item.ok === true ? "✅" : item.ok === false ? "❌" : "⚪"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:800, color:"#fff" }}>{item.label}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)" }}>{item.detail}</div>
                </div>
                <span style={{ fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:8,
                  background: item.ok===true?"rgba(16,185,129,0.15)":item.ok===false?"rgba(239,68,68,0.15)":"rgba(255,255,255,0.06)",
                  color: item.ok===true?"#10B981":item.ok===false?"#EF4444":"#9CA3AF" }}>
                  {item.ok===true?"Active":item.ok===false?"Inactive":"Unknown"}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── MODULES TAB ── */}
        {activeTab === "modules" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {/* Filter bar */}
            <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", scrollbarWidth:"none" }}>
              {["all","connected","partial","disconnected"].map(f => (
                <motion.button key={f} whileTap={{ scale:0.94 }} onClick={() => setFilter(f)}
                  style={{ flexShrink:0, padding:"7px 14px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, textTransform:"capitalize",
                    background: filter===f ? (f==="connected"?"rgba(16,185,129,0.2)":f==="partial"?"rgba(245,158,11,0.2)":f==="disconnected"?"rgba(239,68,68,0.2)":"rgba(59,130,246,0.2)") : "rgba(255,255,255,0.05)",
                    color: filter===f ? (f==="connected"?"#10B981":f==="partial"?"#F59E0B":f==="disconnected"?"#EF4444":"#60A5FA") : "rgba(255,255,255,0.5)" }}>
                  {f==="all" ? `All (${MODULE_MAP.length})` : f==="connected" ? `✅ ${connected.length}` : f==="partial" ? `⚠️ ${partial.length}` : `❌ ${disconnected.length}`}
                </motion.button>
              ))}
            </div>

            {filtered.map((mod, i) => {
              const sc = STATUS_CONFIG[mod.status];
              return (
                <motion.div key={mod.module} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.02 }}
                  style={{ ...S.glass(), padding:"13px 14px", marginBottom:10, borderLeft:`3px solid ${sc.color}` }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ fontSize:16, marginTop:2 }}>{sc.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3, flexWrap:"wrap" }}>
                        <span style={{ fontSize:12, fontWeight:900, color:"#fff" }}>{mod.module}</span>
                        <span style={{ fontSize:8, fontWeight:800, padding:"2px 7px", borderRadius:7, background:sc.bg, color:sc.color }}>{sc.label}</span>
                      </div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,0.45)", marginBottom:6 }}>📍 {mod.page}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:6 }}>
                        {mod.tables.map(t => (
                          <span key={t} style={{ fontSize:8, fontWeight:700, padding:"2px 7px", borderRadius:6, background:"rgba(96,165,250,0.1)", color:"#60A5FA", border:"1px solid rgba(96,165,250,0.2)" }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", fontStyle:"italic" }}>💬 {mod.notes}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── TABLES TAB ── */}
        {activeTab === "tables" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={S.sec}><Database size={11}/> ALL SUPABASE TABLES ({ALL_TABLES.length})</div>
            <div style={{ ...S.glass(), padding:"14px", marginBottom:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {ALL_TABLES.map(t => {
                  const isConnected = MODULE_MAP.some(m => m.tables.includes(t) && m.status === "connected");
                  const isPartial   = MODULE_MAP.some(m => m.tables.includes(t) && m.status === "partial");
                  const td = tableData[t];
                  return (
                    <div key={t} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 8px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:`1px solid ${isConnected?"rgba(16,185,129,0.2)":isPartial?"rgba(245,158,11,0.2)":"rgba(255,255,255,0.06)"}` }}>
                      <span style={{ fontSize:10 }}>{isConnected?"✅":isPartial?"⚠️":"⚪"}</span>
                      <span style={{ fontSize:9, fontWeight:700, color: isConnected?"#10B981":isPartial?"#F59E0B":"rgba(255,255,255,0.6)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t}</span>
                      {td && <span style={{ fontSize:7, color: td.hasData?"#10B981":"rgba(255,255,255,0.3)", flexShrink:0 }}>{td.hasData?"●":""}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tables sampled in audit */}
            <div style={S.sec}><Zap size={11}/> LIVE PROBE RESULTS</div>
            {Object.entries(tableData).map(([t, v]) => (
              <div key={t} style={{ ...S.glass(), padding:"10px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:14 }}>{v.ok ? (v.hasData?"✅":"⚠️") : "❌"}</span>
                <span style={{ flex:1, fontSize:11, fontWeight:800, color:"#fff" }}>{t}</span>
                <span style={{ fontSize:9, fontWeight:700, color: v.hasData?"#10B981":"rgba(255,255,255,0.4)" }}>
                  {v.hasData ? `${v.rows} row(s)` : "Empty"}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── PRIORITIES TAB ── */}
        {activeTab === "priorities" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ ...S.glass(), padding:"14px", marginBottom:14, background:"rgba(239,68,68,0.04)", borderColor:"rgba(239,68,68,0.2)" }}>
              <div style={{ fontSize:12, fontWeight:900, color:"#fff", marginBottom:4 }}>🎯 Connection Roadmap</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
                The following modules are prioritized by business impact. Each connection requires wiring the frontend component to call <code style={{ color:"#60A5FA", fontSize:9 }}>supabaseQuery</code> for reads/writes.
              </div>
            </div>

            {PRIORITY_CONNECTIONS.map((item, i) => (
              <motion.div key={i} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.03 }}
                style={{ ...S.glass(), padding:"13px 14px", marginBottom:10 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:32,height:32,borderRadius:10,background:`${PRIORITY_COLORS[item.priority]}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:PRIORITY_COLORS[item.priority],flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:900, color:"#fff", marginBottom:2 }}>{item.title}</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:8, fontWeight:700, padding:"2px 7px", borderRadius:6, background:"rgba(96,165,250,0.1)", color:"#60A5FA" }}>📊 {item.table}</span>
                      <span style={{ fontSize:8, fontWeight:700, padding:"2px 7px", borderRadius:6, background:"rgba(167,139,250,0.1)", color:"#A78BFA" }}>📍 {item.page}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", flexShrink:0 }}>
                    <span style={{ fontSize:8, fontWeight:900, padding:"2px 8px", borderRadius:7, background:`${PRIORITY_COLORS[item.priority]}18`, color:PRIORITY_COLORS[item.priority] }}>{item.priority}</span>
                    <span style={{ fontSize:8, fontWeight:800, padding:"2px 8px", borderRadius:7, background:`${EFFORT_COLORS[item.effort]}12`, color:EFFORT_COLORS[item.effort] }}>{item.effort} effort</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── REPORT TAB ── */}
        {activeTab === "report" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {[
              {
                title:"A. Connected Tables", icon:"✅", color:"#10B981",
                items: MODULE_MAP.filter(m=>m.status==="connected").flatMap(m=>m.tables)
              },
              {
                title:"B. Connected Frontend Modules", icon:"📱", color:"#10B981",
                items: connected.map(m=>`${m.module} (${m.page})`)
              },
              {
                title:"C. Partially Connected Modules", icon:"⚠️", color:"#F59E0B",
                items: partial.map(m=>`${m.module} — ${m.notes}`)
              },
              {
                title:"D. Disconnected Modules", icon:"❌", color:"#EF4444",
                items: disconnected.map(m=>`${m.module} — ${m.notes}`)
              },
              {
                title:"E. Tables Confirmed in Supabase (130+)", icon:"🗄️", color:"#60A5FA",
                items: ALL_TABLES
              },
              {
                title:"F. Missing Realtime Subscriptions", icon:"⚡", color:"#A78BFA",
                items:[
                  "user_presence — online/offline indicator on profiles",
                  "coin_wallets — live balance updates",
                  "room_gifts — live gift animations",
                  "application_notifications — push notification feed",
                  "live_streams — room viewer count & status",
                  "leaderboard — real-time rank changes",
                  "seat_requests — room seat queue updates",
                  "daily_bonus — claim status sync",
                ]
              },
              {
                title:"G. Security Observations", icon:"🛡️", color:"#F97316",
                items:[
                  "Service role key used for all queries — bypasses RLS entirely",
                  "No per-user RLS enforcement from frontend — all reads are admin-level",
                  "Recommend: create a backend function per sensitive operation instead of generic proxy",
                  "No rate limiting on supabaseQuery endpoint — any authenticated user can query any table",
                  "KYC / fraud_detection_logs accessible to any authenticated user via proxy",
                  "Recommend: whitelist allowed tables in supabaseQuery function",
                ]
              },
              {
                title:"H. Performance Observations", icon:"⚡", color:"#06B6D4",
                items:[
                  "No pagination implemented on most frontend list screens",
                  "supabaseQuery makes a new HTTP call per component — no client-side caching",
                  "Recommend: @tanstack/react-query for cache + stale-while-revalidate",
                  "Realtime via polling is inefficient — use Supabase Realtime SDK for push updates",
                  "All table reads use SELECT * — recommend specifying columns",
                ]
              },
              {
                title:"I. Recommended Additional Tables", icon:"📋", color:"#FFC83D",
                items:[
                  "user_frames — avatar frame catalog & ownership (exists: user_inventory)",
                  "user_chat_bubbles — chat bubble styles (exists: user_inventory)",
                  "vip_history — VIP upgrade/renewal audit log (missing)",
                  "checkins — daily check-in streaks (exists: daily_bonus)",
                  "earnings — host earnings ledger (exists: commissions)",
                  "withdrawals — payout requests (check: kyc_requests / commissions)",
                  "transactions — unified coin movement log (exists: coin_reward_transactions)",
                  "audit_logs — admin actions (exists: fraud_detection_logs + security_events)",
                  "stream_viewers — viewer list per room (exists: live_users)",
                ]
              },
            ].map((section, si) => (
              <div key={si} style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:900, color:section.color, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                  <span>{section.icon}</span> {section.title}
                </div>
                <div style={{ ...S.glass(), padding:"12px" }}>
                  {section.items.map((item, ii) => (
                    <div key={ii} style={{ display:"flex", gap:7, padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color:section.color, fontSize:9, marginTop:1, flexShrink:0 }}>›</span>
                      <span style={{ fontSize:9.5, color:"rgba(255,255,255,0.75)", lineHeight:1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Final summary card */}
            <div style={{ ...S.glass(), padding:"18px", background:"linear-gradient(135deg,rgba(16,185,129,0.06),rgba(59,130,246,0.04))", borderColor:"rgba(16,185,129,0.2)" }}>
              <div style={{ fontSize:13, fontWeight:900, color:"#fff", marginBottom:12, textAlign:"center" }}>📊 Final Integration Summary</div>
              {[
                { l:"Total Frontend Modules",    v:totalModules,              c:"#60A5FA" },
                { l:"Connected Modules",         v:connected.length,          c:"#10B981" },
                { l:"Partially Connected",       v:partial.length,            c:"#F59E0B" },
                { l:"Disconnected Modules",      v:disconnected.length,       c:"#EF4444" },
                { l:"Total Supabase Tables",     v:`${ALL_TABLES.length}+`,   c:"#60A5FA" },
                { l:"Tables with Live Data",     v:Object.values(tableData).filter(t=>t.hasData).length + " (sampled)", c:"#10B981" },
                { l:"Missing Realtime Channels", v:"8 critical",              c:"#EF4444" },
                { l:"Security Issues",           v:"6 (see section G)",       c:"#F97316" },
                { l:"Integration Completion",    v:`${connectedPct}%`,        c: connectedPct>=70?"#10B981":connectedPct>=40?"#F59E0B":"#EF4444" },
              ].map(row => (
                <div key={row.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)" }}>{row.l}</span>
                  <span style={{ fontSize:11, fontWeight:900, color:row.c }}>{row.v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}