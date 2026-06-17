/**
 * AgencyDashboardPage — Enterprise Agency Management Center
 * Access: Profile > More Services > Control Center > Agency Dashboard
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

/* ─── Helpers ─── */
function SLabel({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>;
}
function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${color}18`, boxShadow: `0 2px 8px ${color}08` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, margin: "0 auto 6px", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}
function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: "#F0F0F8", overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
        style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg,${color},${color}AA)` }} />
    </div>
  );
}
function Btn({ label, color, outline, small, onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.93 }} onClick={onClick}
      style={{ padding: small ? "6px 12px" : "10px 16px", borderRadius: 11, fontSize: small ? 10 : 12, fontWeight: 800, border: outline ? `1.5px solid ${color}` : "none", cursor: "pointer", background: outline ? "transparent" : color, color: outline ? color : "#fff", flexShrink: 0 }}>
      {label}
    </motion.button>
  );
}

const TABS = [
  { id: "overview",    label: "Overview",    icon: "🏢" },
  { id: "hosts",       label: "Hosts",       icon: "👥" },
  { id: "recruitment", label: "Recruitment", icon: "📋" },
  { id: "revenue",     label: "Revenue",     icon: "💰" },
  { id: "analytics",   label: "Analytics",   icon: "📊" },
  { id: "events",      label: "Events",      icon: "🎯" },
  { id: "compliance",  label: "Compliance",  icon: "🛡️" },
  { id: "leaderboard", label: "Rankings",    icon: "🏆" },
];

