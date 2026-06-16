/**
 * SocialRelationship — Relationship Center
 * Access: Profile > More Services > Social > Relationship
 * Theme: Pink & Purple Gradient · Glassmorphism · Premium Dark
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X, Heart, MessageCircle, Gift, Shield, Flag, UserX } from "lucide-react";

/* ─── Mock Data ─── */
const MY_RELATIONSHIP = {
  id: "R-2024-001",
  partner: { name: "Layla Stars", id: "#VY-8821", country: "🇶🇦", avatar: "💗", level: 48, online: true },
  startDate: "2026-03-14",
  duration: "3 months, 2 days",
  status: "Active",
};

const INCOMING_REQUESTS = [
  { id: 1, name: "Nour Al-Rashid", uid: "#VY-4421", country: "🇸🇦", avatar: "🌸", level: 32, date: "June 16", time: "2h ago" },
  { id: 2, name: "Sara Moon",      uid: "#VY-7731", country: "🇦🇪", avatar: "🌙", level: 21, date: "June 15", time: "1d ago" },
];

const SENT_REQUESTS = [
  { id: 3, name: "Rina Bloom", uid: "#VY-5512", country: "🇪🇬", avatar: "🌺", level: 27, date: "June 14", status: "Pending" },
];

const DISCOVER_USERS = [
  { id: 10, name: "Hana Violet",   uid: "#VY-3310", country: "🇶🇦", avatar: "💜", level: 55, online: true  },
  { id: 11, name: "Mira Rose",     uid: "#VY-6621", country: "🇸🇦", avatar: "🌹", level: 41, online: true  },
  { id: 12, name: "Dina Stars",    uid: "#VY-2287", country: "🇦🇪", avatar: "⭐", level: 36, online: false },
  { id: 13, name: "Lana Pearl",    uid: "#VY-9934", country: "🇯🇴", avatar: "🤍", level: 29, online: true  },
  { id: 14, name: "Yasmin Gold",   uid: "#VY-1145", country: "🇰🇼", avatar: "✨", level: 62, online: false },
  { id: 15, name: "Aya Crystal",   uid: "#VY-8873", country: "🇲🇦", avatar: "💎", level: 44, online: true  },
];

const HISTORY = [
  { id: 1, type: "ended",    name: "Reem Stars",    uid: "#VY-2241", date: "Jan 2026",  note: "Relationship Ended"     },
  { id: 2, type: "rejected", name: "Nadia Moon",    uid: "#VY-3312", date: "Nov 2025",  note: "Request Rejected"       },
  { id: 3, type: "accepted", name: "Layla Stars",   uid: "#VY-8821", date: "Mar 2026",  note: "Request Accepted ✅"    },
  { id: 4, type: "sent",     name: "Sara Bloom",    uid: "#VY-5543", date: "Feb 2026",  note: "Request Sent"           },
];

const HISTORY_COLORS = { ended: "#EF4444", rejected: "#9CA3AF", accepted: "#10B981", sent: "#A855F7" };

const TABS = [
  { id: "overview",    label: "Overview",    icon: "💗" },
  { id: "discover",   label: "Discover",    icon: "🔍" },
  { id: "requests",   label: "Requests",    icon: "📨" },
  { id: "history",    label: "History",     icon: "📋" },
  { id: "safety",     label: "Safety",      icon: "🛡️" },
];

/* ─── Shared Avatar ─── */
function Avatar({ emoji, size = 48, online }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.28, background: "linear-gradient(135deg,#EC4899,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.44, border: "2px solid rgba(255,255,255,0.2)" }}>{emoji}</div>
      {online !== undefined && <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: online ? "#10B981" : "#9CA3AF", border: "2px solid #fff" }} />}
    </div>
  );
}

/* ─── Glass Card ─── */
function GlassCard({ children, style = {}, onClick }) {
  return (
    <motion.div whileTap={onClick ? { scale: 0.98 } : {}} onClick={onClick}
      style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.12)", ...style }}>
      {children}
    </motion.div>
  );
}

/* ─── Action Button ─── */
function Btn({ label, color, icon, onClick, small }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 5, padding: small ? "6px 12px" : "8px 16px", borderRadius: 12, fontSize: small ? 10 : 11, fontWeight: 800, background: color, color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>
      {icon && <span style={{ fontSize: small ? 11 : 13 }}>{icon}</span>}
      {label}
    </motion.button>
  );
}

