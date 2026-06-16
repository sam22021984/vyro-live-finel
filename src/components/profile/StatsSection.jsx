import { motion } from "framer-motion";

const STATS = [
  { icon: "💎", label: "Beans",        value: "2.4M",  color: "#EC4899" },
  { icon: "🪙", label: "Coins",        value: "18,500",color: "#F59E0B" },
  { icon: "🔥", label: "Popularity",   value: "98.7K", color: "#EF4444" },
  { icon: "❤️", label: "Likes",        value: "342K",  color: "#EC4899" },
  { icon: "🌹", label: "Gifts Recv.",  value: "15,240",color: "#8B5CF6" },
  { icon: "👑", label: "Recharge",     value: "$4,820",color: "#F59E0B" },
];

export default function StatsSection() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>Statistics</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: `${s.color}0F`, borderRadius: 14, padding: "12px 8px",
              textAlign: "center", border: `1px solid ${s.color}22`,
            }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: s.color, marginTop: 2 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}