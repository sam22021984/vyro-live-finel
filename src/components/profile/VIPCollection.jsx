import { motion } from "framer-motion";

const VIPS = [
  { label: "VIP 1",    gradient: "linear-gradient(135deg,#C0C0C0,#E8E8E8)",        glow: "#C0C0C0", crown: "👑", text: "#555" },
  { label: "VVIP",     gradient: "linear-gradient(135deg,#F59E0B,#FCD34D)",         glow: "#F59E0B", crown: "👑", text: "#7C4D00" },
  { label: "SVIP",     gradient: "linear-gradient(135deg,#3B82F6,#93C5FD)",         glow: "#3B82F6", crown: "💎", text: "#1E3A8A" },
  { label: "SSVIP",    gradient: "linear-gradient(135deg,#8B5CF6,#C4B5FD)",         glow: "#8B5CF6", crown: "💎", text: "#4C1D95" },
  { label: "MSVIP",    gradient: "linear-gradient(135deg,#EC4899,#FBCFE8)",         glow: "#EC4899", crown: "🌟", text: "#831843" },
  { label: "MSSVIP",   gradient: "linear-gradient(135deg,#EF4444,#FCA5A5)",         glow: "#EF4444", crown: "🌟", text: "#7F1D1D" },
  { label: "MISVIP",   gradient: "linear-gradient(135deg,#F97316,#7C3AED,#3B82F6)", glow: "#7C3AED", crown: "🔥", text: "#fff" },
  { label: "MISSVIP",  gradient: "conic-gradient(#F59E0B,#EC4899,#7C3AED,#3B82F6,#10B981,#F59E0B)", glow: "#EC4899", crown: "🏆", text: "#fff", top: true },
];

export default function VIPCollection() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.10)",
      boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
    }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: 16 }}>👑</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e" }}>VIP Collection</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>MISSVIP Active</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {VIPS.map((vip, i) => (
          <motion.div key={vip.label}
            whileTap={{ scale: 0.93 }}
            animate={vip.top ? { scale: [1, 1.04, 1] } : {}}
            transition={vip.top ? { duration: 2, repeat: Infinity } : {}}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "10px 4px",
              borderRadius: 14,
              background: vip.gradient,
              boxShadow: `0 0 ${vip.top ? 20 : 10}px ${vip.glow}55, 0 2px 8px rgba(0,0,0,0.12)`,
              border: vip.top ? "2px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.4)",
              cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
            {/* Gloss overlay */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "45%",
              background: "rgba(255,255,255,0.22)", borderRadius: "14px 14px 0 0",
            }} />
            <span style={{ fontSize: 20, zIndex: 1 }}>{vip.crown}</span>
            <span style={{
              fontSize: 9, fontWeight: 900, color: vip.text,
              zIndex: 1, textAlign: "center", letterSpacing: "0.02em",
              textShadow: vip.top ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
            }}>{vip.label}</span>
            {vip.top && (
              <span style={{
                position: "absolute", bottom: 3, fontSize: 7, fontWeight: 800,
                color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em",
              }}>MAX RANK</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}