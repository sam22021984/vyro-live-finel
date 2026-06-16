import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const RANKS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Legend"];
const RANK_COLORS = { Bronze: "#CD7F32", Silver: "#C0C0C0", Gold: "#FFD700", Platinum: "#E5E4E2", Diamond: "#B9F2FF", Master: "#9333EA", Legend: "#EC4899" };

const LEVEL = 1;
const CURRENT_XP = 0;
const REQUIRED_XP = 1000;
const RANK = "Bronze";

const XP_METHODS = [
  { icon: "📅", label: "Daily Login",       xp: "+50 XP"  },
  { icon: "👁️", label: "Watching Live",      xp: "+10 XP"  },
  { icon: "🎁", label: "Sending Gifts",      xp: "+30 XP"  },
  { icon: "💎", label: "Receiving Gifts",    xp: "+20 XP"  },
  { icon: "✅", label: "Completing Tasks",   xp: "+100 XP" },
  { icon: "🏆", label: "Winning Events",     xp: "+500 XP" },
  { icon: "💰", label: "Recharge",           xp: "+200 XP" },
  { icon: "⚔️", label: "PK Battles",         xp: "+150 XP" },
];

const REWARDS = [
  { level: 5,  reward: "500 Coins",    icon: "🪙" },
  { level: 10, reward: "Frame Unlock", icon: "🖼️" },
  { level: 20, reward: "1000 Coins",   icon: "🪙" },
  { level: 30, reward: "VIP 1 Day",    icon: "👑" },
  { level: 50, reward: "Special ID",   icon: "💎" },
];

export default function ProfileLevelXP() {
  const [tab, setTab] = useState("overview");
  const progress = (CURRENT_XP / REQUIRED_XP) * 100;
  const rankColor = RANK_COLORS[RANK];

  return (
    <div style={{ padding: "14px" }}>
      {/* Level Card */}
      <div style={{ background: `linear-gradient(135deg,#0D1B3E,${rankColor}66)`, borderRadius: 20, padding: "20px", marginBottom: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>CURRENT LEVEL</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>Lv.{LEVEL}</div>
            <div style={{ fontSize: 13, color: rankColor, fontWeight: 800, marginTop: 4 }}>⚔️ {RANK} Rank</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>XP Progress</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{CURRENT_XP.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>/ {REQUIRED_XP.toLocaleString()} XP</div>
          </div>
        </div>
        {/* Progress Bar */}
        <div style={{ height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: `linear-gradient(90deg,${rankColor},#fff)`, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>0 XP</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{REQUIRED_XP} XP to Lv.{LEVEL + 1}</span>
        </div>
      </div>

      {/* XP Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Today",  value: "0 XP" },
          { label: "Week",   value: "0 XP" },
          { label: "Month",  value: "0 XP" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#8B5CF6" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["overview", "rewards", "earn"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "capitalize",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#8B5CF6" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "overview" ? "Overview" : t === "rewards" ? "Rewards" : "How to Earn"}
          </button>
        ))}
      </div>

      {/* Tab: Overview — Ranks */}
      {tab === "overview" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🏅 Rank Progression</div>
          {RANKS.map((r, i) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < RANKS.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: RANK_COLORS[r], flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: r === RANK ? "#0D1B3E" : "#9CA3AF" }}>{r}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>Lv.{i * 30 + 1}+</div>
              {r === RANK && <div style={{ padding: "2px 8px", borderRadius: 8, background: "#F0F7FF", fontSize: 9, fontWeight: 800, color: "#1F6BFF" }}>Current</div>}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Rewards */}
      {tab === "rewards" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🎁 Level Rewards</div>
          {REWARDS.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < REWARDS.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>Level {r.level}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.reward}</div>
              </div>
              {LEVEL >= r.level
                ? <div style={{ fontSize: 10, color: "#10B981", fontWeight: 800 }}>✓ Claimed</div>
                : <div style={{ fontSize: 10, color: "#9CA3AF" }}>Lv.{r.level} required</div>}
            </div>
          ))}
        </div>
      )}

      {/* Tab: How to Earn */}
      {tab === "earn" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>⚡ Ways to Earn XP</div>
          {XP_METHODS.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < XP_METHODS.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{m.icon}</span>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#374151" }}>{m.label}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#8B5CF6" }}>{m.xp}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}