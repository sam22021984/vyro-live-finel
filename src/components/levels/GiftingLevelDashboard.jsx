/**
 * GiftingLevelDashboard — Full Gifting Level Dashboard
 * Tabs: Overview · Analytics · Rewards · Achievements · Collections · Privileges · Leaderboard
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ─── Gifting Level Progression (exact spec) ─── */
const GIFTING_LEVELS = [
  { range: "LV1–LV10",    title: "Gifter",          icon: "🎁", color: "#9E9E9E", tier: "Newcomer",  coins: 5_000_000,      benefits: ["Basic Gifter Badge","Gift History Access","Basic Chat Bubble","Supporter Tag"] },
  { range: "LV11–LV20",   title: "Generous",        icon: "🥉", color: "#CD7F32", tier: "Bronze",    coins: 15_000_000,     benefits: ["Bronze Gifter Badge","Bronze Frame","Enhanced Recognition","Priority Broadcast"] },
  { range: "LV21–LV30",   title: "Supporter",       icon: "🥈", color: "#C0C0C0", tier: "Silver",    coins: 35_000_000,     benefits: ["Silver Gifter Crown","Silver Nameplate","VIP Entrance","Supporter Status"] },
  { range: "LV31–LV40",   title: "Champion",        icon: "🥇", color: "#FFD700", tier: "Gold",      coins: 75_000_000,     benefits: ["Gold Champion Badge","Gold Frame","Priority Recognition","Premium Chat Bubble"] },
  { range: "LV41–LV50",   title: "Legend",          icon: "💙", color: "#4169E1", tier: "Sapphire",  coins: 150_000_000,    benefits: ["Sapphire Legend Badge","Luxury Entrance FX","Elite Nameplate","VIP Access"] },
  { range: "LV51–LV60",   title: "King",            icon: "💚", color: "#50C878", tier: "Emerald",   coins: 300_000_000,    benefits: ["Emerald King Crown","Royal Frame","Special Gift Effects","Event Priority"] },
  { range: "LV61–LV80",   title: "Emperor",         icon: "❤️", color: "#E0115F", tier: "Ruby",      coins: 700_000_000,    benefits: ["Ruby Emperor Crown","Emperor Aura Effect","Exclusive Room Access","Elite Support"] },
  { range: "LV81–LV100",  title: "God",             icon: "💜", color: "#9B59B6", tier: "Amethyst",  coins: 1_500_000_000,  benefits: ["Amethyst God Crown","God-Tier Entrance FX","Premium Gift Animation","God Recognition"] },
  { range: "LV101–LV120", title: "Divine",          icon: "💎", color: "#B9F2FF", tier: "Diamond",   coins: 3_000_000_000,  benefits: ["Diamond Divine Crown","Crystal Gift FX","Global Recognition","Diamond Privileges"] },
  { range: "LV121–LV140", title: "Eternal",         icon: "👑", color: "#F59E0B", tier: "Gold II",   coins: 6_000_000_000,  benefits: ["Eternal Crown","Golden Gift Effects","Eternal Nameplate","VIP+ Access"] },
  { range: "LV141–LV160", title: "Mythic Gifter",   icon: "🌟", color: "#7C3AED", tier: "Mythic",    coins: 12_000_000_000, benefits: ["Mythic Gifter Badge","Mythic Aura","Exclusive Mythic Gifts","Elite Event Access"] },
  { range: "LV161–LV180", title: "Legendary Gifter",icon: "🐉", color: "#DC2626", tier: "Legendary", coins: 20_000_000_000, benefits: ["Legendary Dragon Crown","Dragon Gift FX","Global Gifter Highlight","Legendary Prestige"] },
  { range: "LV181–LV199", title: "Universe Gifter", icon: "🌌", color: "#0EA5E9", tier: "Universe",  coins: 35_000_000_000, benefits: ["Universe Crown","Cosmic Gift Animations","Universal Recognition","Universe Privileges"] },
  { range: "LV200",        title: "Eternal Universe Gifter", icon: "🏆", color: "#F59E0B", tier: "ULTIMATE", isMax: true, coins: 50_000_000_000, benefits: ["Ultimate Gifter Crown","Cosmic Nameplate Animation","Global Hall of Fame","Exclusive LV200 Gift FX","Lifetime Gifter Recognition","VIP+ Priority Support","Ultimate Prestige Status","Annual Elite Rewards","Founder-Class Gifter Badge","Universal Entrance Animation"] },
];

