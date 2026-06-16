/**
 * LevelCoins — Premium Level Coins Required System
 * Access: More Services → Level System → Level Coins
 * Design: Premium White Theme · Enterprise UI · Mobile First
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LEVEL_TIER_CONFIG } from "@/lib/constants";
import UserLevelDashboard from "@/components/levels/UserLevelDashboard";
import HostLevelDashboard from "@/components/levels/HostLevelDashboard";
import GiftingLevelDashboard from "@/components/levels/GiftingLevelDashboard";
import StreamingLevelDashboard from "@/components/levels/StreamingLevelDashboard";

/* ── Format helpers ── */
function formatBig(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000)     return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)         return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)             return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ── Exact progression data from the spec ── */
const USER_PROGRESSION = [
  { range: "Lv 1–10",    coins: 1_500_000,    icon: "⚙️", color: "#9E9E9E", tier: "Iron" },
  { range: "Lv 11–20",   coins: 4_000_000,    icon: "⚙️", color: "#9E9E9E", tier: "Iron" },
  { range: "Lv 21–30",   coins: 8_000_000,    icon: "🥉", color: "#CD7F32", tier: "Bronze" },
  { range: "Lv 31–40",   coins: 15_000_000,   icon: "🥉", color: "#CD7F32", tier: "Bronze" },
  { range: "Lv 41–50",   coins: 25_000_000,   icon: "🥈", color: "#C0C0C0", tier: "Silver" },
  { range: "Lv 51–60",   coins: 40_000_000,   icon: "🥈", color: "#C0C0C0", tier: "Silver" },
  { range: "Lv 61–70",   coins: 65_000_000,   icon: "🥇", color: "#FFD700", tier: "Gold" },
  { range: "Lv 71–80",   coins: 100_000_000,  icon: "🥇", color: "#FFD700", tier: "Gold" },
  { range: "Lv 81–90",   coins: 150_000_000,  icon: "💙", color: "#4169E1", tier: "Sapphire" },
  { range: "Lv 91–100",  coins: 220_000_000,  icon: "💙", color: "#4169E1", tier: "Sapphire" },
  { range: "Lv 101–120", coins: 350_000_000,  icon: "💚", color: "#50C878", tier: "Emerald" },
  { range: "Lv 121–140", coins: 600_000_000,  icon: "❤️", color: "#E0115F", tier: "Ruby" },
  { range: "Lv 141–160", coins: 1_000_000_000,icon: "💜", color: "#9B59B6", tier: "Amethyst" },
  { range: "Lv 161–180", coins: 1_700_000_000,icon: "💎", color: "#B9F2FF", tier: "Diamond" },
  { range: "Lv 181–200", coins: 3_000_000_000,icon: "👑", color: "#FFD700", tier: "Legend" },
  { range: "Lv 201–220", coins: 5_000_000_000,icon: "👑", color: "#FFD700", tier: "Legend" },
  { range: "Lv 221–240", coins: 8_000_000_000,icon: "👑", color: "#FF8C00", tier: "Myth" },
  { range: "Lv 241–260", coins: 13_000_000_000,icon: "🌟", color: "#7C3AED", tier: "Mythic" },
  { range: "Lv 261–280", coins: 20_000_000_000,icon: "🐉", color: "#DC2626", tier: "Legendary" },
  { range: "Lv 281–290", coins: 28_000_000_000,icon: "🐉", color: "#DC2626", tier: "Legendary" },
  { range: "Lv 291–299", coins: 40_000_000_000,icon: "🌌", color: "#4C1D95", tier: "Supreme" },
  { range: "Lv 300",     coins: 50_000_000_000,icon: "🏆", color: "#F59E0B", tier: "Universe Emperor", isMax: true },
];

