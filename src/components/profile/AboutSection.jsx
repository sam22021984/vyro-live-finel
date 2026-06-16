const ROW = ({ label, value }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
  }}>
    <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700 }}>{value}</span>
  </div>
);

export default function AboutSection() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>📝 About Me</div>
      <div style={{
        fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 12,
        padding: 10, background: "rgba(124,58,237,0.04)", borderRadius: 10,
        borderLeft: "3px solid #7C3AED",
      }}>
        "Live music, PK battles, and real connections. Join my room for an unforgettable experience! 🎙✨"
      </div>
      <ROW label="Language"   value="🇵🇰 Urdu, 🇬🇧 English" />
      <ROW label="Country"    value="🇵🇰 Pakistan" />
      <ROW label="Age"        value="26 years" />
      <ROW label="Birthday"   value="🎂 April 15" />
      <ROW label="Zodiac"     value="♈ Aries" />
      <div style={{ padding: "10px 0" }}>
        <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Signature</span>
        <div style={{
          marginTop: 4, fontSize: 12, fontStyle: "italic",
          color: "#7C3AED", fontWeight: 600,
        }}>
          "Music is the language of the soul 🎵"
        </div>
      </div>
    </div>
  );
}