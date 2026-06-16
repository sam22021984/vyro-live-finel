import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TABS = ["Daily", "Weekly", "Monthly", "Agency", "Bonus"];

const CHART_DATA = {
  Daily:   [{ d: "Mon", v: 0 }, { d: "Tue", v: 0 }, { d: "Wed", v: 0 }, { d: "Thu", v: 0 }, { d: "Fri", v: 0 }, { d: "Sat", v: 0 }, { d: "Sun", v: 0 }],
  Weekly:  [{ d: "W1", v: 0 }, { d: "W2", v: 0 }, { d: "W3", v: 0 }, { d: "W4", v: 0 }],
  Monthly: [{ d: "Jan", v: 0 }, { d: "Feb", v: 0 }, { d: "Mar", v: 0 }, { d: "Apr", v: 0 }, { d: "May", v: 0 }, { d: "Jun", v: 0 }],
  Agency:  [{ d: "Mon", v: 0 }, { d: "Tue", v: 0 }, { d: "Wed", v: 0 }, { d: "Thu", v: 0 }, { d: "Fri", v: 0 }],
  Bonus:   [{ d: "Task", v: 0 }, { d: "Event", v: 0 }, { d: "Daily", v: 0 }, { d: "Rank", v: 0 }],
};

const STATS = [
  { label: "Coins Earned",       value: "0 🪙",  color: "#FFC83D" },
  { label: "Diamonds Earned",    value: "0 💎",  color: "#60A5FA" },
  { label: "USD Equivalent",     value: "$0.00", color: "#10B981" },
  { label: "Agency Commission",  value: "0 💎",  color: "#8B5CF6" },
  { label: "Bonus Rewards",      value: "0 🪙",  color: "#EC4899" },
];

const SOURCES = [
  { icon: "🎙️", label: "Live Streaming",   amount: "0 💎", pct: 0 },
  { icon: "🎁", label: "Gifts Received",    amount: "0 💎", pct: 0 },
  { icon: "🏢", label: "Agency Cut",        amount: "0 💎", pct: 0 },
  { icon: "🏆", label: "Event Rewards",     amount: "0 🪙", pct: 0 },
  { icon: "✅", label: "Task Bonuses",      amount: "0 🪙", pct: 0 },
];

export default function FinanceEarnings() {
  const [tab, setTab] = useState("Daily");

  return (
    <div style={{ padding: "14px" }}>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
        {/* Withdraw CTA */}
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => toast.info("Opening withdrawal...")}
          style={{ background: "linear-gradient(135deg,#10B981,#34D399)", borderRadius: 14, padding: "12px 14px", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>💸</div>
          <div style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>Withdraw Now</div>
        </motion.button>
      </div>

      {/* Period Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "7px 2px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent", color: tab === t ? "#EC4899" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📈 Earnings Chart</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={CHART_DATA[tab]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F8" />
            <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            <Bar dataKey="v" fill="#EC4899" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Earning Sources */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>💡 Earning Sources</div>
        {SOURCES.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < SOURCES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
              <div style={{ height: 4, background: "#F0F0F8", borderRadius: 2, marginTop: 4 }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: "#EC4899", borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#EC4899" }}>{s.amount}</div>
          </div>
        ))}
      </div>

      {/* Export */}
      <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.success("Report generated successfully.")}
        style={{ width: "100%", padding: "13px", borderRadius: 14, background: "#fff", border: "1px solid #BFDBFE", fontWeight: 800, cursor: "pointer", color: "#1F6BFF", fontSize: 13 }}>
        📄 Export Report PDF
      </motion.button>
    </div>
  );
}