const HOST_PROGRESSION = [
  { range: "Lv 1–10",    coins: 2_000_000,      icon: "⚙️", color: "#9E9E9E", tier: "Newcomer" },
  { range: "Lv 11–20",   coins: 5_000_000,      icon: "⚙️", color: "#9E9E9E", tier: "Newcomer" },
  { range: "Lv 21–30",   coins: 10_000_000,     icon: "🥉", color: "#CD7F32", tier: "Rising" },
  { range: "Lv 31–40",   coins: 20_000_000,     icon: "🥉", color: "#CD7F32", tier: "Rising" },
  { range: "Lv 41–50",   coins: 35_000_000,     icon: "🥈", color: "#C0C0C0", tier: "Performer" },
  { range: "Lv 51–60",   coins: 60_000_000,     icon: "🥈", color: "#C0C0C0", tier: "Performer" },
  { range: "Lv 61–70",   coins: 100_000_000,    icon: "🥇", color: "#FFD700", tier: "Popular" },
  { range: "Lv 71–80",   coins: 180_000_000,    icon: "🥇", color: "#FFD700", tier: "Popular" },
  { range: "Lv 81–90",   coins: 300_000_000,    icon: "💙", color: "#4169E1", tier: "Star" },
  { range: "Lv 91–100",  coins: 500_000_000,    icon: "💙", color: "#4169E1", tier: "Star" },
  { range: "Lv 101–120", coins: 1_000_000_000,  icon: "💚", color: "#50C878", tier: "Super Star" },
  { range: "Lv 121–140", coins: 2_000_000_000,  icon: "❤️", color: "#E0115F", tier: "Elite" },
  { range: "Lv 141–160", coins: 4_000_000_000,  icon: "💜", color: "#9B59B6", tier: "Master" },
  { range: "Lv 161–180", coins: 7_000_000_000,  icon: "💎", color: "#B9F2FF", tier: "Legend" },
  { range: "Lv 181–200", coins: 12_000_000_000, icon: "👑", color: "#F59E0B", tier: "Champion" },
  { range: "Lv 201–220", coins: 20_000_000_000, icon: "👑", color: "#F59E0B", tier: "Champion" },
  { range: "Lv 221–240", coins: 30_000_000_000, icon: "🌟", color: "#7C3AED", tier: "Mythic" },
  { range: "Lv 241–260", coins: 45_000_000_000, icon: "🌟", color: "#7C3AED", tier: "Mythic" },
  { range: "Lv 261–280", coins: 65_000_000_000, icon: "🐉", color: "#DC2626", tier: "Legendary" },
  { range: "Lv 281–299", coins: 90_000_000_000, icon: "🐉", color: "#DC2626", tier: "Legendary" },
  { range: "Lv 300",     coins: 120_000_000_000,icon: "🏆", color: "#F59E0B", tier: "Universe Emperor Host", isMax: true },
];

const GIFTING_PROGRESSION = [
  { range: "Lv 1–30",   coins: 0,            icon: "⚙️", color: "#9E9E9E", tier: "Gifter" },
  { range: "Lv 31–60",  coins: 300_000,      icon: "🥉", color: "#CD7F32", tier: "Generous" },
  { range: "Lv 61–90",  coins: 3_000_000,    icon: "🥈", color: "#C0C0C0", tier: "Supporter" },
  { range: "Lv 91–120", coins: 18_000_000,   icon: "🥇", color: "#FFD700", tier: "Champion" },
  { range: "Lv 121–150",coins: 60_000_000,   icon: "💙", color: "#4169E1", tier: "Legend" },
  { range: "Lv 151–180",coins: 150_000_000,  icon: "💚", color: "#50C878", tier: "King" },
  { range: "Lv 181–210",coins: 300_000_000,  icon: "❤️", color: "#E0115F", tier: "Emperor" },
  { range: "Lv 211–240",coins: 600_000_000,  icon: "💜", color: "#9B59B6", tier: "God" },
  { range: "Lv 241–270",coins: 1_500_000_000,icon: "💎", color: "#B9F2FF", tier: "Divine" },
  { range: "Lv 271–300",coins: 3_000_000_000,icon: "👑", color: "#F59E0B", tier: "Eternal" },
];

