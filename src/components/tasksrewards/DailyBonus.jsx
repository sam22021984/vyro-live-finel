import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const DAYS = [
  { day: 1, reward: "50 Coins",   icon: "🪙",  mega: false },
  { day: 2, reward: "100 Coins",  icon: "🪙",  mega: false },
  { day: 3, reward: "1 Diamond",  icon: "💎",  mega: false },
  { day: 4, reward: "200 Coins",  icon: "🪙",  mega: false },
  { day: 5, reward: "VIP 1 Day",  icon: "👑",  mega: false },
  { day: 6, reward: "300 Coins",  icon: "🪙",  mega: false },
  { day: 7, reward: "Mega Reward",icon: "🎁",  mega: true  },
];

export default function DailyBonus() {
  const [claimedDay, setClaimedDay] = useState(3); // simulated: days 1-3 already claimed
  const [checkedIn, setCheckedIn] = useState(false);
  const [showMega, setShowMega] = useState(false);
  const todayDay = 4;

  const handleCheckIn = () => {
    if (checkedIn) return;
    setClaimedDay(todayDay);
    setCheckedIn(true);
    toast.success("✅ Daily check-in complete! +200 Coins");
  };

  return (
    <div style={{ padding: "14px" }}>
      {/* Streak Banner */}
      <div style={{
        background: "linear-gradient(135deg,#1F6BFF,#3B82F6)",
        borderRadius: 20, padding: "18px 20px", marginBottom: 16,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 8px 24px rgba(31,107,255,0.3)",
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>🔥 {claimedDay} Day Streak</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
            {claimedDay >= 7 ? "Amazing! You hit the weekly bonus!" : `${7 - claimedDay} more days for Mega Reward!`}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>Day 7 Bonus</div>
        </div>
      </div>

      {/* 7-day Calendar */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "16px",
        border: "1px solid #F0F0F8", boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 14 }}>Weekly Rewards</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {DAYS.map(d => {
            const isClaimed = d.day <= claimedDay;
            const isToday   = d.day === todayDay;
            const isFuture  = d.day > todayDay;
            return (
              <motion.div key={d.day} whileTap={isToday && !checkedIn ? { scale: 0.92 } : {}}
                onClick={() => isToday && !checkedIn && handleCheckIn()}
                style={{
                  borderRadius: 14, padding: "10px 6px", textAlign: "center",
                  cursor: isToday && !checkedIn ? "pointer" : "default",
                  background: d.mega
                    ? "linear-gradient(135deg,#FFC83D22,#FFC83D44)"
                    : isClaimed ? "#ECFDF5" : isToday ? "#EFF6FF" : "#F9FAFB",
                  border: `1.5px solid ${d.mega ? "#FFC83D88" : isClaimed ? "#10B98144" : isToday ? "#1F6BFF88" : "#E5E7EB"}`,
                  gridColumn: d.day === 7 ? "span 1" : undefined,
                }}>
                <div style={{ fontSize: 20 }}>{isClaimed ? "✅" : d.icon}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: d.mega ? "#B8860B" : isClaimed ? "#10B981" : isToday ? "#1F6BFF" : "#9CA3AF", marginTop: 4 }}>
                  Day {d.day}
                </div>
                <div style={{ fontSize: 8, color: "#9CA3AF", marginTop: 2, lineHeight: 1.2 }}>{d.reward}</div>
                {isToday && !checkedIn && (
                  <div style={{ marginTop: 4, fontSize: 8, fontWeight: 800, color: "#1F6BFF" }}>TAP!</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Check-in Button */}
      <motion.button whileTap={{ scale: 0.96 }} onClick={handleCheckIn}
        disabled={checkedIn}
        style={{
          width: "100%", padding: "16px", borderRadius: 16, fontSize: 15, fontWeight: 900,
          border: "none", cursor: checkedIn ? "default" : "pointer",
          background: checkedIn
            ? "#F3F4F6"
            : "linear-gradient(135deg,#1F6BFF,#60A5FA)",
          color: checkedIn ? "#9CA3AF" : "#fff",
          boxShadow: checkedIn ? "none" : "0 8px 24px rgba(31,107,255,0.35)",
          transition: "all 0.3s",
        }}>
        {checkedIn ? "✅ Checked In Today" : "📅 Daily Check-In"}
      </motion.button>

      {/* Missed day recovery */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: "14px 16px", marginTop: 12,
        border: "1px solid #FEE2E2", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 22 }}>💊</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>Missed Day Recovery</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Use 100 coins to recover a missed day</div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }}
          style={{
            padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800,
            background: "#FFF7ED", border: "1px solid #FEE2E2", color: "#F97316", cursor: "pointer",
          }}>Recover</motion.button>
      </div>
    </div>
  );
}