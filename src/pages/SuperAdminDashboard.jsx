/**
 * SuperAdminDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Super Admin
 * Theme: Enterprise Dark Blue, Silver & Platinum · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  page: { minHeight:"100dvh", background:"linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:90 },
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:18, ...x }),
  badge: { padding:"4px 10px", borderRadius:20, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)" },
  sec: { fontSize:10, fontWeight:800, color:"#818CF8", letterSpacing:"0.08em", marginBottom:10 },
  kpi: (c) => ({ background:`linear-gradient(145deg,${c}18,${c}08)`, border:`1px solid ${c}30`, borderRadius:14, padding:"12px 8px", textAlign:"center" }),
  btn: (g, glow) => ({ padding:"8px 11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, color:"#fff", background:g, boxShadow:`0 4px 12px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GRADS = ["linear-gradient(135deg,#6366F1,#4338CA)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#0EA5E9,#0369A1)","linear-gradient(135deg,#A855F7,#7E22CE)"];
const GLOWS  = ["rgba(99,102,241,0.4)","rgba(16,185,129,0.3)","rgba(239,68,68,0.35)","rgba(255,200,61,0.35)","rgba(14,165,233,0.3)","rgba(168,85,247,0.3)"];

const revenueData = [{d:"Mon",v:8.4},{d:"Tue",v:11.2},{d:"Wed",v:9.6},{d:"Thu",v:14.8},{d:"Fri",v:18.2},{d:"Sat",v:22.4},{d:"Sun",v:16.8}];
const activityData= [{d:"Jan",v:42},{d:"Feb",v:58},{d:"Mar",v:51},{d:"Apr",v:74},{d:"May",v:88},{d:"Jun",v:96}];
const hostData    = [{d:"Mon",v:284},{d:"Tue",v:342},{d:"Wed",v:312},{d:"Thu",v:428},{d:"Fri",v:512},{d:"Sat",v:484},{d:"Sun",v:396}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Shell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(99,102,241,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(99,102,241,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#818CF8"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#818CF8" }}>{subtitle}</div>
          </div>
          <div style={S.badge}><span style={{ fontSize:10,fontWeight:800,color:"#818CF8" }}>🛡️ SA</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#818CF8" }) => (
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
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#818CF8" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#818CF8" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gid})`} strokeWidth={2} dot={{ fill:"#818CF8",r:2 }}/>
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

function EntityCard({ entity, actions, statusColors, accentColor="#818CF8" }) {
  const sc = statusColors || { Active:"#10B981",Suspended:"#EF4444",Pending:"#FFC83D",Inactive:"#9CA3AF" };
  return (
    <div style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${accentColor}` }}>
      <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:`${accentColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{entity.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{entity.name}</div>
          {entity.sub1 && <div style={{ fontSize:9,color:"#818CF8",marginTop:1 }}>{entity.sub1}</div>}
          {entity.sub2 && <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{entity.sub2}</div>}
        </div>
        <SBadge status={entity.status} colors={sc}/>
      </div>
      <ACard title="" actions={actions}/>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function AgencyManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Active:"#10B981",Suspended:"#EF4444",Pending:"#FFC83D",Under_Review:"#A855F7" };
  const agencies = [
    { name:"StarPro QA",     icon:"🏢",sub1:"AGC-001 · Qatar · 42 hosts",       sub2:"Revenue: $12.4K/mo · Tier: Gold",    status:"Active" },
    { name:"EliteMedia SA",  icon:"🏢",sub1:"AGC-002 · Saudi Arabia · 28 hosts", sub2:"Revenue: $8.1K/mo · Tier: Silver",   status:"Active" },
    { name:"VoiceHouse UAE", icon:"🏢",sub1:"AGC-003 · UAE · 21 hosts",          sub2:"Revenue: $4.8K/mo · Tier: Bronze",   status:"Active" },
    { name:"GlobalSound KW", icon:"🏢",sub1:"AGC-004 · Kuwait · 18 hosts",       sub2:"Revenue: $3.2K/mo · Tier: Bronze",   status:"Suspended" },
    { name:"NewTalentEG",    icon:"🏢",sub1:"AGC-005 · Egypt · 0 hosts",         sub2:"Awaiting verification",              status:"Pending" },
  ];
  const filters = ["All","Active","Suspended","Pending"];
  const visible = filter==="All" ? agencies : agencies.filter(a => a.status===filter);
  return (
    <Shell title="🏢 Agency Management Center" subtitle="All Agencies Under Operational Control" onBack={onBack}>
      <KGrid items={[
        { l:"Total Agencies",  v:"84",    color:"#6366F1",icon:"🏢" },
        { l:"Active",          v:"72",    color:"#10B981",icon:"✅" },
        { l:"Suspended",       v:"4",     color:"#EF4444",icon:"⛔" },
        { l:"Pending",         v:"8",     color:"#FFC83D",icon:"⏳" },
        { l:"Total Revenue",   v:"$48K",  color:"#6366F1",icon:"💰" },
        { l:"Avg Hosts/Agency",v:"18",    color:"#818CF8",icon:"🎙️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#6366F1,#4338CA)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#818CF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={a} statusColors={sc} accentColor="#6366F1"
            actions={["View Agency Profile","Approve Agency","Suspend Agency","Reactivate Agency","Review Revenue","Review Performance","Send Warning","Contact Agency Owner","Generate Agency Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgentManagementCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const sc = { Active:"#10B981",Suspended:"#EF4444",Pending:"#FFC83D" };
  const agents = [
    { name:"Ali Hassan",     icon:"🤝",sub1:"AGT-001 · Qatar · 12 hosts recruited",   sub2:"Earnings: $2.4K · Score: 94%",   status:"Active" },
    { name:"Sara Al-Qasim",  icon:"🤝",sub1:"AGT-002 · Saudi Arabia · 8 hosts",       sub2:"Earnings: $1.6K · Score: 88%",   status:"Active" },
    { name:"Mohamed Taha",   icon:"🤝",sub1:"AGT-003 · UAE · 18 hosts",              sub2:"Earnings: $3.6K · Score: 96%",   status:"Active" },
    { name:"Nour Al-Rashid", icon:"🤝",sub1:"AGT-004 · Kuwait · 4 hosts",            sub2:"Earnings: $800 · Score: 72%",    status:"Suspended" },
    { name:"Layla Hassan",   icon:"🤝",sub1:"AGT-005 · Egypt · pending verification", sub2:"Application under review",       status:"Pending" },
  ];
  const filtered = agents.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="🤝 Talent Agent Management" subtitle="Agent Recruitment Operations" onBack={onBack}>
      <KGrid items={[
        { l:"Total Agents",   v:"284",  color:"#10B981",icon:"🤝" },
        { l:"Active",         v:"248",  color:"#10B981",icon:"✅" },
        { l:"Pending",        v:"18",   color:"#FFC83D",icon:"⏳" },
        { l:"Avg Hosts",      v:"8.4",  color:"#6366F1",icon:"🎙️" },
        { l:"Total Earnings", v:"$84K", color:"#FFC83D",icon:"💰" },
        { l:"Avg Score",      v:"88%",  color:"#818CF8",icon:"⭐" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#818CF8"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search agents…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {filtered.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={a} statusColors={sc} accentColor="#10B981"
            actions={["Approve Agent","Suspend Agent","Reactivate Agent","Review Performance","Review Earnings","Monitor Recruitment","Send Notice","Generate Agent Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function HostManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Active:"#10B981",Live:"#EF4444",Suspended:"#EF4444",Pending:"#FFC83D",Offline:"#9CA3AF" };
  const hosts = [
    { name:"@SaraLive",   icon:"🎙️",sub1:"HST-4821 · Qatar · VIP 4",        sub2:"142h streamed · Earnings: $2.1K",    status:"Live" },
    { name:"@MoonVoice",  icon:"🎙️",sub1:"HST-3841 · Saudi Arabia · VIP 3",  sub2:"98h streamed · Earnings: $1.4K",    status:"Active" },
    { name:"@DiamondVox", icon:"🎙️",sub1:"HST-2918 · UAE · VIP 5",           sub2:"184h streamed · Earnings: $4.2K",   status:"Live" },
    { name:"@StarQA",     icon:"🎙️",sub1:"HST-2412 · Kuwait · VIP 2",        sub2:"64h streamed · Earnings: $840",     status:"Active" },
    { name:"@NoorQA",     icon:"🎙️",sub1:"HST-1924 · Qatar · VIP 1",         sub2:"28h streamed · Earnings: $280",     status:"Offline" },
    { name:"@BadActor",   icon:"🎙️",sub1:"HST-1284 · Egypt · Unverified",    sub2:"Multiple violations reported",      status:"Suspended" },
  ];
  const filters = ["All","Live","Active","Offline","Suspended"];
  const visible = filter==="All" ? hosts : hosts.filter(h => h.status===filter);
  return (
    <Shell title="🎙️ Host Management Center" subtitle="Host Operations & Streaming Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Total Hosts",  v:"4.2K",  color:"#A855F7",icon:"🎙️" },
        { l:"Active",       v:"3.8K",  color:"#10B981",icon:"✅" },
        { l:"Live Now",     v:"284",   color:"#EF4444",icon:"🔴" },
        { l:"Suspended",    v:"42",    color:"#EF4444",icon:"⛔" },
        { l:"Pending",      v:"128",   color:"#FFC83D",icon:"⏳" },
        { l:"Avg Revenue",  v:"$480",  color:"#6366F1",icon:"💰" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#A855F7,#7E22CE)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#818CF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((h,i) => (
        <motion.div key={h.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={h} statusColors={sc} accentColor="#A855F7"
            actions={["Approve Host","Suspend Host","Reactivate Host","Review Performance","Monitor Live Activity","View Revenue","Review Violations","Send Warning","Generate Host Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AdminManagementCenter({ onBack }) {
  const sc = { Active:"#10B981",Suspended:"#EF4444",Busy:"#FFC83D",Offline:"#9CA3AF" };
  const admins = [
    { name:"Rania Al-Kaabi",  icon:"👨‍💼",sub1:"ADM-001 · Senior Admin · 98 tasks",    sub2:"Score: 96% · Resolved: 284 cases",  status:"Active" },
    { name:"Khalid Omar",     icon:"👨‍💼",sub1:"ADM-002 · Moderator · 142 tasks",      sub2:"Score: 91% · Resolved: 412 cases",  status:"Busy" },
    { name:"Fatima Hassan",   icon:"👨‍💼",sub1:"ADM-003 · Content Admin · 64 tasks",   sub2:"Score: 94% · Resolved: 198 cases",  status:"Active" },
    { name:"Ahmad Nasser",    icon:"👨‍💼",sub1:"ADM-004 · Support Admin · 48 tasks",   sub2:"Score: 87% · Resolved: 142 cases",  status:"Offline" },
  ];
  return (
    <Shell title="👨‍💼 Admin Management Center" subtitle="Platform Admin Operations" onBack={onBack}>
      <KGrid items={[
        { l:"Total Admins",   v:"28",   color:"#6366F1",icon:"👨‍💼" },
        { l:"Active",         v:"22",   color:"#10B981",icon:"✅" },
        { l:"Tasks Today",    v:"284",  color:"#FFC83D",icon:"📋" },
        { l:"Cases Resolved", v:"1.2K", color:"#10B981",icon:"✔️" },
        { l:"Avg Score",      v:"92%",  color:"#818CF8",icon:"⭐" },
        { l:"Avg Resp. Time", v:"4.2m", color:"#6366F1",icon:"⚡" },
      ]}/>
      <ACard title="⚡ CREATE" actions={["Create Admin"]}/>
      {admins.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EntityCard entity={a} statusColors={sc} accentColor="#6366F1"
            actions={["Edit Admin","Assign Permissions","Assign Tasks","Suspend Admin","Reactivate Admin","Review Performance","Generate Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ApplicationManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Pending:"#FFC83D",Under_Review:"#6366F1",Approved:"#10B981",Rejected:"#EF4444",Info_Requested:"#A855F7" };
  const apps = [
    { id:"APP-4821",name:"Host Application",   icon:"🎙️",sub1:"@NewHostQA · Qatar · Submitted Jun 17",      sub2:"Agent: AGT-001 · Agency: AGC-001",     status:"Pending" },
    { id:"APP-4798",name:"Agency Application",  icon:"🏢",sub1:"GlobalVoice · UAE · Submitted Jun 16",       sub2:"Owner: approved host & agent required", status:"Under_Review" },
    { id:"APP-4762",name:"Agent Application",   icon:"🤝",sub1:"Layla Hassan · Saudi · Submitted Jun 15",    sub2:"Host ID verified, awaiting review",     status:"Under_Review" },
    { id:"APP-4741",name:"Host Application",   icon:"🎙️",sub1:"@StarVoiceKW · Kuwait · Submitted Jun 14",   sub2:"Documents uploaded and verified",       status:"Info_Requested" },
    { id:"APP-4712",name:"Agency Application",  icon:"🏢",sub1:"SoundHouse · Egypt · Submitted Jun 10",      sub2:"Application rejected — incomplete docs", status:"Rejected" },
  ];
  const filters = ["All","Pending","Under_Review","Info_Requested"];
  const pLabel = { Under_Review:"Under Review",Info_Requested:"Info Requested" };
  const visible = filter==="All" ? apps : apps.filter(a => a.status===filter);
  return (
    <Shell title="📋 Application Management" subtitle="Host, Agent & Agency Applications" onBack={onBack}>
      <KGrid items={[
        { l:"Pending",       v:"28",  color:"#FFC83D",icon:"⏳" },
        { l:"Under Review",  v:"14",  color:"#6366F1",icon:"🔍" },
        { l:"Approved Today",v:"8",   color:"#10B981",icon:"✅" },
        { l:"Rejected",      v:"3",   color:"#EF4444",icon:"❌" },
        { l:"Total This Month",v:"84",color:"#818CF8",icon:"📋" },
        { l:"Avg Review Time",v:"1.4d",color:"#6366F1",icon:"⏱️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#6366F1,#4338CA)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#818CF8" }}>
            {pLabel[f]||f}
          </motion.button>
        ))}
      </div>
      {visible.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${sc[a.status]||"#818CF8"}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(99,102,241,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{a.name} <span style={{ fontSize:9,color:"#818CF8" }}>#{a.id}</span></div>
              <div style={{ fontSize:9,color:"#818CF8",marginTop:1 }}>{a.sub1}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{a.sub2}</div>
            </div>
            <SBadge status={pLabel[a.status]||a.status} colors={{ Pending:"#FFC83D","Under Review":"#6366F1",Approved:"#10B981",Rejected:"#EF4444","Info Requested":"#A855F7" }}/>
          </div>
          <ACard title="" actions={["Review Application","Approve Application","Reject Application","Request Additional Information","Escalate To Business Manager"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PerformanceMonitoringCenter({ onBack }) {
  return (
    <Shell title="📈 Performance Monitoring" subtitle="Agency, Agent, Host & Admin KPIs" onBack={onBack}>
      <KGrid items={[
        { l:"Agency Growth",    v:"+24%",  color:"#6366F1",icon:"🏢" },
        { l:"Agent Recruitment",v:"8.4/mo",color:"#10B981",icon:"🤝" },
        { l:"Host Retention",   v:"92%",   color:"#A855F7",icon:"🎙️" },
        { l:"Admin Efficiency", v:"94%",   color:"#FFC83D",icon:"👨‍💼" },
      ]}/>
      <Chart label="🎙️ ACTIVE HOSTS (DAILY)" data={hostData} color="#A855F7" gid="pm1" type="bar"/>
      <Chart label="📈 PLATFORM ACTIVITY INDEX" data={activityData} color="#6366F1" gid="pm2"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 KPI PERFORMANCE vs TARGETS</div>
        <PBar label="Agency Revenue Target"    value={84} color="#6366F1"/>
        <PBar label="Host Retention Target"    value={92} color="#A855F7"/>
        <PBar label="Agent Recruitment Target" value={78} color="#10B981"/>
        <PBar label="Admin Efficiency Target"  value={94} color="#FFC83D"/>
        <PBar label="Application Approval Rate"value={88} color="#818CF8"/>
      </div>
      <ACard title="⚡" actions={["Compare Performance","View KPIs","Generate Reports","Export Statistics"]}/>
    </Shell>
  );
}

function RevenueMonitoringCenter({ onBack }) {
  const breakdown = [
    { l:"Host Streaming Revenue",v:"$48K",pct:42,color:"#A855F7" },
    { l:"Agency Commission",     v:"$28K",pct:24,color:"#6366F1" },
    { l:"VIP Subscriptions",     v:"$18K",pct:16,color:"#FFC83D" },
    { l:"Event Revenue",         v:"$14K",pct:12,color:"#10B981" },
    { l:"Other Revenue",         v:"$6K", pct:6, color:"#818CF8" },
  ];
  return (
    <Shell title="💰 Revenue Monitoring Center" subtitle="Operational Revenue Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Daily Revenue",   v:"$8.4K",  color:"#FFC83D",icon:"💰" },
        { l:"Monthly Revenue", v:"$114K",  color:"#FFC83D",icon:"📅" },
        { l:"Monthly Growth",  v:"+28%",   color:"#10B981",icon:"📈" },
      ]}/>
      <Chart label="💰 DAILY REVENUE ($K)" data={revenueData} color="#FFC83D" gid="rm1" type="bar"/>
      <Chart label="📈 MONTHLY REVENUE TREND" data={activityData} color="#6366F1" gid="rm2"/>
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
      <ACard title="⚡" actions={["View Revenue Reports","Analyze Growth","Export Reports","Compare Revenue"]}/>
    </Shell>
  );
}

function EventMonitoringCenter({ onBack }) {
  const sc = { Active:"#10B981",Live:"#EF4444",Upcoming:"#FFC83D",Completed:"#60A5FA" };
  const events = [
    { name:"Summer Streaming Festival",  icon:"☀️",sub1:"Jun 20–30 · 8.4K participants · $2.8K revenue", sub2:"Hosts: 284 · Agencies: 12",      status:"Live" },
    { name:"Host Monthly Cup",           icon:"🏆",sub1:"Jun 30 · 842 participants",                      sub2:"Top performers ranking active",   status:"Active" },
    { name:"Agency Revenue Race",        icon:"💰",sub1:"Jul 31 · 36 agencies",                           sub2:"Prize: 150K coins · Planning",     status:"Upcoming" },
  ];
  return (
    <Shell title="🎉 Event Monitoring Center" subtitle="Host, Agent & Agency Events" onBack={onBack}>
      <KGrid items={[
        { l:"Live Events",    v:"2",    color:"#EF4444",icon:"🔴" },
        { l:"Active Events",  v:"8",    color:"#10B981",icon:"🎉" },
        { l:"Upcoming",       v:"14",   color:"#FFC83D",icon:"📅" },
      ]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EntityCard entity={e} statusColors={sc} accentColor="#10B981"
            actions={["View Events","Monitor Participation","Review Results","Generate Reports"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKMonitoringCenter({ onBack }) {
  const sc = { Live:"#EF4444",Scheduled:"#FFC83D",Completed:"#10B981",Disputed:"#A855F7" };
  const battles = [
    { name:"@SaraLive ⚔️ @MoonVoice",  icon:"⚔️",sub1:"PKB-4821 · Qatar · Room #4821",         sub2:"Gifts: 8,020 · Viewers: 2.4K · 18m", status:"Live" },
    { name:"@StarQA ⚔️ @NoorQA",       icon:"⚔️",sub1:"PKB-4798 · Saudi Arabia · Room #4798",   sub2:"Gifts: 5,960 · Viewers: 1.8K · 24m", status:"Live" },
    { name:"@RoyalQA ⚔️ @DiamondVox",  icon:"⚔️",sub1:"PKB-4762 · UAE · Completed Jun 17",      sub2:"Winner: @DiamondVox · Gifts: 12.8K",  status:"Completed" },
    { name:"@LunaQA ⚔️ @StarVoice",    icon:"⚔️",sub1:"PKB-4741 · Kuwait · Dispute filed",      sub2:"Complaint: gift manipulation",        status:"Disputed" },
  ];
  return (
    <Shell title="⚔️ PK Monitoring Center" subtitle="PK Battles & Competitions" onBack={onBack}>
      <KGrid items={[
        { l:"Live Battles",  v:"284",  color:"#EF4444",icon:"🔴" },
        { l:"Disputed",      v:"12",   color:"#A855F7",icon:"🚨" },
        { l:"Today Total",   v:"1.2K", color:"#10B981",icon:"⚔️" },
      ]}/>
      {battles.map((b,i) => (
        <motion.div key={b.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EntityCard entity={b} statusColors={sc} accentColor="#EF4444"
            actions={["View Battles","Monitor Results","Review Complaints","Resolve Disputes","Generate Reports"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ReportsViolationsCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Open:"#EF4444",Investigating:"#FFC83D",Resolved:"#10B981",Closed:"#9CA3AF" };
  const reports = [
    { name:"Gift Manipulation",        icon:"🚨",sub1:"RPT-1284 · Host: @StarQA · PKB-4798",     sub2:"Reporter: @MoonVoice · High priority",   status:"Open" },
    { name:"Fake Account Activity",    icon:"🚨",sub1:"RPT-1262 · Agency: GlobalSound",          sub2:"Multiple sock-puppet accounts detected", status:"Investigating" },
    { name:"Agent Rule Violation",     icon:"🚨",sub1:"RPT-1241 · Agent: Nour Al-Rashid",        sub2:"Poaching hosts from other agencies",     status:"Investigating" },
    { name:"Host Content Violation",   icon:"🚨",sub1:"RPT-1224 · Host: @BadActor",              sub2:"Inappropriate live content reported",    status:"Resolved" },
  ];
  const filters = ["All","Open","Investigating","Resolved"];
  const visible = filter==="All" ? reports : reports.filter(r => r.status===filter);
  return (
    <Shell title="🚨 Reports & Violations" subtitle="Compliance & Disciplinary Actions" onBack={onBack}>
      <KGrid items={[
        { l:"Open Cases",    v:"12",  color:"#EF4444",icon:"🚨" },
        { l:"Investigating", v:"8",   color:"#FFC83D",icon:"🔍" },
        { l:"Resolved",      v:"284", color:"#10B981",icon:"✅" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#818CF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((r,i) => (
        <motion.div key={r.name+i} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={r} statusColors={sc} accentColor="#EF4444"
            actions={["Review Reports","Investigate Violations","Issue Warning","Suspend Account","Close Case"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function SecurityMonitoringCenter({ onBack }) {
  const alerts = [
    { name:"Unusual Login Pattern",       icon:"🔐",sub1:"Account: @DiamondVox · 4 countries in 2h",   sub2:"Risk Score: 92% · Auto-flagged",    status:"High" },
    { name:"Multiple Device Sessions",    icon:"📱",sub1:"Account: AGC-002 · 8 simultaneous sessions", sub2:"Risk Score: 74% · Under review",    status:"Medium" },
    { name:"Rapid Gifting Anomaly",       icon:"🎁",sub1:"Account: @NewUser8841 · 200 gifts in 1min",  sub2:"Risk Score: 88% · Flagged",         status:"High" },
    { name:"Suspicious IP Activity",      icon:"🌐",sub1:"IP: 185.xx.xx.xx · VPN detected",            sub2:"Risk Score: 61% · Monitoring",      status:"Low" },
  ];
  const sc = { High:"#EF4444",Medium:"#FFC83D",Low:"#818CF8",Clear:"#10B981" };
  return (
    <Shell title="🛡️ Security Monitoring Center" subtitle="Platform Security & Threat Detection" onBack={onBack}>
      <KGrid items={[
        { l:"High Alerts",    v:"2",    color:"#EF4444",icon:"🚨" },
        { l:"Medium Alerts",  v:"4",    color:"#FFC83D",icon:"⚠️" },
        { l:"Flagged Accounts",v:"18",  color:"#A855F7",icon:"🔐" },
      ]}/>
      {alerts.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EntityCard entity={a} statusColors={sc} accentColor="#EF4444"
            actions={["View Login Logs","Monitor Devices","Detect Suspicious Activity","Force Logout","Lock Account","Investigate Security Risks"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Entities");
  const [channel, setChannel] = useState("In-App Message");
  return (
    <Shell title="📢 Communication Center" subtitle="Broadcast to Agencies, Agents, Hosts & Admins" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🎯 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Entities","All Agencies","All Agents","All Hosts","All Admins","Suspended Accounts"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#6366F1,#4338CA)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#818CF8" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 CHANNEL</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["In-App Message","Push Notification","Email Notice","Broadcast Announcement"].map(c => (
            <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setChannel(c)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:channel===c?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:channel===c?"#0D1B3E":"#818CF8" }}>
              {c}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Write your operational notice or announcement…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#6366F1,#4338CA)",boxShadow:"0 6px 20px rgba(99,102,241,0.4)" }}>
          🛡️ Send Operational Message
        </motion.button>
      </div>
    </Shell>
  );
}

function AnalyticsCenter({ onBack }) {
  return (
    <Shell title="📊 Analytics Center" subtitle="Advanced Operational Intelligence" onBack={onBack}>
      <KGrid items={[
        { l:"Platform Health",  v:"96%",  color:"#10B981",icon:"💚" },
        { l:"Ops Efficiency",   v:"91%",  color:"#6366F1",icon:"⚡" },
        { l:"Data Points",      v:"284K", color:"#818CF8",icon:"📊" },
      ]}/>
      <Chart label="🎙️ ACTIVE HOSTS (DAILY)" data={hostData} color="#A855F7" gid="ac1" type="bar"/>
      <Chart label="💰 DAILY REVENUE ($K)" data={revenueData} color="#FFC83D" gid="ac2"/>
      <Chart label="📈 PLATFORM GROWTH INDEX" data={activityData} color="#10B981" gid="ac3"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 OPERATIONAL TARGETS</div>
        <PBar label="Agency Growth"     value={84} color="#6366F1"/>
        <PBar label="Host Activation"   value={92} color="#A855F7"/>
        <PBar label="Revenue Target"    value={88} color="#FFC83D"/>
        <PBar label="Compliance Rate"   value={96} color="#10B981"/>
      </div>
      <ACard title="⚡" actions={["Generate Analytics","Export Data","Compare Results","Generate Insights"]}/>
    </Shell>
  );
}

function AuditLogCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const logs = [
    { action:"Agency Suspended",   actor:"SuperAdmin",  target:"AGC-004 GlobalSound",     time:"Jun 17, 14:22",  type:"Action",  color:"#EF4444" },
    { action:"Host Approved",      actor:"SuperAdmin",  target:"@MoonVoice HST-3841",     time:"Jun 17, 13:48",  type:"Approval",color:"#10B981" },
    { action:"Application Rejected",actor:"SuperAdmin", target:"APP-4712 SoundHouse",     time:"Jun 17, 12:31",  type:"Decision",color:"#EF4444" },
    { action:"Warning Issued",     actor:"SuperAdmin",  target:"@StarQA HST-2412",        time:"Jun 17, 11:14",  type:"Action",  color:"#FFC83D" },
    { action:"Admin Created",      actor:"SuperAdmin",  target:"Ahmad Nasser ADM-004",    time:"Jun 16, 16:42",  type:"Create",  color:"#6366F1" },
    { action:"Application Approved",actor:"SuperAdmin", target:"APP-4821 @NewHostQA",    time:"Jun 16, 15:28",  type:"Approval",color:"#10B981" },
  ];
  const filtered = logs.filter(l => l.action.toLowerCase().includes(query.toLowerCase()) || l.target.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="📋 Audit Log Center" subtitle="Operational Activity Logs" onBack={onBack}>
      <KGrid items={[
        { l:"Actions Today",  v:"48",   color:"#6366F1",icon:"📋" },
        { l:"This Week",      v:"284",  color:"#818CF8",icon:"📅" },
        { l:"Total Logs",     v:"12.4K",color:"#9CA3AF",icon:"🗄️" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#818CF8"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search audit logs…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {filtered.map((l,i) => (
        <motion.div key={l.action+i} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start" }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:l.color,flexShrink:0,marginTop:4 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{l.action}</div>
            <div style={{ fontSize:9,color:"#818CF8",marginTop:1 }}>{l.target}</div>
            <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{l.actor} · {l.time}</div>
          </div>
          <span style={{ fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:7,background:`${l.color}18`,color:l.color,flexShrink:0 }}>{l.type}</span>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["Search Logs","View Activities","Export Logs","Generate Audit Reports"]}/>
    </Shell>
  );
}

function OperationsSettingsCenter({ onBack }) {
  const settings = [
    { name:"Agency Rules Config",      icon:"🏢",desc:"Agency eligibility and performance rules",    color:"#6366F1" },
    { name:"Agent Recruitment Rules",  icon:"🤝",desc:"Recruitment limits and approval workflow",    color:"#10B981" },
    { name:"Host Eligibility Rules",   icon:"🎙️",desc:"Host onboarding and streaming requirements",  color:"#A855F7" },
    { name:"Admin Permission Matrix",  icon:"👨‍💼",desc:"Role-based access control for admins",       color:"#FFC83D" },
    { name:"Violation Thresholds",     icon:"🚨",desc:"Auto-suspension and warning triggers",        color:"#EF4444" },
    { name:"Notification Templates",   icon:"📢",desc:"Operational message templates and triggers",  color:"#818CF8" },
  ];
  return (
    <Shell title="⚙️ Operations Settings" subtitle="Operational Rules & Configuration" onBack={onBack}>
      {settings.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{s.name}</div>
            <div style={{ fontSize:10,color:"#818CF8" }}>{s.desc}</div>
          </div>
          <span style={{ fontSize:16,color:"#4B5563" }}>›</span>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["Update Settings","Save Changes","Restore Defaults","Configure Notifications"]}/>
    </Shell>
  );
}

/* ─────────────── MODULE REGISTRY ─────────────── */
const MODULE_SCREENS = {
  agencies:    AgencyManagementCenter,
  agents:      AgentManagementCenter,
  hosts:       HostManagementCenter,
  admins:      AdminManagementCenter,
  applications:ApplicationManagementCenter,
  performance: PerformanceMonitoringCenter,
  revenue:     RevenueMonitoringCenter,
  events:      EventMonitoringCenter,
  pk:          PKMonitoringCenter,
  violations:  ReportsViolationsCenter,
  security:    SecurityMonitoringCenter,
  comms:       CommunicationCenter,
  analytics:   AnalyticsCenter,
  audit:       AuditLogCenter,
  settings:    OperationsSettingsCenter,
};

