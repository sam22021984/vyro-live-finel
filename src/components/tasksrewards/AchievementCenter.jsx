/**
 * AchievementCenter — User / Host / VIP / Agency achievements
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2, Clock } from "lucide-react";

const ACH_TABS = ["User", "Host", "VIP", "Agency"];

const ACHIEVEMENTS = {
  User: [
    { id: 1,  icon: "🔐", title: "First Login",       desc: "Log in for the first time",         progress: 100, status: "claimed",    reward: "50 Coins" },
    { id: 2,  icon: "💳", title: "First Recharge",    desc: "Make your first coin purchase",      progress: 100, status: "unlocked",   reward: "200 Coins" },
    { id: 3,  icon: "🎁", title: "First Gift",        desc: "Send your first gift",               progress: 100, status: "unlocked",   reward: "100 Coins" },
    { id: 4,  icon: "👥", title: "100 Followers",     desc: "Reach 100 followers",                progress: 48,  status: "in_progress",reward: "500 Coins" },
    { id: 5,  icon: "🌟", title: "1,000 Followers",   desc: "Reach 1,000 followers",              progress: 4.8, status: "in_progress",reward: "VIP Day" },
    { id: 6,  icon: "👑", title: "VIP Member",        desc: "Activate any VIP tier",              progress: 0,   status: "locked",     reward: "VIP Frame" },
    { id: 7,  icon: "🏆", title: "Top Gifter",        desc: "Rank in top 10 gifters",             progress: 0,   status: "locked",     reward: "Gold Badge" },
  ],
  Host: [
    { id: 8,  icon: "🎙️", title: "First Stream",     desc: "Host your first live room",          progress: 100, status: "claimed",    reward: "100 Coins" },
    { id: 9,  icon: "⏱️", title: "10h Streamed",     desc: "Accumulate 10 hours of streaming",   progress: 100, status: "unlocked",   reward: "500 Coins" },
    { id: 10, icon: "🌐", title: "50h Streamed",      desc: "Accumulate 50 hours of streaming",   progress: 44,  status: "in_progress",reward: "Host Medal" },
    { id: 11, icon: "💎", title: "10K Diamonds",      desc: "Earn 10,000 diamonds from gifts",    progress: 28,  status: "in_progress",reward: "Host Frame" },
    { id: 12, icon: "👑", title: "Top Host",          desc: "Rank #1 host in any week",           progress: 0,   status: "locked",     reward: "Crown Badge" },
  ],
  VIP: [
    { id: 13, icon: "⭐", title: "VIP Starter",       desc: "Activate VIP 1",                     progress: 0,   status: "locked",     reward: "VIP Badge" },
    { id: 14, icon: "💫", title: "VIP Elite",         desc: "Activate VIP 5",                     progress: 0,   status: "locked",     reward: "Elite Frame" },
    { id: 15, icon: "🔥", title: "30-Day VIP",        desc: "Maintain VIP for 30 days",           progress: 0,   status: "locked",     reward: "Special Effect" },
  ],
  Agency: [
    { id: 16, icon: "🏢", title: "Agency Created",    desc: "Create your agency",                 progress: 0,   status: "locked",     reward: "Agency Badge" },
    { id: 17, icon: "👥", title: "10 Hosts",          desc: "Agency reaches 10 hosts",            progress: 0,   status: "locked",     reward: "500 Diamonds" },
    { id: 18, icon: "💰", title: "100K Diamonds",     desc: "Agency earns 100K diamonds",         progress: 0,   status: "locked",     reward: "Platinum Badge" },
  ],
};

const STATUS_CONFIG = {
  locked:      { color: "#D1D5DB", bg: "#F9FAFB",  label: "Locked",     icon: Lock },
  in_progress: { color: "#1F6BFF", bg: "#EBF2FF",  label: "In Progress",icon: Clock },
  unlocked:    { color: "#10B981", bg: "#ECFDF5",  label: "Claim",      icon: CheckCircle2 },
  claimed:     { color: "#9CA3AF", bg: "#F3F4F6",  label: "Claimed ✓",  icon: CheckCircle2 },
};

export default function AchievementCenter() {
  const [activeTab, setActiveTab] = useState("User");
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);

  const handleClaim = (id) => {
    setAchievements(prev => {
      const updated = { ...prev };
      for (const tab of ACH_TABS) {
        updated[tab] = prev[tab].map(a => a.id === id ? { ...a, status: "claimed" } : a);
      }
      return updated;
    });
  };

  const list = achievements[activeTab] || [];
  const unlockedCount = list.filter(a => a.status === "unlocked").length;

  return (
    <div style={{ padding: "16px 14px 0" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#0D1B3E,#1F3A7A)",
        borderRadius: 18, padding: "16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14, boxShadow: "0 6px 20px rgba(13,27,62,0.25)",
      }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Your Achievements</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
            {list.filter(a => a.status !== "locked").length}/{list.length}
          </div>
        </div>
        {unlockedCount > 0 && (
          <div style={{
            background: "#FFC83D", borderRadius: 12, padding: "6px 14px",
            fontSize: 11, fontWeight: 800, color: "#0D1B3E",
          }}>
            {unlockedCount} to claim!
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }}>
        {ACH_TABS.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.94 }}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 800,
              border: "none", cursor: "pointer", flexShrink: 0,
              background: activeTab === t ? "#1F6BFF" : "#fff",
              color: activeTab === t ? "#fff" : "#9CA3AF",
              boxShadow: activeTab === t ? "0 4px 12px rgba(31,107,255,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>{t}</motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {list.map((ach, i) => {
            const cfg = STATUS_CONFIG[ach.status];
            const pct = Math.min(100, Math.round(ach.progress));
            const locked = ach.status === "locked";

            return (
              <motion.div key={ach.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: "#fff", borderRadius: 16, padding: "14px",
                  border: `1px solid ${locked ? "#F0F0F5" : cfg.color + "33"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  marginBottom: 10,
                  opacity: locked ? 0.6 : 1,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: locked ? "#F3F4F6" : `${cfg.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    filter: locked ? "grayscale(1)" : "none",
                  }}>{ach.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: locked ? "#9CA3AF" : "#0D1B3E" }}>
                        {ach.title}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#FFC83D" }}>+{ach.reward}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{ach.desc}</div>

                    {!locked && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Progress</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color }}>{pct}%</span>
                        </div>
                        <div style={{ height: 5, background: "#F0F0F5", borderRadius: 3, overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            style={{
                              height: "100%", borderRadius: 3,
                              background: pct === 100 ? "#10B981" : `linear-gradient(90deg,${cfg.color},${cfg.color}aa)`,
                            }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {ach.status === "unlocked" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <motion.button whileTap={{ scale: 0.9 }}
                      onClick={() => handleClaim(ach.id)}
                      style={{
                        padding: "8px 20px", borderRadius: 10, fontSize: 12, fontWeight: 800,
                        background: "linear-gradient(135deg,#10B981,#34D399)",
                        color: "#fff", border: "none", cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
                      }}>Claim Reward</motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}