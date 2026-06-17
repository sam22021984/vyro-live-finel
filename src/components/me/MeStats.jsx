import { motion } from "framer-motion";

const STATS = [
  { icon: "❤️",  label: "Followers",      value: "124K",  color: "#EF4444" },
  { icon: "👣",  label: "Following",      value: "1.2K",  color: "#7C3AED" },
  { icon: "🤝",  label: "Friends",        value: "320",   color: "#3B82F6" },
  { icon: "👀",  label: "Visitors",       value: "9.1K",  color: "#8B5CF6" },
  { icon: "💖",  label: "Likes",          value: "124K",  color: "#EC4899" },
  { icon: "🌹",  label: "Gifts Received", value: "15.2K", color: "#DB2777" },
  { icon: "🎁",  label: "Gifts Sent",     value: "8.4K",  color: "#F97316" },
  { icon: "🪙",  label: "Coins",          value: "48.5K", color: "#F59E0B" },
  { icon: "🔥",  label: "Activity Score", value: "98.4K", color: "#EF4444" },
];

export default function MeStats() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>📊 Statistics</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: `linear-gradient(135deg,${s.color}12,${s.color}06)`,
              borderRadius: 16, padding: "12px 8px", textAlign: "center",
              border: `1px solid ${s.color}20`,
              boxShadow: `0 2px 12px ${s.color}10`,
            }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: s.color, lineHeight: 1.1, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}