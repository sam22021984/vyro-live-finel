/**
 * UserLevelSystem — Full LV1-LV300 User Level System Page
 * Access: More Services → Level Systems → User Level Guide → View Full System
 * Platform: VYRO LIVE CONNECT
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";

/* ── Formatter ── */
function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000)     return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)         return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)             return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ── Full 22-range level data (exact spec) ── */
const LEVELS = [
  {
    range: "LV1–LV10", title: "Rising Spark", badge: "Bronze Crystal Shield",
    icon: "🛡️", color: "#CD7F32", tier: "Iron", coins: 1_500_000,
    desc: "New member beginning their VYRO journey and exploring platform features.",
    effects: ["Soft Blue Glow", "Crystal Edge Effect"],
    benefits: ["Starter Profile Frame", "Basic Chat Bubble", "Daily Login Bonus", "New User Badge"],
  },
  {
    range: "LV11–LV20", title: "Social Explorer", badge: "Bronze Crown",
    icon: "👑", color: "#CD7F32", tier: "Iron", coins: 4_000_000,
    desc: "Actively engaging with users and participating in platform activities.",
    effects: ["Animated Spark Particles", "Metallic Reflection"],
    benefits: ["Bronze Profile Frame", "Enhanced XP Rewards", "Explorer Badge", "Special Emoji Pack"],
  },
  {
    range: "LV21–LV30", title: "Silver Guardian", badge: "Silver Shield Crown",
    icon: "🥈", color: "#9CA3AF", tier: "Bronze", coins: 8_000_000,
    desc: "A respected community member gaining recognition.",
    effects: ["Crystal Reflection", "Premium Glow"],
    benefits: ["Silver Frame", "Username Highlight", "VIP Entry Animation", "Daily Reward Boost"],
  },
  {
    range: "LV31–LV40", title: "Silver Commander", badge: "Royal Silver Crest",
    icon: "⚔️", color: "#9CA3AF", tier: "Bronze", coins: 15_000_000,
    desc: "Building influence and strengthening community presence.",
    effects: ["Diamond Particles", "Dynamic Shine"],
    benefits: ["Commander Badge", "Advanced Chat Bubble", "Enhanced Visibility", "Extra Rewards"],
  },
  {
    range: "LV41–LV50", title: "Silver Emperor", badge: "Silver Imperial Crown",
    icon: "👑", color: "#A0A0B0", tier: "Silver", coins: 25_000_000,
    desc: "Elite social member with strong platform activity.",
    effects: ["Animated Glow", "Glass Crystal Effect"],
    benefits: ["Premium Frame", "VIP Welcome Effect", "Silver Name Color", "Achievement Rewards"],
  },
  {
    range: "LV51–LV60", title: "Golden Knight", badge: "Golden Warrior Shield",
    icon: "🛡️", color: "#F59E0B", tier: "Silver", coins: 40_000_000,
    desc: "Highly active user with growing influence.",
    effects: ["Soft Fire Glow", "Metallic Reflection"],
    benefits: ["Gold Username", "Premium Bubble", "Party Room Priority", "Knight Achievement"],
  },
  {
    range: "LV61–LV70", title: "Golden Champion", badge: "Golden Star Crown",
    icon: "⭐", color: "#F59E0B", tier: "Gold", coins: 65_000_000,
    desc: "Recognized contributor and supporter.",
    effects: ["Floating Stars", "Dynamic Lighting"],
    benefits: ["Gold Crown Badge", "Bonus Rewards", "Exclusive Events", "Priority Features"],
  },
  {
    range: "LV71–LV80", title: "Golden Master", badge: "Royal Gold Emblem",
    icon: "🏅", color: "#F59E0B", tier: "Gold", coins: 100_000_000,
    desc: "Respected veteran within the VYRO ecosystem.",
    effects: ["Crystal Highlights", "Premium Shadow"],
    benefits: ["Elite Chat Bubble", "Special Entrance", "Gold Frame", "Reward Multiplier"],
  },
  {
    range: "LV81–LV90", title: "Golden Legend", badge: "Phoenix Gold Crown",
    icon: "🦅", color: "#F59E0B", tier: "Gold", coins: 150_000_000,
    desc: "A powerful social personality with strong community presence.",
    effects: ["Fire Particles", "Crystal Wings"],
    benefits: ["Legendary Badge", "Premium Rewards", "Special Animations", "Exclusive Access"],
  },
  {
    range: "LV91–LV100", title: "Golden Supreme", badge: "Supreme Gold Throne Crown",
    icon: "🔱", color: "#F59E0B", tier: "Gold", coins: 220_000_000,
    desc: "One of the platform's elite social members.",
    effects: ["Gold Diamonds", "Animated Aura"],
    benefits: ["Supreme Crown", "Premium Decorations", "VIP Features", "Gold Prestige Status"],
  },
  {
    range: "LV101–LV120", title: "Diamond Elite", badge: "Diamond Crown",
    icon: "💎", color: "#06B6D4", tier: "Sapphire", coins: 350_000_000,
    effects: ["Diamond Glow", "Crystal Shine"],
    benefits: ["Diamond Profile Frame", "Diamond Username", "Exclusive Avatar Border", "Premium Entrance Animation"],
  },
  {
    range: "LV121–LV140", title: "Diamond Lord", badge: "Royal Diamond Crown",
    icon: "👑", color: "#06B6D4", tier: "Emerald", coins: 600_000_000,
    effects: ["Royal Glow", "Diamond Rain"],
    benefits: ["Diamond VIP Status", "Premium Nameplate", "Special Access Rights", "Luxury Effects"],
  },
  {
    range: "LV141–LV160", title: "Diamond Emperor", badge: "Imperial Diamond Crown",
    icon: "⚜️", color: "#4169E1", tier: "Emerald", coins: 1_000_000_000,
    effects: ["Emperor Aura", "Crystal Halo"],
    benefits: ["Emperor Status", "Advanced Profile Effects", "Exclusive Content", "Premium Gifts"],
  },
  {
    range: "LV161–LV180", title: "Royal King", badge: "Royal Dragon Crown",
    icon: "🐲", color: "#8B5CF6", tier: "Ruby", coins: 1_700_000_000,
    effects: ["Dragon FX", "Royal Entrance"],
    benefits: ["Dragon Effects", "Royal Entrance", "Premium Collection", "Event Invitations"],
  },
  {
    range: "LV181–LV200", title: "Royal Sovereign", badge: "Supreme Royal Throne",
    icon: "⚡", color: "#9B59B6", tier: "Amethyst", coins: 3_000_000_000,
    effects: ["Sovereign Aura", "Throne Glow"],
    benefits: ["Sovereign Status", "Exclusive Decorations", "VIP+ Access", "Special Rewards"],
  },
  {
    range: "LV201–LV220", title: "Mythic Champion", badge: "Mythic Crown",
    icon: "🔮", color: "#DC2626", tier: "Diamond", coins: 5_000_000_000,
    effects: ["Champion Burst", "Mythic Crown Glow"],
    benefits: ["Champion Badge", "Premium Rewards", "VIP Recognition", "Elite Access"],
  },
  {
    range: "LV221–LV240", title: "Mythic Overlord", badge: "Mythic Dragon Crown",
    icon: "🐉", color: "#B9F2FF", tier: "Diamond", coins: 8_000_000_000,
    effects: ["Overlord Surge", "Dragon Crown FX"],
    benefits: ["Overlord Badge", "Premium Animations", "Priority Support", "Exclusive Access"],
  },
  {
    range: "LV241–LV260", title: "Legendary Dragon", badge: "Dragon King Emblem",
    icon: "🐲", color: "#7C3AED", tier: "Legend", coins: 13_000_000_000,
    effects: ["Dragon Breath", "King Glow"],
    benefits: ["Legendary Dragon Badge", "Premium Invitations", "Rare Gifts", "Elite Rewards"],
  },
  {
    range: "LV261–LV280", title: "Legendary Overlord", badge: "Overlord Dragon Crown",
    icon: "🔱", color: "#7C3AED", tier: "Legend", coins: 20_000_000_000,
    effects: ["Overlord Storm", "Dragon Surge"],
    benefits: ["Overlord Collection", "VIP+ Features", "Special Recognition", "Luxury Rewards"],
  },
  {
    range: "LV281–LV290", title: "Legendary Universe King", badge: "Cosmic Crown",
    icon: "🌠", color: "#0EA5E9", tier: "Legend", coins: 28_000_000_000,
    effects: ["Cosmic Pulse", "Universe Glow"],
    benefits: ["Universe Frame", "Cosmic Effects", "Global Access", "Annual Rewards"],
  },
  {
    range: "LV291–LV299", title: "Legendary Universe Emperor", badge: "Universal Emperor Crest",
    icon: "🌌", color: "#0EA5E9", tier: "Legend", coins: 40_000_000_000,
    effects: ["Emperor Nebula", "Universe Crown"],
    benefits: ["Emperor Recognition", "Exclusive Cosmetics", "Global Prestige", "Ultimate Rewards"],
  },
  {
    range: "LV300", title: "Ultimate Universe Emperor", badge: "Ultimate Cosmic Emperor Crown",
    icon: "🏆", color: "#F59E0B", tier: "ULTIMATE", coins: 50_000_000_000, isMax: true,
    desc: "The highest achievable status in VYRO LIVE CONNECT.",
    effects: ["Animated Nebula Effects", "Dynamic Lighting Engine", "Holographic Reflections", "Floating Energy Rings"],
    materials: ["Diamond Crystal Structure", "Gold Titanium Finish"],
    benefits: ["Exclusive LV300 Emperor Badge", "Ultimate Animated Profile Frame", "Cosmic Nameplate Animation",
      "Global Leaderboard Highlight", "VIP+ Priority Support", "Exclusive Annual Rewards",
      "Elite Achievement Collection", "Universal Prestige Status", "Founder-Class Recognition",
      "Unique Entrance Animation", "Exclusive LV300 Gift Effects", "Lifetime Prestige Collection"],
  },
];

