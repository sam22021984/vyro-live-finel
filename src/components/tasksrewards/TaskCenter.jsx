import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const TASK_TABS = ["Daily", "Weekly", "Monthly"];

const TASKS = {
  Daily: [
    { id: 1, title: "Login Today", desc: "Log in to the app", icon: "🔑", reward: "50 Coins", progress: 1, total: 1, status: "completed", timeLeft: "Resets in 8h" },
    { id: 2, title: "Watch Live Stream", desc: "Watch any live stream for 5 mins", icon: "📺", reward: "100 Coins", progress: 3, total: 5, status: "in_progress", timeLeft: "8h left" },
    { id: 3, title: "Send a Gift", desc: "Send any gift to a host", icon: "🎁", reward: "80 Coins", progress: 0, total: 1, status: "not_started", timeLeft: "8h left" },
    { id: 4, title: "Recharge Coins", desc: "Top up your coin balance", icon: "🪙", reward: "200 Coins + VIP Day", progress: 0, total: 1, status: "not_started", timeLeft: "8h left" },
    { id: 5, title: "Follow 3 Users", desc: "Follow 3 new users today", icon: "👥", reward: "60 Coins", progress: 1, total: 3, status: "in_progress", timeLeft: "8h left" },
    { id: 6, title: "Join Audio Room", desc: "Join any audio room", icon: "🎙️", reward: "70 Coins", progress: 1, total: 1, status: "completed", timeLeft: "Done" },
    { id: 7, title: "Share App", desc: "Share VYRO with a friend", icon: "📤", reward: "150 Coins", progress: 0, total: 1, status: "not_started", timeLeft: "8h left" },
    { id: 8, title: "Invite Friend", desc: "Invite a new friend to join", icon: "🤝", reward: "300 Coins", progress: 0, total: 1, status: "not_started", timeLeft: "8h left" },
  ],
  Weekly: [
    { id: 9, title: "Complete 5 Live Hours", desc: "Spend 5 hours in live rooms", icon: "⏱️", reward: "500 Coins", progress: 2, total: 5, status: "in_progress", timeLeft: "3d left" },
    { id: 10, title: "Reach Gift Target", desc: "Send gifts worth 1000 coins", icon: "🎀", reward: "1 Diamond", progress: 400, total: 1000, status: "in_progress", timeLeft: "3d left" },
    { id: 11, title: "Gain 10 Followers", desc: "Get 10 new followers this week", icon: "📈", reward: "200 Coins", progress: 4, total: 10, status: "in_progress", timeLeft: "3d left" },
    { id: 12, title: "Participate in Event", desc: "Join any event this week", icon: "🎉", reward: "150 Coins", progress: 0, total: 1, status: "not_started", timeLeft: "3d left" },
  ],
  Monthly: [
    { id: 13, title: "Top Supporter", desc: "Be among top 100 gift senders", icon: "👑", reward: "5000 Coins + Badge", progress: 42, total: 100, status: "in_progress", timeLeft: "12d left" },
    { id: 14, title: "Top Host", desc: "Reach 50 hours of hosting", icon: "🎙️", reward: "10 Diamonds + Frame", progress: 18, total: 50, status: "in_progress", timeLeft: "12d left" },
    { id: 15, title: "Top Agency", desc: "Agency earns 10,000 diamonds", icon: "🏢", reward: "Agency Badge", progress: 0, total: 10000, status: "not_started", timeLeft: "12d left" },
    { id: 16, title: "VIP Spending Goal", desc: "Spend 5000 coins on VIP", icon: "💎", reward: "VIP 7 Days", progress: 1200, total: 5000, status: "in_progress", timeLeft: "12d left" },
  ],
};

const STATUS_STYLES = {
  not_started: { bg: "#F3F4F6", color: "#9CA3AF", label: "Start" },
  in_progress:  { bg: "#EFF6FF", color: "#1F6BFF", label: "Continue" },
  completed:    { bg: "#ECFDF5", color: "#10B981", label: "Claim" },
  claimed:      { bg: "#F0FDF4", color: "#6EE7B7", label: "Claimed ✓" },
  expired:      { bg: "#FEF2F2", color: "#EF4444", label: "Expired" },
};

function TaskCard({ task }) {
  const [status, setStatus] = useState(task.status);
  const s = STATUS_STYLES[status] || STATUS_STYLES.not_started;
  const pct = Math.min(100, Math.round((task.progress / task.total) * 100));

  const handleAction = () => {
    if (status === "completed") { setStatus("claimed"); toast.success(`🎉 ${task.reward} claimed!`); }
    else if (status === "not_started") { setStatus("in_progress"); toast.info("Task started!"); }
  };

  return (
    <motion.div whileTap={{ scale: 0.98 }} style={{
      background: "#fff", borderRadius: 16, padding: "14px",
      border: "1px solid #F0F0F8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, fontSize: 22,
          background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>{task.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{task.title}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
              background: s.bg, color: s.color,
            }}>{status.replace("_", " ").toUpperCase()}</span>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{task.desc}</div>
          {/* Progress */}
          {task.total > 1 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{task.progress}/{task.total}</span>
                <span style={{ fontSize: 10, color: "#6B7280" }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: "#F0F0F8", borderRadius: 3, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ height: "100%", background: "linear-gradient(90deg,#1F6BFF,#60A5FA)", borderRadius: 3 }} />
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FFC83D" }}>🏆 {task.reward}</span>
              <span style={{ fontSize: 10, color: "#D1D5DB" }}>·</span>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>{task.timeLeft}</span>
            </div>
            {status !== "claimed" && status !== "expired" && (
              <motion.button whileTap={{ scale: 0.92 }} onClick={handleAction}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                  border: "none", cursor: "pointer",
                  background: status === "completed" ? "linear-gradient(135deg,#10B981,#059669)" : status === "in_progress" ? "linear-gradient(135deg,#1F6BFF,#3B82F6)" : "#F3F4F6",
                  color: status === "not_started" ? "#9CA3AF" : "#fff",
                }}>{s.label}</motion.button>
            )}
            {status === "claimed" && <span style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>✓ Claimed</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TaskCenter() {
  const [tab, setTab] = useState("Daily");
  return (
    <div style={{ padding: "14px 14px 0" }}>
      {/* Summary strip */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 14,
      }}>
        {[{ label: "Completed", val: "3", color: "#10B981" }, { label: "In Progress", val: "5", color: "#1F6BFF" }, { label: "Rewards", val: "480", color: "#FFC83D", icon: "🪙" }].map(s => (
          <div key={s.label} style={{
            flex: 1, background: "#fff", borderRadius: 14, padding: "10px 8px", textAlign: "center",
            border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.icon || ""}{s.val}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Type tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {TASK_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: tab === t ? "#1F6BFF" : "#fff",
              color: tab === t ? "#fff" : "#9CA3AF",
              border: tab === t ? "none" : "1px solid #E5E7EB",
            }}>{t}</button>
        ))}
      </div>
      {TASKS[tab].map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}