const ROW = ({ label, value }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
  }}>
    <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700 }}>{value}</span>
  </div>
);

export default function MeAbout() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 10 }}>📝 About Me</div>
      <div style={{
        fontSize: 13, color: "#374151", lineHeight: 1.7,
        background: "linear-gradient(135deg,rgba(124,58,237,0.05),rgba(192,132,252,0.05))",
        borderRadius: 12, padding: 12, borderLeft: "3px solid #7C3AED", marginBottom: 12,
      }}>
        "Live music, PK battles, and real connections. Join my room for an unforgettable experience! 🎙✨"
      </div>
      <ROW label="🌐 Language"   value="🇵🇰 Urdu · 🇬🇧 English" />
      <ROW label="🌍 Country"    value="🇵🇰 Pakistan" />
      <ROW label="🎂 Birthday"   value="April 15" />
      <ROW label="♈ Zodiac"     value="Aries" />
      <ROW label="⚧ Gender"     value="♂ Male" />
      <div style={{ paddingTop: 9 }}>
        <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>✍️ Signature</span>
        <div style={{
          marginTop: 4, fontSize: 13, fontStyle: "italic",
          color: "#7C3AED", fontWeight: 700,
        }}>"Music is the language of the soul 🎵"</div>
      </div>
    </div>
  );
}