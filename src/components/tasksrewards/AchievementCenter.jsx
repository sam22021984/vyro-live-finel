import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CATEGORIES = ["User", "Host", "VIP", "Agency"];

const ACHIEVEMENTS = {
  User: [
    { id: 1, icon: "🎯", title: "First Recharge",    desc: "Recharge coins for the first time",   progress: 100, status: "unlocked", reward: "200 Coins" },
    { id: 2, icon: "🎁", title: "First Gift",         desc: "Send your first gift to a host",      progress: 100, status: "claimed",  reward: "Badge" },
    { id: 3, icon: "👥", title: "100 Followers",      desc: "Reach 100 followers",                 progress: 48,  status: "in_progress", reward: "Frame" },
    { id: 4, icon: "🌟", title: "1000 Followers",     desc: "Reach 1000 followers",                progress: 4.8, status: "locked",   reward: "Profile Theme" },
    { id: 5, icon: "💬", title: "Social Butterfly",   desc: "Send 100 chat messages",              progress: 73,  status: "in_progress", reward: "Bubble Chat" },
    { id: 6, icon: "📅", title: "7-Day Streak",       desc: "Check in 7 days in a row",            progress: 43,  status: "in_progress", reward: "100 Coins/day" },
  ],
  Host: [
    { id: 7, icon: "🎙️", title: "First Broadcast",   desc: "Start your first live room",          progress: 100, status: "unlocked", reward: "Host Badge" },
    { id: 8, icon: "⏱️", title: "10 Live Hours",      desc: "Accumulate 10 hours of broadcasting", progress: 60,  status: "in_progress", reward: "500 Coins" },
    { id: 9, icon: "🏆", title: "Top Host",            desc: "Reach Top 10 in monthly host rank",   progress: 0,   status: "locked",   reward: "Host Crown" },
    { id: 10, icon: "💎", title: "Diamond Earner",    desc: "Earn 100 diamonds",                   progress: 32,  status: "in_progress", reward: "5 Diamonds" },
  ],
  VIP: [
    { id: 11, icon: "👑", title: "VIP Member",        desc: "Purchase any VIP plan",               progress: 100, status: "claimed",  reward: "VIP Frame" },
    { id: 12, icon: "💎", title: "VIP Loyal",         desc: "Maintain VIP for 30 days",            progress: 40,  status: "in_progress", reward: "Special ID" },
    { id: 13, icon: "🌈", title: "VIP Legend",        desc: "Maintain VIP for 180 days",           progress: 7,   status: "locked",   reward: "Legendary Frame" },
  ],
  Agency: [
    { id: 14, icon: "🏢", title: "Agency Founder",    desc: "Create an agency",                    progress: 0,   status: "locked",   reward: "Agency Badge" },
    { id: 15, icon: "🤝", title: "Team Builder",      desc: "Recruit 5 hosts to your agency",      progress: 0,   status: "locked",   reward: "500 Diamonds" },
    { id: 16, icon: "🥇", title: "Top Agency",        desc: "Reach Top 5 agency rank",             progress: 0,   status: "locked",   reward: "Agency Trophy" },
  ],
};

const STATUS_CONFIG = {
  locked:      { color: "#9CA3AF", bg: "#F3F4F6", label: "Locked 🔒" },
  in_progress: { color: "#1F6BFF", bg: "#EFF6FF", label: "In Progress" },
  unlocked:    { color: "#10B981", bg: "#ECFDF5", label: "Claim 🎁" },
  claimed:     { color: "#6B7280", bg: "#F9FAFB", label: "Claimed ✓" },
};

export default function AchievementCenter() {
  const [category, setCategory] = useState("User");
  const [claimedIds, setClaimedIds] = useState(new Set([2]));

  const handleClaim = (ach) => {
    if (ach.status !== "unlocked" || claimedIds.has(ach.id)) return;
    setClaimedIds(prev => new Set([...prev, ach.id]));
    toast.success(`🏆 Achievement claimed: ${ach.title}!`);
  };

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {/* Stats strip */}
      <div style={{
        background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
        borderRadius: 18, padding: "16px 20px", marginBottom: 14,
        display: "flex", justifyContent: "space-around",
        boxShadow: "0 8px 24px rgba(31,107,255,0.25)",
      }}>
        {[{ v: "4", l: "Unlocked" }, { v: "5", l: "In Progress" }, { v: "7", l: "Locked" }].map(s => (
          <div key={s.l} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{s.v}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: category === c ? "#0D1B3E" : "#fff",
              color: category === c ? "#fff" : "#9CA3AF",
              border: category === c ? "none" : "1px solid #E5E7EB",
            }}>{c}</button>
        ))}
      </div>

      {ACHIEVEMENTS[category].map((ach, i) => {
        const isClaimed = claimedIds.has(ach.id) || ach.status === "claimed";
        const s = STATUS_CONFIG[isClaimed ? "claimed" : ach.status] || STATUS_CONFIG.locked;
        return (
          <motion.div key={ach.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10,
              border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              opacity: ach.status === "locked" ? 0.7 : 1,
            }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, fontSize: 22,
                background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                filter: ach.status === "locked" ? "grayscale(1)" : "none",
              }}>{ach.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{ach.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: s.bg, color: s.color }}>
                    {isClaimed ? "Claimed ✓" : s.label}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{ach.desc}</div>
                {/* Progress bar */}
                {ach.status !== "locked" && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 5, background: "#F0F0F8", borderRadius: 3, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${ach.progress}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ height: "100%", background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`, borderRadius: 3 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: 9, color: "#9CA3AF" }}>Progress: {ach.progress}%</span>
                      <span style={{ fontSize: 9, color: "#FFC83D", fontWeight: 700 }}>🏆 {ach.reward}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {ach.status === "unlocked" && !isClaimed && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <motion.button whileTap={{ scale: 0.92 }} onClick={() => handleClaim(ach)}
                  style={{
                    flex: 1, padding: "9px", borderRadius: 12, fontSize: 12, fontWeight: 800,
                    background: "linear-gradient(135deg,#10B981,#059669)",
                    color: "#fff", border: "none", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                  }}>🎁 Claim Reward</motion.button>
                <motion.button whileTap={{ scale: 0.92 }}
                  onClick={() => toast.info("Sharing achievement...")}
                  style={{
                    padding: "9px 14px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: "#F5F7FA", border: "1px solid #E5E7EB", color: "#6B7280", cursor: "pointer",
                  }}>📤 Share</motion.button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}