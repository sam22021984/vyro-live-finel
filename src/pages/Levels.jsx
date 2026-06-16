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
  { id: "guide",      label: "Level System Guide", icon: "📖", color: "#1F6BFF", desc: "How levels, tiers & rewards work" },
  { id: "user_guide", label: "User Level Guide",   icon: "👤", color: "#A855F7", desc: "What is User Level & how to grow" },
  { id: "user",       label: "User Level",          icon: "📊", color: "#A855F7", desc: "Lv 1 – 300 · Full level table" },
  { id: "host_guide", label: "Host Level Guide",    icon: "🎙️", color: "#F59E0B", desc: "What is Host Level & how to grow" },
  { id: "host",      label: "Host Level",          icon: "📊", color: "#F59E0B", desc: "Lv 1 – 300 · Diamond earnings" },
  { id: "gifting_guide", label: "Gifting Level Guide", icon: "🎁", color: "#EC4899", desc: "What is Gifting Level & how to grow" },
  { id: "gifting",   label: "Gifting Level",       icon: "📊", color: "#EC4899", desc: "Lv 1 – 200 · Coins spent on gifts" },
  { id: "streaming_guide", label: "Streaming Level Guide", icon: "📡", color: "#06B6D4", desc: "What is Streaming Level & how to grow" },
  { id: "streaming", label: "Streaming Level",     icon: "📊", color: "#06B6D4", desc: "Lv 1 – 200 · Streaming minutes" },
];

