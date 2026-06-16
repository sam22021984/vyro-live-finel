import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  { icon: "🏆", label: "First Recharge",      color: "#F59E0B", unlocked: true  },
  { icon: "🎙", label: "First Live",           color: "#EC4899", unlocked: true  },
  { icon: "⚔️", label: "First PK Win",         color: "#EF4444", unlocked: true  },
  { icon: "🌟", label: "Top Host",             color: "#7C3AED", unlocked: true  },
  { icon: "🎁", label: "Gift Master",          color: "#3B82F6", unlocked: true  },
  { icon: "👑", label: "PK King",              color: "#F97316", unlocked: true  },
  { icon: "💎", label: "VIP Legend",           color: "#8B5CF6", unlocked: true  },
  { icon: "⭐", label: "Elite User",           color: "#0EA5E9", unlocked: true  },
  { icon: "🚀", label: "Million Bean Club",    color: "#10B981", unlocked: false },
];

export default function AchievementsSection() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>🏅 Achievements</span>
        <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>8/9 Unlocked</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div key={a.label}
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: a.unlocked ? `linear-gradient(135deg,${a.color}18,${a.color}08)` : "rgba(0,0,0,0.04)",
              borderRadius: 14, padding: "12px 8px", textAlign: "center",
              border: a.unlocked ? `1px solid ${a.color}30` : "1px solid rgba(0,0,0,0.06)",
              filter: a.unlocked ? "none" : "grayscale(1) opacity(0.4)",
              boxShadow: a.unlocked ? `0 0 12px ${a.color}20` : "none",
            }}>
            <div style={{ fontSize: 24 }}>{a.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: a.unlocked ? a.color : "#9CA3AF", marginTop: 4, lineHeight: 1.3 }}>
              {a.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}