const STREAMING_PROGRESSION = [
  { range: "Lv 1–30",   coins: 0,       icon: "⚙️", color: "#9E9E9E", tier: "Rookie", unit: "mins" },
  { range: "Lv 31–60",  coins: 5_000,   icon: "🥉", color: "#CD7F32", tier: "Amateur", unit: "mins" },
  { range: "Lv 61–90",  coins: 30_000,  icon: "🥈", color: "#C0C0C0", tier: "Regular", unit: "mins" },
  { range: "Lv 91–120", coins: 100_000, icon: "🥇", color: "#FFD700", tier: "Veteran", unit: "mins" },
  { range: "Lv 121–150",coins: 250_000, icon: "💙", color: "#4169E1", tier: "Pro", unit: "mins" },
  { range: "Lv 151–180",coins: 600_000, icon: "💚", color: "#50C878", tier: "Expert", unit: "mins" },
  { range: "Lv 181–210",coins: 1_200_000,icon:"❤️", color: "#E0115F", tier: "Master", unit: "mins" },
  { range: "Lv 211–240",coins: 2_500_000,icon:"💜", color: "#9B59B6", tier: "Elite", unit: "mins" },
  { range: "Lv 241–270",coins: 4_200_000,icon:"💎", color: "#B9F2FF", tier: "Legend", unit: "mins" },
  { range: "Lv 271–300",coins: 6_000_000,icon:"👑", color: "#F59E0B", tier: "Icon", unit: "mins" },
];

/* ── Level Benefits (from spec) ── */
const LEVEL_BENEFITS = [
  {
    range: "LV1–LV20", collection: "3D Bronze Badge Collection",
    color: "#CD7F32", icon: "🥉", bg: "#FFF8F0",
    benefits: ["Starter Profile Frame", "Basic Chat Bubble", "Daily Login Bonus", "Beginner Achievement Badge"],
  },
  {
    range: "LV21–LV50", collection: "3D Silver Crown Collection",
    color: "#9CA3AF", icon: "🥈", bg: "#F8F9FA",
    benefits: ["Premium Profile Frame", "Silver Username Color", "VIP Entrance Effect", "Enhanced Daily Rewards"],
  },
  {
    range: "LV51–LV100", collection: "3D Gold Crown Collection",
    color: "#F59E0B", icon: "🥇", bg: "#FFFBEB",
    benefits: ["Gold Username Style", "Premium Chat Bubble", "Party Room Priority Access", "Exclusive Achievement Badge"],
  },
  {
    range: "LV101–LV150", collection: "3D Diamond Collection",
    color: "#06B6D4", icon: "💎", bg: "#F0FDFF",
    benefits: ["Diamond Profile Frame", "Diamond Nameplate", "Exclusive Avatar Border", "Premium Entrance Animation"],
  },
  {
    range: "LV151–LV200", collection: "3D Royal Collection",
    color: "#8B5CF6", icon: "👑", bg: "#F5F3FF",
    benefits: ["Royal Crown Badge", "Royal Entrance Effects", "Advanced Profile Decorations", "Exclusive Gift Effects"],
  },
  {
    range: "LV201–LV250", collection: "3D Mythic Collection",
    color: "#DC2626", icon: "🌟", bg: "#FFF5F5",
    benefits: ["Mythic Profile Frame", "Mythic Name Color", "Special Event Access", "Monthly Exclusive Rewards"],
  },
  {
    range: "LV251–LV299", collection: "3D Legendary Collection",
    color: "#7C3AED", icon: "🐉", bg: "#F5F3FF",
    benefits: ["Legendary Dragon Badge", "Legendary Entrance Animation", "Premium Event Invitations", "Exclusive Gift Access"],
  },
  {
    range: "LV300", collection: "Ultimate Universe Emperor Collection",
    color: "#F59E0B", icon: "🏆", bg: "#FFFBEB", isMax: true,
    benefits: ["Exclusive LV300 Badge", "Ultimate Profile Frame", "Animated Nameplate", "Global Leaderboard Highlight",
               "VIP+ Priority Support", "Exclusive Annual Rewards", "Elite Achievement Collection", "Ultimate Prestige Status"],
  },
];

