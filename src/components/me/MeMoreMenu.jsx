import { motion } from "framer-motion";

const ACTIONS = [
  { icon: "🚩", label: "Report User",    color: "#EF4444" },
  { icon: "🚫", label: "Block User",     color: "#EF4444" },
  { icon: "🔇", label: "Mute User",      color: "#F97316" },
  { icon: "📋", label: "Copy ID",        color: "#7C3AED" },
  { icon: "📨", label: "Send Invitation",color: "#3B82F6" },
  { icon: "👋", label: "Remove Friend",  color: "#6B7280" },
  { icon: "💔", label: "Unfollow",       color: "#EC4899" },
];

export default function MeMoreMenu({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "flex-end",
      }}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(24px)", borderRadius: "24px 24px 0 0",
          padding: "20px 16px 40px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: "rgba(0,0,0,0.15)", margin: "0 auto 20px",
        }} />
        <div style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", marginBottom: 16, textAlign: "center" }}>
          More Options
        </div>
        {ACTIONS.map((a, i) => (
          <motion.button key={a.label}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: 14, width: "100%",
              padding: "14px 16px", borderRadius: 16, marginBottom: 4,
              background: `${a.color}08`, border: `1px solid ${a.color}15`,
              cursor: "pointer",
            }}>
            <span style={{ fontSize: 22 }}>{a.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: a.color }}>{a.label}</span>
          </motion.button>
        ))}
        <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
          style={{
            width: "100%", padding: "14px 0", marginTop: 8, borderRadius: 20,
            background: "rgba(0,0,0,0.05)", border: "none",
            fontSize: 14, fontWeight: 800, color: "#6B7280", cursor: "pointer",
          }}>Cancel</motion.button>
      </motion.div>
    </motion.div>
  );
}