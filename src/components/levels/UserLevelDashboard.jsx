/**
 * UserLevelDashboard — Full User Level Dashboard
 * Tabs: Overview · Level Journey · Rewards · Achievements · Collections · Privileges · Statistics
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Formatter ─── */
function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ─── Level Data ─── */
const LEVELS = [
  { range: "LV1–LV10",    title: "Rising Spark",               badge: "Bronze Crystal Shield",        coins: 1_500_000,      icon: "🛡️", color: "#CD7F32", tier: "Iron",       effects: ["Soft Blue Glow","Crystal Edge Effect"],           benefits: ["Starter Profile Frame","Basic Chat Bubble","Daily Login Bonus","New User Badge"] },
  { range: "LV11–LV20",   title: "Social Explorer",            badge: "Bronze Crown",                 coins: 4_000_000,      icon: "👑", color: "#CD7F32", tier: "Iron",       effects: ["Animated Spark Particles","Metallic Reflection"],  benefits: ["Bronze Profile Frame","Enhanced XP Rewards","Explorer Badge","Special Emoji Pack"] },
  { range: "LV21–LV30",   title: "Silver Guardian",            badge: "Silver Shield Crown",          coins: 8_000_000,      icon: "🥈", color: "#9CA3AF", tier: "Bronze",     effects: ["Crystal Reflection","Premium Glow"],               benefits: ["Silver Frame","Username Highlight","VIP Entry Animation","Daily Reward Boost"] },
  { range: "LV31–LV40",   title: "Silver Commander",           badge: "Royal Silver Crest",           coins: 15_000_000,     icon: "⚔️", color: "#9CA3AF", tier: "Bronze",     effects: ["Diamond Particles","Dynamic Shine"],               benefits: ["Commander Badge","Advanced Chat Bubble","Enhanced Visibility","Extra Rewards"] },
  { range: "LV41–LV50",   title: "Silver Emperor",             badge: "Silver Imperial Crown",        coins: 25_000_000,     icon: "👑", color: "#9CA3AF", tier: "Silver",     effects: ["Animated Glow","Glass Crystal Effect"],           benefits: ["Premium Frame","VIP Welcome Effect","Silver Name Color","Achievement Rewards"] },
  { range: "LV51–LV60",   title: "Golden Knight",              badge: "Golden Warrior Shield",        coins: 40_000_000,     icon: "🛡️", color: "#F59E0B", tier: "Silver",     effects: ["Soft Fire Glow","Metallic Reflection"],            benefits: ["Gold Username","Premium Bubble","Party Room Priority","Knight Achievement"] },
  { range: "LV61–LV70",   title: "Golden Champion",            badge: "Golden Star Crown",            coins: 65_000_000,     icon: "⭐", color: "#F59E0B", tier: "Gold",       effects: ["Floating Stars","Dynamic Lighting"],               benefits: ["Gold Crown Badge","Bonus Rewards","Exclusive Events","Priority Features"] },
  { range: "LV71–LV80",   title: "Golden Master",              badge: "Royal Gold Emblem",            coins: 100_000_000,    icon: "🏅", color: "#F59E0B", tier: "Gold",       effects: ["Crystal Highlights","Premium Shadow"],             benefits: ["Elite Chat Bubble","Special Entrance","Gold Frame","Reward Multiplier"] },
  { range: "LV81–LV90",   title: "Golden Legend",              badge: "Phoenix Gold Crown",           coins: 150_000_000,    icon: "🦅", color: "#F59E0B", tier: "Gold",       effects: ["Fire Particles","Crystal Wings"],                  benefits: ["Legendary Badge","Premium Rewards","Special Animations","Exclusive Access"] },
  { range: "LV91–LV100",  title: "Golden Supreme",             badge: "Supreme Gold Throne Crown",    coins: 220_000_000,    icon: "🔱", color: "#F59E0B", tier: "Gold",       effects: ["Gold Diamonds","Animated Aura"],                   benefits: ["Supreme Crown","Premium Decorations","VIP Features","Gold Prestige Status"] },
  { range: "LV101–LV110", title: "Diamond Elite",              badge: "Diamond Shield",               coins: 350_000_000,    icon: "💎", color: "#06B6D4", tier: "Sapphire",   effects: ["Diamond Glow","Crystal Shine"],                    benefits: ["Diamond Profile Frame","Diamond Username","Exclusive Avatar Border","Premium Entrance Animation"] },
  { range: "LV111–LV120", title: "Diamond Hero",               badge: "Diamond Sword Crest",          coins: 500_000_000,    icon: "⚔️", color: "#06B6D4", tier: "Sapphire",   effects: ["Hero Aura","Blade Shine"],                         benefits: ["Hero Badge","Diamond Glow Effect","Enhanced Rewards","Elite Recognition"] },
  { range: "LV121–LV130", title: "Diamond Lord",               badge: "Royal Diamond Crown",          coins: 700_000_000,    icon: "👑", color: "#06B6D4", tier: "Emerald",    effects: ["Royal Glow","Diamond Rain"],                       benefits: ["Diamond VIP Status","Premium Nameplate","Special Access Rights","Luxury Effects"] },
  { range: "LV131–LV140", title: "Diamond King",               badge: "Diamond Throne Emblem",        coins: 1_000_000_000,  icon: "🏆", color: "#06B6D4", tier: "Emerald",    effects: ["Throne Aura","King Glow"],                         benefits: ["King Badge","Diamond Entrance Effect","Monthly Rewards","Elite Collection"] },
  { range: "LV141–LV150", title: "Diamond Emperor",            badge: "Imperial Diamond Crown",       coins: 1_400_000_000,  icon: "⚜️", color: "#06B6D4", tier: "Emerald",    effects: ["Emperor Aura","Crystal Halo"],                     benefits: ["Emperor Status","Advanced Profile Effects","Exclusive Content","Premium Gifts"] },
  { range: "LV151–LV160", title: "Royal Noble",                badge: "Sapphire Royal Crown",         coins: 1_700_000_000,  icon: "💠", color: "#8B5CF6", tier: "Ruby",       effects: ["Noble Aura","Sapphire Glow"],                      benefits: ["Royal Frame","Royal Decorations","Premium Visibility","Exclusive Privileges"] },
  { range: "LV161–LV170", title: "Royal Duke",                 badge: "Sapphire Lion Crest",          coins: 2_200_000_000,  icon: "🦁", color: "#8B5CF6", tier: "Ruby",       effects: ["Lion Roar FX","Duke Shine"],                       benefits: ["Duke Badge","VIP Access","Monthly Bonuses","Royal Rewards"] },
  { range: "LV171–LV180", title: "Royal King",                 badge: "Royal Dragon Crown",           coins: 3_000_000_000,  icon: "🐲", color: "#8B5CF6", tier: "Ruby",       effects: ["Dragon FX","Royal Entrance"],                      benefits: ["Dragon Effects","Royal Entrance","Premium Collection","Event Invitations"] },
  { range: "LV181–LV190", title: "Royal Emperor",              badge: "Imperial Dragon Crest",        coins: 4_000_000_000,  icon: "🌟", color: "#8B5CF6", tier: "Amethyst",   effects: ["Emperor Halo","Dragon Wings"],                     benefits: ["Emperor Crown","Royal Username","Exclusive Gifts","Elite Access"] },
  { range: "LV191–LV200", title: "Royal Sovereign",            badge: "Supreme Royal Throne",         coins: 5_000_000_000,  icon: "⚡", color: "#8B5CF6", tier: "Amethyst",   effects: ["Sovereign Aura","Throne Glow"],                    benefits: ["Sovereign Status","Exclusive Decorations","VIP+ Access","Special Rewards"] },
  { range: "LV201–LV210", title: "Mythic Warrior",             badge: "Mythic Crystal Shield",        coins: 6_500_000_000,  icon: "🔮", color: "#DC2626", tier: "Diamond",    effects: ["Mythic Surge","Crystal Shield FX"],                benefits: ["Mythic Frame","Mythic Effects","Event Access","Monthly Rewards"] },
  { range: "LV211–LV220", title: "Mythic Champion",            badge: "Mythic Crown",                 coins: 8_000_000_000,  icon: "🏆", color: "#DC2626", tier: "Diamond",    effects: ["Champion Burst","Mythic Crown Glow"],               benefits: ["Champion Badge","Premium Rewards","VIP Recognition","Elite Access"] },
  { range: "LV221–LV230", title: "Mythic Titan",               badge: "Titan Crystal Crest",          coins: 10_000_000_000, icon: "⚡", color: "#DC2626", tier: "Diamond",    effects: ["Titan Strike","Crystal Burst"],                    benefits: ["Titan Status","Rare Cosmetics","Event Priority","Enhanced Features"] },
  { range: "LV231–LV240", title: "Mythic Overlord",            badge: "Mythic Dragon Crown",          coins: 13_000_000_000, icon: "🐉", color: "#DC2626", tier: "Legend",     effects: ["Overlord Surge","Dragon Crown FX"],                benefits: ["Overlord Badge","Premium Animations","Priority Support","Exclusive Access"] },
  { range: "LV241–LV250", title: "Mythic Supreme",             badge: "Supreme Mythic Throne",        coins: 16_000_000_000, icon: "🌌", color: "#DC2626", tier: "Legend",     effects: ["Supreme Aura","Mythic Storm"],                     benefits: ["Supreme Status","Luxury Collection","Global Recognition","Rare Rewards"] },
  { range: "LV251–LV260", title: "Legendary Dragon",           badge: "Dragon King Emblem",           coins: 20_000_000_000, icon: "🐲", color: "#7C3AED", tier: "Legend",     effects: ["Dragon Breath","King Glow"],                       benefits: ["Legendary Dragon Badge","Premium Invitations","Rare Gifts","Elite Rewards"] },
  { range: "LV261–LV270", title: "Legendary Titan",            badge: "Titan Dragon Crest",           coins: 25_000_000_000, icon: "⚡", color: "#7C3AED", tier: "Legend",     effects: ["Titan Roar","Dragon Crest FX"],                    benefits: ["Titan Status","Special Privileges","Exclusive Access","Event Priority"] },
  { range: "LV271–LV280", title: "Legendary Overlord",         badge: "Overlord Dragon Crown",        coins: 30_000_000_000, icon: "🔱", color: "#7C3AED", tier: "Legend",     effects: ["Overlord Storm","Dragon Surge"],                   benefits: ["Overlord Collection","VIP+ Features","Special Recognition","Luxury Rewards"] },
  { range: "LV281–LV290", title: "Legendary Universe King",    badge: "Cosmic Crown",                 coins: 38_000_000_000, icon: "🌠", color: "#0EA5E9", tier: "Legend",     effects: ["Cosmic Pulse","Universe Glow"],                    benefits: ["Universe Frame","Cosmic Effects","Global Access","Annual Rewards"] },
  { range: "LV291–LV299", title: "Legendary Universe Emperor", badge: "Universal Emperor Crest",      coins: 45_000_000_000, icon: "🌌", color: "#0EA5E9", tier: "Legend",     effects: ["Emperor Nebula","Universe Crown"],                 benefits: ["Emperor Recognition","Exclusive Cosmetics","Global Prestige","Ultimate Rewards"] },
  { range: "LV300",        title: "Ultimate Universe Emperor",  badge: "Ultimate Cosmic Emperor Crown",coins: 50_000_000_000, icon: "🏆", color: "#F59E0B", tier: "ULTIMATE",   isMax: true, effects: ["Animated Nebula Effects","Dynamic Lighting Engine","Holographic Reflections","Floating Energy Rings"], benefits: ["Exclusive LV300 Emperor Badge","Ultimate Animated Profile Frame","Cosmic Nameplate Animation","Global Leaderboard Highlight","VIP+ Priority Support","Exclusive Annual Rewards","Elite Achievement Collection","Universal Prestige Status","Founder-Class Recognition","Unique Entrance Animation","Exclusive LV300 Gift Effects","Lifetime Prestige Collection"] },
];

