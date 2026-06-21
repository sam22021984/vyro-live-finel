/**
 * Support Center — Help Desk Style UI
 * Access: Home → More Services → Support
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  { id: "help",     label: "Help Center",       icon: "📚", color: "#1F6BFF" },
  { id: "feedback", label: "Feedback",           icon: "💬", color: "#8B5CF6" },
  { id: "ticket",   label: "Customer Support",   icon: "🎧", color: "#10B981" },
  { id: "updates",  label: "New Updates",        icon: "🔔", color: "#F59E0B" },
  { id: "appupdate",label: "App Update",         icon: "📲", color: "#06B6D4" },
  { id: "blacklist",label: "Blacklist",          icon: "🚫", color: "#EF4444" },
];

const FAQ_ITEMS = [
  { q: "How do I recharge coins?",             a: "Go to Wallet → Recharge. Select a coin package and complete your payment." },
  { q: "How do I start a live room?",          a: "Tap Go Live in the navigation, fill in room details, then press Go Live Now." },
  { q: "How do I withdraw diamonds?",          a: "Go to Wallet → Withdraw. Minimum 100 diamonds required. Processing takes 3-5 days." },
  { q: "How do I become a VIP?",               a: "Go to Profile → VIP section and select a VIP tier to purchase." },
  { q: "How do I report a user?",              a: "Tap on the user's profile, scroll to the bottom, and tap Report User." },
  { q: "How do I join an agency?",             a: "Go to Agency Dashboard and tap Join an Agency to browse available agencies." },
];

const UPDATES = [
  { ver: "v3.2.0", date: "Jun 15, 2026", title: "Live Room V2 Launch",      body: "New dark teal live room interface with PK battles, seat grid, and gift animations.", badge: "New" },
  { ver: "v3.1.5", date: "Jun 8, 2026",  title: "Community Module",         body: "New community feed, groups, and announcements tab added to the platform.", badge: "New" },
  { ver: "v3.1.0", date: "May 28, 2026", title: "Tasks & Rewards Center",   body: "Daily tasks, weekly challenges, achievement system and event center now live.", badge: "" },
  { ver: "v3.0.0", date: "May 10, 2026", title: "Platform Major Update",    body: "Complete UI overhaul, new navigation system, floating nav ball, and more.", badge: "" },
];

const BLACKLIST = [
  { id: 1, name: "Unknown User #4821", reason: "Harassment", date: "Jun 10" },
  { id: 2, name: "SpamBot99",          reason: "Spam",       date: "Jun 3"  },
];

/* ──────────────────────────────────────────── */

