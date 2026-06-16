/**
 * LevelCoins — View required coins/diamonds/minutes for each level system
 * Access: More Services → Level System → Level Coins
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { USER_LEVELS, HOST_LEVELS, GIFTING_LEVELS, STREAMING_LEVELS, LEVEL_TIER_CONFIG } from "@/lib/constants";

function formatBig(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const SUB_TABS = [
  {
    id: "user",
    label: "User Level",
    icon: "👤",
    color: "#A855F7",
    unit: "Coins",
    unitIcon: "🪙",
    levels: USER_LEVELS,
    valueKey: "coins_required",
    desc: "Total coins earned/spent",
    max: 300,
    benefits: {
      "Iron":     ["Basic badge", "Profile frame"],
      "Bronze":   ["Bronze frame", "+5% coin bonus"],
      "Silver":   ["Silver frame", "+10% coin bonus", "Priority entry"],
      "Gold":     ["Gold frame", "+15% coin bonus", "Special title"],
      "Sapphire": ["Sapphire frame", "+20% coin bonus", "Room spotlight"],
      "Emerald":  ["Emerald frame", "+25% coin bonus", "VIP lounge"],
      "Ruby":     ["Ruby frame", "+30% coin bonus", "Custom emoji"],
      "Amethyst": ["Amethyst frame", "+35% coin bonus", "Priority support"],
      "Diamond":  ["Diamond frame", "+40% coin bonus", "Exclusive events"],
      "Legend":   ["Legend crown", "+50% coin bonus", "All-access pass"],
    },
  },
  {
    id: "host",
    label: "Host Level",
    icon: "🎙️",
    color: "#F59E0B",
    unit: "Diamonds",
    unitIcon: "💎",
    levels: HOST_LEVELS,
    valueKey: "diamonds_required",
    desc: "Total diamonds earned from gifts",
    max: 300,
    benefits: {
      "Iron":     ["Host badge", "Basic room tools"],
      "Bronze":   ["Bronze host frame", "Co-host invite"],
      "Silver":   ["Silver host frame", "Room announcements"],
      "Gold":     ["Gold host frame", "Featured room boost"],
      "Sapphire": ["Sapphire host frame", "Custom welcome screen"],
      "Emerald":  ["Emerald host frame", "Priority discovery"],
      "Ruby":     ["Ruby host frame", "Dedicated support"],
      "Amethyst": ["Amethyst host frame", "Exclusive host events"],
      "Diamond":  ["Diamond host crown", "Platform partnership"],
      "Legend":   ["Legend host status", "Revenue share boost"],
    },
  },
  {
    id: "gifting",
    label: "Gifting Level",
    icon: "🎁",
    color: "#EC4899",
    unit: "Coins Spent",
    unitIcon: "🪙",
    levels: GIFTING_LEVELS,
    valueKey: "coins_spent",
    desc: "Total coins spent on gifts",
    max: 300,
    benefits: {
      "Iron":     ["Gifter badge", "Gift history"],
      "Bronze":   ["Bronze gifter frame", "Gift combos x2"],
      "Silver":   ["Silver gifter frame", "Gift combos x5"],
      "Gold":     ["Gold gifter frame", "Animated gifts"],
      "Sapphire": ["Sapphire gifter frame", "Full-screen gift FX"],
      "Emerald":  ["Emerald gifter name tag", "Priority gift display"],
      "Ruby":     ["Ruby gifter crown", "Exclusive luxury gifts"],
      "Amethyst": ["Amethyst gifter badge", "Gift multiplier x2"],
      "Diamond":  ["Diamond top gifter", "Diamond gift animations"],
      "Legend":   ["Eternal gifter status", "Legendary gift effects"],
    },
  },
  {
    id: "streaming",
    label: "Streaming Level",
    icon: "📡",
    color: "#06B6D4",
    unit: "Minutes",
    unitIcon: "⏱️",
    levels: STREAMING_LEVELS,
    valueKey: "minutes_required",
    desc: "Total minutes streamed live",
    max: 300,
    benefits: {
      "Iron":     ["Streamer badge", "Basic stream tools"],
      "Bronze":   ["Bronze streamer frame", "Stream analytics"],
      "Silver":   ["Silver streamer frame", "HD stream quality"],
      "Gold":     ["Gold streamer frame", "Stream scheduling"],
      "Sapphire": ["Sapphire streamer title", "Dedicated CDN"],
      "Emerald":  ["Emerald streamer badge", "Multi-platform sync"],
      "Ruby":     ["Ruby streamer crown", "Revenue bonus +5%"],
      "Amethyst": ["Amethyst streamer", "Revenue bonus +10%"],
      "Diamond":  ["Diamond broadcaster", "Revenue bonus +15%"],
      "Legend":   ["Legendary broadcaster", "Revenue bonus +20%"],
    },
  },
];

/* ── Milestone levels to display in the table ── */
function getMilestones(levels) {
  const milestoneNums = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100,
    110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
    210, 220, 230, 240, 250, 260, 270, 280, 290, 300];
  return levels.filter(l => milestoneNums.includes(l.level));
}

