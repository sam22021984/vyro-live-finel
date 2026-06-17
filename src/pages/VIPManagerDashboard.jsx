/**
 * VIPManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > VIP Manager
 * Theme: Enterprise Dark Blue, Gold & Diamond · Glassmorphism
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

const GRADS = ["linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#A78BFA,#7C3AED)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#EC4899,#BE185D)","linear-gradient(135deg,#60A5FA,#0EA5E9)"];
const GLOWS  = ["rgba(255,200,61,0.4)","rgba(167,139,250,0.3)","rgba(16,185,129,0.3)","rgba(31,107,255,0.3)","rgba(236,72,153,0.3)","rgba(96,165,250,0.3)"];

const vipGrowth  = [{d:"Jan",v:1.2},{d:"Feb",v:1.6},{d:"Mar",v:2.1},{d:"Apr",v:2.8},{d:"May",v:3.4},{d:"Jun",v:4.2}];
const revenueData= [{d:"Mon",v:4800},{d:"Tue",v:6200},{d:"Wed",v:5400},{d:"Thu",v:7800},{d:"Fri",v:9200},{d:"Sat",v:8100},{d:"Sun",v:6400}];
const retentionD = [{d:"Jan",v:88},{d:"Feb",v:90},{d:"Mar",v:87},{d:"Apr",v:92},{d:"May",v:94},{d:"Jun",v:96}];

const TIER_CONFIG = {
  "VIP 1":{ color:"#9CA3AF", glow:"rgba(156,163,175,0.3)", badge:"⚪" },
  "VIP 2":{ color:"#60A5FA", glow:"rgba(96,165,250,0.3)",  badge:"🔵" },
  "VIP 3":{ color:"#10B981", glow:"rgba(16,185,129,0.3)",  badge:"💚" },
  "VIP 4":{ color:"#A78BFA", glow:"rgba(167,139,250,0.3)", badge:"💜" },
  "VIP 5":{ color:"#FFC83D", glow:"rgba(255,200,61,0.5)",  badge:"👑" },
};

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
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>👑 VM</span></div>
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

function TierBadge({ tier }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG["VIP 1"];
  return (
    <div style={{ padding:"3px 9px",borderRadius:10,background:`${cfg.color}18`,border:`1.5px solid ${cfg.color}40`,flexShrink:0 }}>
      <span style={{ fontSize:10,fontWeight:900,color:cfg.color }}>{cfg.badge} {tier}</span>
    </div>
  );
}

function VIPMemberCard({ member, actions }) {
  const cfg = TIER_CONFIG[member.tier] || TIER_CONFIG["VIP 1"];
  return (
    <div style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${cfg.color}`,boxShadow:`0 4px 16px ${cfg.glow}` }}>
      <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
        <div style={{ width:46,height:46,borderRadius:14,background:`${cfg.color}18`,border:`1.5px solid ${cfg.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>💎</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{member.name}</div>
          <div style={{ fontSize:9,color:"#FFC83D",marginTop:2 }}>{member.id} · {member.country}</div>
          <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Spent: <span style={{ color:"#FFC83D",fontWeight:800 }}>{member.spent}</span> · Since: {member.since}</div>
        </div>
        <TierBadge tier={member.tier}/>
      </div>
      <ARow title="" actions={actions}/>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function VIPOverviewCenter({ onBack }) {
  return (
    <Shell title="💎 VIP Overview Center" subtitle="Complete VIP Program Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Total VIP Members",v:"4,284",  color:"#FFC83D",icon:"👑" },
        { l:"Active",           v:"3,921",  color:"#10B981",icon:"✅" },
        { l:"VIP 5 Members",    v:"142",    color:"#FFC83D",icon:"💎" },
        { l:"VIP Revenue",      v:"$124K",  color:"#A78BFA",icon:"💰" },
        { l:"Retention Rate",   v:"96%",    color:"#10B981",icon:"🔄" },
        { l:"Growth Rate",      v:"+34%",   color:"#60A5FA",icon:"🚀" },
      ]}/>
      <Chart label="👑 VIP MEMBER GROWTH (K)" data={vipGrowth} color="#FFC83D" gid="vo1"/>
      <Chart label="💰 VIP DAILY REVENUE" data={revenueData} color="#A78BFA" gid="vo2" type="bar"/>
      <Chart label="🔄 RETENTION SCORE" data={retentionD} color="#10B981" gid="vo3"/>
      <ARow title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data","Monitor VIP Growth"]}/>
    </Shell>
  );
}

function VIPMemberManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const members = [
    { id:"VIP-4821",name:"@DiamondQA",  tier:"VIP 5",country:"Qatar",       spent:"8.4M coins",since:"Jan 2025",status:"Active" },
    { id:"VIP-4798",name:"@GoldRose",   tier:"VIP 4",country:"Saudi Arabia", spent:"3.2M coins",since:"Mar 2025",status:"Active" },
    { id:"VIP-4762",name:"@SilverStar", tier:"VIP 3",country:"UAE",          spent:"1.8M coins",since:"Apr 2025",status:"Active" },
    { id:"VIP-4741",name:"@PlatinumQA", tier:"VIP 5",country:"Kuwait",       spent:"6.4M coins",since:"Feb 2025",status:"Suspended" },
    { id:"VIP-4712",name:"@RoyalUser",  tier:"VIP 2",country:"Egypt",        spent:"840K coins", since:"May 2025",status:"Active" },
  ];
  const sc = { Active:"#10B981",Suspended:"#EF4444",Expired:"#9CA3AF" };
  const tiers = ["All","VIP 5","VIP 4","VIP 3","VIP 2","VIP 1"];
  const visible = members
    .filter(m => filter==="All" || m.tier===filter)
    .filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="👑 VIP Member Management" subtitle="Manage All VIP Members" onBack={onBack}>
      <KGrid items={[
        { l:"VIP 5",v:"142",color:"#FFC83D",icon:"👑" },
        { l:"VIP 4",v:"428",color:"#A78BFA",icon:"💜" },
        { l:"VIP 3",v:"984",color:"#10B981",icon:"💚" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#FFC83D"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search VIP members…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {tiers.map(t => (
          <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setFilter(t)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===t?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:filter===t?"#0D1B3E":"#FFC83D" }}>
            {t}
          </motion.button>
        ))}
      </div>
      {visible.map((m,i) => (
        <motion.div key={m.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <VIPMemberCard member={m} actions={["View Member","Upgrade VIP","Downgrade VIP","Extend Membership","Suspend VIP Status","Reactivate VIP Status"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPLevelManagementCenter({ onBack }) {
  const levels = [
    { tier:"VIP 1",price:"$9.99/mo",  members:"2,184",benefits:["Custom Frame","Emoji Pack","5% Gift Bonus"],requirement:"1,000 coins/mo",color:"#9CA3AF" },
    { tier:"VIP 2",price:"$19.99/mo", members:"1,042",benefits:["Premium Frame","Priority Queue","10% Gift Bonus"],requirement:"5,000 coins/mo",color:"#60A5FA" },
    { tier:"VIP 3",price:"$49.99/mo", members:"648",  benefits:["Diamond Frame","VIP Chat Badge","15% Gift Bonus","Exclusive Events"],requirement:"20,000 coins/mo",color:"#10B981" },
    { tier:"VIP 4",price:"$99.99/mo", members:"268",  benefits:["Royal Frame","Host Priority","20% Gift Bonus","Dedicated Support"],requirement:"80,000 coins/mo",color:"#A78BFA" },
    { tier:"VIP 5",price:"$249.99/mo",members:"142",  benefits:["Emperor Crown","All Privileges","25% Gift Bonus","Personal VIP Manager"],requirement:"300,000 coins/mo",color:"#FFC83D" },
  ];
  return (
    <Shell title="🏆 VIP Level Management" subtitle="VIP Tiers, Requirements & Benefits" onBack={onBack}>
      {levels.map((l,i) => (
        <motion.div key={l.tier} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${l.color}`,boxShadow:`0 4px 16px ${l.color}22` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:4 }}>
                <TierBadge tier={l.tier}/>
                <span style={{ fontSize:12,fontWeight:900,color:"#FFC83D" }}>{l.price}</span>
              </div>
              <div style={{ fontSize:9,color:"#9CA3AF" }}>Requirement: <span style={{ color:l.color,fontWeight:700 }}>{l.requirement}</span></div>
              <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>{l.members} active members</div>
            </div>
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>
            {l.benefits.map(b => (
              <span key={b} style={{ fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:8,background:`${l.color}12`,color:l.color,border:`1px solid ${l.color}20` }}>⭐ {b}</span>
            ))}
          </div>
          <ARow title="" actions={["Edit VIP Level","Update Benefits","Manage Requirements","View Level Analytics"]}/>
        </motion.div>
      ))}
      <ARow title="⚡ CREATE" actions={["Create VIP Level"]}/>
    </Shell>
  );
}

function VIPRewardsCenter({ onBack }) {
  const rewards = [
    { name:"Monthly Diamond Gift Box",tier:"VIP 5",value:"10,000 coins",recipients:"142",status:"Active",  icon:"💎" },
    { name:"Weekly Bonus Pack",       tier:"VIP 4+",value:"2,000 coins", recipients:"410",status:"Active",  icon:"🎁" },
    { name:"Exclusive Sticker Set",   tier:"VIP 3+",value:"Stickers",    recipients:"1.1K",status:"Active", icon:"🖼️" },
    { name:"VIP Birthday Bonus",      tier:"All VIP",value:"500 coins",  recipients:"284", status:"Active",  icon:"🎂" },
    { name:"Anniversary Reward",      tier:"VIP 2+",value:"1,000 coins", recipients:"2.1K",status:"Upcoming",icon:"🥂" },
  ];
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Expired:"#9CA3AF",Paused:"#F59E0B" };
  return (
    <Shell title="🎁 VIP Rewards Center" subtitle="VIP Reward Programs" onBack={onBack}>
      <KGrid items={[
        { l:"Active Rewards",  v:"8",     color:"#10B981",icon:"🎁" },
        { l:"Distributed",     v:"284K",  color:"#FFC83D",icon:"📤" },
        { l:"Upcoming",        v:"3",     color:"#A78BFA",icon:"📅" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Reward"]}/>
      {rewards.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>Tier: {r.tier} · Value: {r.value}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{r.recipients} recipients</div>
            </div>
            <SBadge status={r.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Distribute Reward","Edit Reward","View Reward History","Analyze Reward Performance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPEventManagementCenter({ onBack }) {
  const events = [
    { name:"Diamond Members Summit",  date:"Jun 28",tier:"VIP 5",    seats:"50",  registered:"48", status:"Upcoming", icon:"💎" },
    { name:"VIP Royal Live Night",    date:"Jul 5", tier:"VIP 3+",   seats:"500", registered:"412",status:"Upcoming", icon:"👑" },
    { name:"Exclusive Q&A with Hosts",date:"Jul 12",tier:"VIP 2+",   seats:"1K",  registered:"648",status:"Planning", icon:"🎙️" },
    { name:"VIP New Year Gala",       date:"Dec 31",tier:"All VIP",  seats:"5K",  registered:"-",  status:"Planning", icon:"🥂" },
  ];
  const sc = { Upcoming:"#FFC83D",Live:"#10B981",Completed:"#60A5FA",Planning:"#A78BFA" };
  return (
    <Shell title="🎉 VIP Event Management" subtitle="VIP Exclusive Events" onBack={onBack}>
      <KGrid items={[
        { l:"Upcoming Events",v:"4",   color:"#FFC83D",icon:"📅" },
        { l:"Total Seats",    v:"6.5K",color:"#60A5FA",icon:"🪑" },
        { l:"Registered",     v:"1.1K",color:"#10B981",icon:"✅" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Event"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{e.date} · Tier: {e.tier}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Seats: {e.seats}{e.registered!=="-"?` · Registered: ${e.registered}`:""}</div>
            </div>
            <SBadge status={e.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Schedule Event","Launch Event","Monitor Participation","Generate Event Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPHostEngagementCenter({ onBack }) {
  const sessions = [
    { host:"@SaraLive",  tier:"VIP 5 Only",  date:"Jun 25",participants:"42", type:"Private Meet & Greet",  status:"Scheduled",icon:"🎙️" },
    { host:"@MoonVoice", tier:"VIP 3+",       date:"Jun 28",participants:"284",type:"Exclusive Q&A",         status:"Scheduled",icon:"🎙️" },
    { host:"@StarQA",    tier:"VIP 4+",       date:"Jul 2", participants:"128",type:"Private Live Concert",   status:"Planning", icon:"🎵" },
  ];
  const sc = { Scheduled:"#FFC83D",Live:"#10B981",Completed:"#60A5FA",Planning:"#A78BFA" };
  return (
    <Shell title="🎙️ VIP Host Engagement" subtitle="VIP x Premium Host Interactions" onBack={onBack}>
      <KGrid items={[
        { l:"Scheduled Sessions",v:"6",   color:"#FFC83D",icon:"📅" },
        { l:"Completed",         v:"42",  color:"#10B981",icon:"✅" },
        { l:"VIP Satisfaction",  v:"98%", color:"#A78BFA",icon:"⭐" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Arrange VIP Session","Create Meet & Greet"]}/>
      {sessions.map((s,i) => (
        <motion.div key={s.host+s.date} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.type}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>Host: {s.host} · {s.date}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{s.tier} · {s.participants} participants</div>
            </div>
            <SBadge status={s.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Launch Exclusive Live Event","Monitor Engagement","Generate Interaction Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPRevenueCenter({ onBack }) {
  const breakdown = [
    { l:"VIP Subscriptions",v:"$68K",pct:55,color:"#FFC83D" },
    { l:"VIP Coin Purchases",v:"$32K",pct:26,color:"#A78BFA" },
    { l:"VIP Gift Revenue",  v:"$14K",pct:11,color:"#EC4899" },
    { l:"VIP Event Revenue", v:"$10K",pct:8, color:"#10B981" },
  ];
  return (
    <Shell title="💰 VIP Revenue Center" subtitle="VIP Program Revenue Analysis" onBack={onBack}>
      <KGrid items={[
        { l:"Total VIP Revenue", v:"$124K", color:"#FFC83D",icon:"💰" },
        { l:"VIP 5 Revenue",     v:"$48K",  color:"#A78BFA",icon:"👑" },
        { l:"Monthly Growth",    v:"+28%",  color:"#10B981",icon:"📈" },
      ]}/>
      <Chart label="💰 VIP DAILY REVENUE" data={revenueData} color="#FFC83D" gid="vrc1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 REVENUE BREAKDOWN</div>
        {breakdown.map(b => (
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
      <ARow title="⚡" actions={["Analyze Revenue","Export Revenue Report","Compare Revenue","View Revenue Breakdown"]}/>
    </Shell>
  );
}

function VIPRetentionCenter({ onBack }) {
  const atRisk = [
    { name:"@GoldRose",   tier:"VIP 4",lastActive:"8 days ago",  renewalDue:"Jun 22",risk:"High",  color:"#EF4444" },
    { name:"@SilverMoon", tier:"VIP 3",lastActive:"12 days ago", renewalDue:"Jun 25",risk:"High",  color:"#EF4444" },
    { name:"@StarVIP",    tier:"VIP 2",lastActive:"5 days ago",  renewalDue:"Jul 1", risk:"Medium",color:"#F59E0B" },
  ];
  return (
    <Shell title="🎯 VIP Retention Center" subtitle="VIP Loyalty & Renewal Strategy" onBack={onBack}>
      <KGrid items={[
        { l:"Retention Rate",  v:"96%",  color:"#10B981",icon:"🔄" },
        { l:"Renewal Rate",    v:"88%",  color:"#FFC83D",icon:"🔁" },
        { l:"At-Risk Members", v:"28",   color:"#EF4444",icon:"⚠️" },
      ]}/>
      <Chart label="🔄 RETENTION SCORE" data={retentionD} color="#10B981" gid="ret1"/>
      <div style={S.sec}>⚠️ AT-RISK MEMBERS</div>
      {atRisk.map((m,i) => (
        <motion.div key={m.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${m.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{m.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{m.tier} · Last active: {m.lastActive}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>Renewal due: {m.renewalDue}</div>
            </div>
            <div style={{ padding:"2px 8px",borderRadius:8,background:`${m.color}18`,border:`1px solid ${m.color}30`,height:"fit-content" }}>
              <span style={{ fontSize:9,fontWeight:800,color:m.color }}>{m.risk} Risk</span>
            </div>
          </div>
          <ARow title="" actions={["Track Renewals","Launch Retention Campaign"]}/>
        </motion.div>
      ))}
      <ARow title="⚡ MORE" actions={["Monitor Churn Rate","Generate Retention Report"]}/>
    </Shell>
  );
}

function VIPGrowthCenter({ onBack }) {
  return (
    <Shell title="📈 VIP Growth Center" subtitle="VIP Membership Growth & Expansion" onBack={onBack}>
      <KGrid items={[
        { l:"Monthly Growth", v:"+34%",  color:"#10B981",icon:"🚀" },
        { l:"YoY Growth",     v:"+128%", color:"#FFC83D",icon:"📈" },
        { l:"Forecast Q3",    v:"5.8K",  color:"#A78BFA",icon:"🔮" },
      ]}/>
      <Chart label="👑 VIP MEMBER GROWTH (K)" data={vipGrowth} color="#FFC83D" gid="vgc1"/>
      <Chart label="💰 VIP REVENUE TREND" data={revenueData} color="#A78BFA" gid="vgc2" type="bar"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 GROWTH vs TARGETS</div>
        <PBar label="VIP 5 Acquisition Target" value={82} color="#FFC83D"/>
        <PBar label="VIP 4 Acquisition Target" value={76} color="#A78BFA"/>
        <PBar label="Retention Target"         value={96} color="#10B981"/>
        <PBar label="Revenue Growth Target"    value={88} color="#60A5FA"/>
      </div>
      <ARow title="⚡" actions={["Monitor Growth","Analyze Trends","Forecast VIP Growth","Export Analytics"]}/>
    </Shell>
  );
}

function VIPCommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All VIP");
  const [type, setType] = useState("In-App Message");
  return (
    <Shell title="📨 VIP Communication Center" subtitle="VIP Member Communications" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>👑 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All VIP","VIP 5 Only","VIP 4+","VIP 3+","At-Risk VIP"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:target===t?"#0D1B3E":"#FFC83D" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 CHANNEL</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["In-App Message","Push Notification","Email","VIP Newsletter"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setType(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:type===t?"linear-gradient(135deg,#A78BFA,#7C3AED)":"rgba(255,255,255,0.06)",color:type===t?"#fff":"#FFC83D" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Write your exclusive VIP message or announcement…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,200,61,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#0D1B3E",background:"linear-gradient(135deg,#FFC83D,#D97706)",boxShadow:"0 6px 20px rgba(255,200,61,0.4)" }}>
          👑 Send VIP Message
        </motion.button>
      </div>
      <ARow title="⚡ MORE" actions={["Broadcast Announcement","Send Invitations","Notify VIP Members"]}/>
    </Shell>
  );
}

function ExclusiveBenefitsCenter({ onBack }) {
  const benefits = [
    { name:"Diamond Profile Frame",   tier:"VIP 5",active:true,  users:"142",icon:"🖼️",color:"#FFC83D" },
    { name:"Priority Room Entry",     tier:"VIP 3+",active:true, users:"1.1K",icon:"🚪",color:"#10B981" },
    { name:"Gift 25% Discount",       tier:"VIP 5",active:true,  users:"142",icon:"🎁",color:"#A78BFA" },
    { name:"VIP Chat Badge",          tier:"VIP 2+",active:true, users:"2.1K",icon:"💬",color:"#60A5FA" },
    { name:"Personal VIP Manager",    tier:"VIP 5",active:true,  users:"142",icon:"👤",color:"#FFC83D" },
    { name:"Exclusive Sticker Pack",  tier:"VIP 3+",active:false,users:"-",  icon:"🖼️",color:"#EC4899" },
  ];
  return (
    <Shell title="🎁 Exclusive Benefits Center" subtitle="VIP Privileges & Perks" onBack={onBack}>
      <KGrid items={[
        { l:"Total Benefits",  v:"24",   color:"#FFC83D",icon:"🎁" },
        { l:"Active",          v:"20",   color:"#10B981",icon:"✅" },
        { l:"Usage Rate",      v:"91%",  color:"#A78BFA",icon:"📊" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Add Benefit"]}/>
      {benefits.map((b,i) => (
        <motion.div key={b.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${b.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{b.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff" }}>{b.name}</div>
            <div style={{ fontSize:9,color:"#FFC83D",marginTop:2 }}>Tier: {b.tier}{b.users!=="-"?` · ${b.users} using`:""}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end" }}>
            <div style={{ padding:"2px 8px",borderRadius:8,background:b.active?"rgba(16,185,129,0.15)":"rgba(156,163,175,0.15)",border:`1px solid ${b.active?"rgba(16,185,129,0.3)":"rgba(156,163,175,0.3)"}` }}>
              <span style={{ fontSize:9,fontWeight:800,color:b.active?"#10B981":"#9CA3AF" }}>{b.active?"Active":"Inactive"}</span>
            </div>
            <div style={{ display:"flex",gap:4 }}>
              {["✏️","🔄","🗑️"].map((ic,ii) => (
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

function VIPPartnershipCenter({ onBack }) {
  const partners = [
    { name:"StarPro Agency",  type:"Agency Partnership",  deal:"VIP 5 exclusive streams",  status:"Active",  icon:"🏢" },
    { name:"LuxuryQA Brand",  type:"Brand Collaboration", deal:"VIP gifting sponsorship",   status:"Active",  icon:"🌟" },
    { name:"EventProQA",      type:"Event Partnership",   deal:"VIP summit organizer",      status:"Active",  icon:"🎉" },
    { name:"GiftBoxQA",       type:"Gift Partnership",    deal:"Monthly gift box delivery", status:"Pending", icon:"🎁" },
  ];
  const sc = { Active:"#10B981",Pending:"#FFC83D",Expired:"#9CA3AF",Reviewing:"#A78BFA" };
  return (
    <Shell title="🤝 VIP Partnership Center" subtitle="Premium Partnerships & Collaborations" onBack={onBack}>
      <KGrid items={[
        { l:"Active Partners", v:"8",   color:"#FFC83D",icon:"🤝" },
        { l:"Pending",         v:"3",   color:"#A78BFA",icon:"⏳" },
        { l:"Total Value",     v:"$84K",color:"#10B981",icon:"💰" },
      ]}/>
      <ARow title="⚡ ADD" actions={["Add Partner"]}/>
      {partners.map((p,i) => (
        <motion.div key={p.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{p.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>{p.type}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{p.deal}</div>
            </div>
            <SBadge status={p.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Manage Partnership","Launch VIP Campaign","Review Performance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPCountryCenter({ onBack }) {
  const countries = [
    { name:"Saudi Arabia",flag:"🇸🇦",vips:"1,284",revenue:"$48K",growth:"+28%",pct:30,color:"#10B981" },
    { name:"Qatar",       flag:"🇶🇦",vips:"842",  revenue:"$32K",growth:"+34%",pct:20,color:"#FFC83D" },
    { name:"UAE",         flag:"🇦🇪",vips:"684",  revenue:"$26K",growth:"+22%",pct:16,color:"#A78BFA" },
    { name:"Kuwait",      flag:"🇰🇼",vips:"428",  revenue:"$16K",growth:"+18%",pct:10,color:"#60A5FA" },
    { name:"Egypt",       flag:"🇪🇬",vips:"284",  revenue:"$8K", growth:"+42%",pct:7,  color:"#EC4899" },
  ];
  return (
    <Shell title="🌍 VIP Country Performance" subtitle="Country-Wise VIP Analytics" onBack={onBack}>
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
              <div style={{ fontSize:9,color:"#FFC83D" }}>{c.vips} VIP members · {c.pct}% of total</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{c.revenue}</div>
              <div style={{ fontSize:10,fontWeight:800,color:"#10B981" }}>{c.growth}</div>
            </div>
          </div>
          <PBar label="" value={c.pct} color={c.color}/>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["View Country Statistics","Compare Countries","Export Report","Analyze Growth"]}/>
    </Shell>
  );
}

function TopVIPRankingsCenter({ onBack }) {
  const [tab, setTab] = useState("Gifters");
  const data = {
    Gifters:[
      { rank:1,name:"@DiamondQA",  stat:"8.4M coins sent",  tier:"VIP 5",icon:"💎" },
      { rank:2,name:"@GoldRose",   stat:"3.2M coins sent",  tier:"VIP 5",icon:"🌹" },
      { rank:3,name:"@RoyalQA",    stat:"2.8M coins sent",  tier:"VIP 4",icon:"👑" },
    ],
    Spenders:[
      { rank:1,name:"@DiamondQA",  stat:"$8,400 spent",     tier:"VIP 5",icon:"💰" },
      { rank:2,name:"@PlatinumQA", stat:"$6,200 spent",     tier:"VIP 5",icon:"💰" },
      { rank:3,name:"@GoldRose",   stat:"$3,800 spent",     tier:"VIP 4",icon:"💰" },
    ],
    Loyalists:[
      { rank:1,name:"@StarVIP",    stat:"18 months member", tier:"VIP 3",icon:"🏅" },
      { rank:2,name:"@DiamondQA",  stat:"16 months member", tier:"VIP 5",icon:"🏅" },
      { rank:3,name:"@GoldRose",   stat:"15 months member", tier:"VIP 4",icon:"🏅" },
    ],
  };
  const goldColors = { 1:"#FFC83D",2:"#C0C0C0",3:"#CD7F32" };
  return (
    <Shell title="🏅 Top VIP Rankings" subtitle="Elite VIP Leaderboards" onBack={onBack}>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {["Gifters","Spenders","Loyalists"].map(t => (
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
          <div style={{ width:36,height:36,borderRadius:"50%",background:`${goldColors[e.rank]}22`,border:`2px solid ${goldColors[e.rank]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:goldColors[e.rank],flexShrink:0 }}>
            {e.rank}
          </div>
          <span style={{ fontSize:22,flexShrink:0 }}>{e.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
            <div style={{ fontSize:9,color:"#FFC83D",marginTop:1 }}>{e.stat}</div>
          </div>
          <TierBadge tier={e.tier}/>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["View Rankings","Export Rankings","Analyze Performance"]}/>
    </Shell>
  );
}

function AIVIPIntelligenceCenter({ onBack }) {
  const insights = [
    "VIP 5 member churn risk increased 12% — recommend personalized outreach within 48h",
    "Saudi Arabia showing highest VIP conversion rate at 8.4% — increase marketing allocation",
    "VIP members who attend events have 3x higher renewal rate — scale event programs",
    "Gift frequency drops 40% after 6 months — introduce 6-month loyalty rewards",
    "VIP 4→5 upgrade rate highest on Fridays — schedule upgrade campaigns accordingly",
    "Top 10 VIP gifters account for 42% of total VIP revenue — prioritize their retention",
  ];
  return (
    <Shell title="🧠 AI VIP Intelligence" subtitle="AI-Powered VIP Insights & Forecasting" onBack={onBack}>
      <KGrid items={[
        { l:"AI Accuracy",   v:"97%",   color:"#10B981",icon:"🧠" },
        { l:"Churn Forecast",v:"4.2%",  color:"#EF4444",icon:"⚠️" },
        { l:"Growth Forecast",v:"+38%", color:"#FFC83D",icon:"🔮" },
      ]}/>
      <Chart label="👑 AI VIP GROWTH FORECAST" data={[...vipGrowth,{d:"Jul",v:5.1},{d:"Aug",v:6.0}]} color="#10B981" gid="ai1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 AI VIP INSIGHTS</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"8px 0",borderBottom:i<insights.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#FFC83D",fontWeight:800,fontSize:11,flexShrink:0 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{ins}</span>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Generate Insights","Analyze Trends","Forecast Performance","Predict Retention"]}/>
    </Shell>
  );
}

function VIPAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📊 VIP Analytics Center" subtitle="Advanced VIP Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"LTV per VIP 5",  v:"$2.4K", color:"#FFC83D",icon:"💰" },
        { l:"LTV per VIP 4",  v:"$840",  color:"#A78BFA",icon:"💜" },
        { l:"Avg Tenure",     v:"8.4 mo",color:"#60A5FA",icon:"📅" },
      ]}/>
      <Chart label="👑 VIP MEMBER GROWTH (K)" data={vipGrowth} color="#FFC83D" gid="vac1"/>
      <Chart label="💰 VIP DAILY REVENUE" data={revenueData} color="#A78BFA" gid="vac2" type="bar"/>
      <Chart label="🔄 RETENTION SCORE" data={retentionD} color="#10B981" gid="vac3"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 PERFORMANCE vs TARGETS</div>
        <PBar label="Revenue Growth Target" value={88} color="#FFC83D"/>
        <PBar label="Retention Target"      value={96} color="#10B981"/>
        <PBar label="Acquisition Target"    value={82} color="#A78BFA"/>
        <PBar label="Engagement Target"     value={91} color="#60A5FA"/>
      </div>
      <ARow title="⚡" actions={["View Analytics","Export Analytics","Compare Metrics","Generate Insights"]}/>
    </Shell>
  );
}

function VIPReportCenter({ onBack }) {
  const reports = [
    { name:"Daily VIP Report",          date:"Jun 17",size:"420 KB",status:"Ready" },
    { name:"Weekly VIP Report",         date:"Jun 15",size:"1.1 MB",status:"Ready" },
    { name:"VIP Revenue Report",        date:"Jun 14",size:"840 KB",status:"Ready" },
    { name:"VIP Retention Report",      date:"Jun 10",size:"620 KB",status:"Ready" },
    { name:"VIP Country Report",        date:"Jun 7", size:"980 KB",status:"Archived" },
    { name:"VIP Loyalty Report",        date:"Jun 1", size:"1.4 MB",status:"Archived" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📋 VIP Report Management" subtitle="Generate & Manage VIP Reports" onBack={onBack}>
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

function VIPTeamCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior VIP Relationship Manager",tasks:8, score:96,status:"Online" },
    { name:"Khalid Omar",     role:"VIP Member Success Specialist",   tasks:12,score:91,status:"Online" },
    { name:"Fatima Hassan",   role:"VIP Events Coordinator",          tasks:5, score:94,status:"Busy" },
    { name:"Ahmad Nasser",    role:"VIP Analytics Specialist",        tasks:6, score:88,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#FFC83D",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 VIP Team Center" subtitle="VIP Operations Staff" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff",  v:"12",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",   v:"8",   color:"#10B981",icon:"🟢" },
        { l:"Avg Score",    v:"92%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Add Staff"]}/>
      {staff.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
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

function VIPSettingsCenter({ onBack }) {
  const settings = [
    { name:"VIP Tier Requirements",   icon:"🏆",desc:"Coin requirements per VIP tier",        color:"#FFC83D" },
    { name:"VIP Pricing Config",      icon:"💰",desc:"Monthly subscription pricing",           color:"#10B981" },
    { name:"Auto-Renewal Settings",   icon:"🔁",desc:"Renewal notification and billing rules", color:"#60A5FA" },
    { name:"VIP Benefit Rules",       icon:"🎁",desc:"Benefits assignment automation",         color:"#A78BFA" },
    { name:"VIP Access Policies",     icon:"🔐",desc:"Room entry and feature access rules",    color:"#EC4899" },
    { name:"Expiry & Grace Period",   icon:"⏰",desc:"Membership expiry and grace settings",   color:"#EF4444" },
  ];
  return (
    <Shell title="⚙️ VIP Settings Center" subtitle="VIP System Configuration" onBack={onBack}>
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
      <ARow title="⚡" actions={["Update Settings","Save Configuration","Reset Settings","Manage VIP Policies"]}/>
    </Shell>
  );
}

function VMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Emergency VIP Upgrade",       icon:"⚡",desc:"Instantly upgrade a user to any VIP tier",       color:"#FFC83D" },
    { name:"VIP Reward Distribution",     icon:"🎁",desc:"Distribute rewards to selected VIP members",     color:"#A78BFA" },
    { name:"Global VIP Campaign Launch",  icon:"🌍",desc:"Launch a campaign across all VIP tiers globally", color:"#10B981" },
    { name:"VIP Retention Optimization",  icon:"🎯",desc:"AI-powered VIP at-risk member rescue protocol",  color:"#60A5FA" },
    { name:"Premium User Recovery",       icon:"🔐",desc:"Recover and restore inactive premium members",   color:"#1F6BFF" },
    { name:"VIP Revenue Optimization",    icon:"💰",desc:"Optimize VIP pricing and tier incentives",       color:"#EC4899" },
    { name:"Strategic VIP Planning",      icon:"🧠",desc:"AI-powered long-term VIP strategy builder",      color:"#EF4444" },
  ];
  return (
    <Shell title="🚀 VM Exclusive Tools" subtitle="VIP Manager Executive Powers" onBack={onBack}>
      <div style={{ background:"rgba(255,200,61,0.08)",border:"1px solid rgba(255,200,61,0.3)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — VIP MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools carry the highest VIP authority. All activations are logged and require VIP Manager authentication.</div>
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
            style={{ width:"100%",padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:12,color:t.color==="#FFC83D"?"#0D1B3E":"#fff",
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
  overview:    VIPOverviewCenter,
  members:     VIPMemberManagementCenter,
  levels:      VIPLevelManagementCenter,
  rewards:     VIPRewardsCenter,
  events:      VIPEventManagementCenter,
  engagement:  VIPHostEngagementCenter,
  revenue:     VIPRevenueCenter,
  retention:   VIPRetentionCenter,
  growth:      VIPGrowthCenter,
  comms:       VIPCommunicationCenter,
  benefits:    ExclusiveBenefitsCenter,
  partners:    VIPPartnershipCenter,
  countries:   VIPCountryCenter,
  rankings:    TopVIPRankingsCenter,
  ai:          AIVIPIntelligenceCenter,
  analytics:   VIPAnalyticsCenter,
  reports:     VIPReportCenter,
  team:        VIPTeamCenter,
  settings:    VIPSettingsCenter,
  exclusive:   VMExclusiveTools,
};

const MODULES = [
  { id:"overview",   icon:"💎", label:"VIP Overview",         subtitle:"Program Summary",     gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.5)" },
  { id:"members",    icon:"👑", label:"Member Management",    subtitle:"All VIP Members",     gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.4)" },
  { id:"levels",     icon:"🏆", label:"VIP Level Management", subtitle:"Tiers & Benefits",    gradient:"linear-gradient(145deg,#FFC83D,#A78BFA)", glow:"rgba(255,200,61,0.4)" },
  { id:"rewards",    icon:"🎁", label:"VIP Rewards",          subtitle:"Reward Programs",     gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"events",     icon:"🎉", label:"VIP Events",           subtitle:"Exclusive Events",    gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"engagement", icon:"🎙️", label:"Host Engagement",      subtitle:"VIP x Host Sessions", gradient:"linear-gradient(145deg,#A78BFA,#1F6BFF)", glow:"rgba(167,139,250,0.35)" },
  { id:"revenue",    icon:"💰", label:"VIP Revenue",          subtitle:"Revenue Analysis",    gradient:"linear-gradient(145deg,#FFC83D,#10B981)", glow:"rgba(255,200,61,0.4)" },
  { id:"retention",  icon:"🎯", label:"VIP Retention",        subtitle:"Loyalty Strategy",    gradient:"linear-gradient(145deg,#EF4444,#B91C1C)", glow:"rgba(239,68,68,0.35)" },
  { id:"growth",     icon:"📈", label:"VIP Growth",           subtitle:"Membership Growth",   gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.3)" },
  { id:"comms",      icon:"📨", label:"VIP Communication",    subtitle:"Member Messaging",    gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"benefits",   icon:"🎁", label:"Exclusive Benefits",   subtitle:"VIP Privileges",      gradient:"linear-gradient(145deg,#FFC83D,#EC4899)", glow:"rgba(255,200,61,0.4)" },
  { id:"partners",   icon:"🤝", label:"VIP Partnerships",     subtitle:"Premium Partners",    gradient:"linear-gradient(145deg,#60A5FA,#0EA5E9)", glow:"rgba(96,165,250,0.35)" },
  { id:"countries",  icon:"🌍", label:"Country Performance",  subtitle:"Global VIP Stats",    gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.35)" },
  { id:"rankings",   icon:"🏅", label:"Top VIP Rankings",     subtitle:"Elite Leaderboards",  gradient:"linear-gradient(145deg,#FFC83D,#F97316)", glow:"rgba(255,200,61,0.45)" },
  { id:"ai",         icon:"🧠", label:"AI VIP Intelligence",  subtitle:"AI Forecasting",      gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"analytics",  icon:"📊", label:"VIP Analytics",        subtitle:"Advanced Analytics",  gradient:"linear-gradient(145deg,#A78BFA,#FFC83D)", glow:"rgba(167,139,250,0.35)" },
  { id:"reports",    icon:"📋", label:"Report Management",    subtitle:"Generate Reports",    gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"team",       icon:"👥", label:"VIP Team",             subtitle:"Staff Management",    gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"settings",   icon:"⚙️", label:"VIP Settings",         subtitle:"System Config",       gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",  icon:"🚀", label:"VM Exclusive Tools",   subtitle:"Executive Powers",    gradient:"linear-gradient(145deg,#FFC83D,#A78BFA)", glow:"rgba(255,200,61,0.6)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function VIPManagerDashboard() {
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
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>👑 VIP Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>Members · Rewards · Events · Retention · Analytics</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>👑 VM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,200,61,0.18),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#A78BFA,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · VIP MEMBERSHIP & PREMIUM EXPERIENCE DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>VIP Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central VIP hub — member management, tier systems, rewards, exclusive events, retention optimization, and AI-powered intelligence.</div>
        </div>

        <KGrid items={[
          { l:"Total VIP Members",    v:"4,284",  color:"#FFC83D",icon:"👑" },
          { l:"Active VIP Members",   v:"3,921",  color:"#10B981",icon:"✅" },
          { l:"New VIP Members",      v:"+284",   color:"#60A5FA",icon:"🆕" },
          { l:"VIP Revenue",          v:"$124K",  color:"#FFC83D",icon:"💰" },
          { l:"VIP Coin Purchases",   v:"$68K",   color:"#A78BFA",icon:"🪙" },
          { l:"VIP Gift Revenue",     v:"$42K",   color:"#EC4899",icon:"🎁" },
          { l:"VIP Retention Rate",   v:"96%",    color:"#10B981",icon:"🔄" },
          { l:"VIP Renewal Rate",     v:"88%",    color:"#FFC83D",icon:"🔁" },
          { l:"Event Participants",   v:"1.1K",   color:"#60A5FA",icon:"🎉" },
          { l:"VIP Support Requests", v:"4",      color:"#EF4444",icon:"🆘" },
          { l:"VIP 5 Members",        v:"142",    color:"#FFC83D",icon:"💎" },
          { l:"VIP Growth Rate",      v:"+34%",   color:"#10B981",icon:"🚀" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} VIP MODULES · TAP TO ACCESS
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
                  background:mod.featured?"linear-gradient(90deg,#FFC83D,#A78BFA,#FFC83D)":`linear-gradient(90deg,rgba(255,200,61,0.5),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#FFC83D"},rgba(255,200,61,0.5))` }}/>
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