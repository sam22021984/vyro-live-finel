import { useState } from "react";
import { motion } from "framer-motion";

const FIELDS = [
  { label: "Avatar",             type: "image",  value: "" },
  { label: "Cover Photo",        type: "image",  value: "" },
  { label: "Name",               type: "text",   value: "★ SAM ★" },
  { label: "Bio",                type: "text",   value: "Live music & PK battles 🎙✨" },
  { label: "Country",            type: "select", value: "🇵🇰 Pakistan", options: ["🇵🇰 Pakistan","🇦🇪 UAE","🇸🇦 Saudi Arabia","🇬🇧 UK","🇺🇸 USA"] },
  { label: "Gender",             type: "select", value: "♂ Male", options: ["♂ Male","♀ Female","⚧ Other"] },
  { label: "Language",           type: "select", value: "Urdu", options: ["Urdu","English","Arabic","Hindi"] },
  { label: "Signature",          type: "text",   value: "Music is the language of the soul 🎵" },
  { label: "Profile Frame",      type: "badge",  value: "VIP Gold" },
  { label: "VIP Frame",          type: "badge",  value: "MISSVIP" },
  { label: "Animated Background",type: "badge",  value: "Galaxy Flow" },
];

export default function MeCustomization() {
  const [vals, setVals] = useState(Object.fromEntries(FIELDS.map(f => [f.label, f.value])));

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>🎨 Profile Customization</div>
      {FIELDS.map((f, i) => (
        <div key={f.label} style={{
          marginBottom: 10,
          paddingBottom: 10,
          borderBottom: i < FIELDS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#6B7280", marginBottom: 4 }}>{f.label}</div>
          {f.type === "text" && (
            <input value={vals[f.label]}
              onChange={e => setVals(v => ({ ...v, [f.label]: e.target.value }))}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 12, fontSize: 12,
                border: "1.5px solid rgba(124,58,237,0.15)", outline: "none",
                background: "rgba(124,58,237,0.03)", color: "#1a1a2e", fontWeight: 600,
                boxSizing: "border-box",
              }} />
          )}
          {f.type === "select" && (
            <select value={vals[f.label]}
              onChange={e => setVals(v => ({ ...v, [f.label]: e.target.value }))}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 12, fontSize: 12,
                border: "1.5px solid rgba(124,58,237,0.15)", outline: "none",
                background: "white", color: "#1a1a2e", fontWeight: 600, cursor: "pointer",
              }}>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          )}
          {f.type === "image" && (
            <motion.button whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(192,132,252,0.08))",
                border: "1.5px dashed rgba(124,58,237,0.25)",
                borderRadius: 12, padding: "10px 20px", fontSize: 12, fontWeight: 700,
                color: "#7C3AED", cursor: "pointer", width: "100%",
              }}>📷 Upload {f.label}</motion.button>
          )}
          {f.type === "badge" && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg,#7C3AED,#C084FC)",
              color: "#fff", borderRadius: 20, padding: "5px 12px",
              fontSize: 11, fontWeight: 800,
              boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
            }}>✨ {vals[f.label]} <span style={{ opacity: 0.7, fontSize: 10 }}>▼</span></div>
          )}
        </div>
      ))}
      <motion.button whileTap={{ scale: 0.96 }}
        style={{
          width: "100%", padding: "12px 0", marginTop: 4,
          background: "linear-gradient(135deg,#7C3AED,#C084FC)",
          color: "#fff", fontWeight: 900, fontSize: 14,
          border: "none", borderRadius: 20, cursor: "pointer",
          boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
        }}>💾 Save Changes</motion.button>
    </div>
  );
}