// Simulated current user at LV65
const CURRENT_LV_IDX = 6; // LV61-LV70
const CURRENT_LV = LEVELS[CURRENT_LV_IDX];
const NEXT_LV = LEVELS[CURRENT_LV_IDX + 1];
const CURRENT_COINS = 72_000_000;
const CURRENT_PROGRESS = Math.round(((CURRENT_COINS - LEVELS[CURRENT_LV_IDX - 1]?.coins || 0) / (CURRENT_LV.coins - (LEVELS[CURRENT_LV_IDX - 1]?.coins || 0))) * 100);

const MILESTONES = [
  { lv: "LV10",  coins: 1_500_000,      icon: "🛡️", color: "#CD7F32", unlocked: true  },
  { lv: "LV20",  coins: 4_000_000,      icon: "👑", color: "#CD7F32", unlocked: true  },
  { lv: "LV30",  coins: 8_000_000,      icon: "🥈", color: "#9CA3AF", unlocked: true  },
  { lv: "LV50",  coins: 25_000_000,     icon: "👑", color: "#9CA3AF", unlocked: true  },
  { lv: "LV100", coins: 220_000_000,    icon: "🔱", color: "#F59E0B", unlocked: false },
  { lv: "LV150", coins: 1_400_000_000,  icon: "⚜️", color: "#06B6D4", unlocked: false },
  { lv: "LV200", coins: 5_000_000_000,  icon: "⚡", color: "#8B5CF6", unlocked: false },
  { lv: "LV250", coins: 16_000_000_000, icon: "🌌", color: "#DC2626", unlocked: false },
  { lv: "LV300", coins: 50_000_000_000, icon: "🏆", color: "#F59E0B", unlocked: false },
];

