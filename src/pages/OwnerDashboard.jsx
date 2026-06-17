/**
 * OwnerDashboard — Master Control Center
 * Access: Profile > More Services > Creator Center > Application Owner Dashboard
 * Theme: Luxury Enterprise Blue & Gold · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";

/* ── Live counter hook ── */
function useLiveCounter(base, delta = 1, interval = 3000) {
  const [val, setVal] = useState(base);
  useState(() => {
    const t = setInterval(() => setVal(v => v + Math.floor(Math.random() * delta)), interval);
    return () => clearInterval(t);
  });
  return val;
}

function fmt(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ── Global stats for hero ── */
const HERO_STATS = [
  { label: "Total Users",    base: 2847391, delta: 3, icon: "👥", color: "#60A5FA" },
  { label: "Live Rooms",     base: 1284,    delta: 2, icon: "📡", color: "#FFC83D" },
  { label: "Revenue Today",  base: 94821,   delta: 5, icon: "💰", color: "#10B981" },
  { label: "Active Agents",  base: 3742,    delta: 1, icon: "🤝", color: "#A78BFA" },
];

/* ── Modules ── */
const MODULES = [
  { id: "home",         icon: "🌍", label: "Dashboard Home",             subtitle: "Executive Overview",          gradient: "linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow: "rgba(31,107,255,0.4)" },
  { id: "search",       icon: "🔍", label: "Global Search Center",       subtitle: "AI Search Engine",             gradient: "linear-gradient(145deg,#0EA5E9,#0369A1)", glow: "rgba(14,165,233,0.35)" },
  { id: "country",      icon: "🌎", label: "Country Control Center",     subtitle: "World Operations",             gradient: "linear-gradient(145deg,#10B981,#065F46)", glow: "rgba(16,185,129,0.35)" },
  { id: "roles",        icon: "👑", label: "Role Management Center",     subtitle: "Authority Control",            gradient: "linear-gradient(145deg,#FFC83D,#D97706)", glow: "rgba(255,200,61,0.4)" },
  { id: "applications", icon: "📋", label: "Global Applications Center", subtitle: "Approval Board",               gradient: "linear-gradient(145deg,#7C3AED,#4C1D95)", glow: "rgba(124,58,237,0.35)" },
  { id: "revenue",      icon: "💰", label: "Global Revenue Center",      subtitle: "Financial Analytics",          gradient: "linear-gradient(145deg,#F59E0B,#B45309)", glow: "rgba(245,158,11,0.35)" },
  { id: "gifts",        icon: "🎁", label: "Global Gift Center",         subtitle: "Gift Economy",                 gradient: "linear-gradient(145deg,#EC4899,#9D174D)", glow: "rgba(236,72,153,0.35)" },
  { id: "coins",        icon: "🪙", label: "Coin Economy Center",        subtitle: "Currency Control",             gradient: "linear-gradient(145deg,#F97316,#C2410C)", glow: "rgba(249,115,22,0.35)" },
  { id: "rankings",     icon: "🏆", label: "Global Rankings Center",     subtitle: "Champion Leaderboards",        gradient: "linear-gradient(145deg,#FFC83D,#1F6BFF)", glow: "rgba(255,200,61,0.35)" },
  { id: "live",         icon: "📡", label: "Live Monitoring Center",     subtitle: "Real-Time Streams",            gradient: "linear-gradient(145deg,#EF4444,#B91C1C)", glow: "rgba(239,68,68,0.35)" },
  { id: "ai",           icon: "🤖", label: "AI Monitoring Center",       subtitle: "Intelligence Core",            gradient: "linear-gradient(145deg,#06B6D4,#0E7490)", glow: "rgba(6,182,212,0.35)" },
  { id: "security",     icon: "🛡️", label: "Security Command Center",    subtitle: "Cyber Protection",             gradient: "linear-gradient(145deg,#1F6BFF,#7C3AED)", glow: "rgba(31,107,255,0.35)" },
  { id: "finance",      icon: "🏦", label: "Global Finance Center",      subtitle: "Banking Operations",           gradient: "linear-gradient(145deg,#10B981,#1F6BFF)", glow: "rgba(16,185,129,0.3)" },
  { id: "audit",        icon: "📑", label: "Global Audit Center",        subtitle: "Compliance Monitor",           gradient: "linear-gradient(145deg,#6366F1,#3730A3)", glow: "rgba(99,102,241,0.35)" },
  { id: "broadcast",    icon: "📢", label: "Broadcast Center",           subtitle: "Platform Announcements",       gradient: "linear-gradient(145deg,#F59E0B,#7C3AED)", glow: "rgba(245,158,11,0.3)" },
  { id: "automation",   icon: "⚙️", label: "System Automation Center",   subtitle: "Workflow Engine",              gradient: "linear-gradient(145deg,#374151,#0D1B3E)", glow: "rgba(55,65,81,0.4)" },
  { id: "bi",           icon: "📈", label: "Business Intelligence",      subtitle: "Executive Analytics",          gradient: "linear-gradient(145deg,#10B981,#059669)", glow: "rgba(16,185,129,0.35)" },
  { id: "settings",     icon: "🔧", label: "Global Settings Center",     subtitle: "Platform Configuration",       gradient: "linear-gradient(145deg,#0EA5E9,#7C3AED)", glow: "rgba(14,165,233,0.3)" },
  { id: "powers",       icon: "🚀", label: "Owner Exclusive Powers",     subtitle: "Supreme Authority",            gradient: "linear-gradient(145deg,#FFC83D,#EF4444)", glow: "rgba(255,200,61,0.5)", featured: true },
];

const MODULE_DETAIL = {
  home:         { desc: "Executive overview of platform performance and real-time activity.", stats: [{ l: "Uptime", v: "99.98%" },{ l: "Regions", v: "47" },{ l: "Servers", v: "128" }] },
  search:       { desc: "Instantly locate any user, host, agency, wallet, role, or transaction.", stats: [{ l: "Indexed", v: "2.8M" },{ l: "Avg Speed", v: "12ms" },{ l: "Queries/s", v: "4.2K" }] },
  country:      { desc: "Monitor country performance, managers, revenue, and growth.", stats: [{ l: "Countries", v: "47" },{ l: "Managers", v: "52" },{ l: "Active", v: "41" }] },
  roles:        { desc: "Manage, approve, promote, demote, suspend, and control all platform roles.", stats: [{ l: "Roles", v: "24" },{ l: "Admins", v: "316" },{ l: "Pending", v: "89" }] },
  applications: { desc: "Review and process all applications submitted throughout the platform.", stats: [{ l: "Pending", v: "142" },{ l: "This Week", v: "389" },{ l: "Approved", v: "87%" }] },
  revenue:      { desc: "Track complete platform earnings, trends, financial growth, and income distribution.", stats: [{ l: "Today", v: "$94.8K" },{ l: "Month", v: "$2.1M" },{ l: "Growth", v: "+18%" }] },
  gifts:        { desc: "Manage gift economy, performance, revenue generation, and gifting statistics.", stats: [{ l: "Gifts Sent", v: "384K" },{ l: "Revenue", v: "$48K" },{ l: "Top Gift", v: "Diamond" }] },
  coins:        { desc: "Control virtual currency packages, promotions, purchases, and coin circulation.", stats: [{ l: "Circulation", v: "8.4B" },{ l: "Purchased", v: "1.2M" },{ l: "Revenue", v: "$31K" }] },
  rankings:     { desc: "Track top-performing countries, agencies, hosts, agents, VIPs, and gifters.", stats: [{ l: "Top Host", v: "#1 Sara" },{ l: "Top Agency", v: "StarPro" },{ l: "Updated", v: "Live" }] },
  live:         { desc: "Monitor all live streams, voice rooms, PK battles, and party rooms in real time.", stats: [{ l: "Live Now", v: "1,284" },{ l: "Viewers", v: "84.2K" },{ l: "PK Active", v: "47" }] },
  ai:           { desc: "Detect fraud, bots, spam, suspicious behavior, and platform risks using advanced AI.", stats: [{ l: "Threats", v: "3 Active" },{ l: "Blocked", v: "2,841" },{ l: "Accuracy", v: "99.2%" }] },
  security:     { desc: "Protect platform integrity through device monitoring, login tracking, and VPN detection.", stats: [{ l: "Alerts", v: "12" },{ l: "VPNs", v: "84 blocked" },{ l: "Score", v: "A+" }] },
  finance:      { desc: "Manage deposits, withdrawals, commissions, transactions, and wallet audits.", stats: [{ l: "Withdrawals", v: "284 pending" },{ l: "Deposits", v: "$127K" },{ l: "Fees", v: "$8.4K" }] },
  audit:        { desc: "Track and review every action performed across the platform with complete transparency.", stats: [{ l: "Logs Today", v: "1.4M" },{ l: "Flagged", v: "28" },{ l: "Resolved", v: "94%" }] },
  broadcast:    { desc: "Send platform-wide announcements, notifications, alerts, and messages.", stats: [{ l: "Sent Today", v: "12" },{ l: "Reach", v: "2.8M" },{ l: "Open Rate", v: "71%" }] },
  automation:   { desc: "Manage automated approvals, rewards, commissions, notifications, and workflows.", stats: [{ l: "Active", v: "148 rules" },{ l: "Runs/day", v: "24K" },{ l: "Success", v: "99.7%" }] },
  bi:           { desc: "Advanced forecasting, growth intelligence, market analysis, and strategic planning.", stats: [{ l: "Reports", v: "84" },{ l: "Forecast", v: "+22% QoQ" },{ l: "Markets", v: "47" }] },
  settings:     { desc: "Control all platform settings including coins, gifts, VIP, rewards, commissions, and security.", stats: [{ l: "Settings", v: "312" },{ l: "Changed", v: "8 today" },{ l: "Version", v: "v4.2.1" }] },
  powers:       { desc: "Highest-level powers including ownership transfer, emergency maintenance, and complete system control.", stats: [{ l: "Power Level", v: "OMEGA" },{ l: "Access", v: "Owner Only" },{ l: "Scope", v: "Global" }] },
};

/* ── Stat card in hero ── */
function HeroStat({ item }) {
  const [val] = useState(item.base + Math.floor(Math.random() * item.delta));
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "11px 8px", textAlign: "center",
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <div style={{ fontSize: 14, marginBottom: 2 }}>{item.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 900, color: item.color }}>{fmt(val)}</div>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{item.label}</div>
    </div>
  );
}

