/**
 * SupportManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Support Manager
 * Theme: Enterprise Dark Blue & Gold · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  page: { minHeight:"100dvh", background:"linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:90 },
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(31,107,255,0.18)", borderRadius:18, ...x }),
  goldBadge: { padding:"4px 10px", borderRadius:20, background:"rgba(255,200,61,0.12)", border:"1px solid rgba(255,200,61,0.3)" },
  sec: { fontSize:10, fontWeight:800, color:"#60A5FA", letterSpacing:"0.08em", marginBottom:10 },
  kpi: (c) => ({ background:`linear-gradient(145deg,${c}18,${c}08)`, border:`1px solid ${c}30`, borderRadius:14, padding:"12px 8px", textAlign:"center" }),
  btn: (g, glow) => ({ padding:"8px 11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:800, fontSize:10, color:"#fff", background:g, boxShadow:`0 4px 12px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GRADS = ["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#7C3AED,#5B21B6)","linear-gradient(135deg,#0EA5E9,#0369A1)"];
const GLOWS  = ["rgba(31,107,255,0.3)","rgba(16,185,129,0.3)","rgba(245,158,11,0.3)","rgba(239,68,68,0.3)","rgba(124,58,237,0.3)","rgba(14,165,233,0.3)"];

const ticketData  = [{d:"Mon",v:42},{d:"Tue",v:38},{d:"Wed",v:55},{d:"Thu",v:47},{d:"Fri",v:61},{d:"Sat",v:34},{d:"Sun",v:28}];
const resolveData = [{d:"Mon",v:38},{d:"Tue",v:35},{d:"Wed",v:50},{d:"Thu",v:44},{d:"Fri",v:58},{d:"Sat",v:30},{d:"Sun",v:25}];
const satData     = [{d:"Mon",v:88},{d:"Tue",v:91},{d:"Wed",v:86},{d:"Thu",v:93},{d:"Fri",v:90},{d:"Sat",v:94},{d:"Sun",v:92}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Shell({ title, subtitle, onBack, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(31,107,255,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(31,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#60A5FA"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>{subtitle}</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🎧 SM</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#60A5FA" }) => (
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
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#60A5FA" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#60A5FA" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gid})`} strokeWidth={2} dot={{ fill:"#FFC83D",r:2 }}/>
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function PBar({ label, value, max, color }) {
  const pct = typeof max === "number" ? (value / max) * 100 : value;
  return (
    <div style={{ marginBottom:10 }}>
      {label && (
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
          <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{label}</span>
          <span style={{ fontSize:11,fontWeight:900,color }}>{value}{typeof max==="number" ? `/${max}` : "%"}</span>
        </div>
      )}
      <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7 }}
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

function TicketCard({ ticket, actions, statusColors }) {
  const prioColor = { High:"#EF4444",Medium:"#F59E0B",Low:"#60A5FA",Critical:"#A855F7" };
  return (
    <div style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${prioColor[ticket.priority] || "#60A5FA"}` }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
        <div style={{ flex:1,marginRight:8 }}>
          <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{ticket.title}</div>
          <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>{ticket.id} · {ticket.user} · Priority: <span style={{ color:prioColor[ticket.priority],fontWeight:800 }}>{ticket.priority}</span></div>
        </div>
        <SBadge status={ticket.status} colors={statusColors}/>
      </div>
      {ticket.time && <div style={{ fontSize:9,color:"#9CA3AF",marginBottom:8 }}>⏱ {ticket.time}</div>}
      <ARow title="" actions={actions}/>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function SupportOverviewCenter({ onBack }) {
  return (
    <Shell title="📊 Support Overview Center" subtitle="Complete Support Operations" onBack={onBack}>
      <KGrid items={[
        { l:"Open Tickets",   v:"84",  color:"#EF4444",icon:"🎫" },
        { l:"Resolved Today", v:"142", color:"#10B981",icon:"✅" },
        { l:"Avg Response",   v:"4.2m",color:"#60A5FA",icon:"⏱" },
        { l:"CSAT Score",     v:"91%", color:"#FFC83D",icon:"⭐" },
        { l:"Escalated",      v:"12",  color:"#A855F7",icon:"🔺" },
        { l:"Staff Online",   v:"18",  color:"#10B981",icon:"👥" },
      ]}/>
      <Chart label="🎫 TICKETS THIS WEEK" data={ticketData} color="#1F6BFF" gid="so1"/>
      <Chart label="✅ RESOLUTIONS THIS WEEK" data={resolveData} color="#10B981" gid="so2"/>
      <Chart label="⭐ SATISFACTION SCORE" data={satData} color="#FFC83D" gid="so3"/>
      <ARow title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data"]}/>
    </Shell>
  );
}

function TicketManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const tickets = [
    { id:"TKT-4821",title:"Cannot access account",         user:"@Sara_QA",   priority:"High",    status:"Open",       time:"12m ago" },
    { id:"TKT-4819",title:"Gift not received after payment",user:"@Ahmed_QA",  priority:"Critical",status:"Escalated",  time:"28m ago" },
    { id:"TKT-4815",title:"Stream disconnects frequently", user:"@MoonVoice",  priority:"Medium",  status:"In Progress",time:"1h ago" },
    { id:"TKT-4801",title:"Withdrawal delayed 5 days",     user:"@StarQA",     priority:"High",    status:"Pending",    time:"2h ago" },
  ];
  const sc = { Open:"#EF4444",Escalated:"#A855F7","In Progress":"#1F6BFF",Pending:"#F59E0B",Resolved:"#10B981",Closed:"#9CA3AF" };
  const filters = ["All","Open","Escalated","In Progress","Pending","Resolved"];
  const visible = filter === "All" ? tickets : tickets.filter(t => t.status === filter);
  return (
    <Shell title="🎫 Ticket Management Center" subtitle="Manage All Support Tickets" onBack={onBack}>
      <KGrid items={[
        { l:"Open",       v:"84",  color:"#EF4444",icon:"🔴" },
        { l:"In Progress",v:"38",  color:"#1F6BFF",icon:"🔵" },
        { l:"Escalated",  v:"12",  color:"#A855F7",icon:"🔺" },
      ]}/>
      <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:12 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale:0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:filter===f?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:filter===f?"#fff":"#60A5FA" }}>
            {f}
          </motion.button>
        ))}
      </div>
      <ARow title="⚡ CREATE" actions={["Create Ticket"]}/>
      {visible.map((t,i) => (
        <motion.div key={t.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}>
          <TicketCard ticket={t} statusColors={sc} actions={["Assign Ticket","Update Ticket","Escalate Ticket","Close Ticket","Reopen Ticket"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function UserSupportCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const users = [
    { name:"Sara Al-Rashid",id:"USR-4821",issue:"Account locked",       priority:"High",   status:"Open" },
    { name:"Ahmed Mansoor", id:"USR-3841",issue:"Coins not credited",    priority:"Medium", status:"In Progress" },
    { name:"Noor Khalifa",  id:"USR-2918",issue:"False ban complaint",   priority:"High",   status:"Escalated" },
  ];
  const sc = { Open:"#EF4444","In Progress":"#1F6BFF",Escalated:"#A855F7",Resolved:"#10B981" };
  return (
    <Shell title="👤 User Support Center" subtitle="Handle User Support Requests" onBack={onBack}>
      <KGrid items={[
        { l:"User Tickets",  v:"48",  color:"#60A5FA",icon:"👤" },
        { l:"Resolved",      v:"284", color:"#10B981",icon:"✅" },
        { l:"Avg Resolution",v:"18m", color:"#FFC83D",icon:"⏱" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#60A5FA"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())).map((u,i) => (
        <motion.div key={u.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{u.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{u.id} · {u.issue}</div>
            </div>
            <SBadge status={u.status} colors={sc}/>
          </div>
          <ARow title="" actions={["View User Profile","Review History","Send Response","Resolve Complaint","Recover Account"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function HostSupportCenter({ onBack }) {
  const cases = [
    { name:"@SaraLive",  id:"HST-4821",issue:"Revenue discrepancy",    priority:"High",   status:"Open" },
    { name:"@MoonVoice", id:"HST-3812",issue:"Stream technical issue",  priority:"Medium", status:"In Progress" },
    { name:"@StarQA",    id:"HST-2948",issue:"Account suspension appeal",priority:"High",  status:"Escalated" },
  ];
  const sc = { Open:"#EF4444","In Progress":"#1F6BFF",Escalated:"#A855F7",Resolved:"#10B981" };
  return (
    <Shell title="🎙️ Host Support Center" subtitle="Support Services for Hosts" onBack={onBack}>
      <KGrid items={[
        { l:"Host Tickets",  v:"22",  color:"#A78BFA",icon:"🎙️" },
        { l:"Revenue Issues",v:"8",   color:"#FFC83D",icon:"💰" },
        { l:"Technical",     v:"6",   color:"#60A5FA",icon:"⚙️" },
      ]}/>
      {cases.map((c,i) => (
        <motion.div key={c.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🎙️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{c.id} · {c.issue}</div>
            </div>
            <SBadge status={c.status} colors={sc}/>
          </div>
          <ARow title="" actions={["View Host Profile","Resolve Host Issue","Review Revenue Issue","Escalate Case","Recover Account"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgentSupportCenter({ onBack }) {
  const reqs = [
    { name:"Ali Hassan",  id:"AGT-1842",issue:"Commission dispute",     priority:"Medium",status:"Open" },
    { name:"Fatima Al-Q", id:"AGT-0921",issue:"Host management issue",  priority:"Low",   status:"Resolved" },
  ];
  const sc = { Open:"#EF4444",Resolved:"#10B981","In Progress":"#1F6BFF" };
  return (
    <Shell title="🤝 Agent Support Center" subtitle="Support for Talent Agents" onBack={onBack}>
      <KGrid items={[
        { l:"Agent Tickets",v:"8",  color:"#60A5FA",icon:"🤝" },
        { l:"Resolved",     v:"42", color:"#10B981",icon:"✅" },
        { l:"Pending",      v:"3",  color:"#F59E0B",icon:"⏳" },
      ]}/>
      {reqs.map((r,i) => (
        <motion.div key={r.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🤝</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{r.id} · {r.issue}</div>
            </div>
            <SBadge status={r.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Review Request","Resolve Issue","Escalate Case","Agent Guidance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgencySupportCenter({ onBack }) {
  const cases = [
    { name:"StarPro QA",  id:"AGC-041",issue:"Host payment dispute",   priority:"High",  status:"Open" },
    { name:"EliteQA",     id:"AGC-028",issue:"Contract clarification",  priority:"Low",   status:"Resolved" },
  ];
  const sc = { Open:"#EF4444",Resolved:"#10B981",Escalated:"#A855F7" };
  return (
    <Shell title="🏢 Agency Support Center" subtitle="Agency Support & Complaints" onBack={onBack}>
      <KGrid items={[
        { l:"Agency Tickets",v:"5",  color:"#FFC83D",icon:"🏢" },
        { l:"Resolved",      v:"28", color:"#10B981",icon:"✅" },
        { l:"Escalated",     v:"1",  color:"#A855F7",icon:"🔺" },
      ]}/>
      {cases.map((c,i) => (
        <motion.div key={c.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🏢</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{c.id} · {c.issue}</div>
            </div>
            <SBadge status={c.status} colors={sc}/>
          </div>
          <ARow title="" actions={["View Agency","Resolve Complaint","Review Reports","Escalate Issue"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function VIPSupportCenter({ onBack }) {
  const vips = [
    { name:"@DiamondQA",tier:"VIP 5",issue:"Gift animation not showing",priority:"Critical",status:"Open",  spent:"8.4M coins" },
    { name:"@GoldRose",  tier:"VIP 4",issue:"VIP badge not displaying",  priority:"High",    status:"In Progress",spent:"3.2M coins" },
  ];
  const sc = { Open:"#EF4444","In Progress":"#1F6BFF",Escalated:"#A855F7",Resolved:"#10B981" };
  const tierColors = { "VIP 5":"#FFC83D","VIP 4":"#A78BFA","VIP 3":"#60A5FA" };
  return (
    <Shell title="💎 VIP Support Center" subtitle="Premium Support for VIP Users" onBack={onBack}>
      <KGrid items={[
        { l:"VIP Tickets",   v:"4",   color:"#FFC83D",icon:"💎" },
        { l:"Resolved",      v:"18",  color:"#10B981",icon:"✅" },
        { l:"Avg Response",  v:"< 5m",color:"#60A5FA",icon:"⚡" },
      ]}/>
      <div style={{ background:"rgba(255,200,61,0.08)",border:"1px solid rgba(255,200,61,0.25)",borderRadius:14,padding:"11px 14px",marginBottom:14 }}>
        <div style={{ fontSize:10,fontWeight:900,color:"#FFC83D" }}>⭐ VIP PRIORITY — Response within 5 minutes guaranteed</div>
      </div>
      {vips.map((v,i) => (
        <motion.div key={v.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,border:"1.5px solid rgba(255,200,61,0.25)" }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>💎</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{v.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{v.issue} · {v.spent}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10,fontWeight:900,color:tierColors[v.tier] || "#FFC83D",marginBottom:3 }}>{v.tier}</div>
              <SBadge status={v.status} colors={sc}/>
            </div>
          </div>
          <ARow title="" actions={["View VIP Profile","Priority Resolution","VIP Assistance","Escalate VIP Case"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AccountRecoveryCenter({ onBack }) {
  const cases = [
    { name:"Sara Al-Rashid",id:"USR-4821",reason:"Forgot password + email lost",  verified:false,step:"Identity Verification" },
    { name:"Ahmed Mansoor", id:"USR-3841",reason:"Account hacked",                verified:true, step:"Password Reset" },
    { name:"Noor Khalifa",  id:"USR-2918",reason:"Deactivated by mistake",        verified:true, step:"Restore Access" },
  ];
  return (
    <Shell title="🔐 Account Recovery Center" subtitle="Account Recovery & Access Restoration" onBack={onBack}>
      <KGrid items={[
        { l:"Recovery Cases",v:"12",  color:"#1F6BFF",icon:"🔐" },
        { l:"Verified",      v:"8",   color:"#10B981",icon:"✅" },
        { l:"Pending Verify",v:"4",   color:"#F59E0B",icon:"⏳" },
      ]}/>
      {cases.map((c,i) => (
        <motion.div key={c.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(31,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🔐</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{c.id} · {c.reason}</div>
            </div>
            <div style={{ padding:"2px 7px",borderRadius:7,background:c.verified?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",border:`1px solid ${c.verified?"rgba(16,185,129,0.3)":"rgba(245,158,11,0.3)"}` }}>
              <span style={{ fontSize:9,fontWeight:800,color:c.verified?"#10B981":"#F59E0B" }}>{c.verified?"Verified":"Unverified"}</span>
            </div>
          </div>
          <div style={{ fontSize:9,color:"#9CA3AF",marginBottom:10 }}>Current Step: <span style={{ color:"#60A5FA",fontWeight:700 }}>{c.step}</span></div>
          <ARow title="" actions={["Verify Identity","Recover Account","Reset Password","Restore Access"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AppealsManagementCenter({ onBack }) {
  const appeals = [
    { id:"APL-0482",type:"Account Ban Appeal",    user:"@StarQA",   submitted:"Jun 14",priority:"High",   status:"Pending" },
    { id:"APL-0421",type:"Content Removal Appeal",user:"@MoonVoice",submitted:"Jun 12",priority:"Medium", status:"Under Review" },
    { id:"APL-0388",type:"Revenue Dispute Appeal",user:"@NoorQA",   submitted:"Jun 10",priority:"High",   status:"Approved" },
    { id:"APL-0312",type:"Suspension Appeal",     user:"@Ahmed_QA", submitted:"Jun 8", priority:"Medium", status:"Rejected" },
  ];
  const sc = { Pending:"#F59E0B","Under Review":"#1F6BFF",Approved:"#10B981",Rejected:"#EF4444" };
  return (
    <Shell title="⚖️ Appeals Management Center" subtitle="Review & Process Appeals" onBack={onBack}>
      <KGrid items={[
        { l:"Pending",     v:"8",  color:"#F59E0B",icon:"⏳" },
        { l:"Under Review",v:"4",  color:"#1F6BFF",icon:"🔍" },
        { l:"Resolved",    v:"84", color:"#10B981",icon:"✅" },
      ]}/>
      {appeals.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.type}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{a.id} · {a.user} · Submitted: {a.submitted}</div>
            </div>
            <SBadge status={a.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Review Appeal","Approve Appeal","Reject Appeal","Request Information"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function FraudReportCenter({ onBack }) {
  const cases = [
    { id:"FRD-0182",type:"Fake Gift Transaction",   reporter:"@User_4821",target:"@SuspectQA", risk:"High",   status:"Investigating" },
    { id:"FRD-0174",type:"Coin Farming Bot",        reporter:"@User_2841",target:"@BotUser1",  risk:"Critical",status:"Investigating" },
    { id:"FRD-0158",type:"Identity Impersonation",  reporter:"@User_1924",target:"@FakeHost",  risk:"High",   status:"Escalated" },
    { id:"FRD-0142",type:"Payment Fraud Attempt",   reporter:"@User_0921",target:"@TrollQA",   risk:"Medium", status:"Resolved" },
  ];
  const sc = { Investigating:"#1F6BFF",Escalated:"#A855F7",Resolved:"#10B981","Under Review":"#F59E0B" };
  const rc = { Critical:"#EF4444",High:"#F97316",Medium:"#F59E0B",Low:"#60A5FA" };
  return (
    <Shell title="🚨 Fraud Report Center" subtitle="Fraud Investigations & Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Active Cases",  v:"8",  color:"#EF4444",icon:"🚨" },
        { l:"Critical",      v:"2",  color:"#A855F7",icon:"🔴" },
        { l:"Resolved",      v:"142",color:"#10B981",icon:"✅" },
      ]}/>
      {cases.map((c,i) => (
        <motion.div key={c.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${rc[c.risk]}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.type}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{c.id} · Reporter: {c.reporter} → Target: {c.target}</div>
              <div style={{ fontSize:9,color:rc[c.risk],fontWeight:800,marginTop:2 }}>Risk: {c.risk}</div>
            </div>
            <SBadge status={c.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Review Case","Investigate Activity","Escalate Case","Submit Findings"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PaymentSupportCenter({ onBack }) {
  const transactions = [
    { id:"TXN-8421",user:"@Sara_QA",  amount:"500 Coins",type:"Purchase",    issue:"Payment deducted, coins not credited",status:"Open",    date:"Jun 17" },
    { id:"TXN-8384",user:"@Ahmed_QA", amount:"$12.99",   type:"VIP Renewal", issue:"VIP not activated after payment",     status:"In Progress",date:"Jun 16" },
    { id:"TXN-8312",user:"@MoonVoice",amount:"1000 Coins",type:"Gift",       issue:"Gift sent but not received",          status:"Resolved", date:"Jun 15" },
  ];
  const sc = { Open:"#EF4444","In Progress":"#1F6BFF",Resolved:"#10B981",Escalated:"#A855F7" };
  return (
    <Shell title="💳 Payment Support Center" subtitle="Payment-Related Support" onBack={onBack}>
      <KGrid items={[
        { l:"Payment Issues",v:"14",  color:"#EC4899",icon:"💳" },
        { l:"Resolved",      v:"128", color:"#10B981",icon:"✅" },
        { l:"Pending",       v:"6",   color:"#F59E0B",icon:"⏳" },
      ]}/>
      {transactions.map((t,i) => (
        <motion.div key={t.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.issue}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{t.id} · {t.user} · {t.amount} · {t.type}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:2 }}>{t.date}</div>
            </div>
            <SBadge status={t.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Review Transaction","Verify Payment","Resolve Issue","Escalate Finance Case"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function WithdrawalSupportCenter({ onBack }) {
  const withdrawals = [
    { id:"WDR-1842",user:"@SaraLive", amount:"$284",method:"Bank Transfer",issue:"Delayed 7 days",  status:"Open",    days:7 },
    { id:"WDR-1821",user:"@StarQA",   amount:"$142",method:"PayPal",       issue:"Wrong account",    status:"Escalated",days:3 },
    { id:"WDR-1798",user:"@NoorQA",   amount:"$96", method:"Wise",         issue:"Status not updated",status:"In Progress",days:2 },
  ];
  const sc = { Open:"#EF4444",Escalated:"#A855F7","In Progress":"#1F6BFF",Resolved:"#10B981" };
  return (
    <Shell title="🏦 Withdrawal Support Center" subtitle="Withdrawal Complaints & Requests" onBack={onBack}>
      <KGrid items={[
        { l:"Withdrawal Issues",v:"8",  color:"#10B981",icon:"🏦" },
        { l:"Escalated",        v:"2",  color:"#A855F7",icon:"🔺" },
        { l:"Avg Resolution",   v:"24h",color:"#60A5FA",icon:"⏱" },
      ]}/>
      {withdrawals.map((w,i) => (
        <motion.div key={w.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{w.issue}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{w.id} · {w.user} · {w.amount} via {w.method}</div>
              <div style={{ fontSize:9,color:"#EF4444",fontWeight:700,marginTop:2 }}>Delayed {w.days} days</div>
            </div>
            <SBadge status={w.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Verify Withdrawal","Review Status","Resolve Complaint","Escalate Finance Issue"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function LiveStreamSupportCenter({ onBack }) {
  const issues = [
    { id:"LSS-0842",host:"@SaraLive", issue:"Audio dropout every 5 min",  severity:"High",  status:"Active",    viewers:"4.2K" },
    { id:"LSS-0821",host:"@MoonVoice",issue:"Chat messages delayed 30s",   severity:"Medium",status:"Monitoring",viewers:"2.8K" },
    { id:"LSS-0798",host:"@StarQA",   issue:"Gift animations not showing", severity:"Low",   status:"Resolved",  viewers:"1.1K" },
  ];
  const sc = { Active:"#EF4444",Monitoring:"#F59E0B",Resolved:"#10B981","In Progress":"#1F6BFF" };
  const sevc = { High:"#EF4444",Medium:"#F59E0B",Low:"#60A5FA" };
  return (
    <Shell title="📡 Live Stream Support" subtitle="Live Streaming Issue Support" onBack={onBack}>
      <KGrid items={[
        { l:"Active Issues",v:"4",   color:"#EF4444",icon:"📡" },
        { l:"Monitoring",   v:"2",   color:"#F59E0B",icon:"👁️" },
        { l:"Resolved Today",v:"18", color:"#10B981",icon:"✅" },
      ]}/>
      {issues.map((is,i) => (
        <motion.div key={is.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${sevc[is.severity]}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{is.issue}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{is.id} · {is.host} · {is.viewers} viewers</div>
              <div style={{ fontSize:9,color:sevc[is.severity],fontWeight:800,marginTop:2 }}>Severity: {is.severity}</div>
            </div>
            <SBadge status={is.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Monitor Live Issue","Technical Assistance","Resolve Stream Issue","Escalate Technical Case"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function TechnicalSupportCenter({ onBack }) {
  const bugs = [
    { id:"BUG-1842",title:"Gift panel freezes on iOS 17",        severity:"High",   assigned:"Dev Team A",status:"In Progress" },
    { id:"BUG-1821",title:"Notifications not delivered on Android",severity:"Medium",assigned:"Dev Team B",status:"Open" },
    { id:"BUG-1798",title:"Chat messages out of order",           severity:"Low",    assigned:"Unassigned",status:"Open" },
    { id:"BUG-1764",title:"VIP badge not rendering",              severity:"Medium", assigned:"Dev Team A",status:"Resolved" },
  ];
  const sc = { Open:"#EF4444","In Progress":"#1F6BFF",Resolved:"#10B981",Closed:"#9CA3AF" };
  const sevc = { High:"#EF4444",Medium:"#F59E0B",Low:"#60A5FA",Critical:"#A855F7" };
  return (
    <Shell title="⚙️ Technical Support Center" subtitle="Platform Bugs & Technical Issues" onBack={onBack}>
      <KGrid items={[
        { l:"Open Bugs",     v:"8",  color:"#EF4444",icon:"🐛" },
        { l:"In Progress",   v:"5",  color:"#1F6BFF",icon:"⚙️" },
        { l:"Resolved Today",v:"12", color:"#10B981",icon:"✅" },
      ]}/>
      <Chart label="🐛 BUGS THIS WEEK" data={ticketData} color="#EF4444" gid="ts1" type="bar"/>
      {bugs.map((b,i) => (
        <motion.div key={b.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${sevc[b.severity]}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{b.title}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{b.id} · Assigned: {b.assigned}</div>
              <div style={{ fontSize:9,color:sevc[b.severity],fontWeight:800,marginTop:2 }}>Severity: {b.severity}</div>
            </div>
            <SBadge status={b.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Review Bug Report","Assign Developer","Track Resolution","Verify Fix"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function KnowledgeBaseCenter({ onBack }) {
  const articles = [
    { title:"How to Recover Your Account",     category:"Account",  views:"12.4K",status:"Published",icon:"🔐" },
    { title:"Gift System Complete Guide",       category:"Gifts",    views:"8.8K", status:"Published",icon:"🎁" },
    { title:"Withdrawal Process & Timeline",   category:"Finance",  views:"6.2K", status:"Published",icon:"🏦" },
    { title:"Live Streaming Troubleshooting",  category:"Technical",views:"4.1K", status:"Draft",    icon:"📡" },
    { title:"VIP Benefits & Privileges",       category:"VIP",      views:"9.4K", status:"Published",icon:"💎" },
  ];
  const sc = { Published:"#10B981",Draft:"#F59E0B",Archived:"#9CA3AF" };
  const cc = { Account:"#1F6BFF",Gifts:"#EC4899",Finance:"#FFC83D",Technical:"#EF4444",VIP:"#A78BFA" };
  return (
    <Shell title="📚 Knowledge Base Center" subtitle="Help Articles & Support Guides" onBack={onBack}>
      <KGrid items={[
        { l:"Total Articles",v:"84",   color:"#60A5FA",icon:"📚" },
        { l:"Published",     v:"72",   color:"#10B981",icon:"✅" },
        { l:"Total Views",   v:"84K",  color:"#FFC83D",icon:"👁️" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Article"]}/>
      {articles.map((a,i) => (
        <motion.div key={a.title} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${cc[a.category] || "#60A5FA"}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{a.title}</div>
            <div style={{ display:"flex",gap:6,marginTop:4,alignItems:"center" }}>
              <span style={{ fontSize:9,padding:"2px 6px",borderRadius:6,background:`${cc[a.category] || "#60A5FA"}18`,color:cc[a.category] || "#60A5FA",fontWeight:700 }}>{a.category}</span>
              <span style={{ fontSize:9,color:"#9CA3AF" }}>👁 {a.views}</span>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end" }}>
            <SBadge status={a.status} colors={sc}/>
            <div style={{ display:"flex",gap:4 }}>
              {["✏️","📤","🗄️"].map((ic,ii) => (
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

function CommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Users");
  const [type, setType] = useState("In-App Message");
  return (
    <Shell title="📨 Communication Center" subtitle="Support Communications" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>👥 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Users","All Hosts","VIP Users","Support Staff","Affected Users"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 MESSAGE TYPE</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["In-App Message","Push Notification","Email","SMS"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setType(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:type===t?"linear-gradient(135deg,#F59E0B,#D97706)":"rgba(255,255,255,0.06)",color:type===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Write your message…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(31,107,255,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#1F6BFF,#7C3AED)",boxShadow:"0 6px 20px rgba(31,107,255,0.35)" }}>
          📨 Send Message
        </motion.button>
      </div>
      <ARow title="⚡ MORE" actions={["Create Announcement","Notify Users","Broadcast Information"]}/>
    </Shell>
  );
}

function ReportManagementCenter({ onBack }) {
  const reports = [
    { name:"Daily Support Report",       date:"Jun 17",status:"Ready",   size:"480 KB" },
    { name:"Ticket Resolution Report",   date:"Jun 16",status:"Ready",   size:"820 KB" },
    { name:"VIP Support Report",         date:"Jun 15",status:"Ready",   size:"340 KB" },
    { name:"Staff Performance Report",   date:"Jun 14",status:"Archived",size:"1.1 MB" },
    { name:"Fraud Investigation Report", date:"Jun 12",status:"Ready",   size:"620 KB" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📑 Report Management" subtitle="Generate & Manage Support Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports",v:"48", color:"#60A5FA",icon:"📑" },
        { l:"This Month",   v:"12", color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",    v:"4",  color:"#10B981",icon:"⏰" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Generate Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📑</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{r.name}</div>
            <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>{r.date} · {r.size}</div>
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

function StaffManagementCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior Support Agent",tickets:24,resolved:21,score:88,status:"Online" },
    { name:"Khalid Omar",     role:"Support Agent",        tickets:18,resolved:15,score:83,status:"Online" },
    { name:"Fatima Hassan",   role:"VIP Support Specialist",tickets:8,resolved:8, score:100,status:"Busy" },
    { name:"Ahmad Nasser",    role:"Technical Support",    tickets:12,resolved:9, score:75,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#F59E0B",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 Staff Management Center" subtitle="Support Team Management" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff",  v:"24",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",   v:"18",  color:"#10B981",icon:"🟢" },
        { l:"Avg Score",    v:"86%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Add Staff"]}/>
      {staff.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{s.role} · {s.tickets} tickets · {s.resolved} resolved</div>
            </div>
            <SBadge status={s.status} colors={sc}/>
          </div>
          <PBar label="Performance Score" value={s.score} max={100} color="#1F6BFF"/>
          <ARow title="" actions={["Assign Tickets","Monitor Performance","Manage Shifts"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AnalyticsCenter({ onBack }) {
  return (
    <Shell title="📈 Analytics Center" subtitle="Support Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"CSAT Score",     v:"91%",  color:"#FFC83D",icon:"⭐" },
        { l:"Avg Response",   v:"4.2m", color:"#60A5FA",icon:"⏱" },
        { l:"Resolution Rate",v:"94%",  color:"#10B981",icon:"✅" },
      ]}/>
      <Chart label="🎫 TICKETS THIS WEEK" data={ticketData} color="#1F6BFF" gid="ana1"/>
      <Chart label="✅ RESOLUTIONS THIS WEEK" data={resolveData} color="#10B981" gid="ana2"/>
      <Chart label="⭐ SATISFACTION SCORE" data={satData} color="#FFC83D" gid="ana3"/>
      <ARow title="⚡" actions={["View Analytics","Compare Performance","Export Analytics","Generate Insights"]}/>
    </Shell>
  );
}

function SMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Priority Escalation",              icon:"🔺",desc:"Instantly escalate to highest priority",  color:"#EF4444" },
    { name:"Emergency Resolution",             icon:"🚨",desc:"Emergency fast-track resolution protocol",color:"#F97316" },
    { name:"Service Optimization",             icon:"⚡",desc:"Optimize support workflows and processes", color:"#1F6BFF" },
    { name:"Customer Satisfaction Monitoring", icon:"⭐",desc:"Real-time CSAT monitoring and alerts",     color:"#FFC83D" },
    { name:"Support Strategy Planning",        icon:"🧠",desc:"Plan and optimize support strategies",     color:"#A78BFA" },
  ];
  return (
    <Shell title="🚀 SM Exclusive Tools" subtitle="Support Manager Exclusive Tools" onBack={onBack}>
      <div style={{ background:"rgba(31,107,255,0.08)",border:"1px solid rgba(31,107,255,0.25)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#60A5FA",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — SUPPORT MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools are exclusively for Support Managers. All activations are logged and audited.</div>
      </div>
      {tools.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${t.color}` }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{t.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.name}</div>
              <div style={{ fontSize:10,color:"#60A5FA" }}>{t.desc}</div>
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
  overview:    SupportOverviewCenter,
  tickets:     TicketManagementCenter,
  users:       UserSupportCenter,
  hosts:       HostSupportCenter,
  agents:      AgentSupportCenter,
  agencies:    AgencySupportCenter,
  vip:         VIPSupportCenter,
  recovery:    AccountRecoveryCenter,
  appeals:     AppealsManagementCenter,
  fraud:       FraudReportCenter,
  payments:    PaymentSupportCenter,
  withdrawals: WithdrawalSupportCenter,
  livestream:  LiveStreamSupportCenter,
  technical:   TechnicalSupportCenter,
  knowledge:   KnowledgeBaseCenter,
  comms:       CommunicationCenter,
  reports:     ReportManagementCenter,
  staff:       StaffManagementCenter,
  analytics:   AnalyticsCenter,
  exclusive:   SMExclusiveTools,
};

const MODULES = [
  { id:"overview",    icon:"📊", label:"Support Overview",     subtitle:"Operations Summary",    gradient:"linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow:"rgba(31,107,255,0.4)" },
  { id:"tickets",     icon:"🎫", label:"Ticket Management",    subtitle:"All Support Tickets",   gradient:"linear-gradient(145deg,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.4)" },
  { id:"users",       icon:"👤", label:"User Support",         subtitle:"User Assistance",       gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"hosts",       icon:"🎙️", label:"Host Support",         subtitle:"Host Assistance",       gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"agents",      icon:"🤝", label:"Agent Support",        subtitle:"Agent Assistance",      gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"agencies",    icon:"🏢", label:"Agency Support",       subtitle:"Agency Assistance",     gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"vip",         icon:"💎", label:"VIP Support",          subtitle:"Premium Concierge",     gradient:"linear-gradient(145deg,#FFC83D,#EC4899)", glow:"rgba(255,200,61,0.45)" },
  { id:"recovery",    icon:"🔐", label:"Account Recovery",     subtitle:"Access Restoration",    gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.35)" },
  { id:"appeals",     icon:"⚖️", label:"Appeals Center",       subtitle:"Review Appeals",        gradient:"linear-gradient(145deg,#7C3AED,#4C1D95)", glow:"rgba(124,58,237,0.35)" },
  { id:"fraud",       icon:"🚨", label:"Fraud Reports",        subtitle:"Fraud Investigations",  gradient:"linear-gradient(145deg,#EF4444,#A855F7)", glow:"rgba(239,68,68,0.4)" },
  { id:"payments",    icon:"💳", label:"Payment Support",      subtitle:"Payment Issues",        gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"withdrawals", icon:"🏦", label:"Withdrawal Support",   subtitle:"Withdrawal Issues",     gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.35)" },
  { id:"livestream",  icon:"📡", label:"Live Stream Support",  subtitle:"Stream Assistance",     gradient:"linear-gradient(145deg,#F97316,#C2410C)", glow:"rgba(249,115,22,0.35)" },
  { id:"technical",   icon:"⚙️", label:"Technical Support",    subtitle:"Bugs & Tech Issues",    gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"knowledge",   icon:"📚", label:"Knowledge Base",       subtitle:"Help Articles",         gradient:"linear-gradient(145deg,#06B6D4,#0E7490)", glow:"rgba(6,182,212,0.35)" },
  { id:"comms",       icon:"📨", label:"Communication",        subtitle:"Message & Notify",      gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"reports",     icon:"📑", label:"Report Management",    subtitle:"Generate Reports",      gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"staff",       icon:"👥", label:"Staff Management",     subtitle:"Support Team",          gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"analytics",   icon:"📈", label:"Analytics Center",     subtitle:"Service Analytics",     gradient:"linear-gradient(145deg,#FFC83D,#F59E0B)", glow:"rgba(255,200,61,0.4)" },
  { id:"exclusive",   icon:"🚀", label:"SM Exclusive Tools",   subtitle:"Priority Commands",     gradient:"linear-gradient(145deg,#FFC83D,#EF4444)", glow:"rgba(255,200,61,0.5)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function SupportManagerDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(31,107,255,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(31,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#60A5FA"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🎧 Support Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>Tickets · Appeals · Fraud · Recovery · Analytics</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🎧 SM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(31,107,255,0.18),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#1F6BFF,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · CUSTOMER SUPPORT & SERVICE OPERATIONS · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Support Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central support hub — tickets, user assistance, fraud investigations, appeals, account recovery, and team management.</div>
        </div>

        <KGrid items={[
          { l:"Open Tickets",   v:"84",  color:"#EF4444",icon:"🎫" },
          { l:"Pending",        v:"38",  color:"#F59E0B",icon:"⏳" },
          { l:"Resolved",       v:"142", color:"#10B981",icon:"✅" },
          { l:"Escalated",      v:"12",  color:"#A855F7",icon:"🔺" },
          { l:"VIP Requests",   v:"4",   color:"#FFC83D",icon:"💎" },
          { l:"Avg Response",   v:"4.2m",color:"#60A5FA",icon:"⏱" },
          { l:"CSAT Score",     v:"91%", color:"#FFC83D",icon:"⭐" },
          { l:"Fraud Reports",  v:"8",   color:"#EF4444",icon:"🚨" },
          { l:"Appeals",        v:"12",  color:"#7C3AED",icon:"⚖️" },
          { l:"Tech Issues",    v:"8",   color:"#F97316",icon:"⚙️" },
          { l:"Staff Online",   v:"18",  color:"#10B981",icon:"👥" },
          { l:"Critical Cases", v:"3",   color:"#EF4444",icon:"🔴" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} SUPPORT MODULES · TAP TO ACCESS
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {MODULES.map((mod,i) => (
            <motion.div key={mod.id}
              initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.025,duration:0.2 }}
              whileTap={{ scale:0.91 }} onClick={() => setActiveModule(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{
                borderRadius:18,overflow:"hidden",
                background:mod.featured?"rgba(255,200,61,0.07)":"rgba(255,255,255,0.04)",
                border:mod.featured?"1.5px solid rgba(255,200,61,0.3)":"1.5px solid rgba(31,107,255,0.14)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:mod.featured?"linear-gradient(90deg,#FFC83D,#EF4444,#FFC83D)":`linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#1F6BFF"},rgba(255,200,61,0.4))` }}/>
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#60A5FA",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
                {mod.featured && <div style={{ position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#FFC83D",boxShadow:"0 0 7px rgba(255,200,61,0.8)"}}/>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}