/* ─── User Level Guide Screen ─── */
function UserLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");

  const XP_SOURCES = [
    { icon: "🎁", name: "Sending Gifts" },
    { icon: "💝", name: "Receiving Gifts" },
    { icon: "🎉", name: "Joining Party Rooms" },
    { icon: "🎙️", name: "Voice Chat Activity" },
    { icon: "📅", name: "Daily Login Rewards" },
    { icon: "✅", name: "Completing Daily Tasks" },
    { icon: "🏆", name: "Participating in Events" },
    { icon: "👤", name: "Following Other Users" },
    { icon: "👁️", name: "Room Engagement" },
    { icon: "📱", name: "Platform Activity" },
  ];

  const BENEFITS = [
    { icon: "🖼️", name: "Premium Profile Frames" },
    { icon: "🏅", name: "Animated Badges" },
    { icon: "💬", name: "Exclusive Chat Bubbles" },
    { icon: "🎨", name: "Username Colors" },
    { icon: "✨", name: "Entrance Effects" },
    { icon: "👑", name: "VIP Recognition" },
    { icon: "🎟️", name: "Exclusive Events Access" },
    { icon: "📡", name: "Higher Profile Visibility" },
    { icon: "🎖️", name: "Special Achievement Rewards" },
  ];

  const USER_STATES = [
    { label: "New User",       state: "Level 1",           color: "#9CA3AF" },
    { label: "Active User",    state: "Progressing",       color: "#1F6BFF" },
    { label: "High Level",     state: "Advanced Level",    color: "#A855F7" },
    { label: "Max Level",      state: "Level 300 Reached", color: "#FFC83D" },
  ];

  return (
    <div style={{ padding: "14px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#A855F7)", borderRadius: 20, padding: "22px 20px", marginBottom: 14, boxShadow: "0 8px 28px rgba(168,85,247,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>User Level Guide</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.7 }}>
          User Level represents your overall activity and engagement across the VYRO platform. The more active you are, the faster your level increases.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[{ label: "Min Level", value: "1" }, { label: "Max Level", value: "300" }, { label: "Total Tiers", value: "10" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["overview", "earn", "benefits"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#A855F7" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "overview" ? "Overview" : t === "earn" ? "How to Earn" : "Benefits"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* User States */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 User States</div>
            {USER_STATES.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < USER_STATES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
                <div style={{ padding: "3px 12px", borderRadius: 10, background: s.color + "18", fontSize: 11, fontWeight: 800, color: s.color }}>{s.state}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "📈 View Level Progress", action: () => onBack("user") },
              { label: "🎁 View Rewards",         action: () => setTab("benefits") },
              { label: "⭐ View Benefits",        action: () => setTab("benefits") },
            ].map((btn, i) => (
              <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={btn.action}
                style={{ width: "100%", padding: "13px", borderRadius: 14, border: i === 0 ? "none" : "1px solid #E5E7EB",
                  background: i === 0 ? "linear-gradient(135deg,#A855F7,#C084FC)" : "#fff",
                  fontWeight: 800, cursor: "pointer",
                  color: i === 0 ? "#fff" : "#374151", fontSize: 13,
                  boxShadow: i === 0 ? "0 6px 20px rgba(168,85,247,0.3)" : "none" }}>
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Earn Tab */}
      {tab === "earn" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>⚡ How to Increase User Level</div>
          {XP_SOURCES.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < XP_SOURCES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#374151" }}>{s.name}</div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: "#ECFDF5", fontSize: 10, fontWeight: 800, color: "#10B981" }}>✓ XP</div>
            </div>
          ))}
        </div>
      )}

      {/* Benefits Tab */}
      {tab === "benefits" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🎁 User Level Benefits</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#F5F3FF", border: "1px solid #A855F722" }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.4 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Host Level Guide Screen ─── */
function HostLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");

  const XP_SOURCES = [
    { icon: "🎁", name: "Gifts Received During Streams" },
    { icon: "📺", name: "Hosting Live Streams" },
    { icon: "🎉", name: "Party Room Hosting" },
    { icon: "👥", name: "Viewer Engagement" },
    { icon: "⏱️", name: "Audience Retention" },
    { icon: "⚔️", name: "PK Battles Participation" },
    { icon: "🏆", name: "Event Rankings" },
    { icon: "✅", name: "Daily Host Missions" },
    { icon: "📈", name: "Stream Performance" },
  ];

  const BENEFITS = [
    { icon: "⭐", name: "Featured Host Placement" },
    { icon: "🏠", name: "Homepage Promotion" },
    { icon: "✅", name: "Verified Host Badge" },
    { icon: "✨", name: "Premium Broadcast Effects" },
    { icon: "🖼️", name: "Exclusive Host Frames" },
    { icon: "📡", name: "Higher Discovery Ranking" },
    { icon: "🎟️", name: "Priority Event Access" },
    { icon: "📊", name: "Advanced Analytics" },
    { icon: "🛟", name: "Priority Support" },
  ];

  const HOST_STATES = [
    { label: "New Host",    state: "Level 1",           color: "#9CA3AF" },
    { label: "Active Host", state: "Progressing",       color: "#F59E0B" },
    { label: "Top Host",    state: "Advanced Level",    color: "#A855F7" },
    { label: "Max Host",    state: "Level 300 Reached", color: "#FFC83D" },
  ];

  return (
    <div style={{ padding: "14px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B)", borderRadius: 20, padding: "22px 20px", marginBottom: 14, boxShadow: "0 8px 28px rgba(245,158,11,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎙️</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Host Level Guide</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.7 }}>
          Host Level measures your performance and success as a host on VYRO Live Connect. The more you stream and engage, the higher your Host Level.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[{ label: "Min Level", value: "1" }, { label: "Max Level", value: "300" }, { label: "Total Tiers", value: "10" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["overview", "earn", "benefits"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#F59E0B" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "overview" ? "Overview" : t === "earn" ? "How to Earn" : "Benefits"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 Host States</div>
            {HOST_STATES.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < HOST_STATES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
                <div style={{ padding: "3px 12px", borderRadius: 10, background: s.color + "18", fontSize: 11, fontWeight: 800, color: s.color }}>{s.state}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "📈 View Host Progress", action: () => onBack("host") },
              { label: "🎁 View Rewards",        action: () => setTab("benefits") },
              { label: "⭐ View Benefits",       action: () => setTab("benefits") },
            ].map((btn, i) => (
              <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={btn.action}
                style={{ width: "100%", padding: "13px", borderRadius: 14, border: i === 0 ? "none" : "1px solid #E5E7EB",
                  background: i === 0 ? "linear-gradient(135deg,#F59E0B,#FBBF24)" : "#fff",
                  fontWeight: 800, cursor: "pointer",
                  color: i === 0 ? "#fff" : "#374151", fontSize: 13,
                  boxShadow: i === 0 ? "0 6px 20px rgba(245,158,11,0.3)" : "none" }}>
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Earn Tab */}
      {tab === "earn" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>⚡ How to Increase Host Level</div>
          {XP_SOURCES.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < XP_SOURCES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#374151" }}>{s.name}</div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: "#ECFDF5", fontSize: 10, fontWeight: 800, color: "#10B981" }}>✓ XP</div>
            </div>
          ))}
        </div>
      )}

      {/* Benefits Tab */}
      {tab === "benefits" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🎁 Host Level Benefits</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #F59E0B22" }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.4 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Gifting Level Guide Screen ─── */
function GiftingLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");

  const XP_SOURCES = [
    { icon: "🎁", name: "Sending Gifts in Live Streams" },
    { icon: "🎉", name: "Sending Gifts in Party Rooms" },
    { icon: "🏆", name: "Sending Event Gifts" },
    { icon: "💎", name: "Sending Premium Gifts" },
    { icon: "⚔️", name: "Participating in PK Battle Gifting" },
  ];

  const BENEFITS = [
    { icon: "🖼️", name: "Luxury Profile Frames" },
    { icon: "🏅", name: "Animated Sender Badge" },
    { icon: "✨", name: "Premium Gift Effects" },
    { icon: "🎁", name: "Exclusive Gifts Access" },
    { icon: "📢", name: "Gift Broadcast Priority" },
    { icon: "💫", name: "VIP Name Glow" },
    { icon: "🌟", name: "Luxury Entrance Effects" },
    { icon: "👑", name: "Elite Gifter Recognition" },
  ];

  const GIFTER_STATES = [
    { label: "New Gifter",    state: "Level 1",               color: "#9CA3AF" },
    { label: "Active Gifter", state: "Progressing",           color: "#EC4899" },
    { label: "Elite Gifter",  state: "Advanced Gifting Level",color: "#A855F7" },
    { label: "Max Level",     state: "Level 200 Reached",     color: "#FFC83D" },
  ];

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#EC4899)", borderRadius: 20, padding: "22px 20px", marginBottom: 14, boxShadow: "0 8px 28px rgba(236,72,153,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>🎁</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Gifting Level Guide</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.7 }}>
          Gifting Level represents your support for creators, hosts, and the VYRO community through gifting.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[{ label: "Min Level", value: "1" }, { label: "Max Level", value: "200" }, { label: "Total Tiers", value: "10" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["overview", "earn", "benefits"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#EC4899" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "overview" ? "Overview" : t === "earn" ? "How to Earn" : "Benefits"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 Gifter States</div>
            {GIFTER_STATES.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < GIFTER_STATES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
                <div style={{ padding: "3px 12px", borderRadius: 10, background: s.color + "18", fontSize: 11, fontWeight: 800, color: s.color }}>{s.state}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "📈 View Gifting Progress", action: () => onBack("gifting") },
              { label: "🎁 View Rewards",           action: () => setTab("benefits") },
              { label: "⭐ View Benefits",          action: () => setTab("benefits") },
            ].map((btn, i) => (
              <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={btn.action}
                style={{ width: "100%", padding: "13px", borderRadius: 14, border: i === 0 ? "none" : "1px solid #E5E7EB",
                  background: i === 0 ? "linear-gradient(135deg,#EC4899,#F472B6)" : "#fff",
                  fontWeight: 800, cursor: "pointer",
                  color: i === 0 ? "#fff" : "#374151", fontSize: 13,
                  boxShadow: i === 0 ? "0 6px 20px rgba(236,72,153,0.3)" : "none" }}>
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {tab === "earn" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>⚡ How to Increase Gifting Level</div>
          {XP_SOURCES.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < XP_SOURCES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FDF2F8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#374151" }}>{s.name}</div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: "#ECFDF5", fontSize: 10, fontWeight: 800, color: "#10B981" }}>✓ XP</div>
            </div>
          ))}
        </div>
      )}

      {tab === "benefits" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🎁 Gifting Level Benefits</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#FDF2F8", border: "1px solid #EC489922" }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.4 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Streaming Level Guide Screen ─── */
function StreamingLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");

  const XP_SOURCES = [
    { icon: "🎁", name: "Gifts Received" },
    { icon: "👥", name: "Viewer Count" },
    { icon: "⏱️", name: "Watch Time" },
    { icon: "❤️", name: "Likes Received" },
    { icon: "🔗", name: "Shares Received" },
    { icon: "💬", name: "Audience Engagement" },
    { icon: "🔥", name: "Room Popularity" },
    { icon: "🏆", name: "Event Participation" },
    { icon: "📺", name: "Stream Activity" },
  ];

  const BENEFITS = [
    { icon: "🚀", name: "Discovery Boost" },
    { icon: "📈", name: "Trending Placement" },
    { icon: "⭐", name: "Featured Stream Placement" },
    { icon: "✨", name: "Premium Stream Decorations" },
    { icon: "🎨", name: "Exclusive Room Themes" },
    { icon: "🎟️", name: "Event Priority Access" },
    { icon: "📡", name: "Enhanced Visibility" },
    { icon: "🏅", name: "Stream Achievement Rewards" },
  ];

  const STREAMER_STATES = [
    { label: "New Streamer",     state: "Level 1",                  color: "#9CA3AF" },
    { label: "Active Streamer",  state: "Progressing",              color: "#06B6D4" },
    { label: "Popular Streamer", state: "Advanced Streaming Level", color: "#A855F7" },
    { label: "Max Level",        state: "Level 200 Reached",        color: "#FFC83D" },
  ];

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#06B6D4)", borderRadius: 20, padding: "22px 20px", marginBottom: 14, boxShadow: "0 8px 28px rgba(6,182,212,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📡</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Streaming Level Guide</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.7 }}>
          Streaming Level measures the popularity and performance of your stream, room, or live session.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[{ label: "Min Level", value: "1" }, { label: "Max Level", value: "200" }, { label: "Total Tiers", value: "10" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["overview", "earn", "benefits"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#06B6D4" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "overview" ? "Overview" : t === "earn" ? "How to Earn" : "Benefits"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 Streamer States</div>
            {STREAMER_STATES.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < STREAMER_STATES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
                <div style={{ padding: "3px 12px", borderRadius: 10, background: s.color + "18", fontSize: 11, fontWeight: 800, color: s.color }}>{s.state}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "📈 View Streaming Progress", action: () => onBack("streaming") },
              { label: "🎁 View Rewards",             action: () => setTab("benefits") },
              { label: "⭐ View Benefits",            action: () => setTab("benefits") },
            ].map((btn, i) => (
              <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={btn.action}
                style={{ width: "100%", padding: "13px", borderRadius: 14, border: i === 0 ? "none" : "1px solid #E5E7EB",
                  background: i === 0 ? "linear-gradient(135deg,#06B6D4,#22D3EE)" : "#fff",
                  fontWeight: 800, cursor: "pointer",
                  color: i === 0 ? "#fff" : "#374151", fontSize: 13,
                  boxShadow: i === 0 ? "0 6px 20px rgba(6,182,212,0.3)" : "none" }}>
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {tab === "earn" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>⚡ How to Increase Streaming Level</div>
          {XP_SOURCES.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < XP_SOURCES.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ECFEFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#374151" }}>{s.name}</div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: "#ECFDF5", fontSize: 10, fontWeight: 800, color: "#10B981" }}>✓ XP</div>
            </div>
          ))}
        </div>
      )}

      {tab === "benefits" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🎁 Streaming Level Benefits</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#ECFEFF", border: "1px solid #06B6D422" }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.4 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── General Level System Guide Screen ─── */
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
              : active === "user_guide"
              ? <UserLevelGuide onBack={(key) => setActive(key)} />
              : active === "host_guide"
              ? <HostLevelGuide onBack={(key) => setActive(key)} />
              : active === "gifting_guide"
              ? <GiftingLevelGuide onBack={(key) => setActive(key)} />
              : active === "streaming_guide"
              ? <StreamingLevelGuide onBack={(key) => setActive(key)} />
              : <LevelDetailScreen systemKey={active} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}