/* ══════════════ OVERVIEW TAB ══════════════ */
function OverviewTab({ setTab }) {
  const [showEnd, setShowEnd] = useState(false);
  const rel = MY_RELATIONSHIP;

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Active Relationship Card */}
      <GlassCard style={{ padding: 18, background: "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(139,92,246,0.25))", border: "1px solid rgba(236,72,153,0.3)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", marginBottom: 12, letterSpacing: "0.06em" }}>💗 ACTIVE RELATIONSHIP</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <Avatar emoji={rel.partner.avatar} size={58} online={rel.partner.online} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 3 }}>{rel.partner.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{rel.partner.id} · LV{rel.partner.level} · {rel.partner.country}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#10B981" }}>Active</span>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {[{ l: "Start Date", v: rel.startDate }, { l: "Duration", v: rel.duration }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 12px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{s.l}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn label="Open Chat"     color="linear-gradient(135deg,#1F6BFF,#06B6D4)" icon="💬" />
          <Btn label="View Profile"  color="rgba(255,255,255,0.15)"                  icon="👤" />
          <Btn label="Send Gift"     color="linear-gradient(135deg,#EC4899,#A855F7)" icon="🎁" />
          <Btn label="End"           color="rgba(239,68,68,0.3)"                     icon="💔" onClick={() => setShowEnd(true)} />
        </div>
      </GlassCard>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { icon: "📨", label: "Incoming",   value: INCOMING_REQUESTS.length, color: "#EC4899" },
          { icon: "📤", label: "Sent",        value: SENT_REQUESTS.length,    color: "#A855F7" },
          { icon: "📋", label: "History",     value: HISTORY.length,           color: "#8B5CF6" },
        ].map(s => (
          <GlassCard key={s.label} style={{ padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* System Rules */}
      <GlassCard style={{ padding: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", marginBottom: 10, letterSpacing: "0.06em" }}>📜 SYSTEM RULES</div>
        {["One active relationship per user", "User-to-user approval only", "Blocked users cannot send requests", "Fake accounts are not allowed", "Reported accounts may be restricted"].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <span style={{ fontSize: 12 }}>✅</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{r}</span>
          </div>
        ))}
      </GlassCard>

      {/* End Relationship Confirm */}
      <AnimatePresence>
        {showEnd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setShowEnd(false)}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} onClick={e => e.stopPropagation()}
              style={{ background: "linear-gradient(135deg,#1a0a2e,#2d1155)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 320, border: "1px solid rgba(236,72,153,0.3)" }}>
              <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>💔</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 8 }}>End Relationship?</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textAlign: "center", marginBottom: 20, lineHeight: 1.6 }}>This action cannot be undone. Your relationship with {rel.partner.name} will be ended.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowEnd(false)} style={{ flex: 1, padding: "11px", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setShowEnd(false)} style={{ flex: 1, padding: "11px", borderRadius: 12, background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>End</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════ DISCOVER TAB ══════════════ */
function DiscoverTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Online", "Recommended"];

  const filtered = DISCOVER_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.uid.includes(search);
    const matchFilter = filter === "All" || (filter === "Online" && u.online) || filter === "Recommended";
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Search */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Search size={14} color="rgba(255,255,255,0.4)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by username or ID…"
          style={{ border: "none", outline: "none", fontSize: 13, color: "#fff", background: "transparent", flex: 1 }} />
        {search && <X size={14} color="rgba(255,255,255,0.4)" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: 8 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale: 0.92 }} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: filter === f ? "linear-gradient(135deg,#EC4899,#8B5CF6)" : "rgba(255,255,255,0.08)", color: filter === f ? "#fff" : "rgba(255,255,255,0.55)" }}>
            {f}
          </motion.button>
        ))}
      </div>

      {/* User Cards */}
      {filtered.map((u, i) => (
        <motion.div key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <GlassCard style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar emoji={u.avatar} size={48} online={u.online} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{u.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{u.uid} · LV{u.level} · {u.country}</div>
              </div>
              {u.online && <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 10, background: "rgba(16,185,129,0.2)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}>Online</span>}
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              <Btn label="View Profile"    color="rgba(255,255,255,0.12)"                  small />
              <Btn label="Follow"          color="rgba(31,107,255,0.6)"                    small />
              <Btn label="Message"         color="rgba(6,182,212,0.5)"                     small />
              <Btn label="❤️ Request"      color="linear-gradient(135deg,#EC4899,#8B5CF6)" small />
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

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Sub Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {[{ id: "incoming", label: `Incoming (${INCOMING_REQUESTS.length})` }, { id: "sent", label: `Sent (${SENT_REQUESTS.length})` }].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.93 }} onClick={() => setSubTab(t.id)}
            style={{ flex: 1, padding: "9px", borderRadius: 12, fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", background: subTab === t.id ? "linear-gradient(135deg,#EC4899,#8B5CF6)" : "rgba(255,255,255,0.08)", color: subTab === t.id ? "#fff" : "rgba(255,255,255,0.5)" }}>
            {t.label}
          </motion.button>
        ))}
      </div>

      {subTab === "incoming" && (
        INCOMING_REQUESTS.filter(r => !dismissed.includes(r.id)).length === 0
          ? <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No incoming requests</div>
          : INCOMING_REQUESTS.filter(r => !dismissed.includes(r.id)).map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard style={{ padding: "14px 16px", background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Avatar emoji={req.avatar} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{req.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{req.uid} · LV{req.level} · {req.country}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>Sent {req.date} · {req.time}</div>
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
        SENT_REQUESTS.length === 0
          ? <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No sent requests</div>
          : SENT_REQUESTS.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard style={{ padding: "14px 16px", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Avatar emoji={req.avatar} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{req.name}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{req.uid} · LV{req.level} · {req.country}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>Sent {req.date}</div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 10, background: "rgba(245,158,11,0.2)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>{req.status}</span>
                </div>
                <Btn label="Cancel Request" color="rgba(239,68,68,0.25)" small />
              </GlassCard>
            </motion.div>
          ))
      )}
    </div>
  );
}

/* ══════════════ HISTORY TAB ══════════════ */
function HistoryTab() {
  const [filter, setFilter] = useState("all");
  const types = ["all", "sent", "accepted", "rejected", "ended"];
  const filtered = filter === "all" ? HISTORY : HISTORY.filter(h => h.type === filter);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {types.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.92 }} onClick={() => setFilter(t)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 16, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", textTransform: "capitalize", background: filter === t ? "linear-gradient(135deg,#EC4899,#8B5CF6)" : "rgba(255,255,255,0.08)", color: filter === t ? "#fff" : "rgba(255,255,255,0.5)" }}>
            {t}
          </motion.button>
        ))}
      </div>

      {filtered.map((h, i) => (
        <motion.div key={h.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <GlassCard style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${HISTORY_COLORS[h.type]}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {h.type === "ended" ? "💔" : h.type === "rejected" ? "❌" : h.type === "accepted" ? "💗" : "📤"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{h.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{h.uid} · {h.date}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 10, background: `${HISTORY_COLORS[h.type]}18`, color: HISTORY_COLORS[h.type], flexShrink: 0 }}>{h.note}</span>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ SAFETY TAB ══════════════ */
function SafetyTab() {
  const items = [
    { icon: <Flag size={18} color="#EF4444" />,     label: "Report User",           desc: "Report inappropriate behavior", color: "#EF4444" },
    { icon: <UserX size={18} color="#F59E0B" />,    label: "Block User",            desc: "Block someone from contacting you", color: "#F59E0B" },
    { icon: <UserX size={18} color="#10B981" />,    label: "Unblock User",          desc: "Remove a user from your blocklist", color: "#10B981" },
    { icon: <Shield size={18} color="#1F6BFF" />,   label: "Safety Guidelines",     desc: "Read platform safety policies", color: "#1F6BFF" },
    { icon: <Shield size={18} color="#8B5CF6" />,   label: "Community Standards",   desc: "Our community standards & values", color: "#8B5CF6" },
  ];

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <GlassCard style={{ padding: "14px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#EC4899", marginBottom: 6 }}>🛡️ Safety & Reporting</div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
          Keep your relationships safe. Use these tools to report or block users who violate community guidelines. All reports are reviewed by our moderation team.
        </p>
      </GlassCard>

      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <GlassCard style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => {}}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
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

/* ══════════════ MAIN EXPORT ══════════════ */
export default function SocialRelationship() {
  const [activeTab, setActiveTab] = useState("overview");

  const PANELS = {
    overview: <OverviewTab setTab={setActiveTab} />,
    discover: <DiscoverTab />,
    requests: <RequestsTab />,
    history:  <HistoryTab />,
    safety:   <SafetyTab />,
  };

  return (
    <div style={{ minHeight: "100%", background: "linear-gradient(160deg, #0D0520 0%, #1a0838 50%, #0d1b3e 100%)", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>

      {/* Hero Header */}
      <div style={{ padding: "20px 16px 0", background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          {/* Animated heart icon */}
          <motion.div animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 0 rgba(236,72,153,0)", "0 0 18px 6px rgba(236,72,153,0.4)", "0 0 0 0 rgba(236,72,153,0)"] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#EC4899,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }}>
            💗
          </motion.div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>Relationship Center</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Connect · Manage · Stay Safe</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#EC4899" }}>❤️ Active</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>1 relationship</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flexShrink: 0, padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", fontWeight: 800, fontSize: 11, color: activeTab === t.id ? "#EC4899" : "rgba(255,255,255,0.45)", borderBottom: activeTab === t.id ? "2px solid #EC4899" : "2px solid transparent", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {PANELS[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}