import { motion } from "framer-motion";

const VIPS = [
  {
    label: "VIP 1", short: "V1", tier: 1,
    gradient: "linear-gradient(135deg,#6B7280,#9CA3AF)",
    glow: "rgba(107,114,128,0.4)", crown: "👑",
    border: "#9CA3AF",
  },
  {
    label: "VVIP", short: "VV", tier: 2,
    gradient: "linear-gradient(135deg,#3B82F6,#60A5FA)",
    glow: "rgba(59,130,246,0.45)", crown: "👑",
    border: "#60A5FA",
  },
  {
    label: "SVIP", short: "SV", tier: 3,
    gradient: "linear-gradient(135deg,#7C3AED,#A78BFA)",
    glow: "rgba(124,58,237,0.45)", crown: "💜",
    border: "#A78BFA",
  },
  {
    label: "SSVIP", short: "SS", tier: 4,
    gradient: "linear-gradient(135deg,#EC4899,#F9A8D4)",
    glow: "rgba(236,72,153,0.45)", crown: "💎",
    border: "#F9A8D4",
  },
  {
    label: "MSVIP", short: "MS", tier: 5,
    gradient: "linear-gradient(135deg,#F59E0B,#FCD34D)",
    glow: "rgba(245,158,11,0.5)", crown: "✨",
    border: "#FCD34D",
  },
  {
    label: "MSSVIP", short: "MSS", tier: 6,
    gradient: "linear-gradient(135deg,#EF4444,#FCA5A5)",
    glow: "rgba(239,68,68,0.5)", crown: "🔥",
    border: "#FCA5A5",
  },
  {
    label: "MISVIP", short: "MIS", tier: 7,
    gradient: "linear-gradient(135deg,#10B981,#6EE7B7)",
    glow: "rgba(16,185,129,0.5)", crown: "⚡",
    border: "#6EE7B7",
  },
  {
    label: "MISSVIP", short: "MISS", tier: 8,
    gradient: "conic-gradient(from 0deg, #F59E0B, #EC4899, #7C3AED, #3B82F6, #10B981, #F59E0B)",
    glow: "rgba(245,158,11,0.7)", crown: "🌈",
    border: "transparent", rainbow: true,
  },
];

const Card = ({ v, i }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
    whileTap={{ scale: 0.92 }}
    style={{ textAlign: "center", cursor: "pointer" }}>
    <div style={{ position: "relative", display: "inline-block" }}>
      {v.rainbow && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: "conic-gradient(from 0deg, #F59E0B, #EC4899, #7C3AED, #3B82F6, #10B981, #F59E0B)",
            zIndex: 0,
          }} />
      )}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: v.rainbow ? "#fff" : v.gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1,
        margin: v.rainbow ? 4 : 0,
        boxShadow: `0 0 18px ${v.glow}, 0 4px 12px rgba(0,0,0,0.15)`,
        border: v.rainbow ? "2px solid transparent" : `2px solid ${v.border}40`,
      }}>
        {v.rainbow ? (
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "conic-gradient(from 0deg, #F59E0B, #EC4899, #7C3AED, #3B82F6, #10B981, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>{v.crown}</div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>{v.crown}</div>
            <div style={{ fontSize: 8, fontWeight: 900, color: "rgba(255,255,255,0.9)", marginTop: -2 }}>{v.short}</div>
          </div>
        )}
      </div>
      {v.rainbow && (
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            background: "conic-gradient(from 0deg, #F59E0B, #EC4899, #7C3AED, #3B82F6, #10B981, #F59E0B)",
            opacity: 0.25, zIndex: 0,
          }} />
      )}
    </div>
    <div style={{
      fontSize: 9, fontWeight: 900, marginTop: 5, lineHeight: 1.1,
      color: v.rainbow ? "transparent" : "#374151",
      background: v.rainbow ? "linear-gradient(135deg,#F59E0B,#EC4899,#7C3AED)" : "none",
      WebkitBackgroundClip: v.rainbow ? "text" : "initial",
      WebkitTextFillColor: v.rainbow ? "transparent" : "#374151",
    }}>{v.label}</div>
  </motion.div>
);

export default function MeVIPSection() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 16,
      border: "1px solid rgba(124,58,237,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>👑 VIP Collection</span>
        <span style={{
          fontSize: 10, fontWeight: 800, color: "#7C3AED",
          background: "rgba(124,58,237,0.08)", borderRadius: 12, padding: "2px 8px",
        }}>8 Tiers</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {VIPS.map((v, i) => <Card key={v.label} v={v} i={i} />)}
      </div>
    </div>
  );
}