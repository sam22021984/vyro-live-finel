import { motion } from "framer-motion";

const TRUST = 94;
const COMPLETION = 88;

const TRUST_STATS = [
  { icon: "✅", label: "Verified",        value: "Yes",  color: "#10B981" },
  { icon: "🛡️", label: "Account Safety",  value: "Safe", color: "#3B82F6" },
  { icon: "🌟", label: "Community Rep.",  value: "High", color: "#F59E0B" },
  { icon: "📈", label: "Positive Activity",value: "98%", color: "#7C3AED" },
];

export default function MeExtras() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(16,185,129,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>🛡️ Trust & Reputation</span>
        <div style={{ display: "flex", gap: 3 }}>
          {[1,2,3,4,5].map(n => (
            <span key={n} style={{ fontSize: 13, color: n <= 4 ? "#F59E0B" : "#D1D5DB" }}>★</span>
          ))}
          <span style={{ fontSize: 11, fontWeight: 900, color: "#F59E0B", marginLeft: 3 }}>4.8</span>
        </div>
      </div>

      {/* Trust Score */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>🛡️ Trust Score</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#10B981" }}>{TRUST}/100</span>
        </div>
        <div style={{ height: 7, background: "rgba(0,0,0,0.06)", borderRadius: 6, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${TRUST}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ height: "100%", background: "linear-gradient(90deg,#10B981,#6EE7B7)", borderRadius: 6 }} />
        </div>
      </div>

      {/* Profile Completion */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>📋 Profile Completion</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#7C3AED" }}>{COMPLETION}%</span>
        </div>
        <div style={{ height: 7, background: "rgba(0,0,0,0.06)", borderRadius: 6, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${COMPLETION}%` }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            style={{ height: "100%", background: "linear-gradient(90deg,#7C3AED,#C084FC)", borderRadius: 6 }} />
        </div>
      </div>

      {/* Trust stat pills */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {TRUST_STATS.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: `${t.color}0D`, border: `1px solid ${t.color}20`, borderRadius: 12, padding: "8px 10px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: t.color }}>{t.value}</div>
              <div style={{ fontSize: 8, color: "#9CA3AF" }}>{t.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}