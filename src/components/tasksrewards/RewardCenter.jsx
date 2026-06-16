/**
 * RewardCenter — Available / Claimed / Expired / Upcoming rewards
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REWARD_TABS = ["Available", "Claimed", "Expired", "Upcoming"];

const REWARDS = {
  Available: [
    { id: 1,  icon: "🪙", title: "500 Coins",         type: "Currency",  source: "Weekly Task",      color: "#FFC83D", claimable: true },
    { id: 2,  icon: "💎", title: "100 Diamonds",       type: "Currency",  source: "Login Streak",     color: "#60A5FA", claimable: true },
    { id: 3,  icon: "👑", title: "VIP Day (×1)",       type: "VIP",       source: "Event Reward",     color: "#A78BFA", claimable: true },
    { id: 4,  icon: "🎀", title: "VIP Frame",           type: "VIP",       source: "Achievement",      color: "#F472B6", claimable: false },
    { id: 5,  icon: "💬", title: "Bubble Chat Effect", type: "Special",   source: "Daily Task",       color: "#34D399", claimable: true },
  ],
  Claimed: [
    { id: 6,  icon: "🪙", title: "200 Coins",          type: "Currency",  source: "Daily Login",      color: "#FFC83D", claimable: false },
    { id: 7,  icon: "🏅", title: "First Gifter Badge", type: "Badge",     source: "Achievement",      color: "#F59E0B", claimable: false },
  ],
  Expired: [
    { id: 8,  icon: "⌛", title: "300 Coins",          type: "Currency",  source: "Expired Event",    color: "#D1D5DB", claimable: false },
  ],
  Upcoming: [
    { id: 9,  icon: "🎁", title: "Mega Gift Box",      type: "Special",   source: "Festival Event",   color: "#EC4899", claimable: false, time: "2 days" },
    { id: 10, icon: "💎", title: "500 Diamonds",        type: "Currency",  source: "Monthly Reward",   color: "#60A5FA", claimable: false, time: "5 days" },
  ],
};

export default function RewardCenter() {
  const [activeTab, setActiveTab] = useState("Available");
  const [rewards, setRewards] = useState(REWARDS);

  const handleClaim = (id) => {
    const reward = rewards.Available.find(r => r.id === id);
    if (!reward) return;
    setRewards(prev => ({
      ...prev,
      Available: prev.Available.filter(r => r.id !== id),
      Claimed: [{ ...reward, claimable: false }, ...prev.Claimed],
    }));
  };

  const list = rewards[activeTab] || [];

  return (
    <div style={{ padding: "16px 14px 0" }}>
      {/* Header stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Available", value: rewards.Available.length, color: "#1F6BFF", bg: "#EBF2FF" },
          { label: "Claimed",   value: rewards.Claimed.length,   color: "#10B981", bg: "#ECFDF5" },
          { label: "Upcoming",  value: rewards.Upcoming.length,  color: "#A78BFA", bg: "#F5F3FF" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: s.bg, borderRadius: 14, padding: "12px 10px",
            border: `1px solid ${s.color}22`, textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
        {REWARD_TABS.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.94 }}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800,
              border: "none", cursor: "pointer", flexShrink: 0,
              background: activeTab === t ? "#1F6BFF" : "#fff",
              color: activeTab === t ? "#fff" : "#9CA3AF",
              boxShadow: activeTab === t ? "0 4px 12px rgba(31,107,255,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>{t}</motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>No rewards here</div>
            </div>
          )}
          {list.map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: "#fff", borderRadius: 16, padding: "14px",
                border: "1px solid #F0F0F5", marginBottom: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${r.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                  {r.source}{r.time ? ` · Available in ${r.time}` : ""}
                </div>
                <div style={{
                  display: "inline-block", marginTop: 4, padding: "2px 8px",
                  borderRadius: 6, fontSize: 9, fontWeight: 700,
                  background: `${r.color}18`, color: r.color,
                }}>{r.type}</div>
              </div>
              {activeTab === "Available" && (
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={() => r.claimable && handleClaim(r.id)}
                  style={{
                    padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 800,
                    background: r.claimable ? "linear-gradient(135deg,#1F6BFF,#3B82F6)" : "#F3F4F6",
                    color: r.claimable ? "#fff" : "#9CA3AF",
                    border: "none", cursor: r.claimable ? "pointer" : "default",
                    boxShadow: r.claimable ? "0 4px 12px rgba(31,107,255,0.3)" : "none",
                  }}>
                  {r.claimable ? "Claim" : "Locked"}
                </motion.button>
              )}
              {activeTab === "Claimed" && (
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>✓ Claimed</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}