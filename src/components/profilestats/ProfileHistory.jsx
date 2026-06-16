import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const HISTORY_TYPES = ["All", "Login", "Recharge", "Withdrawal", "Gift", "Live", "PK", "Task", "Reward"];

const FILTERS = ["Today", "7 Days", "30 Days", "All Time"];

const MOCK_HISTORY = [
  { id: 1, type: "Login",      icon: "📅", activity: "Daily Login",              amount: "+50 XP",     status: "Success", date: "2026-06-16 08:00" },
  { id: 2, type: "Gift",       icon: "🎁", activity: "Sent Gift to @luna",        amount: "-200 coins", status: "Success", date: "2026-06-15 22:14" },
  { id: 3, type: "Recharge",   icon: "💰", activity: "Coin Package #3",           amount: "+5000 coins",status: "Success", date: "2026-06-15 18:30" },
  { id: 4, type: "Live",       icon: "🎙️", activity: "Joined Dragon Room",        amount: "+20 XP",     status: "Success", date: "2026-06-15 15:00" },
  { id: 5, type: "PK",         icon: "⚔️", activity: "PK Battle vs @storm",       amount: "+150 XP",    status: "Won",     date: "2026-06-14 21:00" },
  { id: 6, type: "Task",       icon: "✅", activity: "Daily Check-in Task",        amount: "+100 coins", status: "Claimed", date: "2026-06-14 09:00" },
  { id: 7, type: "Withdrawal", icon: "💸", activity: "Withdraw 1000 Diamonds",    amount: "-1000 💎",   status: "Pending", date: "2026-06-13 12:00" },
  { id: 8, type: "Reward",     icon: "🏆", activity: "Weekly Rank Reward",        amount: "+500 coins", status: "Success", date: "2026-06-12 00:00" },
];

const STATUS_COLOR = { Success: "#10B981", Won: "#1F6BFF", Claimed: "#8B5CF6", Pending: "#F59E0B", Failed: "#EF4444" };
const STATUS_BG    = { Success: "#ECFDF5", Won: "#EFF6FF", Claimed: "#F5F3FF", Pending: "#FFFBEB", Failed: "#FEF2F2" };

export default function ProfileHistory() {
  const [type, setType]     = useState("All");
  const [filter, setFilter] = useState("All Time");

  const filtered = type === "All" ? MOCK_HISTORY : MOCK_HISTORY.filter(h => h.type === type);

  return (
    <div style={{ padding: "14px" }}>
      {/* Period Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ flex: 1, padding: "7px 4px", borderRadius: 20, fontSize: 10, fontWeight: 800, cursor: "pointer", border: "none",
              background: filter === f ? "#0D1B3E" : "#fff",
              color: filter === f ? "#fff" : "#6B7280",
              boxShadow: filter === f ? "0 4px 10px rgba(13,27,62,0.2)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {HISTORY_TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
              background: type === t ? "#10B981" : "#fff",
              color: type === t ? "#fff" : "#6B7280",
              boxShadow: type === t ? "0 4px 12px rgba(16,185,129,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Export Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button onClick={() => toast.success("Report exported as PDF")}
          style={{ padding: "7px 16px", borderRadius: 20, background: "#F0F7FF", border: "1px solid #BFDBFE", fontSize: 11, fontWeight: 800, cursor: "pointer", color: "#1F6BFF" }}>
          📄 Export PDF
        </button>
      </div>

      {/* History List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((h, i) => (
          <motion.div key={h.id}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{h.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{h.activity}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{h.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: h.amount.startsWith("+") ? "#10B981" : "#EF4444" }}>{h.amount}</div>
              <div style={{ marginTop: 3, padding: "2px 8px", borderRadius: 8, fontSize: 9, fontWeight: 800, background: STATUS_BG[h.status], color: STATUS_COLOR[h.status] }}>{h.status}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>No history found</div>
        </div>
      )}
    </div>
  );
}