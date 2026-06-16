/**
 * StreamingLevelDashboard — Full Streaming Level Dashboard
 * Tabs: Overview · Performance · Audience · Discovery · Rewards · Achievements · Collections · Events · Statistics · History
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

const STREAMING_LEVELS = [
  { range: "LV1–LV10",    title: "Rookie",            icon: "⚙️", color: "#9E9E9E", tier: "Iron",       coins: 3_000_000,      benefits: ["Basic Stream Badge","Basic Room Theme","Stream Access","Newcomer Tag"] },
  { range: "LV11–LV20",   title: "Amateur",           icon: "🥉", color: "#CD7F32", tier: "Bronze",     coins: 8_000_000,      benefits: ["Bronze Stream Badge","Bronze Frame","Starter Decoration","Priority Search"] },
  { range: "LV21–LV30",   title: "Regular",           icon: "🥈", color: "#C0C0C0", tier: "Silver",     coins: 20_000_000,     benefits: ["Silver Crown","Silver Room Theme","VIP Entrance","Discovery Boost"] },
  { range: "LV31–LV40",   title: "Veteran",           icon: "🥇", color: "#FFD700", tier: "Gold",       coins: 50_000_000,     benefits: ["Gold Veteran Badge","Gold Frame","Featured Placement","Premium Chat Bubble"] },
  { range: "LV41–LV50",   title: "Pro",               icon: "💙", color: "#4169E1", tier: "Sapphire",   coins: 100_000_000,    benefits: ["Sapphire Pro Crown","Trending Placement","Elite Nameplate","VIP Access"] },
  { range: "LV51–LV60",   title: "Expert",            icon: "💚", color: "#50C878", tier: "Emerald",    coins: 250_000_000,    benefits: ["Emerald Expert Crown","Royal Room Theme","Event Priority","Audience Boost"] },
  { range: "LV61–LV80",   title: "Master",            icon: "❤️", color: "#E0115F", tier: "Ruby",       coins: 600_000_000,    benefits: ["Ruby Master Crown","Master Room FX","Exclusive Stream Access","Elite Support"] },
  { range: "LV81–LV100",  title: "Elite",             icon: "💜", color: "#9B59B6", tier: "Amethyst",   coins: 1_200_000_000,  benefits: ["Amethyst Elite Crown","Elite Aura Effect","Premium Gift Animation","Elite Recognition"] },
  { range: "LV101–LV120", title: "Legend",            icon: "💎", color: "#B9F2FF", tier: "Diamond",    coins: 2_500_000_000,  benefits: ["Diamond Legend Crown","Crystal Stream FX","Global Visibility","Diamond Privileges"] },
  { range: "LV121–LV140", title: "Champion",          icon: "👑", color: "#F59E0B", tier: "Gold II",    coins: 5_000_000_000,  benefits: ["Champion Crown","Golden Room FX","Champion Nameplate","VIP+ Access"] },
  { range: "LV141–LV160", title: "Mythic Streamer",   icon: "🌟", color: "#7C3AED", tier: "Mythic",     coins: 10_000_000_000, benefits: ["Mythic Streamer Badge","Mythic Aura","Exclusive Mythic Themes","Elite Event Access"] },
  { range: "LV161–LV180", title: "Legendary Streamer",icon: "🐉", color: "#DC2626", tier: "Legendary",  coins: 18_000_000_000, benefits: ["Legendary Dragon Crown","Dragon Stream FX","Global Stream Highlight","Legendary Prestige"] },
  { range: "LV181–LV199", title: "Universe Streamer", icon: "🌌", color: "#0EA5E9", tier: "Universe",   coins: 30_000_000_000, benefits: ["Universe Crown","Cosmic Stream Animations","Universal Recognition","Universe Privileges"] },
  { range: "LV200",        title: "Eternal Universe Broadcaster", icon: "🏆", color: "#F59E0B", tier: "ULTIMATE", isMax: true, coins: 40_000_000_000, benefits: ["Ultimate Broadcaster Crown","Cosmic Nameplate Animation","Global Hall of Fame","Exclusive LV200 Stream FX","Lifetime Broadcaster Recognition","VIP+ Priority Support","Ultimate Prestige Status","Annual Elite Rewards","Founder-Class Broadcaster Badge","Universal Entrance Animation","Exclusive Broadcast Theme","Holographic Room Decoration"] },
];

const CUR_IDX = 4;
const CURRENT = STREAMING_LEVELS[CUR_IDX];
const NEXT = STREAMING_LEVELS[CUR_IDX + 1];
const CURRENT_COINS = 78_000_000;
const PROG_PCT = Math.min(99, Math.round((CURRENT_COINS / CURRENT.coins) * 100));

const TABS = [
  { id: "overview",     label: "Overview",     icon: "📊" },
  { id: "performance",  label: "Performance",  icon: "📺" },
  { id: "audience",     label: "Audience",     icon: "👥" },
  { id: "discovery",    label: "Discovery",    icon: "🔍" },
  { id: "rewards",      label: "Rewards",      icon: "🎁" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "collections",  label: "Collections",  icon: "💎" },
  { id: "events",       label: "Events",       icon: "🎪" },
  { id: "statistics",   label: "Statistics",   icon: "📈" },
  { id: "history",      label: "History",      icon: "📜" },
];

/* ─── Shared ─── */
function Badge3D({ icon, color, size = 48 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, background: `radial-gradient(circle at 33% 28%, ${color}FF, ${color}77)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.44, boxShadow: `0 4px 18px ${color}55, inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)`, border: `1.5px solid ${color}66`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: "18%", right: 0, height: "40%", background: "linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)", borderRadius: "0 0 50% 50%" }} />
      {icon}
    </div>
  );
}
function SL({ label }) { return <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>; }
function SC({ icon, label, value, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${color}18`, boxShadow: `0 2px 8px ${color}10` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, margin: "0 auto 6px", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}
function PBar({ pct, color, h = 7 }) {
  return (
    <div style={{ height: h, borderRadius: h / 2, background: "#F0F0F8", overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.2 }} style={{ height: "100%", borderRadius: h / 2, background: `linear-gradient(90deg,${color},${color}AA)` }} />
    </div>
  );
}

