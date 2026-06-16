/**
 * MessagesCenter — Enterprise Communication Center
 * Access: Profile → More Services → Messages
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Bell, X } from "lucide-react";

/* ─── Mock message data ─── */
const MOCK_MESSAGES = {
  official_announcements: [
    { id: 1, title: "New Features Update", tag: "New Features Updates", time: "2h ago", read: false, pinned: true, body: "We've launched new gift animations, improved room discovery, and added 5 new languages to the platform." },
    { id: 2, title: "Scheduled Maintenance", tag: "Maintenance Notices", time: "1d ago", read: false, pinned: false, body: "Platform maintenance scheduled for June 18, 02:00–04:00 UTC. Some services may be temporarily unavailable." },
    { id: 3, title: "Summer Festival Campaign", tag: "Festival Announcements", time: "2d ago", read: true, pinned: false, body: "Join our Summer 2026 Festival — exclusive gifts, events, and leaderboard prizes await!" },
    { id: 4, title: "Privacy Policy Update", tag: "Policy Updates", time: "5d ago", read: true, pinned: false, body: "Our Privacy Policy has been updated effective July 1, 2026. Please review the changes." },
    { id: 5, title: "Security Advisory", tag: "Security Announcements", time: "1w ago", read: true, pinned: false, body: "We've enhanced account security. Enable 2FA to protect your account." },
  ],
  customer_support: [
    { id: 1, title: "Ticket #TK-2041 — Payment Issue", tag: "Payment Support", time: "3h ago", read: false, status: "Open", body: "Your ticket regarding the failed recharge has been received. Our team will respond within 24 hours." },
    { id: 2, title: "Ticket #TK-2038 — Account Access", tag: "Account Support", time: "1d ago", read: true, status: "Pending", body: "We need additional information to verify your identity. Please provide a valid government ID." },
    { id: 3, title: "Ticket #TK-2031 — App Crash", tag: "Technical Support", time: "3d ago", read: true, status: "Closed", body: "Your reported issue has been resolved in the latest app update (v2.4.1). Please update and confirm." },
    { id: 4, title: "Ticket #TK-2024 — Appeal Request", tag: "Appeal Requests", time: "1w ago", read: true, status: "Closed", body: "Your appeal has been reviewed. The restriction has been lifted. Thank you for your patience." },
  ],
  verification_center: [
    { id: 1, title: "Host Verification — Approved ✅", tag: "Verification Approval", time: "1d ago", read: false, status: "Approved", body: "Your host verification has been approved. You can now access all host features on the platform." },
    { id: 2, title: "KYC Document Request", tag: "Document Requests", time: "3d ago", read: true, status: "Pending", body: "Please submit a clear photo of your national ID or passport to complete KYC verification." },
    { id: 3, title: "Agency Verification Update", tag: "Agency Verification", time: "1w ago", read: true, status: "Under Review", body: "Your agency verification documents are under review. Expected processing time: 3–5 business days." },
  ],
  reports_violations: [
    { id: 1, title: "Warning Notice Issued", tag: "Warning Notices", time: "2d ago", read: false, status: "Action Required", body: "A warning has been issued on your account for content that violated our community guidelines." },
    { id: 2, title: "Report #RP-441 — Resolved", tag: "User Reports", time: "4d ago", read: true, status: "Resolved", body: "The report you submitted has been reviewed and action has been taken against the reported user." },
    { id: 3, title: "Appeal Decision — Accepted", tag: "Appeal Decisions", time: "1w ago", read: true, status: "Accepted", body: "Your appeal regarding the content restriction has been accepted. The restriction has been removed." },
  ],
  system_messages: [
    { id: 1, title: "New Login Detected", tag: "Login Alerts", time: "1h ago", read: false, body: "A new login was detected from Chrome, Qatar. If this wasn't you, secure your account immediately." },
    { id: 2, title: "Withdrawal Processed", tag: "Withdrawal Notifications", time: "6h ago", read: false, body: "Your withdrawal of 500 diamonds has been processed and sent to your registered PayPal account." },
    { id: 3, title: "Wallet Top-Up Successful", tag: "Deposit Notifications", time: "1d ago", read: true, body: "Your wallet has been topped up with 1,000 coins successfully." },
    { id: 4, title: "Earnings Milestone Reached", tag: "Earnings Notifications", time: "2d ago", read: true, body: "Congratulations! You've earned 10,000 diamonds this month. Check your host dashboard for details." },
    { id: 5, title: "System Status: All Clear", tag: "System Status Notifications", time: "3d ago", read: true, body: "All platform services are operating normally following the scheduled maintenance." },
  ],
};

const CATEGORIES = [
  { id: "official_announcements", name: "Official Announcements", icon: "📢", color: "#1F6BFF", bg: "#EEF2FF" },
  { id: "customer_support",       name: "Customer Support",       icon: "🎧", color: "#10B981", bg: "#ECFDF5" },
  { id: "verification_center",    name: "Verification Center",    icon: "✅", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "reports_violations",     name: "Reports & Violations",   icon: "⚠️", color: "#EF4444", bg: "#FEF2F2" },
  { id: "system_messages",        name: "System Messages",        icon: "🔔", color: "#8B5CF6", bg: "#F5F3FF" },
];

const STATUS_COLORS = {
  "Open": "#10B981", "Pending": "#F59E0B", "Closed": "#9CA3AF",
  "Approved": "#10B981", "Under Review": "#F59E0B", "Rejected": "#EF4444",
  "Action Required": "#EF4444", "Resolved": "#10B981", "Accepted": "#10B981",
};

