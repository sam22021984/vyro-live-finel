const ROWS = [
  { label: "📅 Join Date",              value: "Jan 12, 2023"  },
  { label: "🕐 Last Active",            value: "Today, 04:10"  },
  { label: "⏱ Total Live Hours",       value: "1,240 hrs"     },
  { label: "⚔️ Total PK Battles",       value: "842"           },
  { label: "🏆 PK Wins",               value: "617"           },
  { label: "❌ PK Losses",             value: "225"           },
  { label: "📈 Win Rate",              value: "73.3% 🔥"      },
  { label: "🔥 Best PK Streak",        value: "14 Wins"       },
  { label: "🎁 Gifts Sent",            value: "8,420"         },
  { label: "🎀 Gifts Received",        value: "15,240"        },
  { label: "🪙 Coins Spent",           value: "2.1M"          },
  { label: "💎 Diamonds Purchased",    value: "48,200"        },
  { label: "❤️ Followers Earned",      value: "124K"          },
];

const ROW = ({ label, value, last }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: last ? "none" : "1px solid rgba(0,0,0,0.05)",
  }}>
    <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 800 }}>{value}</span>
  </div>
);

export default function MeHistory() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", marginBottom: 4 }}>📋 Profile History</div>
      {ROWS.map((r, i) => <ROW key={r.label} label={r.label} value={r.value} last={i === ROWS.length - 1} />)}
    </div>
  );
}