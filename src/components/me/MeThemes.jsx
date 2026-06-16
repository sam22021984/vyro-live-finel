import { useState } from "react";
import { motion } from "framer-motion";

const THEMES = [
  { label: "Royal Gold",    gradient: "linear-gradient(135deg,#F59E0B,#D97706)" },
  { label: "Diamond Blue",  gradient: "linear-gradient(135deg,#3B82F6,#1D4ED8)" },
  { label: "Galaxy Purple", gradient: "linear-gradient(135deg,#7C3AED,#4C1D95)" },
  { label: "Cyber Neon",    gradient: "linear-gradient(135deg,#10B981,#059669)" },
  { label: "Black Gold",    gradient: "linear-gradient(135deg,#1a1a1a,#F59E0B)" },
  { label: "Dragon Fire",   gradient: "linear-gradient(135deg,#EF4444,#F97316)" },
  { label: "Ice Kingdom",   gradient: "linear-gradient(135deg,#BAE6FD,#38BDF8)" },
  { label: "Pink Princess", gradient: "linear-gradient(135deg,#EC4899,#DB2777)" },
  { label: "VIP Elite",     gradient: "linear-gradient(135deg,#8B5CF6,#EC4899)" },
  { label: "Future Tech",   gradient: "linear-gradient(135deg,#6366F1,#0EA5E9)" },
];

export default function MeThemes() {
  const [active, setActive] = useState("Galaxy Purple");
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>🎨 Profile Themes</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
        {THEMES.map(t => (
          <motion.button key={t.label} whileTap={{ scale: 0.88 }}
            onClick={() => setActive(t.label)}
            style={{
              border: active === t.label ? "2.5px solid #7C3AED" : "2px solid transparent",
              borderRadius: 16, overflow: "hidden", cursor: "pointer", padding: 0,
              boxShadow: active === t.label ? "0 0 16px rgba(124,58,237,0.5)" : "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.2s", background: "none",
            }}>
            <div style={{ height: 52, background: t.gradient }} />
            <div style={{
              fontSize: 8, fontWeight: 800, color: "#374151",
              padding: "4px 2px", textAlign: "center", lineHeight: 1.2,
              background: "#fff",
            }}>{t.label}</div>
            {active === t.label && (
              <div style={{
                position: "absolute", top: 4, right: 4, width: 16, height: 16,
                borderRadius: "50%", background: "#7C3AED",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, color: "#fff", fontWeight: 900,
              }}>✓</div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}