/* ══════════ OVERVIEW ══════════ */
function OverviewTab() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Profile Header */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#06B6D488)", borderRadius: 20, padding: 18, boxShadow: "0 8px 28px rgba(6,182,212,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#06B6D4,#0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>📡</div>
            <div style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#F59E0B", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 900 }}>PRO</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO Streamer</span>
              <span style={{ fontSize: 12 }}>✅</span>
              <span style={{ fontSize: 11 }}>🇶🇦</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>ID: #VS2024001 · Stream Rank: #2,840</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["View Profile","Share","Stream History"].map(a => (
                <button key={a} style={{ padding: "4px 9px", borderRadius: 9, fontSize: 9, fontWeight: 800, background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>{a}</button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV41</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Pro</div>
          </div>
        </div>
        {/* Level card */}
        <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 14, border: "1px solid rgba(255,255,255,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Badge3D icon={CURRENT.icon} color={CURRENT.color} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 1 }}>CURRENT STREAMING LEVEL</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#FFC83D" }}>LV 41</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{CURRENT.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{CURRENT.tier} Tier · {fmt(CURRENT_COINS)} coins</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FFC83D" }}>{PROG_PCT}%</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Progress</div>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>🪙 Stream Coins</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#FFC83D" }}>{fmt(CURRENT_COINS)} / {fmt(CURRENT.coins)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${PROG_PCT}%` }} transition={{ duration: 1, delay: 0.3 }}
                style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#06B6D4,#F59E0B)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
            <Badge3D icon={NEXT.icon} color={NEXT.color} size={28} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>NEXT: </span>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{NEXT.range} · {NEXT.title}</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: NEXT.color, flexShrink: 0 }}>{fmt(NEXT.coins - CURRENT_COINS)} 🪙</span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <SL label="⚡ STREAMING QUICK STATS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "📡", label: "Stream Level",    value: "41",    color: "#06B6D4" },
            { icon: "💙", label: "Tier",             value: "Pro",   color: "#4169E1" },
            { icon: "🪙", label: "Stream Coins",     value: "78M",   color: "#F59E0B" },
            { icon: "👥", label: "Total Viewers",    value: "42K",   color: "#A855F7" },
            { icon: "🏆", label: "Achievements",     value: "6/12",  color: "#10B981" },
            { icon: "🌍", label: "Stream Rank",      value: "#2.8K", color: "#1F6BFF" },
          ].map(s => <SC key={s.label} {...s} />)}
        </div>
      </div>

      {/* Active benefits */}
      <div>
        <SL label="✨ ACTIVE STREAMING BENEFITS" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {[
            { icon: "🏅", name: "Active Badge",       value: "Sapphire Pro Badge",     color: "#4169E1" },
            { icon: "👑", name: "Active Crown",        value: "Sapphire Pro Crown",     color: "#4169E1" },
            { icon: "🖼️", name: "Stream Frame",        value: "Sapphire Stream Frame",  color: "#06B6D4" },
            { icon: "🎨", name: "Room Theme",          value: "Trending Pro Theme",     color: "#A855F7" },
            { icon: "✨", name: "Entrance Effect",     value: "Sapphire Entrance FX",   color: "#F59E0B" },
            { icon: "📛", name: "Active Nameplate",    value: "Elite Stream Nameplate", color: "#1F6BFF" },
          ].map((b, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{b.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{b.name}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{b.value}</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Preview","Equip"].map(a => (<button key={a} style={{ padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 800, background: a === "Equip" ? b.color : "#F5F7FA", color: a === "Equip" ? "#fff" : "#6B7280", border: "none", cursor: "pointer" }}>{a}</button>))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All level ranges */}
      <div>
        <SL label="📋 ALL STREAMING LEVEL RANGES" />
        {STREAMING_LEVELS.map((lv, i) => {
          const isCur = i === CUR_IDX;
          const isPast = i < CUR_IDX;
          return (
            <div key={lv.range} style={{ background: lv.isMax ? "linear-gradient(135deg,#0D1B3E,#92400E)" : isCur ? `${lv.color}12` : "#fff", borderRadius: 12, padding: "11px 13px", marginBottom: 7, border: isCur ? `2px solid ${lv.color}` : `1px solid ${lv.color}18`, display: "flex", alignItems: "center", gap: 10, opacity: isPast || isCur || lv.isMax ? 1 : 0.7, boxShadow: isCur ? `0 4px 14px ${lv.color}28` : lv.isMax ? "0 6px 20px rgba(245,158,11,0.2)" : "none" }}>
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

/* ══════════ PERFORMANCE ══════════ */
function PerformanceTab() {
  const METRICS = [
    { label: "Total Streams",    value: "284",   icon: "📺", color: "#06B6D4" },
    { label: "Total Hours",      value: "1,420", icon: "⏱️", color: "#F59E0B" },
    { label: "Total Gifts",      value: "3,821", icon: "🎁", color: "#EC4899" },
    { label: "Total Viewers",    value: "42K",   icon: "👥", color: "#A855F7" },
    { label: "Total Likes",      value: "186K",  icon: "❤️", color: "#E0115F" },
    { label: "Total Shares",     value: "24K",   icon: "🔗", color: "#10B981" },
    { label: "Party Rooms",      value: "62",    icon: "🎉", color: "#1F6BFF" },
    { label: "Stream Coins",     value: "78M",   icon: "🪙", color: "#F59E0B" },
    { label: "Events Joined",    value: "18",    icon: "🏆", color: "#7C3AED" },
  ];
  const MONTHLY = [
    { month: "Jan", value: 65 }, { month: "Feb", value: 72 }, { month: "Mar", value: 80 },
    { month: "Apr", value: 68 }, { month: "May", value: 91 }, { month: "Jun", value: 78 },
  ];
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <SL label="📺 STREAM PERFORMANCE OVERVIEW" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {METRICS.map(s => <SC key={s.label} {...s} />)}
      </div>
      <div>
        <SL label="📊 MONTHLY STREAM ACTIVITY" />
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, marginBottom: 8 }}>
            {MONTHLY.map(m => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <motion.div initial={{ height: 0 }} animate={{ height: `${m.value}%` }} transition={{ duration: 0.7, delay: 0.1 }}
                  style={{ width: "100%", borderRadius: 6, background: `linear-gradient(180deg,#06B6D4,#0EA5E9)`, maxHeight: 64 }} />
                <span style={{ fontSize: 9, color: "#9CA3AF" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <SL label="🎯 STREAM PERFORMANCE BREAKDOWN" />
        {[
          { label: "Viewer Retention", pct: 74, color: "#06B6D4" },
          { label: "Gift Rate",        pct: 62, color: "#EC4899" },
          { label: "Engagement Score", pct: 81, color: "#A855F7" },
          { label: "Share Rate",       pct: 45, color: "#10B981" },
        ].map(g => (
          <div key={g.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#0D1B3E" }}>{g.label}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: g.color }}>{g.pct}%</span>
            </div>
            <PBar pct={g.pct} color={g.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ AUDIENCE ══════════ */
function AudienceTab() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <SL label="👥 AUDIENCE ANALYTICS" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { icon: "👥", label: "Total Followers",    value: "12.4K", color: "#06B6D4" },
          { icon: "✨", label: "New Followers",       value: "+842",  color: "#10B981" },
          { icon: "🔁", label: "Returning Viewers",  value: "68%",   color: "#A855F7" },
          { icon: "👤", label: "Average Viewers",    value: "148",   color: "#F59E0B" },
          { icon: "🔝", label: "Peak Viewers",       value: "2,480", color: "#E0115F" },
          { icon: "⏱️", label: "Avg Watch Time",     value: "18m",   color: "#1F6BFF" },
          { icon: "📈", label: "Growth Rate",        value: "+12%",  color: "#10B981" },
          { icon: "⭐", label: "Engagement Score",   value: "8.1",   color: "#F59E0B" },
        ].map(s => <SC key={s.label} {...s} />)}
      </div>
      <div>
        <SL label="🌍 TOP VIEWER COUNTRIES" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[
            { country: "Qatar",        flag: "🇶🇦", pct: 34, color: "#06B6D4" },
            { country: "Saudi Arabia", flag: "🇸🇦", pct: 24, color: "#F59E0B" },
            { country: "UAE",          flag: "🇦🇪", pct: 18, color: "#10B981" },
            { country: "Egypt",        flag: "🇪🇬", pct: 12, color: "#A855F7" },
            { country: "Others",       flag: "🌍", pct: 12, color: "#9CA3AF" },
          ].map((c, i, arr) => (
            <div key={i} style={{ padding: "10px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{c.flag} {c.country}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: c.color }}>{c.pct}%</span>
              </div>
              <PBar pct={c.pct} color={c.color} h={5} />
            </div>
          ))}
        </div>
      </div>
      <button style={{ width: "100%", padding: 12, borderRadius: 14, background: "linear-gradient(135deg,#0D1B3E,#06B6D4)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 14px rgba(6,182,212,0.3)" }}>
        📊 View Audience Insights
      </button>
    </div>
  );
}

/* ══════════ DISCOVERY ══════════ */
function DiscoveryTab() {
  const SCORES = [
    { label: "Discovery Score",   value: 82, icon: "🔍", color: "#06B6D4" },
    { label: "Trending Score",    value: 75, icon: "🔥", color: "#F59E0B" },
    { label: "Visibility Score",  value: 70, icon: "👁️", color: "#A855F7" },
    { label: "Search Ranking",    value: 61, icon: "🔎", color: "#1F6BFF" },
    { label: "Category Ranking",  value: 55, icon: "📁", color: "#10B981" },
    { label: "Popularity Score",  value: 78, icon: "⭐", color: "#EC4899" },
  ];
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#06B6D488)", borderRadius: 18, padding: 16, boxShadow: "0 6px 20px rgba(6,182,212,0.2)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Featured",    v: "Active",   icon: "⭐" }, { l: "Trending",    v: "Top 5%", icon: "🔥" }, { l: "Recommended", v: "Yes",     icon: "✅" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 10, textAlign: "center", border: "1px solid rgba(255,255,255,0.18)" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <SL label="📊 DISCOVERY SCORES" />
      {SCORES.map(s => (
        <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: 12, border: "1px solid #F0F0F8", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{s.label}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: s.color }}>{s.value}/100</div>
          </div>
          <PBar pct={s.value} color={s.color} />
        </div>
      ))}
    </div>
  );
}

/* ══════════ REWARDS ══════════ */
function RewardsTab() {
  const [cat, setCat] = useState("Streaming Badges");
  const CATS = ["Streaming Badges","Streaming Crowns","Stream Frames","Room Themes","Room Decorations","Nameplates","Entrance Effects","Featured Effects"];
  const ITEMS = {
    "Streaming Badges":   [{ name: "Bronze Streamer",   icon: "📡", color: "#CD7F32", lv: 1,  unlocked: true }, { name: "Silver Streamer", icon: "📡", color: "#9CA3AF", lv: 21, unlocked: true }, { name: "Gold Streamer",    icon: "📡", color: "#F59E0B", lv: 41, unlocked: false }, { name: "Diamond Streamer", icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }],
    "Streaming Crowns":   [{ name: "Bronze Crown",      icon: "👑", color: "#CD7F32", lv: 1,  unlocked: true }, { name: "Silver Crown",    icon: "👑", color: "#9CA3AF", lv: 21, unlocked: true }, { name: "Gold Crown",       icon: "👑", color: "#F59E0B", lv: 41, unlocked: false }, { name: "Diamond Crown",    icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }],
    "Stream Frames":      [{ name: "Starter Frame",     icon: "🖼️", color: "#CD7F32", lv: 1,  unlocked: true }, { name: "Silver Frame",    icon: "🖼️", color: "#9CA3AF", lv: 21, unlocked: true }, { name: "Pro Frame",        icon: "🖼️", color: "#4169E1", lv: 41, unlocked: false }, { name: "Diamond Frame",    icon: "🖼️", color: "#06B6D4", lv: 101, unlocked: false }],
    "Room Themes":        [{ name: "Default Theme",     icon: "🎨", color: "#9CA3AF", lv: 1,  unlocked: true }, { name: "Neon Theme",      icon: "🌟", color: "#A855F7", lv: 41, unlocked: false }, { name: "Galaxy Theme",     icon: "🌌", color: "#7C3AED", lv: 81, unlocked: false }, { name: "Mythic Theme",     icon: "🐉", color: "#DC2626", lv: 141, unlocked: false }],
    "Room Decorations":   [{ name: "Basic Deco",        icon: "🎀", color: "#9CA3AF", lv: 1,  unlocked: true }, { name: "VIP Deco",        icon: "✨", color: "#4169E1", lv: 41, unlocked: false }, { name: "Royal Deco",       icon: "👑", color: "#8B5CF6", lv: 61, unlocked: false }, { name: "Mythic Deco",      icon: "💎", color: "#7C3AED", lv: 141, unlocked: false }],
    "Nameplates":         [{ name: "Basic Plate",       icon: "📛", color: "#9CA3AF", lv: 1,  unlocked: true }, { name: "Pro Plate",       icon: "📛", color: "#4169E1", lv: 41, unlocked: false }, { name: "Elite Plate",      icon: "📛", color: "#E0115F", lv: 61, unlocked: false }, { name: "Universe Plate",   icon: "📛", color: "#0EA5E9", lv: 161, unlocked: false }],
    "Entrance Effects":   [{ name: "Spark Entry",       icon: "✨", color: "#CD7F32", lv: 11, unlocked: true }, { name: "Neon Entry",      icon: "💙", color: "#4169E1", lv: 41, unlocked: false }, { name: "Ruby Entry",       icon: "❤️", color: "#E0115F", lv: 61, unlocked: false }, { name: "Universe Entry",   icon: "🌌", color: "#0EA5E9", lv: 161, unlocked: false }],
    "Featured Effects":   [{ name: "Highlight FX",     icon: "⭐", color: "#F59E0B", lv: 41, unlocked: false }, { name: "Trending FX",    icon: "🔥", color: "#E0115F", lv: 61, unlocked: false }, { name: "Diamond FX",      icon: "💎", color: "#06B6D4", lv: 101, unlocked: false }, { name: "Cosmic FX",       icon: "🌌", color: "#0EA5E9", lv: 161, unlocked: false }],
  };
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Next Rewards */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#06B6D488)", borderRadius: 16, padding: 14, boxShadow: "0 6px 20px rgba(6,182,212,0.2)" }}>
        <SL label="🔓 NEXT REWARDS — LV51 (Expert)" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Badge3D icon={NEXT.icon} color={NEXT.color} size={44} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{NEXT.title} — {NEXT.range}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{fmt(NEXT.coins - CURRENT_COINS)} 🪙 needed</div>
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
      {/* Gallery */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 16, fontSize: 10, fontWeight: 800, background: cat === c ? "#06B6D4" : "#fff", color: cat === c ? "#fff" : "#6B7280", border: cat === c ? "none" : "1px solid #E5E7EB", cursor: "pointer", boxShadow: cat === c ? "0 4px 10px rgba(6,182,212,0.3)" : "none" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {(ITEMS[cat] || []).map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "14px 12px", border: `1px solid ${item.unlocked ? item.color + "33" : "#F0F0F8"}`, opacity: item.unlocked ? 1 : 0.6, textAlign: "center", boxShadow: item.unlocked ? `0 3px 12px ${item.color}18` : "0 1px 4px rgba(0,0,0,0.04)" }}>
            <Badge3D icon={item.icon} color={item.unlocked ? item.color : "#D1D5DB"} size={46} />
            <div style={{ fontSize: 11, fontWeight: 800, color: "#0D1B3E", marginTop: 8, marginBottom: 2 }}>{item.name}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginBottom: 8 }}>Requires LV{item.lv}</div>
            {item.unlocked
              ? <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>{["Preview","Equip"].map(a => (<button key={a} style={{ padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 800, background: a === "Equip" ? item.color : "#F5F7FA", color: a === "Equip" ? "#fff" : "#6B7280", border: "none", cursor: "pointer" }}>{a}</button>))}</div>
              : <div style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF" }}>🔒 LV{item.lv} Required</div>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ ACHIEVEMENTS ══════════ */
function AchievementsTab() {
  const ACHS = [
    { name: "First Live Stream",       icon: "📡", color: "#10B981", unlocked: true  },
    { name: "First 100 Viewers",       icon: "👥", color: "#06B6D4", unlocked: true  },
    { name: "First 1000 Viewers",      icon: "🎯", color: "#F59E0B", unlocked: true  },
    { name: "First Trending Stream",   icon: "🔥", color: "#E0115F", unlocked: true  },
    { name: "50 Live Streams",         icon: "🏅", color: "#A855F7", unlocked: true  },
    { name: "Top Streamer",            icon: "⭐", color: "#F59E0B", unlocked: true  },
    { name: "Elite Broadcaster",       icon: "💎", color: "#06B6D4", unlocked: false },
    { name: "Legendary Streamer",      icon: "🐉", color: "#DC2626", unlocked: false },
    { name: "10K Follower Milestone",  icon: "👑", color: "#7C3AED", unlocked: false },
    { name: "Global Streaming Achievement", icon: "🌌", color: "#0EA5E9", unlocked: false },
    { name: "1B Coins Stream",         icon: "🪙", color: "#F59E0B", unlocked: false },
    { name: "Universe Broadcaster",    icon: "🏆", color: "#F59E0B", unlocked: false },
  ];
  const unlocked = ACHS.filter(a => a.unlocked).length;
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#06B6D4)", borderRadius: 18, padding: 16, boxShadow: "0 6px 20px rgba(6,182,212,0.25)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Total", v: ACHS.length, icon: "🏆" }, { l: "Unlocked", v: unlocked, icon: "✅" }, { l: "Locked", v: ACHS.length - unlocked, icon: "🔒" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <SL label="🏆 STREAMING ACHIEVEMENT COLLECTION" />
      {ACHS.map((a, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: `1px solid ${a.unlocked ? a.color + "33" : "#F0F0F8"}`, display: "flex", alignItems: "center", gap: 12, opacity: a.unlocked ? 1 : 0.6, marginBottom: 8, boxShadow: a.unlocked ? `0 2px 10px ${a.color}15` : "none" }}>
          <Badge3D icon={a.icon} color={a.unlocked ? a.color : "#D1D5DB"} size={42} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{a.name}</div>
          </div>
          {a.unlocked
            ? <button style={{ padding: "5px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: a.color, color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>Claim</button>
            : <span style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF", flexShrink: 0 }}>🔒</span>
          }
        </div>
      ))}
    </div>
  );
}

/* ══════════ COLLECTIONS ══════════ */
function CollectionsTab() {
  const COLS = [
    { name: "Bronze Stream Collection",   icon: "🥉", color: "#CD7F32", total: 5, unlocked: 5 },
    { name: "Silver Stream Collection",   icon: "🥈", color: "#9CA3AF", total: 5, unlocked: 3 },
    { name: "Gold Stream Collection",     icon: "🥇", color: "#F59E0B", total: 5, unlocked: 1 },
    { name: "Diamond Stream Collection",  icon: "💎", color: "#06B6D4", total: 5, unlocked: 0 },
    { name: "Royal Stream Collection",    icon: "👑", color: "#8B5CF6", total: 4, unlocked: 0 },
    { name: "Mythic Stream Collection",   icon: "🌟", color: "#7C3AED", total: 4, unlocked: 0 },
    { name: "Legendary Stream Collection",icon: "🐉", color: "#DC2626", total: 3, unlocked: 0 },
    { name: "Universe Stream Collection", icon: "🌌", color: "#0EA5E9", total: 3, unlocked: 0 },
  ];
  return (
    <div style={{ padding: 14 }}>
      <SL label="💎 STREAMING COLLECTION PROGRESS" />
      {COLS.map((col, i) => {
        const pct = Math.round((col.unlocked / col.total) * 100);
        return (
          <div key={i} style={{ background: col.unlocked > 0 ? "#fff" : "#fff", borderRadius: 16, padding: 14, marginBottom: 10, border: `1px solid ${col.color}22`, boxShadow: col.unlocked > 0 ? `0 2px 10px ${col.color}15` : "0 1px 4px rgba(0,0,0,0.04)", opacity: col.unlocked > 0 ? 1 : 0.65 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <Badge3D icon={col.icon} color={col.unlocked > 0 ? col.color : "#D1D5DB"} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{col.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{col.unlocked}/{col.total} items unlocked</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: col.unlocked > 0 ? col.color : "#D1D5DB" }}>{pct}%</div>
            </div>
            <PBar pct={pct} color={col.color} />
          </div>
        );
      })}
    </div>
  );
}

/* ══════════ EVENTS ══════════ */
function EventsTab() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B88)", borderRadius: 18, padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Joined", v: "18", icon: "🎪" }, { l: "Won", v: "4", icon: "🏆" }, { l: "Rank Points", v: "842", icon: "⭐" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {[
        { label: "🔴 ACTIVE EVENTS", items: [{ name: "Summer Stream Battle",       prize: "1M Coins",  icon: "🔴", rank: "#12" }, { name: "Top Streamer July",         prize: "Diamond Crown", icon: "🔴", rank: "#28" }] },
        { label: "🟡 UPCOMING EVENTS", items: [{ name: "Ramadan Stream Fest 2026", prize: "500K Coins", icon: "🟡", rank: "—" }, { name: "Global Creator Challenge",  prize: "3D Crown", icon: "🟡", rank: "—" }] },
        { label: "🟢 COMPLETED EVENTS", items: [{ name: "Spring Streaming Cup",    prize: "250K Coins",  icon: "🟢", rank: "#4" }, { name: "Category Champion",         prize: "Silver Crown",  icon: "🟢", rank: "#2" }] },
      ].map(section => (
        <div key={section.label}>
          <SL label={section.label} />
          {section.items.map((ev, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{ev.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{ev.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Prize: {ev.prize}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#06B6D4" }}>{ev.rank}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>Rank</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ══════════ STATISTICS ══════════ */
function StatisticsTab() {
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <SL label="📈 FULL STREAM STATISTICS" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { icon: "📺", label: "Total Streams",       value: "284",    color: "#06B6D4" },
          { icon: "⏱️", label: "Streaming Hours",     value: "1,420",  color: "#F59E0B" },
          { icon: "👥", label: "Audience Reached",    value: "184K",   color: "#A855F7" },
          { icon: "🎁", label: "Gifts Received",      value: "3,821",  color: "#EC4899" },
          { icon: "❤️", label: "Total Likes",         value: "186K",   color: "#E0115F" },
          { icon: "🔗", label: "Total Shares",        value: "24K",    color: "#10B981" },
          { icon: "👥", label: "Followers Gained",    value: "+12.4K", color: "#1F6BFF" },
          { icon: "🪙", label: "Revenue (Coins)",     value: "78M",    color: "#F59E0B" },
          { icon: "🏆", label: "Events Joined",       value: "18",     color: "#7C3AED" },
          { icon: "🥇", label: "Events Won",          value: "4",      color: "#F59E0B" },
        ].map(s => <SC key={s.label} {...s} />)}
      </div>
      {/* Leaderboard Ranks */}
      <SL label="🏅 STREAMING LEADERBOARD RANKS" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { label: "Global Streaming Rank", value: "#2,840", icon: "🌍", color: "#1F6BFF" },
          { label: "Country Rank",          value: "#68",    icon: "🇶🇦", color: "#10B981" },
          { label: "Category Rank",         value: "#142",   icon: "📁", color: "#A855F7" },
          { label: "Monthly Rank",          value: "#820",   icon: "📅", color: "#F59E0B" },
          { label: "Weekly Rank",           value: "#320",   icon: "📆", color: "#06B6D4" },
          { label: "Daily Rank",            value: "#88",    icon: "☀️", color: "#EC4899" },
          { label: "Trending Rank",         value: "#54",    icon: "🔥", color: "#E0115F" },
        ].map((r, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 13, padding: "11px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 2px 5px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${r.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.label}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: r.color }}>{r.value}</div>
          </div>
        ))}
      </div>
      <button style={{ width: "100%", padding: 12, borderRadius: 14, background: "linear-gradient(135deg,#0D1B3E,#06B6D4)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 14px rgba(6,182,212,0.3)" }}>
        🏆 Open Stream Leaderboard
      </button>
    </div>
  );
}

/* ══════════ HISTORY ══════════ */
function HistoryTab() {
  const MILESTONES = [
    { lv: "LV10",  coins: 3_000_000,      icon: "⚙️", color: "#CD7F32", unlocked: true  },
    { lv: "LV20",  coins: 8_000_000,      icon: "🥉", color: "#CD7F32", unlocked: true  },
    { lv: "LV50",  coins: 100_000_000,    icon: "💙", color: "#4169E1", unlocked: false },
    { lv: "LV100", coins: 2_500_000_000,  icon: "💎", color: "#06B6D4", unlocked: false },
    { lv: "LV150", coins: 10_000_000_000, icon: "🌟", color: "#7C3AED", unlocked: false },
    { lv: "LV200", coins: 40_000_000_000, icon: "🏆", color: "#F59E0B", unlocked: false },
  ];
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <SL label="🎯 STREAMING MILESTONES" />
      {MILESTONES.map((m, i) => (
        <div key={m.lv} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 7, border: `1px solid ${m.unlocked ? m.color + "33" : "#F0F0F8"}`, display: "flex", alignItems: "center", gap: 12, opacity: m.unlocked ? 1 : 0.65, boxShadow: m.unlocked ? `0 2px 10px ${m.color}18` : "none" }}>
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
      <SL label="📜 RECENT STREAMING HISTORY" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {[
          { event: "Live Stream: 280 viewers peak",   time: "3 hrs ago",    icon: "📺", color: "#06B6D4" },
          { event: "Reached Streaming LV41",          time: "1 day ago",    icon: "⬆️", color: "#10B981" },
          { event: "Unlocked Sapphire Pro Crown",     time: "1 day ago",    icon: "👑", color: "#4169E1" },
          { event: "Trending Stream Achievement",     time: "3 days ago",   icon: "🔥", color: "#E0115F" },
          { event: "50th Live Stream Milestone",      time: "1 week ago",   icon: "📡", color: "#A855F7" },
          { event: "Summer Stream Battle — #12",      time: "2 weeks ago",  icon: "🏆", color: "#F59E0B" },
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
  );
}

/* ══════════ MAIN EXPORT ══════════ */
export default function StreamingLevelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const PANELS = {
    overview:     <OverviewTab />,
    performance:  <PerformanceTab />,
    audience:     <AudienceTab />,
    discovery:    <DiscoveryTab />,
    rewards:      <RewardsTab />,
    achievements: <AchievementsTab />,
    collections:  <CollectionsTab />,
    events:       <EventsTab />,
    statistics:   <StatisticsTab />,
    history:      <HistoryTab />,
  };

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #06B6D4 100%)", padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid rgba(255,255,255,0.22)" }}>📡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>Streaming Level Dashboard</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>LV41 · Sapphire Pro · {fmt(CURRENT_COINS)} 🪙 coins</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV41</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Pro</div>
          </div>
        </div>
        {/* Scrollable Tabs */}
        <div style={{ display: "flex", overflowX: "auto", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flexShrink: 0, padding: "9px 10px", border: "none", cursor: "pointer", background: "transparent", fontWeight: 800, fontSize: 10, color: activeTab === t.id ? "#FFC83D" : "rgba(255,255,255,0.6)", borderBottom: activeTab === t.id ? "2px solid #FFC83D" : "2px solid transparent", whiteSpace: "nowrap" }}>
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