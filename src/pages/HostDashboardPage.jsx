/**
 * HostDashboardPage — Primary Host Control Center
 * Access: Profile > More Services > Control Center > Host Dashboard
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
  { id: "overview",   label: "Overview",   icon: "📊" },
  { id: "streaming",  label: "Streaming",  icon: "🎙️" },
  { id: "earnings",   label: "Earnings",   icon: "💰" },
  { id: "audience",   label: "Audience",   icon: "👥" },
  { id: "tasks",      label: "Tasks",      icon: "✅" },
  { id: "ranking",    label: "Ranking",    icon: "🏆" },
  { id: "content",    label: "Content",    icon: "📁" },
  { id: "compliance", label: "Compliance", icon: "🛡️" },
];

/* ══════════ OVERVIEW ══════════ */
function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Host Profile Hero */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#7C3AED)", borderRadius: 20, padding: 18, boxShadow: "0 8px 28px rgba(124,58,237,0.28)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: "2px solid rgba(255,255,255,0.25)" }}>🎙️</div>
            <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: "#10B981", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, color: "#fff" }}>✓</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>VYRO Host</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>ID: #VH2024001 · VYRO Stars Agency</div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "#10B98122", color: "#10B981", border: "1px solid #10B98133" }}>✅ Verified</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}>Super Star</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#FFC83D" }}>LV65</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Host Level</div>
          </div>
        </div>

        {/* Perf Score + Monthly */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ l: "Performance Score", v: "9.2/10", icon: "⭐" },{ l: "Monthly Rank", v: "#214", icon: "🏅" },{ l: "Total Followers", v: "12.4K", icon: "👥" },{ l: "Total Fans", v: "3.8K", icon: "❤️" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, border: "1px solid rgba(255,255,255,0.14)" }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <SLabel label="⚡ HOST QUICK STATS" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { icon: "📺", label: "Total Streams",  value: "148",    color: "#1F6BFF" },
          { icon: "⏱️", label: "Stream Hours",   value: "1,248h", color: "#10B981" },
          { icon: "👁️", label: "Total Viewers",  value: "284K",   color: "#A855F7" },
          { icon: "🎁", label: "Gifts Received", value: "4,821",  color: "#EC4899" },
          { icon: "💰", label: "Total Earned",   value: "$8.4K",  color: "#F59E0B" },
          { icon: "🔥", label: "Engagement",     value: "8.7",    color: "#EF4444" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent Activity */}
      <SLabel label="📋 RECENT ACTIVITY" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { icon: "🔴", text: "Live stream ended — 3h 22m", time: "2h ago",  color: "#EF4444" },
          { icon: "🎁", text: "Gift received: Dragon x5",   time: "3h ago",  color: "#F59E0B" },
          { icon: "👥", text: "+48 new followers",          time: "3h ago",  color: "#10B981" },
          { icon: "🏆", text: "Weekly rank up → #214",      time: "1d ago",  color: "#A855F7" },
          { icon: "✅", text: "Daily task completed",        time: "1d ago",  color: "#1F6BFF" },
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

