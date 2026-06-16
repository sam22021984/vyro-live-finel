/**
 * HostLevelDashboard — Full Host Level Dashboard
 * Tabs: Overview · Performance · Audience · Rewards · Achievements · Collections · Statistics · Events
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ─── Host Level Data (21 ranges, coins-based per spec) ─── */
const HOST_LEVELS = [
  { range: "LV1–LV10",    title: "Newcomer",          badge: "Bronze Mic",           icon: "⚙️", color: "#9E9E9E", tier: "Iron",      coins: 2_000_000,      benefits: ["Basic Host Badge","Public Room Access","Standard Chat","Basic Analytics"] },
  { range: "LV11–LV20",   title: "Beginner Host",     badge: "Bronze Stage",         icon: "🥉", color: "#CD7F32", tier: "Bronze I",  coins: 5_000_000,      benefits: ["Bronze Host Badge","Audience Insights","Room Customization","Priority Support"] },
  { range: "LV21–LV30",   title: "Rising Host",       badge: "Silver Mic",           icon: "🥈", color: "#C0C0C0", tier: "Bronze II", coins: 10_000_000,     benefits: ["Silver Badge","Featured Discovery","Premium Room Effects","Advanced Analytics"] },
  { range: "LV31–LV40",   title: "Performer",         badge: "Gold Mic",             icon: "🥇", color: "#FFD700", tier: "Silver",    coins: 20_000_000,     benefits: ["Gold Host Badge","Homepage Discovery","VIP Room Features","Monthly Bonus"] },
  { range: "LV41–LV50",   title: "Popular Host",      badge: "Sapphire Stage",       icon: "💙", color: "#4169E1", tier: "Gold",      coins: 35_000_000,     benefits: ["Star Crown","Featured Placement","Premium Effects","Enhanced Revenue"] },
  { range: "LV51–LV60",   title: "Star Host",         badge: "Emerald Stage Crown",  icon: "💚", color: "#50C878", tier: "Sapphire",  coins: 60_000_000,     benefits: ["Super Star Badge","Priority Discovery","Royal Room Theme","VIP Support"] },
  { range: "LV61–LV70",   title: "Super Star",        badge: "Ruby Elite Crown",     icon: "❤️", color: "#E0115F", tier: "Emerald",   coins: 100_000_000,    benefits: ["Elite Crown","Global Visibility","Luxury Room FX","Premium Revenue Boost"] },
  { range: "LV71–LV80",   title: "Elite Host",        badge: "Amethyst Crown",       icon: "💜", color: "#9B59B6", tier: "Ruby",      coins: 180_000_000,    benefits: ["Master Badge","Platform Highlight","Mythic Room Effects","Elite Support"] },
  { range: "LV81–LV90",   title: "Master Host",       badge: "Diamond Crown",        icon: "💎", color: "#B9F2FF", tier: "Amethyst",  coins: 300_000_000,    benefits: ["Legend Crown","Global Featured","Dragon Room FX","Legendary Revenue"] },
  { range: "LV91–LV100",  title: "Legend Host",       badge: "Universe Crown",       icon: "👑", color: "#F59E0B", tier: "Diamond",   coins: 500_000_000,    benefits: ["GOAT Crown","Universe Featured","Ultimate Room FX","Lifetime Recognition"] },
  { range: "LV101–LV120", title: "Champion Host",     badge: "Champion Crown",       icon: "🏆", color: "#F59E0B", tier: "Legend I",  coins: 1_000_000_000,  benefits: ["Champion Crown","Discovery Boost","Event Access","VIP+ Support"] },
  { range: "LV121–LV140", title: "Mythic Host",       badge: "Mythic Stage Crown",   icon: "🌟", color: "#7C3AED", tier: "Legend II", coins: 2_000_000_000,  benefits: ["Mythic Badge","Mythic Aura","Global Highlight","Elite Event Access"] },
  { range: "LV141–LV160", title: "Legendary Host",    badge: "Dragon Crown",         icon: "🐉", color: "#DC2626", tier: "Mythic",    coins: 4_000_000_000,  benefits: ["Legendary Dragon Crown","Dragon Stream FX","Global Prestige","Legendary Rewards"] },
  { range: "LV161–LV180", title: "Universe Host",     badge: "Universe Crown",       icon: "🌌", color: "#0EA5E9", tier: "Legendary", coins: 7_000_000_000,  benefits: ["Universe Crown","Cosmic FX","Universal Recognition","Universe Privileges"] },
  { range: "LV181–LV200", title: "Cosmic Host",       badge: "Cosmic Crown",         icon: "🌠", color: "#A855F7", tier: "Universe I", coins: 12_000_000_000, benefits: ["Cosmic Crown","Holographic Room FX","Galaxy Prestige","Elite Annual Rewards"] },
  { range: "LV201–LV220", title: "Galactic Host",     badge: "Galaxy Crown",         icon: "🔮", color: "#8B5CF6", tier: "Universe II", coins: 20_000_000_000, benefits: ["Galaxy Crown","Premium Broadcast Theme","Galactic Badge","Priority Support"] },
  { range: "LV221–LV240", title: "Stellar Host",      badge: "Stellar Crown",        icon: "⭐", color: "#F59E0B", tier: "Supreme I", coins: 30_000_000_000, benefits: ["Stellar Crown","Cosmic Aura","Stellar Badge","Elite Visibility"] },
  { range: "LV241–LV260", title: "Nova Host",         badge: "Nova Crown",           icon: "💥", color: "#EC4899", tier: "Supreme II", coins: 45_000_000_000, benefits: ["Nova Crown","Nova Entrance FX","Elite Recognition","Supreme Support"] },
  { range: "LV261–LV280", title: "Supernova Host",    badge: "Supernova Crown",      icon: "🌪️", color: "#06B6D4", tier: "Apex I",    coins: 65_000_000_000, benefits: ["Supernova Crown","Supernova Aura","Apex Visibility","Global Leaderboard"] },
  { range: "LV281–LV299", title: "Apex Host",         badge: "Apex Crown",           icon: "⚡", color: "#1F6BFF", tier: "Apex II",   coins: 90_000_000_000, benefits: ["Apex Crown","Apex Broadcast Theme","Apex Rewards","Lifetime Recognition"] },
  { range: "LV300",        title: "Universe Emperor Host", badge: "Ultimate Emperor Crown", icon: "🏆", color: "#F59E0B", tier: "ULTIMATE", isMax: true, coins: 120_000_000_000, benefits: ["Ultimate Host Crown","Cosmic Nameplate","Global Hall of Fame","Exclusive LV300 FX","VIP+ Priority Support","Annual Elite Rewards","Founder-Class Host Badge","Universal Entrance Animation","Lifetime Host Prestige","Exclusive Broadcast Theme"] },
];

