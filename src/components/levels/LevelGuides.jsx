/**
 * Level Guide Components — extracted from pages/Levels.jsx
 * UserLevelGuide | HostLevelGuide | GiftingLevelGuide | StreamingLevelGuide | LevelSystemRules
 */
import { useState } from "react";
import { motion } from "framer-motion";

/* ─── Shared sub-components ─── */
function GuideHero({ emoji, title, description, maxLevel, gradient, shadow }) {
  return (
    <div style={{ background: gradient, borderRadius: 20, padding: "22px 20px", marginBottom: 14, boxShadow: shadow }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.7 }}>{description}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {[{ label: "Min Level", value: "1" }, { label: "Max Level", value: String(maxLevel) }, { label: "Total Tiers", value: "10" }].map(s => (
          <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuideTabs({ tab, setTab, accentColor }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
      {["overview", "earn", "benefits"].map(t => (
        <button key={t} onClick={() => setTab(t)}
          style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800,
            background: tab === t ? "#fff" : "transparent",
            color: tab === t ? accentColor : "#9CA3AF",
            boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
          {t === "overview" ? "Overview" : t === "earn" ? "How to Earn" : "Benefits"}
        </button>
      ))}
    </div>
  );
}

function GuideStates({ label, states }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
      <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 {label}</div>
      {states.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < states.length - 1 ? "1px solid #F0F0F8" : "none" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{s.label}</div>
          <div style={{ padding: "3px 12px", borderRadius: 10, background: s.color + "18", fontSize: 11, fontWeight: 800, color: s.color }}>{s.state}</div>
        </div>
      ))}
    </div>
  );
}

function GuideCTAs({ progressLabel, onProgress, onBenefits, gradient, shadow }) {
  const btns = [
    { label: progressLabel, action: onProgress, primary: true },
    { label: "🎁 View Rewards",  action: onBenefits, primary: false },
    { label: "⭐ View Benefits", action: onBenefits, primary: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {btns.map((btn, i) => (
        <motion.button key={i} whileTap={{ scale: 0.97 }} onClick={btn.action}
          style={{ width: "100%", padding: "13px", borderRadius: 14,
            border: btn.primary ? "none" : "1px solid #E5E7EB",
            background: btn.primary ? gradient : "#fff",
            fontWeight: 800, cursor: "pointer",
            color: btn.primary ? "#fff" : "#374151", fontSize: 13,
            boxShadow: btn.primary ? shadow : "none" }}>
          {btn.label}
        </motion.button>
      ))}
    </div>
  );
}

function GuideXPList({ title, sources, bgColor }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
      <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>⚡ {title}</div>
      {sources.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < sources.length - 1 ? "1px solid #F0F0F8" : "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#374151" }}>{s.name}</div>
          <div style={{ padding: "3px 10px", borderRadius: 10, background: "#ECFDF5", fontSize: 10, fontWeight: 800, color: "#10B981" }}>✓ XP</div>
        </div>
      ))}
    </div>
  );
}

function GuideBenefitGrid({ title, benefits, bgColor, borderColor }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
      <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>🎁 {title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: bgColor, border: borderColor }}>
            <span style={{ fontSize: 20 }}>{b.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.4 }}>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── User Level Guide ─── */