/* ══════════ STREAMING ══════════ */
function StreamingTab() {
  const [isLive, setIsLive] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Live Control */}
      <div style={{ background: isLive ? "linear-gradient(135deg,#0D1B3E,#EF444488)" : "linear-gradient(135deg,#0D1B3E,#7C3AED)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(124,58,237,0.25)", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{isLive ? "🔴" : "🎙️"}</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{isLive ? "Currently LIVE" : "Start Your Stream"}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>{isLive ? "Duration: 00:24:18 · 342 viewers" : "Set up your room and go live"}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => setIsLive(v => !v)}
            style={{ padding: "12px 28px", borderRadius: 14, background: isLive ? "#EF4444" : "#10B981", color: "#fff", border: "none", fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 14px ${isLive ? "rgba(239,68,68,0.35)" : "rgba(16,185,129,0.35)"}` }}>
            {isLive ? "⏹ End Stream" : "🔴 Go Live"}
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }}
            style={{ padding: "12px 20px", borderRadius: 14, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
            📅 Schedule
          </motion.button>
        </div>
      </div>

      {/* Live Stats */}
      {isLive && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[{ icon: "👁️", l: "Live Viewers", v: "342", c: "#1F6BFF" },{ icon: "🔥", l: "Peak Viewers", v: "891", c: "#EF4444" },{ icon: "🎁", l: "Gifts Received", v: "28", c: "#F59E0B" },{ icon: "💬", l: "Messages", v: "1,240", c: "#10B981" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
        </div>
      )}

      {/* Stream Stats */}
      <SLabel label="📺 STREAMING STATISTICS" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "📺", l: "Total Streams",     v: "148",    c: "#1F6BFF" },{ icon: "⏱️", l: "Total Hours",     v: "1,248h", c: "#10B981" },{ icon: "👁️", l: "Total Viewers",    v: "284K",   c: "#A855F7" },{ icon: "🔥", l: "Peak Concurrent",  v: "1,248",  c: "#EF4444" },{ icon: "📊", l: "Avg. Viewers",     v: "342",    c: "#F59E0B" },{ icon: "⭐", l: "Popularity Score", v: "9.2",    c: "#0EA5E9" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      {/* Stream History */}
      <SLabel label="📜 RECENT STREAMS" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { title: "Music Night 🎵",   date: "Jun 16", duration: "3h 22m", viewers: "842",  gifts: "68",  color: "#A855F7" },
          { title: "Q&A Session 💬",   date: "Jun 14", duration: "1h 45m", viewers: "521",  gifts: "34",  color: "#1F6BFF" },
          { title: "Story Time 📖",    date: "Jun 12", duration: "2h 10m", viewers: "634",  gifts: "47",  color: "#F59E0B" },
          { title: "Game Night 🎮",    date: "Jun 10", duration: "4h 05m", viewers: "1,124",gifts: "112", color: "#10B981" },
        ].map((s, i, arr) => (
          <div key={i} style={{ padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📺</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{s.title}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{s.date} · {s.duration} · 👁 {s.viewers} · 🎁 {s.gifts}</div>
            </div>
            <Btn label="Analytics" color="#1F6BFF" small outline />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ EARNINGS ══════════ */
function EarningsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B88)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(245,158,11,0.22)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 4, letterSpacing: "0.06em" }}>💰 TOTAL EARNINGS</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginBottom: 2 }}>$8,420</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 14 }}>All-time host earnings</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Today", v: "$124" },{ l: "This Week", v: "$820" },{ l: "This Month", v: "$2,140" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 11, padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <motion.button whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "#fff", color: "#F59E0B", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>💳 Withdraw</motion.button>
          <motion.button whileTap={{ scale: 0.95 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>📄 Statement</motion.button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "🎁", l: "Gift Earnings",    v: "$5,640", c: "#EC4899" },{ icon: "🎯", l: "Bonus Earnings",   v: "$1,380", c: "#10B981" },{ icon: "🏆", l: "Event Rewards",    v: "$820",   c: "#F59E0B" },{ icon: "🤝", l: "Commission",       v: "$580",   c: "#A855F7" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="📜 TRANSACTION HISTORY" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[
          { label: "Gift Income — Jun 16",      amount: "+$124",   color: "#10B981", date: "Jun 16" },
          { label: "Event Reward — Weekly Top",  amount: "+$200",   color: "#10B981", date: "Jun 15" },
          { label: "Withdrawal",                 amount: "-$500",   color: "#EF4444", date: "Jun 10" },
          { label: "Gift Income — Jun 10",       amount: "+$380",   color: "#10B981", date: "Jun 10" },
          { label: "Bonus — Performance",        amount: "+$180",   color: "#10B981", date: "Jun 5"  },
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

/* ══════════ AUDIENCE ══════════ */
function AudienceTab() {
  const metrics = [
    { label: "Follower Growth Rate",  pct: 88, color: "#1F6BFF" },
    { label: "Audience Retention",    pct: 68, color: "#10B981" },
    { label: "Engagement Rate",       pct: 87, color: "#A855F7" },
    { label: "Avg. Watch Time",       pct: 72, color: "#F59E0B" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "👥", l: "Total Followers",    v: "12.4K", c: "#1F6BFF" },{ icon: "❤️", l: "Total Fans",        v: "3.8K",  c: "#EC4899" },{ icon: "📈", l: "New This Month",    v: "+320",  c: "#10B981" },{ icon: "🔁", l: "Returning Viewers", v: "74%",   c: "#A855F7" },{ icon: "🌍", l: "Countries",         v: "14",    c: "#0EA5E9" },{ icon: "💬", l: "Engagement Score",  v: "8.7",   c: "#F59E0B" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="📊 PERFORMANCE METRICS" />
      {metrics.map((m, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{m.label}</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: m.color }}>{m.pct}%</span>
          </div>
          <ProgressBar pct={m.pct} color={m.color} />
        </div>
      ))}

      <SLabel label="🌍 TOP VIEWER COUNTRIES" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[{ flag: "🇶🇦", country: "Qatar", pct: 38, c: "#1F6BFF" },{ flag: "🇸🇦", country: "Saudi Arabia", pct: 22, c: "#10B981" },{ flag: "🇦🇪", country: "UAE", pct: 16, c: "#F59E0B" },{ flag: "🇪🇬", country: "Egypt", pct: 12, c: "#A855F7" },{ flag: "🌍", country: "Other", pct: 12, c: "#9CA3AF" }].map((c, i, arr) => (
          <div key={i} style={{ padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{c.flag} {c.country}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: c.c }}>{c.pct}%</span>
            </div>
            <ProgressBar pct={c.pct} color={c.c} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ TASKS ══════════ */
function TasksTab() {
  const [claimed, setClaimed] = useState(new Set());
  const tasks = [
    { id: 1, type: "Daily",   icon: "☀️", title: "Stream for 2 hours",        reward: "$5",   done: true  },
    { id: 2, type: "Daily",   icon: "☀️", title: "Receive 10 gifts",           reward: "$3",   done: false },
    { id: 3, type: "Weekly",  icon: "📆", title: "Stream 5 days this week",    reward: "$30",  done: false },
    { id: 4, type: "Weekly",  icon: "📆", title: "Reach 500 viewers",          reward: "$20",  done: true  },
    { id: 5, type: "Monthly", icon: "📅", title: "Earn 1M coins from gifts",   reward: "$120", done: false },
    { id: 6, type: "Monthly", icon: "📅", title: "Maintain 9.0+ perf score",   reward: "$60",  done: true  },
    { id: 7, type: "Reward",  icon: "🏅", title: "First 100 Hours Streamed",   reward: "Badge",done: true  },
    { id: 8, type: "Reward",  icon: "🏆", title: "Super Star Host Status",     reward: "Title",done: true  },
  ];
  const typeColor = { Daily: "#F59E0B", Weekly: "#1F6BFF", Monthly: "#A855F7", Reward: "#10B981" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ icon: "✅", l: "Completed", v: tasks.filter(t => t.done).length, c: "#10B981" },{ icon: "⏳", l: "Pending", v: tasks.filter(t => !t.done).length, c: "#F59E0B" },{ icon: "🏅", l: "Badges", v: 4, c: "#A855F7" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="🎯 HOST TASK CENTER" />
      {tasks.map(task => (
        <div key={task.id} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, opacity: claimed.has(task.id) ? 0.5 : 1, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${typeColor[task.type]}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{task.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 3 }}>{task.title}</div>
            <div style={{ display: "flex", gap: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${typeColor[task.type]}12`, color: typeColor[task.type] }}>{task.type}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: "#FFF7ED", color: "#F59E0B" }}>🎁 {task.reward}</span>
            </div>
          </div>
          {task.done && !claimed.has(task.id)
            ? <motion.button whileTap={{ scale: 0.9 }} onClick={() => setClaimed(p => new Set([...p, task.id]))} style={{ padding: "7px 12px", borderRadius: 10, background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", border: "none", fontWeight: 800, fontSize: 10, cursor: "pointer" }}>Claim</motion.button>
            : task.done ? <span style={{ fontSize: 16 }}>✅</span>
            : <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>Pending</span>
          }
        </div>
      ))}
    </div>
  );
}

