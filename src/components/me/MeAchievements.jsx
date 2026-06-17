import { motion } from "framer-motion";

const ACH = [
  { icon: "🏆", label: "First Recharge",   color: "#F59E0B", unlocked: true  },
  { icon: "🎙", label: "First Live",        color: "#EC4899", unlocked: true  },
  { icon: "⚔️", label: "First PK Win",      color: "#EF4444", unlocked: true  },
  { icon: "🌟", label: "Top Host",          color: "#7C3AED", unlocked: true  },
  { icon: "🎁", label: "Gift Master",       color: "#3B82F6", unlocked: true  },
  { icon: "👑", label: "PK King",           color: "#F97316", unlocked: true  },
  { icon: "💎", label: "VIP Legend",        color: "#8B5CF6", unlocked: true  },
  { icon: "⭐", label: "Elite User",        color: "#0EA5E9", unlocked: true  },
  { icon: "🚀", label: "Million Bean Club", color: "#10B981", unlocked: false },
];

const unlocked = ACH.filter(a => a.unlocked).length;

export default function MeAchievements() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>🏆 Achievements</span>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#10B981", background: "rgba(16,185,129,0.1)", borderRadius: 12, padding: "2px 8px" }}>
            {unlocked}/{ACH.length} Unlocked
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 5, background: "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${(unlocked/ACH.length)*100}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#F59E0B,#7C3AED)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {ACH.map((a, i) => (
          <motion.div key={a.label}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              borderRadius: 16, padding: "14px 8px", textAlign: "center",
              background: a.unlocked ? `linear-gradient(135deg,${a.color}18,${a.color}06)` : "rgba(0,0,0,0.03)",
              border: a.unlocked ? `1px solid ${a.color}30` : "1px solid rgba(0,0,0,0.06)",
              boxShadow: a.unlocked ? `0 0 16px ${a.color}20` : "none",
              filter: a.unlocked ? "none" : "grayscale(1) opacity(0.4)",
            }}>
            <div style={{ fontSize: 28 }}>{a.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 800, marginTop: 5, lineHeight: 1.3, color: a.unlocked ? a.color : "#9CA3AF" }}>{a.label}</div>
            {a.unlocked && (
              <div style={{ marginTop: 4, fontSize: 8, fontWeight: 800, color: "#22C55E", background: "rgba(34,197,94,0.1)", borderRadius: 8, padding: "1px 6px", display: "inline-block" }}>✓</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}