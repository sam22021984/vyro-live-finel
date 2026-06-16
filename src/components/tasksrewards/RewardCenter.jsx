import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SECTIONS = ["Available", "Claimed", "Expired", "Upcoming"];

const REWARDS = {
  Available: [
    { id: 1, icon: "🪙", title: "500 Coins", type: "Currency", source: "Task Completion", expires: "2d left" },
    { id: 2, icon: "💎", title: "2 Diamonds", type: "Currency", source: "Weekly Task", expires: "5d left" },
    { id: 3, icon: "👑", title: "VIP 3 Days", type: "VIP", source: "Event Reward", expires: "1d left" },
    { id: 4, icon: "🖼️", title: "Golden Frame", type: "VIP Frame", source: "Achievement", expires: "7d left" },
    { id: 5, icon: "💬", title: "Bubble Chat", type: "Special", source: "Daily Bonus", expires: "3d left" },
    { id: 6, icon: "🏅", title: "Top Gifter Badge", type: "Badge", source: "Monthly Task", expires: "10d left" },
  ],
  Claimed: [
    { id: 7, icon: "🪙", title: "200 Coins", type: "Currency", source: "Daily Login", claimedAt: "Today" },
    { id: 8, icon: "⭐", title: "500 XP", type: "XP", source: "Task", claimedAt: "Yesterday" },
    { id: 9, icon: "🎨", title: "Profile Theme", type: "Special", source: "Event", claimedAt: "Jun 14" },
  ],
  Expired: [
    { id: 10, icon: "🪙", title: "300 Coins", type: "Currency", source: "Event", expiredAt: "Jun 10" },
    { id: 11, icon: "💎", title: "1 Diamond", type: "Currency", source: "Task", expiredAt: "Jun 8" },
  ],
  Upcoming: [
    { id: 12, icon: "🎁", title: "Mystery Box", type: "Special", availableIn: "2d", hint: "Complete 7-day streak" },
    { id: 13, icon: "👑", title: "VIP 7 Days", type: "VIP", availableIn: "5d", hint: "Reach monthly task goal" },
  ],
};

const TYPE_COLORS = {
  Currency: "#FFC83D", VIP: "#9333EA", "VIP Frame": "#7C3AED",
  Special: "#EC4899", Badge: "#1F6BFF", XP: "#10B981",
};

export default function RewardCenter() {
  const [section, setSection] = useState("Available");
  const [claimed, setClaimed] = useState({});

  const handleClaim = (id, title) => {
    setClaimed(c => ({ ...c, [id]: true }));
    toast.success(`🎉 ${title} added to your account!`);
  };

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: section === s ? "#1F6BFF" : "#fff",
              color: section === s ? "#fff" : "#9CA3AF",
              border: section === s ? "none" : "1px solid #E5E7EB",
            }}>{s}</button>
        ))}
      </div>

      {REWARDS[section].map((r, i) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          style={{
            background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10,
            border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, fontSize: 24,
            background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{r.title}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 3 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                background: `${TYPE_COLORS[r.type] || "#9CA3AF"}22`,
                color: TYPE_COLORS[r.type] || "#9CA3AF",
              }}>{r.type}</span>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>From: {r.source || r.claimedAt || r.expiredAt}</span>
            </div>
            {r.expires && <div style={{ fontSize: 10, color: "#EF4444", marginTop: 2 }}>⏰ {r.expires}</div>}
            {r.availableIn && <div style={{ fontSize: 10, color: "#1F6BFF", marginTop: 2 }}>🔒 Available in {r.availableIn} · {r.hint}</div>}
          </div>
          {section === "Available" && (
            claimed[r.id]
              ? <span style={{ fontSize: 11, color: "#10B981", fontWeight: 800 }}>✓ Claimed</span>
              : (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleClaim(r.id, r.title)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                    background: "linear-gradient(135deg,#1F6BFF,#60A5FA)",
                    color: "#fff", border: "none", cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(31,107,255,0.3)",
                  }}>Claim</motion.button>
              )
          )}
          {section === "Claimed" && <span style={{ fontSize: 18 }}>✅</span>}
          {section === "Expired"  && <span style={{ fontSize: 18 }}>❌</span>}
          {section === "Upcoming" && <span style={{ fontSize: 18 }}>🔒</span>}
        </motion.div>
      ))}
    </div>
  );
}