/**
 * DailyBonus — 7-day login streak calendar
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2 } from "lucide-react";

const DAYS = [
  { day: 1, label: "Day 1", reward: "50 Coins",         icon: "🪙", claimed: true },
  { day: 2, label: "Day 2", reward: "80 Coins",         icon: "🪙", claimed: true },
  { day: 3, label: "Day 3", reward: "120 Coins",        icon: "🪙", claimed: true },
  { day: 4, label: "Day 4", reward: "VIP Day",          icon: "👑", claimed: true },
  { day: 5, label: "Day 5", reward: "200 Coins",        icon: "🪙", claimed: false, today: true },
  { day: 6, label: "Day 6", reward: "50 Diamonds",      icon: "💎", claimed: false },
  { day: 7, label: "Day 7", reward: "MEGA REWARD 🎉",   icon: "🏆", claimed: false, mega: true },
];

export default function DailyBonus() {
  const [days, setDays] = useState(DAYS);
  const [showCelebration, setShowCelebration] = useState(false);
  const streak = days.filter(d => d.claimed).length;
  const todayDay = days.find(d => d.today);

  const handleCheckIn = () => {
    if (!todayDay) return;
    setDays(prev => prev.map(d => d.today ? { ...d, claimed: true, today: false } : d));
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2200);
  };

  return (
    <div style={{ padding: "16px 14px 0" }}>
      {/* Streak banner */}
      <div style={{
        background: "linear-gradient(135deg,#FF6B35,#FFC83D)",
        borderRadius: 18, padding: "16px",
        display: "flex", alignItems: "center", gap: 14,
        marginBottom: 16, boxShadow: "0 6px 20px rgba(255,107,53,0.3)",
      }}>
        <div style={{ textAlign: "center" }}>
          <Flame size={32} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{streak} Day Streak 🔥</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
            Keep going! Day 7 is the Mega Reward
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Next reward</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>
            {days.find(d => !d.claimed)?.reward || "All claimed!"}
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {days.map((d, i) => (
          <motion.div key={d.day}
            whileTap={d.today ? { scale: 0.93 } : {}}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              borderRadius: 16, padding: "12px 8px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              gridColumn: d.mega ? "span 4" : undefined,
              background: d.claimed ? "linear-gradient(135deg,#EBF2FF,#DBEAFE)"
                : d.today ? "linear-gradient(135deg,#1F6BFF,#3B82F6)"
                : d.mega ? "linear-gradient(135deg,#FFF8E7,#FFF3CC)"
                : "#fff",
              border: d.today ? "2px solid #1F6BFF"
                : d.mega ? "2px solid #FFC83D"
                : "1px solid #F0F0F5",
              boxShadow: d.today ? "0 6px 20px rgba(31,107,255,0.35)" : "0 2px 8px rgba(0,0,0,0.04)",
              position: "relative", cursor: d.today ? "pointer" : "default",
            }}
            onClick={d.today ? handleCheckIn : undefined}>
            {d.claimed && (
              <CheckCircle2 size={14} color="#10B981"
                style={{ position: "absolute", top: 6, right: 6 }} />
            )}
            <span style={{ fontSize: d.mega ? 28 : 20 }}>{d.icon}</span>
            <span style={{
              fontSize: 9, fontWeight: 800,
              color: d.today ? "#fff" : d.claimed ? "#3B82F6" : "#9CA3AF",
            }}>{d.label}</span>
            <span style={{
              fontSize: d.mega ? 11 : 9, fontWeight: 700, textAlign: "center",
              color: d.today ? "rgba(255,255,255,0.9)" : d.mega ? "#B8860B" : "#0D1B3E",
            }}>{d.reward}</span>
            {d.today && (
              <span style={{
                marginTop: 2, fontSize: 10, fontWeight: 900, color: "#fff",
                background: "rgba(255,255,255,0.25)", borderRadius: 8, padding: "2px 8px",
              }}>Check In</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info cards */}
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { icon: "⚡", title: "Double Reward Event", desc: "Active during weekends", color: "#A78BFA" },
          { icon: "🔄", title: "Missed Day Recovery", desc: "Use 50 coins to recover", color: "#F472B6" },
        ].map(c => (
          <div key={c.title} style={{
            flex: 1, background: "#fff", borderRadius: 14, padding: "12px",
            border: "1px solid #F0F0F5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <span style={{ fontSize: 20 }}>{c.icon}</span>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#0D1B3E", marginTop: 4 }}>{c.title}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.4)",
            }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              style={{
                background: "#fff", borderRadius: 24, padding: "32px 40px",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0D1B3E" }}>Checked In!</div>
              <div style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>+200 Coins Added</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}