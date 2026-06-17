import { motion } from "framer-motion";

const FANS = [
  { rank: 1, avatar: "👩", name: "Sarah Al-R.",  level: "LV42", score: "48.2K", gifts: "2,140", color: "#F59E0B", crown: "🥇" },
  { rank: 2, avatar: "👨", name: "Ahmed Q.",     level: "LV38", score: "36.8K", gifts: "1,720", color: "#9CA3AF", crown: "🥈" },
  { rank: 3, avatar: "👸", name: "Layla H.",     level: "LV55", score: "29.4K", gifts: "1,380", color: "#CD7F32", crown: "🥉" },
  { rank: 4, avatar: "🧑", name: "Omar F.",      level: "LV29", score: "22.1K", gifts: "980",   color: "#3B82F6", crown: "⭐" },
  { rank: 5, avatar: "👦", name: "Khalid M.",    level: "LV33", score: "18.7K", gifts: "820",   color: "#7C3AED", crown: "⭐" },
];

export default function MeTopFans() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(245,158,11,0.12)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>⭐ Top Fans</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: "#F59E0B", background: "rgba(245,158,11,0.1)", borderRadius: 12, padding: "2px 8px" }}>
          Top 5
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FANS.map((f, i) => (
          <motion.div key={f.rank}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: i === 0 ? "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.04))"
                        : i === 1 ? "rgba(156,163,175,0.07)"
                        : i === 2 ? "rgba(205,127,50,0.07)"
                        : "rgba(0,0,0,0.025)",
              borderRadius: 16, padding: "10px 12px",
              border: i < 3 ? `1px solid ${f.color}25` : "1px solid rgba(0,0,0,0.04)",
            }}>
            {/* Rank */}
            <div style={{ width: 28, textAlign: "center", fontSize: 16, flexShrink: 0 }}>{f.crown}</div>
            {/* Avatar */}
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${f.color}40,${f.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: `2px solid ${f.color}40` }}>
              {f.avatar}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>{f.level} · {f.gifts} gifts</div>
            </div>
            {/* Score */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: f.color }}>{f.score}</div>
              <div style={{ fontSize: 8, color: "#9CA3AF" }}>Support Score</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}