// Simulated current host at LV65 (index 6)
const CURRENT_IDX = 6; // LV61-LV70
const CURRENT = HOST_LEVELS[CURRENT_IDX];
const NEXT = HOST_LEVELS[CURRENT_IDX + 1];
const CURRENT_COINS = 72_000_000;
const PROGRESS_PCT = Math.min(99, Math.round((CURRENT_COINS / CURRENT.coins) * 100));

const TABS = [
  { id: "overview",     label: "Overview",     icon: "📊" },
  { id: "performance",  label: "Performance",  icon: "📡" },
  { id: "audience",     label: "Audience",     icon: "👥" },
  { id: "rewards",      label: "Rewards",      icon: "🎁" },
  { id: "achievements", label: "Achievements", icon: "🏆" },
  { id: "collections",  label: "Collections",  icon: "💎" },
  { id: "statistics",   label: "Statistics",   icon: "📈" },
  { id: "events",       label: "Events",       icon: "🎉" },
];

/* ─── Shared: Badge3D ─── */
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

      {/* Host Profile Header */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E, #F59E0B88)", borderRadius: 20, padding: 18, boxShadow: "0 8px 28px rgba(245,158,11,0.22)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#F59E0B,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>🎙️</div>
            <div style={{ position: "absolute", bottom: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#10B981", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 900 }}>LIVE</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO Host</span>
              <span style={{ fontSize: 13 }}>✅</span>
              <span style={{ fontSize: 11 }}>🇶🇦</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>ID: #VH2024001 · Stream Rank: #2,341</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {["Edit Profile","Share","View Profile"].map(a => (
                <button key={a} style={{ padding: "4px 9px", borderRadius: 9, fontSize: 9, fontWeight: 800, background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>{a}</button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV65</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Super Star</div>
          </div>
        </div>

        {/* Current Level Card */}
        <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 14, border: "1px solid rgba(255,255,255,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Badge3D icon={CURRENT.icon} color={CURRENT.color} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 1 }}>CURRENT HOST LEVEL</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#FFC83D" }}>LV 65</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{CURRENT.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{CURRENT.tier} · {CURRENT.badge}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FFC83D" }}>{PROGRESS_PCT}%</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Progress</div>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>🪙 Coins Progress</span>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#FFC83D" }}>{fmt(CURRENT_COINS)} / {fmt(CURRENT.coins)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${PROGRESS_PCT}%` }} transition={{ duration: 1, delay: 0.3 }}
                style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#FFC83D,#F59E0B)" }} />
            </div>
          </div>
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
        <SectionLabel label="⚡ HOST QUICK STATS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "📊", label: "Host Level",   value: "65",    color: "#F59E0B" },
            { icon: "🎙️", label: "Tier",          value: "Emer.", color: "#50C878" },
            { icon: "🪙", label: "Coins",         value: "72M",   color: "#F59E0B" },
            { icon: "👥", label: "Followers",     value: "12.4K", color: "#1F6BFF" },
            { icon: "🏆", label: "Achievements",  value: "6/12",  color: "#10B981" },
            { icon: "📅", label: "Streams",       value: "148",   color: "#A855F7" },
          ].map(s => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Current Benefits */}
      <div>
        <SectionLabel label="✨ ACTIVE HOST BENEFITS" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {[
            { icon: "🏅", name: "Active Badge",         value: "Silver Microphone",    color: "#9CA3AF" },
            { icon: "🖼️", name: "Host Frame",            value: "Premium Silver Frame", color: "#1F6BFF" },
            { icon: "✨", name: "Entrance Effect",       value: "Crystal Reflection",   color: "#A855F7" },
            { icon: "📡", name: "Discovery Priority",    value: "Featured Discovery",   color: "#10B981" },
            { icon: "📊", name: "Analytics",             value: "Advanced Analytics",   color: "#F59E0B" },
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

      {/* Host Leaderboard */}
      <div>
        <SectionLabel label="🏅 HOST LEADERBOARD STATUS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "Global Host Rank",   value: "#2,341", icon: "🌍", color: "#1F6BFF" },
            { label: "Country Host Rank",  value: "#47",    icon: "🇶🇦", color: "#10B981" },
            { label: "Agency Rank",        value: "#5",     icon: "🏢", color: "#F59E0B" },
            { label: "Monthly Rank",       value: "#893",   icon: "📅", color: "#A855F7" },
            { label: "Weekly Rank",        value: "#214",   icon: "📆", color: "#06B6D4" },
            { label: "Daily Rank",         value: "#88",    icon: "☀️", color: "#EC4899" },
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
        <button style={{ width: "100%", marginTop: 8, padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#0D1B3E,#F59E0B)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}>
          🏆 Open Host Leaderboard
        </button>
      </div>

      {/* Agency Status */}
      <div>
        <SectionLabel label="🏢 AGENCY STATUS" />
        <div style={{ background: "linear-gradient(135deg,#0D1B3E,#7C3AED)", borderRadius: 16, padding: "16px", boxShadow: "0 6px 20px rgba(124,58,237,0.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "1px solid rgba(255,255,255,0.2)" }}>🏢</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>VYRO Stars Agency</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Gold Tier Agency · Active</div>
            </div>
            <button style={{ padding: "6px 12px", borderRadius: 10, fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>View</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ l: "Agency Level", v: "Gold" },{ l: "My Rank", v: "#5" },{ l: "Status", v: "Active" }].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ PERFORMANCE TAB ══════════════ */
function PerformanceTab() {
  const EARNINGS = [
    { icon: "🪙", label: "Total Coins",    value: "72.0M",  sub: "All time",   color: "#F59E0B" },
    { icon: "📅", label: "Monthly Coins", value: "12.4M",  sub: "This month", color: "#1F6BFF" },
    { icon: "📆", label: "Weekly Coins",  value: "2.8M",   sub: "This week",  color: "#A855F7" },
    { icon: "☀️", label: "Daily Coins",   value: "420K",   sub: "Today",      color: "#10B981" },
  ];
  const STREAM = [
    { icon: "⏱️", label: "Total Live Hours",   value: "1,248h", color: "#10B981" },
    { icon: "📅", label: "Monthly Hours",       value: "186h",   color: "#1F6BFF" },
    { icon: "📆", label: "Weekly Hours",        value: "42h",    color: "#A855F7" },
    { icon: "📊", label: "Consistency",         value: "94%",    color: "#F59E0B" },
    { icon: "✅", label: "Completion Rate",     value: "97%",    color: "#10B981" },
    { icon: "🔥", label: "Peak Hour",           value: "9–11PM", color: "#EC4899" },
  ];
  const MONTHLY_TARGETS = [
    { label: "Streaming Hours", current: 186, target: 200, unit: "hrs",  color: "#1F6BFF" },
    { label: "Coins Earned",    current: 12400000, target: 20000000, unit: "🪙", color: "#F59E0B" },
    { label: "New Viewers",     current: 840, target: 1000, unit: "viewers", color: "#10B981" },
    { label: "New Followers",   current: 320, target: 500, unit: "followers", color: "#A855F7" },
  ];

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <SectionLabel label="🪙 HOST EARNINGS OVERVIEW (COINS)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {EARNINGS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      <div>
        <SectionLabel label="📡 LIVE STREAM PERFORMANCE" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {STREAM.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      <div>
        <SectionLabel label="🎯 MONTHLY TARGET CENTER" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MONTHLY_TARGETS.map((t, i) => {
            const pct = Math.min(100, Math.round((t.current / t.target) * 100));
            return (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{t.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 900, color: t.color }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={t.color} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: "#9CA3AF" }}>{fmt(t.current)} {t.unit}</span>
                  <span style={{ fontSize: 9, color: "#9CA3AF" }}>Target: {fmt(t.target)} {t.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel label="🏠 ROOM PERFORMANCE" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { icon: "👁️", label: "Total Room Visits",  value: "284K", color: "#1F6BFF" },
            { icon: "🔥", label: "Peak Concurrent",    value: "1,248",color: "#EC4899" },
            { icon: "📊", label: "Avg Online Users",   value: "342",  color: "#10B981" },
            { icon: "🎉", label: "Party Rooms Hosted", value: "67",   color: "#A855F7" },
            { icon: "⭐", label: "Popularity Score",   value: "9.2",  color: "#F59E0B" },
            { icon: "🏅", label: "Room Ranking",       value: "#128", color: "#06B6D4" },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ AUDIENCE TAB ══════════════ */
function AudienceTab() {
  const DATA = [
    { icon: "👥", label: "Total Followers",        value: "12.4K", color: "#1F6BFF" },
    { icon: "📈", label: "New Followers (Month)",  value: "+320",  color: "#10B981" },
    { icon: "💚", label: "Active Followers",       value: "8.1K",  color: "#A855F7" },
    { icon: "🔁", label: "Returning Viewers",      value: "74%",   color: "#06B6D4" },
    { icon: "⏱️", label: "Viewer Retention",       value: "68%",   color: "#F59E0B" },
    { icon: "📊", label: "Growth Rate",            value: "+2.6%", color: "#EC4899" },
    { icon: "💬", label: "Engagement Score",       value: "8.7",   color: "#7C3AED" },
    { icon: "🌍", label: "Audience Countries",     value: "14",    color: "#0EA5E9" },
  ];

  const GROWTH_BARS = [
    { label: "Jan", pct: 30 }, { label: "Feb", pct: 45 }, { label: "Mar", pct: 52 },
    { label: "Apr", pct: 61 }, { label: "May", pct: 74 }, { label: "Jun", pct: 88 },
  ];

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <SectionLabel label="👥 AUDIENCE ANALYTICS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {DATA.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      <div>
        <SectionLabel label="📈 FOLLOWER GROWTH (6 MONTHS)" />
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
            {GROWTH_BARS.map((b, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${b.pct}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                  style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg,#1F6BFF,#1F6BFF66)`, minHeight: 4 }}
                />
                <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel label="🌍 TOP VIEWER COUNTRIES" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[
            { flag: "🇶🇦", country: "Qatar",        pct: 38, color: "#1F6BFF" },
            { flag: "🇸🇦", country: "Saudi Arabia",  pct: 22, color: "#10B981" },
            { flag: "🇦🇪", country: "UAE",           pct: 16, color: "#F59E0B" },
            { flag: "🇪🇬", country: "Egypt",         pct: 12, color: "#A855F7" },
            { flag: "🌍", country: "Other",           pct: 12, color: "#9CA3AF" },
          ].map((c, i, arr) => (
            <div key={i} style={{ padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{c.flag} {c.country}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: c.color }}>{c.pct}%</span>
              </div>
              <ProgressBar pct={c.pct} color={c.color} height={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ REWARDS TAB ══════════════ */
function RewardsTab() {
  const [cat, setCat] = useState("Host Badges");
  const CATS = ["Host Badges","Host Crowns","Host Frames","Nameplates","Entrance Effects","Room Effects","Trophies"];
  const ITEMS = {
    "Host Badges":      [{ name: "Bronze Mic",     icon: "🎙️", color: "#CD7F32", lv: 1,   unlocked: true },  { name: "Silver Mic",    icon: "🎙️", color: "#9CA3AF", lv: 31,  unlocked: true }, { name: "Gold Stage",    icon: "🏅", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Diamond Badge", icon: "💎", color: "#06B6D4", lv: 121, unlocked: false }],
    "Host Crowns":      [{ name: "Bronze Crown",   icon: "👑", color: "#CD7F32", lv: 1,   unlocked: true },  { name: "Silver Crown",  icon: "👑", color: "#9CA3AF", lv: 61,  unlocked: true }, { name: "Gold Crown",    icon: "👑", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Diamond Crown", icon: "💎", color: "#06B6D4", lv: 121, unlocked: false }],
    "Host Frames":      [{ name: "Starter Frame",  icon: "🖼️", color: "#CD7F32", lv: 1,   unlocked: true },  { name: "Silver Frame",  icon: "🖼️", color: "#9CA3AF", lv: 31,  unlocked: true }, { name: "Gold Frame",    icon: "🖼️", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Diamond Frame", icon: "🖼️", color: "#06B6D4", lv: 121, unlocked: false }],
    "Nameplates":       [{ name: "Host Plate",     icon: "📛", color: "#9CA3AF", lv: 1,   unlocked: true },  { name: "Silver Plate",  icon: "📛", color: "#9CA3AF", lv: 61,  unlocked: true }, { name: "Gold Plate",    icon: "📛", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Diamond Plate", icon: "📛", color: "#06B6D4", lv: 121, unlocked: false }],
    "Entrance Effects": [{ name: "Spark Entry",    icon: "✨", color: "#CD7F32", lv: 1,   unlocked: true },  { name: "Crystal Entry", icon: "💎", color: "#9CA3AF", lv: 31,  unlocked: true }, { name: "Gold Entry",    icon: "🌟", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Dragon Entry",  icon: "🐲", color: "#DC2626", lv: 181, unlocked: false }],
    "Room Effects":     [{ name: "Basic Room FX",  icon: "🏠", color: "#10B981", lv: 1,   unlocked: true },  { name: "Premium Room",  icon: "✨", color: "#9CA3AF", lv: 61,  unlocked: false }, { name: "Gold Room FX",  icon: "🥇", color: "#F59E0B", lv: 91,  unlocked: false }, { name: "Dragon Room",   icon: "🐉", color: "#DC2626", lv: 181, unlocked: false }],
    "Trophies":         [{ name: "1st Stream",     icon: "🏆", color: "#10B981", lv: 1,   unlocked: true },  { name: "100 Streams",   icon: "🏆", color: "#F59E0B", lv: 50,  unlocked: true }, { name: "500 Streams",   icon: "🏆", color: "#06B6D4", lv: 100, unlocked: false }, { name: "Creator Award", icon: "🏆", color: "#A855F7", lv: 200, unlocked: false }],
  };

  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Next Rewards */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B88)", borderRadius: 16, padding: 14, boxShadow: "0 6px 20px rgba(245,158,11,0.2)" }}>
        <SectionLabel label={`🔓 NEXT REWARDS — ${NEXT.range} (${NEXT.title})`} />
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
        <SectionLabel label="🎁 HOST REWARD GALLERY" />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 16, fontSize: 10, fontWeight: 800, background: cat === c ? "#0D1B3E" : "#fff", color: cat === c ? "#fff" : "#6B7280", border: cat === c ? "none" : "1px solid #E5E7EB", cursor: "pointer", boxShadow: cat === c ? "0 4px 10px rgba(0,0,0,0.15)" : "none" }}>{c}</button>
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
    { name: "First Live Stream",    icon: "🎙️", color: "#10B981", desc: "Complete your first stream",  unlocked: true  },
    { name: "100 Followers",        icon: "👥", color: "#1F6BFF", desc: "Reach 100 followers",          unlocked: true  },
    { name: "1,000 Followers",      icon: "🌟", color: "#F59E0B", desc: "Reach 1,000 followers",        unlocked: true  },
    { name: "First Gift Received",  icon: "🎁", color: "#EC4899", desc: "Receive your first gift",      unlocked: true  },
    { name: "100 Streams",          icon: "🏆", color: "#A855F7", desc: "Complete 100 live streams",    unlocked: true  },
    { name: "First Event Win",      icon: "🥇", color: "#F59E0B", desc: "Win your first event",         unlocked: true  },
    { name: "Top 100 Host",         icon: "💫", color: "#06B6D4", desc: "Reach top 100 ranking",        unlocked: false },
    { name: "10,000 Followers",     icon: "👑", color: "#F59E0B", desc: "Reach 10,000 followers",       unlocked: false },
    { name: "Diamond Host",         icon: "💎", color: "#06B6D4", desc: "Reach LV121+ Diamond tier",    unlocked: false },
    { name: "100M Diamonds",        icon: "🌈", color: "#7C3AED", desc: "Earn 100M diamonds total",     unlocked: false },
    { name: "Elite Host",           icon: "❤️", color: "#DC2626", desc: "Reach Elite tier (LV181+)",    unlocked: false },
    { name: "GOAT Status",          icon: "🐐", color: "#F59E0B", desc: "Reach LV300 — GOAT Host",      unlocked: false },
  ];
  const unlocked = ACHS.filter(a => a.unlocked).length;
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B)", borderRadius: 18, padding: 16, boxShadow: "0 6px 20px rgba(245,158,11,0.25)" }}>
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
      <SectionLabel label="🏆 HOST ACHIEVEMENT COLLECTION" />
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
    { name: "Bronze Host Collection",   icon: "🥉", color: "#CD7F32", total: 4, unlocked: 4, bg: "#FFF8F0" },
    { name: "Silver Host Collection",   icon: "🥈", color: "#9CA3AF", total: 5, unlocked: 3, bg: "#F8F9FA" },
    { name: "Gold Host Collection",     icon: "🥇", color: "#F59E0B", total: 6, unlocked: 1, bg: "#FFFBEB" },
    { name: "Diamond Host Collection",  icon: "💎", color: "#06B6D4", total: 5, unlocked: 0, bg: "#F0FDFF" },
    { name: "Royal Host Collection",    icon: "👑", color: "#8B5CF6", total: 5, unlocked: 0, bg: "#F5F3FF" },
    { name: "Mythic Host Collection",   icon: "🔮", color: "#DC2626", total: 4, unlocked: 0, bg: "#FFF5F5" },
    { name: "Legendary Host Collection",icon: "🐉", color: "#7C3AED", total: 4, unlocked: 0, bg: "#F5F3FF" },
  ];
  return (
    <div style={{ padding: 14 }}>
      <SectionLabel label="💎 HOST COLLECTION PROGRESS" />
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

/* ══════════════ STATISTICS TAB ══════════════ */
function StatisticsTab() {
  const STATS = [
    { icon: "📺", label: "Total Streams",          value: "148",   color: "#1F6BFF" },
    { icon: "⏱️", label: "Total Streaming Hours",  value: "1,248h",color: "#10B981" },
    { icon: "🪙", label: "Total Coins",              value: "72.0M", color: "#F59E0B" },
    { icon: "👥", label: "Total Followers",        value: "12.4K", color: "#A855F7" },
    { icon: "❤️", label: "Total Likes",            value: "89.2K", color: "#EC4899" },
    { icon: "🎁", label: "Gifts Received",         value: "4,821", color: "#F59E0B" },
    { icon: "👁️", label: "Total Visitors",         value: "284K",  color: "#7C3AED" },
    { icon: "🏆", label: "Events Joined",          value: "34",    color: "#0EA5E9" },
    { icon: "🥇", label: "Events Won",             value: "8",     color: "#F59E0B" },
  ];
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <SectionLabel label="📈 HOST STATISTICS DASHBOARD" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div>
        <SectionLabel label="📜 RECENT HOST HISTORY" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {[
            { event: "Level Up → LV85",          time: "1 day ago",    icon: "⬆️", color: "#10B981" },
            { event: "Earned Silver Stage Crown", time: "1 day ago",    icon: "👑", color: "#9CA3AF" },
            { event: "Top 10 Weekly Event",       time: "3 days ago",   icon: "🏆", color: "#F59E0B" },
            { event: "Milestone: 10K Diamonds",   time: "1 week ago",   icon: "💎", color: "#06B6D4" },
            { event: "100th Live Stream",         time: "2 weeks ago",  icon: "📺", color: "#A855F7" },
            { event: "Joined VYRO Stars Agency",  time: "1 month ago",  icon: "🏢", color: "#7C3AED" },
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

/* ══════════════ EVENTS TAB ══════════════ */
function EventsTab() {
  const EVENTS = [
    { name: "Weekly Top Host",     status: "active",    reward: "50K 💎", rank: "#12", ends: "2 days",  color: "#10B981", icon: "🔴" },
    { name: "Monthly Champion",    status: "active",    reward: "500K 💎",rank: "#28", ends: "12 days", color: "#1F6BFF", icon: "🔴" },
    { name: "Summer Festival",     status: "upcoming",  reward: "200K 💎",rank: "—",   ends: "5 days",  color: "#F59E0B", icon: "🟡" },
    { name: "Golden Mic Battle",   status: "upcoming",  reward: "150K 💎",rank: "—",   ends: "8 days",  color: "#F59E0B", icon: "🟡" },
    { name: "Spring Top Host",     status: "completed", reward: "100K 💎",rank: "#8",  ends: "Ended",   color: "#9CA3AF", icon: "⚫" },
    { name: "Valentine Event",     status: "completed", reward: "80K 💎", rank: "#15", ends: "Ended",   color: "#9CA3AF", icon: "⚫" },
  ];
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { icon: "🔴", label: "Active Events",    value: "2", color: "#10B981" },
          { icon: "🟡", label: "Upcoming Events",  value: "2", color: "#F59E0B" },
          { icon: "🥇", label: "Events Won",       value: "8", color: "#A855F7" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <SectionLabel label="🎉 EVENT CENTER" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {EVENTS.map((ev, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 14, padding: "13px 14px",
            border: `1px solid ${ev.color}22`,
            boxShadow: ev.status === "active" ? `0 3px 12px ${ev.color}18` : "0 1px 4px rgba(0,0,0,0.04)",
            opacity: ev.status === "completed" ? 0.65 : 1,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${ev.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{ev.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>{ev.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Reward: {ev.reward} · Rank: {ev.rank}</div>
                <div style={{ fontSize: 9, color: ev.color, fontWeight: 700, marginTop: 2 }}>{ev.status === "active" ? `⏰ Ends in ${ev.ends}` : ev.status === "upcoming" ? `🗓️ Starts in ${ev.ends}` : "✅ Completed"}</div>
              </div>
              <button style={{ padding: "6px 10px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: ev.status === "active" ? ev.color : ev.status === "upcoming" ? "#F5F7FA" : "#F5F7FA", color: ev.status === "active" ? "#fff" : "#6B7280", border: "none", cursor: "pointer", flexShrink: 0 }}>
                {ev.status === "active" ? "Join" : ev.status === "upcoming" ? "Preview" : "View"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════ MAIN EXPORT ══════════════ */
export default function HostLevelDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const PANELS = {
    overview:     <OverviewTab />,
    performance:  <PerformanceTab />,
    audience:     <AudienceTab />,
    rewards:      <RewardsTab />,
    achievements: <AchievementsTab />,
    collections:  <CollectionsTab />,
    statistics:   <StatisticsTab />,
    events:       <EventsTab />,
  };

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #F59E0B 100%)", padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid rgba(255,255,255,0.22)" }}>🎙️</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>Host Level Dashboard</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>LV65 · Super Star · {fmt(CURRENT_COINS)} 🪙 coins</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV65</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Super Star</div>
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