/* ── Module Detail Sheet ── */
function ModuleSheet({ mod, onClose }) {
  const detail = MODULE_DETAIL[mod.id] || {};
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", borderRadius: "22px 22px 0 0", paddingBottom: 36, maxHeight: "75vh", overflowY: "auto",
          background: "linear-gradient(160deg,#0D1B3E,#0B1020)",
          border: "1px solid rgba(31,107,255,0.25)", borderBottom: "none",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", margin: "14px auto 0" }} />

        {/* Header */}
        <div style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", borderBottom: "1px solid rgba(31,107,255,0.15)" }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, flexShrink: 0, background: mod.gradient,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            boxShadow: `0 6px 18px ${mod.glow}` }}>
            {mod.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{mod.label}</div>
            <div style={{ fontSize: 10, color: "#60A5FA", marginTop: 2 }}>{mod.subtitle}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#fff" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 12, color: "#DCE3F0", lineHeight: 1.8, marginBottom: 16 }}>{detail.desc}</p>

          {/* Stats */}
          {detail.stats && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {detail.stats.map(s => (
                <div key={s.l} style={{ background: "rgba(31,107,255,0.1)", borderRadius: 12, padding: "11px 8px", textAlign: "center", border: "1px solid rgba(31,107,255,0.2)" }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: "#60A5FA", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Access badge */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: "rgba(255,200,61,0.12)", border: "1px solid rgba(255,200,61,0.3)" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D" }}>👑 Owner Only</span>
            </div>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: "rgba(31,107,255,0.1)", border: "1px solid rgba(31,107,255,0.25)" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA" }}>🌍 Global Access</span>
            </div>
            <div style={{ padding: "6px 12px", borderRadius: 20, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#10B981" }}>⚡ Real-Time</span>
            </div>
          </div>

          {/* Open button */}
          <motion.button whileTap={{ scale: 0.96 }} onClick={onClose}
            style={{ width: "100%", marginTop: 18, padding: "14px", borderRadius: 16, border: "none", cursor: "pointer", fontWeight: 900, fontSize: 14, color: "#fff",
              background: mod.gradient,
              boxShadow: `0 6px 20px ${mod.glow}` }}>
            Open {mod.label}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg,#050A18 0%,#0D1B3E 40%,#080F1E 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: 90,
    }}>
      {/* ── Sticky Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,10,24,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(31,107,255,0.2)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
      }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(31,107,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#60A5FA" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>🚀 Master Control Center</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>Owner Dashboard · Global Scope</div>
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 20, background: "rgba(255,200,61,0.12)", border: "1px solid rgba(255,200,61,0.3)" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D" }}>👑 OWNER</span>
          </div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{ padding: "20px 16px", position: "relative", overflow: "hidden" }}>
        {/* Orbs */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(31,107,255,0.18),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, left: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,200,61,0.1),transparent 70%)", pointerEvents: "none" }} />

        {/* Title card */}
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: 20, padding: "18px",
          border: "1px solid rgba(31,107,255,0.2)", backdropFilter: "blur(14px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
          marginBottom: 14,
        }}>
          {/* Gradient top bar */}
          <div style={{ height: 3, borderRadius: 2, background: "linear-gradient(90deg,#FFC83D,#1F6BFF,#7C3AED)", marginBottom: 14 }} />
          <div style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", marginBottom: 4, letterSpacing: "0.1em" }}>
            VYRO LIVE · ENTERPRISE INTERNATIONAL LEVEL
          </div>
          <div style={{ fontSize: 21, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Owner Dashboard</div>
          <div style={{ fontSize: 11, color: "#DCE3F0", lineHeight: 1.7 }}>
            Complete visibility, monitoring, financial control, AI intelligence, security management, and executive analytics across the entire global platform.
          </div>
        </div>

        {/* Live stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 9 }}>
          {HERO_STATS.map(s => <HeroStat key={s.label} item={s} />)}
        </div>
      </div>

      {/* ── Module Grid ── */}
      <div style={{ padding: "0 14px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", marginBottom: 14, letterSpacing: "0.08em" }}>
          {MODULES.length} MANAGEMENT MODULES · TAP TO ACCESS
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 11 }}>
          {MODULES.map((mod, i) => (
            <motion.div key={mod.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.22 }}
              whileTap={{ scale: 0.91 }}
              onClick={() => setSelected(mod)}
              style={{ cursor: "pointer" }}
            >
              <div style={{
                borderRadius: 20, overflow: "hidden",
                background: mod.featured ? "rgba(255,200,61,0.06)" : "rgba(255,255,255,0.04)",
                border: mod.featured ? "1.5px solid rgba(255,200,61,0.3)" : "1.5px solid rgba(31,107,255,0.15)",
                backdropFilter: "blur(10px)",
                boxShadow: `0 6px 20px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "16px 6px 13px", position: "relative",
              }}>
                {/* Top accent bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: mod.featured
                    ? "linear-gradient(90deg,#FFC83D,#EF4444,#FFC83D)"
                    : `linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0] ?? "#1F6BFF"},rgba(255,200,61,0.4))`,
                  borderRadius: "20px 20px 0 0",
                }} />

                {/* 3D Icon */}
                <div style={{
                  width: 52, height: 52, borderRadius: 15, marginBottom: 9,
                  background: mod.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24,
                  boxShadow: `0 6px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.25)`,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: "14%", right: 0, height: "42%", background: "linear-gradient(180deg,rgba(255,255,255,0.28) 0%,transparent 100%)", borderRadius: "0 0 50% 50%" }} />
                  {mod.icon}
                </div>

                {/* Label */}
                <div style={{ fontSize: 9, fontWeight: 900, color: "#FFFFFF", textAlign: "center", lineHeight: 1.3, marginBottom: 3 }}>
                  {mod.label}
                </div>
                <div style={{ fontSize: 7.5, fontWeight: 600, color: "#60A5FA", textAlign: "center", lineHeight: 1.2 }}>
                  {mod.subtitle}
                </div>

                {mod.featured && (
                  <div style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#FFC83D", boxShadow: "0 0 8px rgba(255,200,61,0.8)" }} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Module Sheet ── */}
      <AnimatePresence>
        {selected && <ModuleSheet mod={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}