import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CATEGORIES = ["Top Users", "Top Gifters", "Top Hosts", "Top Agencies", "Top VIP", "Top Families", "Top Countries"];
const PERIODS = ["Daily", "Weekly", "Monthly", "Yearly", "All Time"];

const MOCK_DATA = {
  "Top Users":     [
    { rank: 1, name: "SkyKing",    avatar: "👑", points: "980,000", country: "🇸🇦", vip: "VIP5" },
    { rank: 2, name: "LunaRay",    avatar: "🌙", points: "875,200", country: "🇦🇪", vip: "VIP4" },
    { rank: 3, name: "RexStorm",   avatar: "⚡", points: "741,000", country: "🇶🇦", vip: "VIP3" },
    { rank: 4, name: "NovaStar",   avatar: "⭐", points: "612,500", country: "🇪🇬", vip: "VIP3" },
    { rank: 5, name: "BlueSky",    avatar: "🌊", points: "528,000", country: "🇯🇴", vip: "VIP2" },
    { rank: 6, name: "FireBolt",   avatar: "🔥", points: "492,000", country: "🇲🇦", vip: "VIP2" },
    { rank: 7, name: "MoonWolf",   avatar: "🐺", points: "410,000", country: "🇮🇶", vip: "VIP1" },
    { rank: 8, name: "GoldRush",   avatar: "✨", points: "388,000", country: "🇸🇦", vip: "VIP1" },
  ],
  "Top Gifters":   [
    { rank: 1, name: "Gifter1",  avatar: "🎁", points: "2,500,000 coins", country: "🇦🇪", vip: "VIP5" },
    { rank: 2, name: "Gifter2",  avatar: "💎", points: "1,900,000 coins", country: "🇸🇦", vip: "VIP4" },
    { rank: 3, name: "Gifter3",  avatar: "🌹", points: "1,200,000 coins", country: "🇶🇦", vip: "VIP3" },
  ],
  "Top Hosts":     [
    { rank: 1, name: "Host King", avatar: "🎙️", points: "1,200 hrs", country: "🇸🇦", vip: "VIP5" },
    { rank: 2, name: "VibeHost",  avatar: "🎵", points: "980 hrs",   country: "🇦🇪", vip: "VIP4" },
    { rank: 3, name: "TalkShow",  avatar: "📻", points: "850 hrs",   country: "🇪🇬", vip: "VIP3" },
  ],
  "Top Agencies":  [
    { rank: 1, name: "Agency Alpha", avatar: "🏢", points: "45 hosts",  country: "🇸🇦", vip: "Gold" },
    { rank: 2, name: "Star Agency",  avatar: "⭐", points: "38 hosts",  country: "🇦🇪", vip: "Silver" },
    { rank: 3, name: "Pro Media",    avatar: "🎬", points: "30 hosts",  country: "🇶🇦", vip: "Bronze" },
  ],
  "Top VIP":       [
    { rank: 1, name: "VIPLord",   avatar: "👑", points: "VIP5 · 365 days", country: "🇸🇦", vip: "VIP5" },
    { rank: 2, name: "RoyalUser", avatar: "💎", points: "VIP5 · 300 days", country: "🇦🇪", vip: "VIP5" },
    { rank: 3, name: "EliteOne",  avatar: "🔱", points: "VIP4 · 280 days", country: "🇶🇦", vip: "VIP4" },
  ],
  "Top Families":  [
    { rank: 1, name: "Phoenix Clan", avatar: "🦅", points: "98,420 pts", country: "🌍", vip: "18 members" },
    { rank: 2, name: "Dragon Clan",  avatar: "🐉", points: "87,300 pts", country: "🌍", vip: "12 members" },
    { rank: 3, name: "Storm Squad",  avatar: "⚡", points: "74,100 pts", country: "🌍", vip: "15 members" },
  ],
  "Top Countries": [
    { rank: 1, name: "Saudi Arabia", avatar: "🇸🇦", points: "4,200,000 pts", country: "",    vip: "2.1K users" },
    { rank: 2, name: "UAE",          avatar: "🇦🇪", points: "3,800,000 pts", country: "",    vip: "1.9K users" },
    { rank: 3, name: "Egypt",        avatar: "🇪🇬", points: "3,100,000 pts", country: "",    vip: "1.5K users" },
    { rank: 4, name: "Qatar",        avatar: "🇶🇦", points: "2,500,000 pts", country: "",    vip: "1.2K users" },
  ],
};

const MEDAL_ICON = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function ProfileLeaderboard() {
  const [cat, setCat]       = useState("Top Users");
  const [period, setPeriod] = useState("Weekly");

  const data = MOCK_DATA[cat] || [];

  return (
    <div style={{ padding: "14px" }}>
      {/* Period Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ flex: 1, padding: "7px 2px", borderRadius: 20, fontSize: 9, fontWeight: 800, cursor: "pointer", border: "none",
              background: period === p ? "#EC4899" : "#fff",
              color: period === p ? "#fff" : "#6B7280",
              boxShadow: period === p ? "0 4px 10px rgba(236,72,153,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {p}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
              background: cat === c ? "#EC4899" : "#fff",
              color: cat === c ? "#fff" : "#6B7280",
              boxShadow: cat === c ? "0 4px 12px rgba(236,72,153,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {data.length >= 3 && (
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          {[data[1], data[0], data[2]].map((u, i) => {
            const heights = [100, 120, 90];
            const isFirst = i === 1;
            return (
              <motion.div key={u.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 30 }}>{u.avatar}</div>
                <div style={{ fontSize: 11, fontWeight: 900, color: "#0D1B3E", textAlign: "center" }}>{u.name}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF", textAlign: "center" }}>{u.points}</div>
                <div style={{
                  width: "100%", height: heights[i], borderRadius: "12px 12px 0 0",
                  background: isFirst ? "linear-gradient(180deg,#FFD700,#FFC83D)" : i === 0 ? "linear-gradient(180deg,#C0C0C0,#E5E7EB)" : "linear-gradient(180deg,#CD7F32,#D97706)",
                  display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8,
                  fontSize: 18,
                }}>
                  {MEDAL_ICON[u.rank]}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((u, i) => (
          <motion.div key={u.rank}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, fontSize: 16, textAlign: "center", flexShrink: 0 }}>
              {MEDAL_ICON[u.rank] || <span style={{ fontSize: 12, fontWeight: 900, color: "#9CA3AF" }}>#{u.rank}</span>}
            </div>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{u.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{u.name} {u.country}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{u.vip}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#EC4899" }}>{u.points}</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 4 }}>
                <button onClick={() => toast.success(`Following ${u.name}`)}
                  style={{ padding: "3px 8px", borderRadius: 8, background: "#F0F7FF", border: "none", fontSize: 9, fontWeight: 800, cursor: "pointer", color: "#1F6BFF" }}>Follow</button>
                <button onClick={() => toast.info(`Sending gift to ${u.name}`)}
                  style={{ padding: "3px 8px", borderRadius: 8, background: "#FFF7ED", border: "none", fontSize: 9, fontWeight: 800, cursor: "pointer", color: "#D97706" }}>🎁</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}