export function UserLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");
  const XP_SOURCES = [
    { icon: "🎁", name: "Sending Gifts" }, { icon: "💝", name: "Receiving Gifts" },
    { icon: "🎉", name: "Joining Party Rooms" }, { icon: "🎙️", name: "Voice Chat Activity" },
    { icon: "📅", name: "Daily Login Rewards" }, { icon: "✅", name: "Completing Daily Tasks" },
    { icon: "🏆", name: "Participating in Events" }, { icon: "👤", name: "Following Other Users" },
    { icon: "👁️", name: "Room Engagement" }, { icon: "📱", name: "Platform Activity" },
  ];
  const BENEFITS = [
    { icon: "🖼️", name: "Premium Profile Frames" }, { icon: "🏅", name: "Animated Badges" },
    { icon: "💬", name: "Exclusive Chat Bubbles" }, { icon: "🎨", name: "Username Colors" },
    { icon: "✨", name: "Entrance Effects" }, { icon: "👑", name: "VIP Recognition" },
    { icon: "🎟️", name: "Exclusive Events Access" }, { icon: "📡", name: "Higher Profile Visibility" },
    { icon: "🎖️", name: "Special Achievement Rewards" },
  ];
  const STATES = [
    { label: "New User",    state: "Level 1",           color: "#9CA3AF" },
    { label: "Active User", state: "Progressing",       color: "#1F6BFF" },
    { label: "High Level",  state: "Advanced Level",    color: "#A855F7" },
    { label: "Max Level",   state: "Level 300 Reached", color: "#FFC83D" },
  ];
  return (
    <div style={{ padding: "14px" }}>
      <GuideHero emoji="👤" title="User Level Guide" maxLevel={300}
        description="User Level represents your overall activity and engagement across the VYRO platform."
        gradient="linear-gradient(135deg,#0D1B3E,#A855F7)" shadow="0 8px 28px rgba(168,85,247,0.3)" />
      <GuideTabs tab={tab} setTab={setTab} accentColor="#A855F7" />
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <GuideStates label="User States" states={STATES} />
          <GuideCTAs progressLabel="📈 View Level Progress" onProgress={() => onBack("user")} onBenefits={() => setTab("benefits")}
            gradient="linear-gradient(135deg,#A855F7,#C084FC)" shadow="0 6px 20px rgba(168,85,247,0.3)" />
        </div>
      )}
      {tab === "earn" && <GuideXPList title="How to Increase User Level" sources={XP_SOURCES} bgColor="#F5F3FF" />}
      {tab === "benefits" && <GuideBenefitGrid title="User Level Benefits" benefits={BENEFITS} bgColor="#F5F3FF" borderColor="1px solid #A855F722" />}
    </div>
  );
}

/* ─── Host Level Guide ─── */
export function HostLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");
  const XP_SOURCES = [
    { icon: "🎁", name: "Gifts Received During Streams" }, { icon: "📺", name: "Hosting Live Streams" },
    { icon: "🎉", name: "Party Room Hosting" }, { icon: "👥", name: "Viewer Engagement" },
    { icon: "⏱️", name: "Audience Retention" }, { icon: "⚔️", name: "PK Battles Participation" },
    { icon: "🏆", name: "Event Rankings" }, { icon: "✅", name: "Daily Host Missions" },
    { icon: "📈", name: "Stream Performance" },
  ];
  const BENEFITS = [
    { icon: "⭐", name: "Featured Host Placement" }, { icon: "🏠", name: "Homepage Promotion" },
    { icon: "✅", name: "Verified Host Badge" }, { icon: "✨", name: "Premium Broadcast Effects" },
    { icon: "🖼️", name: "Exclusive Host Frames" }, { icon: "📡", name: "Higher Discovery Ranking" },
    { icon: "🎟️", name: "Priority Event Access" }, { icon: "📊", name: "Advanced Analytics" },
    { icon: "🛟", name: "Priority Support" },
  ];
  const STATES = [
    { label: "New Host",    state: "Level 1",           color: "#9CA3AF" },
    { label: "Active Host", state: "Progressing",       color: "#F59E0B" },
    { label: "Top Host",    state: "Advanced Level",    color: "#A855F7" },
    { label: "Max Host",    state: "Level 300 Reached", color: "#FFC83D" },
  ];
  return (
    <div style={{ padding: "14px" }}>
      <GuideHero emoji="🎙️" title="Host Level Guide" maxLevel={300}
        description="Host Level measures your performance and success as a host on VYRO Live Connect."
        gradient="linear-gradient(135deg,#0D1B3E,#F59E0B)" shadow="0 8px 28px rgba(245,158,11,0.3)" />
      <GuideTabs tab={tab} setTab={setTab} accentColor="#F59E0B" />
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <GuideStates label="Host States" states={STATES} />
          <GuideCTAs progressLabel="📈 View Host Progress" onProgress={() => onBack("host")} onBenefits={() => setTab("benefits")}
            gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" shadow="0 6px 20px rgba(245,158,11,0.3)" />
        </div>
      )}
      {tab === "earn" && <GuideXPList title="How to Increase Host Level" sources={XP_SOURCES} bgColor="#FFFBEB" />}
      {tab === "benefits" && <GuideBenefitGrid title="Host Level Benefits" benefits={BENEFITS} bgColor="#FFFBEB" borderColor="1px solid #F59E0B22" />}
    </div>
  );
}