const COLLECTIONS = [
  { name: "Bronze Collection",   icon: "🥉", color: "#CD7F32", total: 4,  unlocked: 4,  bg: "#FFF8F0" },
  { name: "Silver Collection",   icon: "🥈", color: "#9CA3AF", total: 6,  unlocked: 3,  bg: "#F8F9FA" },
  { name: "Gold Collection",     icon: "🥇", color: "#F59E0B", total: 8,  unlocked: 2,  bg: "#FFFBEB" },
  { name: "Diamond Collection",  icon: "💎", color: "#06B6D4", total: 6,  unlocked: 0,  bg: "#F0FDFF" },
  { name: "Royal Collection",    icon: "👑", color: "#8B5CF6", total: 6,  unlocked: 0,  bg: "#F5F3FF" },
  { name: "Mythic Collection",   icon: "🔮", color: "#DC2626", total: 5,  unlocked: 0,  bg: "#FFF5F5" },
  { name: "Legendary Collection",icon: "🐉", color: "#7C3AED", total: 5,  unlocked: 0,  bg: "#F5F3FF" },
  { name: "Universe Collection", icon: "🌌", color: "#0EA5E9", total: 3,  unlocked: 0,  bg: "#F0F9FF" },
];

const ACHIEVEMENTS = [
  { name: "First Steps",       icon: "👶", color: "#10B981", desc: "Reach LV10",         unlocked: true  },
  { name: "Explorer",          icon: "🗺️", color: "#1F6BFF", desc: "Reach LV20",         unlocked: true  },
  { name: "Silver Knight",     icon: "⚔️", color: "#9CA3AF", desc: "Reach LV30",         unlocked: true  },
  { name: "Gift Champion",     icon: "🎁", color: "#EC4899", desc: "Send 100 gifts",      unlocked: true  },
  { name: "Social Star",       icon: "⭐", color: "#F59E0B", desc: "Reach LV50",         unlocked: false },
  { name: "Golden Knight",     icon: "🛡️", color: "#F59E0B", desc: "Reach LV60",         unlocked: false },
  { name: "Diamond Elite",     icon: "💎", color: "#06B6D4", desc: "Reach LV100",        unlocked: false },
  { name: "Universe Emperor",  icon: "🌌", color: "#7C3AED", desc: "Reach LV300",        unlocked: false },
];

