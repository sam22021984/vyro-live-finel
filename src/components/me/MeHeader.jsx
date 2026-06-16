import { useState } from "react";
import { motion } from "framer-motion";

const BADGES = [
  { label: "Official Host", icon: "🎙", bg: "linear-gradient(135deg,#F59E0B,#D97706)" },
  { label: "Agency",        icon: "🏢", bg: "linear-gradient(135deg,#3B82F6,#1D4ED8)" },
  { label: "Agent",         icon: "🤝", bg: "linear-gradient(135deg,#10B981,#059669)" },
  { label: "Family",        icon: "👨‍👩‍👧‍👦", bg: "linear-gradient(135deg,#EC4899,#DB2777)" },
  { label: "VIP",           icon: "👑", bg: "linear-gradient(135deg,#7C3AED,#4C1D95)" },
  { label: "Verified",      icon: "✔",  bg: "linear-gradient(135deg,#0EA5E9,#0369A1)" },
];

export default function MeHeader() {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard?.writeText("PK-920000000001").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div style={{ position: "relative" }}>
          {/* Animated VIP Frame */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              background: "conic-gradient(from 0deg, #F59E0B, #7C3AED, #EC4899, #3B82F6, #F59E0B)",
              zIndex: 0,
            }} />
          <div style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            background: "white", zIndex: 1,
          }} />
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
            alt="avatar"
            style={{
              width: 96, height: 96, borderRadius: "50%", objectFit: "cover",
              position: "relative", zIndex: 2, display: "block",
            }} />
          {/* Online indicator */}
          <div style={{
            position: "absolute", bottom: 4, right: 4, zIndex: 3,
            width: 18, height: 18, borderRadius: "50%",
            background: "#22C55E", border: "3px solid white",
            boxShadow: "0 0 10px rgba(34,197,94,0.6)",
          }} />
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 22, fontWeight: 900, color: "#1a1a2e",
          letterSpacing: -0.5, lineHeight: 1.2,
        }}>
          ★ SAM ★
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 16 }}>🇵🇰</span>
          <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Pakistan</span>
          <span style={{
            background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
            color: "#fff", borderRadius: 20, padding: "1px 8px",
            fontSize: 10, fontWeight: 800,
          }}>♂ Male</span>
          <span style={{
            background: "linear-gradient(135deg,#22C55E,#16A34A)",
            color: "#fff", borderRadius: 20, padding: "1px 8px",
            fontSize: 10, fontWeight: 800,
          }}>● Online</span>
        </div>

        {/* User ID */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 8 }}>
          <span style={{
            background: "rgba(124,58,237,0.08)", borderRadius: 20, padding: "3px 12px",
            fontSize: 11, color: "#7C3AED", fontWeight: 800,
            border: "1px solid rgba(124,58,237,0.2)",
          }}>ID: PK-920000000001</span>
          <motion.button whileTap={{ scale: 0.88 }} onClick={copyId}
            style={{
              background: copied ? "#22C55E" : "linear-gradient(135deg,#7C3AED,#C084FC)",
              color: "#fff", borderRadius: 20, padding: "3px 10px",
              fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer",
              transition: "all 0.2s",
            }}>
            {copied ? "✓ Copied" : "Copy ID"}
          </motion.button>
        </div>

        {/* Badges Row */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {BADGES.map(b => (
            <span key={b.label} style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              background: b.bg, borderRadius: 20, padding: "3px 9px",
              fontSize: 10, fontWeight: 800, color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}