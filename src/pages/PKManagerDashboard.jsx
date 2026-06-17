/**
 * PKManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > PK Manager
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
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,80,80,0.15)", borderRadius:18, ...x }),
  redBadge: { padding:"4px 10px", borderRadius:20, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)" },
  sec: { fontSize:10, fontWeight:800, color:"#EF4444", letterSpacing:"0.08em", marginBottom:10 },
  kpi: (c) => ({ background:`linear-gradient(145deg,${c}18,${c}08)`, border:`1px solid ${c}30`, borderRadius:14, padding:"12px 8px", textAlign:"center" }),
  btn: (g, glow) => ({ padding:"8px 11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, color:"#fff", background:g, boxShadow:`0 4px 12px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GRADS = ["linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#A78BFA,#7C3AED)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#F97316,#EA580C)"];
const GLOWS  = ["rgba(239,68,68,0.4)","rgba(255,200,61,0.35)","rgba(167,139,250,0.3)","rgba(16,185,129,0.3)","rgba(31,107,255,0.3)","rgba(249,115,22,0.3)"];

const battleData  = [{d:"Mon",v:284},{d:"Tue",v:342},{d:"Wed",v:298},{d:"Thu",v:412},{d:"Fri",v:486},{d:"Sat",v:524},{d:"Sun",v:398}];
const revenueData = [{d:"Jan",v:8.4},{d:"Feb",v:11.2},{d:"Mar",v:9.8},{d:"Apr",v:14.2},{d:"May",v:18.4},{d:"Jun",v:22.8}];
const fairPlay    = [{d:"Mon",v:96},{d:"Tue",v:94},{d:"Wed",v:97},{d:"Thu",v:95},{d:"Fri",v:98},{d:"Sat",v:96},{d:"Sun",v:97}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Shell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(239,68,68,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(239,68,68,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#EF4444"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#EF4444" }}>{subtitle}</div>
          </div>
          <div style={S.redBadge}><span style={{ fontSize:10,fontWeight:800,color:"#EF4444" }}>⚔️ PKM</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#EF4444" }) => (
        <div key={l} style={S.kpi(color)}>
          {icon && <div style={{ fontSize:15,marginBottom:2 }}>{icon}</div>}
          <div style={{ fontSize:13,fontWeight:900,color }}>{v}</div>
          <div style={{ fontSize:8,color:"rgba(255,255,255,0.45)",marginTop:2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function ARow({ actions }) {
  return (
    <div style={{ display:"flex",flexWrap:"wrap" }}>
      {actions.map((a,i) => <motion.button key={a} whileTap={{ scale:0.92 }} style={S.btn(GRADS[i%GRADS.length],GLOWS[i%GLOWS.length])}>{a}</motion.button>)}
    </div>
  );
}

function ActionCard({ title, actions }) {
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      {title && <div style={S.sec}>{title}</div>}
      <ARow actions={actions}/>
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
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#EF4444" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#EF4444" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gid})`} strokeWidth={2} dot={{ fill:"#EF4444",r:2 }}/>
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

/* ─────────────── MODULE SCREENS ─────────────── */

function PKOverviewCenter({ onBack }) {
  return (
    <Shell title="⚔️ PK Overview Center" subtitle="Complete PK Ecosystem Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Total PK Battles",  v:"48.4K", color:"#EF4444",icon:"⚔️" },
        { l:"Active Now",        v:"284",   color:"#10B981",icon:"🔴" },
        { l:"Completed Today",   v:"1.2K",  color:"#FFC83D",icon:"✅" },
        { l:"Daily Revenue",     v:"$8.4K", color:"#A78BFA",icon:"💰" },
        { l:"Fair Play Score",   v:"96%",   color:"#10B981",icon:"🛡️" },
        { l:"Growth Rate",       v:"+28%",  color:"#60A5FA",icon:"🚀" },
      ]}/>
      <Chart label="⚔️ DAILY PK BATTLES" data={battleData} color="#EF4444" gid="po1" type="bar"/>
      <Chart label="💰 PK REVENUE TREND ($K)" data={revenueData} color="#FFC83D" gid="po2"/>
      <Chart label="🛡️ FAIR PLAY SCORE" data={fairPlay} color="#10B981" gid="po3"/>
      <ActionCard title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data","Monitor Activity"]}/>
    </Shell>
  );
}

function PKBattleManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const battles = [
    { id:"PKB-4821",host1:"@SaraLive",  host2:"@MoonVoice",gifts1:"4,200",gifts2:"3,800",duration:"18m",status:"Live",    room:"Room #4821",color:"#EF4444" },
    { id:"PKB-4798",host1:"@StarQA",    host2:"@NoorQA",    gifts1:"2,840",gifts2:"3,120",duration:"24m",status:"Live",    room:"Room #4798",color:"#EF4444" },
    { id:"PKB-4762",host1:"@DiamondVox",host2:"@RoyalQA",   gifts1:"6,840",gifts2:"5,920",duration:"32m",status:"Completed",room:"Room #4762",color:"#10B981" },
    { id:"PKB-4741",host1:"@LunaQA",    host2:"@StarVoice", gifts1:"-",    gifts2:"-",    duration:"-",  status:"Scheduled",room:"Room #4741",color:"#FFC83D" },
  ];
  const sc = { Live:"#EF4444",Completed:"#10B981",Scheduled:"#FFC83D",Cancelled:"#9CA3AF" };
  const filters = ["All","Live","Completed","Scheduled"];
  const visible = filter==="All" ? battles : battles.filter(b => b.status===filter);
  return (
    <Shell title="🎙️ PK Battle Management" subtitle="All PK Battles" onBack={onBack}>
      <KGrid items={[
        { l:"Live Now",   v:"284",  color:"#EF4444",icon:"🔴" },
        { l:"Scheduled",  v:"42",   color:"#FFC83D",icon:"📅" },
        { l:"Today Total",v:"1.2K", color:"#10B981",icon:"⚔️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#EF4444" }}>
            {f}
          </motion.button>
        ))}
      </div>
      <ActionCard title="⚡ CREATE" actions={["Create Battle"]}/>
      {visible.map((b,i) => (
        <motion.div key={b.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${b.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",gap:6,alignItems:"center",marginBottom:4 }}>
                <span style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{b.host1}</span>
                <span style={{ fontSize:12,color:"#EF4444",fontWeight:900 }}>⚔️</span>
                <span style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{b.host2}</span>
              </div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{b.id} · {b.room}</div>
              {b.gifts1!=="-" && <div style={{ fontSize:9,color:"#FFC83D",marginTop:2 }}>Gifts: {b.gifts1} vs {b.gifts2} · Duration: {b.duration}</div>}
            </div>
            <SBadge status={b.status} colors={sc}/>
          </div>
          <ActionCard title="" actions={["Edit Battle","Start Battle","End Battle","Cancel Battle","Review Battle"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKTournamentCenter({ onBack }) {
  const tournaments = [
    { name:"VYRO Summer Championship",  date:"Jun 28–Jul 5",  teams:"64",  prize:"500K coins",status:"Upcoming",  icon:"🏆" },
    { name:"Regional PK Masters",       date:"Jul 10–Jul 17", teams:"32",  prize:"200K coins",status:"Planning",  icon:"🏆" },
    { name:"Monthly Elite Battle Cup",  date:"Jun 20–Jun 25", teams:"16",  prize:"100K coins",status:"Live",      icon:"🏆" },
    { name:"Diamond Tier Championship", date:"Aug 1–Aug 7",   teams:"128", prize:"1M coins",  status:"Planning",  icon:"👑" },
  ];
  const sc = { Live:"#EF4444",Upcoming:"#FFC83D",Planning:"#A78BFA",Completed:"#10B981" };
  return (
    <Shell title="🏆 PK Tournament Center" subtitle="Tournaments & Championship Events" onBack={onBack}>
      <KGrid items={[
        { l:"Active Tournaments",v:"1",      color:"#EF4444",icon:"🏆" },
        { l:"Upcoming",          v:"3",      color:"#FFC83D",icon:"📅" },
        { l:"Total Prize Pool",  v:"1.8M",   color:"#A78BFA",icon:"💰" },
      ]}/>
      <ActionCard title="⚡ CREATE" actions={["Create Tournament"]}/>
      {tournaments.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(239,68,68,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.name}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{t.date} · {t.teams} teams</div>
              <div style={{ fontSize:9,color:"#FFC83D",fontWeight:800,marginTop:1 }}>Prize: {t.prize}</div>
            </div>
            <SBadge status={t.status} colors={sc}/>
          </div>
          <ActionCard title="" actions={["Manage Brackets","Schedule Matches","Monitor Tournament","Announce Winners"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKEventManagementCenter({ onBack }) {
  const events = [
    { name:"Ramadan PK Special",      date:"Mar 2027",  participants:"2K", prize:"1M coins",  status:"Planning", icon:"🌙" },
    { name:"Summer PK Showdown",      date:"Jun 20-30", participants:"4K", prize:"500K coins",status:"Active",   icon:"☀️" },
    { name:"National Day PK Battle",  date:"Dec 18",    participants:"1K", prize:"200K coins",status:"Planning", icon:"🇶🇦" },
    { name:"Anniversary PK Gala",     date:"Sep 1",     participants:"8K", prize:"2M coins",  status:"Planning", icon:"🥂" },
  ];
  const sc = { Active:"#EF4444",Planning:"#A78BFA",Upcoming:"#FFC83D",Completed:"#10B981" };
  return (
    <Shell title="🎉 PK Event Management" subtitle="Seasonal PK Events & Competitions" onBack={onBack}>
      <KGrid items={[
        { l:"Active Events",  v:"1",     color:"#EF4444",icon:"🎉" },
        { l:"Planning",       v:"3",     color:"#A78BFA",icon:"📝" },
        { l:"Total Prize",    v:"3.7M",  color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ActionCard title="⚡ CREATE" actions={["Create Event"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(239,68,68,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{e.date} · {e.participants} participants</div>
              <div style={{ fontSize:9,color:"#FFC83D",fontWeight:800,marginTop:1 }}>Prize: {e.prize}</div>
            </div>
            <SBadge status={e.status} colors={sc}/>
          </div>
          <ActionCard title="" actions={["Launch Event","Edit Event","Pause Event","End Event"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKRewardsCenter({ onBack }) {
  const rewards = [
    { name:"PK Winner Coins",        icon:"🥇",value:"1,000 coins",  recipients:"1.2K",status:"Active",  color:"#FFC83D" },
    { name:"Tournament Champion",    icon:"🏆",value:"50K coins",    recipients:"4",   status:"Active",  color:"#EF4444" },
    { name:"PK Streak Bonus",        icon:"🔥",value:"500 coins",    recipients:"284", status:"Active",  color:"#F97316" },
    { name:"Perfect Victory Reward", icon:"⭐",value:"2,000 coins",  recipients:"142", status:"Active",  color:"#A78BFA" },
    { name:"Runner-Up Prize",        icon:"🥈",value:"500 coins",    recipients:"1.2K",status:"Active",  color:"#9CA3AF" },
  ];
  const sc = { Active:"#10B981",Paused:"#F59E0B",Inactive:"#9CA3AF" };
  return (
    <Shell title="🎁 PK Rewards Center" subtitle="PK Reward Programs" onBack={onBack}>
      <KGrid items={[
        { l:"Active Rewards",v:"8",    color:"#10B981",icon:"🎁" },
        { l:"Distributed",   v:"48K",  color:"#FFC83D",icon:"📤" },
        { l:"Total Value",   v:"84M",  color:"#A78BFA",icon:"🪙" },
      ]}/>
      <ActionCard title="⚡ CREATE" actions={["Create Reward"]}/>
      {rewards.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${r.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${r.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{r.value} · {r.recipients} recipients</div>
            </div>
            <SBadge status={r.status} colors={sc}/>
          </div>
          <ActionCard title="" actions={["Assign Reward","Approve Distribution","View Reward History"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKRankingsCenter({ onBack }) {
  const [tab, setTab] = useState("Daily");
  const data = {
    Daily:[
      { rank:1,name:"@SaraLive",   wins:"8",coins:"42K",streak:"5",icon:"🎙️" },
      { rank:2,name:"@MoonVoice",  wins:"6",coins:"31K",streak:"3",icon:"🎙️" },
      { rank:3,name:"@DiamondVox", wins:"5",coins:"28K",streak:"4",icon:"🎙️" },
      { rank:4,name:"@StarQA",     wins:"4",coins:"21K",streak:"2",icon:"🎙️" },
      { rank:5,name:"@NoorQA",     wins:"4",coins:"19K",streak:"1",icon:"🎙️" },
    ],
    Weekly:[
      { rank:1,name:"@DiamondVox", wins:"42",coins:"284K",streak:"12",icon:"🎙️" },
      { rank:2,name:"@SaraLive",   wins:"38",coins:"248K",streak:"8", icon:"🎙️" },
      { rank:3,name:"@MoonVoice",  wins:"34",coins:"218K",streak:"6", icon:"🎙️" },
    ],
    Monthly:[
      { rank:1,name:"@DiamondVox", wins:"184",coins:"1.2M",streak:"28",icon:"🎙️" },
      { rank:2,name:"@RoyalQA",    wins:"162",coins:"1.0M",streak:"24",icon:"🎙️" },
      { rank:3,name:"@SaraLive",   wins:"148",coins:"920K",streak:"21",icon:"🎙️" },
    ],
  };
  const goldColors = { 1:"#FFC83D",2:"#C0C0C0",3:"#CD7F32" };
  return (
    <Shell title="🏅 PK Rankings Center" subtitle="PK Battle Leaderboards" onBack={onBack}>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {["Daily","Weekly","Monthly"].map(t => (
          <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTab(t)}
            style={{ flex:1,padding:"8px",borderRadius:12,fontSize:10,fontWeight:800,border:"none",cursor:"pointer",
              background:tab===t?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:tab===t?"#fff":"#EF4444" }}>
            {t}
          </motion.button>
        ))}
      </div>
      {data[tab].map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:`${(goldColors[e.rank]||"#9CA3AF")}22`,border:`2px solid ${goldColors[e.rank]||"#9CA3AF"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:goldColors[e.rank]||"#9CA3AF",flexShrink:0 }}>
            {e.rank}
          </div>
          <span style={{ fontSize:22,flexShrink:0 }}>{e.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
            <div style={{ fontSize:9,color:"#EF4444",marginTop:1 }}>{e.wins} wins · {e.coins} coins · 🔥{e.streak} streak</div>
          </div>
          <div style={{ fontSize:11,fontWeight:900,color:goldColors[e.rank]||"#9CA3AF" }}>#{e.rank}</div>
        </motion.div>
      ))}
      <ActionCard title="⚡" actions={["Export Rankings","Analyze Performance"]}/>
    </Shell>
  );
}

function GlobalPKMonitoringCenter({ onBack }) {
  const live = [
    { id:"PKB-4821",host1:"@SaraLive",  host2:"@MoonVoice",gifts:"8,020",viewers:"2.4K",duration:"18m",country:"Qatar",     color:"#EF4444" },
    { id:"PKB-4798",host1:"@StarQA",    host2:"@NoorQA",    gifts:"5,960",viewers:"1.8K",duration:"24m",country:"Saudi Arabia",color:"#F97316" },
    { id:"PKB-4784",host1:"@RoyalQA",   host2:"@DiamondVox",gifts:"12,760",viewers:"4.2K",duration:"32m",country:"UAE",     color:"#A78BFA" },
  ];
  return (
    <Shell title="🌍 Global PK Monitoring" subtitle="Live Battle Monitoring Worldwide" onBack={onBack}>
      <KGrid items={[
        { l:"Live Battles",   v:"284",  color:"#EF4444",icon:"🔴" },
        { l:"Total Viewers",  v:"48K",  color:"#FFC83D",icon:"👁️" },
        { l:"Active Countries",v:"28",  color:"#60A5FA",icon:"🌍" },
      ]}/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🔴 LIVE BATTLE FEED</div>
        {live.map((b,i) => (
          <div key={b.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<live.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",gap:5,alignItems:"center",marginBottom:2 }}>
                <span style={{ fontSize:10,fontWeight:900,color:"#fff" }}>{b.host1}</span>
                <span style={{ fontSize:11,color:"#EF4444" }}>⚔️</span>
                <span style={{ fontSize:10,fontWeight:900,color:"#fff" }}>{b.host2}</span>
              </div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{b.country} · {b.duration} · 👁️ {b.viewers}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>🎁 {b.gifts} total gifts</div>
            </div>
            <div style={{ width:8,height:8,borderRadius:"50%",background:b.color,boxShadow:`0 0 8px ${b.color}` }}/>
          </div>
        ))}
      </div>
      <ActionCard title="⚡" actions={["View Live Battles","Monitor Activity","Join Battle","Observe Performance","Review Results"]}/>
    </Shell>
  );
}

function AIFairPlayCenter({ onBack }) {
  const flags = [
    { id:"FP-4821",battle:"PKB-4821",type:"Unusual Gift Spike",   risk:"High",   host:"@StarQA",    detail:"8x normal gift rate in 2 min",color:"#EF4444" },
    { id:"FP-4798",battle:"PKB-4798",type:"Coordinated Gifting",  risk:"High",   host:"@NoorQA",    detail:"12 accounts gifting simultaneously",color:"#EF4444" },
    { id:"FP-4762",battle:"PKB-4762",type:"Account Anomaly",      risk:"Medium", host:"@LunaQA",    detail:"New accounts with high gift activity",color:"#F59E0B" },
    { id:"FP-4741",battle:"PKB-4741",type:"Velocity Check",       risk:"Low",    host:"@DiamondVox",detail:"Minor deviation from norm",color:"#FFC83D" },
  ];
  const sc = { High:"#EF4444",Medium:"#F59E0B",Low:"#FFC83D",Clear:"#10B981" };
  return (
    <Shell title="🧠 AI Fair Play Center" subtitle="Anti-Cheat & Battle Integrity" onBack={onBack}>
      <KGrid items={[
        { l:"Fair Play Score",v:"96%",  color:"#10B981",icon:"🛡️" },
        { l:"Flagged Today",  v:"12",   color:"#EF4444",icon:"🚨" },
        { l:"AI Accuracy",    v:"98%",  color:"#A78BFA",icon:"🧠" },
      ]}/>
      <Chart label="🛡️ FAIR PLAY SCORE" data={fairPlay} color="#10B981" gid="fp1"/>
      <div style={S.sec}>🚨 FLAGGED ACTIVITY</div>
      {flags.map((f,i) => (
        <motion.div key={f.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${f.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{f.type}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{f.id} · {f.battle} · {f.host}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{f.detail}</div>
            </div>
            <SBadge status={f.risk} colors={sc}/>
          </div>
          <ActionCard title="" actions={["Analyze Battle","Generate Risk Score","Flag Activity","Recommend Actions"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKDisputesCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const disputes = [
    { id:"DSP-1284",battle:"PKB-4798",complainant:"@MoonVoice",type:"Gift Manipulation",priority:"High",  status:"Open",       date:"Jun 17",color:"#EF4444" },
    { id:"DSP-1262",battle:"PKB-4762",complainant:"@StarQA",   type:"Result Dispute",   priority:"Medium",status:"Reviewing",   date:"Jun 16",color:"#F59E0B" },
    { id:"DSP-1241",battle:"PKB-4741",complainant:"@NoorQA",   type:"Technical Issue",  priority:"Low",   status:"Resolved",   date:"Jun 15",color:"#10B981" },
    { id:"DSP-1224",battle:"PKB-4724",complainant:"@LunaQA",   type:"Rule Violation",   priority:"High",  status:"Closed",     date:"Jun 14",color:"#9CA3AF" },
  ];
  const sc = { Open:"#EF4444",Reviewing:"#F59E0B",Resolved:"#10B981",Closed:"#9CA3AF" };
  const pc = { High:"#EF4444",Medium:"#F59E0B",Low:"#FFC83D" };
  const filters = ["All","Open","Reviewing","Resolved"];
  const visible = filter==="All" ? disputes : disputes.filter(d => d.status===filter);
  return (
    <Shell title="🚨 PK Reports & Disputes" subtitle="Dispute Resolution Center" onBack={onBack}>
      <KGrid items={[
        { l:"Open Cases",    v:"4",  color:"#EF4444",icon:"🚨" },
        { l:"Reviewing",     v:"8",  color:"#F59E0B",icon:"🔍" },
        { l:"Resolved",      v:"48", color:"#10B981",icon:"✅" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#EF4444" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((d,i) => (
        <motion.div key={d.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${d.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{d.type}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{d.id} · {d.battle} · {d.complainant}</div>
              <div style={{ display:"flex",gap:6,marginTop:4 }}>
                <span style={{ fontSize:9,padding:"2px 7px",borderRadius:7,background:`${pc[d.priority]}18`,color:pc[d.priority],fontWeight:700 }}>{d.priority}</span>
                <span style={{ fontSize:9,color:"#9CA3AF" }}>{d.date}</span>
              </div>
            </div>
            <SBadge status={d.status} colors={sc}/>
          </div>
          <ActionCard title="" actions={["Review Complaint","Investigate Battle","Approve Resolution","Reject Claim","Close Case"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKRevenueCenter({ onBack }) {
  const breakdown = [
    { l:"Battle Entry Fees", v:"$42K",pct:50,color:"#EF4444" },
    { l:"Tournament Fees",   v:"$18K",pct:21,color:"#FFC83D" },
    { l:"PK Gift Revenue",   v:"$14K",pct:17,color:"#A78BFA" },
    { l:"Event Fees",        v:"$10K",pct:12,color:"#10B981" },
  ];
  return (
    <Shell title="💰 PK Revenue Center" subtitle="PK Revenue & Earnings Analysis" onBack={onBack}>
      <KGrid items={[
        { l:"Total Revenue",  v:"$84K",  color:"#FFC83D",icon:"💰" },
        { l:"Daily Revenue",  v:"$8.4K", color:"#EF4444",icon:"📅" },
        { l:"Monthly Growth", v:"+28%",  color:"#10B981",icon:"📈" },
      ]}/>
      <Chart label="💰 PK REVENUE TREND ($K)" data={revenueData} color="#FFC83D" gid="rev1"/>
      <Chart label="⚔️ DAILY PK BATTLES" data={battleData} color="#EF4444" gid="rev2" type="bar"/>
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
      <ActionCard title="⚡" actions={["Analyze Revenue","Export Revenue Report","Compare Revenue","View Revenue Breakdown"]}/>
    </Shell>
  );
}

function PKAchievementCenter({ onBack }) {
  const achievements = [
    { name:"First PK Victory",       icon:"⚔️",req:"Win first PK battle",         reward:"100 coins", unlocked:"48K",color:"#EF4444" },
    { name:"10 Win Streak",          icon:"🔥",req:"Win 10 consecutive PKs",       reward:"1K coins",  unlocked:"4.2K",color:"#F97316" },
    { name:"Tournament Champion",    icon:"🏆",req:"Win a tournament",             reward:"10K coins", unlocked:"284", color:"#FFC83D" },
    { name:"PK Legend",              icon:"🌟",req:"100 total PK wins",            reward:"5K coins",  unlocked:"1.2K",color:"#A78BFA" },
    { name:"Gift Dominator",         icon:"🎁",req:"Receive 10K gifts in PK",      reward:"2K coins",  unlocked:"842", color:"#10B981" },
  ];
  return (
    <Shell title="🎖️ PK Achievement Center" subtitle="PK Milestones & Achievement Rewards" onBack={onBack}>
      <KGrid items={[
        { l:"Total Achievements",v:"24",    color:"#FFC83D",icon:"🎖️" },
        { l:"Unlocked Today",    v:"2.8K",  color:"#10B981",icon:"🔓" },
        { l:"Total Unlocks",     v:"148K",  color:"#A78BFA",icon:"🏅" },
      ]}/>
      <ActionCard title="⚡ CREATE" actions={["Create Achievement"]}/>
      {achievements.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${a.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>Req: {a.req}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Reward: <span style={{ color:a.color,fontWeight:800 }}>{a.reward}</span> · Unlocked: {a.unlocked}</div>
            </div>
          </div>
          <ActionCard title="" actions={["Assign Rewards","Track Progress","Generate Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function HostPKPerformanceCenter({ onBack }) {
  const hosts = [
    { name:"@DiamondVox",wins:"184",losses:"42",winRate:"81%",coins:"1.2M",streak:"12",rank:1,color:"#FFC83D" },
    { name:"@SaraLive",  wins:"162",losses:"48",winRate:"77%",coins:"984K",streak:"8", rank:2,color:"#C0C0C0" },
    { name:"@MoonVoice", wins:"148",losses:"52",winRate:"74%",coins:"862K",streak:"6", rank:3,color:"#CD7F32" },
    { name:"@RoyalQA",   wins:"124",losses:"62",winRate:"67%",coins:"712K",streak:"4", rank:4,color:"#60A5FA" },
  ];
  return (
    <Shell title="🎙️ Host PK Performance" subtitle="Host Battle Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Active Hosts",  v:"1.2K",  color:"#A78BFA",icon:"🎙️" },
        { l:"Avg Win Rate",  v:"72%",   color:"#FFC83D",icon:"📊" },
        { l:"Top Win Rate",  v:"81%",   color:"#10B981",icon:"🏆" },
      ]}/>
      {hosts.map((h,i) => (
        <motion.div key={h.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ width:34,height:34,borderRadius:"50%",background:`${h.color}22`,border:`2px solid ${h.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:h.color,flexShrink:0 }}>
            {h.rank}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{h.name}</div>
            <div style={{ fontSize:9,color:"#EF4444" }}>W:{h.wins} L:{h.losses} · Rate: {h.winRate} · 🔥{h.streak}</div>
            <div style={{ fontSize:9,color:"#FFC83D",fontWeight:800,marginTop:1 }}>🪙 {h.coins} earned</div>
          </div>
        </motion.div>
      ))}
      <ActionCard title="⚡" actions={["View Performance","Analyze Results","Compare Hosts","Export Statistics"]}/>
    </Shell>
  );
}

function AgencyPKPerformanceCenter({ onBack }) {
  const agencies = [
    { name:"StarPro QA",  flag:"🇶🇦",hosts:"42",battles:"1.2K",wins:"684",revenue:"$12K",rank:1,color:"#FFC83D" },
    { name:"EliteMedia",  flag:"🇸🇦",hosts:"28",battles:"842", wins:"462",revenue:"$8.4K",rank:2,color:"#C0C0C0" },
    { name:"VoiceHouse",  flag:"🇦🇪",hosts:"21",battles:"624", wins:"312",revenue:"$6.2K",rank:3,color:"#CD7F32" },
    { name:"GlobalSound", flag:"🇰🇼",hosts:"18",battles:"412", wins:"218",revenue:"$4.1K",rank:4,color:"#60A5FA" },
  ];
  return (
    <Shell title="🏢 Agency PK Performance" subtitle="Agency Competition Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Active Agencies",v:"24",    color:"#FFC83D",icon:"🏢" },
        { l:"Total Battles",  v:"4.8K",  color:"#EF4444",icon:"⚔️" },
        { l:"Total Revenue",  v:"$42K",  color:"#10B981",icon:"💰" },
      ]}/>
      {agencies.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:8 }}>
            <span style={{ fontSize:26 }}>{a.flag}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{a.hosts} hosts · {a.battles} battles · {a.wins} wins</div>
              <div style={{ fontSize:9,color:"#FFC83D",fontWeight:800,marginTop:1 }}>Revenue: {a.revenue}</div>
            </div>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`${a.color}22`,border:`2px solid ${a.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:a.color }}>{a.rank}</div>
          </div>
        </motion.div>
      ))}
      <ActionCard title="⚡" actions={["View Agency Rankings","Compare Agencies","Export Reports","Analyze Performance"]}/>
    </Shell>
  );
}

function CountryPKPerformanceCenter({ onBack }) {
  const countries = [
    { name:"Saudi Arabia",flag:"🇸🇦",battles:"18K",revenue:"$28K",growth:"+24%",pct:37,color:"#10B981" },
    { name:"Qatar",       flag:"🇶🇦",battles:"12K",revenue:"$18K",growth:"+34%",pct:25,color:"#EF4444" },
    { name:"UAE",         flag:"🇦🇪",battles:"8.4K",revenue:"$12K",growth:"+22%",pct:17,color:"#A78BFA" },
    { name:"Kuwait",      flag:"🇰🇼",battles:"4.8K",revenue:"$7.2K",growth:"+18%",pct:10,color:"#FFC83D" },
    { name:"Egypt",       flag:"🇪🇬",battles:"4.2K",revenue:"$6.4K",growth:"+42%",pct:9, color:"#60A5FA" },
  ];
  return (
    <Shell title="🌍 Country PK Performance" subtitle="Country-Wise PK Analytics" onBack={onBack}>
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
              <div style={{ fontSize:9,color:"#EF4444" }}>{c.battles} battles · {c.pct}% of total</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{c.revenue}</div>
              <div style={{ fontSize:10,fontWeight:800,color:"#10B981" }}>{c.growth}</div>
            </div>
          </div>
          <PBar label="" value={c.pct} color={c.color}/>
        </motion.div>
      ))}
      <ActionCard title="⚡" actions={["View Statistics","Compare Countries","Export Reports","Monitor Growth"]}/>
    </Shell>
  );
}

function PKAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📈 PK Analytics Center" subtitle="Advanced PK Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Avg Battle Duration",v:"22m",   color:"#EF4444",icon:"⏱️" },
        { l:"Avg Gifts Per Battle",v:"4.2K", color:"#FFC83D",icon:"🎁" },
        { l:"Viewer Avg",          v:"1.8K", color:"#A78BFA",icon:"👁️" },
      ]}/>
      <Chart label="⚔️ DAILY PK BATTLES" data={battleData} color="#EF4444" gid="an1" type="bar"/>
      <Chart label="💰 PK REVENUE TREND ($K)" data={revenueData} color="#FFC83D" gid="an2"/>
      <Chart label="🛡️ FAIR PLAY SCORE" data={fairPlay} color="#10B981" gid="an3"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 PERFORMANCE vs TARGETS</div>
        <PBar label="Battle Volume Target"  value={84} color="#EF4444"/>
        <PBar label="Revenue Target"        value={88} color="#FFC83D"/>
        <PBar label="Fair Play Target"      value={96} color="#10B981"/>
        <PBar label="Participant Growth"    value={78} color="#A78BFA"/>
      </div>
      <ActionCard title="⚡" actions={["View Analytics","Export Analytics","Generate Insights","Compare Metrics"]}/>
    </Shell>
  );
}

function PKCommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Participants");
  const [channel, setChannel] = useState("In-App Message");
  return (
    <Shell title="📨 PK Communication Center" subtitle="PK Participant Communications" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🎯 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Participants","Active Hosts","Tournament Players","Top Ranked","Event Registrants"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#EF4444" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 CHANNEL</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["In-App Message","Push Notification","Email","Battle Room Notice"].map(c => (
            <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setChannel(c)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:channel===c?"linear-gradient(135deg,#A78BFA,#7C3AED)":"rgba(255,255,255,0.06)",color:channel===c?"#fff":"#EF4444" }}>
              {c}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Write your PK announcement or message…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#EF4444,#B91C1C)",boxShadow:"0 6px 20px rgba(239,68,68,0.4)" }}>
          ⚔️ Send PK Message
        </motion.button>
      </div>
      <ActionCard title="⚡ MORE" actions={["Broadcast Event Notice","Notify Participants","Send Tournament Updates"]}/>
    </Shell>
  );
}

function PKReportManagementCenter({ onBack }) {
  const reports = [
    { name:"Daily PK Report",             date:"Jun 17",size:"420 KB",status:"Ready" },
    { name:"Weekly PK Report",            date:"Jun 15",size:"1.1 MB",status:"Ready" },
    { name:"PK Revenue Report",           date:"Jun 14",size:"840 KB",status:"Ready" },
    { name:"PK Tournament Report",        date:"Jun 10",size:"620 KB",status:"Ready" },
    { name:"Host PK Performance Report",  date:"Jun 7", size:"980 KB",status:"Archived" },
    { name:"PK Fair Play Report",         date:"Jun 1", size:"540 KB",status:"Archived" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📋 PK Report Management" subtitle="Generate & Manage PK Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports",v:"48",  color:"#60A5FA",icon:"📋" },
        { l:"This Month",   v:"14",  color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",    v:"4",   color:"#10B981",icon:"⏰" },
      ]}/>
      <ActionCard title="⚡ CREATE" actions={["Generate Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(239,68,68,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📋</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{r.name}</div>
            <div style={{ fontSize:9,color:"#EF4444",marginTop:2 }}>{r.date} · {r.size}</div>
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

function PKOperationsTeamCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior PK Battle Moderator",  tasks:8, score:94,status:"Online" },
    { name:"Khalid Omar",     role:"PK Tournament Coordinator",   tasks:12,score:89,status:"Online" },
    { name:"Fatima Hassan",   role:"Fair Play Analyst",           tasks:6, score:96,status:"Busy" },
    { name:"Ahmad Nasser",    role:"PK Analytics Specialist",     tasks:5, score:87,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#FFC83D",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 PK Operations Team" subtitle="PK Staff Management" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff",  v:"10",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",   v:"7",   color:"#10B981",icon:"🟢" },
        { l:"Avg Score",    v:"92%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ActionCard title="⚡ CREATE" actions={["Add Staff"]}/>
      {staff.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(239,68,68,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.name}</div>
              <div style={{ fontSize:9,color:"#EF4444" }}>{s.role} · {s.tasks} tasks</div>
            </div>
            <SBadge status={s.status} colors={sc}/>
          </div>
          <PBar label="Performance Score" value={s.score} color="#EF4444"/>
          <ActionCard title="" actions={["Assign Tasks","Review Performance","Monitor Productivity"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKSettingsCenter({ onBack }) {
  const settings = [
    { name:"Battle Rules Engine",     icon:"⚔️",desc:"PK battle rules and match conditions",   color:"#EF4444" },
    { name:"Tournament Config",       icon:"🏆",desc:"Tournament bracket and scheduling rules", color:"#FFC83D" },
    { name:"Reward Thresholds",       icon:"🎁",desc:"PK reward criteria and payout rules",     color:"#A78BFA" },
    { name:"Fair Play Rules",         icon:"🛡️",desc:"Anti-cheat detection thresholds",         color:"#10B981" },
    { name:"Revenue Share Settings",  icon:"💰",desc:"Battle entry fee distribution rules",     color:"#60A5FA" },
    { name:"Ranking Algorithm",       icon:"📊",desc:"PK ranking calculation methodology",      color:"#F97316" },
  ];
  return (
    <Shell title="⚙️ PK Settings Center" subtitle="PK System Configuration" onBack={onBack}>
      {settings.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{s.name}</div>
            <div style={{ fontSize:10,color:"#EF4444" }}>{s.desc}</div>
          </div>
          <span style={{ fontSize:16,color:"#4B5563" }}>›</span>
        </motion.div>
      ))}
      <ActionCard title="⚡" actions={["Update Settings","Save Configuration","Reset Settings","Manage PK Policies"]}/>
    </Shell>
  );
}

function PKExclusiveTools({ onBack }) {
  const tools = [
    { name:"Emergency Battle Termination", icon:"🚨",desc:"Instantly terminate any active PK battle",            color:"#EF4444" },
    { name:"Global Tournament Launch",     icon:"🌍",desc:"Launch a platform-wide tournament instantly",          color:"#1F6BFF" },
    { name:"PK Reward Optimization",       icon:"🎁",desc:"AI-powered PK reward reallocation for max engagement", color:"#FFC83D" },
    { name:"Fair Play Enforcement",        icon:"🛡️",desc:"Force-activate enhanced fair play monitoring",         color:"#10B981" },
    { name:"Revenue Optimization",         icon:"💰",desc:"Optimize PK entry fees and prize pool distribution",   color:"#A78BFA" },
    { name:"Anti-Cheat Investigation",     icon:"🔍",desc:"Launch deep investigation on flagged accounts",        color:"#F97316" },
    { name:"Strategic PK Planning",        icon:"🧠",desc:"AI-powered quarterly PK strategy generator",          color:"#60A5FA" },
  ];
  return (
    <Shell title="🚀 PK Manager Exclusive Tools" subtitle="Executive PK Powers" onBack={onBack}>
      <div style={{ background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#EF4444",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — PK MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools carry the highest PK authority. All activations are logged and require PK Manager authentication.</div>
      </div>
      {tools.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${t.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.name}</div>
              <div style={{ fontSize:10,color:"#EF4444" }}>{t.desc}</div>
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
  overview:    PKOverviewCenter,
  battles:     PKBattleManagementCenter,
  tournaments: PKTournamentCenter,
  events:      PKEventManagementCenter,
  rewards:     PKRewardsCenter,
  rankings:    PKRankingsCenter,
  monitoring:  GlobalPKMonitoringCenter,
  fairplay:    AIFairPlayCenter,
  disputes:    PKDisputesCenter,
  revenue:     PKRevenueCenter,
  achievements:PKAchievementCenter,
  hostperf:    HostPKPerformanceCenter,
  agencyperf:  AgencyPKPerformanceCenter,
  countries:   CountryPKPerformanceCenter,
  analytics:   PKAnalyticsCenter,
  comms:       PKCommunicationCenter,
  reports:     PKReportManagementCenter,
  team:        PKOperationsTeamCenter,
  settings:    PKSettingsCenter,
  exclusive:   PKExclusiveTools,
};

const MODULES = [
  { id:"overview",    icon:"⚔️", label:"PK Overview",           subtitle:"Ecosystem Summary",    gradient:"linear-gradient(145deg,#EF4444,#B91C1C)", glow:"rgba(239,68,68,0.5)" },
  { id:"battles",     icon:"🎙️", label:"Battle Management",      subtitle:"All PK Battles",       gradient:"linear-gradient(145deg,#EF4444,#F97316)", glow:"rgba(239,68,68,0.4)" },
  { id:"tournaments", icon:"🏆", label:"PK Tournaments",         subtitle:"Championships",        gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.45)" },
  { id:"events",      icon:"🎉", label:"PK Events",              subtitle:"Seasonal Events",      gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"rewards",     icon:"🎁", label:"PK Rewards",             subtitle:"Reward Programs",      gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"rankings",    icon:"🏅", label:"PK Rankings",            subtitle:"Battle Leaderboards",  gradient:"linear-gradient(145deg,#FFC83D,#EF4444)", glow:"rgba(255,200,61,0.45)" },
  { id:"monitoring",  icon:"🌍", label:"Global Monitoring",      subtitle:"Live Battle Feed",     gradient:"linear-gradient(145deg,#0EA5E9,#1F6BFF)", glow:"rgba(14,165,233,0.35)" },
  { id:"fairplay",    icon:"🧠", label:"AI Fair Play",           subtitle:"Anti-Cheat System",    gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.4)" },
  { id:"disputes",    icon:"🚨", label:"Reports & Disputes",     subtitle:"Dispute Resolution",   gradient:"linear-gradient(145deg,#EF4444,#A78BFA)", glow:"rgba(239,68,68,0.4)" },
  { id:"revenue",     icon:"💰", label:"PK Revenue",             subtitle:"Revenue Analytics",    gradient:"linear-gradient(145deg,#FFC83D,#10B981)", glow:"rgba(255,200,61,0.4)" },
  { id:"achievements",icon:"🎖️", label:"PK Achievements",        subtitle:"Milestone Rewards",    gradient:"linear-gradient(145deg,#F97316,#EF4444)", glow:"rgba(249,115,22,0.35)" },
  { id:"hostperf",    icon:"🎙️", label:"Host PK Performance",    subtitle:"Host Battle Stats",    gradient:"linear-gradient(145deg,#A78BFA,#1F6BFF)", glow:"rgba(167,139,250,0.35)" },
  { id:"agencyperf",  icon:"🏢", label:"Agency PK Performance",  subtitle:"Agency Rankings",      gradient:"linear-gradient(145deg,#60A5FA,#0369A1)", glow:"rgba(96,165,250,0.35)" },
  { id:"countries",   icon:"🌍", label:"Country Performance",    subtitle:"Global PK Stats",      gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"analytics",   icon:"📈", label:"PK Analytics",           subtitle:"Advanced Analytics",   gradient:"linear-gradient(145deg,#EF4444,#FFC83D)", glow:"rgba(239,68,68,0.35)" },
  { id:"comms",       icon:"📨", label:"PK Communication",       subtitle:"Participant Messaging", gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"reports",     icon:"📋", label:"Report Management",      subtitle:"Generate Reports",     gradient:"linear-gradient(145deg,#374151,#1F6BFF)", glow:"rgba(55,65,81,0.4)" },
  { id:"team",        icon:"👥", label:"PK Operations Team",     subtitle:"Staff Management",     gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"settings",    icon:"⚙️", label:"PK Settings",            subtitle:"System Config",        gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",   icon:"🚀", label:"PKM Exclusive Tools",    subtitle:"Executive Powers",     gradient:"linear-gradient(145deg,#EF4444,#FFC83D)", glow:"rgba(239,68,68,0.6)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function PKManagerDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(239,68,68,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(239,68,68,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#EF4444"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>⚔️ PK Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#EF4444" }}>Battles · Tournaments · Rankings · Fair Play · Analytics</div>
          </div>
          <div style={S.redBadge}><span style={{ fontSize:10,fontWeight:800,color:"#EF4444" }}>⚔️ PKM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(239,68,68,0.18),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#EF4444,#FFC83D,#A78BFA)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#EF4444",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · PK BATTLE & COMPETITION DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>PK Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central PK hub — battle management, tournaments, rankings, AI fair play, dispute resolution, revenue analytics, and global operations.</div>
        </div>

        <KGrid items={[
          { l:"Total PK Battles",     v:"48.4K", color:"#EF4444",icon:"⚔️" },
          { l:"Active Battles",       v:"284",   color:"#EF4444",icon:"🔴" },
          { l:"Completed Today",      v:"1.2K",  color:"#10B981",icon:"✅" },
          { l:"Daily PK Revenue",     v:"$8.4K", color:"#FFC83D",icon:"💰" },
          { l:"Monthly PK Revenue",   v:"$84K",  color:"#FFC83D",icon:"📅" },
          { l:"PK Participants",      v:"12.4K", color:"#60A5FA",icon:"👥" },
          { l:"Active PK Rooms",      v:"284",   color:"#EF4444",icon:"🏟️" },
          { l:"Tournament Players",   v:"1.2K",  color:"#A78BFA",icon:"🏆" },
          { l:"PK Rewards Issued",    v:"48K",   color:"#10B981",icon:"🎁" },
          { l:"PK Reports",           v:"12",    color:"#EF4444",icon:"🚨" },
          { l:"Fair Play Score",      v:"96%",   color:"#10B981",icon:"🛡️" },
          { l:"Global PK Growth",     v:"+28%",  color:"#60A5FA",icon:"🚀" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#EF4444",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} PK MODULES · TAP TO ACCESS
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {MODULES.map((mod,i) => (
            <motion.div key={mod.id}
              initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.025,duration:0.2 }}
              whileTap={{ scale:0.91 }} onClick={() => setActiveModule(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{
                borderRadius:18,overflow:"hidden",
                background:mod.featured?"rgba(239,68,68,0.08)":"rgba(255,255,255,0.04)",
                border:mod.featured?"1.5px solid rgba(239,68,68,0.4)":"1.5px solid rgba(239,68,68,0.12)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:mod.featured?"linear-gradient(90deg,#EF4444,#FFC83D,#EF4444)":`linear-gradient(90deg,rgba(239,68,68,0.5),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#EF4444"},rgba(239,68,68,0.5))` }}/>
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#EF4444",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
                {mod.featured && <div style={{ position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#EF4444",boxShadow:"0 0 8px rgba(239,68,68,0.9)"}}/>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}