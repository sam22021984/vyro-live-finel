import { motion } from "framer-motion";

const TRUST = 94;
const COMPLETION = 88;

const SPECIAL_BADGES = [
  { icon: "⚜️", label: "Founder",    color: "#F59E0B" },
  { icon: "🛡",  label: "Moderator", color: "#3B82F6" },
  { icon: "👮",  label: "Admin",     color: "#EF4444" },
  { icon: "✔",  label: "Verified",  color: "#10B981" },
];

const TOP_FANS = [
  { name: "Ali",  coins: "48K", avatar: "🥇" },
  { name: "Zara", coins: "32K", avatar: "🥈" },
  { name: "Omar", coins: "21K", avatar: "🥉" },
];

export default function MeExtras() {
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Trust + Completion */}
      <div style={{
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderRadius: 24, padding: 16,
        border: "1px solid rgba(124,58,237,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>⚡ Trust & Reputation</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>🛡 Trust Score</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#10B981" }}>{TRUST}/100</span>
          </div>
          <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 8, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${TRUST}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ height: "100%", background: "linear-gradient(90deg,#10B981,#6EE7B7)", borderRadius: 8 }} />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>📋 Profile Completion</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#7C3AED" }}>{COMPLETION}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 8, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${COMPLETION}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              style={{ height: "100%", background: "linear-gradient(90deg,#7C3AED,#C084FC)", borderRadius: 8 }} />
          </div>
        </div>
        {/* Reputation */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>⭐ Reputation:</span>
          {[1,2,3,4,5].map(n => (
            <span key={n} style={{ fontSize: 16, color: n <= 4 ? "#F59E0B" : "#D1D5DB" }}>★</span>
          ))}
          <span style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B" }}>4.8</span>
        </div>
      </div>

      {/* Special Badges */}
      <div style={{
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderRadius: 24, padding: 16,
        border: "1px solid rgba(124,58,237,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>🏅 Special Badges</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {SPECIAL_BADGES.map((b, i) => (
            <motion.div key={b.label}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: `linear-gradient(135deg,${b.color}18,${b.color}08)`,
                border: `1px solid ${b.color}30`,
                borderRadius: 16, padding: "12px 8px", textAlign: "center",
                boxShadow: `0 0 12px ${b.color}20`,
              }}>
              <div style={{ fontSize: 24 }}>{b.icon}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: b.color, marginTop: 4 }}>{b.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Fans */}
      <div style={{
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderRadius: 24, padding: 16,
        border: "1px solid rgba(124,58,237,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>🏆 Top Fans</div>
        {TOP_FANS.map((f, i) => (
          <div key={f.name} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 0",
            borderBottom: i < TOP_FANS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
          }}>
            <span style={{ fontSize: 22 }}>{f.avatar}</span>
            <span style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 13, flex: 1 }}>{f.name}</span>
            <span style={{
              background: "linear-gradient(135deg,#F59E0B,#D97706)",
              color: "#fff", borderRadius: 12, padding: "2px 10px",
              fontSize: 11, fontWeight: 800,
            }}>🪙 {f.coins}</span>
          </div>
        ))}
      </div>
    </div>
  );
}