/* ─── Gifting Level Guide ─── */
export function GiftingLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");
  const XP_SOURCES = [
    { icon: "🎁", name: "Sending Gifts in Live Streams" }, { icon: "🎉", name: "Sending Gifts in Party Rooms" },
    { icon: "🏆", name: "Sending Event Gifts" }, { icon: "💎", name: "Sending Premium Gifts" },
    { icon: "⚔️", name: "Participating in PK Battle Gifting" },
  ];
  const BENEFITS = [
    { icon: "🖼️", name: "Luxury Profile Frames" }, { icon: "🏅", name: "Animated Sender Badge" },
    { icon: "✨", name: "Premium Gift Effects" }, { icon: "🎁", name: "Exclusive Gifts Access" },
    { icon: "📢", name: "Gift Broadcast Priority" }, { icon: "💫", name: "VIP Name Glow" },
    { icon: "🌟", name: "Luxury Entrance Effects" }, { icon: "👑", name: "Elite Gifter Recognition" },
  ];
  const STATES = [
    { label: "New Gifter",    state: "Level 1",                color: "#9CA3AF" },
    { label: "Active Gifter", state: "Progressing",            color: "#EC4899" },
    { label: "Elite Gifter",  state: "Advanced Gifting Level", color: "#A855F7" },
    { label: "Max Level",     state: "Level 200 Reached",      color: "#FFC83D" },
  ];
  return (
    <div style={{ padding: "14px" }}>
      <GuideHero emoji="🎁" title="Gifting Level Guide" maxLevel={200}
        description="Gifting Level represents your support for creators, hosts, and the VYRO community through gifting."
        gradient="linear-gradient(135deg,#0D1B3E,#EC4899)" shadow="0 8px 28px rgba(236,72,153,0.3)" />
      <GuideTabs tab={tab} setTab={setTab} accentColor="#EC4899" />
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <GuideStates label="Gifter States" states={STATES} />
          <GuideCTAs progressLabel="📈 View Gifting Progress" onProgress={() => onBack("gifting")} onBenefits={() => setTab("benefits")}
            gradient="linear-gradient(135deg,#EC4899,#F472B6)" shadow="0 6px 20px rgba(236,72,153,0.3)" />
        </div>
      )}
      {tab === "earn" && <GuideXPList title="How to Increase Gifting Level" sources={XP_SOURCES} bgColor="#FDF2F8" />}
      {tab === "benefits" && <GuideBenefitGrid title="Gifting Level Benefits" benefits={BENEFITS} bgColor="#FDF2F8" borderColor="1px solid #EC489922" />}
    </div>
  );
}

