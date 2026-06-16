/**
 * SocialFamily — Family Center
 * Access: Profile > More Services > Social > Family
 * Theme: Royal Blue · Premium Gold · Dark Purple · Glassmorphism
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

/* ─── Mock Data ─── */
const MY_FAMILY = {
  id: "FAM-8821", name: "Royal Eagles", logo: "🦅",
  level: 12, rank: "#48", members: 24, maxMembers: 50,
  country: "🇶🇦", created: "Jan 2026", xp: 48200, xpNext: 60000,
};

const FAMILY_MEMBERS = [
  { id: 1, name: "You",            role: "Founder",    avatar: "👑", level: 65, country: "🇶🇦", online: true  },
  { id: 2, name: "Layla Stars",    role: "Co-Founder", avatar: "💗", level: 48, country: "🇸🇦", online: true  },
  { id: 3, name: "Nour Al-Rashid", role: "Admin",      avatar: "🌸", level: 39, country: "🇦🇪", online: false },
  { id: 4, name: "Hana Violet",    role: "Elder",      avatar: "💜", level: 33, country: "🇶🇦", online: true  },
  { id: 5, name: "Mira Rose",      role: "Member",     avatar: "🌹", level: 27, country: "🇸🇦", online: false },
  { id: 6, name: "Dina Stars",     role: "Member",     avatar: "⭐", level: 22, country: "🇪🇬", online: true  },
];

const INCOMING_REQUESTS = [
  { id: 1, name: "Sara Moon",   uid: "#VY-7731", country: "🇦🇪", avatar: "🌙", level: 21, time: "2h ago" },
  { id: 2, name: "Aya Crystal", uid: "#VY-8873", country: "🇲🇦", avatar: "💎", level: 18, time: "5h ago" },
];

const DISCOVER_FAMILIES = [
  { id: 1, name: "Phoenix Kings",  logo: "🦅", level: 18, members: 42, country: "🇸🇦", rank: "#12", type: "Public"  },
  { id: 2, name: "Diamond Queens", logo: "💎", level: 15, members: 38, country: "🇦🇪", rank: "#28", type: "Public"  },
  { id: 3, name: "Golden Lions",   logo: "🦁", level: 22, members: 50, country: "🇶🇦", rank: "#7",  type: "Private" },
  { id: 4, name: "Sapphire Stars", logo: "🌟", level: 9,  members: 19, country: "🇪🇬", rank: "#84", type: "Public"  },
  { id: 5, name: "Crimson Wolves", logo: "🐺", level: 11, members: 27, country: "🇯🇴", rank: "#61", type: "Public"  },
];

const ACHIEVEMENTS = [
  { name: "Family Founded",  icon: "🏛️", color: "#F59E0B", unlocked: true,  desc: "Create your first family"        },
  { name: "10 Members",      icon: "👥", color: "#1F6BFF", unlocked: true,  desc: "Reach 10 family members"         },
  { name: "25 Members",      icon: "🌟", color: "#A855F7", unlocked: false, desc: "Reach 25 family members"         },
  { name: "Level 10 Family", icon: "⬆️", color: "#10B981", unlocked: true,  desc: "Reach family level 10"           },
  { name: "Top 50 Family",   icon: "🏆", color: "#F59E0B", unlocked: true,  desc: "Enter top 50 family ranking"     },
  { name: "Top 10 Family",   icon: "👑", color: "#F59E0B", unlocked: false, desc: "Enter top 10 family ranking"     },
  { name: "First Event Win", icon: "🥇", color: "#EC4899", unlocked: false, desc: "Win a family event"              },
  { name: "50 Members",      icon: "🌍", color: "#0EA5E9", unlocked: false, desc: "Reach maximum family size"       },
];

const EVENTS = [
  { name: "Weekly Family Battle",   status: "active",   reward: "5,000 XP",  ends: "2d",  icon: "⚔️", color: "#EF4444" },
  { name: "Gift Contribution Rush", status: "active",   reward: "3,000 XP",  ends: "1d",  icon: "🎁", color: "#EC4899" },
  { name: "Summer Family Games",    status: "upcoming", reward: "10,000 XP", ends: "4d",  icon: "☀️", color: "#F59E0B" },
  { name: "Monthly Champions",      status: "upcoming", reward: "8,000 XP",  ends: "10d", icon: "🏆", color: "#A855F7" },
];

const ROLE_COLORS = { Founder: "#F59E0B", "Co-Founder": "#A855F7", Admin: "#1F6BFF", Elder: "#10B981", Member: "#9CA3AF" };