const PRIVILEGES = [
  { icon: "✅", name: "Verified Badge",       active: true,  tier: "Current" },
  { icon: "🎨", name: "Premium Chat Bubble",  active: true,  tier: "Current" },
  { icon: "✨", name: "Gold Entrance Effect", active: true,  tier: "Current" },
  { icon: "📡", name: "Priority Visibility",  active: true,  tier: "Current" },
  { icon: "💜", name: "Royal Profile Frame",  active: false, tier: "LV151+" },
  { icon: "🌟", name: "Emperor Aura Effect",  active: false, tier: "LV181+" },
  { icon: "🏆", name: "Leaderboard Crown",    active: false, tier: "LV300"  },
];

const STATISTICS = [
  { label: "Total Coins Earned",    value: "72.0M",  icon: "🪙", color: "#F59E0B" },
  { label: "Total XP Earned",       value: "154K",   icon: "⭐", color: "#A855F7" },
  { label: "Total Login Days",      value: "143",    icon: "📅", color: "#10B981" },
  { label: "Gifts Sent",            value: "328",    icon: "🎁", color: "#EC4899" },
  { label: "Gifts Received",        value: "92",     icon: "💝", color: "#F97316" },
  { label: "Events Joined",         value: "24",     icon: "🏆", color: "#1F6BFF" },
  { label: "Party Rooms Joined",    value: "67",     icon: "🎉", color: "#7C3AED" },
  { label: "Active Hours",          value: "412h",   icon: "⏱️", color: "#06B6D4" },
];

