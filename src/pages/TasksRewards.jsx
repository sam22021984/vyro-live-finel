/**
 * Tasks & Rewards Center
 * Flutter: lib/features/tasks/screens/tasks_rewards_screen.dart
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Gift, CheckSquare, Calendar, Zap, Trophy } from "lucide-react";
import TaskCenter from "@/components/tasksrewards/TaskCenter";
import RewardCenter from "@/components/tasksrewards/RewardCenter";
import DailyBonus from "@/components/tasksrewards/DailyBonus";
import EventsCenter from "@/components/tasksrewards/EventsCenter";
import AchievementCenter from "@/components/tasksrewards/AchievementCenter";

const TABS = [
  { id: "tasks",        label: "Tasks",       icon: CheckSquare },
  { id: "rewards",      label: "Rewards",     icon: Gift },
  { id: "daily",        label: "Daily",       icon: Calendar },
  { id: "events",       label: "Events",      icon: Zap },
  { id: "achievements", label: "Achievements",icon: Trophy },
];

export default function TasksRewards() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#F5F7FA",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid rgba(31,107,255,0.08)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#F5F7FA", border: "1px solid #E5E7EB",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
          <ChevronLeft size={18} color="#1F6BFF" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>Tasks & Rewards</div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>Complete tasks, earn amazing rewards</div>
        </div>
        <div style={{
          padding: "5px 12px", borderRadius: 20,
          background: "linear-gradient(135deg,#FFC83D22,#FFC83D44)",
          border: "1px solid rgba(255,200,61,0.4)",
          fontSize: 11, fontWeight: 800, color: "#B8860B",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          🪙 2,480
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #F0F0F5",
        display: "flex",
        overflowX: "auto",
        padding: "0 8px",
        scrollbarWidth: "none",
        gap: 2,
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <motion.button key={tab.id} whileTap={{ scale: 0.94 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 3, padding: "10px 14px", border: "none", cursor: "pointer",
                background: "none", flexShrink: 0,
                borderBottom: active ? "2.5px solid #1F6BFF" : "2.5px solid transparent",
              }}>
              <Icon size={16} color={active ? "#1F6BFF" : "#9CA3AF"} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? "#1F6BFF" : "#9CA3AF" }}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            {activeTab === "tasks"        && <TaskCenter />}
            {activeTab === "rewards"      && <RewardCenter />}
            {activeTab === "daily"        && <DailyBonus />}
            {activeTab === "events"       && <EventsCenter />}
            {activeTab === "achievements" && <AchievementCenter />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}