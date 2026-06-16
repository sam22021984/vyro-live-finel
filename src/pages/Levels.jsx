/**
 * Level Systems Module
 * Access: More Services → Level Systems
 * Menu: Guide · User Level · Host Level · Gifting Level · Streaming Level
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  USER_LEVELS, HOST_LEVELS, GIFTING_LEVELS, STREAMING_LEVELS,
  LEVEL_TIER_CONFIG,
} from "@/lib/constants";
import LevelBadge3D from "@/components/shared/LevelBadge3D";

/* ─── Helpers ─── */
function formatBig(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ─── System config ─── */
const SYSTEMS = [
  { key: "user",      label: "User Level",      icon: "👤", color: "#A855F7", levels: USER_LEVELS,      valueKey: "coins_required",   unitLabel: "Coins",        maxLevels: 300, desc: "Based on total coins earned/spent" },
  { key: "host",      label: "Host Level",      icon: "🎙️", color: "#F59E0B", levels: HOST_LEVELS,      valueKey: "diamonds_required",unitLabel: "Diamonds",     maxLevels: 300, desc: "Based on total diamonds earned" },
  { key: "gifting",   label: "Gifting Level",   icon: "🎁", color: "#EC4899", levels: GIFTING_LEVELS,   valueKey: "coins_spent",      unitLabel: "Coins Spent",  maxLevels: 200, desc: "Based on total coins spent on gifts" },
  { key: "streaming", label: "Streaming Level", icon: "📡", color: "#06B6D4", levels: STREAMING_LEVELS, valueKey: "minutes_required", unitLabel: "Minutes",      maxLevels: 200, desc: "Based on total streaming minutes" },
];

/* ─── Menu items ─── */
const MENU_ITEMS = [
  { id: "guide",     label: "Level System Guide", icon: "📖", color: "#1F6BFF", desc: "How levels, tiers & rewards work" },
  { id: "user",      label: "User Level",          icon: "👤", color: "#A855F7", desc: "Lv 1 – 300 · Coin milestones" },
  { id: "host",      label: "Host Level",          icon: "🎙️", color: "#F59E0B", desc: "Lv 1 – 300 · Diamond earnings" },
  { id: "gifting",   label: "Gifting Level",       icon: "🎁", color: "#EC4899", desc: "Lv 1 – 200 · Coins spent on gifts" },
  { id: "streaming", label: "Streaming Level",     icon: "📡", color: "#06B6D4", desc: "Lv 1 – 200 · Streaming minutes" },
];

/* ─── Guide Screen ─── */
function GuideScreen() {
  return (
    <div style={{ padding: "14px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#7C3AED)", borderRadius: 20, padding: "24px 20px", marginBottom: 16, boxShadow: "0 8px 28px rgba(124,58,237,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>⭐</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>VYRO Level System Guide</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.8 }}>
          4 independent leveling systems · Up to 300 levels each · 10 tiers per system
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {SYSTEMS.map(s => (
          <div key={s.key} style={{ background: "#fff", borderRadius: 14, padding: "12px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: s.color }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>Max Lv.{s.maxLevels}</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 3, lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📋 How It Works</div>
        {[
          { icon: "📈", title: "Activity-Based",    body: "Each system tracks a specific activity — spending coins, earning diamonds, gifting, or streaming." },
          { icon: "🏅", title: "10 Tiers",          body: "Every 30 levels you advance to a new tier — Bronze, Silver, Gold, Platinum, Diamond, Master, Legend, Elite, Champion, Supreme." },
          { icon: "🎁", title: "Level Rewards",     body: "Unlock exclusive frames, badges, icons, and coin bonuses as you level up." },
          { icon: "📊", title: "Exponential Scaling",body: "Requirements scale exponentially — early levels are easy, later levels require dedication." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid #F0F0F8" : "none" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2, lineHeight: 1.6 }}>{item.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tier Names */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🏆 10 Tiers</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {LEVEL_TIER_CONFIG.map((tier, i) => (
            <div key={tier.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: `${tier.color}11`, border: `1px solid ${tier.color}33` }}>
              <span style={{ fontSize: 18 }}>{tier.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: tier.color }}>{tier.name}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>Lv {i * 30 + 1}–{i * 30 + 30}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Level Detail Screen ─── */
function LevelDetailScreen({ systemKey }) {
  const system = SYSTEMS.find(s => s.key === systemKey);
  const [filterTier, setFilterTier] = useState(null);

  const milestones = system.maxLevels === 300
    ? [1, 10, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300]
    : [1, 10, 30, 50, 80, 100, 130, 160, 200];

  const filtered = filterTier !== null
    ? system.levels.filter(l => l.tier_index === filterTier)
    : system.levels.filter(l => [1, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300].includes(l.level));

  return (
    <div style={{ padding: "14px" }}>
      {/* System Hero */}
      <div style={{ background: `linear-gradient(135deg,#0D1B3E,${system.color}88)`, borderRadius: 20, padding: "20px", marginBottom: 14, boxShadow: `0 8px 24px ${system.color}44` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>LEVEL SYSTEM</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{system.icon} {system.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{system.desc}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: system.color }}>{system.maxLevels}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Total Levels</div>
          </div>
        </div>
        {/* Badge Previews */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {milestones.slice(0, 8).map(lvIdx => {
            const lv = system.levels[lvIdx - 1];
            if (!lv) return null;
            return (
              <div key={lvIdx} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <LevelBadge3D type={system.key} value={lv[system.valueKey]} size="xs" />
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>Lv.{lv.level}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tier Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        <button onClick={() => setFilterTier(null)}
          style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800, cursor: "pointer", border: "none",
            background: filterTier === null ? "#0D1B3E" : "#fff",
            color: filterTier === null ? "#fff" : "#6B7280",
            boxShadow: filterTier === null ? "0 4px 10px rgba(0,0,0,0.2)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
          Milestones
        </button>
        {LEVEL_TIER_CONFIG.map((tier, i) => (
          <button key={tier.name} onClick={() => setFilterTier(i)}
            style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 10, fontWeight: 800, cursor: "pointer", border: "none",
              background: filterTier === i ? tier.color : "#fff",
              color: filterTier === i ? "#fff" : "#6B7280",
              boxShadow: filterTier === i ? `0 4px 10px ${tier.color}44` : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {tier.icon} {tier.name}
          </button>
        ))}
      </div>

      {/* Level Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F0F0F8", background: "#F5F7FA" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#9CA3AF", fontWeight: 800, fontSize: 11 }}>Level</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#9CA3AF", fontWeight: 800, fontSize: 11 }}>Badge</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#9CA3AF", fontWeight: 800, fontSize: 11 }}>Tier</th>
                <th style={{ padding: "10px 12px", textAlign: "right", color: "#9CA3AF", fontWeight: 800, fontSize: 11 }}>{system.unitLabel}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lv, i) => (
                <tr key={lv.level} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 900, color: "#0D1B3E" }}>{lv.level}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <LevelBadge3D type={system.key} value={lv[system.valueKey]} size="xs" />
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: 8, fontSize: 10, fontWeight: 800, background: lv.color + "18", color: lv.color, border: `1px solid ${lv.color}33` }}>
                      {lv.icon} {lv.tier_name}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#374151", fontFamily: "monospace" }}>
                    {formatBig(lv[system.valueKey])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "#9CA3AF", marginTop: 12 }}>
        All {system.maxLevels} levels · Values scale exponentially · Tier changes every 30 levels
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Levels() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const current = MENU_ITEMS.find(m => m.id === active);

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F0F0F8", padding: "12px 16px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => active ? setActive(null) : navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>
              {current ? `${current.icon} ${current.label}` : "⭐ Level Systems"}
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>
              {current ? current.desc : "Guide · User · Host · Gifting · Streaming"}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "16px" }}>

            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg,#0D1B3E,#7C3AED)", borderRadius: 20, padding: "22px 20px", marginBottom: 16, boxShadow: "0 8px 28px rgba(124,58,237,0.28)" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>VYRO Level Systems</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.8 }}>
                4 systems · Up to 300 levels · 10 tiers · Exponential rewards
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {SYSTEMS.map(s => (
                  <div key={s.key} style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: 16 }}>{s.icon}</div>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", marginTop: 2, fontWeight: 800 }}>Lv.{s.maxLevels}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MENU_ITEMS.map((item, i) => (
                <motion.button key={item.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActive(item.id)}
                  style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <ChevronRight size={16} color={item.color} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={active}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {active === "guide"
              ? <GuideScreen />
              : <LevelDetailScreen systemKey={active} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}