const TABS = [
  { id: "overview",     label: "Overview",  icon: "🏠" },
  { id: "members",      label: "Members",   icon: "👥" },
  { id: "requests",     label: "Requests",  icon: "📨" },
  { id: "discover",     label: "Discover",  icon: "🔍" },
  { id: "events",       label: "Events",    icon: "🎉" },
  { id: "achievements", label: "Awards",    icon: "🏆" },
  { id: "safety",       label: "Safety",    icon: "🛡️" },
];

/* ─── Shared ─── */
function GlassCard({ children, style = {}, onClick }) {
  return (
    <motion.div whileTap={onClick ? { scale: 0.98 } : {}} onClick={onClick}
      style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", ...style }}>
      {children}
    </motion.div>
  );
}

function Btn({ label, color, small, onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick}
      style={{ padding: small ? "6px 12px" : "8px 16px", borderRadius: 11, fontSize: small ? 10 : 11, fontWeight: 800, background: color, color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>
      {label}
    </motion.button>
  );
}

function SLabel({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.35)", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>;
}

function MemberAvatar({ emoji, size = 44, online }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "linear-gradient(135deg,#1F6BFF,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.44, border: "2px solid rgba(255,255,255,0.15)" }}>{emoji}</div>
      {online !== undefined && <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: online ? "#10B981" : "#4B5563", border: "2px solid #0d0b2b" }} />}
    </div>
  );
}

