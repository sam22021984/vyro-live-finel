import { useState } from "react";

const ITEMS = ["Age","Coins","Beans","Visitors","Followers","PK History","Family","Agency","Achievements","Online Status"];
const OPTIONS = ["Public","Friends","Private"];

export default function PrivacySettings() {
  const [settings, setSettings] = useState(
    Object.fromEntries(ITEMS.map(k => [k, "Public"]))
  );
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>🔒 Privacy Settings</div>
      {ITEMS.map((item, i) => (
        <div key={item} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 0", borderBottom: i < ITEMS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{item}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {OPTIONS.map(opt => (
              <button key={opt} onClick={() => setSettings(s => ({ ...s, [item]: opt }))}
                style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: "pointer",
                  border: "none", transition: "all 0.15s",
                  background: settings[item] === opt
                    ? opt === "Public" ? "#22C55E" : opt === "Friends" ? "#3B82F6" : "#EF4444"
                    : "rgba(0,0,0,0.06)",
                  color: settings[item] === opt ? "#fff" : "#9CA3AF",
                }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}