export default function LevelCoins() {
  const [activeTab, setActiveTab] = useState("user");
  const [filterTier, setFilterTier] = useState(null);
  const tab = SUB_TABS.find(t => t.id === activeTab);

  const displayLevels = filterTier !== null
    ? tab.levels.filter(l => l.tier_index === filterTier)
    : getMilestones(tab.levels);

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, #0D1B3E, ${tab.color})`,
        padding: "20px 16px 16px",
        marginBottom: 0,
      }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🪙</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>Level Coins Guide</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
          View exact requirements for every level across all 4 systems
        </div>

        {/* Sub-tab pills */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto", paddingBottom: 4 }}>
          {SUB_TABS.map(t => (
            <motion.button key={t.id} whileTap={{ scale: 0.92 }}
              onClick={() => { setActiveTab(t.id); setFilterTier(null); }}
              style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                cursor: "pointer", border: "none",
                background: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.15)",
                color: activeTab === t.id ? t.color : "rgba(255,255,255,0.8)",
                boxShadow: activeTab === t.id ? `0 4px 12px rgba(0,0,0,0.15)` : "none",
              }}>
              {t.icon} {t.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
          style={{ padding: "14px" }}>

          {/* Info Card */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "14px 16px",
            border: `1px solid ${tab.color}22`, marginBottom: 12,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            display: "flex", gap: 14, alignItems: "center",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `${tab.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>{tab.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{tab.label}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{tab.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tab.color, marginTop: 4 }}>
                {tab.unitIcon} Tracked in: {tab.unit} · Max Level: {tab.max}
              </div>
            </div>
          </div>

          {/* Benefits by Tier */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 10 }}>🎁 Benefits by Tier</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {LEVEL_TIER_CONFIG.map((tier, i) => {
                const benefits = tab.benefits[tier.name] || [];
                return (
                  <div key={tier.name} style={{
                    background: `${tier.color}0D`, borderRadius: 12, padding: "10px",
                    border: `1px solid ${tier.color}22`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{tier.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: tier.color }}>{tier.name}</span>
                      <span style={{ fontSize: 9, color: "#9CA3AF", marginLeft: "auto" }}>Lv {i * 30 + 1}–{i * 30 + 30}</span>
                    </div>
                    {benefits.map((b, bi) => (
                      <div key={bi} style={{ fontSize: 10, color: "#4B5563", marginBottom: 2 }}>• {b}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tier Filter */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 10 }}>
            <button onClick={() => setFilterTier(null)}
              style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                cursor: "pointer", border: "none",
                background: filterTier === null ? "#0D1B3E" : "#fff",
                color: filterTier === null ? "#fff" : "#6B7280",
                boxShadow: filterTier === null ? "0 4px 10px rgba(0,0,0,0.18)" : "0 1px 4px rgba(0,0,0,0.06)",
              }}>
              Milestones
            </button>
            {LEVEL_TIER_CONFIG.map((tier, i) => (
              <button key={tier.name} onClick={() => setFilterTier(i)}
                style={{
                  flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                  cursor: "pointer", border: "none",
                  background: filterTier === i ? tier.color : "#fff",
                  color: filterTier === i ? "#fff" : "#6B7280",
                  boxShadow: filterTier === i ? `0 4px 10px ${tier.color}44` : "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                {tier.icon} {tier.name}
              </button>
            ))}
          </div>

          {/* Level Table */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F5F7FA", borderBottom: "1px solid #F0F0F8" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#9CA3AF", fontWeight: 800, fontSize: 11, whiteSpace: "nowrap" }}>Level</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#9CA3AF", fontWeight: 800, fontSize: 11 }}>Tier</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", color: "#9CA3AF", fontWeight: 800, fontSize: 11, whiteSpace: "nowrap" }}>{tab.unitIcon} {tab.unit}</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", color: "#9CA3AF", fontWeight: 800, fontSize: 11, whiteSpace: "nowrap" }}>vs Prev</th>
                  </tr>
                </thead>
                <tbody>
                  {displayLevels.map((lv, i) => {
                    const prev = displayLevels[i - 1];
                    const diff = prev ? lv[tab.valueKey] - prev[tab.valueKey] : null;
                    return (
                      <tr key={lv.level} style={{ borderBottom: i < displayLevels.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                        <td style={{ padding: "9px 14px", fontWeight: 900, color: "#0D1B3E", fontSize: 13 }}>
                          Lv.{lv.level}
                        </td>
                        <td style={{ padding: "9px 14px" }}>
                          <span style={{
                            padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 800,
                            background: lv.color + "18", color: lv.color, border: `1px solid ${lv.color}33`,
                            whiteSpace: "nowrap",
                          }}>
                            {lv.icon} {lv.tier_name}
                          </span>
                        </td>
                        <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 700, color: "#374151", fontFamily: "monospace", fontSize: 12 }}>
                          {formatBig(lv[tab.valueKey])}
                        </td>
                        <td style={{ padding: "9px 14px", textAlign: "right", fontSize: 10, color: diff ? "#10B981" : "#D1D5DB", fontWeight: 700, fontFamily: "monospace" }}>
                          {diff ? `+${formatBig(diff)}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 10, color: "#9CA3AF", marginTop: 12, marginBottom: 8 }}>
            Showing {displayLevels.length} levels · Values scale exponentially · Tier changes every 30 levels
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}