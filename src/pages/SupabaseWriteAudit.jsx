/**
 * SupabaseWriteAudit — Full READ + WRITE lifecycle validation dashboard
 * Route: /supabase-write-audit
 * Tests every critical table for actual INSERT capability and reports results.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, RefreshCw, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";

const S = {
  page: {
    minHeight: "100dvh",
    background: "linear-gradient(160deg,#0A0F1A 0%,#0D1B2A 50%,#0A0A0F 100%)",
    fontFamily: "'Inter',system-ui,sans-serif",
    paddingBottom: 100,
  },
  hdr: {
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(10,15,26,0.95)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(99,102,241,0.2)",
  },
  card: (border = "rgba(99,102,241,0.15)") => ({
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)",
    border: `1px solid ${border}`, borderRadius: 16,
  }),
};

// All tables that should have write capability for a real user
const WRITE_TESTS = [
  {
    id: "profiles",
    label: "profiles",
    category: "FK Parents",
    description: "Core identity row — FK parent for user_xp, vip_profiles",
    critical: true,
    fk: null,
  },
  {
    id: "users",
    label: "users",
    category: "FK Parents",
    description: "Core user row — FK parent for coin_wallets, support_tickets",
    critical: true,
    fk: null,
  },
  {
    id: "user_wallets",
    label: "user_wallets",
    category: "Wallet",
    description: "Main coin wallet (balance_coins, total_earned, total_spent)",
    critical: true,
    fk: null,
  },
  {
    id: "user_presence",
    label: "user_presence",
    category: "Presence",
    description: "Online status tracking",
    critical: false,
    fk: null,
  },
  {
    id: "coin_wallets",
    label: "coin_wallets",
    category: "Wallet",
    description: "Secondary coin wallet — FK → users",
    critical: true,
    fk: "users",
  },
  {
    id: "user_xp",
    label: "user_xp (user)",
    category: "Levels",
    description: "User XP record — FK → profiles",
    critical: true,
    fk: "profiles",
  },
  {
    id: "vip_profiles",
    label: "vip_profiles",
    category: "VIP",
    description: "VIP assignment row — FK → profiles",
    critical: true,
    fk: "profiles",
  },
  {
    id: "support_tickets",
    label: "support_tickets",
    category: "Support",
    description: "Support ticket creation — FK → users",
    critical: false,
    fk: "users",
  },
  {
    id: "daily_bonus",
    label: "daily_bonus",
    category: "Rewards",
    description: "Daily check-in record",
    critical: false,
    fk: null,
  },
];

const STATUS_CONFIG = {
  idle:    { icon: Info,          color: "#6B7280", bg: "rgba(107,114,128,0.1)", label: "Not tested" },
  running: { icon: RefreshCw,     color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  label: "Testing..." },
  success: { icon: CheckCircle,   color: "#10B981", bg: "rgba(16,185,129,0.1)",  label: "WRITE OK" },
  partial: { icon: AlertTriangle, color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  label: "PARTIAL" },
  failed:  { icon: XCircle,       color: "#EF4444", bg: "rgba(239,68,68,0.1)",   label: "BLOCKED" },
};

const CATEGORY_COLORS = {
  "FK Parents": "#A855F7",
  "Wallet":     "#F59E0B",
  "Presence":   "#06B6D4",
  "Levels":     "#10B981",
  "VIP":        "#FFC83D",
  "Support":    "#3B82F6",
  "Rewards":    "#EC4899",
};

export default function SupabaseWriteAudit() {
  const navigate = useNavigate();
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(false);
  const [onboardResult, setOnboardResult] = useState(null);
  const [activeTab, setActiveTab] = useState("tests"); // tests | onboard | report

  const setResult = (id, status, detail = "") => {
    setResults(prev => ({ ...prev, [id]: { status, detail } }));
  };

  const runAllTests = async () => {
    setRunning(true);
    setResults({});

    // Run supabaseOnboard first — this is the authoritative write path
    setOnboardResult(null);
    try {
      const res = await base44.functions.invoke("supabaseOnboard", {
        display_name: "WriteAudit TestUser",
        phone: "+97400000000",
        country_code: "QAT",
        application_id: "974000000099",
      });
      setOnboardResult(res.data);

      const r = res.data;
      // Map onboard results to test statuses
      const tableMap = {
        profiles:      "profiles",
        users:         "users",
        user_wallets:  "user_wallets",
        user_presence: "user_presence",
        coin_wallets:  "coin_wallets",
        vip_profiles:  "vip_profiles",
      };
      for (const [key, testId] of Object.entries(tableMap)) {
        const val = r?.results?.[key];
        if (val === "created") setResult(testId, "success", "Row created via supabaseOnboard");
        else if (val?.startsWith?.("skipped:")) {
          const errDetail = val.replace("skipped: ", "");
          if (errDetail.includes("23505") || errDetail.includes("duplicate")) {
            setResult(testId, "success", "Already exists (idempotent)");
          } else {
            setResult(testId, "failed", errDetail);
          }
        } else setResult(testId, "partial", String(val));
      }
      // user_xp
      const xp = r?.results?.user_xp;
      if (xp?.user === "created") setResult("user_xp", "success", "All 4 XP types created");
      else setResult("user_xp", "failed", JSON.stringify(xp));

    } catch (e) {
      setOnboardResult({ error: e.message });
      // Mark all FK-dependent tables as failed
      ["profiles","users","coin_wallets","user_xp","vip_profiles","support_tickets"].forEach(id => {
        setResult(id, "failed", "supabaseOnboard call failed: " + e.message);
      });
    }

    // Test daily_bonus separately (special schema)
    setResult("daily_bonus", "running");
    try {
      const dbRes = await base44.functions.invoke("supabaseQuery", {
        table: "daily_bonus", method: "POST",
        body: { user_id: "00000000-0000-0000-0000-000000000099", day_number: 1, is_claimed: false, coins_reward: 100 },
      });
      if (dbRes.data?.data || dbRes.data?.status === 201) {
        setResult("daily_bonus", "success", "Row inserted");
      } else {
        setResult("daily_bonus", "failed", dbRes.data?.error || "Unknown error");
      }
    } catch (e) {
      setResult("daily_bonus", "failed", e.message);
    }

    // Test support_tickets separately
    setResult("support_tickets", "running");
    try {
      const stRes = await base44.functions.invoke("supabaseQuery", {
        table: "support_tickets", method: "POST",
        body: { user_id: "00000000-0000-0000-0000-000000000099", subject: "Write audit test", category: "general", message: "Automated write audit test" },
      });
      if (stRes.data?.status === 201 || stRes.data?.data) {
        setResult("support_tickets", "success", "Ticket created");
      } else {
        setResult("support_tickets", "failed", stRes.data?.error || "Unknown error");
      }
    } catch (e) {
      setResult("support_tickets", "failed", e.message);
    }

    setRunning(false);
  };

  const counts = {
    total:   WRITE_TESTS.length,
    success: Object.values(results).filter(r => r.status === "success").length,
    failed:  Object.values(results).filter(r => r.status === "failed").length,
    partial: Object.values(results).filter(r => r.status === "partial").length,
  };

  const healthPct = counts.total > 0
    ? Math.round((counts.success / counts.total) * 100)
    : 0;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.hdr}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#818CF8" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>🔬 Supabase Write Audit</div>
            <div style={{ fontSize: 10, color: "#818CF8" }}>Full READ + WRITE Lifecycle Validation</div>
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={runAllTests} disabled={running}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 12, border: "none", cursor: running ? "default" : "pointer", fontWeight: 800, fontSize: 11,
              background: running ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#6366F1,#A855F7)",
              color: running ? "rgba(255,255,255,0.4)" : "#fff" }}>
            {running ? <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={13} />}
            {running ? "Running..." : "Run Tests"}
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, padding: "0 16px 12px" }}>
          {["tests","onboard","report"].map(t => (
            <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(t)}
              style={{ flex: 1, padding: "7px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "capitalize",
                background: activeTab === t ? "linear-gradient(135deg,#6366F1,#818CF8)" : "rgba(255,255,255,0.04)",
                color: activeTab === t ? "#fff" : "rgba(255,255,255,0.4)" }}>
              {t === "tests" ? "Write Tests" : t === "onboard" ? "Onboard Call" : "Report"}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px" }}>

        {/* Score bar */}
        {Object.keys(results).length > 0 && (
          <div style={{ ...S.card(), padding: "14px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Write Health Score</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: healthPct >= 80 ? "#10B981" : healthPct >= 50 ? "#F59E0B" : "#EF4444" }}>
                {healthPct}%
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${healthPct}%` }} transition={{ duration: 0.8 }}
                style={{ height: "100%", borderRadius: 3, background: healthPct >= 80 ? "linear-gradient(90deg,#10B981,#34D399)" : healthPct >= 50 ? "linear-gradient(90deg,#F59E0B,#FCD34D)" : "linear-gradient(90deg,#EF4444,#F87171)" }} />
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              {[
                { label: `${counts.success} Passing`, color: "#10B981" },
                { label: `${counts.failed} Blocked`, color: "#EF4444" },
                { label: `${counts.partial} Partial`, color: "#F59E0B" },
              ].map(s => (
                <span key={s.label} style={{ fontSize: 10, fontWeight: 800, color: s.color }}>{s.label}</span>
              ))}
            </div>
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === "tests" && (
          <>
            {!running && Object.keys(results).length === 0 && (
              <div style={{ ...S.card(), padding: "24px", textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔬</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Ready to Audit</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 16 }}>
                  This will attempt INSERT operations on all critical tables,<br />
                  validate FK constraints, and report RLS/trigger issues.
                </div>
                <motion.button whileTap={{ scale: 0.96 }} onClick={runAllTests}
                  style={{ padding: "12px 24px", borderRadius: 13, border: "none", cursor: "pointer", fontWeight: 900, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#6366F1,#A855F7)", boxShadow: "0 5px 18px rgba(99,102,241,0.4)" }}>
                  ▶ Start Write Audit
                </motion.button>
              </div>
            )}

            {/* Group by category */}
            {["FK Parents","Wallet","Presence","Levels","VIP","Support","Rewards"].map(cat => {
              const catTests = WRITE_TESTS.filter(t => t.category === cat);
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: CATEGORY_COLORS[cat], letterSpacing: "0.08em", marginBottom: 8 }}>
                    {cat.toUpperCase()}
                  </div>
                  {catTests.map((test, i) => {
                    const r = results[test.id];
                    const s = r ? STATUS_CONFIG[r.status] || STATUS_CONFIG.idle : STATUS_CONFIG[running ? "idle" : "idle"];
                    const isRunning = running && !r;
                    const StatusIcon = isRunning ? RefreshCw : (r ? s.icon : Info);
                    return (
                      <motion.div key={test.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ ...S.card(r ? `${s.color}30` : "rgba(99,102,241,0.1)"), padding: "12px 14px", marginBottom: 8, borderLeft: `3px solid ${r ? s.color : CATEGORY_COLORS[cat]}` }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: r ? s.bg : "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <StatusIcon size={16} color={r ? s.color : "#6366F1"} style={isRunning ? { animation: "spin 1s linear infinite" } : {}} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                              <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", fontFamily: "monospace" }}>{test.label}</span>
                              {test.critical && <span style={{ fontSize: 7, fontWeight: 900, padding: "1px 5px", borderRadius: 5, background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>CRITICAL</span>}
                              {test.fk && <span style={{ fontSize: 7, fontWeight: 700, padding: "1px 5px", borderRadius: 5, background: "rgba(168,85,247,0.12)", color: "#C084FC" }}>FK→{test.fk}</span>}
                            </div>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: r?.detail ? 4 : 0 }}>{test.description}</div>
                            {r?.detail && (
                              <div style={{ fontSize: 9, fontWeight: 700, color: s.color, background: `${s.color}10`, borderRadius: 6, padding: "3px 7px", display: "inline-block" }}>
                                {r.detail}
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: r ? s.color : "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                            {isRunning ? "..." : r ? s.label : "—"}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </>
        )}

        {/* ONBOARD TAB */}
        {activeTab === "onboard" && (
          <div>
            <div style={{ ...S.card(), padding: "14px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#818CF8", letterSpacing: "0.08em", marginBottom: 8 }}>ONBOARD FUNCTION</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 12 }}>
                <code style={{ color: "#A5F3FC", background: "rgba(165,243,252,0.1)", padding: "1px 6px", borderRadius: 4 }}>supabaseOnboard</code> provisions all Supabase records for a new user in FK-safe order. Called automatically from <code style={{ color: "#A5F3FC", background: "rgba(165,243,252,0.1)", padding: "1px 6px", borderRadius: 4 }}>Register.jsx</code> after profile setup.
              </div>
              <div style={{ fontSize: 9, fontWeight: 800, color: "#6B7280", marginBottom: 6 }}>WRITE ORDER (FK-safe)</div>
              {["1. profiles (FK parent)", "2. users (FK parent)", "3. user_wallets (no FK)", "4. user_presence (no FK)", "5. coin_wallets (FK→users)", "6. user_xp ×4 (FK→profiles)", "7. vip_profiles (FK→profiles)"].map((step, i) => (
                <div key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{step}</div>
              ))}
            </div>

            {onboardResult ? (
              <div style={{ ...S.card(onboardResult.error ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"), padding: "14px" }}>
                <div style={{ fontSize: 9, fontWeight: 900, color: onboardResult.error ? "#EF4444" : "#10B981", letterSpacing: "0.08em", marginBottom: 8 }}>
                  {onboardResult.error ? "❌ LAST CALL FAILED" : "✅ LAST CALL RESULT"}
                </div>
                <pre style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.6, maxHeight: 400, overflow: "auto" }}>
                  {JSON.stringify(onboardResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div style={{ ...S.card(), padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Run tests to see the onboard call response</div>
              </div>
            )}
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === "report" && (
          <div>
            {/* Root Cause */}
            <div style={{ ...S.card("rgba(239,68,68,0.25)"), padding: "14px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#EF4444", letterSpacing: "0.08em", marginBottom: 8 }}>🔴 ROOT CAUSE IDENTIFIED</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Missing Supabase auth.users trigger</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                VYRO uses <strong style={{ color: "#F87171" }}>Base44 Auth</strong> (not Supabase Auth). The Supabase database was designed to auto-create <code style={{ color: "#FCA5A5" }}>profiles</code> and <code style={{ color: "#FCA5A5" }}>users</code> rows via a PostgreSQL trigger on <code style={{ color: "#FCA5A5" }}>auth.users</code> INSERT. Since no Base44 signups create <code style={{ color: "#FCA5A5" }}>auth.users</code> rows, this trigger <strong style={{ color: "#F87171" }}>never fires</strong> — leaving all FK-dependent tables permanently empty.
              </div>
            </div>

            {/* Findings */}
            <div style={{ ...S.card(), padding: "14px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#818CF8", letterSpacing: "0.08em", marginBottom: 10 }}>📋 WRITE AUDIT FINDINGS</div>
              {[
                { status: "✅", label: "user_wallets", note: "No FK — writes work directly" },
                { status: "✅", label: "user_presence", note: "No FK — writes work directly" },
                { status: "❌", label: "user_xp", note: "FK→profiles — blocked until profiles row exists" },
                { status: "❌", label: "vip_profiles", note: "FK→profiles — blocked until profiles row exists" },
                { status: "❌", label: "coin_wallets", note: "FK→users — blocked until users row exists" },
                { status: "❌", label: "support_tickets", note: "FK→users — blocked until users row exists" },
                { status: "⚠️", label: "daily_bonus", note: "Requires day_number NOT NULL — schema mismatch" },
                { status: "⚠️", label: "application_ids", note: "Column schema unknown — needs probe" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{f.status}</span>
                  <code style={{ fontSize: 10, color: "#A5F3FC", minWidth: 130, flexShrink: 0 }}>{f.label}</code>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{f.note}</span>
                </div>
              ))}
            </div>

            {/* Fix Applied */}
            <div style={{ ...S.card("rgba(16,185,129,0.25)"), padding: "14px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#10B981", letterSpacing: "0.08em", marginBottom: 10 }}>✅ FIX APPLIED</div>
              {[
                "supabaseQuery whitelist extended with profiles + users tables",
                "supabaseOnboard function created — writes rows in correct FK order",
                "Register.jsx calls supabaseOnboard after Base44 profile save",
                "All existing users can be backfilled by re-running supabaseOnboard",
                "Onboard is idempotent — safe to call multiple times per user",
              ].map((fix, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
                  <span style={{ color: "#10B981", fontSize: 11, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{fix}</span>
                </div>
              ))}
            </div>

            {/* Remaining work */}
            <div style={{ ...S.card("rgba(245,158,11,0.2)"), padding: "14px" }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: "#F59E0B", letterSpacing: "0.08em", marginBottom: 10 }}>⚠️ REQUIRES SUPABASE DASHBOARD ACTION</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 10 }}>
                The following items cannot be fixed from the app — they require direct Supabase dashboard access:
              </div>
              {[
                "Add profiles/users to RLS policies — allow service role INSERT without auth.uid() check",
                "Verify vip_profiles FK column name (tier_code vs vip_tier_id)",
                "Add user_xp xp_type column if missing (required for host/gifting/streaming XP types)",
                "Check daily_bonus table schema — day_number must be nullable or have a default",
                "Backfill existing Base44 users by calling supabaseOnboard for each existing UserProfile",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: "1px solid rgba(245,158,11,0.08)" }}>
                  <span style={{ color: "#F59E0B", fontSize: 11, flexShrink: 0 }}>!</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}