const MODULES = [
  { id:"agencies",    icon:"🏢", label:"Agency Management",      subtitle:"Agency Control",       gradient:"linear-gradient(145deg,#6366F1,#4338CA)", glow:"rgba(99,102,241,0.45)" },
  { id:"agents",      icon:"🤝", label:"Talent Agent Mgmt",      subtitle:"Agent Operations",     gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"hosts",       icon:"🎙️", label:"Host Management",        subtitle:"Host Operations",      gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.4)" },
  { id:"admins",      icon:"👨‍💼", label:"Admin Management",       subtitle:"Admin Control",        gradient:"linear-gradient(145deg,#6366F1,#818CF8)", glow:"rgba(99,102,241,0.4)" },
  { id:"applications",icon:"📋", label:"Applications",           subtitle:"Approvals",            gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"performance", icon:"📈", label:"Performance Monitor",    subtitle:"KPI Tracking",         gradient:"linear-gradient(145deg,#0EA5E9,#1F6BFF)", glow:"rgba(14,165,233,0.35)" },
  { id:"revenue",     icon:"💰", label:"Revenue Monitoring",     subtitle:"Financial Intel",      gradient:"linear-gradient(145deg,#FFC83D,#10B981)", glow:"rgba(255,200,61,0.35)" },
  { id:"events",      icon:"🎉", label:"Event Monitoring",       subtitle:"Live Events",          gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"pk",          icon:"⚔️", label:"PK Monitoring",          subtitle:"Battle Control",       gradient:"linear-gradient(145deg,#EF4444,#B91C1C)", glow:"rgba(239,68,68,0.4)" },
  { id:"violations",  icon:"🚨", label:"Reports & Violations",   subtitle:"Compliance",           gradient:"linear-gradient(145deg,#EF4444,#A855F7)", glow:"rgba(239,68,68,0.35)" },
  { id:"security",    icon:"🛡️", label:"Security Monitoring",    subtitle:"Threat Detection",     gradient:"linear-gradient(145deg,#1F6BFF,#6366F1)", glow:"rgba(31,107,255,0.4)" },
  { id:"comms",       icon:"📢", label:"Communication Center",   subtitle:"Broadcast Messages",   gradient:"linear-gradient(145deg,#6366F1,#A855F7)", glow:"rgba(99,102,241,0.35)" },
  { id:"analytics",   icon:"📊", label:"Analytics Center",       subtitle:"Business Intelligence",gradient:"linear-gradient(145deg,#818CF8,#6366F1)", glow:"rgba(129,140,248,0.4)" },
  { id:"audit",       icon:"🗂️", label:"Audit Log Center",       subtitle:"Activity Logs",        gradient:"linear-gradient(145deg,#374151,#1F6BFF)", glow:"rgba(55,65,81,0.4)" },
  { id:"settings",    icon:"⚙️", label:"Operations Settings",    subtitle:"System Config",        gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(99,102,241,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(99,102,241,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#818CF8"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🛡️ Super Admin Dashboard</div>
            <div style={{ fontSize:10,color:"#818CF8" }}>Agencies · Agents · Hosts · Admins · Compliance</div>
          </div>
          <div style={S.badge}><span style={{ fontSize:10,fontWeight:800,color:"#818CF8" }}>🛡️ SA</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)",pointerEvents:"none" }}/>

        {/* Hero banner */}
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#6366F1,#A855F7,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#818CF8",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · PLATFORM OPERATIONS ADMINISTRATION · REPORTS TO: COUNTRY MANAGER</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Super Admin Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7,marginBottom:12 }}>Central operations hub — agencies, talent agents, hosts, admins, applications, compliance, security, and analytics.</div>
          {/* Global Search */}
          <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:12,display:"flex",alignItems:"center",gap:8,padding:"10px 13px",border:"1px solid rgba(99,102,241,0.2)" }}>
            <Search size={14} color="#818CF8"/>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Global search — agencies, agents, hosts, admins…"
              style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
          </div>
        </div>

        {/* KPI Grid */}
        <KGrid items={[
          { l:"Total Agencies",    v:"84",    color:"#6366F1",icon:"🏢" },
          { l:"Active Agencies",   v:"72",    color:"#10B981",icon:"✅" },
          { l:"Total Agents",      v:"284",   color:"#10B981",icon:"🤝" },
          { l:"Active Agents",     v:"248",   color:"#10B981",icon:"✅" },
          { l:"Total Hosts",       v:"4.2K",  color:"#A855F7",icon:"🎙️" },
          { l:"Active Hosts",      v:"3.8K",  color:"#10B981",icon:"✅" },
          { l:"Online Hosts",      v:"284",   color:"#EF4444",icon:"🔴" },
          { l:"Total Admins",      v:"28",    color:"#6366F1",icon:"👨‍💼" },
          { l:"Active Admins",     v:"22",    color:"#10B981",icon:"✅" },
          { l:"Pending Apps",      v:"28",    color:"#FFC83D",icon:"⏳" },
          { l:"Active Streams",    v:"284",   color:"#EF4444",icon:"🔴" },
          { l:"Daily Revenue",     v:"$8.4K", color:"#FFC83D",icon:"💰" },
          { l:"Monthly Revenue",   v:"$114K", color:"#FFC83D",icon:"📅" },
          { l:"Active PK Battles", v:"142",   color:"#EF4444",icon:"⚔️" },
          { l:"Active Events",     v:"8",     color:"#A855F7",icon:"🎉" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#818CF8",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} OPERATIONS MODULES · TAP TO ACCESS
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {MODULES.map((mod,i) => (
            <motion.div key={mod.id}
              initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.03,duration:0.2 }}
              whileTap={{ scale:0.91 }} onClick={() => setActiveModule(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{
                borderRadius:18,overflow:"hidden",
                background:"rgba(255,255,255,0.04)",
                border:"1.5px solid rgba(99,102,241,0.14)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:`linear-gradient(90deg,rgba(99,102,241,0.5),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#6366F1"},rgba(99,102,241,0.5))` }}/>
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#818CF8",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}