import { motion } from "framer-motion";

const BADGES = [
  { icon: "👑", label: "VIP Badge",         color: "#F59E0B", gradient: "linear-gradient(135deg,#FDE68A,#F59E0B)", active: true  },
  { icon: "🎙️", label: "Host Badge",        color: "#7C3AED", gradient: "linear-gradient(135deg,#DDD6FE,#7C3AED)", active: true  },
  { icon: "🏛️", label: "Agency Badge",      color: "#0EA5E9", gradient: "linear-gradient(135deg,#BAE6FD,#0EA5E9)", active: true  },
  { icon: "🎉", label: "Event Badge",       color: "#EC4899", gradient: "linear-gradient(135deg,#FBCFE8,#EC4899)", active: true  },
  { icon: "🏆", label: "Achievement Badge", color: "#F97316", gradient: "linear-gradient(135deg,#FED7AA,#F97316)", active: true  },
  { icon: "🌟", label: "Founder Badge",     color: "#10B981", gradient: "linear-gradient(135deg,#A7F3D0,#10B981)", active: true  },
  { icon: "📊", label: "Ranking Badge",     color: "#3B82F6", gradient: "linear-gradient(135deg,#BFDBFE,#3B82F6)", active: false },
];

export default function MeSpecialBadges() {
  const activeCount = BADGES.filter(b => b.active).length;

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>🏅 Special Badges</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: "#7C3AED", background: "rgba(124,58,237,0.08)", borderRadius: 12, padding: "2px 8px" }}>
          {activeCount}/{BADGES.length} Earned
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, width: "100%" }}>
        {BADGES.map((b, i) => (
          <motion.div key={b.label}
            initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
            style={{ textAlign: "center", filter: b.active ? "none" : "grayscale(1) opacity(0.35)" }}>
            {/* 3D Badge */}
            <div style={{ position: "relative", display: "inline-block" }}>
              {b.active && (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{ position: "absolute", inset: -4, borderRadius: "50%", background: b.gradient, opacity: 0.2, zIndex: 0 }} />
              )}
              <div style={{
                width: 50, height: 50, borderRadius: "50%", background: b.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, position: "relative", zIndex: 1,
                boxShadow: b.active ? `0 4px 16px ${b.color}50, inset 0 1px 0 rgba(255,255,255,0.4)` : "none",
                border: `2px solid ${b.color}40`,
              }}>
                {b.icon}
              </div>
            </div>
            <div style={{ fontSize: 8, fontWeight: 800, color: b.active ? "#374151" : "#9CA3AF", marginTop: 5, lineHeight: 1.2 }}>{b.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}