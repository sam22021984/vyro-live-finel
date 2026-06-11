// Levels Showcase Page — VYRO LIVE
// All 4 level systems: User, Host, Gifting, Streaming
// 300 levels each with 3D badges and tier details

import { useState } from "react";
import {
  USER_LEVELS, HOST_LEVELS, GIFTING_LEVELS, STREAMING_LEVELS,
  LEVEL_TIER_CONFIG, getUserLevelFromCoins, getHostLevel, getGiftingLevel, getStreamingLevel
} from "@/lib/constants";
import LevelBadge3D from "@/components/shared/LevelBadge3D";

const SYSTEMS = [
  {
    key: "user",
    label: "User Level",
    icon: "👤",
    desc: "Based on total coins earned/spent (0 → 9 Billion)",
    levels: USER_LEVELS,
    valueKey: "coins_required",
    unitLabel: "Coins",
    color: "#A855F7",
    getLevel: getUserLevelFromCoins,
  },
  {
    key: "host",
    label: "Host Level",
    icon: "🎙️",
    desc: "Based on total diamonds earned (0 → 500M diamonds)",
    levels: HOST_LEVELS,
    valueKey: "diamonds_required",
    unitLabel: "Diamonds",
    color: "#F59E0B",
    getLevel: getHostLevel,
  },
  {
    key: "gifting",
    label: "Gifting Level",
    icon: "🎁",
    desc: "Based on total coins spent on gifts (0 → 3 Billion)",
    levels: GIFTING_LEVELS,
    valueKey: "coins_spent",
    unitLabel: "Coins Spent",
    color: "#EC4899",
    getLevel: getGiftingLevel,
  },
  {
    key: "streaming",
    label: "Streaming Level",
    icon: "📡",
    desc: "Based on total streaming minutes (0 → 6M mins = 100K hours)",
    levels: STREAMING_LEVELS,
    valueKey: "minutes_required",
    unitLabel: "Minutes",
    color: "#06B6D4",
    getLevel: getStreamingLevel,
  },
];

function formatBig(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function TierGrid({ system }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4">
      {LEVEL_TIER_CONFIG.map((tier, i) => {
        const startLv = i * 30 + 1;
        const endLv = startLv + 29;
        const startVal = system.levels[startLv - 1]?.[system.valueKey] ?? 0;
        const endVal = system.levels[endLv - 1]?.[system.valueKey] ?? 0;
        return (
          <div
            key={tier.name}
            className="rounded-xl p-3 border border-white/10 flex flex-col items-center gap-2 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${tier.gradient[0]}33, ${tier.gradient[1]}22)` }}
          >
            {/* 3D shine */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tier.color}88, transparent)` }} />
            <span className="text-2xl">{tier.icon}</span>
            <div className="text-xs font-bold text-white">{tier.name}</div>
            <div className="text-[10px] text-slate-400">Lv {startLv}–{endLv}</div>
            <div className="text-[10px] text-slate-500 text-center">{formatBig(startVal)} → {formatBig(endVal)}</div>
            <div
              className="w-full h-1.5 rounded-full mt-1"
              style={{ background: `linear-gradient(90deg, ${tier.gradient[0]}, ${tier.gradient[1]})`, boxShadow: `0 0 6px ${tier.glow}66` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function LevelPreviewRow({ system }) {
  // Show milestones: every 30 levels
  const milestones = [1, 10, 20, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];
  return (
    <div className="flex flex-wrap gap-4 my-4 justify-center">
      {milestones.map(lvIdx => {
        const lv = system.levels[lvIdx - 1];
        if (!lv) return null;
        return (
          <div key={lvIdx} className="flex flex-col items-center gap-1">
            <LevelBadge3D type={system.key} value={lv[system.valueKey]} size="md" showName />
          </div>
        );
      })}
    </div>
  );
}

function LevelTable({ system, filterTier }) {
  const filtered = filterTier !== null
    ? system.levels.filter(l => l.tier_index === filterTier)
    : system.levels.filter(l => [1,30,60,90,120,150,180,210,240,270,300].includes(l.level));

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-3 py-2 text-left text-slate-400">Level</th>
            <th className="px-3 py-2 text-left text-slate-400">Badge</th>
            <th className="px-3 py-2 text-left text-slate-400">Tier</th>
            <th className="px-3 py-2 text-left text-slate-400">Name</th>
            <th className="px-3 py-2 text-right text-slate-400">{system.unitLabel} Required</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(lv => (
            <tr key={lv.level} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="px-3 py-2 font-bold text-white">{lv.level}</td>
              <td className="px-3 py-2">
                <LevelBadge3D type={system.key} value={lv[system.valueKey]} size="xs" />
              </td>
              <td className="px-3 py-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: lv.gradient[0] + "44", color: lv.color, border: `1px solid ${lv.color}44` }}>
                  {lv.icon} {lv.tier_name}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-300">{lv.name}</td>
              <td className="px-3 py-2 text-right font-mono text-slate-300">{formatBig(lv[system.valueKey])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Levels() {
  const [activeSystem, setActiveSystem] = useState("user");
  const [filterTier, setFilterTier] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const system = SYSTEMS.find(s => s.key === activeSystem);

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-2"
            style={{ background: "linear-gradient(90deg,#A855F7,#EC4899,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            VYRO Level Systems
          </h1>
          <p className="text-slate-400 text-sm">4 independent leveling systems · 300 levels each · 10 tiers per system</p>
        </div>

        {/* System Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {SYSTEMS.map(s => (
            <button
              key={s.key}
              onClick={() => { setActiveSystem(s.key); setFilterTier(null); setShowAll(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border"
              style={activeSystem === s.key
                ? { background: s.color + "22", borderColor: s.color + "88", color: s.color, boxShadow: `0 0 16px ${s.color}44` }
                : { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }
              }
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Active System Card */}
        <div className="rounded-2xl border border-white/10 p-5 mb-6"
          style={{ background: `linear-gradient(135deg, ${system.color}11, rgba(13,13,26,0.9))`, boxShadow: `0 0 40px ${system.color}22` }}>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{system.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{system.label}</h2>
              <p className="text-slate-400 text-xs">{system.desc}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-black" style={{ color: system.color }}>300</div>
              <div className="text-slate-500 text-xs">Total Levels</div>
            </div>
          </div>

          {/* Preview badges at milestone levels */}
          <LevelPreviewRow system={system} />

          {/* Tier grid */}
          <h3 className="text-sm font-bold text-slate-300 mb-2 mt-4">🎯 10 Tiers (30 Levels Each)</h3>
          <TierGrid system={system} />
        </div>

        {/* Tier Filter */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button
            onClick={() => setFilterTier(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterTier === null ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/10 text-slate-400"}`}
          >
            Milestones
          </button>
          {LEVEL_TIER_CONFIG.map((tier, i) => (
            <button
              key={tier.name}
              onClick={() => setFilterTier(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
              style={filterTier === i
                ? { background: tier.color + "33", borderColor: tier.color + "88", color: tier.color }
                : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "#64748b" }
              }
            >
              {tier.icon} {tier.name}
            </button>
          ))}
        </div>

        {/* Level Table */}
        <LevelTable system={system} filterTier={filterTier} />

        {/* Note */}
        <p className="text-center text-slate-600 text-xs mt-6">
          All 300 levels auto-calculated · Tier changes every 30 levels · Values scale exponentially
        </p>
      </div>
    </div>
  );
}