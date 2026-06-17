import { motion } from "framer-motion";

const SOCIAL = [
  { icon: "❤️", label: "Followers",          count: "124K",  color: "#EF4444" },
  { icon: "👣", label: "Following",          count: "1.2K",  color: "#7C3AED" },
  { icon: "🤝", label: "Friends",            count: "320",   color: "#3B82F6" },
  { icon: "💞", label: "Relationship",       count: "Active",color: "#EC4899" },
  { icon: "🌐", label: "Social Activity",    count: "98%",   color: "#10B981" },
];

export default function MeSocial() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>🌐 Social</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, width: "100%" }}>
        {SOCIAL.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: `linear-gradient(135deg,${s.color}14,${s.color}06)`,
              border: `1px solid ${s.color}25`,
              borderRadius: 18, padding: "14px 8px",
              textAlign: "center",
              boxShadow: `0 2px 12px ${s.color}12`,
            }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.count}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}