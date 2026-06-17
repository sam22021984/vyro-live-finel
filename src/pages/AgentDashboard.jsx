/**
 * AgentDashboard — Professional Agent Operations Center
 * Access: Profile > More Services > Control Center > Agent Dashboard
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

/* ─── Helpers ─── */
function fmt(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
function SLabel({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>;
}
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${color}18`, boxShadow: `0 2px 8px ${color}08` }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, margin: "0 auto 6px", background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1, lineHeight: 1.3 }}>{label}</div>
      {sub && <div style={{ fontSize: 9, fontWeight: 700, color, marginTop: 2 }}>{sub}</div>}
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
function Btn({ label, color, small, outline }) {
  return (
    <motion.button whileTap={{ scale: 0.93 }}
      style={{ padding: small ? "6px 12px" : "9px 16px", borderRadius: 10, fontSize: small ? 10 : 12, fontWeight: 800, border: outline ? `1.5px solid ${color}` : "none", cursor: "pointer", background: outline ? "transparent" : color, color: outline ? color : "#fff", flexShrink: 0 }}>
      {label}
    </motion.button>
  );
}

/* ─── TABS ─── */
const TABS = [
  { id: "overview",     label: "Overview",    icon: "📊" },
  { id: "recruitment",  label: "Recruitment", icon: "🎯" },
  { id: "hosts",        label: "Hosts",       icon: "👥" },
  { id: "targets",      label: "Targets",     icon: "📈" },
  { id: "earnings",     label: "Earnings",    icon: "💰" },
  { id: "analytics",    label: "Analytics",   icon: "📡" },
  { id: "tasks",        label: "Tasks",       icon: "✅" },
  { id: "compliance",   label: "Compliance",  icon: "🛡️" },
];

/* ══════════ OVERVIEW ══════════ */
function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Agent Profile Card */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)", borderRadius: 20, padding: 18, boxShadow: "0 8px 28px rgba(31,107,255,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "2px solid rgba(255,255,255,0.25)" }}>🤝</div>
            <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: "#10B981", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, color: "#fff" }}>✓</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO Agent</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>ID: #AG2024001 · VYRO Stars Agency</div>
            <div style={{ display: "flex", gap: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "#10B98125", color: "#10B981", border: "1px solid #10B98133" }}>✅ Verified</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}>Gold Agent</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFC83D" }}>LV8</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Agent Level</div>
          </div>
        </div>

        {/* Monthly Target */}
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 13, border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>Monthly Target</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: "#FFC83D" }}>74%</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "rgba(255,255,255,0.15)", overflow: "hidden", marginBottom: 6 }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "74%" }} transition={{ duration: 1 }}
              style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#FFC83D,#F59E0B)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>14 / 20 recruits</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>6 remaining</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <SLabel label="⚡ AGENT QUICK STATS" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "👥", label: "Total Recruits",   value: "47",    color: "#1F6BFF" },
            { icon: "🟢", label: "Active Hosts",     value: "32",    color: "#10B981" },
            { icon: "🎯", label: "Monthly Target",   value: "74%",   color: "#F59E0B" },
            { icon: "💰", label: "Commission",       value: "$1.2K", color: "#A855F7" },
            { icon: "📊", label: "Perf. Score",      value: "9.1",   color: "#0EA5E9" },
            { icon: "🔄", label: "Conversion",       value: "68%",   color: "#EC4899" },
          ].map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <SLabel label="📋 RECENT ACTIVITY" />
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
          {[
            { icon: "✅", text: "Host @Sara_Q approved",       time: "2h ago",  color: "#10B981" },
            { icon: "📨", text: "Invitation sent to @Khalid",   time: "4h ago",  color: "#1F6BFF" },
            { icon: "⭐", text: "Monthly bonus received",       time: "1d ago",  color: "#F59E0B" },
            { icon: "📋", text: "Report submitted to agency",   time: "2d ago",  color: "#A855F7" },
            { icon: "🚀", text: "Host @Nour hit LV20",          time: "3d ago",  color: "#0EA5E9" },
          ].map((a, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${a.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
              <span style={{ flex: 1, fontSize: 12, color: "#374151" }}>{a.text}</span>
              <span style={{ fontSize: 9, color: "#C4C9D4" }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ RECRUITMENT ══════════ */
function RecruitmentTab() {
  const [tab, setTab] = useState("pipeline");
  const candidates = [
    { name: "Fatima Al-Rashid", id: "@fatima_r",  stage: "Applied",    color: "#9CA3AF", country: "🇶🇦" },
    { name: "Omar Hassan",       id: "@omar_h",    stage: "Screening",  color: "#1F6BFF", country: "🇸🇦" },
    { name: "Lina Mansour",      id: "@lina_m",    stage: "Interview",  color: "#F59E0B", country: "🇦🇪" },
    { name: "Ahmed Noor",        id: "@ahmed_n",   stage: "Approved",   color: "#10B981", country: "🇪🇬" },
    { name: "Sara Khalil",       id: "@sara_k",    stage: "Rejected",   color: "#EF4444", country: "🇶🇦" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["pipeline", "statistics"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "9px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 12, textTransform: "capitalize", background: tab === t ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "#fff", color: tab === t ? "#fff" : "#6B7280", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>{t}</button>
        ))}
      </div>

      {tab === "pipeline" && (
        <>
          <motion.button whileTap={{ scale: 0.97 }}
            style={{ width: "100%", padding: "13px", borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(31,107,255,0.25)" }}>
            📨 Invite New Host
          </motion.button>

          <SLabel label="🎯 RECRUITMENT PIPELINE" />
          {candidates.map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{c.name} {c.country}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{c.id}</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: `${c.color}12`, color: c.color, border: `1px solid ${c.color}25` }}>{c.stage}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {c.stage === "Applied" && <Btn label="Review" color="#1F6BFF" small />}
                {c.stage === "Screening" && <Btn label="Interview" color="#F59E0B" small />}
                {c.stage === "Interview" && <Btn label="Approve" color="#10B981" small />}
                {c.stage === "Approved" && <Btn label="Onboard" color="#A855F7" small />}
                {c.stage === "Rejected" && <Btn label="View" color="#9CA3AF" small outline />}
                <Btn label="Contact" color="#0EA5E9" small outline />
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "statistics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "📨", label: "Total Invited",      value: "69",  color: "#1F6BFF" },
              { icon: "📋", label: "Applications",       value: "47",  color: "#A855F7" },
              { icon: "✅", label: "Approved",           value: "32",  color: "#10B981" },
              { icon: "❌", label: "Rejected",           value: "15",  color: "#EF4444" },
              { icon: "🔄", label: "Conversion Rate",    value: "68%", color: "#F59E0B" },
              { icon: "📅", label: "This Month",         value: "14",  color: "#0EA5E9" },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
            <SLabel label="📈 MONTHLY RECRUITMENT TREND" />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
              {[{ l: "Jan", v: 40 },{ l: "Feb", v: 55 },{ l: "Mar", v: 60 },{ l: "Apr", v: 75 },{ l: "May", v: 68 },{ l: "Jun", v: 74 }].map((b, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${b.v}%` }} transition={{ duration: 0.6, delay: i * 0.08 }}
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: "linear-gradient(180deg,#1F6BFF,#1F6BFF55)", minHeight: 3 }} />
                  <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{b.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════ HOSTS ══════════ */
function HostsTab() {
  const hosts = [
    { name: "Sara Al-Qahtani", id: "@sara_q",   level: "LV34", status: "Online", earnings: "18.2K", color: "#10B981" },
    { name: "Khalid Mansour",  id: "@khalid_m", level: "LV28", status: "Live",   earnings: "12.7K", color: "#1F6BFF" },
    { name: "Nour Farhan",     id: "@nour_f",   level: "LV22", status: "Offline",earnings: "8.1K",  color: "#9CA3AF" },
    { name: "Reem Hassan",     id: "@reem_h",   level: "LV19", status: "Online", earnings: "6.4K",  color: "#10B981" },
    { name: "Ali Karimi",      id: "@ali_k",    level: "LV15", status: "Offline",earnings: "3.9K",  color: "#9CA3AF" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ icon: "👥", l: "Total Hosts", v: "32", c: "#1F6BFF" },{ icon: "🟢", l: "Online Now", v: "14", c: "#10B981" },{ icon: "🔴", l: "Live Now", v: "6", c: "#EF4444" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="👥 ASSIGNED HOSTS" />
      {hosts.map((h, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎙️</div>
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: h.color, border: "1.5px solid #fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{h.name}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{h.id} · {h.level}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: h.color, marginTop: 2 }}>{h.status} · 🪙 {h.earnings} coins</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn label="Profile" color="#1F6BFF" small outline />
            <Btn label="Contact" color="#10B981" small />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════ TARGETS ══════════ */
function TargetsTab() {
  const targets = [
    { label: "Daily Recruits",     current: 2,  target: 3,   unit: "hosts",   color: "#1F6BFF" },
    { label: "Weekly Recruits",    current: 9,  target: 12,  unit: "hosts",   color: "#A855F7" },
    { label: "Monthly Recruits",   current: 14, target: 20,  unit: "hosts",   color: "#F59E0B" },
    { label: "Active Host Target", current: 32, target: 40,  unit: "active",  color: "#10B981" },
    { label: "Revenue Target",     current: 1200, target: 2000, unit: "$", color: "#EC4899" },
    { label: "Performance Score",  current: 91, target: 100, unit: "pts",     color: "#0EA5E9" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B88)", borderRadius: 16, padding: 16, boxShadow: "0 6px 20px rgba(245,158,11,0.2)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: "0.06em" }}>🎯 PERFORMANCE SCORE</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#FFC83D", marginBottom: 2 }}>9.1 / 10</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Gold Agent · Top 15% this month</div>
      </div>

      <SLabel label="📊 TARGET TRACKER" />
      {targets.map((t, i) => {
        const pct = Math.min(100, Math.round((t.current / t.target) * 100));
        return (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{t.label}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: t.color }}>{pct}%</span>
            </div>
            <ProgressBar pct={pct} color={t.color} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>{t.current} {t.unit}</span>
              <span style={{ fontSize: 9, color: "#9CA3AF" }}>Target: {t.target} {t.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════ EARNINGS ══════════ */
function EarningsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#A855F7)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(168,85,247,0.25)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: "0.06em" }}>💰 TOTAL EARNINGS</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 2 }}>$4,820</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>All-time agent commission</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[{ l: "This Month", v: "$1,200" },{ l: "Last Month", v: "$980" },{ l: "Recruitment Bonus", v: "$340" },{ l: "Perf. Bonus", v: "$180" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 11, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <motion.button whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "#fff", color: "#A855F7", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>💳 Withdraw</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📄 Statement</motion.button>
        </div>
      </div>

      <SLabel label="📜 EARNINGS HISTORY" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { label: "Recruitment Commission — Jun", amount: "+$820",  color: "#10B981", date: "Jun 15" },
          { label: "Performance Bonus — Jun",      amount: "+$180",  color: "#10B981", date: "Jun 10" },
          { label: "Recruitment Commission — May", amount: "+$740",  color: "#10B981", date: "May 31" },
          { label: "Withdrawal",                   amount: "-$600",  color: "#EF4444", date: "May 20" },
          { label: "Recruitment Bonus — May",      amount: "+$340",  color: "#10B981", date: "May 15" },
        ].map((tx, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tx.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{tx.color === "#10B981" ? "💰" : "💳"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0D1B3E" }}>{tx.label}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>{tx.date}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 900, color: tx.color }}>{tx.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ ANALYTICS ══════════ */
function AnalyticsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { icon: "📨", label: "Total Invitations",   value: "69",   color: "#1F6BFF" },
          { icon: "🔄", label: "Conversion Rate",     value: "68%",  color: "#10B981" },
          { icon: "📈", label: "Growth (MoM)",        value: "+12%", color: "#F59E0B" },
          { icon: "⏱️", label: "Avg. Time to Hire",  value: "4.2d", color: "#A855F7" },
          { icon: "💰", label: "Revenue Generated",   value: "$28K", color: "#EC4899" },
          { icon: "🏅", label: "Agency Rank",         value: "#5",   color: "#0EA5E9" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {[
        { label: "Invite → Apply Rate",  current: 68, color: "#1F6BFF" },
        { label: "Apply → Approve Rate", current: 74, color: "#10B981" },
        { label: "30-Day Retention",     current: 87, color: "#F59E0B" },
        { label: "Productivity Index",   current: 91, color: "#A855F7" },
      ].map((r, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: r.color }}>{r.current}%</span>
          </div>
          <ProgressBar pct={r.current} color={r.color} />
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <motion.button whileTap={{ scale: 0.96 }} style={{ flex: 1, padding: "12px", borderRadius: 13, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📊 Generate Report</motion.button>
        <motion.button whileTap={{ scale: 0.96 }} style={{ flex: 1, padding: "12px", borderRadius: 13, background: "#fff", color: "#1F6BFF", border: "1.5px solid #1F6BFF", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📤 Export Data</motion.button>
      </div>
    </div>
  );
}

/* ══════════ TASKS ══════════ */
function TasksTab() {
  const [claimed, setClaimed] = useState(new Set());
  const tasks = [
    { id: 1, type: "Daily",   icon: "☀️", title: "Invite 1 New Host",       reward: "$5",   done: true  },
    { id: 2, type: "Daily",   icon: "☀️", title: "Send 3 follow-up messages",reward: "$3",   done: false },
    { id: 3, type: "Weekly",  icon: "📆", title: "Recruit 5 New Hosts",      reward: "$40",  done: false },
    { id: 4, type: "Weekly",  icon: "📆", title: "Achieve 70% target",       reward: "$20",  done: true  },
    { id: 5, type: "Monthly", icon: "📅", title: "Reach 20 Recruits",        reward: "$150", done: false },
    { id: 6, type: "Monthly", icon: "📅", title: "Maintain 9.0+ score",      reward: "$80",  done: true  },
    { id: 7, type: "Badge",   icon: "🏅", title: "First 10 Recruits",        reward: "Badge",done: true  },
    { id: 8, type: "Badge",   icon: "🏆", title: "Gold Agent Status",        reward: "Title",done: true  },
  ];
  const typeColor = { Daily: "#F59E0B", Weekly: "#1F6BFF", Monthly: "#A855F7", Badge: "#10B981" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ icon: "✅", l: "Completed", v: tasks.filter(t => t.done).length, c: "#10B981" },{ icon: "⏳", l: "Pending", v: tasks.filter(t => !t.done).length, c: "#F59E0B" },{ icon: "🏅", l: "Badges", v: 4, c: "#A855F7" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="🎯 TASK CENTER" />
      {tasks.map((task, i) => (
        <div key={task.id} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, opacity: task.done && claimed.has(task.id) ? 0.5 : 1, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${typeColor[task.type]}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{task.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 2 }}>{task.title}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${typeColor[task.type]}12`, color: typeColor[task.type] }}>{task.type}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: "#FFF7ED", color: "#F59E0B" }}>🎁 {task.reward}</span>
            </div>
          </div>
          {task.done && !claimed.has(task.id)
            ? <motion.button whileTap={{ scale: 0.9 }} onClick={() => setClaimed(p => new Set([...p, task.id]))} style={{ padding: "7px 12px", borderRadius: 10, background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none", fontWeight: 800, fontSize: 10, cursor: "pointer" }}>Claim</motion.button>
            : task.done
              ? <span style={{ fontSize: 16 }}>✅</span>
              : <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>Pending</span>
          }
        </div>
      ))}
    </div>
  );
}

/* ══════════ COMPLIANCE ══════════ */
function ComplianceTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Score Card */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#10B981AA)", borderRadius: 16, padding: 16, boxShadow: "0 6px 20px rgba(16,185,129,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 4, letterSpacing: "0.06em" }}>🛡️ COMPLIANCE SCORE</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>98<span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>/100</span></div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Excellent Standing</div>
          </div>
          <div style={{ fontSize: 40 }}>✅</div>
        </div>
      </div>

      {/* Status Items */}
      {[
        { icon: "✅", label: "Violations",           value: "0 Active",       color: "#10B981" },
        { icon: "⚠️", label: "Warnings",             value: "1 (Resolved)",   color: "#F59E0B" },
        { icon: "📋", label: "Active Restrictions",   value: "None",           color: "#10B981" },
        { icon: "📜", label: "Appeals",               value: "0 Pending",      color: "#9CA3AF" },
      ].map((item, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{item.label}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: item.color, marginTop: 2 }}>{item.value}</div>
          </div>
          <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <motion.button whileTap={{ scale: 0.96 }} style={{ flex: 1, padding: "12px", borderRadius: 13, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📋 View History</motion.button>
        <motion.button whileTap={{ scale: 0.96 }} style={{ flex: 1, padding: "12px", borderRadius: 13, background: "#fff", color: "#EF4444", border: "1.5px solid #EF4444", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>⚖️ Submit Appeal</motion.button>
      </div>
    </div>
  );
}

/* ══════════ MAIN ══════════ */
const PANELS = {
  overview:    <OverviewTab />,
  recruitment: <RecruitmentTab />,
  hosts:       <HostsTab />,
  targets:     <TargetsTab />,
  earnings:    <EarningsTab />,
  analytics:   <AnalyticsTab />,
  tasks:       <TasksTab />,
  compliance:  <ComplianceTab />,
};

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>🤝 Agent Dashboard</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Operations Center · Gold Agent</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#F59E0B" }}>LV8</div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "0 16px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flexShrink: 0, padding: "10px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap", color: activeTab === t.id ? "#1F6BFF" : "#9CA3AF", borderBottom: activeTab === t.id ? "2px solid #1F6BFF" : "2px solid transparent" }}>
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