/* ── Sub-tabs config ── */
const SUB_TABS = [
  { id: "user",      label: "User Level",      icon: "👤", color: "#A855F7", unit: "Coins",      unitIcon: "🪙", data: USER_PROGRESSION },
  { id: "host",      label: "Host Level",      icon: "🎙️", color: "#F59E0B", unit: "Coins",      unitIcon: "🪙", data: HOST_PROGRESSION },
  { id: "gifting",   label: "Gifting Level",   icon: "🎁", color: "#EC4899", unit: "Coins Spent",unitIcon: "🪙", data: GIFTING_PROGRESSION },
  { id: "streaming", label: "Streaming Level", icon: "📡", color: "#06B6D4", unit: "Minutes",    unitIcon: "⏱️", data: STREAMING_PROGRESSION },
  { id: "benefits",  label: "Level Benefits",  icon: "🎁", color: "#10B981", unit: "",           unitIcon: "", data: [] },
];

/* ── 3D Badge component ── */
function Badge3D({ icon, color, size = 48 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `radial-gradient(circle at 35% 30%, ${color}FF, ${color}88)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.46, flexShrink: 0,
      boxShadow: `0 4px 14px ${color}55, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)`,
      border: `1.5px solid ${color}66`,
    }}>
      {icon}
    </div>
  );
}

/* ── Range Card ── */
function RangeCard({ item, index, unit }) {
  const isMax = item.isMax;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      style={{
        background: isMax
          ? "linear-gradient(135deg, #0D1B3E, #7C3AED)"
          : "#fff",
        borderRadius: 16, padding: "14px 16px", marginBottom: 10,
        border: isMax ? "none" : `1px solid ${item.color}22`,
        boxShadow: isMax
          ? "0 8px 28px rgba(124,58,237,0.3)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
      <Badge3D icon={item.icon} color={item.color} size={50} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: 13, fontWeight: 900,
            color: isMax ? "#fff" : "#0D1B3E",
          }}>{item.range}</span>
          {isMax && (
            <span style={{
              fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 10,
              background: "#F59E0B", color: "#fff",
            }}>MAX</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: isMax ? "rgba(255,255,255,0.65)" : "#6B7280", marginBottom: 6 }}>
          {item.tier}
        </div>
        {/* Progress-style bar */}
        <div style={{ height: 6, borderRadius: 3, background: isMax ? "rgba(255,255,255,0.15)" : "#F0F0F8", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (Math.log10(item.coins + 1) / Math.log10(50_000_000_000)) * 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.04 }}
            style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}AA)` }}
          />
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: isMax ? "#F59E0B" : item.color, fontFamily: "monospace" }}>
          {formatBig(item.coins)}
        </div>
        <div style={{ fontSize: 9, color: isMax ? "rgba(255,255,255,0.5)" : "#9CA3AF", marginTop: 2 }}>
          {unit || "coins"}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Benefits Card ── */
function BenefitCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: item.isMax
          ? "linear-gradient(135deg, #0D1B3E, #92400E)"
          : item.bg,
        borderRadius: 18, padding: "16px", marginBottom: 12,
        border: item.isMax ? "none" : `1px solid ${item.color}22`,
        boxShadow: item.isMax
          ? "0 10px 30px rgba(245,158,11,0.35)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Badge3D icon={item.icon} color={item.color} size={44} />
        <div>
          <div style={{
            fontSize: 13, fontWeight: 900,
            color: item.isMax ? "#F59E0B" : item.color,
          }}>{item.range}</div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: item.isMax ? "rgba(255,255,255,0.75)" : "#6B7280",
            marginTop: 2,
          }}>{item.collection}</div>
        </div>
        {item.isMax && (
          <span style={{
            marginLeft: "auto", fontSize: 9, fontWeight: 900,
            padding: "3px 10px", borderRadius: 12,
            background: "#F59E0B", color: "#fff",
          }}>ULTIMATE</span>
        )}
      </div>
      {/* Benefits list */}
      <div style={{ display: "grid", gridTemplateColumns: item.isMax ? "1fr 1fr" : "1fr", gap: 6 }}>
        {item.benefits.map((b, bi) => (
          <div key={bi} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: item.isMax ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.8)",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>✨</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: item.isMax ? "rgba(255,255,255,0.9)" : "#374151",
            }}>{b}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Stats Summary ── */