function HelpCenter() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState(null);
  const filtered = FAQ_ITEMS.filter(f =>
    !query || f.q.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div style={{ padding: "14px" }}>
      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "#F5F7FA", borderRadius: 14, padding: "11px 14px", marginBottom: 14,
        border: "1px solid #E5E7EB",
      }}>
        <Search size={16} color="#9CA3AF" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search help articles..."
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#1a1a2e" }} />
      </div>
      {/* Quick guide cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { icon: "🚀", label: "Getting Started" },
          { icon: "💳", label: "Payments" },
          { icon: "🎙️", label: "Live Rooms" },
          { icon: "🔒", label: "Account & Safety" },
        ].map(g => (
          <motion.div key={g.label} whileTap={{ scale: 0.95 }}
            onClick={() => toast.info(`Opening ${g.label} guide...`)}
            style={{
              background: "#fff", borderRadius: 14, padding: "14px 12px",
              border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              textAlign: "center", cursor: "pointer",
            }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{g.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>{g.label}</div>
          </motion.div>
        ))}
      </div>
      {/* FAQ */}
      <div style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 10 }}>FREQUENTLY ASKED</div>
      {filtered.map((faq, i) => (
        <motion.div key={i} whileTap={{ scale: 0.99 }}
          style={{
            background: "#fff", borderRadius: 14, marginBottom: 8, overflow: "hidden",
            border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 14px", background: "none", border: "none", cursor: "pointer",
            }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0D1B3E", textAlign: "left", flex: 1 }}>{faq.q}</span>
            <motion.div animate={{ rotate: openIdx === i ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={16} color="#9CA3AF" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIdx === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}>
                <div style={{ padding: "0 14px 14px", fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function FeedbackSection() {
  const [type, setType] = useState("feedback");
  const [text, setText] = useState("");
  return (
    <div style={{ padding: "14px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[{ v: "feedback", l: "Feedback", icon: "💬" }, { v: "bug", l: "Bug Report", icon: "🐛" }, { v: "feature", l: "Feature", icon: "💡" }].map(t => (
          <button key={t.v} onClick={() => setType(t.v)}
            style={{
              flex: 1, padding: "8px 6px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: type === t.v ? "#1F6BFF" : "#fff",
              color: type === t.v ? "#fff" : "#9CA3AF",
              border: type === t.v ? "none" : "1px solid #E5E7EB",
            }}>{t.icon} {t.l}</button>
        ))}
      </div>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "16px",
        border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 10 }}>
          {type === "feedback" ? "Share Your Feedback" : type === "bug" ? "Report a Bug" : "Suggest a Feature"}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder={type === "bug" ? "Describe what went wrong and steps to reproduce..." : "Tell us your thoughts..."}
          rows={5}
          style={{
            width: "100%", background: "#F5F7FA", border: "1px solid #E5E7EB",
            borderRadius: 12, padding: "11px 14px", fontSize: 13, color: "#1a1a2e",
            outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box",
          }} />
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { toast.success("✅ Submitted! Thank you."); setText(""); }}
          disabled={!text.trim()}
          style={{
            width: "100%", marginTop: 12, padding: "13px", borderRadius: 12,
            fontSize: 13, fontWeight: 800, border: "none", cursor: text.trim() ? "pointer" : "default",
            background: text.trim() ? "linear-gradient(135deg,#1F6BFF,#60A5FA)" : "#F3F4F6",
            color: text.trim() ? "#fff" : "#9CA3AF",
            boxShadow: text.trim() ? "0 6px 18px rgba(31,107,255,0.3)" : "none",
          }}>
          Submit {type === "feedback" ? "Feedback" : type === "bug" ? "Bug Report" : "Feature Request"}
        </motion.button>
      </div>
    </div>
  );
}

function CustomerSupport() {
  const [tickets,  setTickets]  = useState([]);
  const [subject,  setSubject]  = useState("");
  const [body,     setBody]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { user: authUser } = await import("@/lib/AuthContext").then(m => ({ user: null }));
        // Dynamically get user id
        const meRes = await import("@/api/base44Client").then(m => m.base44.auth.me());
        if (!meRes?.id) return;
        const res = await import("@/api/base44Client").then(m =>
          m.base44.functions.invoke('supabaseQuery', {
            table: 'support_tickets', method: 'GET',
            select: 'id,subject,status,created_at',
            filters: { user_id: `eq.${meRes.id}` },
            order: 'created_at.desc', limit: 20,
          })
        );
        setTickets(res?.data?.data || []);
      } catch { /* ignore */ }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!subject.trim() || submitting) return;
    setSubmitting(true);
    try {
      const meRes = await import("@/api/base44Client").then(m => m.base44.auth.me());
      await import("@/api/base44Client").then(m =>
        m.base44.functions.invoke('supabaseQuery', {
          table: 'support_tickets', method: 'POST',
          body: { user_id: meRes?.id, subject: subject.trim(), body: body.trim(), status: 'open', created_at: new Date().toISOString() },
        })
      );
      setTickets(prev => [{ id: "new", subject: subject.trim(), status: "open", created_at: new Date().toISOString() }, ...prev]);
      setSubject(""); setBody(""); setShowForm(false);
      toast.success("✅ Ticket submitted! We'll respond within 24h.");
    } catch { toast.error("Failed to submit. Please try again."); }
    setSubmitting(false);
  };

  const STATUS_STYLE = {
    open:     { bg: "#EFF6FF", color: "#1F6BFF" },
    resolved: { bg: "#ECFDF5", color: "#10B981" },
    pending:  { bg: "#FEF3C7", color: "#F59E0B" },
  };
  return (
    <div style={{ padding: "14px" }}>
      {/* Start chat */}
      <div style={{
        background: "linear-gradient(135deg,#1F6BFF,#60A5FA)",
        borderRadius: 18, padding: "20px", marginBottom: 14,
        boxShadow: "0 8px 24px rgba(31,107,255,0.3)",
      }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>🎧</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Live Chat Support</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 14 }}>
          Average response time: under 5 minutes
        </div>
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => toast.info("Connecting to support agent...")}
          style={{
            padding: "11px 24px", borderRadius: 20, fontSize: 13, fontWeight: 800,
            background: "#fff", color: "#1F6BFF", border: "none", cursor: "pointer",
          }}>Start Chat</motion.button>
      </div>
      {/* Create ticket */}
      <motion.button whileTap={{ scale: 0.98 }}
        onClick={() => setShowForm(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 12,
          background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10,
          border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer",
        }}>
        <span style={{ fontSize: 22 }}>📝</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>Create Support Ticket</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>For complex issues — response within 24h</div>
        </div>
        <ChevronRight size={16} color="#9CA3AF" />
      </motion.button>
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height:0,opacity:0 }} animate={{ height:"auto",opacity:1 }} exit={{ height:0,opacity:0 }}
            style={{ overflow:"hidden", marginBottom:10 }}>
            <div style={{ background:"#fff", borderRadius:14, padding:"14px", border:"1px solid #E5E7EB" }}>
              <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject"
                style={{ width:"100%", background:"#F5F7FA", border:"1px solid #E5E7EB", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", marginBottom:8, boxSizing:"border-box" }}/>
              <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Describe your issue..." rows={4}
                style={{ width:"100%", background:"#F5F7FA", border:"1px solid #E5E7EB", borderRadius:10, padding:"10px 12px", fontSize:13, outline:"none", resize:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
              <motion.button whileTap={{ scale:0.96 }} onClick={handleSubmit} disabled={!subject.trim()||submitting}
                style={{ width:"100%", marginTop:10, padding:"12px", borderRadius:12, border:"none", cursor:subject.trim()?"pointer":"default",
                  background:subject.trim()?"linear-gradient(135deg,#1F6BFF,#60A5FA)":"#F3F4F6",
                  color:subject.trim()?"#fff":"#9CA3AF", fontWeight:800, fontSize:13 }}>
                {submitting ? "Submitting…" : "Submit Ticket"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* My tickets */}
      <div style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 10 }}>MY TICKETS</div>
      {tickets.length === 0 && <div style={{ textAlign:"center", color:"#9CA3AF", fontSize:12, padding:"12px 0" }}>No tickets yet.</div>}
      {tickets.map((t, idx) => {
        const s = STATUS_STYLE[t.status] || STATUS_STYLE.open;
        const date = t.created_at ? new Date(t.created_at).toLocaleDateString("en-QA",{month:"short",day:"numeric"}) : "";
        return (
          <div key={t.id||idx} style={{
            background: "#fff", borderRadius: 14, padding: "13px 14px", marginBottom: 8,
            border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>{date}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0D1B3E", marginTop: 2 }}>{t.subject}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color }}>
              {(t.status||"open").toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function UpdatesSection() {
  return (
    <div style={{ padding: "14px" }}>
      {UPDATES.map((u, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          style={{
            background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10,
            border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#1F6BFF" }}>{u.ver}</span>
              {u.badge && (
                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 10, background: "#EFF6FF", color: "#1F6BFF" }}>
                  {u.badge}
                </span>
              )}
            </div>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{u.date}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 4 }}>{u.title}</div>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{u.body}</div>
        </motion.div>
      ))}
    </div>
  );
}

function AppUpdateSection() {
  return (
    <div style={{ padding: "14px" }}>
      <div style={{
        background: "linear-gradient(135deg,#06B6D4,#0891B2)",
        borderRadius: 20, padding: "24px 20px", textAlign: "center",
        boxShadow: "0 8px 24px rgba(6,182,212,0.3)", marginBottom: 16,
      }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📲</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>VYRO LIVE v3.2.0</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>You're on the latest version</div>
        <div style={{
          background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 16px",
          fontSize: 12, color: "#fff", fontWeight: 700, display: "inline-block",
        }}>✅ Up to Date</div>
      </div>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "16px",
        border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>📋 Latest Changelog (v3.2.0)</div>
        {["New Live Room V2 with seat grid", "PK Battle system added", "Community feed & groups", "Tasks & Rewards Center", "Performance improvements"].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ color: "#10B981", fontSize: 12, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlacklistSection() {
  const [list, setList] = useState(BLACKLIST);
  const [unblocking, setUnblocking] = useState(null);
  const handleUnblock = (id, name) => {
    setList(prev => prev.filter(u => u.id !== id));
    toast.success(`${name} has been unblocked.`);
    setUnblocking(null);
  };
  return (
    <div style={{ padding: "14px" }}>
      <div style={{
        background: "#FEF2F2", borderRadius: 14, padding: "12px 14px",
        border: "1px solid #FEE2E2", marginBottom: 14,
        fontSize: 12, color: "#991B1B", lineHeight: 1.6,
      }}>
        🚫 Blocked users cannot see your profile, send you messages, or join your live rooms.
      </div>
      {list.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF", fontSize: 13 }}>
          No blocked users
        </div>
      )}
      {list.map(u => (
        <motion.div key={u.id} layout
          style={{
            background: "#fff", borderRadius: 14, padding: "13px 14px", marginBottom: 8,
            border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", background: "#F3F4F6",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{u.name}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{u.reason} · {u.date}</div>
          </div>
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => handleUnblock(u.id, u.name)}
            style={{
              padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: "#FEF2F2", border: "1px solid #FEE2E2", color: "#EF4444",
            }}>Unblock</motion.button>
        </motion.div>
      ))}
      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => toast.info("Search for a user to block...")}
        style={{
          width: "100%", padding: "13px", borderRadius: 14, marginTop: 8,
          background: "#F5F7FA", border: "1px dashed #E5E7EB", color: "#9CA3AF",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>+ Block a User</motion.button>
    </div>
  );
}

/* ──── Main Page ──── */
export default function Support() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case "help":      return <HelpCenter />;
      case "feedback":  return <FeedbackSection />;
      case "ticket":    return <CustomerSupport />;
      case "updates":   return <UpdatesSection />;
      case "appupdate": return <AppUpdateSection />;
      case "blacklist": return <BlacklistSection />;
      default:          return null;
    }
  };

  const current = SECTIONS.find(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100dvh", background: "#F5F7FA",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #F0F0F8",
        padding: "12px 16px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => activeSection ? setActiveSection(null) : navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: "50%", background: "#F5F7FA",
              border: "1px solid #E5E7EB", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
            }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>
              {current ? current.label : "Support Center"}
            </div>
            {!current && <div style={{ fontSize: 10, color: "#9CA3AF" }}>How can we help you?</div>}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeSection ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "16px" }}>
            {/* Hero banner */}
            <div style={{
              background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
              borderRadius: 20, padding: "24px 20px", marginBottom: 20,
              boxShadow: "0 8px 28px rgba(31,107,255,0.3)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🛟</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
                We're Here to Help
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                Browse help articles, submit feedback, or reach our support team directly.
              </div>
            </div>

            {/* Section grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SECTIONS.map((s, i) => (
                <motion.button key={s.id} whileTap={{ scale: 0.94 }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    background: "#fff", borderRadius: 18, padding: "18px 14px",
                    border: "1px solid #F0F0F8", boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
                    cursor: "pointer",
                  }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${s.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{s.label}</div>
                  <ChevronRight size={14} color={s.color} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {renderSection()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}