const TIER_FILTERS = [
  { label: "All",        tiers: null,                                       color: "#6B7280" },
  { label: "🥉 Iron",   tiers: ["Iron"],                                    color: "#CD7F32" },
  { label: "🥈 Silver", tiers: ["Bronze", "Silver"],                        color: "#9CA3AF" },
  { label: "🥇 Gold",   tiers: ["Gold"],                                    color: "#F59E0B" },
  { label: "💎 Diamond",tiers: ["Sapphire", "Emerald"],                     color: "#06B6D4" },
  { label: "👑 Royal",  tiers: ["Ruby", "Amethyst"],                        color: "#8B5CF6" },
  { label: "🔥 Mythic", tiers: ["Diamond", "Legend"],                       color: "#DC2626" },
  { label: "🏆 Max",    tiers: ["ULTIMATE"],                                 color: "#F59E0B" },
];

/* ── 3D Badge ── */
function Badge3D({ icon, color, size = 50 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.26, flexShrink: 0,
      background: `radial-gradient(circle at 33% 28%, ${color}FF, ${color}66)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44,
      boxShadow: `0 4px 16px ${color}55, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.2)`,
      border: `1.5px solid ${color}55`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "20%", right: 0, height: "45%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
        borderRadius: "0 0 50% 50%",
      }} />
      {icon}
    </div>
  );
}

/* ── Level Card ── */
function LevelCard({ lv, isOpen, onToggle, index }) {
  const pct = Math.round((Math.log10(lv.coins + 1) / Math.log10(50_000_000_000)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.35) }}
      style={{ marginBottom: 10 }}>

      {/* Header row */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        style={{
          width: "100%", cursor: "pointer", border: "none", textAlign: "left",
          background: lv.isMax
            ? "linear-gradient(135deg, #0D1B3E 0%, #92400E 100%)"
            : "#fff",
          borderRadius: isOpen ? "16px 16px 0 0" : 16,
          padding: "13px 14px",
          borderLeft: lv.isMax ? "none" : `3px solid ${lv.color}`,
          boxShadow: lv.isMax
            ? "0 8px 28px rgba(245,158,11,0.28)"
            : "0 2px 10px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
        <Badge3D icon={lv.icon} color={lv.color} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 8,
              background: lv.isMax ? "rgba(245,158,11,0.25)" : `${lv.color}15`,
              color: lv.isMax ? "#F59E0B" : lv.color,
              border: `1px solid ${lv.color}30`,
            }}>{lv.range}</span>
            {lv.isMax && (
              <span style={{ fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 10, background: "#F59E0B", color: "#fff" }}>
                ULTIMATE
              </span>
            )}
          </div>
          <div style={{
            fontSize: 13, fontWeight: 900,
            color: lv.isMax ? "#fff" : "#0D1B3E",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{lv.title}</div>
          <div style={{ fontSize: 10, color: lv.isMax ? "rgba(255,255,255,0.5)" : "#9CA3AF", marginTop: 1 }}>
            {lv.badge}
          </div>
          {/* Always-visible benefits preview */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {lv.benefits.slice(0, isOpen ? lv.benefits.length : 2).map((b, i) => (
              <span key={i} style={{
                fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8,
                background: lv.isMax ? "rgba(245,158,11,0.2)" : `${lv.color}12`,
                color: lv.isMax ? "#F59E0B" : lv.color,
                border: `1px solid ${lv.color}22`,
              }}>⭐ {b}</span>
            ))}
            {!isOpen && lv.benefits.length > 2 && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#F0F0F8", color: "#9CA3AF" }}>
                +{lv.benefits.length - 2} more
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: lv.isMax ? "#F59E0B" : lv.color, fontFamily: "monospace" }}>
            {fmt(lv.coins)}
          </div>
          <div style={{ fontSize: 9, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>🪙 coins</div>
          {isOpen
            ? <ChevronUp size={14} color={lv.isMax ? "rgba(255,255,255,0.5)" : "#9CA3AF"} />
            : <ChevronDown size={14} color={lv.isMax ? "rgba(255,255,255,0.5)" : "#9CA3AF"} />}
        </div>
      </motion.button>

      {/* Expanded body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}>
            <div style={{
              background: lv.isMax ? "linear-gradient(180deg,#111827,#1a0d00)" : "#FAFBFF",
              borderRadius: "0 0 16px 16px",
              border: lv.isMax ? "none" : `1px solid ${lv.color}15`,
              borderLeft: lv.isMax ? "none" : `3px solid ${lv.color}`,
              borderTop: "none",
              padding: "14px",
            }}>
              {/* Description */}
              {lv.desc && (
                <p style={{ fontSize: 11, color: lv.isMax ? "rgba(255,255,255,0.6)" : "#6B7280", marginBottom: 12, lineHeight: 1.7 }}>
                  {lv.desc}
                </p>
              )}

              {/* Materials (LV300 only) */}
              {lv.materials && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.06em" }}>
                    🔩 MATERIALS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {lv.materials.map((m, i) => (
                      <span key={i} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Effects */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: lv.isMax ? "rgba(255,255,255,0.35)" : "#9CA3AF", marginBottom: 6, letterSpacing: "0.06em" }}>
                  ✨ SPECIAL EFFECTS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {lv.effects.map((e, i) => (
                    <span key={i} style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                      background: lv.isMax ? "rgba(255,255,255,0.07)" : `${lv.color}10`,
                      color: lv.isMax ? "rgba(255,255,255,0.8)" : lv.color,
                      border: `1px solid ${lv.color}28`,
                    }}>{e}</span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: lv.isMax ? "rgba(255,255,255,0.35)" : "#9CA3AF", marginBottom: 6, letterSpacing: "0.06em" }}>
                  🎁 BENEFITS UNLOCKED
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {lv.benefits.map((b, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 7,
                      background: lv.isMax ? "rgba(255,255,255,0.05)" : `${lv.color}08`,
                      borderRadius: 10, padding: "7px 10px",
                      border: `1px solid ${lv.color}18`,
                    }}>
                      <span style={{ fontSize: 11, flexShrink: 0, marginTop: 1 }}>⭐</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: lv.isMax ? "rgba(255,255,255,0.85)" : "#374151", lineHeight: 1.35 }}>
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: lv.isMax ? "rgba(255,255,255,0.3)" : "#C4C9D4" }}>Journey progress</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: lv.color }}>{pct}% of max</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: lv.isMax ? "rgba(255,255,255,0.08)" : "#F0F0F8", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }}
                    style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${lv.color}, ${lv.color}99)` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function UserLevelSystem() {
  const navigate = useNavigate();
  const [openCard, setOpenCard] = useState(null);
  const [filterIdx, setFilterIdx] = useState(0);

  const activeFilter = TIER_FILTERS[filterIdx];
  const visible = activeFilter.tiers === null
    ? LEVELS
    : LEVELS.filter(l => activeFilter.tiers.includes(l.tier));

  const toggle = (range) => setOpenCard(p => p === range ? null : range);

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* ── Sticky Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(245,247,250,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "#fff", border: "1px solid #E5E7EB",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
          <ChevronLeft size={18} color="#374151" />
        </motion.button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>👤 User Level System</div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>LV1–LV300 · 22 Ranges · 50B Coins Total</div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #A855F7 100%)", padding: "20px 16px 0" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Levels", value: "300", icon: "📊" },
            { label: "Ranges", value: "22", icon: "🏅" },
            { label: "Max Coins", value: "50B", icon: "🪙" },
            { label: "Total XP", value: "∞", icon: "⭐" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 6px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 14 }}>
          {TIER_FILTERS.map((f, i) => (
            <motion.button key={f.label} whileTap={{ scale: 0.92 }}
              onClick={() => { setFilterIdx(i); setOpenCard(null); }}
              style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                cursor: "pointer", border: "none",
                background: filterIdx === i ? "#fff" : "rgba(255,255,255,0.14)",
                color: filterIdx === i ? f.color : "rgba(255,255,255,0.8)",
                boxShadow: filterIdx === i ? "0 4px 14px rgba(0,0,0,0.15)" : "none",
                transition: "all 0.2s",
              }}>{f.label}</motion.button>
          ))}
        </div>
      </div>

      {/* ── Level Cards ── */}
      <AnimatePresence mode="wait">
        <motion.div key={filterIdx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          style={{ padding: "14px" }}>

          <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.05em" }}>
            {visible.length} LEVEL RANGES · TAP TO EXPAND
          </div>

          {visible.map((lv, i) => (
            <LevelCard
              key={lv.range}
              lv={lv}
              index={i}
              isOpen={openCard === lv.range}
              onToggle={() => toggle(lv.range)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}