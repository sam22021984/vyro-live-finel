/**
 * AdminDashboardPage — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Admin
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
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(56,189,248,0.15)", borderRadius:18, ...x }),
  badge: { padding:"4px 10px", borderRadius:20, background:"rgba(56,189,248,0.12)", border:"1px solid rgba(56,189,248,0.3)" },
  sec: { fontSize:10, fontWeight:800, color:"#38BDF8", letterSpacing:"0.08em", marginBottom:10 },
  kpi: (c) => ({ background:`linear-gradient(145deg,${c}18,${c}08)`, border:`1px solid ${c}30`, borderRadius:14, padding:"12px 8px", textAlign:"center" }),
  btn: (g, glow) => ({ padding:"8px 11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, color:"#fff", background:g, boxShadow:`0 4px 12px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GRADS = ["linear-gradient(135deg,#0EA5E9,#0369A1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#6366F1,#4338CA)","linear-gradient(135deg,#A855F7,#7E22CE)"];
const GLOWS  = ["rgba(14,165,233,0.4)","rgba(16,185,129,0.3)","rgba(239,68,68,0.35)","rgba(255,200,61,0.35)","rgba(99,102,241,0.3)","rgba(168,85,247,0.3)"];

const activityData = [{d:"Mon",v:42},{d:"Tue",v:58},{d:"Wed",v:51},{d:"Thu",v:74},{d:"Fri",v:88},{d:"Sat",v:76},{d:"Sun",v:64}];
const hostData     = [{d:"Mon",v:84},{d:"Tue",v:112},{d:"Wed",v:96},{d:"Thu",v:128},{d:"Fri",v:142},{d:"Sat",v:118},{d:"Sun",v:104}];
const caseData     = [{d:"Mon",v:12},{d:"Tue",v:18},{d:"Wed",v:9},{d:"Thu",v:22},{d:"Fri",v:16},{d:"Sat",v:8},{d:"Sun",v:14}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Shell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(56,189,248,0.18)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(56,189,248,0.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#38BDF8"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#38BDF8" }}>{subtitle}</div>
          </div>
          <div style={S.badge}><span style={{ fontSize:10,fontWeight:800,color:"#38BDF8" }}>👨‍💼 ADM</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#38BDF8" }) => (
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
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#38BDF8" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#38BDF8" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gid})`} strokeWidth={2} dot={{ fill:"#38BDF8",r:2 }}/>
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
  const c = (colors||{})[status] || "#9CA3AF";
  return (
    <div style={{ padding:"2px 8px",borderRadius:8,background:`${c}18`,border:`1px solid ${c}30`,flexShrink:0,alignSelf:"flex-start" }}>
      <span style={{ fontSize:9,fontWeight:800,color:c }}>{status}</span>
    </div>
  );
}

function EntityCard({ entity, actions, statusColors, accentColor="#38BDF8" }) {
  const sc = statusColors || { Active:"#10B981",Suspended:"#EF4444",Pending:"#FFC83D",Offline:"#9CA3AF" };
  return (
    <div style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${accentColor}` }}>
      <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
        <div style={{ width:44,height:44,borderRadius:13,background:`${accentColor}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{entity.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{entity.name}</div>
          {entity.sub1 && <div style={{ fontSize:9,color:"#38BDF8",marginTop:1 }}>{entity.sub1}</div>}
          {entity.sub2 && <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{entity.sub2}</div>}
        </div>
        <SBadge status={entity.status} colors={sc}/>
      </div>
      <ACard title="" actions={actions}/>
    </div>
  );
}

/* ─────────────── MODULES ─────────────── */

function AgencyManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Active:"#10B981",Suspended:"#EF4444",Pending:"#FFC83D",Under_Review:"#A855F7" };
  const agencies = [
    { name:"StarPro QA",     icon:"🏢",sub1:"AGC-001 · Qatar · 42 hosts",        sub2:"Revenue: $12.4K/mo · Tier: Gold",   status:"Active" },
    { name:"EliteMedia SA",  icon:"🏢",sub1:"AGC-002 · Saudi Arabia · 28 hosts",  sub2:"Revenue: $8.1K/mo · Tier: Silver",  status:"Active" },
    { name:"GlobalSound KW", icon:"🏢",sub1:"AGC-004 · Kuwait · 18 hosts",        sub2:"2 violations · Review needed",      status:"Suspended" },
    { name:"NewTalentEG",    icon:"🏢",sub1:"AGC-005 · Egypt · Pending",          sub2:"Documents awaiting verification",   status:"Pending" },
  ];
  const filters = ["All","Active","Suspended","Pending"];
  const visible = filter==="All" ? agencies : agencies.filter(a => a.status===filter);
  return (
    <Shell title="🏢 Agency Management Center" subtitle="Assigned Agencies" onBack={onBack}>
      <KGrid items={[
        { l:"Assigned Agencies", v:"12",   color:"#0EA5E9",icon:"🏢" },
        { l:"Active",            v:"10",   color:"#10B981",icon:"✅" },
        { l:"Suspended",         v:"1",    color:"#EF4444",icon:"⛔" },
        { l:"Pending",           v:"1",    color:"#FFC83D",icon:"⏳" },
        { l:"Compliance Rate",   v:"94%",  color:"#38BDF8",icon:"📊" },
        { l:"Avg Hosts",         v:"22",   color:"#A855F7",icon:"🎙️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#0EA5E9,#0369A1)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#38BDF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={a} statusColors={sc} accentColor="#0EA5E9"
            actions={["View Agency Profile","Review Agency Performance","Verify Documents","Send Warning","Send Notice","Escalate Case","Generate Agency Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgentManagementCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const sc = { Active:"#10B981",Suspended:"#EF4444",Pending:"#FFC83D" };
  const agents = [
    { name:"Ali Hassan",     icon:"🤝",sub1:"AGT-001 · Qatar · 12 hosts recruited",   sub2:"Score: 94% · Activity: High",    status:"Active" },
    { name:"Sara Al-Qasim",  icon:"🤝",sub1:"AGT-002 · Saudi Arabia · 8 hosts",       sub2:"Score: 88% · Activity: Normal",  status:"Active" },
    { name:"Mohamed Taha",   icon:"🤝",sub1:"AGT-003 · UAE · 18 hosts",              sub2:"Score: 96% · Activity: High",    status:"Active" },
    { name:"Nour Al-Rashid", icon:"🤝",sub1:"AGT-004 · Kuwait · 4 hosts",            sub2:"1 violation · Under review",     status:"Suspended" },
    { name:"Layla Hassan",   icon:"🤝",sub1:"AGT-005 · Egypt · Pending",             sub2:"Application under review",       status:"Pending" },
  ];
  const filtered = agents.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="🤝 Talent Agent Management" subtitle="Assigned Talent Agents" onBack={onBack}>
      <KGrid items={[
        { l:"Assigned Agents", v:"18",   color:"#10B981",icon:"🤝" },
        { l:"Active",          v:"15",   color:"#10B981",icon:"✅" },
        { l:"Pending",         v:"2",    color:"#FFC83D",icon:"⏳" },
        { l:"Avg Hosts/Agent", v:"8.4",  color:"#38BDF8",icon:"🎙️" },
        { l:"Activity Score",  v:"88%",  color:"#A855F7",icon:"⭐" },
        { l:"Compliance",      v:"92%",  color:"#0EA5E9",icon:"📊" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#38BDF8"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search assigned agents…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {filtered.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={a} statusColors={sc} accentColor="#10B981"
            actions={["View Agent Profile","Review Performance","Verify Documents","Monitor Activities","Send Notice","Escalate Issues","Generate Agent Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function HostManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Active:"#10B981",Live:"#EF4444",Suspended:"#EF4444",Pending:"#FFC83D",Offline:"#9CA3AF" };
  const hosts = [
    { name:"@SaraLive",   icon:"🎙️",sub1:"HST-4821 · Qatar · VIP 4",        sub2:"142h streamed · Revenue: $2.1K",  status:"Live" },
    { name:"@MoonVoice",  icon:"🎙️",sub1:"HST-3841 · Saudi Arabia · VIP 3",  sub2:"98h streamed · Revenue: $1.4K",  status:"Active" },
    { name:"@StarQA",     icon:"🎙️",sub1:"HST-2412 · Kuwait · VIP 2",        sub2:"64h streamed · 1 warning issued", status:"Active" },
    { name:"@NoorQA",     icon:"🎙️",sub1:"HST-1924 · Qatar · VIP 1",         sub2:"28h streamed · Inactive 3 days", status:"Offline" },
    { name:"@BadActor",   icon:"🎙️",sub1:"HST-1284 · Egypt",                 sub2:"Multiple violations reported",   status:"Suspended" },
  ];
  const filters = ["All","Live","Active","Offline","Suspended"];
  const visible = filter==="All" ? hosts : hosts.filter(h => h.status===filter);
  return (
    <Shell title="🎙️ Host Management Center" subtitle="Assigned Hosts" onBack={onBack}>
      <KGrid items={[
        { l:"Assigned Hosts", v:"284",  color:"#A855F7",icon:"🎙️" },
        { l:"Active",         v:"248",  color:"#10B981",icon:"✅" },
        { l:"Live Now",       v:"42",   color:"#EF4444",icon:"🔴" },
        { l:"Offline",        v:"28",   color:"#9CA3AF",icon:"⭕" },
        { l:"Suspended",      v:"8",    color:"#EF4444",icon:"⛔" },
        { l:"Retention Rate", v:"94%",  color:"#38BDF8",icon:"📊" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#A855F7,#7E22CE)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#38BDF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((h,i) => (
        <motion.div key={h.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={h} statusColors={sc} accentColor="#A855F7"
            actions={["View Host Profile","Monitor Live Activity","Review Performance","Verify Documents","Issue Warning","Contact Host","Escalate Suspension Request","Generate Host Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ApplicationManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Pending:"#FFC83D","Under Review":"#0EA5E9",Approved:"#10B981",Rejected:"#EF4444","Info Requested":"#A855F7" };
  const apps = [
    { id:"APP-4821",name:"Host Application",   icon:"🎙️",sub1:"@NewHostQA · Qatar · Jun 17",            sub2:"Agent: AGT-001 · Docs uploaded",    status:"Pending" },
    { id:"APP-4798",name:"Agency Application",  icon:"🏢",sub1:"GlobalVoice · UAE · Jun 16",             sub2:"Awaiting document verification",    status:"Under Review" },
    { id:"APP-4762",name:"Agent Application",   icon:"🤝",sub1:"Layla Hassan · Saudi Arabia · Jun 15",   sub2:"Host ID pending confirmation",      status:"Under Review" },
    { id:"APP-4741",name:"Host Application",   icon:"🎙️",sub1:"@StarVoiceKW · Kuwait · Jun 14",         sub2:"Additional documents required",     status:"Info Requested" },
    { id:"APP-4712",name:"Host Application",   icon:"🎙️",sub1:"@SoundEG · Egypt · Jun 10",              sub2:"Documents verified and approved",   status:"Approved" },
  ];
  const filters = ["All","Pending","Under Review","Info Requested"];
  const visible = filter==="All" ? apps : apps.filter(a => a.status===filter);
  return (
    <Shell title="📋 Application Management" subtitle="Host, Agent & Agency Applications" onBack={onBack}>
      <KGrid items={[
        { l:"Pending",        v:"14",  color:"#FFC83D",icon:"⏳" },
        { l:"Under Review",   v:"8",   color:"#0EA5E9",icon:"🔍" },
        { l:"Approved Today", v:"4",   color:"#10B981",icon:"✅" },
        { l:"Rejected",       v:"1",   color:"#EF4444",icon:"❌" },
        { l:"This Month",     v:"48",  color:"#38BDF8",icon:"📋" },
        { l:"Avg Review",     v:"1.2d",color:"#A855F7",icon:"⏱️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#0EA5E9,#0369A1)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#38BDF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${sc[a.status]||"#38BDF8"}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(56,189,248,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{a.name} <span style={{ fontSize:9,color:"#38BDF8" }}>#{a.id}</span></div>
              <div style={{ fontSize:9,color:"#38BDF8",marginTop:1 }}>{a.sub1}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{a.sub2}</div>
            </div>
            <SBadge status={a.status} colors={sc}/>
          </div>
          <ACard title="" actions={["Review Application","Verify Documents","Approve Application","Reject Application","Request Additional Information","Escalate To Super Admin"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VerificationCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Pending:"#FFC83D",Approved:"#10B981",Rejected:"#EF4444","Re-Submission":"#A855F7" };
  const verifications = [
    { name:"@NewHostQA — Identity",       icon:"🪪",sub1:"Type: Identity · Submitted Jun 17",     sub2:"National ID front + back uploaded",    status:"Pending" },
    { name:"AGC-005 NewTalentEG — Biz",   icon:"🏢",sub1:"Type: Business · Submitted Jun 16",    sub2:"Trade license and bank docs required",  status:"Pending" },
    { name:"@StarVoiceKW — Selfie",       icon:"🤳",sub1:"Type: Identity · Submitted Jun 14",    sub2:"Selfie with ID blurry — needs redo",    status:"Re-Submission" },
    { name:"AGT-005 Layla — Identity",    icon:"🪪",sub1:"Type: Identity · Submitted Jun 13",    sub2:"All documents verified successfully",   status:"Approved" },
    { name:"@EG_Host_2841 — Identity",    icon:"🪪",sub1:"Type: Identity · Submitted Jun 10",    sub2:"Expired ID document submitted",         status:"Rejected" },
  ];
  const filters = ["All","Pending","Re-Submission"];
  const visible = filter==="All" ? verifications : verifications.filter(v => v.status===filter);
  return (
    <Shell title="✅ Verification Center" subtitle="Document & Identity Verifications" onBack={onBack}>
      <KGrid items={[
        { l:"Pending",     v:"14",  color:"#FFC83D",icon:"⏳" },
        { l:"Approved",    v:"284", color:"#10B981",icon:"✅" },
        { l:"Re-Submission",v:"4",  color:"#A855F7",icon:"🔄" },
        { l:"Rejected",    v:"12",  color:"#EF4444",icon:"❌" },
        { l:"This Month",  v:"42",  color:"#38BDF8",icon:"📋" },
        { l:"Avg Time",    v:"18h", color:"#0EA5E9",icon:"⏱️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#10B981,#059669)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#38BDF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((v,i) => (
        <motion.div key={v.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={v} statusColors={sc} accentColor="#10B981"
            actions={["Review Documents","Approve Verification","Reject Verification","Request Re-Submission","Verify Identity","Verify Business Information"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function SupportCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Open:"#EF4444",Investigating:"#FFC83D",Assigned:"#0EA5E9",Resolved:"#10B981",Closed:"#9CA3AF" };
  const cases = [
    { name:"Agency Host Transfer Issue",  icon:"🎫",sub1:"CSE-1284 · Agency: StarPro QA · Jun 17",       sub2:"Host reassignment to new agency",      status:"Open" },
    { name:"Agent Payment Dispute",       icon:"🎫",sub1:"CSE-1262 · Agent: Ali Hassan · Jun 17",        sub2:"Monthly earnings calculation error",   status:"Investigating" },
    { name:"Host Account Access",         icon:"🎫",sub1:"CSE-1241 · Host: @MoonVoice · Jun 16",         sub2:"Cannot log into host account",         status:"Assigned" },
    { name:"Agency Profile Update",       icon:"🎫",sub1:"CSE-1224 · Agency: EliteMedia · Jun 15",       sub2:"Request: update agency information",   status:"Resolved" },
    { name:"Host Streaming Issue",        icon:"🎫",sub1:"CSE-1198 · Host: @StarQA · Jun 14",            sub2:"Connection issues during live streams", status:"Closed" },
  ];
  const filters = ["All","Open","Investigating","Assigned","Resolved"];
  const visible = filter==="All" ? cases : cases.filter(c => c.status===filter);
  return (
    <Shell title="🎫 Support Center" subtitle="Operational Cases & Issue Resolution" onBack={onBack}>
      <KGrid items={[
        { l:"Open Cases",    v:"8",   color:"#EF4444",icon:"🚨" },
        { l:"Investigating", v:"4",   color:"#FFC83D",icon:"🔍" },
        { l:"Resolved Today",v:"6",   color:"#10B981",icon:"✅" },
        { l:"Total Cases",   v:"284", color:"#38BDF8",icon:"📋" },
        { l:"Avg Resolution",v:"4.2h",color:"#0EA5E9",icon:"⏱️" },
        { l:"Satisfaction",  v:"94%", color:"#A855F7",icon:"⭐" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#38BDF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      <ACard title="⚡ NEW" actions={["Open Case"]}/>
      {visible.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={c} statusColors={sc} accentColor="#EF4444"
            actions={["Assign Case","Resolve Case","Close Case","Escalate Case","Generate Support Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ReportsComplianceCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const sc = { Open:"#EF4444",Investigating:"#FFC83D",Resolved:"#10B981",Escalated:"#A855F7" };
  const reports = [
    { name:"Host Content Violation",      icon:"🚨",sub1:"RPT-841 · Host: @BadActor · Jun 17",        sub2:"Inappropriate content during live",    status:"Open" },
    { name:"Agent Poaching Activity",     icon:"🚨",sub1:"RPT-824 · Agent: Nour Al-Rashid · Jun 16",  sub2:"Recruiting hosts from other agencies",  status:"Investigating" },
    { name:"Agency Policy Breach",        icon:"🚨",sub1:"RPT-812 · Agency: GlobalSound · Jun 15",    sub2:"Commission dispute with 3 hosts",       status:"Escalated" },
    { name:"Host Performance Issue",      icon:"🚨",sub1:"RPT-798 · Host: @NoorQA · Jun 14",          sub2:"Inactive 7+ days without notice",       status:"Resolved" },
  ];
  const filters = ["All","Open","Investigating","Escalated"];
  const visible = filter==="All" ? reports : reports.filter(r => r.status===filter);
  return (
    <Shell title="🚨 Reports & Compliance" subtitle="Complaints, Violations & Policy Enforcement" onBack={onBack}>
      <KGrid items={[
        { l:"Active Reports", v:"6",   color:"#EF4444",icon:"🚨" },
        { l:"Investigating",  v:"3",   color:"#FFC83D",icon:"🔍" },
        { l:"Escalated",      v:"1",   color:"#A855F7",icon:"📤" },
        { l:"Resolved",       v:"84",  color:"#10B981",icon:"✅" },
        { l:"Compliance Rate",v:"96%", color:"#38BDF8",icon:"📊" },
        { l:"Avg Close Time", v:"2.4d",color:"#0EA5E9",icon:"⏱️" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#EF4444,#B91C1C)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#38BDF8" }}>
            {f}
          </motion.button>
        ))}
      </div>
      {visible.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <EntityCard entity={r} statusColors={sc} accentColor="#EF4444"
            actions={["Review Reports","Investigate Complaints","Issue Warnings","Create Violation Report","Escalate Serious Cases","Track Compliance Status"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventSupportCenter({ onBack }) {
  const sc = { Active:"#10B981",Live:"#EF4444",Upcoming:"#FFC83D",Completed:"#38BDF8" };
  const events = [
    { name:"Summer Streaming Festival",  icon:"☀️",sub1:"Jun 20–30 · 284 host participants",    sub2:"8.4K total participants · Monitoring",  status:"Active" },
    { name:"Host Monthly Cup",           icon:"🏆",sub1:"Jun 30 · 142 assigned host entries",   sub2:"Rankings updated daily",                status:"Active" },
    { name:"VIP Night Event",            icon:"💎",sub1:"Jul 5 · Registration open",            sub2:"Verify entries before Jul 3",           status:"Upcoming" },
  ];
  return (
    <Shell title="🎉 Event Support Center" subtitle="Event Operations & Participant Management" onBack={onBack}>
      <KGrid items={[
        { l:"Active Events",  v:"3",   color:"#10B981",icon:"🎉" },
        { l:"Host Entries",   v:"284", color:"#A855F7",icon:"🎙️" },
        { l:"Upcoming",       v:"4",   color:"#FFC83D",icon:"📅" },
      ]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EntityCard entity={e} statusColors={sc} accentColor="#10B981"
            actions={["View Events","Register Participants","Verify Entries","Monitor Participation","Review Event Results","Generate Event Reports"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PKSupportCenter({ onBack }) {
  const sc = { Live:"#EF4444",Completed:"#10B981",Disputed:"#A855F7",Monitoring:"#FFC83D" };
  const battles = [
    { name:"@SaraLive ⚔️ @MoonVoice",  icon:"⚔️",sub1:"PKB-4821 · Qatar · Room #4821",      sub2:"Gifts: 8,020 · 18 mins in",           status:"Live" },
    { name:"@StarQA ⚔️ @NoorQA",       icon:"⚔️",sub1:"PKB-4798 · Kuwait · Room #4798",     sub2:"Gifts: 5,960 · Complaint filed",      status:"Disputed" },
    { name:"@DiamondVox ⚔️ @LunaQA",   icon:"⚔️",sub1:"PKB-4762 · UAE · Completed Jun 17",  sub2:"Winner: @DiamondVox · 12.8K gifts",   status:"Completed" },
  ];
  return (
    <Shell title="⚔️ PK Support Center" subtitle="PK Battles & Dispute Resolution" onBack={onBack}>
      <KGrid items={[
        { l:"Live Battles",   v:"42",  color:"#EF4444",icon:"🔴" },
        { l:"Disputed",       v:"3",   color:"#A855F7",icon:"🚨" },
        { l:"Today Total",    v:"284", color:"#38BDF8",icon:"⚔️" },
      ]}/>
      {battles.map((b,i) => (
        <motion.div key={b.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
          <EntityCard entity={b} statusColors={sc} accentColor="#EF4444"
            actions={["Monitor PK Battles","Verify Results","Review Complaints","Resolve Minor Disputes","Escalate Major Cases","Generate PK Reports"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("Assigned Agencies");
  const [channel, setChannel] = useState("In-App Message");
  return (
    <Shell title="📢 Communication Center" subtitle="Assigned Agencies, Agents & Hosts Only" onBack={onBack}>
      <div style={{ background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"10px 13px",marginBottom:12 }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#EF4444",marginBottom:2 }}>⚠️ SCOPE RESTRICTION</div>
        <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)" }}>You can only communicate with your assigned entities. Global broadcasts are restricted.</div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🎯 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["Assigned Agencies","Assigned Talent Agents","Assigned Hosts"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#0EA5E9,#0369A1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#38BDF8" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 CHANNEL</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["In-App Message","Push Notification","Broadcast Announcement","Performance Alert","Compliance Notice","Event Notification"].map(c => (
            <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setChannel(c)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:channel===c?"linear-gradient(135deg,#FFC83D,#D97706)":"rgba(255,255,255,0.06)",color:channel===c?"#0D1B3E":"#38BDF8" }}>
              {c}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Write your operational notice or update…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(56,189,248,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#0EA5E9,#0369A1)",boxShadow:"0 6px 20px rgba(14,165,233,0.4)" }}>
          📢 Send Message to {target}
        </motion.button>
      </div>
      <ACard title="⚡ MORE" actions={["View Communication History"]}/>
    </Shell>
  );
}

function ReportingAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📊 Reporting & Analytics" subtitle="Operational Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Apps Processed",  v:"48",  color:"#0EA5E9",icon:"📋" },
        { l:"Verifications",   v:"42",  color:"#10B981",icon:"✅" },
        { l:"Cases Resolved",  v:"284", color:"#FFC83D",icon:"🎫" },
        { l:"Reports Closed",  v:"84",  color:"#38BDF8",icon:"🚨" },
      ]}/>
      <Chart label="📊 DAILY ACTIVITY INDEX" data={activityData} color="#0EA5E9" gid="ra1"/>
      <Chart label="🎙️ ACTIVE ASSIGNED HOSTS" data={hostData} color="#A855F7" gid="ra2" type="bar"/>
      <Chart label="🎫 DAILY CASES RESOLVED" data={caseData} color="#10B981" gid="ra3" type="bar"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📈 KPI PERFORMANCE</div>
        <PBar label="Application Processing Rate"  value={92} color="#0EA5E9"/>
        <PBar label="Verification Completion Rate" value={88} color="#10B981"/>
        <PBar label="Case Resolution Rate"         value={94} color="#FFC83D"/>
        <PBar label="Host Compliance Rate"         value={96} color="#A855F7"/>
        <PBar label="Agency Performance Score"     value={84} color="#38BDF8"/>
      </div>
      <ACard title="⚡" actions={["Generate Report","Export Report","Download Analytics","Compare Performance","View KPI Dashboard"]}/>
    </Shell>
  );
}

function AuditLogCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const logs = [
    { action:"Application Approved",    actor:"Admin",  target:"APP-4712 @SoundEG",            time:"Jun 17, 15:48",  type:"Approval",  color:"#10B981" },
    { action:"Warning Issued",          actor:"Admin",  target:"Host: @BadActor HST-1284",      time:"Jun 17, 14:22",  type:"Action",    color:"#FFC83D" },
    { action:"Documents Verified",      actor:"Admin",  target:"AGT-005 Layla Hassan",          time:"Jun 17, 13:01",  type:"Verify",    color:"#0EA5E9" },
    { action:"Case Escalated",          actor:"Admin",  target:"CSE-1241 @MoonVoice",           time:"Jun 16, 16:48",  type:"Escalation",color:"#A855F7" },
    { action:"Compliance Notice Sent",  actor:"Admin",  target:"Agency: GlobalSound AGC-004",   time:"Jun 16, 12:34",  type:"Action",    color:"#EF4444" },
    { action:"Verification Rejected",   actor:"Admin",  target:"RPT-841 @BadActor",             time:"Jun 15, 10:22",  type:"Decision",  color:"#EF4444" },
  ];
  const filtered = logs.filter(l => l.action.toLowerCase().includes(query.toLowerCase()) || l.target.toLowerCase().includes(query.toLowerCase()));
  return (
    <Shell title="📋 Audit Log Center" subtitle="Activity Log & Operational History" onBack={onBack}>
      <KGrid items={[
        { l:"Actions Today",  v:"28",  color:"#0EA5E9",icon:"📋" },
        { l:"This Week",      v:"142", color:"#38BDF8",icon:"📅" },
        { l:"Total Logs",     v:"4.8K",color:"#9CA3AF",icon:"🗄️" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#38BDF8"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search activity logs…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {filtered.map((l,i) => (
        <motion.div key={l.action+i} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"12px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"flex-start" }}>
          <div style={{ width:8,height:8,borderRadius:"50%",background:l.color,flexShrink:0,marginTop:4 }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:900,color:"#fff" }}>{l.action}</div>
            <div style={{ fontSize:9,color:"#38BDF8",marginTop:1 }}>{l.target}</div>
            <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{l.actor} · {l.time}</div>
          </div>
          <span style={{ fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:7,background:`${l.color}18`,color:l.color,flexShrink:0 }}>{l.type}</span>
        </motion.div>
      ))}
      <ACard title="⚡" actions={["Search Logs","View History","Export Logs","Generate Audit Report"]}/>
    </Shell>
  );
}

function AdminToolsCenter({ onBack }) {
  const tasks = [
    { name:"Review 14 Pending Applications",  priority:"High",   due:"Today",    pct:0,  color:"#EF4444" },
    { name:"Verify 8 Identity Documents",     priority:"High",   due:"Today",    pct:30, color:"#EF4444" },
    { name:"Resolve 3 Open Support Cases",    priority:"Medium", due:"Jun 18",   pct:60, color:"#FFC83D" },
    { name:"Generate Weekly Agency Report",   priority:"Medium", due:"Jun 19",   pct:0,  color:"#FFC83D" },
    { name:"Review Host Compliance Audit",    priority:"Low",    due:"Jun 21",   pct:80, color:"#10B981" },
    { name:"Update Agent Performance Records",priority:"Low",    due:"Jun 22",   pct:50, color:"#10B981" },
  ];
  const pc = { High:"#EF4444",Medium:"#FFC83D",Low:"#10B981" };
  return (
    <Shell title="⚙️ Admin Tools Center" subtitle="Daily Tasks & Workflow Management" onBack={onBack}>
      <KGrid items={[
        { l:"Tasks Today",    v:"8",   color:"#EF4444",icon:"📋" },
        { l:"In Progress",    v:"3",   color:"#FFC83D",icon:"⏳" },
        { l:"Completed",      v:"12",  color:"#10B981",icon:"✅" },
        { l:"Work Score",     v:"94%", color:"#38BDF8",icon:"⭐" },
      ]}/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📋 ASSIGNED TASKS</div>
        {tasks.map((t,i) => (
          <div key={t.name} style={{ padding:"10px 0",borderBottom:i<tasks.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <span style={{ fontSize:11,fontWeight:700,color:"#fff",flex:1,paddingRight:8 }}>{t.name}</span>
              <span style={{ fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:7,background:`${pc[t.priority]}18`,color:pc[t.priority],flexShrink:0 }}>{t.priority}</span>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
              <span style={{ fontSize:9,color:"#9CA3AF" }}>Due: {t.due}</span>
              <span style={{ fontSize:9,fontWeight:800,color:t.color }}>{t.pct}%</span>
            </div>
            <div style={{ height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${t.pct}%` }} transition={{ duration:0.7 }}
                style={{ height:"100%",borderRadius:2,background:t.color }}/>
            </div>
          </div>
        ))}
      </div>
      <ACard title="⚡" actions={["View Assigned Tasks","Update Task Status","Manage Work Queue","Configure Notifications","Monitor Workload","Track Productivity"]}/>
    </Shell>
  );
}

/* ─────────────── MODULE REGISTRY ─────────────── */
const MODULE_SCREENS = {
  agencies:    AgencyManagementCenter,
  agents:      AgentManagementCenter,
  hosts:       HostManagementCenter,
  applications:ApplicationManagementCenter,
  verification:VerificationCenter,
  support:     SupportCenter,
  compliance:  ReportsComplianceCenter,
  events:      EventSupportCenter,
  pk:          PKSupportCenter,
  comms:       CommunicationCenter,
  analytics:   ReportingAnalyticsCenter,
  audit:       AuditLogCenter,
  tools:       AdminToolsCenter,
};

const MODULES = [
  { id:"agencies",    icon:"🏢", label:"Agency Management",      subtitle:"Assigned Agencies",      gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.4)" },
  { id:"agents",      icon:"🤝", label:"Talent Agent Mgmt",      subtitle:"Assigned Agents",        gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"hosts",       icon:"🎙️", label:"Host Management",        subtitle:"Assigned Hosts",         gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.4)" },
  { id:"applications",icon:"📋", label:"Applications",           subtitle:"Process & Approve",       gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"verification",icon:"✅", label:"Verification Center",    subtitle:"Documents & Identity",   gradient:"linear-gradient(145deg,#10B981,#0EA5E9)", glow:"rgba(16,185,129,0.35)" },
  { id:"support",     icon:"🎫", label:"Support Center",         subtitle:"Cases & Issues",         gradient:"linear-gradient(145deg,#EF4444,#B91C1C)", glow:"rgba(239,68,68,0.4)" },
  { id:"compliance",  icon:"🚨", label:"Reports & Compliance",   subtitle:"Violations & Policy",    gradient:"linear-gradient(145deg,#EF4444,#A855F7)", glow:"rgba(239,68,68,0.35)" },
  { id:"events",      icon:"🎉", label:"Event Support",          subtitle:"Events & Participants",  gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"pk",          icon:"⚔️", label:"PK Support Center",      subtitle:"Battles & Disputes",     gradient:"linear-gradient(145deg,#EF4444,#FFC83D)", glow:"rgba(239,68,68,0.35)" },
  { id:"comms",       icon:"📢", label:"Communication Center",   subtitle:"Assigned Entities Only", gradient:"linear-gradient(145deg,#0EA5E9,#6366F1)", glow:"rgba(14,165,233,0.35)" },
  { id:"analytics",   icon:"📊", label:"Reporting & Analytics",  subtitle:"Performance Intel",      gradient:"linear-gradient(145deg,#38BDF8,#0EA5E9)", glow:"rgba(56,189,248,0.4)" },
  { id:"audit",       icon:"🗂️", label:"Audit Log Center",       subtitle:"Activity Logs",          gradient:"linear-gradient(145deg,#374151,#0EA5E9)", glow:"rgba(55,65,81,0.4)" },
  { id:"tools",       icon:"⚙️", label:"Admin Tools Center",     subtitle:"Tasks & Workflow",       gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(56,189,248,0.18)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(56,189,248,0.28)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#38BDF8"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>👨‍💼 Admin Dashboard</div>
            <div style={{ fontSize:10,color:"#38BDF8" }}>Agencies · Agents · Hosts · Applications · Compliance · Support</div>
          </div>
          <div style={S.badge}><span style={{ fontSize:10,fontWeight:800,color:"#38BDF8" }}>👨‍💼 ADM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.14),transparent 70%)",pointerEvents:"none" }}/>

        {/* Hero banner */}
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#0EA5E9,#38BDF8,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#38BDF8",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · AGENCY, TALENT AGENT & HOST OPERATIONS SUPPORT · REPORTS TO: SUPER ADMIN</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Admin Operations Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Manage assigned agencies, agents, and hosts — verification, support, compliance, applications, events, and operational reporting.</div>
        </div>

        {/* KPI Grid */}
        <KGrid items={[
          { l:"Assigned Agencies",   v:"12",   color:"#0EA5E9",icon:"🏢" },
          { l:"Active Agencies",     v:"10",   color:"#10B981",icon:"✅" },
          { l:"Suspended Agencies",  v:"1",    color:"#EF4444",icon:"⛔" },
          { l:"Assigned Agents",     v:"18",   color:"#10B981",icon:"🤝" },
          { l:"Active Agents",       v:"15",   color:"#10B981",icon:"✅" },
          { l:"Suspended Agents",    v:"1",    color:"#EF4444",icon:"⛔" },
          { l:"Assigned Hosts",      v:"284",  color:"#A855F7",icon:"🎙️" },
          { l:"Active Hosts",        v:"248",  color:"#10B981",icon:"✅" },
          { l:"Live Hosts",          v:"42",   color:"#EF4444",icon:"🔴" },
          { l:"Pending Applications",v:"14",   color:"#FFC83D",icon:"⏳" },
          { l:"Pending Verifications",v:"8",   color:"#FFC83D",icon:"📄" },
          { l:"Open Support Cases",  v:"8",    color:"#EF4444",icon:"🎫" },
          { l:"Active Reports",      v:"6",    color:"#EF4444",icon:"🚨" },
          { l:"Active PK Battles",   v:"42",   color:"#EF4444",icon:"⚔️" },
          { l:"Active Events",       v:"3",    color:"#A855F7",icon:"🎉" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#38BDF8",marginBottom:12,letterSpacing:"0.08em" }}>
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
                border:"1.5px solid rgba(56,189,248,0.13)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:`linear-gradient(90deg,rgba(56,189,248,0.5),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#0EA5E9"},rgba(56,189,248,0.5))` }}/>
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#38BDF8",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}