/* ─── Message Detail Sheet ─── */
function MessageSheet({ msg, cat, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "80vh", overflowY: "auto", paddingBottom: 32 }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "12px auto 0" }} />
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 16px 12px", borderBottom: "1px solid #F0F0F8" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cat.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{msg.title}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{msg.tag} · {msg.time}</div>
          </div>
          <button onClick={onClose} style={{ background: "#F5F7FA", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#6B7280" />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "16px" }}>
          {msg.status && (
            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, background: `${STATUS_COLORS[msg.status]}18`, color: STATUS_COLORS[msg.status], marginBottom: 12 }}>
              ● {msg.status}
            </div>
          )}
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>{msg.body}</p>
          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["Mark as Read", "Archive", "Reply"].map(a => (
              <button key={a} onClick={onClose} style={{ padding: "8px 14px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: a === "Reply" ? cat.color : "#F5F7FA", color: a === "Reply" ? "#fff" : "#6B7280", border: "none", cursor: "pointer" }}>{a}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Category Detail View ─── */
function CategoryView({ cat, onBack }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const messages = MOCK_MESSAGES[cat.id] || [];
  const filtered = messages.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.tag.toLowerCase().includes(search.toLowerCase())
  );
  const unread = messages.filter(m => !m.read).length;

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <ChevronLeft size={18} color="#374151" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>{cat.icon} {cat.name}</div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>{messages.length} messages{unread > 0 ? ` · ${unread} unread` : ""}</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
          <Search size={14} color="#9CA3AF" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…" style={{ border: "none", outline: "none", fontSize: 13, color: "#374151", background: "transparent", flex: 1 }} />
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: "12px 14px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>No messages found</div>
        ) : filtered.map((msg, i) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => setSelected(msg)}
            style={{ background: "#fff", borderRadius: 14, padding: "14px", marginBottom: 10, border: `1px solid ${msg.read ? "#F0F0F8" : cat.color + "33"}`, cursor: "pointer", boxShadow: msg.read ? "0 1px 6px rgba(0,0,0,0.04)" : `0 3px 12px ${cat.color}18`, borderLeft: `3px solid ${msg.read ? "#E5E7EB" : cat.color}` }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              {!msg.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, marginTop: 4, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: msg.read ? 600 : 800, color: "#0D1B3E", flex: 1, marginRight: 8 }}>{msg.title}</span>
                  <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>{msg.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: cat.bg, color: cat.color }}>{msg.tag}</span>
                  {msg.status && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: `${STATUS_COLORS[msg.status]}18`, color: STATUS_COLORS[msg.status] }}>● {msg.status}</span>}
                  {msg.pinned && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "#FFFBEB", color: "#F59E0B" }}>📌 Pinned</span>}
                </div>
                <p style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{msg.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <MessageSheet msg={selected} cat={cat} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function MessagesCenter() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  if (activeCategory) {
    return <CategoryView cat={activeCategory} onBack={() => setActiveCategory(null)} />;
  }

  const totalUnread = Object.values(MOCK_MESSAGES).flat().filter(m => !m.read).length;
  const totalMessages = Object.values(MOCK_MESSAGES).flat().length;

  const STATS = [
    { label: "Total",    value: totalMessages, icon: "💬", color: "#1F6BFF" },
    { label: "Unread",   value: totalUnread,   icon: "🔴", color: "#EF4444" },
    { label: "Tickets",  value: MOCK_MESSAGES.customer_support.filter(m => m.status === "Open").length, icon: "🎧", color: "#10B981" },
    { label: "Alerts",   value: MOCK_MESSAGES.system_messages.filter(m => !m.read).length, icon: "🔔", color: "#8B5CF6" },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <ChevronLeft size={18} color="#374151" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>💬 Messages</div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>Communication Center</div>
        </div>
        {totalUnread > 0 && (
          <div style={{ background: "#EF4444", color: "#fff", fontSize: 11, fontWeight: 900, padding: "3px 9px", borderRadius: 12 }}>{totalUnread}</div>
        )}
      </div>

      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg, #0D1B3E 0%, #1F6BFF 100%)", padding: "20px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "1px solid rgba(255,255,255,0.2)" }}>💬</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>Messages Center</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>All platform communications in one place</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "14px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 12, letterSpacing: "0.06em" }}>MESSAGE CATEGORIES</div>
        {CATEGORIES.map((cat, i) => {
          const msgs = MOCK_MESSAGES[cat.id] || [];
          const unread = msgs.filter(m => !m.read).length;
          const latest = msgs[0];
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }} onClick={() => setActiveCategory(cat)}
              style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1px solid ${unread > 0 ? cat.color + "33" : "#F0F0F8"}`, cursor: "pointer", boxShadow: unread > 0 ? `0 3px 14px ${cat.color}15` : "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${cat.color}22` }}>{cat.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{cat.name}</span>
                  {unread > 0 && <span style={{ fontSize: 10, fontWeight: 900, padding: "2px 8px", borderRadius: 10, background: cat.color, color: "#fff" }}>{unread}</span>}
                </div>
                {latest && <p style={{ fontSize: 11, color: "#9CA3AF", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{latest.title}</p>}
                <div style={{ fontSize: 10, color: "#C4C9D4", marginTop: 2 }}>{msgs.length} message{msgs.length !== 1 ? "s" : ""} · {latest?.time}</div>
              </div>
              <ChevronRight size={16} color="#C4C9D4" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}