/* ─── Streaming Level Guide ─── */
export function StreamingLevelGuide({ onBack }) {
  const [tab, setTab] = useState("overview");
  const XP_SOURCES = [
    { icon: "🎁", name: "Gifts Received" }, { icon: "👥", name: "Viewer Count" },
    { icon: "⏱️", name: "Watch Time" }, { icon: "❤️", name: "Likes Received" },
    { icon: "🔗", name: "Shares Received" }, { icon: "💬", name: "Audience Engagement" },
    { icon: "🔥", name: "Room Popularity" }, { icon: "🏆", name: "Event Participation" },
    { icon: "📺", name: "Stream Activity" },
  ];
  const BENEFITS = [
    { icon: "🚀", name: "Discovery Boost" }, { icon: "📈", name: "Trending Placement" },
    { icon: "⭐", name: "Featured Stream Placement" }, { icon: "✨", name: "Premium Stream Decorations" },
    { icon: "🎨", name: "Exclusive Room Themes" }, { icon: "🎟️", name: "Event Priority Access" },
    { icon: "📡", name: "Enhanced Visibility" }, { icon: "🏅", name: "Stream Achievement Rewards" },
  ];
  const STATES = [
    { label: "New Streamer",     state: "Level 1",                   color: "#9CA3AF" },
    { label: "Active Streamer",  state: "Progressing",               color: "#06B6D4" },
    { label: "Popular Streamer", state: "Advanced Streaming Level",  color: "#A855F7" },
    { label: "Max Level",        state: "Level 200 Reached",         color: "#FFC83D" },
  ];
  return (
    <div style={{ padding: "14px" }}>
      <GuideHero emoji="📡" title="Streaming Level Guide" maxLevel={200}
        description="Streaming Level measures the popularity and performance of your stream, room, or live session."
        gradient="linear-gradient(135deg,#0D1B3E,#06B6D4)" shadow="0 8px 28px rgba(6,182,212,0.3)" />
      <GuideTabs tab={tab} setTab={setTab} accentColor="#06B6D4" />
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <GuideStates label="Streamer States" states={STATES} />
          <GuideCTAs progressLabel="📈 View Streaming Progress" onProgress={() => onBack("streaming")} onBenefits={() => setTab("benefits")}
            gradient="linear-gradient(135deg,#06B6D4,#22D3EE)" shadow="0 6px 20px rgba(6,182,212,0.3)" />
        </div>
      )}
      {tab === "earn" && <GuideXPList title="How to Increase Streaming Level" sources={XP_SOURCES} bgColor="#ECFEFF" />}
      {tab === "benefits" && <GuideBenefitGrid title="Streaming Level Benefits" benefits={BENEFITS} bgColor="#ECFEFF" borderColor="1px solid #06B6D422" />}
    </div>
  );
}

/* ─── Level System Rules ─── */
const LEVEL_RULES = [
  { icon: "👤", color: "#A855F7", title: "User Level",      desc: "Increases through overall platform activity, engagement, participation, and gifting behavior." },
  { icon: "🎙️", color: "#F59E0B", title: "Host Level",      desc: "Increases through hosting performance, audience growth, stream quality, and gifts received." },
  { icon: "🎁", color: "#EC4899", title: "Gifting Level",   desc: "Increases only through sending gifts and supporting other users." },
  { icon: "📡", color: "#06B6D4", title: "Streaming Level", desc: "Increases through stream popularity, audience engagement, and gifts received during streams." },
];

const ULTIMATE_REWARDS = [
  { level: "100+", color: "#A855F7", rewards: ["Animated Profile Frame", "Premium Chat Bubble", "Entrance Effect"] },
  { level: "200+", color: "#EC4899", rewards: ["3D Animated Badge", "Aura Effect", "Exclusive Theme"] },
  { level: "250+", color: "#F59E0B", rewards: ["Golden Wings Entrance", "Premium Username Glow", "VIP Support Priority"] },
  { level: "300",  color: "#FFC83D", rewards: ["Mythic 3D Animated Crown", "Cosmic Aura Effect", "Global Broadcast Banner", "Legendary Entrance Animation", "Exclusive Profile Theme", "Limited Edition Gifts", "Elite Platform Recognition"] },
];

const LEVEL_ICONS = {
  "👤 User":      ["Bronze Crystal","Silver Crystal","Gold Crystal","Platinum Crystal","Diamond Crystal","Sapphire Crown","Ruby Crown","Galaxy Crown"],
  "🎙️ Host":     ["Bronze Microphone","Silver Microphone","Gold Microphone","Platinum Stage","Diamond Stage","Royal Stage","Galaxy Stage"],
  "🎁 Gifting":  ["Bronze Gift Box","Silver Gift Box","Gold Gift Box","Diamond Gift Box","Royal Treasure Chest","Mythic Treasure"],
  "📡 Streaming":["Bronze Broadcast Tower","Silver Broadcast Tower","Gold Broadcast Tower","Diamond Broadcast Tower","Galaxy Broadcast Tower"],
};

