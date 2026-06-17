/**
 * OwnerDashboard — Master Control Center
 * VYRO LIVE CONNECT EARNING · Enterprise International Level
 * Access: Profile > More Services > Creator Center > Application Owner Dashboard
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, Search } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─────────────── UTILS ─────────────── */
function fmt(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const revenueData = [
  { d: "Jan", v: 48 }, { d: "Feb", v: 62 }, { d: "Mar", v: 55 },
  { d: "Apr", v: 78 }, { d: "May", v: 91 }, { d: "Jun", v: 95 },
];
const userGrowthData = [
  { d: "Jan", v: 1.2 }, { d: "Feb", v: 1.6 }, { d: "Mar", v: 1.9 },
  { d: "Apr", v: 2.1 }, { d: "May", v: 2.6 }, { d: "Jun", v: 2.8 },
];
const countryData = [
  { d: "SA", v: 28 }, { d: "QA", v: 19 }, { d: "EG", v: 35 },
  { d: "AE", v: 22 }, { d: "KW", v: 14 }, { d: "JO", v: 9 },
];

/* ─────────────── STYLES ─────────────── */
const S = {
  page: { minHeight: "100dvh", background: "linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)", fontFamily: "'Inter',system-ui,sans-serif", paddingBottom: 90 },
  glass: (extra = {}) => ({ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(14px)", border: "1px solid rgba(31,107,255,0.18)", borderRadius: 18, ...extra }),
  goldBadge: { padding: "4px 10px", borderRadius: 20, background: "rgba(255,200,61,0.12)", border: "1px solid rgba(255,200,61,0.3)" },
  sectionTitle: { fontSize: 10, fontWeight: 800, color: "#60A5FA", letterSpacing: "0.08em", marginBottom: 10 },
  kpiCard: (color) => ({
    background: `linear-gradient(145deg,${color}18,${color}08)`,
    border: `1px solid ${color}30`, borderRadius: 14, padding: "12px 10px", textAlign: "center",
  }),
  chip: (color) => ({ display: "inline-block", padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: `${color}15`, color, border: `1px solid ${color}25`, margin: "2px" }),
  actionBtn: (grad, glow) => ({
    padding: "9px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 10, color: "#fff",
    background: grad, boxShadow: `0 4px 14px ${glow}`, margin: "3px",
  }),
};

/* ─────────────── SHARED COMPONENTS ─────────────── */
function PageShell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,10,24,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(31,107,255,0.2)", boxShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
            style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(31,107,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#60A5FA" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{title}</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>{subtitle}</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D" }}>👑 OWNER</span></div>
        </div>
      </div>
      <div style={{ padding: "16px 14px" }}>{children}</div>
    </div>
  );
}

function KpiGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 16 }}>
      {items.map(({ l, v, icon, color = "#60A5FA" }) => (
        <div key={l} style={S.kpiCard(color)}>
          {icon && <div style={{ fontSize: 16, marginBottom: 3 }}>{icon}</div>}
          <div style={{ fontSize: 14, fontWeight: 900, color }}>{v}</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function ChipList({ title, items, color = "#60A5FA" }) {
  return (
    <div style={{ ...S.glass(), padding: "13px", marginBottom: 12 }}>
      <div style={S.sectionTitle}>{title}</div>
      <div>{items.map(t => <span key={t} style={S.chip(color)}>{t}</span>)}</div>
    </div>
  );
}

function ActionRow({ title, actions }) {
  const grads = ["linear-gradient(135deg,#1F6BFF,#6366F1)", "linear-gradient(135deg,#EF4444,#DC2626)", "linear-gradient(135deg,#10B981,#059669)", "linear-gradient(135deg,#F59E0B,#D97706)", "linear-gradient(135deg,#7C3AED,#5B21B6)", "linear-gradient(135deg,#0EA5E9,#0369A1)"];
  const glows = ["rgba(31,107,255,0.35)", "rgba(239,68,68,0.35)", "rgba(16,185,129,0.35)", "rgba(245,158,11,0.35)", "rgba(124,58,237,0.35)", "rgba(14,165,233,0.35)"];
  return (
    <div style={{ ...S.glass(), padding: "13px", marginBottom: 12 }}>
      <div style={S.sectionTitle}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {actions.map((a, i) => (
          <motion.button key={a} whileTap={{ scale: 0.92 }} style={S.actionBtn(grads[i % grads.length], glows[i % glows.length])}>{a}</motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function DashboardHome({ onBack }) {
  return (
    <PageShell title="🌍 Dashboard Home" subtitle="Executive Platform Overview" onBack={onBack}>
      <div style={{ height: 3, borderRadius: 2, background: "linear-gradient(90deg,#FFC83D,#1F6BFF,#7C3AED)", marginBottom: 16 }} />
      <KpiGrid items={[
        { l: "Countries", v: "47", icon: "🌍", color: "#60A5FA" },
        { l: "Total Users", v: "2.8M", icon: "👥", color: "#10B981" },
        { l: "Total Hosts", v: "84K", icon: "🎙️", color: "#A78BFA" },
        { l: "Agents", v: "3.7K", icon: "🤝", color: "#FFC83D" },
        { l: "Agencies", v: "284", icon: "🏛️", color: "#F97316" },
        { l: "Managers", v: "52", icon: "👑", color: "#EC4899" },
        { l: "Total Revenue", v: "$2.1M", icon: "💰", color: "#10B981" },
        { l: "Today Revenue", v: "$94.8K", icon: "📈", color: "#FFC83D" },
        { l: "Live Streams", v: "1,284", icon: "📡", color: "#EF4444" },
        { l: "Voice Rooms", v: "628", icon: "🎤", color: "#60A5FA" },
        { l: "PK Battles", v: "47", icon: "⚔️", color: "#F97316" },
        { l: "Party Rooms", v: "93", icon: "🎉", color: "#A78BFA" },
      ]} />

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>📊 REVENUE TREND (USD K)</div>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={revenueData}>
            <defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1F6BFF" stopOpacity={0.5} /><stop offset="95%" stopColor="#1F6BFF" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#60A5FA" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1B3E", border: "1px solid #1F6BFF", borderRadius: 8, color: "#fff", fontSize: 10 }} />
            <Area type="monotone" dataKey="v" stroke="#1F6BFF" fill="url(#rv)" strokeWidth={2} dot={{ fill: "#FFC83D", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>👥 USER GROWTH (M)</div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={userGrowthData}>
            <defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.5} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#60A5FA" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1B3E", border: "1px solid #10B981", borderRadius: 8, color: "#fff", fontSize: 10 }} />
            <Area type="monotone" dataKey="v" stroke="#10B981" fill="url(#ug)" strokeWidth={2} dot={{ fill: "#FFC83D", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>🌍 COUNTRY COMPARISON (Revenue K)</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={countryData}>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#60A5FA" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1B3E", border: "1px solid #FFC83D", borderRadius: 8, color: "#fff", fontSize: 10 }} />
            <Bar dataKey="v" fill="#FFC83D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ActionRow title="⚡ QUICK ACTIONS" actions={["Open Revenue Center", "Open Security Center", "Live Monitoring", "Broadcast Message"]} />
    </PageShell>
  );
}

function GlobalSearchCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("User ID");
  const searchTypes = ["User ID", "VYRO ID", "Username", "Email", "Phone", "Device ID", "Wallet ID", "Host ID", "Agent ID", "Agency ID"];
  const mockResult = query ? { name: "SaraHost_2024", id: "USR-48291", level: "LV42", status: "Active", wallet: "4,820 Coins", violations: 0, country: "🇸🇦 Saudi Arabia" } : null;

  return (
    <PageShell title="🔍 Global Search Center" subtitle="AI-Powered Platform Search" onBack={onBack}>
      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>🔎 SEARCH BY</div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
          {searchTypes.map(t => (
            <motion.button key={t} whileTap={{ scale: 0.92 }} onClick={() => setType(t)}
              style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 16, fontSize: 9, fontWeight: 800, border: "none", cursor: "pointer", background: type === t ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "rgba(255,255,255,0.06)", color: type === t ? "#fff" : "#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search by ${type}…`}
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(31,107,255,0.25)", borderRadius: 12, padding: "10px 13px", color: "#fff", fontSize: 12, outline: "none" }} />
          <motion.button whileTap={{ scale: 0.92 }} style={{ padding: "10px 16px", borderRadius: 12, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", border: "none", cursor: "pointer" }}>
            <Search size={14} color="#fff" />
          </motion.button>
        </div>
      </div>

      {mockResult && (
        <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
          <div style={S.sectionTitle}>✅ SEARCH RESULT</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{mockResult.name}</div>
              <div style={{ fontSize: 10, color: "#60A5FA" }}>{mockResult.id} · {mockResult.country}</div>
              <div style={{ fontSize: 9, color: "#10B981", marginTop: 2 }}>● {mockResult.status} · {mockResult.level}</div>
            </div>
          </div>
          <KpiGrid items={[
            { l: "Wallet", v: mockResult.wallet, color: "#FFC83D" },
            { l: "Violations", v: mockResult.violations, color: "#10B981" },
            { l: "Reports", v: "0", color: "#60A5FA" },
          ]} />
          <ActionRow title="⚡ ACTIONS" actions={["Suspend", "Ban", "Unban", "Message", "Promote", "View Wallet"]} />
        </div>
      )}

      <ChipList title="📋 RESULT DATA INCLUDES" items={["Full Profile", "Revenue", "Wallet", "Device Logs", "Login History", "Violations", "Reports", "Live History"]} color="#60A5FA" />
    </PageShell>
  );
}

function CountryControlCenter({ onBack }) {
  const countries = [
    { name: "Saudi Arabia", flag: "🇸🇦", code: "SA", manager: "Ali Hassan", revenue: "$28K", users: "684K", hosts: "18.2K", agencies: 42 },
    { name: "Qatar",        flag: "🇶🇦", code: "QA", manager: "Fatima Al-Q", revenue: "$19K", users: "214K", hosts: "7.4K", agencies: 18 },
    { name: "Egypt",        flag: "🇪🇬", code: "EG", manager: "Mohamed Taha", revenue: "$35K", users: "912K", hosts: "24.8K", agencies: 61 },
    { name: "UAE",          flag: "🇦🇪", code: "AE", manager: "Sara Al-M", revenue: "$22K", users: "421K", hosts: "12.1K", agencies: 34 },
  ];

  return (
    <PageShell title="🌎 Country Control Center" subtitle="Global Operations Monitor" onBack={onBack}>
      {countries.map((c, i) => (
        <motion.div key={c.code} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "14px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(31,107,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{c.name}</div>
              <div style={{ fontSize: 10, color: "#60A5FA" }}>Manager: {c.manager}</div>
            </div>
            <div style={{ padding: "3px 8px", borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "#10B981" }}>Active</span>
            </div>
          </div>
          <KpiGrid items={[
            { l: "Revenue", v: c.revenue, color: "#FFC83D" },
            { l: "Users", v: c.users, color: "#60A5FA" },
            { l: "Hosts", v: c.hosts, color: "#A78BFA" },
            { l: "Agencies", v: c.agencies, color: "#F97316" },
            { l: "Growth", v: "+18%", color: "#10B981" },
            { l: "Activity", v: "92%", color: "#EC4899" },
          ]} />
          <div style={{ display: "flex", gap: 7 }}>
            {["Open Dashboard", "Replace Manager", "Revenue Review"].map((a, ai) => (
              <motion.button key={a} whileTap={{ scale: 0.92 }}
                style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 9, color: "#fff",
                  background: ["linear-gradient(135deg,#1F6BFF,#6366F1)", "linear-gradient(135deg,#F59E0B,#D97706)", "linear-gradient(135deg,#10B981,#059669)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function RoleManagementCenter({ onBack }) {
  const roles = [
    { name: "Host",        icon: "🎙️", count: 84210, pending: 48, color: "#A78BFA" },
    { name: "Agent",       icon: "🤝", count: 3742,  pending: 12, color: "#60A5FA" },
    { name: "Agency",      icon: "🏛️", count: 284,   pending: 5,  color: "#FFC83D" },
    { name: "Admin",       icon: "🛡️", count: 316,   pending: 3,  color: "#EF4444" },
    { name: "Super Admin", icon: "⚡", count: 18,    pending: 1,  color: "#F59E0B" },
    { name: "Manager",     icon: "👔", count: 52,    pending: 2,  color: "#10B981" },
    { name: "Director",    icon: "👑", count: 8,     pending: 0,  color: "#EC4899" },
  ];

  return (
    <PageShell title="👑 Role Management Center" subtitle="Authority Control System" onBack={onBack}>
      {roles.map((r, i) => (
        <motion.div key={r.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: `${r.color}18`, border: `1px solid ${r.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{r.name}</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>{fmt(r.count)} active{r.pending > 0 ? ` · ${r.pending} pending` : ""}</div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {["Approve", "Promote", "Suspend"].map((a, ai) => (
              <motion.button key={a} whileTap={{ scale: 0.9 }}
                style={{ padding: "5px 9px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 8, fontWeight: 800, color: "#fff",
                  background: ["linear-gradient(135deg,#10B981,#059669)", "linear-gradient(135deg,#1F6BFF,#6366F1)", "linear-gradient(135deg,#EF4444,#B91C1C)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
      <ActionRow title="⚡ BULK ACTIONS" actions={["Reject", "Demote", "Remove", "Promote All"]} />
    </PageShell>
  );
}

function GlobalApplicationsCenter({ onBack }) {
  const apps = [
    { type: "Host",    icon: "🎙️", pending: 48, approved: 312, color: "#A78BFA" },
    { type: "Agent",   icon: "🤝", pending: 22, approved: 84,  color: "#60A5FA" },
    { type: "Agency",  icon: "🏛️", pending: 9,  approved: 31,  color: "#FFC83D" },
    { type: "Admin",   icon: "🛡️", pending: 5,  approved: 18,  color: "#EF4444" },
    { type: "Manager", icon: "👔", pending: 3,  approved: 7,   color: "#10B981" },
  ];

  return (
    <PageShell title="📋 Global Applications Center" subtitle="Application Review & Approval" onBack={onBack}>
      <KpiGrid items={[
        { l: "Total Pending", v: "87", color: "#FFC83D", icon: "⏳" },
        { l: "Approved Today", v: "34", color: "#10B981", icon: "✅" },
        { l: "Rejected Today", v: "8", color: "#EF4444", icon: "❌" },
      ]} />
      {apps.map((a, i) => (
        <motion.div key={a.type} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "14px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{a.type} Applications</div>
              <div style={{ fontSize: 10, color: "#60A5FA" }}>{a.pending} pending · {a.approved} approved this month</div>
            </div>
            <div style={{ padding: "3px 8px", borderRadius: 8, background: "rgba(255,200,61,0.12)", border: "1px solid rgba(255,200,61,0.3)" }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#FFC83D" }}>{a.pending}</span>
            </div>
          </div>
          <ChipList title="📄 REVIEW INCLUDES" items={["Documents", "ID Verification", "Revenue Potential", "History"]} color={a.color} />
          <ActionRow title="⚡ ACTIONS" actions={["Approve", "Reject", "Delay", "Request Documents"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function GlobalRevenueCenter({ onBack }) {
  const sources = [
    { l: "Gifts",           v: "$48K",  pct: 51, color: "#EC4899" },
    { l: "VIP",             v: "$21K",  pct: 22, color: "#A78BFA" },
    { l: "Coin Purchases",  v: "$18K",  pct: 19, color: "#FFC83D" },
    { l: "Events",          v: "$4.8K", pct: 5,  color: "#10B981" },
    { l: "Agency Revenue",  v: "$3.0K", pct: 3,  color: "#60A5FA" },
  ];

  return (
    <PageShell title="💰 Global Revenue Center" subtitle="Financial Analytics & Reports" onBack={onBack}>
      <KpiGrid items={[
        { l: "Today", v: "$94.8K", color: "#FFC83D", icon: "📈" },
        { l: "This Month", v: "$2.1M", color: "#10B981", icon: "💰" },
        { l: "Growth", v: "+18%", color: "#60A5FA", icon: "🚀" },
      ]} />

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>📊 REVENUE TREND (USD K)</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={revenueData}>
            <defs><linearGradient id="rv2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FFC83D" stopOpacity={0.5} /><stop offset="95%" stopColor="#FFC83D" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#60A5FA" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1B3E", border: "1px solid #FFC83D", borderRadius: 8, color: "#fff", fontSize: 10 }} />
            <Area type="monotone" dataKey="v" stroke="#FFC83D" fill="url(#rv2)" strokeWidth={2} dot={{ fill: "#1F6BFF", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>💡 REVENUE SOURCES</div>
        {sources.map(s => (
          <div key={s.l} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#DCE3F0" }}>{s.l}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: s.color }}>{s.v}</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.7 }}
                style={{ height: "100%", borderRadius: 3, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <ChipList title="📋 REPORT PERIODS" items={["Daily", "Weekly", "Monthly", "Yearly", "Lifetime"]} color="#FFC83D" />
    </PageShell>
  );
}

function GlobalGiftCenter({ onBack }) {
  const gifts = [
    { name: "Diamond Star",   icon: "💎", revenue: "$12.4K", uses: "48.2K", cat: "VIP" },
    { name: "Golden Rose",    icon: "🌹", revenue: "$8.1K",  uses: "82.1K", cat: "Premium" },
    { name: "Crown Jewel",    icon: "👑", revenue: "$6.8K",  uses: "21.4K", cat: "Luxury" },
    { name: "Festival Bomb",  icon: "🎆", revenue: "$4.2K",  uses: "64.7K", cat: "Festival" },
  ];

  return (
    <PageShell title="🎁 Global Gift Center" subtitle="Gift Economy & Analytics" onBack={onBack}>
      <KpiGrid items={[
        { l: "Gifts Sent", v: "384K", color: "#EC4899", icon: "🎁" },
        { l: "Revenue", v: "$48K", color: "#FFC83D", icon: "💰" },
        { l: "Top Gift", v: "Diamond", color: "#60A5FA", icon: "💎" },
      ]} />
      <ChipList title="🗂️ GIFT CATEGORIES" items={["Normal Gifts", "VIP Gifts", "Festival Gifts", "Event Gifts"]} color="#EC4899" />
      <div style={S.sectionTitle}>🏅 TOP PERFORMING GIFTS</div>
      {gifts.map((g, i) => (
        <div key={g.name} style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(236,72,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{g.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{g.name}</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>{g.cat} · {g.uses} uses</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#FFC83D" }}>{g.revenue}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>revenue</div>
          </div>
        </div>
      ))}
    </PageShell>
  );
}

function CoinEconomyCenter({ onBack }) {
  return (
    <PageShell title="🪙 Coin Economy Center" subtitle="Virtual Currency Control" onBack={onBack}>
      <KpiGrid items={[
        { l: "Circulation", v: "8.4B", color: "#FFC83D", icon: "🪙" },
        { l: "Purchased", v: "1.2M", color: "#10B981", icon: "💳" },
        { l: "Gifted", v: "384K", color: "#EC4899", icon: "🎁" },
      ]} />
      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>📦 COIN PACKAGES</div>
        {[{ coins: "100", price: "$0.99", badge: "" }, { coins: "500", price: "$4.99", badge: "Popular" }, { coins: "2,000", price: "$18.99", badge: "Best Value" }, { coins: "10,000", price: "$89.99", badge: "VIP" }].map(p => (
          <div key={p.coins} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{p.coins} Coins</span>
              {p.badge && <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 6, background: "rgba(255,200,61,0.2)", color: "#FFC83D" }}>{p.badge}</span>}
            </div>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#FFC83D" }}>{p.price}</span>
          </div>
        ))}
      </div>
      <ChipList title="🎯 COIN FEATURES" items={["Discounts", "Promotions", "Bonus Coins", "Seasonal Offers"]} color="#FFC83D" />
    </PageShell>
  );
}

function GlobalRankingsCenter({ onBack }) {
  const categories = [
    { title: "Top Countries",  icon: "🌍", items: ["🇸🇦 Saudi Arabia — $28K", "🇪🇬 Egypt — $35K", "🇦🇪 UAE — $22K"] },
    { title: "Top Agencies",   icon: "🏛️", items: ["StarPro Agency — 284 hosts", "EliteMedia — 198 hosts", "GlobalSound — 164 hosts"] },
    { title: "Top Hosts",      icon: "🎙️", items: ["@SaraLive — 84K viewers", "@AliSound — 62K viewers", "@MoonVoice — 51K viewers"] },
    { title: "Top Gifters",    icon: "🎁", items: ["@DiamondKing — 8.4M coins", "@GoldenRose — 6.2M coins", "@StarLight — 4.8M coins"] },
  ];

  return (
    <PageShell title="🏆 Global Rankings Center" subtitle="Champion Leaderboards" onBack={onBack}>
      {categories.map((cat, i) => (
        <motion.div key={cat.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          style={{ ...S.glass(), padding: "14px", marginBottom: 12 }}>
          <div style={S.sectionTitle}>{cat.icon} {cat.title.toUpperCase()}</div>
          {cat.items.map((item, ii) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: ii < cat.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: ["linear-gradient(135deg,#FFC83D,#F59E0B)", "linear-gradient(135deg,#9CA3AF,#6B7280)", "linear-gradient(135deg,#CD7F32,#92400E)"][ii], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                #{ii + 1}
              </div>
              <span style={{ fontSize: 11, color: "#DCE3F0", flex: 1 }}>{item}</span>
            </div>
          ))}
        </motion.div>
      ))}
    </PageShell>
  );
}

function LiveMonitoringCenter({ onBack }) {
  const rooms = [
    { id: "LV-4821", host: "@SaraLive", viewers: "4.2K", revenue: "$284", gifts: 48, type: "Live" },
    { id: "PK-2841", host: "@AliSound vs @MoonVoice", viewers: "8.1K", revenue: "$641", gifts: 124, type: "PK" },
    { id: "VR-1924", host: "@StarNight", viewers: "1.8K", revenue: "$96", gifts: 22, type: "Voice" },
  ];

  return (
    <PageShell title="📡 Live Monitoring Center" subtitle="Real-Time Stream Monitor" onBack={onBack}>
      <KpiGrid items={[
        { l: "Live Streams", v: "1,284", color: "#EF4444", icon: "📡" },
        { l: "Total Viewers", v: "84.2K", color: "#60A5FA", icon: "👁️" },
        { l: "PK Battles", v: "47", color: "#FFC83D", icon: "⚔️" },
      ]} />
      {rooms.map((r, i) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 6px #EF4444", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{r.id} · {r.host}</div>
              <div style={{ fontSize: 10, color: "#60A5FA" }}>{r.type} Room · {r.viewers} viewers</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 900, color: "#FFC83D" }}>{r.revenue}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Join Live", "Watch", "Warning", "End Stream"].map((a, ai) => (
              <motion.button key={a} whileTap={{ scale: 0.9 }}
                style={{ flex: 1, padding: "7px 4px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 8, fontWeight: 800, color: "#fff",
                  background: ["linear-gradient(135deg,#1F6BFF,#6366F1)", "linear-gradient(135deg,#10B981,#059669)", "linear-gradient(135deg,#F59E0B,#D97706)", "linear-gradient(135deg,#EF4444,#B91C1C)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function AIMonitoringCenter({ onBack }) {
  const threats = [
    { type: "Fake Gifts",  count: 3,  risk: "High",   color: "#EF4444" },
    { type: "Bot Activity",count: 12, risk: "Medium",  color: "#F59E0B" },
    { type: "Spam Burst",  count: 28, risk: "Low",     color: "#60A5FA" },
    { type: "Fraud Signal",count: 1,  risk: "Critical",color: "#DC2626" },
  ];

  return (
    <PageShell title="🤖 AI Monitoring Center" subtitle="Intelligence & Threat Detection" onBack={onBack}>
      <KpiGrid items={[
        { l: "Threats Active", v: "3", color: "#EF4444", icon: "⚠️" },
        { l: "Blocked Today", v: "2,841", color: "#10B981", icon: "🛡️" },
        { l: "AI Accuracy", v: "99.2%", color: "#60A5FA", icon: "🤖" },
      ]} />
      {threats.map((t, i) => (
        <motion.div key={t.type} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, borderLeft: `3px solid ${t.color}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{t.type}</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>{t.count} detected</div>
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 8, background: `${t.color}18`, border: `1px solid ${t.color}30` }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: t.color }}>{t.risk}</span>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} style={{ padding: "6px 12px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#EF4444,#B91C1C)" }}>
            Action
          </motion.button>
        </motion.div>
      ))}
      <ChipList title="🧠 AI ENGINE METRICS" items={["Risk Score", "Threat Score", "Auto Suggestions", "Pattern Analysis"]} color="#60A5FA" />
    </PageShell>
  );
}

function SecurityCommandCenter({ onBack }) {
  const logs = [
    { type: "Login Alert",  ip: "185.220.x.x", device: "iPhone 15", time: "2m ago",   risk: "Low",      color: "#60A5FA" },
    { type: "VPN Detected", ip: "10.0.x.x",    device: "Chrome",    time: "14m ago",  risk: "Medium",   color: "#F59E0B" },
    { type: "Brute Force",  ip: "192.168.x.x", device: "Android",   time: "1h ago",   risk: "High",     color: "#EF4444" },
  ];

  return (
    <PageShell title="🛡️ Security Command Center" subtitle="Cyber Protection & Monitoring" onBack={onBack}>
      <KpiGrid items={[
        { l: "Active Alerts", v: "12", color: "#EF4444", icon: "⚠️" },
        { l: "VPNs Blocked", v: "84", color: "#F59E0B", icon: "🔒" },
        { l: "Security Score", v: "A+", color: "#10B981", icon: "🛡️" },
      ]} />
      <ChipList title="📋 LOG TYPES" items={["Login Logs", "Device Logs", "IP Logs", "VPN Logs"]} color="#EF4444" />
      <div style={S.sectionTitle}>🔴 RECENT ALERTS</div>
      {logs.map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "12px 14px", marginBottom: 10, borderLeft: `3px solid ${l.color}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{l.type}</span>
            <span style={{ fontSize: 9, color: "#9CA3AF" }}>{l.time}</span>
          </div>
          <div style={{ fontSize: 10, color: "#60A5FA", marginBottom: 8 }}>IP: {l.ip} · Device: {l.device}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Freeze Account", "Lock Account", "Force Logout"].map((a, ai) => (
              <motion.button key={a} whileTap={{ scale: 0.9 }}
                style={{ flex: 1, padding: "6px 4px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 8, fontWeight: 800, color: "#fff",
                  background: ["linear-gradient(135deg,#F59E0B,#D97706)", "linear-gradient(135deg,#EF4444,#B91C1C)", "linear-gradient(135deg,#7C3AED,#5B21B6)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function GlobalFinanceCenter({ onBack }) {
  return (
    <PageShell title="🏦 Global Finance Center" subtitle="Banking Operations Hub" onBack={onBack}>
      <KpiGrid items={[
        { l: "Deposits", v: "$127K", color: "#10B981", icon: "📥" },
        { l: "Withdrawals", v: "284 pending", color: "#EF4444", icon: "📤" },
        { l: "Commissions", v: "$8.4K", color: "#FFC83D", icon: "💳" },
      ]} />
      <ChipList title="💳 FINANCIAL DATA" items={["Deposits", "Withdrawals", "Wallets", "Transactions", "Commissions"]} color="#10B981" />
      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>📊 MONTHLY FINANCE</div>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={revenueData}>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#60A5FA" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1B3E", border: "1px solid #10B981", borderRadius: 8, color: "#fff", fontSize: 10 }} />
            <Bar dataKey="v" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ActionRow title="⚡ QUICK ACTIONS" actions={["Approve Withdrawals", "Audit Wallets", "Generate Report"]} />
    </PageShell>
  );
}

function GlobalAuditCenter({ onBack }) {
  const logs = [
    { user: "Admin_Khaled", action: "Approved Host Application", time: "5m ago",  ip: "185.x.x.x" },
    { user: "SuperAdmin_1", action: "Banned User USR-48291",     time: "22m ago", ip: "91.x.x.x" },
    { user: "Owner",        action: "Changed VIP Settings",      time: "1h ago",  ip: "10.x.x.x" },
  ];

  return (
    <PageShell title="📑 Global Audit Center" subtitle="Compliance & Transparency" onBack={onBack}>
      <KpiGrid items={[
        { l: "Logs Today", v: "1.4M", color: "#6366F1", icon: "📋" },
        { l: "Flagged", v: "28", color: "#EF4444", icon: "🚩" },
        { l: "Resolved", v: "94%", color: "#10B981", icon: "✅" },
      ]} />
      <ChipList title="📋 LOG FIELDS" items={["User", "Role", "Action", "Time", "IP", "Device"]} color="#6366F1" />
      <div style={S.sectionTitle}>📜 RECENT AUDIT LOGS</div>
      {logs.map((l, i) => (
        <div key={i} style={{ ...S.glass(), padding: "12px 14px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>{l.user}</span>
            <span style={{ fontSize: 9, color: "#9CA3AF" }}>{l.time}</span>
          </div>
          <div style={{ fontSize: 10, color: "#60A5FA", marginBottom: 3 }}>{l.action}</div>
          <div style={{ fontSize: 9, color: "#4B5563" }}>IP: {l.ip}</div>
        </div>
      ))}
    </PageShell>
  );
}

function BroadcastCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Users");
  const [type, setType] = useState("Push Notification");
  const targets = ["All Users", "Hosts", "Agents", "Agencies", "Managers"];
  const types = ["Push Notification", "Email", "In-App Message", "SMS"];

  return (
    <PageShell title="📢 Broadcast Center" subtitle="Platform Communication System" onBack={onBack}>
      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>👥 SEND TO</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {targets.map(t => (
            <motion.button key={t} whileTap={{ scale: 0.92 }} onClick={() => setTarget(t)}
              style={{ padding: "5px 12px", borderRadius: 16, fontSize: 9, fontWeight: 800, border: "none", cursor: "pointer", background: target === t ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "rgba(255,255,255,0.06)", color: target === t ? "#fff" : "#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>📡 MESSAGE TYPE</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {types.map(t => (
            <motion.button key={t} whileTap={{ scale: 0.92 }} onClick={() => setType(t)}
              style={{ padding: "5px 12px", borderRadius: 16, fontSize: 9, fontWeight: 800, border: "none", cursor: "pointer", background: type === t ? "linear-gradient(135deg,#F59E0B,#D97706)" : "rgba(255,255,255,0.06)", color: type === t ? "#fff" : "#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>✍️ MESSAGE CONTENT</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4}
          placeholder="Write your broadcast message here…"
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(31,107,255,0.2)", borderRadius: 12, padding: "10px 13px", color: "#fff", fontSize: 12, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
        <motion.button whileTap={{ scale: 0.96 }}
          style={{ width: "100%", marginTop: 10, padding: "13px", borderRadius: 13, border: "none", cursor: "pointer", fontWeight: 900, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#1F6BFF,#7C3AED)", boxShadow: "0 6px 20px rgba(31,107,255,0.35)" }}>
          📢 Send Broadcast
        </motion.button>
      </div>
    </PageShell>
  );
}

function SystemAutomationCenter({ onBack }) {
  const rules = [
    { name: "Auto Approval: Host LV20+",         status: "Active",   runs: "284/day",  color: "#10B981" },
    { name: "Auto VIP Upgrade on 1M Coins",       status: "Active",   runs: "48/day",   color: "#A78BFA" },
    { name: "Auto Reward: Daily Login Bonus",     status: "Active",   runs: "14.2K/day",color: "#FFC83D" },
    { name: "Auto Commission: Agent 10%",         status: "Active",   runs: "1.8K/day", color: "#60A5FA" },
    { name: "Auto Ban: 5+ Violations",            status: "Paused",   runs: "12/day",   color: "#EF4444" },
  ];

  return (
    <PageShell title="⚙️ System Automation Center" subtitle="Workflow & Rule Engine" onBack={onBack}>
      <KpiGrid items={[
        { l: "Active Rules", v: "148", color: "#10B981", icon: "⚙️" },
        { l: "Runs/Day", v: "24K", color: "#60A5FA", icon: "🔄" },
        { l: "Success Rate", v: "99.7%", color: "#FFC83D", icon: "✅" },
      ]} />
      {rules.map((r, i) => (
        <motion.div key={r.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 3 }}>{r.name}</div>
            <div style={{ fontSize: 9, color: "#60A5FA" }}>{r.runs}</div>
          </div>
          <div style={{ padding: "3px 9px", borderRadius: 8, background: `${r.color}18`, border: `1px solid ${r.color}30` }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: r.color }}>{r.status}</span>
          </div>
        </motion.div>
      ))}
      <ChipList title="🔧 AUTOMATION TYPES" items={["Auto Approval", "Auto VIP Upgrade", "Auto Rewards", "Auto Commissions"]} color="#10B981" />
    </PageShell>
  );
}

function BusinessIntelligenceCenter({ onBack }) {
  return (
    <PageShell title="📈 Business Intelligence" subtitle="Executive Analytics & Forecasting" onBack={onBack}>
      <KpiGrid items={[
        { l: "Reports", v: "84", color: "#10B981", icon: "📊" },
        { l: "Forecast", v: "+22% QoQ", color: "#FFC83D", icon: "📈" },
        { l: "Markets", v: "47", color: "#60A5FA", icon: "🌍" },
      ]} />
      <div style={{ ...S.glass(), padding: "14px", marginBottom: 14 }}>
        <div style={S.sectionTitle}>📊 GROWTH FORECAST (Monthly)</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={[...revenueData, { d: "Jul", v: 108 }, { d: "Aug", v: 124 }]}>
            <defs><linearGradient id="bi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.5} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#60A5FA" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0D1B3E", border: "1px solid #10B981", borderRadius: 8, color: "#fff", fontSize: 10 }} />
            <Area type="monotone" dataKey="v" stroke="#10B981" fill="url(#bi)" strokeWidth={2} dot={{ fill: "#FFC83D", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ChipList title="🎯 INSIGHTS" items={["Revenue Forecast", "Growth Forecast", "Expansion Forecast", "Best Markets", "Weak Markets", "Opportunities"]} color="#10B981" />
    </PageShell>
  );
}

function CoinsWalletCenter({ onBack }) {
  const PRIMARY_BALANCE = 1_000_000_000_000;
  const OFFLINE_BALANCE = 1_000_000_000_000;
  const TOTAL = PRIMARY_BALANCE + OFFLINE_BALANCE;

  const fmtFull = (n) => n.toLocaleString();
  const fmtShort = (n) => {
    if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(0)} Trillion`;
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)} Billion`;
    return fmtFull(n);
  };

  const wallets = [
    {
      name: "VYRO Primary Coin Wallet",
      type: "Primary · Live Wallet",
      balance: PRIMARY_BALANCE,
      icon: "🪙",
      gradient: "linear-gradient(135deg,#1F6BFF,#0D1B3E)",
      accent: "#FFC83D",
      glow: "rgba(31,107,255,0.4)",
      status: "Active",
      statusColor: "#22C55E",
      tag: "LIVE WALLET",
    },
    {
      name: "Offline Coin Reserve",
      type: "Reserve · Offline System Ops",
      balance: OFFLINE_BALANCE,
      icon: "🏦",
      gradient: "linear-gradient(135deg,#7C3AED,#4C1D95)",
      accent: "#C084FC",
      glow: "rgba(124,58,237,0.4)",
      status: "Reserve",
      statusColor: "#C084FC",
      tag: "OFFLINE RESERVE",
    },
  ];

  const txHistory = [
    { type: "System Top-Up",    amount: "+500B",  time: "Today",    color: "#10B981" },
    { type: "Platform Reserve", amount: "+1T",    time: "Genesis",  color: "#FFC83D" },
    { type: "Owner Allocation", amount: "+500B",  time: "Genesis",  color: "#60A5FA" },
  ];

  return (
    <PageShell title="🪙 Coins Wallet" subtitle="Owner Wallet System · Enterprise" onBack={onBack}>
      {/* Total Balance Hero */}
      <div style={{
        background: "linear-gradient(135deg,#0D1B3E,#1F6BFF,#7C3AED)",
        borderRadius: 20, padding: "20px 18px", marginBottom: 14,
        boxShadow: "0 10px 36px rgba(31,107,255,0.4)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,200,61,0.12)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 800, letterSpacing: "0.08em", marginBottom: 5 }}>COMBINED TOTAL BALANCE</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#FFC83D", lineHeight: 1 }}>2 Trillion</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{fmtFull(TOTAL)} Coins</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#FFC83D" }}>1 Trillion</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Primary</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#C084FC" }}>1 Trillion</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Reserve</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#22C55E" }}>Active</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>Status</div>
          </div>
        </div>
      </div>

      {/* Wallet Cards */}
      {wallets.map((w, i) => (
        <motion.div key={w.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          style={{ borderRadius: 18, overflow: "hidden", marginBottom: 12, boxShadow: `0 8px 28px ${w.glow}` }}>
          {/* Card top */}
          <div style={{ background: w.gradient, padding: "16px 16px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
            {/* Tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "2px 8px", marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: w.statusColor }} />
              <span style={{ fontSize: 8, fontWeight: 900, color: "rgba(255,255,255,0.8)", letterSpacing: "0.07em" }}>{w.tag}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 26 }}>{w.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{w.name}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{w.type}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", marginBottom: 2 }}>BALANCE</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: w.accent, lineHeight: 1 }}>{fmtShort(w.balance)}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{fmtFull(w.balance)} Coins</div>
            </div>
          </div>
          {/* Card footer */}
          <div style={{ background: "#fff", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: w.statusColor }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: "#374151" }}>{w.status}</span>
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#9CA3AF", background: "#F3F4F6", borderRadius: 8, padding: "2px 8px" }}>Owner Only</span>
          </div>
        </motion.div>
      ))}

      {/* Transaction History */}
      <div style={{ ...S.glass(), padding: "14px", marginBottom: 12 }}>
        <div style={S.sectionTitle}>📜 WALLET HISTORY</div>
        {txHistory.map((tx, i) => (
          <div key={tx.type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < txHistory.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{tx.type}</div>
              <div style={{ fontSize: 9, color: "#60A5FA" }}>{tx.time}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: tx.color }}>{tx.amount}</span>
          </div>
        ))}
      </div>

      <ActionRow title="⚡ WALLET ACTIONS" actions={["Top-Up Coins", "Transfer Coins", "Audit Wallet", "Export Report"]} />
    </PageShell>
  );
}

function GlobalSettingsCenter({ onBack }) {
  const settings = [
    { name: "Coin Settings",       icon: "🪙", desc: "Packages, pricing, bonuses", color: "#FFC83D" },
    { name: "Gift Settings",       icon: "🎁", desc: "Categories, pricing, limits", color: "#EC4899" },
    { name: "VIP Settings",        icon: "👑", desc: "Tiers, benefits, pricing",    color: "#A78BFA" },
    { name: "Security Settings",   icon: "🛡️", desc: "Auth, bans, device rules",    color: "#EF4444" },
    { name: "Payment Settings",    icon: "💳", desc: "Gateways, limits, methods",   color: "#10B981" },
    { name: "Commission Settings", icon: "💰", desc: "Agent/agency commission %",   color: "#60A5FA" },
  ];

  return (
    <PageShell title="🔧 Global Settings Center" subtitle="Platform Configuration" onBack={onBack}>
      {settings.map((s, i) => (
        <motion.div key={s.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{s.name}</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>{s.desc}</div>
          </div>
          <span style={{ fontSize: 16, color: "#4B5563" }}>›</span>
        </motion.div>
      ))}
    </PageShell>
  );
}

function OwnerExclusivePowers({ onBack }) {
  const [confirm, setConfirm] = useState(null);
  const powers = [
    { name: "Full Platform Access",     icon: "🔓", desc: "Unrestricted access to all system data", color: "#1F6BFF",  danger: false },
    { name: "Global Revenue Lock",      icon: "🔒", desc: "Lock all financial transactions globally", color: "#F59E0B", danger: true },
    { name: "Emergency Maintenance",    icon: "⚠️", desc: "Put platform into maintenance mode",       color: "#F59E0B", danger: true },
    { name: "Emergency Shutdown",       icon: "🔴", desc: "Immediate full platform shutdown",          color: "#EF4444", danger: true },
    { name: "Ownership Transfer",       icon: "👑", desc: "Transfer platform ownership",               color: "#EF4444", danger: true },
    { name: "Root System Access",       icon: "🚀", desc: "Full root-level system control",             color: "#DC2626", danger: true },
  ];

  return (
    <PageShell title="🚀 Owner Exclusive Powers" subtitle="Supreme Authority Controls" onBack={onBack}>
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "#EF4444", marginBottom: 4 }}>⚠️ RESTRICTED ACCESS</div>
        <div style={{ fontSize: 10, color: "#DCE3F0", lineHeight: 1.6 }}>These controls are reserved exclusively for the Platform Owner. All actions are logged and irreversible. Proceed with extreme caution.</div>
      </div>

      {powers.map((p, i) => (
        <motion.div key={p.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          style={{ ...S.glass(), padding: "13px 14px", marginBottom: 10, borderLeft: `3px solid ${p.color}` }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "#60A5FA" }}>{p.desc}</div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setConfirm(p)}
              style={{ padding: "7px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 800, color: "#fff", background: p.danger ? "linear-gradient(135deg,#EF4444,#B91C1C)" : "linear-gradient(135deg,#1F6BFF,#6366F1)" }}>
              {p.danger ? "⚡ Activate" : "Open"}
            </motion.button>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setConfirm(null)}>
            <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#0D1B3E", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 20, padding: 22, maxWidth: 320, width: "100%" }}>
              <div style={{ fontSize: 30, textAlign: "center", marginBottom: 12 }}>⚠️</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: 8 }}>Confirm Action</div>
              <div style={{ fontSize: 12, color: "#DCE3F0", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
                Are you sure you want to activate <strong style={{ color: "#EF4444" }}>{confirm.name}</strong>? This action is irreversible.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setConfirm(null)}
                  style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, color: "#fff", background: "rgba(255,255,255,0.08)" }}>
                  Cancel
                </motion.button>
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setConfirm(null)}
                  style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, color: "#fff", background: "linear-gradient(135deg,#EF4444,#B91C1C)" }}>
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

/* ─────────────── MODULE REGISTRY ─────────────── */
const MODULE_SCREENS = {
  wallet:       CoinsWalletCenter,
  home:         DashboardHome,
  search:       GlobalSearchCenter,
  country:      CountryControlCenter,
  roles:        RoleManagementCenter,
  applications: GlobalApplicationsCenter,
  revenue:      GlobalRevenueCenter,
  gifts:        GlobalGiftCenter,
  coins:        CoinEconomyCenter,
  rankings:     GlobalRankingsCenter,
  live:         LiveMonitoringCenter,
  ai:           AIMonitoringCenter,
  security:     SecurityCommandCenter,
  finance:      GlobalFinanceCenter,
  audit:        GlobalAuditCenter,
  broadcast:    BroadcastCenter,
  automation:   SystemAutomationCenter,
  bi:           BusinessIntelligenceCenter,
  settings:     GlobalSettingsCenter,
  powers:       OwnerExclusivePowers,
};

const MODULES = [
  { id: "home",         icon: "🌍", label: "Dashboard Home",       subtitle: "Executive Overview",       gradient: "linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow: "rgba(31,107,255,0.4)" },
  { id: "search",       icon: "🔍", label: "Global Search",        subtitle: "AI Search Engine",          gradient: "linear-gradient(145deg,#0EA5E9,#0369A1)", glow: "rgba(14,165,233,0.35)" },
  { id: "country",      icon: "🌎", label: "Country Control",      subtitle: "World Operations",          gradient: "linear-gradient(145deg,#10B981,#065F46)", glow: "rgba(16,185,129,0.35)" },
  { id: "roles",        icon: "👑", label: "Role Management",      subtitle: "Authority Control",         gradient: "linear-gradient(145deg,#FFC83D,#D97706)", glow: "rgba(255,200,61,0.4)" },
  { id: "applications", icon: "📋", label: "Applications",         subtitle: "Approval Board",            gradient: "linear-gradient(145deg,#7C3AED,#4C1D95)", glow: "rgba(124,58,237,0.35)" },
  { id: "revenue",      icon: "💰", label: "Revenue Center",       subtitle: "Financial Analytics",       gradient: "linear-gradient(145deg,#F59E0B,#B45309)", glow: "rgba(245,158,11,0.35)" },
  { id: "gifts",        icon: "🎁", label: "Gift Center",          subtitle: "Gift Economy",              gradient: "linear-gradient(145deg,#EC4899,#9D174D)", glow: "rgba(236,72,153,0.35)" },
  { id: "coins",        icon: "🪙", label: "Coin Economy",         subtitle: "Currency Control",          gradient: "linear-gradient(145deg,#F97316,#C2410C)", glow: "rgba(249,115,22,0.35)" },
  { id: "rankings",     icon: "🏆", label: "Rankings",             subtitle: "Champion Leaderboards",     gradient: "linear-gradient(145deg,#FFC83D,#1F6BFF)", glow: "rgba(255,200,61,0.35)" },
  { id: "live",         icon: "📡", label: "Live Monitoring",      subtitle: "Real-Time Streams",         gradient: "linear-gradient(145deg,#EF4444,#B91C1C)", glow: "rgba(239,68,68,0.35)" },
  { id: "ai",           icon: "🤖", label: "AI Monitoring",        subtitle: "Threat Intelligence",       gradient: "linear-gradient(145deg,#06B6D4,#0E7490)", glow: "rgba(6,182,212,0.35)" },
  { id: "security",     icon: "🛡️", label: "Security Center",      subtitle: "Cyber Protection",          gradient: "linear-gradient(145deg,#1F6BFF,#7C3AED)", glow: "rgba(31,107,255,0.35)" },
  { id: "finance",      icon: "🏦", label: "Finance Center",       subtitle: "Banking Operations",        gradient: "linear-gradient(145deg,#10B981,#1F6BFF)", glow: "rgba(16,185,129,0.3)" },
  { id: "audit",        icon: "📑", label: "Audit Center",         subtitle: "Compliance Monitor",        gradient: "linear-gradient(145deg,#6366F1,#3730A3)", glow: "rgba(99,102,241,0.35)" },
  { id: "broadcast",    icon: "📢", label: "Broadcast Center",     subtitle: "Platform Comms",            gradient: "linear-gradient(145deg,#F59E0B,#7C3AED)", glow: "rgba(245,158,11,0.3)" },
  { id: "automation",   icon: "⚙️", label: "Automation",           subtitle: "Workflow Engine",           gradient: "linear-gradient(145deg,#374151,#0D1B3E)", glow: "rgba(55,65,81,0.4)" },
  { id: "bi",           icon: "📈", label: "BI Center",            subtitle: "Executive Analytics",       gradient: "linear-gradient(145deg,#10B981,#059669)", glow: "rgba(16,185,129,0.35)" },
  { id: "settings",     icon: "🔧", label: "Global Settings",      subtitle: "Platform Config",           gradient: "linear-gradient(145deg,#0EA5E9,#7C3AED)", glow: "rgba(14,165,233,0.3)" },
  { id: "powers",       icon: "🚀", label: "Owner Powers",         subtitle: "Supreme Authority",         gradient: "linear-gradient(145deg,#FFC83D,#EF4444)", glow: "rgba(255,200,61,0.5)", featured: true },
  { id: "wallet",       icon: "🪙", label: "Coins Wallet",         subtitle: "Owner Wallet · 2T Coins",    gradient: "linear-gradient(145deg,#FFC83D,#1F6BFF)", glow: "rgba(255,200,61,0.5)", featured: true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(5,10,24,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(31,107,255,0.2)", boxShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(31,107,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#60A5FA" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>🚀 Master Control Center</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>Owner Dashboard · Enterprise International Level</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D" }}>👑 OWNER</span></div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "16px 14px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(31,107,255,0.18),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...S.glass(), padding: "18px", marginBottom: 14 }}>
          <div style={{ height: 3, borderRadius: 2, background: "linear-gradient(90deg,#FFC83D,#1F6BFF,#7C3AED)", marginBottom: 14 }} />
          <div style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", marginBottom: 4, letterSpacing: "0.1em" }}>VYRO LIVE · ENTERPRISE INTERNATIONAL LEVEL</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Owner Dashboard</div>
          <div style={{ fontSize: 11, color: "#DCE3F0", lineHeight: 1.7 }}>Complete visibility, AI intelligence, financial control, and executive analytics across the entire global platform.</div>
        </div>
        <KpiGrid items={[
          { l: "Countries", v: "47", color: "#60A5FA", icon: "🌍" },
          { l: "Total Users", v: "2.8M", color: "#10B981", icon: "👥" },
          { l: "Today Revenue", v: "$94.8K", color: "#FFC83D", icon: "💰" },
          { l: "Live Streams", v: "1,284", color: "#EF4444", icon: "📡" },
          { l: "Active PK", v: "47", color: "#A78BFA", icon: "⚔️" },
          { l: "Security", v: "A+", color: "#10B981", icon: "🛡️" },
        ]} />
      </div>

      {/* Module Grid */}
      <div style={{ padding: "0 14px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", marginBottom: 14, letterSpacing: "0.08em" }}>
          {MODULES.length} MANAGEMENT MODULES · TAP TO ACCESS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {MODULES.map((mod, i) => (
            <motion.div key={mod.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025, duration: 0.2 }}
              whileTap={{ scale: 0.91 }} onClick={() => setActiveModule(mod.id)} style={{ cursor: "pointer" }}>
              <div style={{
                borderRadius: 18, overflow: "hidden",
                background: mod.featured ? "rgba(255,200,61,0.07)" : "rgba(255,255,255,0.04)",
                border: mod.featured ? "1.5px solid rgba(255,200,61,0.3)" : "1.5px solid rgba(31,107,255,0.14)",
                backdropFilter: "blur(10px)",
                boxShadow: `0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "15px 5px 12px", position: "relative",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "18px 18px 0 0",
                  background: mod.featured ? "linear-gradient(90deg,#FFC83D,#EF4444,#FFC83D)" : `linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0] ?? "#1F6BFF"},rgba(255,200,61,0.4))` }} />
                <div style={{ width: 50, height: 50, borderRadius: 14, marginBottom: 8, background: mod.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23,
                  boxShadow: `0 5px 16px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.25)`,
                  position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: "14%", right: 0, height: "42%", background: "linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)", borderRadius: "0 0 50% 50%" }} />
                  {mod.icon}
                </div>
                <div style={{ fontSize: 9, fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.3, marginBottom: 2 }}>{mod.label}</div>
                <div style={{ fontSize: 7.5, fontWeight: 600, color: "#60A5FA", textAlign: "center", lineHeight: 1.2 }}>{mod.subtitle}</div>
                {mod.featured && <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#FFC83D", boxShadow: "0 0 7px rgba(255,200,61,0.8)" }} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}