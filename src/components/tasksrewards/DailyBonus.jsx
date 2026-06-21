/**
 * DailyBonus — Live daily check-in from Supabase daily_bonus table
 * Writes check-in record on claim; reads streak from existing records.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const DAYS = [
  { day: 1, reward: "50 Coins",    icon: "🪙",  coins: 50 },
  { day: 2, reward: "100 Coins",   icon: "🪙",  coins: 100 },
  { day: 3, reward: "1 Diamond",   icon: "💎",  coins: 0 },
  { day: 4, reward: "200 Coins",   icon: "🪙",  coins: 200 },
  { day: 5, reward: "VIP 1 Day",   icon: "👑",  coins: 0 },
  { day: 6, reward: "300 Coins",   icon: "🪙",  coins: 300 },
  { day: 7, reward: "Mega Reward", icon: "🎁",  mega: true, coins: 1000 },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function DailyBonus() {
  const { user: authUser } = useAuth();
  const [streak,    setStreak]    = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [claiming,  setClaiming]  = useState(false);

  const todayDay = ((streak % 7) || 7);

  useEffect(() => {
    if (!authUser?.id) return;
    const load = async () => {
      try {
        const res = await base44.functions.invoke('supabaseQuery', {
          table: 'daily_bonus', method: 'GET',
          select: 'checkin_date,streak_day,coins_awarded',
          filters: { user_id: `eq.${authUser.id}` },
          order: 'checkin_date.desc', limit: 7,
        });
        const rows = res?.data?.data || [];
        // Check if already checked in today
        const alreadyToday = rows.some(r => r.checkin_date?.slice(0,10) === todayStr());
        setCheckedIn(alreadyToday);
        // Streak = count of consecutive days ending today
        setStreak(rows.length > 0 ? (rows[0].streak_day || rows.length) : 0);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, [authUser?.id]);

  const handleCheckIn = async () => {
    if (checkedIn || claiming || !authUser?.id) return;
    setClaiming(true);
    try {
      const newStreak = streak + 1;
      const dayDef = DAYS[(newStreak - 1) % 7];
      // Write to Supabase daily_bonus
      await base44.functions.invoke('supabaseQuery', {
        table: 'daily_bonus', method: 'POST',
        body: {
          user_id:      authUser.id,
          checkin_date: new Date().toISOString(),
          streak_day:   newStreak,
          coins_awarded: dayDef.coins,
          reward_type:  dayDef.mega ? 'mega' : 'coins',
        },
      });
      setStreak(newStreak);
      setCheckedIn(true);
      toast.success(`✅ Day ${todayDay} check-in! ${dayDef.reward} claimed!`);
    } catch (e) {
      toast.error("Check-in failed. Please try again.");
    }
    setClaiming(false);
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
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
            🔥 {loading ? "…" : streak} Day Streak
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
            {streak >= 7 ? "Amazing! You hit the weekly bonus!" : `${7 - (streak % 7)} more days for Mega Reward!`}
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
        border: "1px solid #F0F0F8", boxShadow: "0 4px 16px rgba(0,0,0,0.05)", marginBottom: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 14 }}>Weekly Rewards</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {DAYS.map(d => {
            const currentCycle = streak % 7 || (checkedIn ? 7 : 0);
            const isClaimed = d.day <= currentCycle;
            const isToday   = d.day === todayDay && !checkedIn;
            return (
              <motion.div key={d.day} whileTap={isToday ? { scale: 0.92 } : {}}
                onClick={() => isToday && handleCheckIn()}
                style={{
                  borderRadius: 14, padding: "10px 6px", textAlign: "center",
                  cursor: isToday ? "pointer" : "default",
                  background: d.mega ? "linear-gradient(135deg,#FFC83D22,#FFC83D44)"
                    : isClaimed ? "#ECFDF5" : isToday ? "#EFF6FF" : "#F9FAFB",
                  border: `1.5px solid ${d.mega ? "#FFC83D88" : isClaimed ? "#10B98144" : isToday ? "#1F6BFF88" : "#E5E7EB"}`,
                }}>
                <div style={{ fontSize: 20 }}>{isClaimed ? "✅" : d.icon}</div>
                <div style={{ fontSize: 9, fontWeight: 800, marginTop: 4,
                  color: d.mega ? "#B8860B" : isClaimed ? "#10B981" : isToday ? "#1F6BFF" : "#9CA3AF" }}>
                  Day {d.day}
                </div>
                <div style={{ fontSize: 8, color: "#9CA3AF", marginTop: 2, lineHeight: 1.2 }}>{d.reward}</div>
                {isToday && <div style={{ marginTop: 4, fontSize: 8, fontWeight: 800, color: "#1F6BFF" }}>TAP!</div>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Check-in Button */}
      <motion.button whileTap={{ scale: 0.96 }} onClick={handleCheckIn}
        disabled={checkedIn || claiming || loading}
        style={{
          width: "100%", padding: "16px", borderRadius: 16, fontSize: 15, fontWeight: 900,
          border: "none", cursor: checkedIn || claiming ? "default" : "pointer",
          background: checkedIn ? "#F3F4F6" : "linear-gradient(135deg,#1F6BFF,#60A5FA)",
          color: checkedIn ? "#9CA3AF" : "#fff",
          boxShadow: checkedIn ? "none" : "0 8px 24px rgba(31,107,255,0.35)",
          transition: "all 0.3s",
        }}>
        {claiming ? "⏳ Claiming..." : checkedIn ? "✅ Checked In Today" : "📅 Daily Check-In"}
      </motion.button>
    </div>
  );
}