// Simulated: current gifting level at LV45 (index 4)
const CUR_IDX = 4;
const CURRENT = GIFTING_LEVELS[CUR_IDX];
const NEXT = GIFTING_LEVELS[CUR_IDX + 1];
const CURRENT_COINS = 120_000_000;
const PROG_PCT = Math.min(99, Math.round((CURRENT_COINS / CURRENT.coins) * 100));

const TABS = [
  { id: "overview",     label: "Overview",     icon: "📊" },
  { id: "analytics",   label: "Analytics",    icon: "📈" },
  { id: "rewards",     label: "Rewards",      icon: "🎁" },
  { id: "achievements",label: "Achievements", icon: "🏆" },
  { id: "collections", label: "Collections",  icon: "💎" },
  { id: "privileges",  label: "Privileges",   icon: "👑" },
  { id: "leaderboard", label: "Leaderboard",  icon: "🏅" },
];

/* ─── Shared Components ─── */
function Badge3D({ icon, color, size = 48 }) {
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
      <div style={{ position: "absolute", top: 0, left: "18%", right: 0, height: "40%", background: "linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)", borderRadius: "0 0 50% 50%" }} />
      {icon}
    </div>
  );
}

function SectionLabel({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>;
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "13px 10px", textAlign: "center", border: `1px solid ${color}18`, boxShadow: `0 2px 8px ${color}10` }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, margin: "0 auto 6px", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 9, fontWeight: 700, color, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ pct, color, height = 7 }) {
  return (
    <div style={{ height, borderRadius: height / 2, background: "#F0F0F8", overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.2 }}
        style={{ height: "100%", borderRadius: height / 2, background: `linear-gradient(90deg, ${color}, ${color}AA)` }} />
    </div>
  );
}