export function LevelSystemRules({ onNavigate }) {
  const [tab, setTab] = useState("rules");

  return (
    <div style={{ padding: "14px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#7C3AED,#EC4899)", borderRadius: 20, padding: "22px 20px", marginBottom: 14, boxShadow: "0 8px 28px rgba(124,58,237,0.35)" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📜</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Level System Rules</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.7 }}>
          Understand how each of the 4 independent level systems works and what rewards await you.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["rules", "example", "icons", "rewards"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "7px 2px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#7C3AED" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "rules" ? "Rules" : t === "example" ? "Example" : t === "icons" ? "Icons" : "Rewards"}
          </button>
        ))}
      </div>

      {/* Rules Tab */}
      {tab === "rules" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LEVEL_RULES.map((r, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", display: "flex", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: r.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: r.color, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            </div>
          ))}
          {/* Independent systems note */}
          <div style={{ background: "#F0FDF4", borderRadius: 14, padding: "12px 14px", border: "1px solid #86EFAC" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#16A34A", marginBottom: 4 }}>✅ Independent Systems</div>
            <div style={{ fontSize: 11, color: "#15803D", lineHeight: 1.6 }}>
              All 4 level systems are fully independent. A user can hold different levels in each system simultaneously — e.g. User Lv.120, Host Lv.85, Gifting Lv.60, Streaming Lv.45.
            </div>
          </div>
        </div>
      )}

      {/* Example Tab */}
      {tab === "example" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Multi-level example */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>👤 Example User Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: "👤", label: "User Level",      value: 120, color: "#A855F7" },
                { icon: "🎙️", label: "Host Level",      value: 85,  color: "#F59E0B" },
                { icon: "🎁", label: "Gifting Level",   value: 60,  color: "#EC4899" },
                { icon: "📡", label: "Streaming Level", value: 45,  color: "#06B6D4" },
              ].map((l, i) => (
                <div key={i} style={{ background: l.color + "10", borderRadius: 12, padding: "12px", border: `1px solid ${l.color}22`, textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{l.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: l.color, lineHeight: 1.1 }}>{l.value}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{l.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario A */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 10 }}>🎯 Scenario: User Activity</div>
            {["Sends gifts worth 1,000,000 coins","Completes daily missions","Joins party rooms","Participates in events"].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#A855F7", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#374151" }}>{a}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "10px", borderRadius: 10, background: "#F5F3FF" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", marginBottom: 4 }}>✅ Result:</div>
              {["User Level increases ↑", "Gifting Level increases ↑"].map((r, i) => (
                <div key={i} style={{ fontSize: 11, color: "#5B21B6" }}>• {r}</div>
              ))}
            </div>
          </div>

          {/* Scenario B */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 10 }}>🎯 Scenario: Host Activity</div>
            {["Receives gifts during stream","Gains new viewers","Maintains audience engagement"].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#374151" }}>{a}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "10px", borderRadius: 10, background: "#FFFBEB" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#D97706", marginBottom: 4 }}>✅ Result:</div>
              {["Host Level increases ↑", "Streaming Level increases ↑"].map((r, i) => (
                <div key={i} style={{ fontSize: 11, color: "#92400E" }}>• {r}</div>
              ))}
            </div>
          </div>

          <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "12px 14px", border: "1px solid #BFDBFE" }}>
            <div style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 700, lineHeight: 1.6 }}>
              ℹ️ All four level systems are independent and progress separately based on different activities.
            </div>
          </div>
        </div>
      )}

      {/* Icons Tab */}
      {tab === "icons" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(LEVEL_ICONS).map(([system, icons]) => (
            <div key={system} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 10 }}>{system} Level Icons</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {icons.map((icon, i) => (
                  <div key={i} style={{ padding: "5px 10px", borderRadius: 10, background: "#F5F7FA", border: "1px solid #E5E7EB", fontSize: 11, fontWeight: 700, color: "#374151" }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards Tab */}
      {tab === "rewards" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ULTIMATE_REWARDS.map((tier, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "16px", border: `1px solid ${tier.color}33`, boxShadow: i === ULTIMATE_REWARDS.length - 1 ? `0 4px 20px ${tier.color}22` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ padding: "4px 14px", borderRadius: 20, background: tier.color + "18", fontSize: 13, fontWeight: 900, color: tier.color }}>
                  Level {tier.level}
                </div>
                {i === ULTIMATE_REWARDS.length - 1 && (
                  <div style={{ padding: "4px 10px", borderRadius: 20, background: "#FEF3C7", fontSize: 10, fontWeight: 800, color: "#D97706" }}>
                    👑 ULTIMATE
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {tier.rewards.map((r, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: tier.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}