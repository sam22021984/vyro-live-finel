import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const BALANCES = [
  { label: "Coins Balance",          value: "0",     icon: "🪙", color: "#FFC83D" },
  { label: "Diamonds Balance",       value: "0 💎",   icon: "💎", color: "#60A5FA" },
  { label: "CP Balance",             value: "0 CP",   icon: "🔷", color: "#8B5CF6" },
  { label: "Cash Balance",           value: "$0.00",  icon: "💵", color: "#10B981" },
  { label: "Pending Earnings",       value: "0 💎",   icon: "⏳", color: "#F59E0B" },
  { label: "Available Withdrawal",   value: "$0.00",  icon: "💸", color: "#EC4899" },
];

const RECENT_TXN = [
  { icon: "🎁", label: "Gift Sent to @luna",       amount: "-200 🪙", date: "Today 22:14",   color: "#EF4444" },
  { icon: "💰", label: "Recharge — $5 Package",    amount: "+120,000 🪙", date: "Today 18:30", color: "#10B981" },
  { icon: "💎", label: "Gift Received from @rex",  amount: "+150 💎", date: "Yesterday",     color: "#10B981" },
  { icon: "💸", label: "Withdrawal Request",        amount: "-1000 💎", date: "Jun 13",       color: "#EF4444" },
];

export default function FinanceWallet() {
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.success("Wallet updated successfully."); }, 1200);
  };

  return (
    <div style={{ padding: "14px" }}>

      {/* Balance Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {BALANCES.map((b, i) => (
          <motion.div key={b.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: "#fff", borderRadius: 16, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{b.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: b.color }}>{b.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{b.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Recharge",    icon: "⚡", color: "#FFC83D", bg: "#FFFBEB" },
          { label: "Withdraw",    icon: "💸", color: "#10B981", bg: "#ECFDF5" },
          { label: "Transfer",    icon: "↗️", color: "#1F6BFF", bg: "#EFF6FF" },
        ].map(a => (
          <motion.button key={a.label} whileTap={{ scale: 0.93 }}
            onClick={() => toast.info(`Opening ${a.label}...`)}
            style={{ background: a.bg, borderRadius: 14, padding: "12px 6px", border: `1px solid ${a.color}33`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 22 }}>{a.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: a.color }}>{a.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Wallet Stats */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 Wallet Statistics</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Coins Spent",   value: "0" },
            { label: "Coins Earned",  value: "0" },
            { label: "Gifts Sent",    value: "0" },
            { label: "Gifts Received",value: "0" },
          ].map(s => (
            <div key={s.label} style={{ background: "#F5F7FA", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1F6BFF" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>🕒 Recent Transactions</div>
          <button onClick={() => toast.info("Opening history...")}
            style={{ fontSize: 11, fontWeight: 700, color: "#1F6BFF", background: "none", border: "none", cursor: "pointer" }}>View All</button>
        </div>
        {RECENT_TXN.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < RECENT_TXN.length - 1 ? "1px solid #F0F0F8" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{t.label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{t.date}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, color: t.color }}>{t.amount}</div>
          </div>
        ))}
      </div>

      {/* Refresh */}
      <motion.button whileTap={{ scale: 0.96 }} onClick={refresh}
        style={{ width: "100%", padding: "13px", borderRadius: 14, background: refreshing ? "#F0F7FF" : "#fff", border: "1px solid #BFDBFE", fontWeight: 800, cursor: "pointer", color: "#1F6BFF", fontSize: 13 }}>
        {refreshing ? "Syncing..." : "🔄 Refresh Balance"}
      </motion.button>
    </div>
  );
}