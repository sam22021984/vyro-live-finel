import { motion } from "framer-motion";

const TODAY = [
  { icon: "⏱", label: "Live Hours",     value: "3h 24m", color: "#7C3AED" },
  { icon: "🎁", label: "Gifts Received", value: "284",    color: "#EC4899" },
  { icon: "❤️", label: "New Followers",  value: "+128",   color: "#EF4444" },
];

const RANKS = [
  { label: "Daily Rank",   value: "#142", color: "#F59E0B" },
  { label: "Weekly Rank",  value: "#87",  color: "#7C3AED" },
  { label: "Monthly Rank", value: "#34",  color: "#EC4899" },
];

export default function MeDailyActivity() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>📊 Daily Activity</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
        {TODAY.map((t, i) => (
          <motion.div key={t.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: `linear-gradient(135deg,${t.color}14,${t.color}06)`,
              border: `1px solid ${t.color}20`,
              borderRadius: 16, padding: "14px 8px", textAlign: "center",
            }}>
            <div style={{ fontSize: 22 }}>{t.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: t.color, marginTop: 4 }}>{t.value}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{t.label}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {RANKS.map((r, i) => (
          <motion.div key={r.label}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            style={{
              background: `${r.color}12`, border: `1px solid ${r.color}25`,
              borderRadius: 14, padding: "10px 6px", textAlign: "center",
            }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: r.color }}>{r.value}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{r.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}