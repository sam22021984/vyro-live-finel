/**
 * EventManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Event Manager
 * Theme: Enterprise Dark Blue, Gold & Platinum · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  page: { minHeight:"100dvh", background:"linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:90 },
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(168,85,247,0.15)", borderRadius:18, ...x }),
  purpleBadge: { padding:"4px 10px", borderRadius:20, background:"rgba(168,85,247,0.12)", border:"1px solid rgba(168,85,247,0.3)" },
  sec: { fontSize:10, fontWeight:800, color:"#A855F7", letterSpacing:"0.08em", marginBottom:10 },
  kpi: (c) => ({ background:`linear-gradient(145deg,${c}18,${c}08)`, border:`1px solid ${c}30`, borderRadius:14, padding:"12px 8px", textAlign:"center" }),
  btn: (g, glow) => ({ padding:"8px 11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, color:"#fff", background:g, boxShadow:`0 4px 12px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GRADS = ["linear-gradient(135deg,#A855F7,#7E22CE)","linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#EC4899,#BE185D)","linear-gradient(135deg,#F97316,#EA580C)"];
const GLOWS  = ["rgba(168,85,247,0.4)","rgba(255,200,61,0.35)","rgba(16,185,129,0.3)","rgba(31,107,255,0.3)","rgba(236,72,153,0.3)","rgba(249,115,22,0.3)"];

const partData    = [{d:"Mon",v:2400},{d:"Tue",v:3200},{d:"Wed",v:2800},{d:"Thu",v:4100},{d:"Fri",v:5200},{d:"Sat",v:6400},{d:"Sun",v:4800}];
const revenueData = [{d:"Jan",v:12},{d:"Feb",v:18},{d:"Mar",v:15},{d:"Apr",v:24},{d:"May",v:32},{d:"Jun",v:42}];
const engageData  = [{d:"Mon",v:74},{d:"Tue",v:82},{d:"Wed",v:78},{d:"Thu",v:88},{d:"Fri",v:94},{d:"Sat",v:91},{d:"Sun",v:86}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Shell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(168,85,247,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#A855F7"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#A855F7" }}>{subtitle}</div>
          </div>
          <div style={S.purpleBadge}><span style={{ fontSize:10,fontWeight:800,color:"#A855F7" }}>🎉 EM</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#A855F7" }) => (
        <div key={l} style={S.kpi(color)}>
          {icon && <div style={{ fontSize:15,marginBottom:2 }}>{icon}</div>}
          <div style={{ fontSize:13,fontWeight:900,color }}>{v}</div>
          <div style={{ fontSize:8,color:"rgba(255,255,255,0.45)",marginTop:2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function ACard({ title, actions }) {
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      {title && <div style={S.sec}>{title}</div>}
      <div style={{ display:"flex",flexWrap:"wrap" }}>
        {actions.map((a,i) => <motion.button key={a} whileTap={{ scale:0.92 }} style={S.btn(GRADS[i%GRADS.length],GLOWS[i%GLOWS.length])}>{a}</motion.button>)}
      </div>
    </div>
  );
}

function Chart({ label, data, color, gid, type="area" }) {
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      <div style={S.sec}>{label}</div>
      <ResponsiveContainer width="100%" height={88}>
        {type==="bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#A855F7" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#A855F7" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gid})`} strokeWidth={2} dot={{ fill:"#A855F7",r:2 }}/>
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function PBar({ label, value, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      {label && (
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
          <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{label}</span>
          <span style={{ fontSize:11,fontWeight:900,color }}>{value}%</span>
        </div>
      )}
      <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${Math.min(value,100)}%` }} transition={{ duration:0.7 }}
          style={{ height:"100%",borderRadius:3,background:color }}/>
      </div>
    </div>
  );
}

function SBadge({ status, colors }) {
  const c = colors[status] || "#9CA3AF";
  return (
    <div style={{ padding:"2px 8px",borderRadius:8,background:`${c}18`,border:`1px solid ${c}30`,flexShrink:0,alignSelf:"flex-start" }}>
      <span style={{ fontSize:9,fontWeight:800,color:c }}>{status}</span>
    </div>
  );
}

function EventCard({ ev, actions, statusColors }) {
  return (
    <div style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${ev.color}` }}>
      <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:`${ev.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{ev.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{ev.name}</div>
          <div style={{ fontSize:9,color:"#A855F7",marginTop:1 }}>{ev.date}{ev.participants ? ` · ${ev.participants}` : ""}</div>
          {ev.prize && <div style={{ fontSize:9,color:"#FFC83D",fontWeight:800,marginTop:1 }}>Prize: {ev.prize}</div>}
        </div>
        <SBadge status={ev.status} colors={statusColors}/>
      </div>
      <ACard title="" actions={actions}/>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function EventOverviewCenter({ onBack }) {
  return (
    <Shell title="🎉 Event Overview Center" subtitle="Complete Event Ecosystem Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Total Events",    v:"284",   color:"#A855F7",icon:"🎉" },
        { l:"Active Now",      v:"12",    color:"#10B981",icon:"🟢" },
        { l:"Upcoming",        v:"28",    color:"#FFC83D",icon:"📅" },
        { l:"Total Revenue",   v:"$42K",  color:"#A855F7",icon:"💰" },
        { l:"Engagement Rate", v:"86%",   color:"#10B981",icon:"📊" },
        { l:"Growth Rate",     v:"+34%",  color:"#60A5FA",icon:"🚀" },
      ]}/>
      <Chart label="👥 DAILY PARTICIPANTS" data={partData} color="#A855F7" gid="eo1" type="bar"/>
      <Chart label="💰 EVENT REVENUE TREND ($K)" data={revenueData} color="#FFC83D" gid="eo2"/>
      <Chart label="💫 ENGAGEMENT SCORE" data={engageData} color="#10B981" gid="eo3"/>
      <ACard title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data","Monitor Event Performance"]}/>
    </Shell>
  );
}

function EventManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Paused:"#F59E0B",Completed:"#60A5FA",Draft:"#9CA3AF" };
  const events = [
    { name:"Summer Streaming Festival", icon:"☀️", date:"Jun 20–30",  participants:"8.4K",prize:"500K coins",status:"Active",  color:"#F97316" },
    { name:"VIP Diamond Night",         icon:"💎", date:"Jul 5",       participants:"284",  prize:"100K coins",status:"Upcoming",color:"#FFC83D" },
    { name:"Host Battle Championship",  icon:"⚔️", date:"Jul 10–17",  participants:"2.1K", prize:"200K coins",status:"Upcoming",color:"#EF4444" },
    { name:"Community Talent Show",     icon:"🎤", date:"Jul 20",      participants:"4.2K", prize:"150K coins",status:"Draft",   color:"#A855F7" },
    { name:"Ramadan Special 2027",      icon:"🌙", date:"Feb 2027",    participants:"-",    prize:"1M coins",  status:"Draft",   color:"#60A5FA" },
  ];
  const filters = ["All","Active","Upcoming","Draft","Completed"];
  const visible = filter==="All" ? events : events.filter(e => e.status===filter);
  return (
    <Shell title="📅 Event Management Center" subtitle="All Platform Events" onBack={onBack}>
      <KGrid items={[
        { l:"Active Events",   v:"12",  color:"#10B981",icon:"🟢" },
        { l:"Upcoming",        v:"28",  color:"#FFC83D",icon:"📅" },
        { l:"Total Registered",v:"48K", color:"#A855F7",icon:"👥" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#A855F7,#7E22CE)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#A855F7" }}>
            {f}
          </motion.button>
        ))}
      </div>
      <ACard title="⚡ CREATE" actions={["Create Event"]}/>
      {visible.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}>
          <EventCard ev={e} statusColors={sc} actions={["Edit Event","Activate Event","Pause Event","End Event","Delete Event"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CompetitionManagementCenter({ onBack }) {
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Planning:"#A855F7",Completed:"#60A5FA" };
  const competitions = [
    { name:"Monthly Elite Streaming Cup",  icon:"🏆",date:"Jun 20–25", participants:"1.2K",prize:"100K coins",status:"Active",  color:"#FFC83D" },
    { name:"Summer PK Championship",       icon:"⚔️",date:"Jun 28–Jul 5",participants:"2.4K",prize:"500K coins",status:"Upcoming",color:"#EF4444" },
    { name:"Best Host of the Month",       icon:"🎙️",date:"Jun 30",    participants:"842", prize:"50K coins", status:"Active",  color:"#A855F7" },
    { name:"Top Gifter Annual Award",      icon:"🎁",date:"Dec 31",    participants:"-",   prize:"1M coins",  status:"Planning",color:"#10B981" },
  ];
  return (
    <Shell title="🏆 Competition Management" subtitle="Tournaments & Ranking Events" onBack={onBack}>
      <KGrid items={[
        { l:"Active Competitions",v:"4",     color:"#10B981",icon:"🏆" },
        { l:"Planning",           v:"6",     color:"#A855F7",icon:"📝" },
        { l:"Total Prize Pool",   v:"1.65M", color:"#FFC83D",icon:"💰" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create Competition"]}/>
      {competitions.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EventCard ev={c} statusColors={sc} actions={["Configure Rules","Manage Rankings","Monitor Competition","Announce Winners"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventRewardsCenter({ onBack }) {
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Distributed:"#60A5FA",Expired:"#9CA3AF" };
  const rewards = [
    { name:"Summer Festival Winner",    icon:"🥇",date:"Jun 30",  participants:"10",  prize:"50K coins",  status:"Upcoming",  color:"#FFC83D" },
    { name:"Top 3 Host Monthly",        icon:"🎙️",date:"Jun 25",  participants:"3",   prize:"30K coins",  status:"Upcoming",  color:"#A855F7" },
    { name:"Gifter Leaderboard Prizes", icon:"🎁",date:"Jun 20",  participants:"20",  prize:"80K coins",  status:"Active",    color:"#EC4899" },
    { name:"Best New Host Award",       icon:"⭐",date:"Jun 15",  participants:"1",   prize:"5K coins",   status:"Distributed",color:"#10B981" },
  ];
  return (
    <Shell title="🎁 Event Rewards Center" subtitle="Prize & Reward Distribution" onBack={onBack}>
      <KGrid items={[
        { l:"Active Rewards",   v:"8",    color:"#10B981",icon:"🎁" },
        { l:"Prize Pool",       v:"165K", color:"#FFC83D",icon:"💰" },
        { l:"Distributed",      v:"48K",  color:"#A855F7",icon:"📤" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create Reward"]}/>
      {rewards.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}>
          <EventCard ev={r} statusColors={sc} actions={["Assign Reward","Approve Distribution","Review Reward History"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ParticipationManagementCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const participants = [
    { name:"@DiamondQA",   event:"Summer Festival",    status:"Approved",  registered:"Jun 14",rank:"#1",  icon:"💎" },
    { name:"@SaraLive",    event:"Host Monthly Cup",   status:"Approved",  registered:"Jun 13",rank:"#2",  icon:"🎙️" },
    { name:"@MoonVoice",   event:"Summer Festival",    status:"Pending",   registered:"Jun 16",rank:"-",   icon:"🎙️" },
    { name:"@StarQA",      event:"PK Championship",    status:"Approved",  registered:"Jun 12",rank:"#4",  icon:"⚔️" },
    { name:"@GoldRose",    event:"Summer Festival",    status:"Rejected",  registered:"Jun 11",rank:"-",   icon:"🌹" },
  ];
  const sc = { Approved:"#10B981",Pending:"#FFC83D",Rejected:"#EF4444" };
  const filtered = participants.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.event.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="👥 Participation Management" subtitle="Event Registrations & Participants" onBack={onBack}>
      <KGrid items={[
        { l:"Total Registrations",v:"48K",  color:"#A855F7",icon:"📋" },
        { l:"Approved",           v:"42K",  color:"#10B981",icon:"✅" },
        { l:"Pending",            v:"284",  color:"#FFC83D",icon:"⏳" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#A855F7"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search participants or events…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {filtered.map((p,i) => (
        <motion.div key={p.name+p.event} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ width:40,height:40,borderRadius:12,background:"rgba(168,85,247,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{p.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{p.name}</div>
            <div style={{ fontSize:9,color:"#A855F7" }}>{p.event} · Rank: {p.rank}</div>
            <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Registered: {p.registered}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end" }}>
            <SBadge status={p.status} colors={sc}/>
            <div style={{ display:"flex",gap:4 }}>
              {["✅","❌","🗑️"].map((ic,ii) => (
                <motion.button key={ii} whileTap={{ scale:0.9 }}
                  style={{ width:26,height:26,borderRadius:7,border:"none",cursor:"pointer",background:"rgba(255,255,255,0.08)",fontSize:12 }}>
                  {ic}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["Export Participant List"]}/>
    </Shell>
  );
}

function GlobalEventMonitoringCenter({ onBack }) {
  const live = [
    { name:"Summer Streaming Festival",country:"Qatar",       viewers:"12K",participants:"8.4K",revenue:"$2.8K",status:"Live",icon:"☀️" },
    { name:"Host Monthly Cup",         country:"Saudi Arabia",viewers:"4.8K",participants:"1.2K",revenue:"$840", status:"Live",icon:"🏆" },
    { name:"Gifter Leaderboard",       country:"Global",      viewers:"8.4K",participants:"2.8K",revenue:"$1.4K",status:"Live",icon:"🎁" },
  ];
  return (
    <Shell title="🌍 Global Event Monitoring" subtitle="Live Event Monitoring Worldwide" onBack={onBack}>
      <KGrid items={[
        { l:"Live Events",    v:"12",   color:"#10B981",icon:"🟢" },
        { l:"Total Viewers",  v:"84K",  color:"#FFC83D",icon:"👁️" },
        { l:"Active Countries",v:"42",  color:"#60A5FA",icon:"🌍" },
      ]}/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🟢 LIVE EVENT FEED</div>
        {live.map((e,i) => (
          <div key={e.name} style={{ padding:"10px 0",borderBottom:i<live.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:4 }}>
              <span style={{ fontSize:18 }}>{e.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{e.name}</div>
                <div style={{ fontSize:9,color:"#A855F7" }}>{e.country} · 👁️ {e.viewers} · 👥 {e.participants}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{e.revenue}</div>
                <div style={{ width:8,height:8,borderRadius:"50%",background:"#10B981",margin:"4px 0 0 auto",boxShadow:"0 0 6px #10B981" }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ACard title="⚡" actions={["Monitor Event","View Live Activity","Review Performance","Generate Insights"]}/>
    </Shell>
  );
}

function HostEventCenter({ onBack }) {
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Completed:"#60A5FA",Planning:"#A855F7" };
  const events = [
    { name:"Top Host of the Month",    icon:"🎙️",date:"Jun 30",  participants:"842", prize:"50K coins",  status:"Active",   color:"#A855F7" },
    { name:"Host Streaming Marathon",  icon:"⏱️",date:"Jul 10",  participants:"284", prize:"20K coins",  status:"Upcoming", color:"#10B981" },
    { name:"Best Host Talent Show",    icon:"🎤",date:"Jul 20",  participants:"1.2K",prize:"30K coins",  status:"Planning", color:"#FFC83D" },
  ];
  return (
    <Shell title="🎙️ Host Event Center" subtitle="Host-Based Events & Competitions" onBack={onBack}>
      <KGrid items={[
        { l:"Host Events",    v:"8",   color:"#A855F7",icon:"🎙️" },
        { l:"Participating",  v:"2.3K",color:"#FFC83D",icon:"👥" },
        { l:"Prize Pool",     v:"100K",color:"#10B981",icon:"🏆" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create Host Event"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EventCard ev={e} statusColors={sc} actions={["Assign Hosts","Monitor Participation","Analyze Performance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgencyEventCenter({ onBack }) {
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Completed:"#60A5FA",Planning:"#A855F7" };
  const events = [
    { name:"Top Agency of the Month",   icon:"🏢",date:"Jun 30",  participants:"28",  prize:"200K coins",status:"Active",   color:"#FFC83D" },
    { name:"Agency Host Challenge",     icon:"⚔️",date:"Jul 15",  participants:"42",  prize:"100K coins",status:"Upcoming", color:"#A855F7" },
    { name:"Agency Revenue Race",       icon:"💰",date:"Jul 31",  participants:"36",  prize:"150K coins",status:"Planning", color:"#10B981" },
  ];
  return (
    <Shell title="🏢 Agency Event Center" subtitle="Agency Competitions & Campaigns" onBack={onBack}>
      <KGrid items={[
        { l:"Agency Events",  v:"6",   color:"#FFC83D",icon:"🏢" },
        { l:"Participating",  v:"106", color:"#A855F7",icon:"👥" },
        { l:"Prize Pool",     v:"450K",color:"#10B981",icon:"🏆" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create Agency Event"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EventCard ev={e} statusColors={sc} actions={["Assign Agencies","Review Results","Generate Reports"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPEventCenter({ onBack }) {
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Planning:"#A855F7",Completed:"#60A5FA" };
  const events = [
    { name:"Diamond Members Summit",    icon:"💎",date:"Jun 28",  participants:"50",  prize:"Exclusive Gifts",status:"Upcoming",color:"#FFC83D" },
    { name:"VIP Royal Live Night",      icon:"👑",date:"Jul 5",   participants:"500", prize:"10K coins each", status:"Upcoming",color:"#A855F7" },
    { name:"VIP Host Meet & Greet",     icon:"🎙️",date:"Jul 12",  participants:"128", prize:"VIP Badges",     status:"Planning",color:"#EC4899" },
    { name:"VIP Annual Gala 2026",      icon:"🥂",date:"Dec 31",  participants:"1K",  prize:"Grand Prizes",   status:"Planning",color:"#60A5FA" },
  ];
  return (
    <Shell title="💎 VIP Event Center" subtitle="Exclusive VIP Experiences" onBack={onBack}>
      <KGrid items={[
        { l:"VIP Events",    v:"6",   color:"#FFC83D",icon:"💎" },
        { l:"Seats Total",   v:"1.7K",color:"#A855F7",icon:"🪑" },
        { l:"Satisfaction",  v:"98%", color:"#10B981",icon:"⭐" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create VIP Event"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EventCard ev={e} statusColors={sc} actions={["Invite VIP Members","Monitor Participation","Analyze Engagement"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventRevenueCenter({ onBack }) {
  const breakdown = [
    { l:"Entry Fees",        v:"$18K",pct:43,color:"#A855F7" },
    { l:"Sponsorships",      v:"$12K",pct:29,color:"#FFC83D" },
    { l:"Gift Revenue",      v:"$8K", pct:19,color:"#EC4899" },
    { l:"VIP Ticket Sales",  v:"$4K", pct:9, color:"#10B981" },
  ];
  return (
    <Shell title="📈 Event Revenue Center" subtitle="Event Earnings & Financial Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Total Revenue",   v:"$42K",  color:"#FFC83D",icon:"💰" },
        { l:"Monthly Growth",  v:"+34%",  color:"#10B981",icon:"📈" },
        { l:"Avg Per Event",   v:"$148",  color:"#A855F7",icon:"📊" },
      ]}/>
      <Chart label="💰 EVENT REVENUE TREND ($K)" data={revenueData} color="#FFC83D" gid="rev1"/>
      <Chart label="👥 DAILY PARTICIPANTS" data={partData} color="#A855F7" gid="rev2" type="bar"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 REVENUE BREAKDOWN</div>
        {breakdown.map((b,i) => (
          <div key={b.l} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{b.l}</span>
              <span style={{ fontSize:11,fontWeight:900,color:b.color }}>{b.v}</span>
            </div>
            <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${b.pct}%` }} transition={{ duration:0.7 }}
                style={{ height:"100%",borderRadius:3,background:b.color }}/>
            </div>
          </div>
        ))}
      </div>
      <ACard title="⚡" actions={["Analyze Revenue","Export Reports","Compare Events","View Revenue Breakdown"]}/>
    </Shell>
  );
}

function EventRankingsCenter({ onBack }) {
  const [tab, setTab] = useState("Participants");
  const data = {
    Participants:[
      { rank:1,name:"@DiamondQA",  stat:"8.4M coins gifted",  icon:"💎" },
      { rank:2,name:"@GoldRose",   stat:"3.2M coins gifted",  icon:"🌹" },
      { rank:3,name:"@StarVIP",    stat:"2.8M coins gifted",  icon:"⭐" },
    ],
    Hosts:[
      { rank:1,name:"@SaraLive",   stat:"142h streamed · 8.4K gifts",icon:"🎙️" },
      { rank:2,name:"@MoonVoice",  stat:"98h streamed · 4.2K gifts", icon:"🎙️" },
      { rank:3,name:"@DiamondVox", stat:"84h streamed · 3.8K gifts", icon:"🎙️" },
    ],
    Agencies:[
      { rank:1,name:"StarPro QA",  stat:"42 hosts · $12K revenue",  icon:"🏢" },
      { rank:2,name:"EliteMedia",  stat:"28 hosts · $8.4K revenue", icon:"🏢" },
      { rank:3,name:"VoiceHouse",  stat:"21 hosts · $4.8K revenue", icon:"🏢" },
    ],
  };
  const gc = { 1:"#FFC83D",2:"#C0C0C0",3:"#CD7F32" };
  return (
    <Shell title="🏅 Event Rankings Center" subtitle="Event Leaderboards" onBack={onBack}>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {["Participants","Hosts","Agencies"].map(t => (
          <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTab(t)}
            style={{ flex:1,padding:"8px",borderRadius:12,fontSize:10,fontWeight:800,border:"none",cursor:"pointer",
              background:tab===t?"linear-gradient(135deg,#A855F7,#7E22CE)":"rgba(255,255,255,0.06)",color:tab===t?"#fff":"#A855F7" }}>
            {t}
          </motion.button>
        ))}
      </div>
      {data[tab].map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:`${gc[e.rank]||"#9CA3AF"}22`,border:`2px solid ${gc[e.rank]||"#9CA3AF"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:gc[e.rank]||"#9CA3AF",flexShrink:0 }}>
            {e.rank}
          </div>
          <span style={{ fontSize:22,flexShrink:0 }}>{e.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
            <div style={{ fontSize:9,color:"#A855F7",marginTop:1 }}>{e.stat}</div>
          </div>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["Export Rankings","Analyze Results"]}/>
    </Shell>
  );
}

function EventCommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Participants");
  const [channel, setChannel] = useState("In-App Message");
  return (
    <Shell title="📨 Event Communication Center" subtitle="Announcements & Participant Messaging" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🎯 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Participants","Event Winners","VIP Members","Host Participants","Registered Only"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#A855F7,#7E22CE)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#A855F7" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 CHANNEL</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["In-App Message","Push Notification","Email","Event Room Notice"].map(c => (
            <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setChannel(c)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:channel===c?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:channel===c?"#0D1B3E":"#A855F7" }}>
              {c}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Write your event announcement or update…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#A855F7,#7E22CE)",boxShadow:"0 6px 20px rgba(168,85,247,0.4)" }}>
          🎉 Send Event Message
        </motion.button>
      </div>
      <ACard title="⚡ MORE" actions={["Broadcast Updates","Notify Participants","Send Winner Notifications"]}/>
    </Shell>
  );
}

function FestivalSeasonalEventsCenter({ onBack }) {
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Planning:"#A855F7",Completed:"#60A5FA" };
  const campaigns = [
    { name:"Ramadan Season 2027",      icon:"🌙",date:"Mar 2027",  participants:"-",   prize:"5M coins",   status:"Planning", color:"#A855F7" },
    { name:"Eid Al-Fitr Special",      icon:"🌸",date:"Apr 2027",  participants:"-",   prize:"2M coins",   status:"Planning", color:"#EC4899" },
    { name:"National Day Celebration", icon:"🎊",date:"Dec 18",    participants:"10K", prize:"1M coins",   status:"Planning", color:"#10B981" },
    { name:"New Year 2027 Gala",       icon:"🥂",date:"Dec 31",    participants:"20K", prize:"3M coins",   status:"Planning", color:"#FFC83D" },
    { name:"Summer Vibes 2026",        icon:"☀️",date:"Jun 20-30", participants:"8.4K",prize:"500K coins", status:"Active",   color:"#F97316" },
  ];
  return (
    <Shell title="🎊 Festival & Seasonal Events" subtitle="Special Campaigns & Celebrations" onBack={onBack}>
      <KGrid items={[
        { l:"Active Campaigns",  v:"1",    color:"#10B981",icon:"🎊" },
        { l:"Upcoming",          v:"4",    color:"#FFC83D",icon:"📅" },
        { l:"Total Prize Pool",  v:"11.5M",color:"#A855F7",icon:"💰" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create Campaign"]}/>
      {campaigns.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}>
          <EventCard ev={c} statusColors={sc} actions={["Launch Campaign","Schedule Campaign","Analyze Results"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CountryEventPerformanceCenter({ onBack }) {
  const countries = [
    { name:"Saudi Arabia",flag:"🇸🇦",events:"42",participants:"18K",revenue:"$14K",growth:"+24%",pct:35,color:"#10B981" },
    { name:"Qatar",       flag:"🇶🇦",events:"28",participants:"12K",revenue:"$9.8K",growth:"+34%",pct:23,color:"#A855F7" },
    { name:"UAE",         flag:"🇦🇪",events:"21",participants:"8.4K",revenue:"$7.2K",growth:"+22%",pct:17,color:"#FFC83D" },
    { name:"Kuwait",      flag:"🇰🇼",events:"14",participants:"4.8K",revenue:"$4.2K",growth:"+18%",pct:11,color:"#60A5FA" },
    { name:"Egypt",       flag:"🇪🇬",events:"12",participants:"4.2K",revenue:"$3.8K",growth:"+42%",pct:9, color:"#EC4899" },
  ];
  return (
    <Shell title="🌍 Country Event Performance" subtitle="Country-Wise Event Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Active Countries",v:"47",    color:"#60A5FA",icon:"🌍" },
        { l:"Top Market",      v:"Saudi", color:"#FFC83D",icon:"🏆" },
        { l:"Fastest Growth",  v:"Egypt", color:"#10B981",icon:"🚀" },
      ]}/>
      {countries.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:8 }}>
            <span style={{ fontSize:26 }}>{c.flag}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.name}</div>
              <div style={{ fontSize:9,color:"#A855F7" }}>{c.events} events · {c.participants} participants</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{c.revenue}</div>
              <div style={{ fontSize:10,fontWeight:800,color:"#10B981" }}>{c.growth}</div>
            </div>
          </div>
          <PBar label="" value={c.pct} color={c.color}/>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["View Country Statistics","Compare Countries","Export Reports","Analyze Growth"]}/>
    </Shell>
  );
}

function AIEventIntelligenceCenter({ onBack }) {
  const insights = [
    "Friday evening events generate 2.8x more participation than weekday events",
    "Events with prize pools above 100K coins show 94% registration completion rate",
    "VIP events have 3x higher engagement and 4x better retention than regular events",
    "Saudi Arabia showing 34% event growth — recommend doubling events allocation",
    "Host competitions drive 2.4x more platform revenue than gifting events",
    "Seasonal campaigns (Ramadan, Eid) generate highest annual engagement spikes",
  ];
  return (
    <Shell title="🧠 AI Event Intelligence" subtitle="AI-Powered Event Optimization" onBack={onBack}>
      <KGrid items={[
        { l:"AI Accuracy",    v:"97%",   color:"#10B981",icon:"🧠" },
        { l:"Engagement Lift",v:"+42%",  color:"#A855F7",icon:"📈" },
        { l:"ROI Forecast",   v:"6.2x",  color:"#FFC83D",icon:"🔮" },
      ]}/>
      <Chart label="📈 EVENT GROWTH FORECAST" data={[...revenueData,{d:"Jul",v:52},{d:"Aug",v:64}]} color="#10B981" gid="ai1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 AI EVENT INSIGHTS</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"8px 0",borderBottom:i<insights.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#A855F7",fontWeight:800,fontSize:11,flexShrink:0 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{ins}</span>
          </div>
        ))}
      </div>
      <ACard title="⚡" actions={["Generate Insights","Analyze Trends","Forecast Results","Optimize Events"]}/>
    </Shell>
  );
}

function EventAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📊 Event Analytics Center" subtitle="Advanced Event Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Avg Participation",v:"2.4K",  color:"#A855F7",icon:"👥" },
        { l:"Avg Revenue",      v:"$148",  color:"#FFC83D",icon:"💰" },
        { l:"Completion Rate",  v:"91%",   color:"#10B981",icon:"✅" },
      ]}/>
      <Chart label="👥 DAILY PARTICIPANTS" data={partData} color="#A855F7" gid="ea1" type="bar"/>
      <Chart label="💰 EVENT REVENUE TREND ($K)" data={revenueData} color="#FFC83D" gid="ea2"/>
      <Chart label="💫 ENGAGEMENT SCORE" data={engageData} color="#10B981" gid="ea3"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 PERFORMANCE vs TARGETS</div>
        <PBar label="Participation Target"  value={86} color="#A855F7"/>
        <PBar label="Revenue Target"        value={88} color="#FFC83D"/>
        <PBar label="Engagement Target"     value={86} color="#10B981"/>
        <PBar label="Completion Rate"       value={91} color="#60A5FA"/>
      </div>
      <ACard title="⚡" actions={["View Analytics","Export Analytics","Compare Metrics","Generate Insights"]}/>
    </Shell>
  );
}

function EventReportManagementCenter({ onBack }) {
  const reports = [
    { name:"Daily Event Report",           date:"Jun 17",size:"420 KB",status:"Ready" },
    { name:"Weekly Event Report",          date:"Jun 15",size:"1.1 MB",status:"Ready" },
    { name:"Event Revenue Report",         date:"Jun 14",size:"840 KB",status:"Ready" },
    { name:"Event Participation Report",   date:"Jun 10",size:"620 KB",status:"Ready" },
    { name:"Competition Report",           date:"Jun 7", size:"980 KB",status:"Archived" },
    { name:"Event ROI Report",             date:"Jun 1", size:"540 KB",status:"Archived" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📋 Event Report Management" subtitle="Generate & Manage Event Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports",v:"48",  color:"#60A5FA",icon:"📋" },
        { l:"This Month",   v:"14",  color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",    v:"4",   color:"#10B981",icon:"⏰" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Generate Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(168,85,247,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📋</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{r.name}</div>
            <div style={{ fontSize:9,color:"#A855F7",marginTop:2 }}>{r.date} · {r.size}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end" }}>
            <SBadge status={r.status} colors={sc}/>
            <div style={{ display:"flex",gap:4 }}>
              {["⬇️","📤","🗄️"].map((ic,ii) => (
                <motion.button key={ii} whileTap={{ scale:0.9 }}
                  style={{ width:26,height:26,borderRadius:7,border:"none",cursor:"pointer",background:"rgba(255,255,255,0.08)",fontSize:12 }}>
                  {ic}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventOperationsTeamCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior Event Coordinator",     tasks:8, score:94,status:"Online" },
    { name:"Khalid Omar",     role:"Competition Manager",          tasks:12,score:91,status:"Online" },
    { name:"Fatima Hassan",   role:"VIP Event Specialist",         tasks:5, score:96,status:"Busy" },
    { name:"Ahmad Nasser",    role:"Event Analytics Specialist",   tasks:6, score:87,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#FFC83D",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 Event Operations Team" subtitle="Event Staff Management" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff",  v:"12",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",   v:"8",   color:"#10B981",icon:"🟢" },
        { l:"Avg Score",    v:"92%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Add Staff"]}/>
      {staff.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(168,85,247,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.name}</div>
              <div style={{ fontSize:9,color:"#A855F7" }}>{s.role} · {s.tasks} tasks</div>
            </div>
            <SBadge status={s.status} colors={sc}/>
          </div>
          <PBar label="Performance Score" value={s.score} color="#A855F7"/>
          <ACard title="" actions={["Assign Tasks","Monitor Productivity","Review Performance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventSettingsCenter({ onBack }) {
  const settings = [
    { name:"Event Rules Engine",       icon:"📋",desc:"Event creation rules and validation",       color:"#A855F7" },
    { name:"Registration Settings",    icon:"📝",desc:"Registration limits and approval workflow",  color:"#FFC83D" },
    { name:"Reward Threshold Config",  icon:"🎁",desc:"Prize distribution rules and criteria",     color:"#10B981" },
    { name:"Competition Rules",        icon:"🏆",desc:"Competition format and ranking algorithm",  color:"#1F6BFF" },
    { name:"Revenue Share Settings",   icon:"💰",desc:"Event revenue split and fee structure",     color:"#EC4899" },
    { name:"Notification Config",      icon:"🔔",desc:"Event notification templates and triggers", color:"#F97316" },
  ];
  return (
    <Shell title="⚙️ Event Settings Center" subtitle="Event System Configuration" onBack={onBack}>
      {settings.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{s.name}</div>
            <div style={{ fontSize:10,color:"#A855F7" }}>{s.desc}</div>
          </div>
          <span style={{ fontSize:16,color:"#4B5563" }}>›</span>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["Update Settings","Save Configuration","Reset Settings","Manage Event Policies"]}/>
    </Shell>
  );
}

function EMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Emergency Event Termination",  icon:"🚨",desc:"Instantly terminate any active event",                color:"#EF4444" },
    { name:"Global Event Launch",          icon:"🌍",desc:"Launch a platform-wide event instantly",              color:"#1F6BFF" },
    { name:"Mass Reward Distribution",     icon:"🎁",desc:"Distribute rewards to all event participants at once", color:"#FFC83D" },
    { name:"Event Optimization",           icon:"🧠",desc:"AI-powered event structure and timing optimizer",     color:"#10B981" },
    { name:"Revenue Optimization",         icon:"💰",desc:"Optimize event entry fees and prize allocation",      color:"#A855F7" },
    { name:"Strategic Event Planning",     icon:"📅",desc:"AI-powered quarterly event strategy generator",       color:"#EC4899" },
    { name:"Event Recovery Management",    icon:"🔄",desc:"Recover and restart failed or cancelled events",      color:"#F97316" },
  ];
  return (
    <Shell title="🚀 EM Exclusive Tools" subtitle="Event Manager Executive Powers" onBack={onBack}>
      <div style={{ background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#A855F7",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — EVENT MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools carry the highest event authority. All activations are logged and require Event Manager authentication.</div>
      </div>
      {tools.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${t.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.name}</div>
              <div style={{ fontSize:10,color:"#A855F7" }}>{t.desc}</div>
            </div>
          </div>
          <motion.button whileTap={{ scale:0.94 }}
            style={{ width:"100%",padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:12,color:"#fff",
              background:`linear-gradient(135deg,${t.color},${t.color}aa)`,boxShadow:`0 4px 14px ${t.color}40` }}>
            ⚡ Activate Tool
          </motion.button>
        </motion.div>
      ))}
    </Shell>
  );
}

/* ─────────────── MODULE REGISTRY ─────────────── */
const MODULE_SCREENS = {
  overview:     EventOverviewCenter,
  management:   EventManagementCenter,
  competitions: CompetitionManagementCenter,
  rewards:      EventRewardsCenter,
  participants: ParticipationManagementCenter,
  monitoring:   GlobalEventMonitoringCenter,
  hostevents:   HostEventCenter,
  agencyevents: AgencyEventCenter,
  vipevents:    VIPEventCenter,
  revenue:      EventRevenueCenter,
  rankings:     EventRankingsCenter,
  comms:        EventCommunicationCenter,
  festivals:    FestivalSeasonalEventsCenter,
  countries:    CountryEventPerformanceCenter,
  ai:           AIEventIntelligenceCenter,
  analytics:    EventAnalyticsCenter,
  reports:      EventReportManagementCenter,
  team:         EventOperationsTeamCenter,
  settings:     EventSettingsCenter,
  exclusive:    EMExclusiveTools,
};