/* ══════════════ OVERVIEW TAB ══════════════ */
function OverviewTab({ setTab }) {
  const pct = Math.round((MY_FAMILY.xp / MY_FAMILY.xpNext) * 100);
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
      <GlassCard style={{ padding: 18, background: "linear-gradient(135deg,rgba(31,107,255,0.25),rgba(139,92,246,0.25))", border: "1px solid rgba(31,107,255,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(245,158,11,0)", "0 0 20px 6px rgba(245,158,11,0.35)", "0 0 0 0 rgba(245,158,11,0)"] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#1F6BFF,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "2px solid rgba(245,158,11,0.4)", flexShrink: 0 }}>
            {MY_FAMILY.logo}
          </motion.div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{MY_FAMILY.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>ID: #{MY_FAMILY.id} · {MY_FAMILY.country} · Since {MY_FAMILY.created}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>👑 Founder</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(16,185,129,0.2)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}>● Active</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#F59E0B" }}>LV{MY_FAMILY.level}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Rank {MY_FAMILY.rank}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[
            { l: "Members", v: `${MY_FAMILY.members}/${MY_FAMILY.maxMembers}`, icon: "👥" },
            { l: "Rank",    v: MY_FAMILY.rank,                                 icon: "🏆" },
            { l: "Level",   v: `LV${MY_FAMILY.level}`,                        icon: "⭐" },
          ].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px", textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Family XP</span>
            <span style={{ fontSize: 10, fontWeight: 900, color: "#F59E0B" }}>{MY_FAMILY.xp.toLocaleString()} / {MY_FAMILY.xpNext.toLocaleString()}</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
              style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#1F6BFF,#F59E0B)" }} />
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{pct}% to LV{MY_FAMILY.level + 1}</div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn label="👥 Members"  color="rgba(255,255,255,0.12)"                  onClick={() => setTab("members")} />
          <Btn label="✉️ Invite"   color="linear-gradient(135deg,#1F6BFF,#06B6D4)" />
          <Btn label="⚙️ Manage"   color="rgba(255,255,255,0.12)"                  />
          <Btn label="🚪 Leave"    color="rgba(239,68,68,0.25)"                    />
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 14 }}>
        <SLabel label="📜 FAMILY SYSTEM RULES" />
        {["One user can join only one family", "Founder has full control", "Admins can manage members", "Blocked users cannot join", "Community rules must be followed"].map((r, i, arr) => (
          <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <span style={{ fontSize: 11 }}>✅</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{r}</span>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}

/* ══════════════ MEMBERS TAB ══════════════ */
function MembersTab() {
  const [search, setSearch] = useState("");
  const filtered = FAMILY_MEMBERS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Search size={14} color="rgba(255,255,255,0.35)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…" style={{ border: "none", outline: "none", fontSize: 13, color: "#fff", background: "transparent", flex: 1 }} />
        {search && <X size={13} color="rgba(255,255,255,0.4)" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{filtered.length} members</div>
      {filtered.map((m, i) => (
        <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <GlassCard style={{ padding: "13px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MemberAvatar emoji={m.avatar} size={46} online={m.online} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{m.name}</span>
                  {m.id === 1 && <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 6, background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>You</span>}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 8, background: `${ROLE_COLORS[m.role]}18`, color: ROLE_COLORS[m.role] }}>{m.role}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>LV{m.level} · {m.country}</span>
                </div>
              </div>
              {m.id !== 1 && (
                <div style={{ display: "flex", gap: 5 }}>
                  <Btn label="View" color="rgba(255,255,255,0.1)" small />
                  <Btn label="⋯" color="rgba(255,255,255,0.07)" small />
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ REQUESTS TAB ══════════════ */
function RequestsTab() {
  const [subTab, setSubTab] = useState("incoming");
  const [dismissed, setDismissed] = useState([]);
  const visible = INCOMING_REQUESTS.filter(r => !dismissed.includes(r.id));

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[{ id: "incoming", label: `Incoming (${visible.length})` }, { id: "sent", label: "Sent (0)" }].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.93 }} onClick={() => setSubTab(t.id)}
            style={{ flex: 1, padding: "9px", borderRadius: 12, fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", background: subTab === t.id ? "linear-gradient(135deg,#1F6BFF,#8B5CF6)" : "rgba(255,255,255,0.08)", color: subTab === t.id ? "#fff" : "rgba(255,255,255,0.5)" }}>
            {t.label}
          </motion.button>
        ))}
      </div>

      {subTab === "incoming" && (
        visible.length === 0
          ? <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No pending requests</div>
          : visible.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard style={{ padding: "14px 16px", background: "rgba(31,107,255,0.08)", border: "1px solid rgba(31,107,255,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <MemberAvatar emoji={req.avatar} size={46} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{req.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{req.uid} · LV{req.level} · {req.country}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{req.time}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn label="✅ Accept" color="linear-gradient(135deg,#10B981,#059669)" onClick={() => setDismissed(d => [...d, req.id])} />
                  <Btn label="❌ Reject" color="rgba(239,68,68,0.3)" onClick={() => setDismissed(d => [...d, req.id])} />
                  <Btn label="View" color="rgba(255,255,255,0.1)" />
                </div>
              </GlassCard>
            </motion.div>
          ))
      )}
      {subTab === "sent" && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No sent requests</div>
      )}
    </div>
  );
}

/* ══════════════ DISCOVER TAB ══════════════ */
function DiscoverTab() {
  const [search, setSearch] = useState("");
  const filtered = DISCOVER_FAMILIES.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Search size={14} color="rgba(255,255,255,0.35)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search families…" style={{ border: "none", outline: "none", fontSize: 13, color: "#fff", background: "transparent", flex: 1 }} />
        {search && <X size={13} color="rgba(255,255,255,0.4)" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
      </div>
      {filtered.map((fam, i) => (
        <motion.div key={fam.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <GlassCard style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{fam.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{fam.name}</span>
                  <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 6, background: fam.type === "Public" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)", color: fam.type === "Public" ? "#10B981" : "#F59E0B" }}>{fam.type}</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>LV{fam.level} · {fam.members} members · {fam.country} · Rank {fam.rank}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <Btn label="View Profile"   color="rgba(255,255,255,0.1)" small />
              <Btn label="➕ Join"         color="linear-gradient(135deg,#1F6BFF,#8B5CF6)" small />
              <Btn label="Follow"         color="rgba(255,255,255,0.08)" small />
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ EVENTS TAB ══════════════ */
function EventsTab() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <SLabel label="🎉 FAMILY EVENTS" />
      {EVENTS.map((ev, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <GlassCard style={{ padding: "14px 16px", border: `1px solid ${ev.color}28` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ev.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{ev.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{ev.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 8, background: ev.status === "active" ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)", color: ev.status === "active" ? "#10B981" : "#F59E0B" }}>
                    {ev.status === "active" ? "🟢 Active" : "🟡 Upcoming"}
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Ends in {ev.ends}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: "#F59E0B" }}>{ev.reward}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Reward</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <Btn label={ev.status === "active" ? "Join Event" : "View"} color={ev.status === "active" ? "linear-gradient(135deg,#1F6BFF,#8B5CF6)" : "rgba(255,255,255,0.1)"} small />
              {ev.status === "active" && <Btn label="Claim Reward" color="rgba(245,158,11,0.25)" small />}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ ACHIEVEMENTS TAB ══════════════ */
function AchievementsTab() {
  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <GlassCard style={{ padding: 14, background: "linear-gradient(135deg,rgba(31,107,255,0.2),rgba(245,158,11,0.2))", border: "1px solid rgba(245,158,11,0.25)", marginBottom: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Total", v: ACHIEVEMENTS.length, icon: "🏆" }, { l: "Unlocked", v: unlocked, icon: "✅" }, { l: "Locked", v: ACHIEVEMENTS.length - unlocked, icon: "🔒" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </GlassCard>
      {ACHIEVEMENTS.map((a, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <GlassCard style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, border: `1px solid ${a.unlocked ? a.color + "28" : "rgba(255,255,255,0.06)"}`, opacity: a.unlocked ? 1 : 0.55 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{a.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{a.desc}</div>
            </div>
            {a.unlocked ? <Btn label="Claim" color={`${a.color}33`} small /> : <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>🔒</span>}
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ SAFETY TAB ══════════════ */
function SafetyTab() {
  const items = [
    { icon: "🚩", label: "Report Family",       desc: "Report a family for violations",   color: "#EF4444" },
    { icon: "👤", label: "Report Member",        desc: "Report a family member",           color: "#F59E0B" },
    { icon: "🚫", label: "Block User",           desc: "Block someone from your family",   color: "#A855F7" },
    { icon: "📜", label: "Family Rules",         desc: "View our family conduct rules",    color: "#1F6BFF" },
    { icon: "🛡️", label: "Community Guidelines", desc: "Read community guidelines",        color: "#10B981" },
  ];
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <GlassCard style={{ padding: 14, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#EF4444", marginBottom: 6 }}>🛡️ Family Safety</div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>Keep your family safe. Report violations and block disruptive members to maintain a healthy community environment.</p>
      </GlassCard>
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <GlassCard style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{item.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
            </div>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.2)" }}>›</span>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ CREATE FAMILY MODAL ══════════════ */
function CreateFamilyModal({ onClose }) {
  const [form, setForm] = useState({ name: "", description: "", country: "", privacy: "Public" });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "linear-gradient(160deg,#0d0b2b,#0d1b3e)", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "85vh", overflowY: "auto", paddingBottom: 32, border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", margin: "12px auto 0" }} />
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>🏠 Create Family</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: 14 }}>✕</button>
        </div>
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#1F6BFF,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 8px", border: "2px dashed rgba(255,255,255,0.25)", cursor: "pointer" }}>🦅</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Tap to upload logo</div>
          </div>
          {[{ label: "Family Name", key: "name", placeholder: "e.g. Royal Eagles" }, { label: "Description", key: "description", placeholder: "Brief family description…" }, { label: "Country", key: "country", placeholder: "e.g. Qatar 🇶🇦" }].map(f => (
            <div key={f.key}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{f.label}</div>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Privacy</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Public", "Private"].map(p => (
                <button key={p} onClick={() => setForm(prev => ({ ...prev, privacy: p }))}
                  style={{ flex: 1, padding: "9px", borderRadius: 10, fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", background: form.privacy === p ? "linear-gradient(135deg,#1F6BFF,#8B5CF6)" : "rgba(255,255,255,0.07)", color: form.privacy === p ? "#fff" : "rgba(255,255,255,0.45)" }}>
                  {p === "Public" ? "🌍 Public" : "🔒 Private"}
                </button>
              ))}
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#F59E0B)", color: "#fff", border: "none", fontWeight: 900, fontSize: 14, cursor: "pointer", marginTop: 4, boxShadow: "0 4px 16px rgba(31,107,255,0.35)" }}>
            🏠 Create Family
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════ MAIN EXPORT ══════════════ */
export default function SocialFamily() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);

  const PANELS = {
    overview:     <OverviewTab setTab={setActiveTab} />,
    members:      <MembersTab />,
    requests:     <RequestsTab />,
    discover:     <DiscoverTab />,
    events:       <EventsTab />,
    achievements: <AchievementsTab />,
    safety:       <SafetyTab />,
  };

  return (
    <div style={{ minHeight: "100%", background: "linear-gradient(160deg,#0d0b2b 0%,#0d1b3e 100%)", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>
      {/* Hero Header */}
      <div style={{ padding: "20px 16px 0", background: "linear-gradient(135deg,rgba(31,107,255,0.2),rgba(245,158,11,0.15))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <motion.div animate={{ boxShadow: ["0 0 0 0 rgba(245,158,11,0)", "0 0 18px 5px rgba(245,158,11,0.3)", "0 0 0 0 rgba(245,158,11,0)"] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, border: "1px solid rgba(245,158,11,0.3)" }}>
            {MY_FAMILY.logo}
          </motion.div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>Family Center</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{MY_FAMILY.name} · LV{MY_FAMILY.level} · {MY_FAMILY.members} members</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#F59E0B" }}>Rank {MY_FAMILY.rank}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{MY_FAMILY.country}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flexShrink: 0, padding: "10px 11px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 800, fontSize: 10, color: activeTab === t.id ? "#F59E0B" : "rgba(255,255,255,0.4)", borderBottom: activeTab === t.id ? "2px solid #F59E0B" : "2px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {PANELS[activeTab]}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>{showCreate && <CreateFamilyModal onClose={() => setShowCreate(false)} />}</AnimatePresence>
    </div>
  );
}