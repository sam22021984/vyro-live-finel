/**
 * UserLevelProgression — Full LV1-LV300 User Level System
 * All 31 level ranges with titles, badges, benefits, and coin requirements
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function formatBig(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000)     return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)         return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)             return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const LEVELS = [
  { range: "LV1–LV10",    title: "Rising Spark",              badge: "Bronze Crystal Shield",        coins: 1_500_000,     icon: "🛡️", color: "#CD7F32", bg: "#FFF8F0", tier: "Iron",       effects: ["Soft Blue Glow","Crystal Edge Effect"], desc: "New member beginning their VYRO journey.", benefits: ["Starter Profile Frame","Basic Chat Bubble","Daily Login Bonus","New User Badge"] },
  { range: "LV11–LV20",   title: "Social Explorer",           badge: "Bronze Crown",                 coins: 4_000_000,     icon: "👑", color: "#CD7F32", bg: "#FFF8F0", tier: "Iron",       effects: ["Animated Spark Particles","Metallic Reflection"], desc: "Actively engaging with platform activities.", benefits: ["Bronze Profile Frame","Enhanced XP Rewards","Explorer Badge","Special Emoji Pack"] },
  { range: "LV21–LV30",   title: "Silver Guardian",           badge: "Silver Shield Crown",          coins: 8_000_000,     icon: "🥈", color: "#9CA3AF", bg: "#F8F9FA", tier: "Bronze",     effects: ["Crystal Reflection","Premium Glow"], desc: "A respected community member gaining recognition.", benefits: ["Silver Frame","Username Highlight","VIP Entry Animation","Daily Reward Boost"] },
  { range: "LV31–LV40",   title: "Silver Commander",          badge: "Royal Silver Crest",           coins: 15_000_000,    icon: "⚔️", color: "#9CA3AF", bg: "#F8F9FA", tier: "Bronze",     effects: ["Diamond Particles","Dynamic Shine"], desc: "Building influence and strengthening community presence.", benefits: ["Commander Badge","Advanced Chat Bubble","Enhanced Visibility","Extra Rewards"] },
  { range: "LV41–LV50",   title: "Silver Emperor",            badge: "Silver Imperial Crown",        coins: 25_000_000,    icon: "👑", color: "#9CA3AF", bg: "#F8F9FA", tier: "Silver",     effects: ["Animated Glow","Glass Crystal Effect"], desc: "Elite social member with strong platform activity.", benefits: ["Premium Frame","VIP Welcome Effect","Silver Name Color","Achievement Rewards"] },
  { range: "LV51–LV60",   title: "Golden Knight",             badge: "Golden Warrior Shield",        coins: 40_000_000,    icon: "🛡️", color: "#F59E0B", bg: "#FFFBEB", tier: "Silver",     effects: ["Soft Fire Glow","Metallic Reflection"], desc: "Highly active user with growing influence.", benefits: ["Gold Username","Premium Bubble","Party Room Priority","Knight Achievement"] },
  { range: "LV61–LV70",   title: "Golden Champion",           badge: "Golden Star Crown",            coins: 65_000_000,    icon: "⭐", color: "#F59E0B", bg: "#FFFBEB", tier: "Gold",       effects: ["Floating Stars","Dynamic Lighting"], desc: "Recognized contributor and supporter.", benefits: ["Gold Crown Badge","Bonus Rewards","Exclusive Events","Priority Features"] },
  { range: "LV71–LV80",   title: "Golden Master",             badge: "Royal Gold Emblem",            coins: 100_000_000,   icon: "🏅", color: "#F59E0B", bg: "#FFFBEB", tier: "Gold",       effects: ["Crystal Highlights","Premium Shadow"], desc: "Respected veteran within the VYRO ecosystem.", benefits: ["Elite Chat Bubble","Special Entrance","Gold Frame","Reward Multiplier"] },
  { range: "LV81–LV90",   title: "Golden Legend",             badge: "Phoenix Gold Crown",           coins: 150_000_000,   icon: "🦅", color: "#F59E0B", bg: "#FFFBEB", tier: "Gold",       effects: ["Fire Particles","Crystal Wings"], desc: "A powerful social personality with strong community presence.", benefits: ["Legendary Badge","Premium Rewards","Special Animations","Exclusive Access"] },
  { range: "LV91–LV100",  title: "Golden Supreme",            badge: "Supreme Gold Throne Crown",    coins: 220_000_000,   icon: "🔱", color: "#F59E0B", bg: "#FFFBEB", tier: "Gold",       effects: ["Gold Diamonds","Animated Aura"], desc: "One of the platform's elite social members.", benefits: ["Supreme Crown","Premium Decorations","VIP Features","Gold Prestige Status"] },
  { range: "LV101–LV110", title: "Diamond Elite",             badge: "Diamond Shield",               coins: 350_000_000,   icon: "💎", color: "#06B6D4", bg: "#F0FDFF", tier: "Sapphire",   effects: ["Diamond Glow","Crystal Shine"], benefits: ["Diamond Profile Frame","Diamond Username","Exclusive Avatar Border","Premium Entrance Animation"] },
  { range: "LV111–LV120", title: "Diamond Hero",              badge: "Diamond Sword Crest",          coins: 500_000_000,   icon: "⚔️", color: "#06B6D4", bg: "#F0FDFF", tier: "Sapphire",   effects: ["Hero Aura","Blade Shine"], benefits: ["Hero Badge","Diamond Glow Effect","Enhanced Rewards","Elite Recognition"] },
  { range: "LV121–LV130", title: "Diamond Lord",              badge: "Royal Diamond Crown",          coins: 700_000_000,   icon: "👑", color: "#06B6D4", bg: "#F0FDFF", tier: "Emerald",    effects: ["Royal Glow","Diamond Rain"], benefits: ["Diamond VIP Status","Premium Nameplate","Special Access Rights","Luxury Effects"] },
  { range: "LV131–LV140", title: "Diamond King",              badge: "Diamond Throne Emblem",        coins: 1_000_000_000, icon: "🏆", color: "#06B6D4", bg: "#F0FDFF", tier: "Emerald",    effects: ["Throne Aura","King Glow"], benefits: ["King Badge","Diamond Entrance Effect","Monthly Rewards","Elite Collection"] },
  { range: "LV141–LV150", title: "Diamond Emperor",           badge: "Imperial Diamond Crown",       coins: 1_400_000_000, icon: "⚜️", color: "#06B6D4", bg: "#F0FDFF", tier: "Emerald",    effects: ["Emperor Aura","Crystal Halo"], benefits: ["Emperor Status","Advanced Profile Effects","Exclusive Content","Premium Gifts"] },
  { range: "LV151–LV160", title: "Royal Noble",               badge: "Sapphire Royal Crown",         coins: 1_700_000_000, icon: "💠", color: "#8B5CF6", bg: "#F5F3FF", tier: "Ruby",       effects: ["Noble Aura","Sapphire Glow"], benefits: ["Royal Frame","Royal Decorations","Premium Visibility","Exclusive Privileges"] },
  { range: "LV161–LV170", title: "Royal Duke",                badge: "Sapphire Lion Crest",          coins: 2_200_000_000, icon: "🦁", color: "#8B5CF6", bg: "#F5F3FF", tier: "Ruby",       effects: ["Lion Roar FX","Duke Shine"], benefits: ["Duke Badge","VIP Access","Monthly Bonuses","Royal Rewards"] },
  { range: "LV171–LV180", title: "Royal King",                badge: "Royal Dragon Crown",           coins: 3_000_000_000, icon: "🐲", color: "#8B5CF6", bg: "#F5F3FF", tier: "Ruby",       effects: ["Dragon FX","Royal Entrance"], benefits: ["Dragon Effects","Royal Entrance","Premium Collection","Event Invitations"] },
  { range: "LV181–LV190", title: "Royal Emperor",             badge: "Imperial Dragon Crest",        coins: 4_000_000_000, icon: "🌟", color: "#8B5CF6", bg: "#F5F3FF", tier: "Amethyst",   effects: ["Emperor Halo","Dragon Wings"], benefits: ["Emperor Crown","Royal Username","Exclusive Gifts","Elite Access"] },
  { range: "LV191–LV200", title: "Royal Sovereign",           badge: "Supreme Royal Throne",         coins: 5_000_000_000, icon: "⚡", color: "#8B5CF6", bg: "#F5F3FF", tier: "Amethyst",   effects: ["Sovereign Aura","Throne Glow"], benefits: ["Sovereign Status","Exclusive Decorations","VIP+ Access","Special Rewards"] },
  { range: "LV201–LV210", title: "Mythic Warrior",            badge: "Mythic Crystal Shield",        coins: 6_500_000_000, icon: "🔮", color: "#DC2626", bg: "#FFF5F5", tier: "Diamond",    effects: ["Mythic Surge","Crystal Shield FX"], benefits: ["Mythic Frame","Mythic Effects","Event Access","Monthly Rewards"] },
  { range: "LV211–LV220", title: "Mythic Champion",           badge: "Mythic Crown",                 coins: 8_000_000_000, icon: "🏆", color: "#DC2626", bg: "#FFF5F5", tier: "Diamond",    effects: ["Champion Burst","Mythic Crown Glow"], benefits: ["Champion Badge","Premium Rewards","VIP Recognition","Elite Access"] },
  { range: "LV221–LV230", title: "Mythic Titan",              badge: "Titan Crystal Crest",          coins: 10_000_000_000,icon: "⚡", color: "#DC2626", bg: "#FFF5F5", tier: "Diamond",    effects: ["Titan Strike","Crystal Burst"], benefits: ["Titan Status","Rare Cosmetics","Event Priority","Enhanced Features"] },
  { range: "LV231–LV240", title: "Mythic Overlord",           badge: "Mythic Dragon Crown",          coins: 13_000_000_000,icon: "🐉", color: "#DC2626", bg: "#FFF5F5", tier: "Legend",     effects: ["Overlord Surge","Dragon Crown FX"], benefits: ["Overlord Badge","Premium Animations","Priority Support","Exclusive Access"] },
  { range: "LV241–LV250", title: "Mythic Supreme",            badge: "Supreme Mythic Throne",        coins: 16_000_000_000,icon: "🌌", color: "#DC2626", bg: "#FFF5F5", tier: "Legend",     effects: ["Supreme Aura","Mythic Storm"], benefits: ["Supreme Status","Luxury Collection","Global Recognition","Rare Rewards"] },
  { range: "LV251–LV260", title: "Legendary Dragon",          badge: "Dragon King Emblem",           coins: 20_000_000_000,icon: "🐲", color: "#7C3AED", bg: "#F5F3FF", tier: "Legend",     effects: ["Dragon Breath","King Glow"], benefits: ["Legendary Dragon Badge","Premium Invitations","Rare Gifts","Elite Rewards"] },
  { range: "LV261–LV270", title: "Legendary Titan",           badge: "Titan Dragon Crest",           coins: 25_000_000_000,icon: "⚡", color: "#7C3AED", bg: "#F5F3FF", tier: "Legend",     effects: ["Titan Roar","Dragon Crest FX"], benefits: ["Titan Status","Special Privileges","Exclusive Access","Event Priority"] },
  { range: "LV271–LV280", title: "Legendary Overlord",        badge: "Overlord Dragon Crown",        coins: 30_000_000_000,icon: "🔱", color: "#7C3AED", bg: "#F5F3FF", tier: "Legend",     effects: ["Overlord Storm","Dragon Surge"], benefits: ["Overlord Collection","VIP+ Features","Special Recognition","Luxury Rewards"] },
  { range: "LV281–LV290", title: "Legendary Universe King",   badge: "Cosmic Crown",                 coins: 38_000_000_000,icon: "🌠", color: "#0EA5E9", bg: "#F0F9FF", tier: "Legend",     effects: ["Cosmic Pulse","Universe Glow"], benefits: ["Universe Frame","Cosmic Effects","Global Access","Annual Rewards"] },
  { range: "LV291–LV299", title: "Legendary Universe Emperor",badge: "Universal Emperor Crest",      coins: 45_000_000_000,icon: "🌌", color: "#0EA5E9", bg: "#F0F9FF", tier: "Legend",     effects: ["Emperor Nebula","Universe Crown"], benefits: ["Emperor Recognition","Exclusive Cosmetics","Global Prestige","Ultimate Rewards"] },
  { range: "LV300",        title: "Ultimate Universe Emperor", badge: "Ultimate Cosmic Emperor Crown",coins: 50_000_000_000,icon: "🏆", color: "#F59E0B", bg: "#FFFBEB", tier: "ULTIMATE",   isMax: true, effects: ["Animated Nebula Effects","Dynamic Lighting Engine","Holographic Reflections","Floating Energy Rings"], desc: "The highest achievable status in VYRO LIVE CONNECT.", benefits: ["Exclusive LV300 Emperor Badge","Ultimate Animated Profile Frame","Cosmic Nameplate Animation","Global Leaderboard Highlight","VIP+ Priority Support","Exclusive Annual Rewards","Elite Achievement Collection","Universal Prestige Status","Founder-Class Recognition","Unique Entrance Animation","Exclusive LV300 Gift Effects","Lifetime Prestige Collection"] },
];

const TIER_GROUPS = [
  { label: "Iron / Bronze",  filter: ["Iron","Bronze"],                  color: "#CD7F32" },
  { label: "Silver",         filter: ["Silver"],                          color: "#9CA3AF" },
  { label: "Gold",           filter: ["Gold"],                            color: "#F59E0B" },
  { label: "Sapphire / Emerald", filter: ["Sapphire","Emerald"],         color: "#06B6D4" },
  { label: "Ruby / Amethyst",filter: ["Ruby","Amethyst"],                 color: "#8B5CF6" },
  { label: "Diamond",        filter: ["Diamond"],                         color: "#DC2626" },
  { label: "Legend / Ultimate", filter: ["Legend","ULTIMATE"],            color: "#7C3AED" },
];

function Badge3D({ icon, color, size = 52 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `radial-gradient(circle at 33% 28%, ${color}EE, ${color}66)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44,
      boxShadow: `0 4px 16px ${color}55, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.2)`,
      border: `1.5px solid ${color}55`,
    }}>
      {icon}
    </div>
  );
}

function LevelCard({ lv, index, expanded, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.4) }}
      style={{ marginBottom: 10 }}>
      {/* Card Header */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        style={{
          width: "100%", cursor: "pointer", border: "none", textAlign: "left",
          background: lv.isMax
            ? "linear-gradient(135deg, #0D1B3E, #92400E)"
            : lv.bg,
          borderRadius: expanded ? "16px 16px 0 0" : 16,
          padding: "13px 14px",
          border: lv.isMax ? "none" : `1px solid ${lv.color}22`,
          boxShadow: lv.isMax
            ? "0 8px 28px rgba(245,158,11,0.3)"
            : "0 2px 10px rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
        <Badge3D icon={lv.icon} color={lv.color} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 900, padding: "2px 8px", borderRadius: 8,
              background: lv.isMax ? "rgba(245,158,11,0.3)" : `${lv.color}18`,
              color: lv.isMax ? "#F59E0B" : lv.color, border: `1px solid ${lv.color}33`,
            }}>{lv.range}</span>
            {lv.isMax && <span style={{ fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 10, background: "#F59E0B", color: "#fff" }}>ULTIMATE</span>}
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color: lv.isMax ? "#fff" : "#0D1B3E", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {lv.title}
          </div>
          <div style={{ fontSize: 10, color: lv.isMax ? "rgba(255,255,255,0.55)" : "#9CA3AF", marginTop: 1 }}>
            {lv.badge}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: lv.isMax ? "#F59E0B" : lv.color, fontFamily: "monospace" }}>
            {formatBig(lv.coins)}
          </div>
          <div style={{ fontSize: 9, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>coins</div>
          <div style={{ fontSize: 12, color: lv.isMax ? "rgba(255,255,255,0.5)" : "#9CA3AF", marginTop: 4 }}>
            {expanded ? "▲" : "▼"}
          </div>
        </div>
      </motion.button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}>
            <div style={{
              background: lv.isMax ? "linear-gradient(135deg, #111827, #1C1409)" : "#fff",
              borderRadius: "0 0 16px 16px",
              border: lv.isMax ? "none" : `1px solid ${lv.color}18`,
              borderTop: "none",
              padding: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}>
              {lv.desc && (
                <p style={{ fontSize: 11, color: lv.isMax ? "rgba(255,255,255,0.6)" : "#6B7280", marginBottom: 12, lineHeight: 1.6 }}>
                  {lv.desc}
                </p>
              )}

              {/* Effects */}
              {lv.effects && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF", marginBottom: 6, letterSpacing: "0.06em" }}>✨ SPECIAL EFFECTS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {lv.effects.map((e, i) => (
                      <span key={i} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: lv.isMax ? "rgba(245,158,11,0.15)" : `${lv.color}12`,
                        color: lv.isMax ? "#F59E0B" : lv.color,
                        border: `1px solid ${lv.color}30`,
                      }}>{e}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF", marginBottom: 6, letterSpacing: "0.06em" }}>🎁 BENEFITS UNLOCKED</div>
                <div style={{ display: "grid", gridTemplateColumns: lv.isMax ? "1fr 1fr" : "1fr 1fr", gap: 6 }}>
                  {lv.benefits.map((b, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 7,
                      background: lv.isMax ? "rgba(255,255,255,0.06)" : `${lv.color}08`,
                      borderRadius: 10, padding: "7px 10px",
                      border: `1px solid ${lv.color}18`,
                    }}>
                      <span style={{ fontSize: 12, flexShrink: 0 }}>⭐</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: lv.isMax ? "rgba(255,255,255,0.85)" : "#374151", lineHeight: 1.3 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coin progress bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>Progress to this tier</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: lv.color }}>
                    {Math.round((Math.log10(lv.coins + 1) / Math.log10(50_000_000_000)) * 100)}%
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: lv.isMax ? "rgba(255,255,255,0.1)" : "#F0F0F8", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((Math.log10(lv.coins + 1) / Math.log10(50_000_000_000)) * 100)}%` }}
                    transition={{ duration: 0.7 }}
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

export default function UserLevelProgression() {
  const [expanded, setExpanded] = useState(null);
  const [filterGroup, setFilterGroup] = useState(null);

  const filtered = filterGroup !== null
    ? LEVELS.filter(l => TIER_GROUPS[filterGroup].filter.includes(l.tier))
    : LEVELS;

  const toggle = (i) => setExpanded(prev => prev === i ? null : i);

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B3E, #A855F7)",
        padding: "20px 16px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            border: "1px solid rgba(255,255,255,0.25)",
          }}>👤</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>User Level System</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
              LV1–LV300 · 31 Tier Ranges · 50B Coins Total
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Total Levels", value: "300", icon: "📊" },
            { label: "Tier Ranges", value: "31", icon: "🏅" },
            { label: "Max Coins", value: "50B", icon: "🪙" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 8px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 14 }}>
          <button onClick={() => setFilterGroup(null)}
            style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 10, fontWeight: 800,
              cursor: "pointer", border: "none",
              background: filterGroup === null ? "#fff" : "rgba(255,255,255,0.15)",
              color: filterGroup === null ? "#A855F7" : "rgba(255,255,255,0.8)",
            }}>All Tiers</button>
          {TIER_GROUPS.map((g, i) => (
            <button key={g.label} onClick={() => setFilterGroup(i)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 10, fontWeight: 800,
                cursor: "pointer", border: "none",
                background: filterGroup === i ? "#fff" : "rgba(255,255,255,0.15)",
                color: filterGroup === i ? g.color : "rgba(255,255,255,0.8)",
              }}>{g.label}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "14px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.05em" }}>
          {filtered.length} LEVEL RANGES · TAP TO EXPAND
        </div>
        {filtered.map((lv, i) => (
          <LevelCard
            key={lv.range}
            lv={lv}
            index={i}
            expanded={expanded === lv.range}
            onToggle={() => toggle(lv.range)}
          />
        ))}
      </div>
    </div>
  );
}