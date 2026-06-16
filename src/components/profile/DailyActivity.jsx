const RANKS = [
  { label: "Daily Rank",   value: "#142",   color: "#F59E0B" },
  { label: "Weekly Rank",  value: "#87",    color: "#7C3AED" },
  { label: "Monthly Rank", value: "#34",    color: "#EC4899" },
];

const TODAY = [
  { icon: "⏱", label: "Live Hours",      value: "3h 24m" },
  { icon: "🎁", label: "Gifts Received",  value: "284"    },
  { icon: "❤️", label: "New Followers",   value: "+128"   },
];

export default function DailyActivity() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)",
      borderRadius: 20, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a2e", marginBottom: 10 }}>📊 Daily Activity</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
        {TODAY.map(t => (
          <div key={t.label} style={{
            background: "linear-gradient(135deg,#F0F4FF,#EDE9FE)", borderRadius: 12, padding: "10px 6px", textAlign: "center",
          }}>
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#7C3AED" }}>{t.value}</div>
            <div style={{ fontSize: 9, color: "#6B7280", fontWeight: 600 }}>{t.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {RANKS.map(r => (
          <div key={r.label} style={{
            background: `${r.color}10`, borderRadius: 12, padding: "10px 6px", textAlign: "center",
            border: `1px solid ${r.color}25`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: r.color }}>{r.value}</div>
            <div style={{ fontSize: 9, color: "#6B7280", fontWeight: 600 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}