function StatsSummary({ tab }) {
  const total = tab.data.reduce((s, d) => s + d.coins, 0);
  const max = tab.data[tab.data.length - 1]?.coins || 0;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14,
    }}>
      {[
        { label: "Lv Range", value: "1–300", icon: "📊" },
        { label: "Max Required", value: formatBig(max), icon: tab.unitIcon || "🪙" },
        { label: "Tiers", value: "10", icon: "🏅" },
      ].map(s => (
        <div key={s.label} style={{
          background: "#fff", borderRadius: 14, padding: "12px 10px", textAlign: "center",
          border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{s.value}</div>
          <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ── */
export default function LevelCoins() {
  const [activeTab, setActiveTab] = useState("user");
  const tab = SUB_TABS.find(t => t.id === activeTab);

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, #0D1B3E 0%, ${tab.color} 100%)`,
        padding: "20px 16px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            border: "1px solid rgba(255,255,255,0.2)",
          }}>🪙</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>Level Coins Guide</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              LV1–LV300 · All 4 Systems · Exact Requirements
            </div>
          </div>
        </div>

        {/* Tab pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 14 }}>
          {SUB_TABS.map(t => (
            <motion.button key={t.id} whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab(t.id)}
              style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 20,
                fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
                background: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.14)",
                color: activeTab === t.id ? t.color : "rgba(255,255,255,0.85)",
                boxShadow: activeTab === t.id ? "0 4px 14px rgba(0,0,0,0.15)" : "none",
                transition: "all 0.2s",
              }}>
              {t.icon} {t.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}
          style={{ padding: "14px" }}>

          {activeTab === "user" ? (
            <UserLevelDashboard />
          ) : activeTab === "host" ? (
            <HostLevelDashboard />
          ) : activeTab === "gifting" ? (
            <GiftingLevelDashboard />
          ) : activeTab === "streaming" ? (
            <StreamingLevelDashboard />
          ) : activeTab === "benefits" ? (
            <>
              <div style={{
                background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 14,
                border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 4 }}>🎁 Level Benefits & Collections</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>
                  Exclusive rewards, frames, badges, and privileges unlocked at each milestone range.
                </div>
              </div>
              {LEVEL_BENEFITS.map((item, i) => <BenefitCard key={item.range} item={item} index={i} />)}
            </>
          ) : (
            <>
              {/* Info + Stats */}
              <div style={{
                background: "#fff", borderRadius: 16, padding: "14px 16px",
                border: `1px solid ${tab.color}22`, marginBottom: 14,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex", gap: 14, alignItems: "center",
              }}>
                <Badge3D icon={tab.icon} color={tab.color} size={52} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{tab.label} Requirements</div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                    Track your progress across all 300 levels
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: tab.color, marginTop: 4 }}>
                    {tab.unitIcon} Unit: {tab.unit} · Max: Lv 300
                  </div>
                </div>
              </div>

              <StatsSummary tab={tab} />

              {/* Range cards */}
              <div style={{ marginBottom: 4 }}>
                <div style={{
                  fontSize: 12, fontWeight: 800, color: "#9CA3AF",
                  marginBottom: 10, letterSpacing: "0.06em",
                }}>
                  📈 LEVEL RANGE REQUIREMENTS
                </div>
                {tab.data.map((item, i) => (
                  <RangeCard key={item.range} item={item} index={i} unit={tab.unit} />
                ))}
              </div>

              {/* LV300 highlight */}
              <div style={{
                background: "linear-gradient(135deg, #0D1B3E, #92400E)",
                borderRadius: 20, padding: "20px",
                boxShadow: "0 10px 30px rgba(245,158,11,0.3)",
                border: "1px solid rgba(245,158,11,0.3)",
                marginTop: 4,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 36 }}>🏆</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#F59E0B" }}>Universe Emperor — LV300</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
                      The pinnacle of VYRO achievement
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Exclusive LV300 Badge", "Ultimate Profile Frame", "Animated Nameplate", "Global Leaderboard",
                    "VIP+ Priority Support", "Exclusive Annual Rewards", "Elite Achievement", "Ultimate Prestige"].map((b, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 10px",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <span style={{ fontSize: 12 }}>⭐</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: "center", fontSize: 10, color: "#9CA3AF", marginTop: 14 }}>
                Values scale exponentially · Requirements increase each tier · Tier changes every 30 levels
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}