const MODULES = [
  { id:"overview",     icon:"🎉", label:"Event Overview",        subtitle:"System Summary",       gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.5)" },
  { id:"management",   icon:"📅", label:"Event Management",      subtitle:"All Events",           gradient:"linear-gradient(145deg,#A855F7,#EC4899)", glow:"rgba(168,85,247,0.4)" },
  { id:"competitions", icon:"🏆", label:"Competitions",          subtitle:"Tournaments",          gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.45)" },
  { id:"rewards",      icon:"🎁", label:"Event Rewards",         subtitle:"Prize Distribution",   gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"participants", icon:"👥", label:"Participation Mgmt",    subtitle:"Registrations",        gradient:"linear-gradient(145deg,#1F6BFF,#6366F1)", glow:"rgba(31,107,255,0.35)" },
  { id:"monitoring",   icon:"🌍", label:"Global Monitoring",     subtitle:"Live Event Feed",      gradient:"linear-gradient(145deg,#0EA5E9,#1F6BFF)", glow:"rgba(14,165,233,0.35)" },
  { id:"hostevents",   icon:"🎙️", label:"Host Event Center",     subtitle:"Host Competitions",   gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"agencyevents", icon:"🏢", label:"Agency Event Center",   subtitle:"Agency Campaigns",     gradient:"linear-gradient(145deg,#FFC83D,#10B981)", glow:"rgba(255,200,61,0.35)" },
  { id:"vipevents",    icon:"💎", label:"VIP Event Center",      subtitle:"Premium Events",       gradient:"linear-gradient(145deg,#FFC83D,#A855F7)", glow:"rgba(255,200,61,0.4)" },
  { id:"revenue",      icon:"📈", label:"Event Revenue",         subtitle:"Financial Analytics",  gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.35)" },
  { id:"rankings",     icon:"🏅", label:"Event Rankings",        subtitle:"Leaderboards",         gradient:"linear-gradient(145deg,#FFC83D,#EC4899)", glow:"rgba(255,200,61,0.45)" },
  { id:"comms",        icon:"📨", label:"Event Communication",   subtitle:"Announcements",        gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"festivals",    icon:"🎊", label:"Festival & Seasonal",   subtitle:"Special Campaigns",    gradient:"linear-gradient(145deg,#EC4899,#A855F7)", glow:"rgba(236,72,153,0.35)" },
  { id:"countries",    icon:"🌍", label:"Country Performance",   subtitle:"Global Analytics",     gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"ai",           icon:"🧠", label:"AI Event Intelligence", subtitle:"AI Optimization",      gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"analytics",    icon:"📊", label:"Event Analytics",       subtitle:"Advanced Analytics",   gradient:"linear-gradient(145deg,#A855F7,#FFC83D)", glow:"rgba(168,85,247,0.35)" },
  { id:"reports",      icon:"📋", label:"Report Management",     subtitle:"Generate Reports",     gradient:"linear-gradient(145deg,#374151,#1F6BFF)", glow:"rgba(55,65,81,0.4)" },
  { id:"team",         icon:"👥", label:"Operations Team",       subtitle:"Staff Management",     gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"settings",     icon:"⚙️", label:"Event Settings",        subtitle:"System Config",        gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",    icon:"🚀", label:"EM Exclusive Tools",    subtitle:"Executive Powers",     gradient:"linear-gradient(145deg,#A855F7,#EF4444)", glow:"rgba(168,85,247,0.6)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function EventManagerDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(168,85,247,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#A855F7"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🎉 Event Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#A855F7" }}>Events · Competitions · Rewards · Rankings · Analytics</div>
          </div>
          <div style={S.purpleBadge}><span style={{ fontSize:10,fontWeight:800,color:"#A855F7" }}>🎉 EM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,85,247,0.18),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#A855F7,#FFC83D,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#A855F7",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · EVENTS, COMPETITIONS & CAMPAIGN OPERATIONS DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Event Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central event hub — planning, competitions, VIP events, seasonal campaigns, rewards, rankings, AI optimization, and global operations.</div>
        </div>

        <KGrid items={[
          { l:"Total Events",          v:"284",   color:"#A855F7",icon:"🎉" },
          { l:"Active Events",         v:"12",    color:"#10B981",icon:"🟢" },
          { l:"Upcoming Events",       v:"28",    color:"#FFC83D",icon:"📅" },
          { l:"Completed Events",      v:"244",   color:"#60A5FA",icon:"✅" },
          { l:"Event Participants",    v:"48K",   color:"#A855F7",icon:"👥" },
          { l:"Event Revenue",         v:"$42K",  color:"#FFC83D",icon:"💰" },
          { l:"Rewards Distributed",   v:"284K",  color:"#10B981",icon:"🎁" },
          { l:"Event Registrations",   v:"56K",   color:"#60A5FA",icon:"📋" },
          { l:"Engagement Rate",       v:"86%",   color:"#A855F7",icon:"📊" },
          { l:"Event Winners",         v:"4.2K",  color:"#FFC83D",icon:"🏆" },
          { l:"Event Countries",       v:"47",    color:"#60A5FA",icon:"🌍" },
          { l:"Global Growth Rate",    v:"+34%",  color:"#10B981",icon:"🚀" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#A855F7",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} EVENT MODULES · TAP TO ACCESS
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {MODULES.map((mod,i) => (
            <motion.div key={mod.id}
              initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.025,duration:0.2 }}
              whileTap={{ scale:0.91 }} onClick={() => setActiveModule(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{
                borderRadius:18,overflow:"hidden",
                background:mod.featured?"rgba(168,85,247,0.08)":"rgba(255,255,255,0.04)",
                border:mod.featured?"1.5px solid rgba(168,85,247,0.4)":"1.5px solid rgba(168,85,247,0.12)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:mod.featured?"linear-gradient(90deg,#A855F7,#FFC83D,#A855F7)":`linear-gradient(90deg,rgba(168,85,247,0.5),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#A855F7"},rgba(168,85,247,0.5))` }}/>
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#A855F7",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
                {mod.featured && <div style={{ position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#A855F7",boxShadow:"0 0 8px rgba(168,85,247,0.9)"}}/>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}