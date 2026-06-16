/**
 * Profile & Stats Module
 * Access: More Services → Profile & Stats
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProfileMyBadge      from "@/components/profilestats/ProfileMyBadge";
import ProfileMyMedals     from "@/components/profilestats/ProfileMyMedals";
import ProfileLevelXP      from "@/components/profilestats/ProfileLevelXP";
import ProfileHistory      from "@/components/profilestats/ProfileHistory";
import ProfileLeaderboard  from "@/components/profilestats/ProfileLeaderboard";

const SECTIONS = [
  { id: "badge",       label: "My Badge",    icon: "🏅", color: "#1F6BFF", desc: "All your earned badges" },
  { id: "medals",      label: "My Medals",   icon: "🥇", color: "#FFC83D", desc: "Medals & rankings" },
  { id: "levelxp",     label: "Level & XP",  icon: "⭐", color: "#8B5CF6", desc: "Progress & rewards" },
  { id: "history",     label: "History",     icon: "📋", color: "#10B981", desc: "Full activity records" },
  { id: "leaderboard", label: "Leaderboard", icon: "🏆", color: "#EC4899", desc: "Top users & rankings" },
];

const SECTION_COMPONENTS = {
  badge:       <ProfileMyBadge />,
  medals:      <ProfileMyMedals />,
  levelxp:     <ProfileLevelXP />,
  history:     <ProfileHistory />,
  leaderboard: <ProfileLeaderboard />,
};

const STATS = [
  { label: "Followers", value: "0" },
  { label: "Following", value: "0" },
  { label: "Friends",   value: "0" },
  { label: "Visitors",  value: "0" },
];

export default function ProfileStats() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const current = SECTIONS.find(s => s.id === active);

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #F0F0F8",
        padding: "12px 16px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => active ? setActive(null) : navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>
              {current ? `${current.icon} ${current.label}` : "Profile & Stats"}
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>
              {current ? current.desc : "Badge · Medal · Level · History · Leaderboard"}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "16px" }}>

            {/* Hero Banner */}
            <div style={{
              background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
              borderRadius: 20, padding: "20px", marginBottom: 16,
              boxShadow: "0 8px 28px rgba(31,107,255,0.28)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>📊 Your Profile Stats</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>Level 1 · Bronze · 0 XP</div>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🏅</div>
              </div>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { icon: "🏅", label: "Badges Earned",    value: "0",   color: "#1F6BFF" },
                { icon: "🥇", label: "Medals Earned",    value: "0",   color: "#FFC83D" },
                { icon: "⭐", label: "Current Level",    value: "1",   color: "#8B5CF6" },
                { icon: "✅", label: "Tasks Completed",  value: "0",   color: "#10B981" },
              ].map(item => (
                <div key={item.label} style={{ background: "#fff", borderRadius: 14, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Section Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SECTIONS.map((s, i) => (
                <motion.button key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActive(s.id)}
                  style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <ChevronRight size={16} color={s.color} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={active}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {SECTION_COMPONENTS[active]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}