/* ══════════════ OVERVIEW TAB ══════════════ */
function OverviewTab() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Profile Header */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E, #EC489988)", borderRadius: 20, padding: 18, boxShadow: "0 8px 28px rgba(236,72,153,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#EC4899,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>🎁</div>
            <div style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#F59E0B", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 900 }}>VIP</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO Gifter</span>
              <span style={{ fontSize: 12 }}>✅</span>
              <span style={{ fontSize: 11 }}>🇶🇦</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>ID: #VG2024001 · Gifting Rank: #3,420</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["View Profile","Share","Gift History"].map(a => (
                <button key={a} style={{ padding: "4px 9px", borderRadius: 9, fontSize: 9, fontWeight: 800, background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>{a}</button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV45</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Legend</div>
          </div>
        </div>

        {/* Current Level Card */}
        <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 14, border: "1px solid rgba(255,255,255,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Badge3D icon={CURRENT.icon} color={CURRENT.color} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 1 }}>CURRENT GIFTING LEVEL</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#FFC83D" }}>LV 45</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{CURRENT.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{CURRENT.tier} Tier · {fmt(CURRENT_COINS)} coins sent</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FFC83D" }}>{PROG_PCT}%</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Progress</div>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>🪙 Coins Sent Progress</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#FFC83D" }}>{fmt(CURRENT_COINS)} / {fmt(CURRENT.coins)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${PROG_PCT}%` }} transition={{ duration: 1, delay: 0.3 }}
                style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#EC4899,#F59E0B)" }} />
            </div>
          </div>
          {/* Next Level */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
            <Badge3D icon={NEXT.icon} color={NEXT.color} size={28} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>NEXT: </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{NEXT.range} · {NEXT.title}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: NEXT.color, flexShrink: 0 }}>{fmt(NEXT.coins - CURRENT_COINS)} 🪙 needed</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <SectionLabel label="⚡ GIFTING QUICK STATS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "🎁", label: "Gifting Level",    value: "45",    color: "#EC4899" },
            { icon: "💙", label: "Tier",              value: "Sapph.", color: "#4169E1" },
            { icon: "🪙", label: "Coins Sent",        value: "120M",  color: "#F59E0B" },
            { icon: "🎀", label: "Gifts Sent",        value: "1,842", color: "#A855F7" },
            { icon: "🏆", label: "Achievements",      value: "5/10",  color: "#10B981" },
            { icon: "🌍", label: "Gifting Rank",      value: "#3.4K", color: "#1F6BFF" },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Active Benefits */}
      <div>
        <SectionLabel label="✨ ACTIVE GIFTING BENEFITS" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {[
            { icon: "🏅", name: "Active Badge",        value: "Sapphire Legend Badge", color: "#4169E1" },
            { icon: "👑", name: "Active Crown",         value: "Sapphire Legend Crown", color: "#4169E1" },
            { icon: "🖼️", name: "Active Frame",         value: "Luxury Entrance Frame", color: "#EC4899" },
            { icon: "📛", name: "Active Nameplate",     value: "Elite Nameplate",       color: "#A855F7" },
            { icon: "✨", name: "Entrance Effect",      value: "Luxury Entrance FX",    color: "#F59E0B" },
            { icon: "💬", name: "Chat Bubble",          value: "VIP Gifter Bubble",     color: "#1F6BFF" },
          ].map((b, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{b.name}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{b.value}</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Preview","Equip"].map(a => (
                  <button key={a} style={{ padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 800, background: a === "Equip" ? b.color : "#F5F7FA", color: a === "Equip" ? "#fff" : "#6B7280", border: "none", cursor: "pointer" }}>{a}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Level Ranges */}
      <div>
        <SectionLabel label="📋 ALL GIFTING LEVEL RANGES" />
        {GIFTING_LEVELS.map((lv, i) => {
          const isCur = i === CUR_IDX;
          const isPast = i < CUR_IDX;
          return (
            <div key={lv.range} style={{
              background: lv.isMax ? "linear-gradient(135deg,#0D1B3E,#92400E)" : isCur ? `${lv.color}12` : "#fff",
              borderRadius: 12, padding: "11px 13px", marginBottom: 7,
              border: isCur ? `2px solid ${lv.color}` : `1px solid ${lv.color}18`,
              display: "flex", alignItems: "center", gap: 10,
              opacity: isPast || isCur || lv.isMax ? 1 : 0.7,
              boxShadow: isCur ? `0 4px 14px ${lv.color}28` : lv.isMax ? "0 6px 20px rgba(245,158,11,0.2)" : "none",
            }}>
              <Badge3D icon={lv.icon} color={isPast || isCur ? lv.color : "#D1D5DB"} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: lv.isMax ? "#F59E0B" : isCur ? lv.color : "#0D1B3E" }}>{lv.range} · {lv.title}</div>
                <div style={{ fontSize: 9, color: lv.isMax ? "rgba(255,255,255,0.45)" : "#9CA3AF" }}>{lv.tier} · {fmt(lv.coins)} coins</div>
              </div>
              {isCur && <span style={{ fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 8, background: lv.color, color: "#fff", flexShrink: 0 }}>NOW</span>}
              {lv.isMax && <span style={{ fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 8, background: "#F59E0B", color: "#fff", flexShrink: 0 }}>MAX</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════ ANALYTICS TAB ══════════════ */
function AnalyticsTab() {
  const GIFT_BREAKDOWN = [
    { label: "Live Stream Gifts", pct: 52, color: "#EC4899" },
    { label: "Party Room Gifts",  pct: 22, color: "#A855F7" },
    { label: "Event Gifts",       pct: 14, color: "#F59E0B" },
    { label: "PK Battle Gifts",   pct: 8,  color: "#1F6BFF" },
    { label: "Special Gifts",     pct: 4,  color: "#10B981" },
  ];
  const TOP_HOSTS = [
    { name: "Host Star A", coins: "32M", icon: "🎙️", color: "#F59E0B" },
    { name: "Host Star B", coins: "28M", icon: "🎙️", color: "#9CA3AF" },
    { name: "Host Star C", coins: "18M", icon: "🎙️", color: "#CD7F32" },
    { name: "Host Star D", coins: "12M", icon: "🎙️", color: "#06B6D4" },
  ];

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Performance Overview */}
      <div>
        <SectionLabel label="🎁 GIFTING PERFORMANCE OVERVIEW" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { icon: "🪙", label: "Total Coins Sent",   value: "120M",  color: "#F59E0B" },
            { icon: "🎁", label: "Total Gifts Sent",   value: "1,842", color: "#EC4899" },
            { icon: "🏆", label: "Event Gifts",        value: "256",   color: "#1F6BFF" },
            { icon: "🎉", label: "Party Gifts",        value: "408",   color: "#A855F7" },
            { icon: "📺", label: "Stream Gifts",       value: "958",   color: "#10B981" },
            { icon: "💎", label: "Premium Gifts",      value: "220",   color: "#06B6D4" },
            { icon: "📅", label: "Monthly Spending",   value: "18.4M", color: "#F97316" },
            { icon: "📆", label: "Weekly Spending",    value: "4.2M",  color: "#7C3AED" },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Gift Category Breakdown */}
      <div>
        <SectionLabel label="📊 GIFT CATEGORY BREAKDOWN" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {GIFT_BREAKDOWN.map((g, i, arr) => (
            <div key={i} style={{ padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{g.label}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: g.color }}>{g.pct}%</span>
              </div>
              <ProgressBar pct={g.pct} color={g.color} height={5} />
            </div>
          ))}
        </div>
      </div>

      {/* Top Supported Hosts */}
      <div>
        <SectionLabel label="🎙️ TOP SUPPORTED HOSTS" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TOP_HOSTS.map((h, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${h.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{h.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{h.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{h.coins} coins gifted</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#6B7280" }}>#{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gifting Consistency */}
      <div>
        <SectionLabel label="🔥 GIFTING ANALYTICS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { icon: "🔥", label: "Gifting Consistency", value: "82%",    color: "#F59E0B" },
            { icon: "⭐", label: "Contribution Score",  value: "9.1",    color: "#A855F7" },
            { icon: "🎀", label: "Fav Gift Category",   value: "Stream", color: "#EC4899" },
            { icon: "📅", label: "Monthly Contrib.",    value: "18.4M",  color: "#1F6BFF" },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ REWARDS TAB ══════════════ */
function RewardsTab() {
  const [cat, setCat] = useState("Gifter Badges");
  const CATS = ["Gifter Badges","Gifter Crowns","Gifter Frames","Nameplates","Gifter Bubbles","Gift Effects","Entrance Effects"];
  const ITEMS = {
    "Gifter Badges":    [{ name: "Bronze Gifter",   icon: "🎁", color: "#CD7F32", lv: 1,  unlocked: true },  { name: "Silver Gifter", icon: "🎁", color: "#9CA3AF", lv: 21, unlocked: true }, { name: "Gold Gifter",    icon: "🎁", color: "#F59E0B", lv: 41, unlocked: false }, { name: "Diamond Gifter", icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }],
    "Gifter Crowns":    [{ name: "Bronze Crown",    icon: "👑", color: "#CD7F32", lv: 1,  unlocked: true },  { name: "Silver Crown",  icon: "👑", color: "#9CA3AF", lv: 21, unlocked: true }, { name: "Gold Crown",     icon: "👑", color: "#F59E0B", lv: 41, unlocked: false }, { name: "Diamond Crown",  icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }],
    "Gifter Frames":    [{ name: "Starter Frame",   icon: "🖼️", color: "#CD7F32", lv: 1,  unlocked: true },  { name: "Silver Frame",  icon: "🖼️", color: "#9CA3AF", lv: 21, unlocked: true }, { name: "Gold Frame",     icon: "🖼️", color: "#F59E0B", lv: 41, unlocked: false }, { name: "Diamond Frame",  icon: "🖼️", color: "#06B6D4", lv: 101, unlocked: false }],
    "Nameplates":       [{ name: "Basic Gifter",    icon: "📛", color: "#9CA3AF", lv: 1,  unlocked: true },  { name: "VIP Plate",     icon: "📛", color: "#4169E1", lv: 41, unlocked: false }, { name: "Emperor Plate",  icon: "📛", color: "#E0115F", lv: 61, unlocked: false }, { name: "Universe Plate", icon: "📛", color: "#0EA5E9", lv: 161, unlocked: false }],
    "Gifter Bubbles":   [{ name: "Basic Bubble",    icon: "💬", color: "#9CA3AF", lv: 1,  unlocked: true },  { name: "VIP Bubble",    icon: "💬", color: "#4169E1", lv: 41, unlocked: false }, { name: "Royal Bubble",   icon: "💬", color: "#8B5CF6", lv: 61, unlocked: false }, { name: "Mythic Bubble",  icon: "💬", color: "#7C3AED", lv: 141, unlocked: false }],
    "Gift Effects":     [{ name: "Basic Gift FX",   icon: "✨", color: "#10B981", lv: 1,  unlocked: true },  { name: "Sapphire FX",   icon: "💙", color: "#4169E1", lv: 41, unlocked: false }, { name: "Emperor FX",     icon: "❤️", color: "#E0115F", lv: 61, unlocked: false }, { name: "Universe FX",    icon: "🌌", color: "#0EA5E9", lv: 161, unlocked: false }],
    "Entrance Effects": [{ name: "Spark Entry",     icon: "✨", color: "#CD7F32", lv: 11, unlocked: true },  { name: "Luxury Entry",  icon: "🌟", color: "#4169E1", lv: 41, unlocked: false }, { name: "Ruby Entry",     icon: "❤️", color: "#E0115F", lv: 61, unlocked: false }, { name: "Universe Entry", icon: "🌌", color: "#0EA5E9", lv: 161, unlocked: false }],
  };

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Next Rewards */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#EC489988)", borderRadius: 16, padding: 14, boxShadow: "0 6px 20px rgba(236,72,153,0.2)" }}>
        <SectionLabel label="🔓 NEXT REWARDS — LV51 (King)" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Badge3D icon={NEXT.icon} color={NEXT.color} size={44} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{NEXT.title} — {NEXT.range}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{fmt(NEXT.coins - CURRENT_COINS)} 🪙 coins needed</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {NEXT.benefits.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 9px" }}>
              <span style={{ fontSize: 10 }}>🔓</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reward Gallery */}
      <div>
        <SectionLabel label="🎁 GIFTING REWARD GALLERY" />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 16, fontSize: 10, fontWeight: 800, background: cat === c ? "#EC4899" : "#fff", color: cat === c ? "#fff" : "#6B7280", border: cat === c ? "none" : "1px solid #E5E7EB", cursor: "pointer", boxShadow: cat === c ? "0 4px 10px rgba(236,72,153,0.3)" : "none" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {(ITEMS[cat] || []).map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "14px 12px", border: `1px solid ${item.unlocked ? item.color + "33" : "#F0F0F8"}`, opacity: item.unlocked ? 1 : 0.6, textAlign: "center", boxShadow: item.unlocked ? `0 3px 12px ${item.color}18` : "0 1px 4px rgba(0,0,0,0.04)" }}>
              <Badge3D icon={item.icon} color={item.unlocked ? item.color : "#D1D5DB"} size={46} />
              <div style={{ fontSize: 11, fontWeight: 800, color: "#0D1B3E", marginTop: 8, marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 8 }}>Requires LV{item.lv}</div>
              {item.unlocked
                ? <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    {["Preview","Equip"].map(a => (<button key={a} style={{ padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 800, background: a === "Equip" ? item.color : "#F5F7FA", color: a === "Equip" ? "#fff" : "#6B7280", border: "none", cursor: "pointer" }}>{a}</button>))}
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

/* ══════════════ ACHIEVEMENTS TAB ══════════════ */
function AchievementsTab() {
  const ACHS = [
    { name: "First Gift Sent",        icon: "🎁", color: "#10B981", desc: "Send your first gift",           unlocked: true  },
    { name: "First Million Coins",     icon: "🪙", color: "#F59E0B", desc: "Send 1M coins in gifts",         unlocked: true  },
    { name: "10 Million Coins",        icon: "💰", color: "#F59E0B", desc: "Send 10M coins in gifts",        unlocked: true  },
    { name: "100 Gifts Sent",          icon: "🎀", color: "#EC4899", desc: "Send 100 gifts total",           unlocked: true  },
    { name: "Top Supporter",           icon: "🌟", color: "#A855F7", desc: "Become a top supporter",         unlocked: true  },
    { name: "Event Supporter",         icon: "🏆", color: "#1F6BFF", desc: "Gift during 10 events",          unlocked: false },
    { name: "Elite Gifter",            icon: "💎", color: "#06B6D4", desc: "Reach LV61+ Ruby tier",          unlocked: false },
    { name: "Legendary Gifter",        icon: "🐉", color: "#DC2626", desc: "Reach LV161 Legendary tier",     unlocked: false },
    { name: "500M Coins Sent",         icon: "🌈", color: "#7C3AED", desc: "Send 500M coins total",          unlocked: false },
    { name: "Universe Gifter",         icon: "🌌", color: "#0EA5E9", desc: "Reach LV200 Ultimate tier",      unlocked: false },
  ];
  const unlocked = ACHS.filter(a => a.unlocked).length;

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#EC4899)", borderRadius: 18, padding: 16, boxShadow: "0 6px 20px rgba(236,72,153,0.25)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Total", v: ACHS.length, icon: "🏆" },{ l: "Unlocked", v: unlocked, icon: "✅" },{ l: "Locked", v: ACHS.length - unlocked, icon: "🔒" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 10, textAlign: "center", border: "1px solid rgba(255,255,255,0.18)" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <SectionLabel label="🏆 GIFTING ACHIEVEMENT COLLECTION" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ACHS.map((a, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: `1px solid ${a.unlocked ? a.color + "33" : "#F0F0F8"}`, display: "flex", alignItems: "center", gap: 12, opacity: a.unlocked ? 1 : 0.6, boxShadow: a.unlocked ? `0 2px 10px ${a.color}15` : "none" }}>
            <Badge3D icon={a.icon} color={a.unlocked ? a.color : "#D1D5DB"} size={42} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{a.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{a.desc}</div>
            </div>
            {a.unlocked
              ? <button style={{ padding: "5px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: a.color, color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>Claim</button>
              : <span style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF", flexShrink: 0 }}>🔒</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════ COLLECTIONS TAB ══════════════ */
function CollectionsTab() {
  const COLS = [
    { name: "Bronze Supporter",   icon: "🥉", color: "#CD7F32", total: 4, unlocked: 4, bg: "#FFF8F0" },
    { name: "Silver Supporter",   icon: "🥈", color: "#9CA3AF", total: 5, unlocked: 3, bg: "#F8F9FA" },
    { name: "Gold Supporter",     icon: "🥇", color: "#F59E0B", total: 5, unlocked: 1, bg: "#FFFBEB" },
    { name: "Diamond Supporter",  icon: "💎", color: "#06B6D4", total: 5, unlocked: 0, bg: "#F0FDFF" },
    { name: "Royal Supporter",    icon: "👑", color: "#8B5CF6", total: 4, unlocked: 0, bg: "#F5F3FF" },
    { name: "Mythic Supporter",   icon: "🌟", color: "#7C3AED", total: 4, unlocked: 0, bg: "#F5F3FF" },
    { name: "Legendary Supporter",icon: "🐉", color: "#DC2626", total: 3, unlocked: 0, bg: "#FFF5F5" },
    { name: "Universe Supporter", icon: "🌌", color: "#0EA5E9", total: 3, unlocked: 0, bg: "#F0F9FF" },
  ];
  return (
    <div style={{ padding: 14 }}>
      <SectionLabel label="💎 TOP SUPPORTER COLLECTION PROGRESS" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COLS.map((col, i) => {
          const pct = Math.round((col.unlocked / col.total) * 100);
          return (
            <div key={i} style={{ background: col.unlocked > 0 ? col.bg : "#fff", borderRadius: 16, padding: 14, border: `1px solid ${col.color}22`, boxShadow: col.unlocked > 0 ? `0 2px 10px ${col.color}15` : "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <Badge3D icon={col.icon} color={col.unlocked > 0 ? col.color : "#D1D5DB"} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{col.name}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{col.unlocked}/{col.total} items unlocked</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: col.unlocked > 0 ? col.color : "#D1D5DB" }}>{pct}%</div>
              </div>
              <ProgressBar pct={pct} color={col.color} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════ PRIVILEGES TAB ══════════════ */
function PrivilegesTab() {
  const PRIVS = [
    { icon: "✅", name: "Gifter Verified Badge",     active: true,  tier: "Current (LV41+)"  },
    { icon: "📢", name: "Priority Gift Broadcast",   active: true,  tier: "Current (LV41+)"  },
    { icon: "✨", name: "Luxury Entrance FX",        active: true,  tier: "Current (LV41+)"  },
    { icon: "💬", name: "VIP Chat Bubble",           active: true,  tier: "Current (LV41+)"  },
    { icon: "❤️", name: "Ruby Gifter Aura",          active: false, tier: "LV61+ Ruby"       },
    { icon: "💎", name: "Diamond Gift Animations",   active: false, tier: "LV101+ Diamond"   },
    { icon: "🌟", name: "Mythic Gift Effects",       active: false, tier: "LV141+ Mythic"    },
    { icon: "🌌", name: "Universe Gifter Spotlight", active: false, tier: "LV181+ Universe"  },
    { icon: "🏆", name: "Hall of Fame Recognition",  active: false, tier: "LV200 Ultimate"   },
  ];
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      <SectionLabel label="👑 EXCLUSIVE GIFTER PRIVILEGES" />
      {PRIVS.map((p, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: `1px solid ${p.active ? "#EC489933" : "#F0F0F8"}`, display: "flex", alignItems: "center", gap: 12, opacity: p.active ? 1 : 0.6, boxShadow: p.active ? "0 2px 10px rgba(236,72,153,0.1)" : "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: p.active ? "#EC489912" : "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{p.name}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{p.tier}</div>
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: p.active ? "#ECFDF5" : "#F5F7FA", color: p.active ? "#10B981" : "#9CA3AF", flexShrink: 0 }}>
            {p.active ? "✅ Active" : "🔒 Locked"}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════ LEADERBOARD TAB ══════════════ */
function LeaderboardTab() {
  const MILESTONES = [
    { lv: "LV10",  coins: 5_000_000,      icon: "🎁", color: "#CD7F32", unlocked: true  },
    { lv: "LV20",  coins: 15_000_000,     icon: "🥉", color: "#CD7F32", unlocked: true  },
    { lv: "LV50",  coins: 150_000_000,    icon: "💙", color: "#4169E1", unlocked: false },
    { lv: "LV100", coins: 3_000_000_000,  icon: "💎", color: "#06B6D4", unlocked: false },
    { lv: "LV150", coins: 12_000_000_000, icon: "🌟", color: "#7C3AED", unlocked: false },
    { lv: "LV200", coins: 50_000_000_000, icon: "🏆", color: "#F59E0B", unlocked: false },
  ];

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Leaderboard Status */}
      <div>
        <SectionLabel label="🏅 GIFTING LEADERBOARD STATUS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Global Gifting Rank", value: "#3,420", icon: "🌍", color: "#1F6BFF" },
            { label: "Country Rank",        value: "#84",    icon: "🇶🇦", color: "#10B981" },
            { label: "Monthly Rank",        value: "#1,102", icon: "📅", color: "#F59E0B" },
            { label: "Weekly Rank",         value: "#412",   icon: "📆", color: "#A855F7" },
            { label: "Daily Rank",          value: "#96",    icon: "☀️", color: "#EC4899" },
            { label: "Event Rank",          value: "#58",    icon: "🏆", color: "#06B6D4" },
          ].map(r => (
            <div key={r.label} style={{ background: "#fff", borderRadius: 14, padding: "12px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${r.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: r.color }}>{r.value}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{r.label}</div>
              </div>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#0D1B3E,#EC4899)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 14px rgba(236,72,153,0.3)" }}>
          🏆 Open Gifting Leaderboard
        </button>
      </div>

      {/* Milestones */}
      <div>
        <SectionLabel label="🎯 GIFTING MILESTONES" />
        {MILESTONES.map((m, i) => (
          <div key={m.lv} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 8, border: `1px solid ${m.unlocked ? m.color + "33" : "#F0F0F8"}`, display: "flex", alignItems: "center", gap: 12, opacity: m.unlocked ? 1 : 0.65, boxShadow: m.unlocked ? `0 2px 10px ${m.color}18` : "none" }}>
            <Badge3D icon={m.icon} color={m.unlocked ? m.color : "#D1D5DB"} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{m.lv}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{fmt(m.coins)} coins required</div>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 10, fontSize: 10, fontWeight: 800, background: m.unlocked ? "#ECFDF5" : "#F5F7FA", color: m.unlocked ? "#10B981" : "#9CA3AF" }}>
              {m.unlocked ? "✅ Unlocked" : "🔒 Locked"}
            </div>
          </div>
        ))}
      </div>

      {/* Gifting History */}
      <div>
        <SectionLabel label="📜 RECENT GIFTING HISTORY" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[
            { event: "Gifted 5M coins to Host Star A", time: "2 hrs ago",    icon: "🎁", color: "#EC4899" },
            { event: "Reached Gifting LV45",           time: "1 day ago",    icon: "⬆️", color: "#10B981" },
            { event: "Unlocked Sapphire Legend Crown",  time: "1 day ago",    icon: "👑", color: "#4169E1" },
            { event: "Event Gift Achievement",          time: "3 days ago",   icon: "🏆", color: "#F59E0B" },
            { event: "Sent 1,000th Gift",               time: "1 week ago",   icon: "🎀", color: "#A855F7" },
            { event: "Reached 100M Coins Sent",         time: "2 weeks ago",  icon: "🪙", color: "#F59E0B" },
          ].map((h, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${h.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{h.icon}</div>
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

/* ══════════════ MAIN EXPORT ══════════════ */
export default function GiftingLevelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const PANELS = {
    overview:     <OverviewTab />,
    analytics:    <AnalyticsTab />,
    rewards:      <RewardsTab />,
    achievements: <AchievementsTab />,
    collections:  <CollectionsTab />,
    privileges:   <PrivilegesTab />,
    leaderboard:  <LeaderboardTab />,
  };

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #EC4899 100%)", padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid rgba(255,255,255,0.22)" }}>🎁</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>Gifting Level Dashboard</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>LV45 · Sapphire Legend · {fmt(CURRENT_COINS)} 🪙 sent</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV45</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Legend</div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", overflowX: "auto", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flexShrink: 0, padding: "9px 11px", border: "none", cursor: "pointer", background: "transparent", fontWeight: 800, fontSize: 10, color: activeTab === t.id ? "#FFC83D" : "rgba(255,255,255,0.6)", borderBottom: activeTab === t.id ? "2px solid #FFC83D" : "2px solid transparent", whiteSpace: "nowrap" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {PANELS[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}