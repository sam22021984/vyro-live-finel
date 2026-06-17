/**
 * RewardManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Reward Manager
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
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,200,61,0.15)", borderRadius:18, ...x }),
  goldBadge: { padding:"4px 10px", borderRadius:20, background:"rgba(255,200,61,0.12)", border:"1px solid rgba(255,200,61,0.3)" },
  sec: { fontSize:10, fontWeight:800, color:"#FFC83D", letterSpacing:"0.08em", marginBottom:10 },
  kpi: (c) => ({ background:`linear-gradient(145deg,${c}18,${c}08)`, border:`1px solid ${c}30`, borderRadius:14, padding:"12px 8px", textAlign:"center" }),
  btn: (g, glow) => ({ padding:"8px 11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, color:"#fff", background:g, boxShadow:`0 4px 12px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GRADS = ["linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#A78BFA,#7C3AED)","linear-gradient(135deg,#EC4899,#BE185D)","linear-gradient(135deg,#0EA5E9,#0369A1)"];
const GLOWS  = ["rgba(255,200,61,0.4)","rgba(16,185,129,0.3)","rgba(31,107,255,0.3)","rgba(167,139,250,0.3)","rgba(236,72,153,0.3)","rgba(14,165,233,0.3)"];

const distData   = [{d:"Mon",v:1200},{d:"Tue",v:1840},{d:"Wed",v:1420},{d:"Thu",v:2180},{d:"Fri",v:2640},{d:"Sat",v:1980},{d:"Sun",v:1560}];
const growthData = [{d:"Jan",v:4.2},{d:"Feb",v:5.8},{d:"Mar",v:7.1},{d:"Apr",v:8.4},{d:"May",v:10.2},{d:"Jun",v:12.8}];
const engageData = [{d:"Mon",v:72},{d:"Tue",v:78},{d:"Wed",v:74},{d:"Thu",v:84},{d:"Fri",v:91},{d:"Sat",v:86},{d:"Sun",v:80}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Shell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,200,61,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,200,61,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#FFC83D"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>{subtitle}</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🎁 RM</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#FFC83D" }) => (
        <div key={l} style={S.kpi(color)}>
          {icon && <div style={{ fontSize:15,marginBottom:2 }}>{icon}</div>}
          <div style={{ fontSize:13,fontWeight:900,color }}>{v}</div>
          <div style={{ fontSize:8,color:"rgba(255,255,255,0.45)",marginTop:2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function ARow({ title, actions }) {
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
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#FFC83D" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#FFC83D" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gid})`} strokeWidth={2} dot={{ fill:"#FFC83D",r:2 }}/>
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

function RewardCard({ reward, actions, statusColors }) {
  return (
    <div style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${reward.color}` }}>
      <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:`${reward.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{reward.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{reward.name}</div>
          <div style={{ fontSize:9,color:"#FFC83D",marginTop:1 }}>{reward.value} · {reward.recipients} recipients</div>
          {reward.expiry && <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Expires: {reward.expiry}</div>}
        </div>
        <SBadge status={reward.status} colors={statusColors}/>
      </div>
      <ARow title="" actions={actions}/>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function RewardOverviewCenter({ onBack }) {
  return (
    <Shell title="🎁 Reward Overview Center" subtitle="Complete Reward System Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Total Distributed",v:"284K",  color:"#FFC83D",icon:"🎁" },
        { l:"Active Campaigns", v:"18",    color:"#10B981",icon:"🟢" },
        { l:"Pending Claims",   v:"142",   color:"#F59E0B",icon:"⏳" },
        { l:"Approved",         v:"12.4K", color:"#10B981",icon:"✅" },
        { l:"Budget Utilized",  v:"68%",   color:"#A78BFA",icon:"💰" },
        { l:"Engagement Rate",  v:"84%",   color:"#60A5FA",icon:"📊" },
      ]}/>
      <Chart label="🎁 DAILY REWARD DISTRIBUTIONS" data={distData} color="#FFC83D" gid="ro1" type="bar"/>
      <Chart label="📈 CUMULATIVE REWARDS (K)" data={growthData} color="#10B981" gid="ro2"/>
      <Chart label="💫 ENGAGEMENT SCORE" data={engageData} color="#A78BFA" gid="ro3"/>
      <ARow title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data","Monitor Distribution"]}/>
    </Shell>
  );
}

function RewardManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const rewards = [
    { name:"Daily Login Bonus",      icon:"📅",value:"50 coins",  recipients:"48K", status:"Active",  expiry:"Ongoing",  color:"#10B981" },
    { name:"Weekly Streak Reward",   icon:"🔥",value:"200 coins", recipients:"12K", status:"Active",  expiry:"Ongoing",  color:"#F97316" },
    { name:"First Gift Bonus",       icon:"🎁",value:"100 coins", recipients:"8.4K",status:"Active",  expiry:"Ongoing",  color:"#FFC83D" },
    { name:"Referral Bonus",         icon:"🤝",value:"500 coins", recipients:"2.8K",status:"Active",  expiry:"Ongoing",  color:"#1F6BFF" },
    { name:"Summer Special Reward",  icon:"☀️",value:"1,000 coins",recipients:"4.2K",status:"Paused", expiry:"Jun 30",   color:"#EC4899" },
    { name:"VIP Trial Incentive",    icon:"💎",value:"250 coins", recipients:"842", status:"Inactive",expiry:"Jul 15",   color:"#A78BFA" },
  ];
  const sc = { Active:"#10B981",Paused:"#F59E0B",Inactive:"#9CA3AF",Expired:"#EF4444" };
  const filters = ["All","Active","Paused","Inactive"];
  const visible = filter==="All" ? rewards : rewards.filter(r => r.status===filter);
  return (
    <Shell title="🏆 Reward Management Center" subtitle="All Reward Programs" onBack={onBack}>
      <KGrid items={[
        { l:"Active Rewards", v:"14",   color:"#10B981",icon:"🟢" },
        { l:"Paused",         v:"3",    color:"#F59E0B",icon:"⏸" },
        { l:"Total Issued",   v:"284K", color:"#FFC83D",icon:"📤" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:filter===f?"#0D1B3E":"#FFC83D" }}>
            {f}
          </motion.button>
        ))}
      </div>
      <ARow title="⚡ CREATE" actions={["Create Reward"]}/>
      {visible.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}>
          <RewardCard reward={r} statusColors={sc} actions={["Edit Reward","Activate Reward","Deactivate Reward","Delete Reward","View Reward History"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AchievementRewardsCenter({ onBack }) {
  const achievements = [
    { name:"First Live Stream",     icon:"🎙️",req:"Complete first stream",     reward:"500 coins", unlocked:"48K",color:"#A78BFA" },
    { name:"Gift Master",           icon:"🎁",req:"Send 100 gifts",             reward:"1K coins",  unlocked:"8.4K",color:"#EC4899" },
    { name:"Social Butterfly",      icon:"🦋",req:"Follow 50 users",            reward:"200 coins", unlocked:"28K",color:"#60A5FA" },
    { name:"Diamond Gifter",        icon:"💎",req:"Spend 1M coins on gifts",    reward:"5K coins",  unlocked:"842", color:"#FFC83D" },
    { name:"Loyal Member",          icon:"🏅",req:"30 consecutive login days",  reward:"800 coins", unlocked:"12K",color:"#10B981" },
    { name:"Top Fan",               icon:"⭐",req:"Attend 20 live streams",     reward:"1.5K coins",unlocked:"6.2K",color:"#F97316" },
  ];
  return (
    <Shell title="🎯 Achievement Rewards Center" subtitle="Milestone & Achievement System" onBack={onBack}>
      <KGrid items={[
        { l:"Total Achievements",v:"48",    color:"#FFC83D",icon:"🎯" },
        { l:"Unlocked Today",    v:"1.2K",  color:"#10B981",icon:"🔓" },
        { l:"Total Unlocks",     v:"284K",  color:"#A78BFA",icon:"🏅" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Achievement"]}/>
      {achievements.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${a.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D",marginTop:1 }}>Req: {a.req}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Reward: <span style={{ color:a.color,fontWeight:800 }}>{a.reward}</span> · Unlocked by {a.unlocked}</div>
            </div>
          </div>
          <ARow title="" actions={["Set Requirements","Assign Rewards","Track Progress","Generate Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventRewardsCenter({ onBack }) {
  const events = [
    { name:"Summer Streaming Fest",  icon:"🎉",prize:"50K coins pool", winners:"Top 10",  status:"Active",  date:"Jun 20-30" },
    { name:"Host Battle Championship",icon:"⚔️",prize:"100K coins",   winners:"Top 3",   status:"Upcoming",date:"Jun 28" },
    { name:"VIP Gifter Award Night",  icon:"🏆",prize:"30K coins",    winners:"Top 5",   status:"Planning",date:"Jul 1" },
    { name:"Ramadan Special 2027",    icon:"🌙",prize:"500K coins",   winners:"Top 20",  status:"Planning",date:"Feb 2027" },
  ];
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Planning:"#A78BFA",Completed:"#60A5FA" };
  return (
    <Shell title="🎉 Event Rewards Center" subtitle="Platform Event & Competition Rewards" onBack={onBack}>
      <KGrid items={[
        { l:"Active Events",  v:"2",      color:"#10B981",icon:"🎉" },
        { l:"Prize Pool",     v:"180K",   color:"#FFC83D",icon:"🏆" },
        { l:"Participants",   v:"8.4K",   color:"#60A5FA",icon:"👥" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Event Reward"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>Prize: {e.prize} · Winners: {e.winners}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{e.date}</div>
            </div>
            <SBadge status={e.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Assign Winners","Approve Distribution","Launch Campaign","Monitor Participation"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPRewardsCenter({ onBack }) {
  const rewards = [
    { name:"VIP 5 Monthly Gift Box", icon:"💎",value:"10K coins",  tier:"VIP 5",  recipients:"142",status:"Active", color:"#FFC83D" },
    { name:"VIP 4 Weekly Pack",      icon:"👑",value:"2K coins",   tier:"VIP 4+", recipients:"410",status:"Active", color:"#A78BFA" },
    { name:"VIP Birthday Bonus",     icon:"🎂",value:"500 coins",  tier:"All VIP",recipients:"284",status:"Active", color:"#EC4899" },
    { name:"VIP Anniversary Reward", icon:"🥂",value:"1K coins",   tier:"VIP 2+", recipients:"2.1K",status:"Upcoming",color:"#10B981" },
  ];
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Expired:"#9CA3AF" };
  return (
    <Shell title="💎 VIP Rewards Center" subtitle="Exclusive VIP Reward Programs" onBack={onBack}>
      <KGrid items={[
        { l:"VIP Rewards Active",v:"8",    color:"#FFC83D",icon:"💎" },
        { l:"Distributed",       v:"48K",  color:"#10B981",icon:"📤" },
        { l:"Total Value",       v:"$84K", color:"#A78BFA",icon:"💰" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create VIP Reward"]}/>
      {rewards.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <RewardCard reward={r} statusColors={sc} actions={["Assign VIP Rewards","Monitor Usage","Analyze Performance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgentRewardsCenter({ onBack }) {
  const agents = [
    { name:"Ali Hassan",  id:"AGT-001",hosts:"12",revenue:"$8.4K",bonus:"$840",status:"Approved",icon:"🤝" },
    { name:"Sara Al-Q",   id:"AGT-002",hosts:"8", revenue:"$5.2K",bonus:"$520",status:"Pending", icon:"🤝" },
    { name:"Mohamed Taha",id:"AGT-003",hosts:"18",revenue:"$12.1K",bonus:"$1,210",status:"Approved",icon:"🤝" },
  ];
  const sc = { Approved:"#10B981",Pending:"#FFC83D",Rejected:"#EF4444" };
  return (
    <Shell title="🤝 Agent Rewards Center" subtitle="Talent Agent Incentives" onBack={onBack}>
      <KGrid items={[
        { l:"Agent Rewards",  v:"42",    color:"#60A5FA",icon:"🤝" },
        { l:"Distributed",    v:"$8.4K", color:"#FFC83D",icon:"💰" },
        { l:"Pending",        v:"6",     color:"#F59E0B",icon:"⏳" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Incentive Plan"]}/>
      {agents.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{a.id} · {a.hosts} hosts · Revenue: {a.revenue}</div>
              <div style={{ fontSize:9,color:"#10B981",fontWeight:800,marginTop:1 }}>Bonus: {a.bonus}</div>
            </div>
            <SBadge status={a.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Assign Rewards","Review Performance","Approve Incentives"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgencyRewardsCenter({ onBack }) {
  const agencies = [
    { name:"StarPro QA",  id:"AGC-001",hosts:"42",revenue:"$12.4K",bonus:"$1,240",tier:"Gold",   status:"Approved",icon:"🏢" },
    { name:"EliteMedia",  id:"AGC-002",hosts:"28",revenue:"$8.1K", bonus:"$810",  tier:"Silver", status:"Approved",icon:"🏢" },
    { name:"VoiceHouse",  id:"AGC-003",hosts:"21",revenue:"$4.8K", bonus:"$480",  tier:"Bronze", status:"Pending", icon:"🏢" },
  ];
  const sc = { Approved:"#10B981",Pending:"#FFC83D",Rejected:"#EF4444" };
  const tc = { Gold:"#FFC83D",Silver:"#C0C0C0",Bronze:"#CD7F32" };
  return (
    <Shell title="🏢 Agency Rewards Center" subtitle="Agency Performance Rewards" onBack={onBack}>
      <KGrid items={[
        { l:"Agency Rewards",  v:"18",    color:"#FFC83D",icon:"🏢" },
        { l:"Distributed",     v:"$12.4K",color:"#10B981",icon:"💰" },
        { l:"Pending",         v:"3",     color:"#F59E0B",icon:"⏳" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Agency Reward"]}/>
      {agencies.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{a.id} · {a.hosts} hosts · Revenue: {a.revenue}</div>
              <div style={{ fontSize:9,color:tc[a.tier],fontWeight:800,marginTop:1 }}>{a.tier} Tier · Bonus: {a.bonus}</div>
            </div>
            <SBadge status={a.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Assign Rewards","Review Performance","Generate Reports"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function HostRewardsCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const hosts = [
    { name:"@SaraLive",  id:"HST-4821",streamHours:"142h",gifts:"8.4K",reward:"2,000 coins",eligible:true, icon:"🎙️" },
    { name:"@MoonVoice", id:"HST-3841",streamHours:"98h", gifts:"4.2K",reward:"1,000 coins",eligible:true, icon:"🎙️" },
    { name:"@StarQA",    id:"HST-2918",streamHours:"64h", gifts:"2.8K",reward:"500 coins",  eligible:true, icon:"🎙️" },
    { name:"@NoorQA",    id:"HST-1924",streamHours:"28h", gifts:"840", reward:"N/A",         eligible:false,icon:"🎙️" },
  ];
  const filtered = hosts.filter(h => h.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="🎙️ Host Rewards Center" subtitle="Host Performance Rewards" onBack={onBack}>
      <KGrid items={[
        { l:"Eligible Hosts", v:"184",  color:"#A78BFA",icon:"🎙️" },
        { l:"Rewards Issued", v:"$48K", color:"#FFC83D",icon:"💰" },
        { l:"Pending Review", v:"12",   color:"#F59E0B",icon:"⏳" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#FFC83D"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search hosts…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {filtered.map((h,i) => (
        <motion.div key={h.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${h.eligible?"#10B981":"#9CA3AF"}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{h.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{h.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{h.id} · {h.streamHours} · {h.gifts} gifts</div>
              <div style={{ fontSize:9,color:h.eligible?"#10B981":"#9CA3AF",fontWeight:800,marginTop:1 }}>
                {h.eligible ? `Reward: ${h.reward}` : "Not Eligible"}
              </div>
            </div>
            <div style={{ padding:"2px 8px",borderRadius:8,background:h.eligible?"rgba(16,185,129,0.15)":"rgba(156,163,175,0.15)",border:`1px solid ${h.eligible?"rgba(16,185,129,0.3)":"rgba(156,163,175,0.3)"}` }}>
              <span style={{ fontSize:9,fontWeight:800,color:h.eligible?"#10B981":"#9CA3AF" }}>{h.eligible?"Eligible":"Ineligible"}</span>
            </div>
          </div>
          <ARow title="" actions={["Assign Reward","Monitor Performance","Review Eligibility"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function UserRewardsCenter({ onBack }) {
  const programs = [
    { name:"Daily Login Streak",    icon:"🔥",participants:"48K",issued:"2.4M coins",engagement:"92%",color:"#F97316" },
    { name:"Referral Reward",       icon:"🤝",participants:"8.4K",issued:"4.2M coins",engagement:"88%",color:"#1F6BFF" },
    { name:"First Purchase Bonus",  icon:"🛍️",participants:"12K",issued:"1.2M coins",engagement:"84%",color:"#10B981" },
    { name:"Community Engagement",  icon:"💬",participants:"28K",issued:"2.8M coins",engagement:"76%",color:"#A78BFA" },
  ];
  return (
    <Shell title="👤 User Rewards Center" subtitle="User Engagement & Loyalty Rewards" onBack={onBack}>
      <KGrid items={[
        { l:"User Rewards",  v:"24",    color:"#60A5FA",icon:"👤" },
        { l:"Participants",  v:"96K",   color:"#FFC83D",icon:"👥" },
        { l:"Coins Issued",  v:"10.6M", color:"#10B981",icon:"🪙" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create User Reward"]}/>
      {programs.map((p,i) => (
        <motion.div key={p.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${p.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:8 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${p.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{p.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{p.participants} participants · {p.issued}</div>
            </div>
            <div style={{ fontSize:11,fontWeight:900,color:p.color }}>{p.engagement}</div>
          </div>
          <ARow title="" actions={["Track Participation","Approve Rewards","Analyze Engagement"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function LoyaltyProgramCenter({ onBack }) {
  const programs = [
    { name:"VYRO Points Program",   icon:"🎖️",members:"48K", pointsIssued:"4.8M",tier:"All Users",  status:"Active",  color:"#FFC83D" },
    { name:"Host Loyalty Tier",     icon:"🏅",members:"1.2K",pointsIssued:"840K",tier:"Hosts",      status:"Active",  color:"#A78BFA" },
    { name:"Gifter Loyalty Club",   icon:"💝",members:"8.4K",pointsIssued:"2.1M",tier:"Gifters",    status:"Active",  color:"#EC4899" },
    { name:"VIP Elite Program",     icon:"💎",members:"284", pointsIssued:"1.4M",tier:"VIP Members",status:"Active",  color:"#60A5FA" },
  ];
  const sc = { Active:"#10B981",Paused:"#F59E0B",Inactive:"#9CA3AF" };
  return (
    <Shell title="🎖️ Loyalty Program Center" subtitle="Loyalty Programs & Retention Rewards" onBack={onBack}>
      <KGrid items={[
        { l:"Active Programs", v:"4",    color:"#FFC83D",icon:"🎖️" },
        { l:"Total Members",   v:"57.9K",color:"#10B981",icon:"👥" },
        { l:"Points Issued",   v:"9.1M", color:"#A78BFA",icon:"⭐" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Loyalty Program"]}/>
      {programs.map((p,i) => (
        <motion.div key={p.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <RewardCard reward={{ ...p, value:p.pointsIssued+" pts", recipients:p.members }} statusColors={sc}
            actions={["Define Reward Rules","Track Loyalty Points","Reward Distribution"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function BonusManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const bonuses = [
    { id:"BON-4821",name:"Weekend Performance Bonus",recipient:"@SaraLive",  amount:"2,000 coins",type:"Host",   status:"Pending",  date:"Jun 16" },
    { id:"BON-4798",name:"Monthly Top Gifter Bonus",  recipient:"@DiamondQA",amount:"5,000 coins",type:"User",   status:"Pending",  date:"Jun 15" },
    { id:"BON-4762",name:"Agency Monthly Achievement",recipient:"StarPro QA",amount:"$1,200",     type:"Agency", status:"Approved", date:"Jun 14" },
    { id:"BON-4741",name:"Agent Recruitment Bonus",   recipient:"Ali Hassan", amount:"$480",       type:"Agent",  status:"Approved", date:"Jun 12" },
    { id:"BON-4712",name:"Event Winner Prize",        recipient:"@MoonVoice",amount:"10,000 coins",type:"Event",  status:"Distributed",date:"Jun 10" },
  ];
  const sc = { Pending:"#F59E0B",Approved:"#10B981",Distributed:"#60A5FA",Rejected:"#EF4444" };
  const tc = { Host:"#A78BFA",User:"#60A5FA",Agency:"#FFC83D",Agent:"#10B981",Event:"#EC4899" };
  const filters = ["All","Pending","Approved","Distributed"];
  const visible = filter==="All" ? bonuses : bonuses.filter(b => b.status===filter);
  return (
    <Shell title="💰 Bonus Management Center" subtitle="Bonus Rewards & Incentive Payouts" onBack={onBack}>
      <KGrid items={[
        { l:"Pending Bonuses",v:"28",    color:"#F59E0B",icon:"⏳" },
        { l:"Approved",       v:"142",   color:"#10B981",icon:"✅" },
        { l:"Total Value",    v:"$48K",  color:"#FFC83D",icon:"💰" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:filter===f?"#0D1B3E":"#FFC83D" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((b,i) => (
        <motion.div key={b.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{b.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{b.id} · {b.recipient} · <span style={{ color:"#FFC83D",fontWeight:900 }}>{b.amount}</span></div>
              <div style={{ display:"flex",gap:6,marginTop:4 }}>
                <span style={{ fontSize:9,padding:"2px 7px",borderRadius:7,background:`${tc[b.type]}18`,color:tc[b.type],fontWeight:700 }}>{b.type}</span>
                <span style={{ fontSize:9,color:"#9CA3AF" }}>{b.date}</span>
              </div>
            </div>
            <SBadge status={b.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Approve Bonus","Distribute Bonus","Audit Bonus History"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CoinRewardCenter({ onBack }) {
  const distributions = [
    { trigger:"Daily Login",    coins:"50",   daily:"48K users",  total:"2.4M/day",color:"#10B981" },
    { trigger:"First Stream",   coins:"500",  daily:"284 users",  total:"142K/day",color:"#A78BFA" },
    { trigger:"Gift Sent",      coins:"10",   daily:"8.4K users", total:"84K/day", color:"#EC4899" },
    { trigger:"Referral",       coins:"500",  daily:"128 users",  total:"64K/day", color:"#1F6BFF" },
    { trigger:"Task Completion",coins:"100",  daily:"2.4K users", total:"240K/day",color:"#FFC83D" },
  ];
  return (
    <Shell title="🪙 Coin Reward Center" subtitle="Coin-Based Reward Distribution" onBack={onBack}>
      <KGrid items={[
        { l:"Coins Issued Today",v:"2.9M",  color:"#FFC83D",icon:"🪙" },
        { l:"Active Triggers",   v:"14",    color:"#10B981",icon:"⚡" },
        { l:"Recipients Today",  v:"59.2K", color:"#60A5FA",icon:"👥" },
      ]}/>
      <Chart label="🪙 COIN DISTRIBUTION THIS WEEK" data={distData} color="#FFC83D" gid="crc1" type="bar"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>⚡ ACTIVE COIN TRIGGERS</div>
        {distributions.map((d,i) => (
          <div key={d.trigger} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<distributions.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <div style={{ width:7,height:7,borderRadius:"50%",background:d.color,flexShrink:0 }}/>
              <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{d.trigger}</span>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11,fontWeight:900,color:d.color }}>{d.coins} coins</div>
              <div style={{ fontSize:9,color:"#9CA3AF" }}>{d.total}</div>
            </div>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Create Coin Reward","Assign Coins","Monitor Distribution","Export Report"]}/>
    </Shell>
  );
}

function CountryRewardCenter({ onBack }) {
  const countries = [
    { name:"Saudi Arabia",flag:"🇸🇦",rewards:"84K",value:"$42K",engagement:"88%",growth:"+24%",pct:32,color:"#10B981" },
    { name:"Qatar",       flag:"🇶🇦",rewards:"42K",value:"$21K",engagement:"91%",growth:"+34%",pct:16,color:"#FFC83D" },
    { name:"UAE",         flag:"🇦🇪",rewards:"38K",value:"$19K",engagement:"86%",growth:"+22%",pct:14,color:"#A78BFA" },
    { name:"Kuwait",      flag:"🇰🇼",rewards:"24K",value:"$12K",engagement:"84%",growth:"+18%",pct:9, color:"#60A5FA" },
    { name:"Egypt",       flag:"🇪🇬",rewards:"18K",value:"$9K", engagement:"82%",growth:"+42%",pct:7, color:"#EC4899" },
  ];
  return (
    <Shell title="🌍 Country Reward Performance" subtitle="Country-Wise Reward Analytics" onBack={onBack}>
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
              <div style={{ fontSize:9,color:"#FFC83D" }}>{c.rewards} rewards · Engagement: {c.engagement}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{c.value}</div>
              <div style={{ fontSize:10,fontWeight:800,color:"#10B981" }}>{c.growth}</div>
            </div>
          </div>
          <PBar label="" value={c.pct} color={c.color}/>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["View Country Statistics","Compare Countries","Export Reports","Analyze Effectiveness"]}/>
    </Shell>
  );
}

function TopRewardEarnersCenter({ onBack }) {
  const [tab, setTab] = useState("Users");
  const data = {
    Users:[
      { rank:1,name:"@DiamondQA",  earned:"48.4K coins",icon:"👤",color:"#FFC83D" },
      { rank:2,name:"@GoldRose",   earned:"32.1K coins",icon:"👤",color:"#C0C0C0" },
      { rank:3,name:"@StarVIP",    earned:"28.4K coins",icon:"👤",color:"#CD7F32" },
    ],
    Hosts:[
      { rank:1,name:"@SaraLive",  earned:"12.4K coins",icon:"🎙️",color:"#FFC83D" },
      { rank:2,name:"@MoonVoice", earned:"8.8K coins", icon:"🎙️",color:"#C0C0C0" },
      { rank:3,name:"@StarQA",    earned:"6.2K coins", icon:"🎙️",color:"#CD7F32" },
    ],
    Agents:[
      { rank:1,name:"Mohamed Taha",earned:"$1,210 bonus",icon:"🤝",color:"#FFC83D" },
      { rank:2,name:"Ali Hassan",  earned:"$840 bonus",  icon:"🤝",color:"#C0C0C0" },
      { rank:3,name:"Sara Al-Q",   earned:"$520 bonus",  icon:"🤝",color:"#CD7F32" },
    ],
  };
  return (
    <Shell title="🏅 Top Reward Earners" subtitle="Elite Reward Leaderboards" onBack={onBack}>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {["Users","Hosts","Agents"].map(t => (
          <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTab(t)}
            style={{ flex:1,padding:"8px",borderRadius:12,fontSize:10,fontWeight:800,border:"none",cursor:"pointer",
              background:tab===t?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:tab===t?"#0D1B3E":"#FFC83D" }}>
            {t}
          </motion.button>
        ))}
      </div>
      {data[tab].map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:`${e.color}22`,border:`2px solid ${e.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:e.color,flexShrink:0 }}>
            {e.rank}
          </div>
          <span style={{ fontSize:22,flexShrink:0 }}>{e.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
            <div style={{ fontSize:9,color:"#FFC83D",marginTop:1 }}>{e.earned}</div>
          </div>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["View Rankings","Export Rankings","Analyze Performance"]}/>
    </Shell>
  );
}

function AIRewardIntelligenceCenter({ onBack }) {
  const insights = [
    "Daily login rewards driving 92% engagement — highest performing reward trigger",
    "Referral program showing 8.4x ROI — recommend 40% budget increase",
    "Host rewards under 500 coins showing 3x higher completion rate vs higher-value rewards",
    "Friday evening reward campaigns generate 2.8x more participation",
    "Saudi Arabia has highest reward redemption rate at 91% — model for other regions",
    "Loyalty program members show 3.4x lower churn rate vs non-members",
  ];
  return (
    <Shell title="🧠 AI Reward Intelligence" subtitle="AI-Powered Reward Optimization" onBack={onBack}>
      <KGrid items={[
        { l:"AI Accuracy",     v:"96%",   color:"#10B981",icon:"🧠" },
        { l:"ROI Forecast",    v:"8.4x",  color:"#FFC83D",icon:"📈" },
        { l:"Optimization Ops",v:"12",    color:"#A78BFA",icon:"⚡" },
      ]}/>
      <Chart label="📈 REWARD GROWTH FORECAST" data={[...growthData,{d:"Jul",v:15.4},{d:"Aug",v:18.2}]} color="#10B981" gid="ai1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 AI REWARD INSIGHTS</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"8px 0",borderBottom:i<insights.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#FFC83D",fontWeight:800,fontSize:11,flexShrink:0 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{ins}</span>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Generate Insights","Analyze Trends","Forecast Results","Optimize Rewards"]}/>
    </Shell>
  );
}

function RewardAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📊 Reward Analytics Center" subtitle="Advanced Reward Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Reward ROI",      v:"8.4x",  color:"#FFC83D",icon:"📈" },
        { l:"Redemption Rate", v:"84%",   color:"#10B981",icon:"🔄" },
        { l:"Engagement Lift", v:"+42%",  color:"#A78BFA",icon:"🚀" },
      ]}/>
      <Chart label="🎁 DAILY DISTRIBUTIONS" data={distData} color="#FFC83D" gid="rac1" type="bar"/>
      <Chart label="📈 CUMULATIVE REWARDS (K)" data={growthData} color="#10B981" gid="rac2"/>
      <Chart label="💫 ENGAGEMENT SCORE" data={engageData} color="#A78BFA" gid="rac3"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 PERFORMANCE vs TARGETS</div>
        <PBar label="Distribution Target"   value={88} color="#FFC83D"/>
        <PBar label="Engagement Target"     value={84} color="#10B981"/>
        <PBar label="Redemption Target"     value={84} color="#A78BFA"/>
        <PBar label="Budget Utilization"    value={68} color="#60A5FA"/>
      </div>
      <ARow title="⚡" actions={["View Analytics","Compare Metrics","Export Analytics","Generate Insights"]}/>
    </Shell>
  );
}

function RewardReportCenter({ onBack }) {
  const reports = [
    { name:"Daily Reward Report",        date:"Jun 17",size:"420 KB",status:"Ready" },
    { name:"Weekly Reward Report",       date:"Jun 15",size:"1.1 MB",status:"Ready" },
    { name:"Reward Distribution Report", date:"Jun 14",size:"840 KB",status:"Ready" },
    { name:"Achievement Report",         date:"Jun 10",size:"620 KB",status:"Ready" },
    { name:"VIP Reward Report",          date:"Jun 7", size:"480 KB",status:"Archived" },
    { name:"Reward ROI Report",          date:"Jun 1", size:"980 KB",status:"Archived" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📋 Reward Report Management" subtitle="Generate & Manage Reward Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports",v:"48",  color:"#60A5FA",icon:"📋" },
        { l:"This Month",   v:"14",  color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",    v:"4",   color:"#10B981",icon:"⏰" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Generate Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📋</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{r.name}</div>
            <div style={{ fontSize:9,color:"#FFC83D",marginTop:2 }}>{r.date} · {r.size}</div>
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

function RewardTeamCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior Reward Specialist",  tasks:8, score:94,status:"Online" },
    { name:"Khalid Omar",     role:"Achievement Coordinator",   tasks:12,score:89,status:"Online" },
    { name:"Fatima Hassan",   role:"Loyalty Program Manager",   tasks:6, score:96,status:"Busy" },
    { name:"Ahmad Nasser",    role:"Reward Analytics Specialist",tasks:5,score:87,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#FFC83D",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 Reward Team Center" subtitle="Reward Operations Staff" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff",  v:"10",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",   v:"7",   color:"#10B981",icon:"🟢" },
        { l:"Avg Score",    v:"92%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Add Staff"]}/>
      {staff.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(255,200,61,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{s.role} · {s.tasks} tasks</div>
            </div>
            <SBadge status={s.status} colors={sc}/>
          </div>
          <PBar label="Performance Score" value={s.score} color="#FFC83D"/>
          <ARow title="" actions={["Assign Tasks","Monitor Performance","Review Productivity"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function RewardSettingsCenter({ onBack }) {
  const settings = [
    { name:"Daily Reward Caps",       icon:"🎁",desc:"Max coins per user per day",            color:"#FFC83D" },
    { name:"Achievement Rules Engine",icon:"🎯",desc:"Achievement trigger and reward logic",   color:"#10B981" },
    { name:"Loyalty Point Config",    icon:"🎖️",desc:"Points earning and redemption rules",    color:"#A78BFA" },
    { name:"Bonus Approval Workflow", icon:"✅",desc:"Multi-level bonus approval pipeline",    color:"#1F6BFF" },
    { name:"Anti-Fraud Rules",        icon:"🛡️",desc:"Reward abuse detection thresholds",      color:"#EF4444" },
    { name:"Reward Expiry Policy",    icon:"⏰",desc:"Unclaimed reward expiry configuration",  color:"#F59E0B" },
  ];
  return (
    <Shell title="⚙️ Reward Settings Center" subtitle="Reward System Configuration" onBack={onBack}>
      {settings.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{s.name}</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>{s.desc}</div>
          </div>
          <span style={{ fontSize:16,color:"#4B5563" }}>›</span>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["Update Settings","Save Configuration","Reset Settings","Manage Reward Policies"]}/>
    </Shell>
  );
}

function RMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Emergency Reward Distribution", icon:"🚨",desc:"Instantly distribute rewards to all eligible users",      color:"#EF4444" },
    { name:"Global Reward Campaign Launch",  icon:"🌍",desc:"Launch a platform-wide reward campaign instantly",        color:"#1F6BFF" },
    { name:"Reward Budget Optimization",     icon:"💰",desc:"AI-powered reward budget reallocation for max ROI",       color:"#FFC83D" },
    { name:"Mass Reward Approval",           icon:"✅",desc:"Bulk approve all pending reward claims at once",          color:"#10B981" },
    { name:"Reward Recovery System",         icon:"🔄",desc:"Recover and reissue expired or failed rewards",          color:"#A78BFA" },
    { name:"Reward Fraud Review",            icon:"🛡️",desc:"Review and audit suspicious reward activity",            color:"#F97316" },
    { name:"Strategic Incentive Planning",   icon:"🧠",desc:"AI-powered quarterly incentive strategy generator",      color:"#60A5FA" },
  ];
  return (
    <Shell title="🚀 RM Exclusive Tools" subtitle="Reward Manager Executive Powers" onBack={onBack}>
      <div style={{ background:"rgba(255,200,61,0.08)",border:"1px solid rgba(255,200,61,0.3)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — REWARD MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools carry the highest reward authority. All activations are logged and require Reward Manager authentication.</div>
      </div>
      {tools.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${t.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.name}</div>
              <div style={{ fontSize:10,color:"#FFC83D" }}>{t.desc}</div>
            </div>
          </div>
          <motion.button whileTap={{ scale:0.94 }}
            style={{ width:"100%",padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:12,
              color:t.color==="#FFC83D"?"#0D1B3E":"#fff",
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
  overview:    RewardOverviewCenter,
  management:  RewardManagementCenter,
  achievements:AchievementRewardsCenter,
  events:      EventRewardsCenter,
  vip:         VIPRewardsCenter,
  agents:      AgentRewardsCenter,
  agencies:    AgencyRewardsCenter,
  hosts:       HostRewardsCenter,
  users:       UserRewardsCenter,
  loyalty:     LoyaltyProgramCenter,
  bonuses:     BonusManagementCenter,
  coins:       CoinRewardCenter,
  countries:   CountryRewardCenter,
  rankings:    TopRewardEarnersCenter,
  ai:          AIRewardIntelligenceCenter,
  analytics:   RewardAnalyticsCenter,
  reports:     RewardReportCenter,
  team:        RewardTeamCenter,
  settings:    RewardSettingsCenter,
  exclusive:   RMExclusiveTools,
};

const MODULES = [
  { id:"overview",     icon:"🎁", label:"Reward Overview",       subtitle:"System Summary",       gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.5)" },
  { id:"management",   icon:"🏆", label:"Reward Management",     subtitle:"All Programs",         gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"achievements", icon:"🎯", label:"Achievement Rewards",   subtitle:"Milestone System",     gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"events",       icon:"🎉", label:"Event Rewards",         subtitle:"Competition Prizes",   gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"vip",          icon:"💎", label:"VIP Rewards",           subtitle:"Premium Incentives",   gradient:"linear-gradient(145deg,#FFC83D,#A78BFA)", glow:"rgba(255,200,61,0.4)" },
  { id:"agents",       icon:"🤝", label:"Agent Rewards",         subtitle:"Agent Incentives",     gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"agencies",     icon:"🏢", label:"Agency Rewards",        subtitle:"Agency Performance",   gradient:"linear-gradient(145deg,#FFC83D,#10B981)", glow:"rgba(255,200,61,0.35)" },
  { id:"hosts",        icon:"🎙️", label:"Host Rewards",          subtitle:"Host Performance",     gradient:"linear-gradient(145deg,#A78BFA,#1F6BFF)", glow:"rgba(167,139,250,0.35)" },
  { id:"users",        icon:"👤", label:"User Rewards",          subtitle:"User Loyalty",         gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.3)" },
  { id:"loyalty",      icon:"🎖️", label:"Loyalty Programs",      subtitle:"Retention Rewards",    gradient:"linear-gradient(145deg,#FFC83D,#F97316)", glow:"rgba(255,200,61,0.4)" },
  { id:"bonuses",      icon:"💰", label:"Bonus Management",      subtitle:"Incentive Payouts",    gradient:"linear-gradient(145deg,#EF4444,#B91C1C)", glow:"rgba(239,68,68,0.35)" },
  { id:"coins",        icon:"🪙", label:"Coin Rewards",          subtitle:"Coin Distribution",    gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.45)" },
  { id:"countries",    icon:"🌍", label:"Country Performance",   subtitle:"Global Analytics",     gradient:"linear-gradient(145deg,#0EA5E9,#1F6BFF)", glow:"rgba(14,165,233,0.35)" },
  { id:"rankings",     icon:"🏅", label:"Top Reward Earners",    subtitle:"Elite Rankings",       gradient:"linear-gradient(145deg,#FFC83D,#EC4899)", glow:"rgba(255,200,61,0.45)" },
  { id:"ai",           icon:"🧠", label:"AI Reward Intelligence",subtitle:"AI Optimization",      gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"analytics",    icon:"📊", label:"Reward Analytics",      subtitle:"Advanced Analytics",   gradient:"linear-gradient(145deg,#A78BFA,#FFC83D)", glow:"rgba(167,139,250,0.35)" },
  { id:"reports",      icon:"📋", label:"Report Management",     subtitle:"Generate Reports",     gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"team",         icon:"👥", label:"Reward Team",           subtitle:"Staff Management",     gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"settings",     icon:"⚙️", label:"Reward Settings",       subtitle:"System Config",        gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",    icon:"🚀", label:"RM Exclusive Tools",    subtitle:"Executive Powers",     gradient:"linear-gradient(145deg,#FFC83D,#EF4444)", glow:"rgba(255,200,61,0.6)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function RewardManagerDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,200,61,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,200,61,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#FFC83D"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🎁 Reward Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>Rewards · Achievements · Loyalty · Bonuses · Analytics</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🎁 RM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,200,61,0.18),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#10B981,#A78BFA)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · REWARDS, INCENTIVES & ACHIEVEMENT DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Reward Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central reward hub — distributions, achievements, event prizes, VIP rewards, loyalty programs, bonuses, and AI-powered optimization.</div>
        </div>

        <KGrid items={[
          { l:"Total Distributed",     v:"284K",  color:"#FFC83D",icon:"🎁" },
          { l:"Active Campaigns",      v:"18",    color:"#10B981",icon:"🟢" },
          { l:"Pending Claims",        v:"142",   color:"#F59E0B",icon:"⏳" },
          { l:"Approved Rewards",      v:"12.4K", color:"#10B981",icon:"✅" },
          { l:"Rejected",              v:"8",     color:"#EF4444",icon:"❌" },
          { l:"Achievement Rewards",   v:"48K",   color:"#A78BFA",icon:"🎯" },
          { l:"Event Rewards",         v:"8.4K",  color:"#EC4899",icon:"🎉" },
          { l:"VIP Rewards",           v:"1.2K",  color:"#FFC83D",icon:"💎" },
          { l:"Loyalty Rewards",       v:"28K",   color:"#60A5FA",icon:"🎖️" },
          { l:"Budget Utilized",       v:"68%",   color:"#A78BFA",icon:"💰" },
          { l:"Top Earners",           v:"142",   color:"#FFC83D",icon:"🏅" },
          { l:"Engagement Rate",       v:"84%",   color:"#10B981",icon:"📊" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} REWARD MODULES · TAP TO ACCESS
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {MODULES.map((mod,i) => (
            <motion.div key={mod.id}
              initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.025,duration:0.2 }}
              whileTap={{ scale:0.91 }} onClick={() => setActiveModule(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{
                borderRadius:18,overflow:"hidden",
                background:mod.featured?"rgba(255,200,61,0.08)":"rgba(255,255,255,0.04)",
                border:mod.featured?"1.5px solid rgba(255,200,61,0.4)":"1.5px solid rgba(255,200,61,0.12)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:mod.featured?"linear-gradient(90deg,#FFC83D,#10B981,#FFC83D)":`linear-gradient(90deg,rgba(255,200,61,0.5),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#FFC83D"},rgba(255,200,61,0.5))` }}/>
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#FFC83D",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
                {mod.featured && <div style={{ position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#FFC83D",boxShadow:"0 0 8px rgba(255,200,61,0.9)"}}/>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}