/* ══════════ OVERVIEW ══════════ */
function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Agency Hero */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#0EA5E9)", borderRadius: 20, padding: 18, boxShadow: "0 8px 28px rgba(14,165,233,0.28)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: "2px solid rgba(255,255,255,0.25)" }}>🏢</div>
            <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: "#10B981", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, color: "#fff" }}>✓</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO Stars Agency</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>ID: #AG2024001 · Gold Tier</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "#10B98122", color: "#10B981", border: "1px solid #10B98133" }}>✅ Verified</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}>Gold Tier</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#FFC83D" }}>LV12</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Agency Level</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Performance Score", v: "9.4/10", icon: "⭐" },{ l: "Global Rank", v: "#38", icon: "🌍" },{ l: "Monthly Revenue", v: "$14.2K", icon: "💰" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.14)" }}>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <SLabel label="⚡ AGENCY QUICK STATS" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { icon: "👥", label: "Total Hosts",    value: "24",     color: "#1F6BFF" },
          { icon: "🟢", label: "Active Hosts",   value: "18",     color: "#10B981" },
          { icon: "💤", label: "Inactive",       value: "6",      color: "#9CA3AF" },
          { icon: "🆕", label: "New Recruits",   value: "3",      color: "#F59E0B" },
          { icon: "📈", label: "Growth Rate",    value: "+12%",   color: "#A855F7" },
          { icon: "🎯", label: "Success Rate",   value: "88%",    color: "#0EA5E9" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Activity */}
      <SLabel label="📋 RECENT ACTIVITY" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { icon: "🆕", text: "New host application — @Ahmad_AE",      time: "1h ago",  color: "#10B981" },
          { icon: "🎁", text: "Revenue milestone: $14K monthly",        time: "3h ago",  color: "#F59E0B" },
          { icon: "⚠️", text: "Host @Sara_QA — performance warning",    time: "5h ago",  color: "#EF4444" },
          { icon: "🏆", text: "Agency rank up → #38 globally",          time: "1d ago",  color: "#A855F7" },
          { icon: "✅", text: "Host @Khaled_SA approved & onboarded",   time: "2d ago",  color: "#1F6BFF" },
        ].map((a, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${a.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
            <span style={{ flex: 1, fontSize: 12, color: "#374151" }}>{a.text}</span>
            <span style={{ fontSize: 9, color: "#C4C9D4" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ HOST MANAGEMENT ══════════ */
function HostsTab() {
  const [filter, setFilter] = useState("all");
  const HOSTS = [
    { id: 1, name: "@Layla_QA",   flag: "🇶🇦", status: "active",   level: "LV42", revenue: "$820",  score: 9.1, joined: "Jan 2024" },
    { id: 2, name: "@Khaled_SA",  flag: "🇸🇦", status: "active",   level: "LV38", revenue: "$740",  score: 8.8, joined: "Mar 2024" },
    { id: 3, name: "@Sara_AE",    flag: "🇦🇪", status: "active",   level: "LV55", revenue: "$1,140",score: 9.4, joined: "Nov 2023" },
    { id: 4, name: "@Omar_EG",    flag: "🇪🇬", status: "active",   level: "LV29", revenue: "$480",  score: 8.2, joined: "Apr 2024" },
    { id: 5, name: "@Noor_QA",    flag: "🇶🇦", status: "inactive", level: "LV18", revenue: "$80",   score: 5.4, joined: "Jun 2024" },
    { id: 6, name: "@Ahmad_SA",   flag: "🇸🇦", status: "recruit",  level: "LV8",  revenue: "—",     score: null, joined: "Pending" },
  ];
  const statusColor = { active: "#10B981", inactive: "#9CA3AF", recruit: "#F59E0B" };
  const visible = filter === "all" ? HOSTS : HOSTS.filter(h => h.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ icon: "👥", l: "Total", v: "24", c: "#1F6BFF" },{ icon: "🟢", l: "Active", v: "18", c: "#10B981" },{ icon: "💤", l: "Inactive", v: "6", c: "#9CA3AF" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <div style={{ display: "flex", gap: 7, overflowX: "auto" }}>
        {[{ id: "all", l: "All Hosts" },{ id: "active", l: "Active" },{ id: "inactive", l: "Inactive" },{ id: "recruit", l: "New Recruits" }].map(f => (
          <motion.button key={f.id} whileTap={{ scale: 0.92 }} onClick={() => setFilter(f.id)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 16, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", background: filter === f.id ? "linear-gradient(135deg,#0EA5E9,#1F6BFF)" : "#fff", color: filter === f.id ? "#fff" : "#6B7280", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {f.l}
          </motion.button>
        ))}
      </div>

      {visible.map(host => (
        <div key={host.id} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: `${statusColor[host.status]}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{host.flag}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{host.name}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${statusColor[host.status]}12`, color: statusColor[host.status] }}>{host.status}</span>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>{host.level}</span>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>💰 {host.revenue}/mo</span>
              {host.score && <span style={{ fontSize: 9, color: "#F59E0B" }}>⭐ {host.score}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {host.status === "recruit"
              ? <Btn label="Approve" color="#10B981" small />
              : <Btn label="View" color="#1F6BFF" small outline />
            }
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════ RECRUITMENT ══════════ */
function RecruitmentTab() {
  const APPS = [
    { id: 1, name: "@Ahmad_AE",  flag: "🇦🇪", level: "LV22", applied: "2h ago",  status: "Pending",  color: "#F59E0B" },
    { id: 2, name: "@Rana_SA",   flag: "🇸🇦", level: "LV18", applied: "6h ago",  status: "Interview",color: "#1F6BFF" },
    { id: 3, name: "@Yousef_QA", flag: "🇶🇦", level: "LV31", applied: "1d ago",  status: "Approved", color: "#10B981" },
    { id: 4, name: "@Mia_EG",    flag: "🇪🇬", level: "LV14", applied: "2d ago",  status: "Rejected", color: "#EF4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ icon: "📥", l: "Applications", v: "12", c: "#1F6BFF" },{ icon: "✅", l: "Approved", v: "7", c: "#10B981" },{ icon: "🎯", l: "Success Rate", v: "88%", c: "#F59E0B" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 14, padding: 14, border: "1px solid #C7D2FE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>📤 Send Recruitment Invitation</div>
          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Invite qualified users to join your agency</div>
        </div>
        <Btn label="Send Invite" color="linear-gradient(135deg,#1F6BFF,#6366F1)" />
      </div>

      <SLabel label="📋 RECENT APPLICATIONS" />
      {APPS.map(app => (
        <div key={app.id} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: `${app.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{app.flag}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 3 }}>{app.name}</div>
            <div style={{ display: "flex", gap: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${app.color}12`, color: app.color }}>● {app.status}</span>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>{app.level} · {app.applied}</span>
            </div>
          </div>
          {app.status === "Pending" && (
            <div style={{ display: "flex", gap: 6 }}>
              <Btn label="✓" color="#10B981" small />
              <Btn label="✕" color="#EF4444" small outline />
            </div>
          )}
          {app.status === "Interview" && <Btn label="Schedule" color="#1F6BFF" small />}
          {(app.status === "Approved" || app.status === "Rejected") && (
            <span style={{ fontSize: 16 }}>{app.status === "Approved" ? "✅" : "❌"}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════ REVENUE ══════════ */
function RevenueTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#10B98188)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(16,185,129,0.22)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 4, letterSpacing: "0.06em" }}>💰 TOTAL AGENCY REVENUE</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginBottom: 2 }}>$68,420</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>All-time agency earnings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Today", v: "$480" },{ l: "This Week", v: "$3,120" },{ l: "This Month", v: "$14,200" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 11, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <motion.button whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "#fff", color: "#10B981", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>💳 Withdraw</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📄 Download Report</motion.button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "🤝", l: "Commission",       v: "$20,526", c: "#1F6BFF" },{ icon: "🎁", l: "Host Gifts",       v: "$38,240", c: "#EC4899" },{ icon: "🏆", l: "Event Rewards",    v: "$5,820",  c: "#F59E0B" },{ icon: "📈", l: "Growth Bonus",    v: "$3,834",  c: "#A855F7" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="🏆 TOP EARNING HOSTS" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { name: "@Sara_AE",   flag: "🇦🇪", rev: "$1,140", pct: 95, color: "#F59E0B" },
          { name: "@Layla_QA",  flag: "🇶🇦", rev: "$820",   pct: 72, color: "#1F6BFF" },
          { name: "@Khaled_SA", flag: "🇸🇦", rev: "$740",   pct: 65, color: "#10B981" },
          { name: "@Omar_EG",   flag: "🇪🇬", rev: "$480",   pct: 42, color: "#A855F7" },
        ].map((h, i, arr) => (
          <div key={i} style={{ padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{h.flag} {h.name}</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: h.color }}>{h.rev}</span>
            </div>
            <ProgressBar pct={h.pct} color={h.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ ANALYTICS ══════════ */
function AnalyticsTab() {
  const kpis = [
    { label: "Host Retention Rate",      pct: 87, color: "#1F6BFF" },
    { label: "Recruitment Success Rate", pct: 88, color: "#10B981" },
    { label: "Monthly Revenue Growth",   pct: 72, color: "#F59E0B" },
    { label: "Audience Reach",           pct: 91, color: "#A855F7" },
    { label: "Agency Activity Score",    pct: 94, color: "#0EA5E9" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "📈", l: "Growth Rate",      v: "+12%",  c: "#10B981" },{ icon: "⭐", l: "Perf. Score",     v: "9.4",   c: "#F59E0B" },{ icon: "👥", l: "Total Hosts",     v: "24",    c: "#1F6BFF" },{ icon: "🌍", l: "Countries",        v: "4",     c: "#A855F7" },{ icon: "🎙️", l: "Active Streams",   v: "11",    c: "#EC4899" },{ icon: "💬", l: "Engagement Index", v: "8.9",   c: "#0EA5E9" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="📊 KPI DASHBOARD" />
      {kpis.map((k, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{k.label}</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: k.color }}>{k.pct}%</span>
          </div>
          <ProgressBar pct={k.pct} color={k.color} />
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn label="📥 Export Analytics" color="linear-gradient(135deg,#1F6BFF,#6366F1)" />
        <Btn label="📄 Generate Report" color="#10B981" outline />
      </div>
    </div>
  );
}

/* ══════════ EVENTS ══════════ */
function EventsTab() {
  const [campaigns] = useState([
    { id: 1, title: "Summer Recruitment Drive",  type: "Recruitment", status: "Active",  end: "Jun 30", icon: "☀️", color: "#F59E0B" },
    { id: 2, title: "Top Host Bonus Campaign",   type: "Reward",      status: "Active",  end: "Jun 25", icon: "🏆", color: "#10B981" },
    { id: 3, title: "Agency Anniversary Event",  type: "Event",       status: "Planned", end: "Jul 10", icon: "🎉", color: "#A855F7" },
    { id: 4, title: "Spring Host Challenge",     type: "Reward",      status: "Ended",   end: "May 31", icon: "🌸", color: "#9CA3AF" },
  ]);
  const statusColor = { Active: "#10B981", Planned: "#F59E0B", Ended: "#9CA3AF" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 14, padding: 14, border: "1px solid #C7D2FE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E" }}>🎯 Create New Campaign</div>
          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Launch recruitment or reward campaigns</div>
        </div>
        <Btn label="+ Create" color="linear-gradient(135deg,#1F6BFF,#6366F1)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "🎯", l: "Active", v: "2", c: "#10B981" },{ icon: "📅", l: "Planned", v: "1", c: "#F59E0B" },{ icon: "🏁", l: "Ended", v: "1", c: "#9CA3AF" },{ icon: "📊", l: "Total", v: "4", c: "#1F6BFF" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="📋 CAMPAIGNS & EVENTS" />
      {campaigns.map(c => (
        <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: `${c.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 3 }}>{c.title}</div>
            <div style={{ display: "flex", gap: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${statusColor[c.status]}12`, color: statusColor[c.status] }}>● {c.status}</span>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>{c.type} · Ends {c.end}</span>
            </div>
          </div>
          {c.status !== "Ended" && <Btn label="Edit" color="#1F6BFF" small outline />}
        </div>
      ))}
    </div>
  );
}

/* ══════════ COMPLIANCE ══════════ */
function ComplianceTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#10B98188)", borderRadius: 16, padding: 16, boxShadow: "0 6px 20px rgba(16,185,129,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 4, letterSpacing: "0.06em" }}>🛡️ AGENCY COMPLIANCE SCORE</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>95<span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>/100</span></div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Excellent Standing · Gold Tier Agency</div>
          </div>
          <div style={{ fontSize: 44 }}>🏆</div>
        </div>
      </div>

      {[{ icon: "⚠️", label: "Active Violations",    value: "0",           color: "#10B981" },{ icon: "📋", label: "Pending Warnings",    value: "1 Host",       color: "#F59E0B" },{ icon: "🔒", label: "Policy Breaches",     value: "None",         color: "#10B981" },{ icon: "📊", label: "Risk Level",           value: "Low",          color: "#10B981" },{ icon: "⚖️", label: "Open Appeals",         value: "0",            color: "#9CA3AF" }].map((item, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{item.label}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: item.color, marginTop: 2 }}>{item.value}</div>
          </div>
          <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn label="📋 View Report" color="linear-gradient(135deg,#1F6BFF,#6366F1)" />
        <Btn label="💬 Contact Team" color="#10B981" outline />
      </div>
    </div>
  );
}

/* ══════════ LEADERBOARD ══════════ */
function LeaderboardTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B88)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(245,158,11,0.2)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em" }}>🏆 AGENCY RANKINGS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[{ l: "Global Rank", v: "#38", icon: "🌍" },{ l: "Regional Rank", v: "#5", icon: "🌏" },{ l: "Revenue Rank", v: "#41", icon: "💰" },{ l: "Growth Rank", v: "#22", icon: "📈" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 10px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.14)" }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SLabel label="🏢 TOP AGENCIES GLOBALLY" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { rank: 1,  name: "Elite Stars Agency",  flag: "🇦🇪", rev: "$42K", score: "9.9", highlight: false },
          { rank: 2,  name: "ProHost Network",      flag: "🇸🇦", rev: "$38K", score: "9.7", highlight: false },
          { rank: 37, name: "Rising Stars",         flag: "🌍",  rev: "$15K", score: "9.5", highlight: false },
          { rank: 38, name: "VYRO Stars (You) 🏢",  flag: "🇶🇦", rev: "$14K", score: "9.4", highlight: true  },
          { rank: 39, name: "LivePro Agency",       flag: "🇪🇬", rev: "$13K", score: "9.2", highlight: false },
        ].map((a, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none", background: a.highlight ? "#F0F7FF" : "transparent" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: a.rank <= 3 ? "#F59E0B12" : "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: a.rank <= 3 ? "#F59E0B" : "#9CA3AF", flexShrink: 0 }}>#{a.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{a.name} {a.flag}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#F59E0B" }}>{a.rev}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>⭐ {a.score}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ MAIN ══════════ */
const PANELS = {
  overview:    <OverviewTab />,
  hosts:       <HostsTab />,
  recruitment: <RecruitmentTab />,
  revenue:     <RevenueTab />,
  analytics:   <AnalyticsTab />,
  events:      <EventsTab />,
  compliance:  <ComplianceTab />,
  leaderboard: <LeaderboardTab />,
};

export default function AgencyDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>🏢 Agency Dashboard</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Agency Management Center · Gold Tier</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#0EA5E9" }}>LV12</div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>Agency Level</div>
          </div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "0 16px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flexShrink: 0, padding: "10px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap", color: activeTab === t.id ? "#0EA5E9" : "#9CA3AF", borderBottom: activeTab === t.id ? "2px solid #0EA5E9" : "2px solid transparent" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          style={{ padding: 16 }}>
          {PANELS[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}