/* ══════════ RANKING ══════════ */
function RankingTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#F59E0B88)", borderRadius: 18, padding: 18, boxShadow: "0 8px 24px rgba(245,158,11,0.2)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: "0.06em" }}>🏆 YOUR RANKINGS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Global", v: "#2,341", icon: "🌍" },{ l: "Country", v: "#47", icon: "🇶🇦" },{ l: "Monthly", v: "#214", icon: "📅" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l} Rank</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[{ icon: "🌍", l: "Global Rank",   v: "#2,341", c: "#1F6BFF" },{ icon: "🇶🇦", l: "Country Rank",  v: "#47",    c: "#10B981" },{ icon: "🏢", l: "Agency Rank",   v: "#5",     c: "#F59E0B" },{ icon: "📅", l: "Monthly Rank",  v: "#214",   c: "#A855F7" },{ icon: "📆", l: "Weekly Rank",   v: "#88",    c: "#0EA5E9" },{ icon: "☀️", l: "Daily Rank",    v: "#32",    c: "#EC4899" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="🏅 TOP COMPETITORS" />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", overflow: "hidden" }}>
        {[{ rank: 1, name: "StarHost_AE", flag: "🇦🇪", score: "9.8", diff: "+0.6" },{ rank: 2, name: "ProHost_SA", flag: "🇸🇦", score: "9.5", diff: "+0.3" },{ rank: 3, name: "You 🎙️", flag: "🇶🇦", score: "9.2", diff: "—" },{ rank: 4, name: "LiveQueen_EG", flag: "🇪🇬", score: "9.0", diff: "-0.2" }].map((h, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < arr.length - 1 ? "1px solid #F5F7FA" : "none", background: h.rank === 3 ? "#F0F7FF" : "transparent" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: h.rank <= 2 ? "#F59E0B12" : "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: h.rank <= 2 ? "#F59E0B" : "#9CA3AF", flexShrink: 0 }}>#{h.rank}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{h.name} {h.flag}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#F59E0B" }}>{h.score}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>{h.diff}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════ CONTENT ══════════ */
function ContentTab() {
  const items = [
    { title: "Music Night 🎵",  date: "Jun 16", duration: "3h 22m", type: "Archive", color: "#A855F7" },
    { title: "Q&A Session 💬",  date: "Jun 14", duration: "1h 45m", type: "Highlight", color: "#1F6BFF" },
    { title: "Story Time 📖",   date: "Jun 12", duration: "2h 10m", type: "Archive", color: "#F59E0B" },
    { title: "Game Night 🎮",   date: "Jun 10", duration: "4h 05m", type: "Archive", color: "#10B981" },
  ];
  const typeColor = { Archive: "#9CA3AF", Highlight: "#1F6BFF" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[{ icon: "📺", l: "Total Streams", v: "148", c: "#1F6BFF" },{ icon: "⭐", l: "Highlights", v: "12", c: "#F59E0B" },{ icon: "📁", l: "Archived", v: "136", c: "#9CA3AF" }].map(s => <StatCard key={s.l} icon={s.icon} label={s.l} value={s.v} color={s.c} />)}
      </div>

      <SLabel label="📁 MEDIA LIBRARY" />
      {items.map((item, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📺</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 3 }}>{item.title}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 4 }}>{item.date} · {item.duration}</div>
            <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${typeColor[item.type]}12`, color: typeColor[item.type] }}>{item.type}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn label="View" color="#1F6BFF" small outline />
            <Btn label="Delete" color="#EF4444" small outline />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════ COMPLIANCE ══════════ */
function ComplianceTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#10B981AA)", borderRadius: 16, padding: 16, boxShadow: "0 6px 20px rgba(16,185,129,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 4, letterSpacing: "0.06em" }}>🛡️ COMPLIANCE SCORE</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>97<span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>/100</span></div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Excellent Standing · Verified Host</div>
          </div>
          <div style={{ fontSize: 44 }}>✅</div>
        </div>
      </div>

      {[{ icon: "✅", label: "Violations",          value: "0 Active",     color: "#10B981" },{ icon: "⚠️", label: "Warnings",            value: "1 (Resolved)", color: "#F59E0B" },{ icon: "📋", label: "Active Restrictions",  value: "None",         color: "#10B981" },{ icon: "📜", label: "Appeals",              value: "0 Pending",    color: "#9CA3AF" }].map((item, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{item.label}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: item.color, marginTop: 2 }}>{item.value}</div>
          </div>
          <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
        </div>
      ))}

      <SLabel label="📋 HOST GUIDELINES" />
      {["Stream Content Policy", "Gift & Coin Guidelines", "Community Standards", "Moderation Rules"].map((g, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 13, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 16 }}>📋</span>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#374151" }}>{g}</span>
          <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn label="📋 View History" color="linear-gradient(135deg,#1F6BFF,#6366F1)" />
        <Btn label="⚖️ Submit Appeal" color="#EF4444" outline />
      </div>
    </div>
  );
}

/* ══════════ MAIN ══════════ */
const PANELS = {
  overview:   <OverviewTab />,
  streaming:  <StreamingTab />,
  earnings:   <EarningsTab />,
  audience:   <AudienceTab />,
  tasks:      <TasksTab />,
  ranking:    <RankingTab />,
  content:    <ContentTab />,
  compliance: <ComplianceTab />,
};

export default function HostDashboardPage() {
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
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>🎙️ Host Dashboard</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Streaming Control Center · LV65</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#7C3AED" }}>Super Star</div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>Host Level</div>
          </div>
        </div>
        <div style={{ display: "flex", overflowX: "auto", padding: "0 16px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flexShrink: 0, padding: "10px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap", color: activeTab === t.id ? "#7C3AED" : "#9CA3AF", borderBottom: activeTab === t.id ? "2px solid #7C3AED" : "2px solid transparent" }}>
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