import { motion } from "framer-motion";

const LEVELS = [
  { icon: "⭐", label: "User Level",   level: 35, xp: 84200,  next: 100000, color: "#F59E0B", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)" },
  { icon: "🎙", label: "Host Level",   level: 18, xp: 32500,  next: 50000,  color: "#EC4899", bg: "linear-gradient(135deg,#FCE7F3,#FBCFE8)" },
  { icon: "🎁", label: "Gift Level",   level: 40, xp: 95000,  next: 110000, color: "#7C3AED", bg: "linear-gradient(135deg,#EDE9FE,#DDD6FE)" },
  { icon: "📹", label: "Stream Level", level: 22, xp: 48000,  next: 65000,  color: "#3B82F6", bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)" },
];

export default function LevelCards() {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>Level Progress</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {LEVELS.map((lvl) => {
          const pct = Math.round((lvl.xp / lvl.next) * 100);
          return (
            <div key={lvl.label} style={{
              background: lvl.bg, borderRadius: 18, padding: "14px 12px",
              border: `1px solid ${lvl.color}22`,
              boxShadow: `0 4px 16px ${lvl.color}18`,
            }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 20 }}>{lvl.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#4B5563" }}>{lvl.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: lvl.color, lineHeight: 1.1 }}>
                Lv.{lvl.level}
              </div>
              <div style={{ marginTop: 8, height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  style={{ height: "100%", borderRadius: 8, background: lvl.color,
                    boxShadow: `0 0 8px ${lvl.color}88` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span style={{ fontSize: 9, color: "#6B7280", fontWeight: 600 }}>{lvl.xp.toLocaleString()} XP</span>
                <span style={{ fontSize: 9, color: lvl.color, fontWeight: 700 }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}