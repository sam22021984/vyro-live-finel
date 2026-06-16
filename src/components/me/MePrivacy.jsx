import { useState } from "react";

const ITEMS = ["Age","Coins","Beans","Visitors","Followers","PK History","Family","Agency","Achievements","Online Status"];
const OPTS = [
  { label: "Public",  color: "#22C55E" },
  { label: "Friends", color: "#3B82F6" },
  { label: "Private", color: "#EF4444" },
];

export default function MePrivacy() {
  const [settings, setSettings] = useState(
    Object.fromEntries(ITEMS.map(k => [k, "Public"]))
  );

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 12 }}>🔒 Privacy Settings</div>
      {ITEMS.map((item, i) => (
        <div key={item} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "9px 0",
          borderBottom: i < ITEMS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{item}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {OPTS.map(opt => (
              <button key={opt.label} onClick={() => setSettings(s => ({ ...s, [item]: opt.label }))}
                style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                  cursor: "pointer", border: "none", transition: "all 0.15s",
                  background: settings[item] === opt.label ? opt.color : "rgba(0,0,0,0.06)",
                  color: settings[item] === opt.label ? "#fff" : "#9CA3AF",
                  boxShadow: settings[item] === opt.label ? `0 2px 8px ${opt.color}40` : "none",
                }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}