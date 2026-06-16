/**
 * TaskCenter — Daily / Weekly / Monthly tasks
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight, CheckCircle2, Circle, AlertCircle } from "lucide-react";

const TASK_TABS = ["Daily", "Weekly", "Monthly"];

const TASKS = {
  Daily: [
    { id: 1, title: "Login Today",         desc: "Log in to the app",              icon: "🔐", reward: "20 Coins",  progress: 1, total: 1, status: "completed" },
    { id: 2, title: "Watch Live Stream",   desc: "Watch any live room for 5 mins", icon: "📺", reward: "50 Coins",  progress: 3, total: 5, status: "in_progress" },
    { id: 3, title: "Send Gifts",          desc: "Send gifts to any host",         icon: "🎁", reward: "80 Coins",  progress: 0, total: 3, status: "not_started" },
    { id: 4, title: "Follow Users",        desc: "Follow 2 new users",             icon: "👥", reward: "30 Coins",  progress: 2, total: 2, status: "completed" },
    { id: 5, title: "Join Audio Room",     desc: "Join any audio room",            icon: "🎙️", reward: "40 Coins",  progress: 0, total: 1, status: "not_started" },
    { id: 6, title: "Share App",           desc: "Share app with a friend",        icon: "🔗", reward: "60 Coins",  progress: 0, total: 1, status: "not_started" },
    { id: 7, title: "Invite Friends",      desc: "Invite 1 friend to join",        icon: "📩", reward: "100 Coins", progress: 0, total: 1, status: "not_started" },
    { id: 8, title: "Recharge Coins",      desc: "Make any coin purchase",         icon: "💳", reward: "💎 50 Diamonds", progress: 0, total: 1, status: "expired" },
  ],
  Weekly: [
    { id: 9,  title: "Complete 3h Live",   desc: "Accumulate 3 hours in live rooms",icon: "⏱️", reward: "500 Coins", progress: 1.5, total: 3, status: "in_progress" },
    { id: 10, title: "Reach Gift Target",  desc: "Send gifts worth 300 coins",      icon: "🎀", reward: "200 Coins", progress: 120, total: 300, status: "in_progress" },
    { id: 11, title: "Gain 5 Followers",   desc: "Get 5 new followers this week",   icon: "💫", reward: "1 VIP Day", progress: 3, total: 5, status: "in_progress" },
    { id: 12, title: "Participate Events", desc: "Join 2 platform events",          icon: "🎪", reward: "300 Coins", progress: 0, total: 2, status: "not_started" },
  ],
  Monthly: [
    { id: 13, title: "Top Supporter",      desc: "Be in top 100 gift senders",      icon: "👑", reward: "5,000 Coins",   progress: 42, total: 100, status: "in_progress" },
    { id: 14, title: "Top Host",           desc: "Reach 50h total streaming",       icon: "🎙️", reward: "💎 2,000 Diamonds", progress: 22, total: 50, status: "in_progress" },
    { id: 15, title: "VIP Spending Goal",  desc: "Spend 10,000 coins on VIP",       icon: "💎", reward: "VIP Frame",    progress: 3200, total: 10000, status: "in_progress" },
    { id: 16, title: "Top Agency",         desc: "Agency earns 100K diamonds",      icon: "🏆", reward: "Agency Badge",  progress: 0, total: 100000, status: "not_started" },
  ],
};

const STATUS_CONFIG = {
  not_started: { label: "Start",        color: "#1F6BFF", bg: "#EBF2FF" },
  in_progress:  { label: "Go Complete", color: "#F59E0B", bg: "#FFFBEB" },
  completed:    { label: "Claim",       color: "#10B981", bg: "#ECFDF5" },
  claimed:      { label: "Claimed ✓",   color: "#9CA3AF", bg: "#F3F4F6" },
  expired:      { label: "Expired",     color: "#EF4444", bg: "#FEF2F2" },
};

function TaskCard({ task, onClaim }) {
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.not_started;
  const pct = Math.min(100, Math.round((task.progress / task.total) * 100));

  return (
    <motion.div whileTap={{ scale: 0.98 }}
      style={{
        background: "#fff", borderRadius: 16, padding: "14px",
        border: "1px solid #F0F0F5",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        marginBottom: 10,
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>{task.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{task.title}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#FFC83D" }}>+{task.reward}</span>
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{task.desc}</div>

          {/* Progress bar */}
          {task.status !== "not_started" && task.status !== "expired" && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                  {task.progress}/{task.total}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#1F6BFF" }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: "#F0F0F5", borderRadius: 3, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    height: "100%", borderRadius: 3,
                    background: pct === 100 ? "#10B981" : "linear-gradient(90deg,#1F6BFF,#60A5FA)",
                  }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, gap: 8 }}>
        <motion.button whileTap={{ scale: 0.92 }}
          onClick={() => task.status === "completed" && onClaim(task.id)}
          style={{
            padding: "7px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800,
            background: cfg.bg, color: cfg.color,
            border: `1px solid ${cfg.color}33`, cursor: "pointer",
          }}>
          {cfg.label}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function TaskCenter() {
  const [activeTab, setActiveTab] = useState("Daily");
  const [tasks, setTasks] = useState(TASKS);
  const [claimed, setClaimed] = useState([]);

  const handleClaim = (id) => {
    setTasks(prev => {
      const updated = { ...prev };
      for (const tab of TASK_TABS) {
        updated[tab] = prev[tab].map(t => t.id === id ? { ...t, status: "claimed" } : t);
      }
      return updated;
    });
    setClaimed(prev => [...prev, id]);
  };

  const tabTasks = tasks[activeTab] || [];
  const completedCount = tabTasks.filter(t => t.status === "completed" || t.status === "claimed").length;

  return (
    <div style={{ padding: "16px 14px 0" }}>
      {/* Summary banner */}
      <div style={{
        background: "linear-gradient(135deg,#1F6BFF,#3B82F6)",
        borderRadius: 16, padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14, boxShadow: "0 6px 20px rgba(31,107,255,0.25)",
      }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Today's Progress</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
            {completedCount}/{tabTasks.length} <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>tasks</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Potential Reward</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#FFC83D" }}>🪙 480</div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", background: "#fff", borderRadius: 14, padding: 4, gap: 4, marginBottom: 14, border: "1px solid #F0F0F5" }}>
        {TASK_TABS.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.94 }}
            onClick={() => setActiveTab(t)}
            style={{
              flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 12, fontWeight: 800,
              border: "none", cursor: "pointer",
              background: activeTab === t ? "linear-gradient(135deg,#1F6BFF,#3B82F6)" : "none",
              color: activeTab === t ? "#fff" : "#9CA3AF",
              boxShadow: activeTab === t ? "0 4px 12px rgba(31,107,255,0.3)" : "none",
            }}>{t}</motion.button>
        ))}
      </div>

      {tabTasks.map(task => (
        <TaskCard key={task.id} task={task} onClaim={handleClaim} />
      ))}
    </div>
  );
}