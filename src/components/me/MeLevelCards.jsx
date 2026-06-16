import { motion } from "framer-motion";

const LEVELS = [
  {
    icon: "⭐", label: "User Level", level: 35,
    xp: 84200, nextXP: 100000,
    color: "#F59E0B", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)",
    bar: "linear-gradient(90deg,#F59E0B,#D97706)",
  },
  {
    icon: "🎙", label: "Host Level", level: 18,
    xp: 42000, nextXP: 60000,
    color: "#7C3AED", bg: "linear-gradient(135deg,#EDE9FE,#DDD6FE)",
    bar: "linear-gradient(90deg,#7C3AED,#A78BFA)",
  },
  {
    icon: "🎁", label: "Gift Level", level: 40,
    xp: 128000, nextXP: 150000,
    color: "#EC4899", bg: "linear-gradient(135deg,#FCE7F3,#FBCFE8)",
    bar: "linear-gradient(90deg,#EC4899,#F9A8D4)",
  },
  {
    icon: "📹", label: "Stream Level", level: 22,
    xp: 54000, nextXP: 75000,
    color: "#3B82F6", bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)",
    bar: "linear-gradient(90deg,#3B82F6,#60A5FA)",
  },
];

const fmtK = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n;
const pct = (xp, next) => Math.round((xp / next) * 100);

export default function MeLevelCards() {
  return (
    <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {LEVELS.map((l, i) => (
        <motion.div key={l.label}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07 }}
          style={{
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
            borderRadius: 20, padding: 14,
            border: `1px solid ${l.color}25`,
            boxShadow: `0 4px 20px ${l.color}15`,
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <div style={{
              background: l.bg, borderRadius: 12, padding: "2px 8px",
              fontSize: 11, fontWeight: 900, color: l.color,
            }}>Lv.{l.level}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#374151", marginTop: 6 }}>{l.label}</div>
          <div style={{
            height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 6, marginTop: 8, overflow: "hidden",
          }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct(l.xp, l.nextXP)}%` }}
              transition={{ delay: i * 0.07 + 0.3, duration: 0.8, ease: "easeOut" }}
              style={{ height: "100%", background: l.bar, borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{fmtK(l.xp)} XP</span>
            <span style={{ fontSize: 9, color: l.color, fontWeight: 700 }}>{pct(l.xp, l.nextXP)}%</span>
            <span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{fmtK(l.nextXP)} XP</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}