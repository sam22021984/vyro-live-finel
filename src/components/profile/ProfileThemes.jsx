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

export default function ProfileThemes() {
  const [active, setActive] = useState("Galaxy Purple");
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>🎨 Profile Themes</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
        {THEMES.map(t => (
          <motion.button key={t.label} whileTap={{ scale: 0.88 }}
            onClick={() => setActive(t.label)}
            style={{
              border: active === t.label ? "2.5px solid #7C3AED" : "2px solid transparent",
              borderRadius: 14, overflow: "hidden", cursor: "pointer",
              boxShadow: active === t.label ? "0 0 12px rgba(124,58,237,0.5)" : "0 2px 6px rgba(0,0,0,0.1)",
              transition: "all 0.2s",
            }}>
            <div style={{ height: 44, background: t.gradient }} />
            <div style={{ fontSize: 8, fontWeight: 700, color: "#374151", padding: "3px 2px", textAlign: "center", lineHeight: 1.2 }}>
              {t.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}