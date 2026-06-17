import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VIPS = [
  { label: "VIP 1",    short: "V1",   tier: 1, gradient: "linear-gradient(135deg,#6B7280,#9CA3AF)", glow: "rgba(107,114,128,0.4)", crown: "👑", border: "#9CA3AF" },
  { label: "VVIP",     short: "VV",   tier: 2, gradient: "linear-gradient(135deg,#3B82F6,#60A5FA)", glow: "rgba(59,130,246,0.45)", crown: "👑", border: "#60A5FA" },
  { label: "SVIP",     short: "SV",   tier: 3, gradient: "linear-gradient(135deg,#7C3AED,#A78BFA)", glow: "rgba(124,58,237,0.45)", crown: "💜", border: "#A78BFA" },
  { label: "SSVIP",    short: "SS",   tier: 4, gradient: "linear-gradient(135deg,#EC4899,#F9A8D4)", glow: "rgba(236,72,153,0.45)", crown: "💎", border: "#F9A8D4" },
  { label: "MSVIP",    short: "MS",   tier: 5, gradient: "linear-gradient(135deg,#F59E0B,#FCD34D)", glow: "rgba(245,158,11,0.5)",  crown: "✨", border: "#FCD34D" },
  { label: "MSSVIP",   short: "MSS",  tier: 6, gradient: "linear-gradient(135deg,#EF4444,#FCA5A5)", glow: "rgba(239,68,68,0.5)",   crown: "🔥", border: "#FCA5A5" },
  { label: "MISVIP",   short: "MIS",  tier: 7, gradient: "linear-gradient(135deg,#10B981,#6EE7B7)", glow: "rgba(16,185,129,0.5)",  crown: "⚡", border: "#6EE7B7" },
  { label: "MISSVIP",  short: "MISS", tier: 8, rainbow: true,                                        glow: "rgba(245,158,11,0.7)",  crown: "🌈", border: "transparent" },
];

// Currently active VIP — VVIP (tier 2)
const ACTIVE_TIER = 2;
const activeVIP = VIPS.find(v => v.tier === ACTIVE_TIER);

const TierCard = ({ v, i, isActive, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 14 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    style={{ textAlign: "center", cursor: "pointer", position: "relative" }}>
    {isActive && (
      <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", zIndex: 10,
        background: "linear-gradient(135deg,#F59E0B,#D97706)", borderRadius: 6, padding: "1px 5px" }}>
        <span style={{ fontSize: 7, fontWeight: 900, color: "#fff" }}>ACTIVE</span>
      </div>
    )}
    <div style={{ position: "relative", display: "inline-block" }}>
      {v.rainbow && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: -4, borderRadius: "50%",
            background: "conic-gradient(from 0deg,#F59E0B,#EC4899,#7C3AED,#3B82F6,#10B981,#F59E0B)", zIndex: 0 }} />
      )}
      {isActive && !v.rainbow && (
        <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ position: "absolute", inset: -5, borderRadius: "50%", background: v.gradient, opacity: 0.25, zIndex: 0 }} />
      )}
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: v.rainbow ? "#fff" : v.gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1,
        margin: v.rainbow ? 4 : 0,
        boxShadow: `0 0 ${isActive ? 22 : 14}px ${v.glow}, 0 4px 10px rgba(0,0,0,0.12)`,
        border: isActive ? `2px solid ${v.border}` : v.rainbow ? "2px solid transparent" : `2px solid ${v.border}40`,
      }}>
        {v.rainbow ? (
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "conic-gradient(from 0deg,#F59E0B,#EC4899,#7C3AED,#3B82F6,#10B981,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{v.crown}</div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18 }}>{v.crown}</div>
            <div style={{ fontSize: 7, fontWeight: 900, color: "rgba(255,255,255,0.9)", marginTop: -2 }}>{v.short}</div>
          </div>
        )}
      </div>
    </div>
    <div style={{
      fontSize: 8, fontWeight: 900, marginTop: 5, lineHeight: 1.1,
      color: v.rainbow ? "transparent" : isActive ? "#1a1a2e" : "#6B7280",
      background: v.rainbow ? "linear-gradient(135deg,#F59E0B,#EC4899,#7C3AED)" : "none",
      WebkitBackgroundClip: v.rainbow ? "text" : "initial",
      WebkitTextFillColor: v.rainbow ? "transparent" : isActive ? "#1a1a2e" : "#6B7280",
    }}>{v.label}</div>
  </motion.div>
);

export default function MeVIPSection() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 16,
      border: "1px solid rgba(124,58,237,0.1)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>👑 VIP Membership</span>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => navigate("/vip-membership")}
          style={{ fontSize: 10, fontWeight: 800, color: "#7C3AED", background: "rgba(124,58,237,0.08)", borderRadius: 12, padding: "3px 10px", border: "none", cursor: "pointer" }}>
          Dashboard →
        </motion.button>
      </div>

      {/* Active VIP status bar */}
      <motion.div whileTap={{ scale: 0.98 }} onClick={() => navigate("/vip-membership")}
        style={{
          display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
          background: `linear-gradient(135deg,${activeVIP.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0] || "#3B82F6"}18,${activeVIP.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[1] || "#60A5FA"}10)`,
          borderRadius: 16, padding: "11px 13px", marginBottom: 14,
          border: `1px solid ${activeVIP.border}35`,
          boxShadow: `0 4px 14px ${activeVIP.glow}30`,
        }}>
        {/* Badge */}
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: activeVIP.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: `0 4px 14px ${activeVIP.glow}, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>{activeVIP.crown}</div>
            <div style={{ fontSize: 7, fontWeight: 900, color: "rgba(255,255,255,0.9)", marginTop: -3 }}>{activeVIP.short}</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{activeVIP.label}</span>
            <span style={{ fontSize: 8, fontWeight: 800, color: "#10B981", background: "rgba(16,185,129,0.12)", borderRadius: 6, padding: "1px 6px", border: "1px solid rgba(16,185,129,0.2)" }}>ACTIVE</span>
          </div>
          <div style={{ fontSize: 10, color: "#6B7280" }}>Tier {activeVIP.tier} · Expires Jul 5, 2026</div>
        </div>
        <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
      </motion.div>

      {/* Tier grid title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.05em" }}>VIP MEMBERSHIP LEVELS</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#7C3AED", background: "rgba(124,58,237,0.07)", borderRadius: 8, padding: "2px 7px" }}>8 Tiers</span>
      </div>

      {/* Tier grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {VIPS.map((v, i) => (
          <TierCard key={v.label} v={v} i={i} isActive={v.tier === ACTIVE_TIER} onClick={() => navigate("/vip-membership")} />
        ))}
      </div>
    </div>
  );
}