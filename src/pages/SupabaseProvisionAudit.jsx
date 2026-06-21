/**
 * SupabaseProvisionAudit — FK Chain Restoration Dashboard
 * Shows provision status, surfaces SQL to run in Supabase, validates all tables.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Copy, CheckCircle, AlertCircle, Clock, Play } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FK_CHAIN = [
  { id: "auth_users",     label: "auth.users",      desc: "Supabase Auth root — FK parent for all", level: 1 },
  { id: "public_users",   label: "public.users",     desc: "FK → auth.users",                        level: 2 },
  { id: "profiles",       label: "public.profiles",  desc: "FK → users / auth.users",                level: 3 },
  { id: "coin_wallets",   label: "coin_wallets",     desc: "FK → users",                             level: 4 },
  { id: "user_xp",        label: "user_xp",          desc: "FK → profiles",                          level: 4 },
  { id: "vip_profiles",   label: "vip_profiles",     desc: "FK → users / profiles",                  level: 4 },
  { id: "user_wallets",   label: "user_wallets",     desc: "No FK — always writable",                level: 5 },
  { id: "user_presence",  label: "user_presence",    desc: "No FK — always writable",                level: 5 },
];

export default function SupabaseProvisionAudit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [copied,  setCopied]  = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyData, setVerifyData] = useState(null);

  const runProvision = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke("supabaseProvision", {
        display_name: "VYRO Test User",
        country_code: "QAT",
        application_id: "974000000001",
      });
      setResult(res.data);
    } catch (e) {
      setResult({ status: "error", summary: { message: e.message } });
    } finally {
      setLoading(false);
    }
  };

  const copySQL = () => {
    if (result?.provision_sql) {
      navigator.clipboard.writeText(result.provision_sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const runVerify = async () => {
    setVerifyLoading(true);
    setVerifyData(null);
    const tables = ["user_wallets", "user_presence", "coin_wallets", "user_xp", "vip_profiles"];
    const checks = {};
    await Promise.all(tables.map(async (t) => {
      try {
        const r = await base44.functions.invoke("supabaseQuery", { table: t, method: "GET", limit: 3 });
        checks[t] = { ok: true, count: r.data?.data?.length ?? 0 };
      } catch (e) {
        checks[t] = { ok: false, error: e.message };
      }
    }));
    setVerifyData(checks);
    setVerifyLoading(false);
  };

  const statusColor = (s) => ({
    success: "#10B981", partial: "#F59E0B", rpc_missing: "#F97316",
    failed: "#EF4444", error: "#EF4444",
  }[s] || "#9CA3AF");

  const statusIcon = (s) => ({
    success: "✅", partial: "⚠️", rpc_missing: "🔧", failed: "❌", error: "❌",
  }[s] || "⏳");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg,#0A0A14 0%,#0D1A2B 60%,#0A0A14 100%)",
      fontFamily: "'Inter',system-ui,sans-serif",
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(99,102,241,0.25)",
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={18} color="#818CF8" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>🔗 FK Chain Restoration</div>
          <div style={{ fontSize: 10, color: "#818CF8" }}>Supabase Full Lifecycle Provisioning</div>
        </div>
      </div>

      <div style={{ padding: "16px" }}>

        {/* FK Chain Diagram */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 18, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#818CF8", letterSpacing: "0.07em", marginBottom: 12 }}>FK DEPENDENCY CHAIN</div>
          {FK_CHAIN.map((node, i) => (
            <div key={node.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: (node.level - 1) * 16, flexShrink: 0 }} />
              {node.level > 1 && <div style={{ fontSize: 10, color: "#4B5563" }}>└─</div>}
              <div style={{ flex: 1, background: node.level >= 4 && node.id !== "coin_wallets" && node.id !== "user_wallets" && node.id !== "user_presence" ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.06)", border: `1px solid ${node.level >= 4 && node.id !== "user_wallets" && node.id !== "user_presence" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`, borderRadius: 10, padding: "7px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#e2e8f0" }}>{node.label}</span>
                <span style={{ fontSize: 9, color: "#6B7280" }}>{node.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <motion.button whileTap={{ scale: 0.96 }} onClick={runProvision} disabled={loading}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", fontWeight: 900, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#6366F1,#4F46E5)", boxShadow: "0 6px 20px rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : <Play size={15} />}
            {loading ? "Provisioning..." : "Run Full Provision"}
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={runVerify} disabled={verifyLoading}
            style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, color: "#818CF8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
            {verifyLoading ? "..." : "🔍 Verify Tables"}
          </motion.button>
        </div>

        {/* Result Panel */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${statusColor(result.status)}40`, borderRadius: 18, padding: 16, marginBottom: 16 }}>
            {/* Status header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 28 }}>{statusIcon(result.status)}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: statusColor(result.status) }}>
                  {result.status?.toUpperCase().replace("_", " ")}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{result.summary?.message}</div>
              </div>
            </div>

            {/* UUID mapping */}
            {result.supabase_uuid && (
              <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#818CF8", marginBottom: 4 }}>UUID BRIDGE</div>
                <div style={{ fontSize: 9, color: "#e2e8f0", fontFamily: "monospace" }}>Base44: {result.base44_id}</div>
                <div style={{ fontSize: 9, color: "#10B981", fontFamily: "monospace" }}>Supabase: {result.supabase_uuid}</div>
              </div>
            )}

            {/* Results grid */}
            {result.results && Object.keys(result.results).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#10B981", letterSpacing: "0.06em", marginBottom: 8 }}>✅ SUCCEEDED</div>
                {Object.entries(result.results).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "monospace" }}>{k}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>
                      {typeof v === "object" ? JSON.stringify(v) : v}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Errors */}
            {result.errors && Object.keys(result.errors).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#EF4444", letterSpacing: "0.06em", marginBottom: 8 }}>❌ FAILED</div>
                {Object.entries(result.errors).map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(239,68,68,0.06)", borderRadius: 8, padding: "8px 10px", marginBottom: 6, border: "1px solid rgba(239,68,68,0.15)" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#FCA5A5", fontFamily: "monospace" }}>{k}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{v.error}</div>
                    {v.code && <div style={{ fontSize: 9, color: "#6B7280" }}>code: {v.code}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* SQL Block */}
            {result.provision_sql && (
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#F97316", letterSpacing: "0.06em", marginBottom: 8 }}>
                  🔧 REQUIRED SQL — Run in Supabase Dashboard → SQL Editor
                </div>
                <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "12px", border: "1px solid rgba(249,115,22,0.3)", maxHeight: 240, overflowY: "auto" }}>
                  <pre style={{ fontSize: 8.5, color: "#FCD34D", fontFamily: "monospace", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {result.provision_sql}
                  </pre>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={copySQL}
                  style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, background: copied ? "rgba(16,185,129,0.15)" : "rgba(249,115,22,0.15)", color: copied ? "#10B981" : "#F97316", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(249,115,22,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy SQL to Clipboard"}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Verify Results */}
        {verifyData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 18, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#818CF8", letterSpacing: "0.07em", marginBottom: 12 }}>📊 TABLE VERIFICATION</div>
            {Object.entries(verifyData).map(([table, r]) => (
              <div key={table} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", fontFamily: "monospace" }}>{table}</div>
                  {!r.ok && <div style={{ fontSize: 9, color: "#EF4444" }}>{r.error}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {r.ok ? <CheckCircle size={14} color="#10B981" /> : <AlertCircle size={14} color="#EF4444" />}
                  <span style={{ fontSize: 11, fontWeight: 800, color: r.ok ? "#10B981" : "#EF4444" }}>
                    {r.ok ? `${r.count} rows` : "Error"}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Instructions card */}
        <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 18, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#818CF8", letterSpacing: "0.07em", marginBottom: 10 }}>📋 HOW IT WORKS</div>
          {[
            "1. Click 'Run Full Provision' — calls supabaseProvision function",
            "2. If status = 'rpc_missing': copy the SQL and paste into Supabase Dashboard → SQL Editor → Run",
            "3. Run provision again — the RPC now exists and writes the full FK chain atomically",
            "4. Click 'Verify Tables' to confirm all rows exist",
            "5. Every new user signup auto-calls this via Register.jsx",
          ].map((s, i) => (
            <div key={i} style={{ fontSize: 10, color: "#9CA3AF", padding: "4px 0", lineHeight: 1.5 }}>{s}</div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}