/* ─── Badge3D ─── */
function Badge3D({ icon, color, size = 52 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `radial-gradient(circle at 33% 28%, ${color}FF, ${color}77)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.44,
      boxShadow: `0 4px 18px ${color}55, inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)`,
      border: `1.5px solid ${color}66`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "18%", right: 0, height: "40%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, transparent 100%)",
        borderRadius: "0 0 50% 50%",
      }} />
      {icon}
    </div>
  );
}

/* ─── Section Label ─── */
function SectionLabel({ label }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>
      {label}
    </div>
  );
}

/* ─── TABS ─── */
const TABS = [
  { id: "overview",   label: "Overview",      icon: "📊" },
  { id: "journey",    label: "Journey",        icon: "🗺️" },
  { id: "rewards",    label: "Rewards",        icon: "🎁" },
  { id: "achievements",label:"Achievements",   icon: "🏆" },
  { id: "collections",label: "Collections",   icon: "💎" },
  { id: "privileges", label: "Privileges",     icon: "👑" },
  { id: "statistics", label: "Statistics",     icon: "📈" },
];

/* ══════════════════════════════════════════════════════
   TAB PANELS
══════════════════════════════════════════════════════ */

/* ── Overview Tab ── */
function OverviewTab() {
  const pct = Math.min(100, CURRENT_PROGRESS);

  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Profile Header */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B3E, #1F6BFF)",
        borderRadius: 20, padding: "20px",
        boxShadow: "0 8px 28px rgba(31,107,255,0.28)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: "linear-gradient(135deg, #F59E0B, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, border: "3px solid rgba(255,255,255,0.3)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}>👤</div>
            <div style={{
              position: "absolute", bottom: -4, right: -4,
              width: 20, height: 20, borderRadius: "50%",
              background: "#10B981", border: "2px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9,
            }}>●</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO User</span>
              <span style={{ fontSize: 12 }}>✅</span>
              <span style={{ fontSize: 10 }}>🇶🇦</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>ID: #VY2024001 · VIP Gold</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Edit Profile","Share","Full Profile"].map((a, i) => (
                <button key={i} style={{
                  padding: "4px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800,
                  background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                }}>{a}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Level Card */}
        <div style={{
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          borderRadius: 16, padding: "14px",
          border: "1px solid rgba(255,255,255,0.18)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Badge3D icon={CURRENT_LV.icon} color={CURRENT_LV.color} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 1 }}>CURRENT LEVEL</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#FFC83D" }}>LV 65</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{CURRENT_LV.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{CURRENT_LV.tier} Tier · {CURRENT_LV.badge}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FFC83D" }}>{pct}%</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Progress</div>
            </div>
          </div>

          {/* XP Progress */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Coins Progress</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#FFC83D" }}>{fmt(CURRENT_COINS)} / {fmt(CURRENT_LV.coins)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #FFC83D, #F59E0B)" }}
              />
            </div>
          </div>

          {/* Next Level Preview */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
            <Badge3D icon={NEXT_LV.icon} color={NEXT_LV.color} size={28} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>NEXT: </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{NEXT_LV.range} · {NEXT_LV.title}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: NEXT_LV.color }}>{fmt(NEXT_LV.coins - CURRENT_COINS)} needed</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <SectionLabel label="⚡ QUICK STATS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "Current Level", value: "65",   icon: "📊", color: "#1F6BFF" },
            { label: "Current Tier",  value: "Gold",  icon: "🥇", color: "#F59E0B" },
            { label: "Achievements",  value: "4/8",   icon: "🏆", color: "#10B981" },
            { label: "Rewards",       value: "9",     icon: "🎁", color: "#EC4899" },
            { label: "Badges",        value: "7",     icon: "🏅", color: "#A855F7" },
            { label: "Collection",    value: "23%",   icon: "💎", color: "#06B6D4" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#fff", borderRadius: 14, padding: "12px 10px", textAlign: "center",
              border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Benefits */}
      <div>
        <SectionLabel label="✨ CURRENT ACTIVE BENEFITS" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {[
            { icon: "🏅", name: "Active Badge",         value: "Gold Champion",       color: "#F59E0B" },
            { icon: "👑", name: "Active Crown",          value: "Golden Star Crown",   color: "#F59E0B" },
            { icon: "🖼️", name: "Active Profile Frame",  value: "Gold Crown Frame",    color: "#F59E0B" },
            { icon: "💬", name: "Active Chat Bubble",     value: "Premium Gold Bubble", color: "#1F6BFF" },
            { icon: "✨", name: "Entrance Effect",        value: "Floating Stars",      color: "#A855F7" },
          ].map((b, i, arr) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {b.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{b.name}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{b.value}</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Preview","Equip"].map(a => (
                  <button key={a} style={{
                    padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 800,
                    background: a === "Equip" ? b.color : "#F5F7FA",
                    color: a === "Equip" ? "#fff" : "#6B7280",
                    border: "none", cursor: "pointer",
                  }}>{a}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Status */}
      <div>
        <SectionLabel label="🏅 LEADERBOARD STATUS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Global Rank",  value: "#4,821",  icon: "🌍", color: "#1F6BFF" },
            { label: "Country Rank", value: "#128",    icon: "🇶🇦", color: "#10B981" },
            { label: "Friends Rank", value: "#3",      icon: "👥", color: "#F59E0B" },
            { label: "Monthly Rank", value: "#1,204",  icon: "📅", color: "#A855F7" },
          ].map(r => (
            <div key={r.label} style={{
              background: "#fff", borderRadius: 14, padding: "14px",
              border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${r.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {r.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: r.color }}>{r.value}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{r.label}</div>
              </div>
            </div>
          ))}
        </div>
        <button style={{
          width: "100%", marginTop: 8, padding: "12px", borderRadius: 14,
          background: "linear-gradient(135deg, #0D1B3E, #1F6BFF)", color: "#fff",
          border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer",
          boxShadow: "0 4px 14px rgba(31,107,255,0.3)",
        }}>🏆 Open Leaderboard</button>
      </div>
    </div>
  );
}

/* ── Journey Tab ── */
function JourneyTab() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Journey Path */}
      <div>
        <SectionLabel label="🗺️ LEVEL JOURNEY — TIER PROGRESSION" />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
          {[
            { label: "Iron",     icon: "⚙️", color: "#9E9E9E", done: true  },
            { label: "Bronze",   icon: "🥉", color: "#CD7F32", done: true  },
            { label: "Silver",   icon: "🥈", color: "#9CA3AF", done: true  },
            { label: "Gold",     icon: "🥇", color: "#F59E0B", current: true },
            { label: "Sapphire", icon: "💎", color: "#06B6D4", done: false },
            { label: "Emerald",  icon: "💚", color: "#10B981", done: false },
            { label: "Ruby",     icon: "❤️", color: "#DC2626", done: false },
            { label: "Amethyst", icon: "💜", color: "#8B5CF6", done: false },
            { label: "Legend",   icon: "🌌", color: "#7C3AED", done: false },
            { label: "ULTIMATE", icon: "🏆", color: "#F59E0B", done: false },
          ].map((t, i) => (
            <div key={t.label} style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14, margin: "0 auto 4px",
                background: t.current
                  ? `radial-gradient(circle at 35% 30%, ${t.color}FF, ${t.color}88)`
                  : t.done ? `${t.color}22` : "#F5F7FA",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
                border: t.current ? `2px solid ${t.color}` : `1px solid ${t.color}33`,
                boxShadow: t.current ? `0 4px 14px ${t.color}44` : "none",
              }}>{t.icon}</div>
              <div style={{ fontSize: 8, fontWeight: 800, color: t.current ? t.color : t.done ? "#6B7280" : "#D1D5DB" }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <SectionLabel label="🎯 KEY MILESTONES" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {MILESTONES.map((m, i) => (
            <div key={m.lv} style={{
              background: "#fff", borderRadius: 14, padding: "12px 14px",
              border: `1px solid ${m.unlocked ? m.color + "33" : "#F0F0F8"}`,
              display: "flex", alignItems: "center", gap: 12,
              opacity: m.unlocked ? 1 : 0.65,
              boxShadow: m.unlocked ? `0 2px 10px ${m.color}18` : "none",
            }}>
              <Badge3D icon={m.icon} color={m.unlocked ? m.color : "#D1D5DB"} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{m.lv}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Coins required: {fmt(m.coins)}</div>
              </div>
              <div style={{
                padding: "4px 10px", borderRadius: 10, fontSize: 10, fontWeight: 800,
                background: m.unlocked ? "#ECFDF5" : "#F5F7FA",
                color: m.unlocked ? "#10B981" : "#9CA3AF",
              }}>{m.unlocked ? "✅ Unlocked" : "🔒 Locked"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All Level Ranges */}
      <div>
        <SectionLabel label="📋 ALL 31 LEVEL RANGES — TAP TO EXPAND" />
        {LEVELS.map((lv, i) => {
          const isCurrent = i === CURRENT_LV_IDX;
          const isPast = i < CURRENT_LV_IDX;
          const isOpen = openIdx === i;
          return (
            <motion.div key={lv.range} style={{ marginBottom: 8 }}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                background: lv.isMax
                  ? "linear-gradient(135deg, #0D1B3E, #92400E)"
                  : isCurrent ? `${lv.color}18` : "#fff",
                borderRadius: isOpen ? "14px 14px 0 0" : 14,
                padding: "11px 13px",
                border: isCurrent ? `2px solid ${lv.color}` : `1px solid ${lv.isMax ? "transparent" : lv.color + "22"}`,
                boxShadow: isCurrent ? `0 4px 14px ${lv.color}33` : lv.isMax ? "0 6px 20px rgba(245,158,11,0.25)" : "0 1px 6px rgba(0,0,0,0.04)",
                cursor: "pointer", textAlign: "left",
              }}>
                <Badge3D icon={lv.icon} color={isPast || isCurrent ? lv.color : "#D1D5DB"} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: lv.isMax ? "#F59E0B" : isCurrent ? lv.color : "#0D1B3E" }}>
                    {lv.range} · {lv.title}
                  </div>
                  <div style={{ fontSize: 9, color: lv.isMax ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{lv.badge}</div>
                </div>
                {isCurrent && <span style={{ fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 8, background: lv.color, color: "#fff", flexShrink: 0 }}>CURRENT</span>}
                <span style={{ fontSize: 12, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}>{isOpen ? "▲" : "▼"}</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
                    <div style={{
                      background: lv.isMax ? "#111827" : "#FAFBFF",
                      borderRadius: "0 0 14px 14px", padding: "12px 13px",
                      border: `1px solid ${lv.color}18`, borderTop: "none",
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF", marginBottom: 6 }}>🎁 BENEFITS</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                        {lv.benefits.map((b, bi) => (
                          <div key={bi} style={{ display: "flex", alignItems: "center", gap: 6, background: lv.isMax ? "rgba(255,255,255,0.05)" : `${lv.color}08`, borderRadius: 8, padding: "6px 8px" }}>
                            <span style={{ fontSize: 10 }}>⭐</span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: lv.isMax ? "rgba(255,255,255,0.8)" : "#374151" }}>{b}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, fontWeight: 800, color: lv.isMax ? "rgba(255,255,255,0.4)" : "#9CA3AF", marginBottom: 4 }}>✨ EFFECTS</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {lv.effects.map((e, ei) => (
                          <span key={ei} style={{ padding: "3px 8px", borderRadius: 12, fontSize: 9, fontWeight: 700, background: lv.isMax ? "rgba(245,158,11,0.15)" : `${lv.color}10`, color: lv.isMax ? "#F59E0B" : lv.color, border: `1px solid ${lv.color}25` }}>{e}</span>
                        ))}
                      </div>
                      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 9, color: "#9CA3AF" }}>Coins required</span>
                        <span style={{ fontSize: 11, fontWeight: 900, color: lv.color, fontFamily: "monospace" }}>{fmt(lv.coins)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Rewards Tab ── */
function RewardsTab() {
  const [cat, setCat] = useState("Badges");
  const CATS = ["Badges","Crowns","Frames","Nameplates","Chat Bubbles","Entrance Effects","Gift Effects"];
  const REWARD_ITEMS = {
    "Badges":          [{ name: "Bronze Shield",    icon: "🛡️", color: "#CD7F32", lv: 1,   unlocked: true },  { name: "Silver Crown",    icon: "👑", color: "#9CA3AF", lv: 21,  unlocked: true }, { name: "Gold Champion",  icon: "⭐", color: "#F59E0B", lv: 61,  unlocked: true }, { name: "Diamond Elite",  icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }],
    "Crowns":          [{ name: "Bronze Crown",     icon: "👑", color: "#CD7F32", lv: 11,  unlocked: true },  { name: "Silver Crown",   icon: "👑", color: "#9CA3AF", lv: 41,  unlocked: true }, { name: "Gold Supreme",  icon: "🔱", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Diamond Crown", icon: "💎", color: "#06B6D4", lv: 121, unlocked: false }],
    "Frames":          [{ name: "Starter Frame",    icon: "🖼️", color: "#CD7F32", lv: 1,   unlocked: true },  { name: "Silver Frame",   icon: "🖼️", color: "#9CA3AF", lv: 21,  unlocked: true }, { name: "Gold Frame",    icon: "🖼️", color: "#F59E0B", lv: 71,  unlocked: false }, { name: "Diamond Frame", icon: "🖼️", color: "#06B6D4", lv: 101, unlocked: false }],
    "Nameplates":      [{ name: "Basic Nameplate",  icon: "📛", color: "#9CA3AF", lv: 1,   unlocked: true },  { name: "Gold Nameplate", icon: "📛", color: "#F59E0B", lv: 61,  unlocked: false }, { name: "Diamond Plate", icon: "📛", color: "#06B6D4", lv: 121, unlocked: false }, { name: "Royal Plate",   icon: "📛", color: "#8B5CF6", lv: 151, unlocked: false }],
    "Chat Bubbles":    [{ name: "Basic Bubble",     icon: "💬", color: "#9CA3AF", lv: 1,   unlocked: true },  { name: "Premium Bubble", icon: "💬", color: "#F59E0B", lv: 51,  unlocked: false }, { name: "Diamond Bubble",icon: "💬", color: "#06B6D4", lv: 101, unlocked: false }, { name: "Royal Bubble",  icon: "💬", color: "#8B5CF6", lv: 151, unlocked: false }],
    "Entrance Effects":[{ name: "Spark Entry",      icon: "✨", color: "#CD7F32", lv: 11,  unlocked: true },  { name: "VIP Entry",      icon: "🌟", color: "#9CA3AF", lv: 21,  unlocked: true }, { name: "Stars Entry",   icon: "⭐", color: "#F59E0B", lv: 61,  unlocked: false }, { name: "Dragon Entry",  icon: "🐲", color: "#8B5CF6", lv: 171, unlocked: false }],
    "Gift Effects":    [{ name: "Basic Gift FX",    icon: "🎁", color: "#10B981", lv: 1,   unlocked: true },  { name: "Gold Gift FX",   icon: "🎁", color: "#F59E0B", lv: 61,  unlocked: false }, { name: "Diamond FX",    icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }, { name: "Mythic FX",     icon: "🔮", color: "#DC2626", lv: 201, unlocked: false }],
  };
  const items = REWARD_ITEMS[cat] || [];

  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Next Rewards */}
      <div>
        <SectionLabel label="🎁 NEXT REWARDS UNLOCKING AT LV71" />
        <div style={{ background: "linear-gradient(135deg, #0D1B3E, #F59E0B88)", borderRadius: 16, padding: "14px", boxShadow: "0 6px 20px rgba(245,158,11,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Badge3D icon={NEXT_LV.icon} color={NEXT_LV.color} size={44} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{NEXT_LV.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{NEXT_LV.range} — {fmt(NEXT_LV.coins - CURRENT_COINS)} coins needed</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {NEXT_LV.benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 9px" }}>
                <span style={{ fontSize: 10 }}>🔓</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reward Gallery */}
      <div>
        <SectionLabel label="🖼️ REWARD GALLERY" />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              flexShrink: 0, padding: "6px 12px", borderRadius: 16, fontSize: 10, fontWeight: 800,
              background: cat === c ? "#0D1B3E" : "#fff", color: cat === c ? "#fff" : "#6B7280",
              border: cat === c ? "none" : "1px solid #E5E7EB", cursor: "pointer",
              boxShadow: cat === c ? "0 4px 10px rgba(0,0,0,0.15)" : "none",
            }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 16, padding: "14px 12px",
              border: `1px solid ${item.unlocked ? item.color + "33" : "#F0F0F8"}`,
              boxShadow: item.unlocked ? `0 3px 12px ${item.color}18` : "0 1px 4px rgba(0,0,0,0.04)",
              opacity: item.unlocked ? 1 : 0.6,
              textAlign: "center",
            }}>
              <Badge3D icon={item.icon} color={item.unlocked ? item.color : "#D1D5DB"} size={46} />
              <div style={{ fontSize: 11, fontWeight: 800, color: "#0D1B3E", marginTop: 8, marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 8 }}>Requires LV{item.lv}</div>
              {item.unlocked
                ? <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    {["Preview","Equip"].map(a => (
                      <button key={a} style={{ padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 800, background: a === "Equip" ? item.color : "#F5F7FA", color: a === "Equip" ? "#fff" : "#6B7280", border: "none", cursor: "pointer" }}>{a}</button>
                    ))}
                  </div>
                : <div style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF" }}>🔒 LV{item.lv} Required</div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Achievements Tab ── */
function AchievementsTab() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Summary */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E, #10B981)", borderRadius: 18, padding: "18px", boxShadow: "0 6px 20px rgba(16,185,129,0.25)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Total",    value: ACHIEVEMENTS.length, icon: "🏆" },
            { label: "Unlocked", value: unlocked,             icon: "✅" },
            { label: "Locked",   value: ACHIEVEMENTS.length - unlocked, icon: "🔒" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.18)" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement List */}
      <div>
        <SectionLabel label="🏆 ACHIEVEMENT COLLECTION" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: "13px 14px",
              border: `1px solid ${a.unlocked ? a.color + "33" : "#F0F0F8"}`,
              display: "flex", alignItems: "center", gap: 12,
              opacity: a.unlocked ? 1 : 0.6,
              boxShadow: a.unlocked ? `0 2px 10px ${a.color}15` : "none",
            }}>
              <Badge3D icon={a.icon} color={a.unlocked ? a.color : "#D1D5DB"} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{a.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{a.desc}</div>
              </div>
              {a.unlocked
                ? <button style={{ padding: "5px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: a.color, color: "#fff", border: "none", cursor: "pointer" }}>Claim</button>
                : <div style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF" }}>🔒 Locked</div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Collections Tab ── */
function CollectionsTab() {
  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
      <SectionLabel label="💎 COLLECTION PROGRESS" />
      {COLLECTIONS.map((col, i) => {
        const pct = Math.round((col.unlocked / col.total) * 100);
        return (
          <div key={i} style={{
            background: col.unlocked > 0 ? col.bg : "#fff",
            borderRadius: 16, padding: "14px",
            border: `1px solid ${col.color}22`,
            boxShadow: col.unlocked > 0 ? `0 2px 10px ${col.color}15` : "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <Badge3D icon={col.icon} color={col.unlocked > 0 ? col.color : "#D1D5DB"} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{col.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{col.unlocked}/{col.total} items unlocked</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: col.unlocked > 0 ? col.color : "#D1D5DB" }}>{pct}%</div>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#F0F0F8", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.06 }}
                style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${col.color}, ${col.color}AA)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Privileges Tab ── */
function PrivilegesTab() {
  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionLabel label="👑 EXCLUSIVE PRIVILEGES" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PRIVILEGES.map((p, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 14, padding: "13px 14px",
            border: `1px solid ${p.active ? "#1F6BFF33" : "#F0F0F8"}`,
            display: "flex", alignItems: "center", gap: 12,
            opacity: p.active ? 1 : 0.6,
            boxShadow: p.active ? "0 2px 10px rgba(31,107,255,0.1)" : "none",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: p.active ? "#1F6BFF12" : "#F5F7FA",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{p.tier}</div>
            </div>
            <div style={{
              padding: "4px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800,
              background: p.active ? "#ECFDF5" : "#F5F7FA",
              color: p.active ? "#10B981" : "#9CA3AF",
            }}>{p.active ? "✅ Active" : "🔒 Locked"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Statistics Tab ── */
function StatisticsTab() {
  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionLabel label="📈 STATISTICS DASHBOARD" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {STATISTICS.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{
              background: "#fff", borderRadius: 16, padding: "16px 12px",
              border: `1px solid ${s.color}18`,
              boxShadow: `0 2px 10px ${s.color}10`,
              textAlign: "center",
            }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, margin: "0 auto 8px",
              background: `${s.color}12`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Level History */}
      <div>
        <SectionLabel label="📜 RECENT LEVEL HISTORY" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[
            { event: "Reached LV65", time: "2 days ago",  icon: "⬆️", color: "#10B981" },
            { event: "Unlocked Gold Champion Badge", time: "2 days ago", icon: "🏅", color: "#F59E0B" },
            { event: "Reached LV61", time: "1 week ago",  icon: "⬆️", color: "#10B981" },
            { event: "Unlocked Gold Entrance FX",  time: "1 week ago",  icon: "✨", color: "#A855F7" },
            { event: "Reached LV51", time: "3 weeks ago", icon: "⬆️", color: "#10B981" },
          ].map((h, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${h.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{h.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0D1B3E" }}>{h.event}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{h.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function UserLevelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const TAB_PANELS = {
    overview:     <OverviewTab />,
    journey:      <JourneyTab />,
    rewards:      <RewardsTab />,
    achievements: <AchievementsTab />,
    collections:  <CollectionsTab />,
    privileges:   <PrivilegesTab />,
    statistics:   <StatisticsTab />,
  };

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero header */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1F6BFF 100%)", padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid rgba(255,255,255,0.22)" }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>User Level Dashboard</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>LV65 · Gold Tier · {fmt(CURRENT_COINS)} coins</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV65</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Golden Champion</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flexShrink: 0, padding: "9px 12px", border: "none", cursor: "pointer",
              background: "transparent", fontWeight: 800, fontSize: 10,
              color: activeTab === t.id ? "#FFC83D" : "rgba(255,255,255,0.6)",
              borderBottom: activeTab === t.id ? "2px solid #FFC83D" : "2px solid transparent",
              whiteSpace: "nowrap",
            }}>{t.icon} {t.label}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {TAB_PANELS[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}