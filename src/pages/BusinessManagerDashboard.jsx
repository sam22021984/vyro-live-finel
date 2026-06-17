/**
 * BusinessManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Business Manager
 * Theme: Enterprise Dark Blue & Gold · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
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
const GLOWS = ["rgba(31,107,255,0.3)","rgba(16,185,129,0.3)","rgba(245,158,11,0.3)","rgba(239,68,68,0.3)","rgba(124,58,237,0.3)","rgba(14,165,233,0.3)"];

const revData  = [{d:"Jan",v:38},{d:"Feb",v:44},{d:"Mar",v:52},{d:"Apr",v:61},{d:"May",v:74},{d:"Jun",v:88}];
const growData = [{d:"Jan",v:14},{d:"Feb",v:22},{d:"Mar",v:28},{d:"Apr",v:36},{d:"May",v:44},{d:"Jun",v:51}];
const perfData = [{d:"Jan",v:72},{d:"Feb",v:76},{d:"Mar",v:81},{d:"Apr",v:84},{d:"May",v:88},{d:"Jun",v:92}];

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
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🏢 BM</span></div>
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

function StatusBadge({ status, colors }) {
  const c = colors[status] || "#9CA3AF";
  return (
    <div style={{ padding:"2px 8px",borderRadius:8,background:`${c}18`,border:`1px solid ${c}30`,flexShrink:0,alignSelf:"flex-start" }}>
      <span style={{ fontSize:9,fontWeight:800,color:c }}>{status}</span>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function BusinessOverviewCenter({ onBack }) {
  return (
    <Shell title="📊 Business Overview Center" subtitle="Complete Operations Overview" onBack={onBack}>
      <KGrid items={[
        { l:"Active Hosts",    v:"7.4K",  color:"#A78BFA",icon:"🎙️" },
        { l:"Active Agents",   v:"142",   color:"#60A5FA",icon:"🤝" },
        { l:"Active Agencies", v:"18",    color:"#FFC83D",icon:"🏢" },
        { l:"Daily Revenue",   v:"$4.8K", color:"#FFC83D",icon:"💰" },
        { l:"Monthly Revenue", v:"$88K",  color:"#10B981",icon:"📈" },
        { l:"Growth Rate",     v:"+22%",  color:"#10B981",icon:"🚀" },
      ]}/>
      <Chart label="📈 REVENUE TREND" data={revData} color="#FFC83D" gid="bov1"/>
      <Chart label="📊 PERFORMANCE SCORE" data={perfData} color="#10B981" gid="bov2"/>
      <ARow title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data"]}/>
    </Shell>
  );
}

function TeamManagementCenter({ onBack }) {
  const members = [
    { name:"Ali Hassan",      role:"Senior Agent",   region:"Saudi Arabia", status:"Active",   perf:92 },
    { name:"Sara Al-Rashid",  role:"Host Manager",   region:"Qatar",        status:"Active",   perf:88 },
    { name:"Omar Al-Farsi",   role:"BD Coordinator", region:"UAE",          status:"On Leave", perf:74 },
  ];
  const sc = { Active:"#10B981","On Leave":"#F59E0B",Inactive:"#EF4444" };
  return (
    <Shell title="👥 Team Management Center" subtitle="Manage Business Teams" onBack={onBack}>
      <KGrid items={[
        { l:"Team Size",       v:"24",  color:"#60A5FA",icon:"👥" },
        { l:"Active",          v:"21",  color:"#10B981",icon:"✅" },
        { l:"Avg Performance", v:"88%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Add Team Member"]}/>
      {members.map((m,i) => (
        <motion.div key={m.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{m.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{m.role} · {m.region}</div>
            </div>
            <StatusBadge status={m.status} colors={sc}/>
          </div>
          <PBar label="Performance" value={m.perf} max={100} color="#1F6BFF"/>
          <ARow title="" actions={["Assign Task","Monitor Performance","Approve Requests","Remove Member"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function HostPerformanceCenter({ onBack }) {
  const hosts = [
    { name:"@SaraLive",  id:"HST-4821",viewers:"4.2K",rev:"$1.2K",score:94,status:"Top Host" },
    { name:"@MoonVoice", id:"HST-3812",viewers:"2.8K",rev:"$840", score:82,status:"Active" },
    { name:"@StarQA",    id:"HST-2948",viewers:"1.1K",rev:"$320", score:61,status:"Warning" },
  ];
  const sc = { "Top Host":"#FFC83D",Active:"#10B981",Warning:"#EF4444" };
  return (
    <Shell title="🎙️ Host Performance Center" subtitle="Monitor Host Productivity" onBack={onBack}>
      <KGrid items={[
        { l:"Total Hosts",   v:"7.4K", color:"#A78BFA",icon:"🎙️" },
        { l:"Top Performers",v:"284",  color:"#FFC83D",icon:"🏆" },
        { l:"Need Attention",v:"41",   color:"#EF4444",icon:"⚠️" },
      ]}/>
      <Chart label="🎙️ HOST PERFORMANCE TREND" data={perfData} color="#A78BFA" gid="hp1"/>
      {hosts.map((h,i) => (
        <motion.div key={h.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🎙️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{h.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{h.id} · {h.viewers} viewers</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D",marginBottom:3 }}>{h.rev}</div>
              <StatusBadge status={h.status} colors={sc}/>
            </div>
          </div>
          <PBar label="Performance Score" value={h.score} max={100} color="#A78BFA"/>
          <ARow title="" actions={["View Host Profile","Performance Review","Issue Warning","Reward Host","Send Recommendation"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgentManagementCenter({ onBack }) {
  const agents = [
    { name:"Ali Hassan",  id:"AGT-1842",hosts:12,rev:"$3.2K",target:15 },
    { name:"Fatima Al-Q", id:"AGT-0921",hosts:8, rev:"$1.8K",target:12 },
    { name:"Khalid Omar", id:"AGT-0412",hosts:18,rev:"$4.8K",target:16 },
  ];
  return (
    <Shell title="🤝 Agent Management Center" subtitle="Manage Talent Agents" onBack={onBack}>
      <KGrid items={[
        { l:"Total Agents", v:"142", color:"#60A5FA",icon:"🤝" },
        { l:"On Target",    v:"98",  color:"#10B981",icon:"✅" },
        { l:"Below Target", v:"44",  color:"#EF4444",icon:"⚠️" },
      ]}/>
      {agents.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🤝</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{a.id} · {a.hosts}/{a.target} hosts</div>
            </div>
            <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{a.rev}</div>
          </div>
          <PBar label="Target Completion" value={Math.min(a.hosts, a.target)} max={a.target} color={a.hosts >= a.target ? "#10B981" : "#F59E0B"}/>
          <ARow title="" actions={["View Agent","Assign Targets","Monitor Performance","Approve Incentives"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgencyManagementCenter({ onBack }) {
  const agencies = [
    { name:"StarPro QA", id:"AGC-041",hosts:48,rev:"$12.4K",status:"Active",   growth:"+18%" },
    { name:"EliteQA",    id:"AGC-028",hosts:32,rev:"$8.1K", status:"Active",   growth:"+12%" },
    { name:"VoiceHouse", id:"AGC-019",hosts:21,rev:"$4.8K", status:"Suspended",growth:"-4%" },
  ];
  const sc = { Active:"#10B981",Suspended:"#EF4444",Pending:"#F59E0B" };
  return (
    <Shell title="🏢 Agency Management Center" subtitle="Monitor Agency Operations" onBack={onBack}>
      <KGrid items={[
        { l:"Agencies",    v:"18",   color:"#FFC83D",icon:"🏢" },
        { l:"Active",      v:"16",   color:"#10B981",icon:"✅" },
        { l:"Total Hosts", v:"7.4K", color:"#A78BFA",icon:"🎙️" },
      ]}/>
      {agencies.map((ag,i) => (
        <motion.div key={ag.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🏢</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{ag.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{ag.id} · {ag.hosts} hosts</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{ag.rev}</div>
              <div style={{ fontSize:9,fontWeight:800,color:ag.growth.startsWith("+") ? "#10B981" : "#EF4444",marginTop:2 }}>{ag.growth}</div>
            </div>
          </div>
          <StatusBadge status={ag.status} colors={sc}/>
          <div style={{ marginTop:10 }}>
            <ARow title="" actions={["View Agency","Review Performance","Approve Requests","Suspend Agency","Generate Report"]}/>
          </div>
        </motion.div>
      ))}
    </Shell>
  );
}

function BusinessGrowthCenter({ onBack }) {
  const metrics = [
    { l:"Host Growth",     v:78,color:"#A78BFA" },
    { l:"Revenue Growth",  v:88,color:"#FFC83D" },
    { l:"Agency Growth",   v:64,color:"#10B981" },
    { l:"Market Expansion",v:51,color:"#60A5FA" },
  ];
  return (
    <Shell title="📈 Business Growth Center" subtitle="Monitor & Optimize Growth" onBack={onBack}>
      <KGrid items={[
        { l:"Growth Rate",    v:"+22%", color:"#10B981",icon:"📈" },
        { l:"Revenue Growth", v:"+31%", color:"#FFC83D",icon:"💰" },
        { l:"Market Rank",    v:"#3",   color:"#60A5FA",icon:"🏆" },
      ]}/>
      <Chart label="📈 GROWTH TREND" data={growData} color="#10B981" gid="bg1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>🎯 GROWTH METRICS</div>
        {metrics.map(m => <PBar key={m.l} label={m.l} value={m.v} max={100} color={m.color}/>)}
      </div>
      <ARow title="⚡" actions={["Analyze Growth","Create Growth Plan","Monitor Progress","Export Growth Report"]}/>
    </Shell>
  );
}

function TargetManagementCenter({ onBack }) {
  const targets = [
    { name:"Host Recruitment Q2",   progress:86,target:250,current:214,color:"#A78BFA",due:"Jun 30" },
    { name:"Revenue Target June",   progress:92,target:100,current:88, color:"#FFC83D",due:"Jun 30" },
    { name:"Agency Development Q2", progress:72,target:25, current:18, color:"#10B981",due:"Jun 30" },
    { name:"Agent Onboarding H1",   progress:84,target:50, current:42, color:"#60A5FA",due:"Jun 30" },
  ];
  return (
    <Shell title="🎯 Target Management Center" subtitle="KPIs & Business Objectives" onBack={onBack}>
      <KGrid items={[
        { l:"Active Targets",v:"8",  color:"#FFC83D",icon:"🎯" },
        { l:"On Track",      v:"6",  color:"#10B981",icon:"✅" },
        { l:"At Risk",       v:"2",  color:"#EF4444",icon:"⚠️" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Target","Assign Target"]}/>
      {targets.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{t.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>Due: {t.due}</div>
            </div>
            <div style={{ fontSize:10,fontWeight:900,color:t.color }}>{t.current}/{t.target}</div>
          </div>
          <PBar label="" value={t.progress} max={100} color={t.color}/>
          <div style={{ display:"flex",gap:5 }}>
            {["Update Target","Close Target"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px",borderRadius:9,border:"none",cursor:"pointer",fontSize:9,fontWeight:800,color:"#fff",background:GRADS[ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </Shell>
  );
}

function RevenueManagementCenter({ onBack }) {
  const sources = [
    { l:"Host Revenue Share", v:"$38K",pct:43,color:"#A78BFA" },
    { l:"Agency Commissions", v:"$24K",pct:27,color:"#FFC83D" },
    { l:"Gift Revenue",       v:"$18K",pct:20,color:"#EC4899" },
    { l:"VIP Subscriptions",  v:"$8K", pct:10,color:"#60A5FA" },
  ];
  return (
    <Shell title="💰 Revenue Management" subtitle="Revenue Performance & Profitability" onBack={onBack}>
      <KGrid items={[
        { l:"Daily Revenue",   v:"$4.8K",color:"#FFC83D",icon:"💰" },
        { l:"Monthly Revenue", v:"$88K", color:"#10B981",icon:"📈" },
        { l:"vs Last Month",   v:"+18%", color:"#60A5FA",icon:"🚀" },
      ]}/>
      <Chart label="💰 REVENUE TREND" data={revData} color="#FFC83D" gid="rm1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 REVENUE BREAKDOWN</div>
        {sources.map(s => (
          <div key={s.l} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{s.l}</span>
              <span style={{ fontSize:11,fontWeight:900,color:s.color }}>{s.v}</span>
            </div>
            <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${s.pct}%` }} transition={{ duration:0.7 }}
                style={{ height:"100%",borderRadius:3,background:s.color }}/>
            </div>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Revenue Analysis","Forecast Revenue","Generate Revenue Report","Export Revenue Data"]}/>
    </Shell>
  );
}

function CampaignManagementCenter({ onBack }) {
  const campaigns = [
    { name:"Q2 Host Recruitment",    status:"Active",   reach:"48K",conv:"214",budget:"$1.2K" },
    { name:"Agency Expansion Drive", status:"Active",   reach:"22K",conv:"8",  budget:"$800" },
    { name:"Agent Onboarding May",   status:"Completed",reach:"18K",conv:"42", budget:"$600" },
    { name:"Summer VIP Campaign",    status:"Paused",   reach:"12K",conv:"18", budget:"$400" },
  ];
  const sc = { Active:"#10B981",Completed:"#9CA3AF",Paused:"#F59E0B",Draft:"#60A5FA" };
  return (
    <Shell title="📣 Campaign Management" subtitle="Recruitment & Business Campaigns" onBack={onBack}>
      <KGrid items={[
        { l:"Active",     v:"2",    color:"#10B981",icon:"📣" },
        { l:"Total Reach",v:"100K", color:"#60A5FA",icon:"👥" },
        { l:"Conversions",v:"282",  color:"#FFC83D",icon:"✅" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Campaign"]}/>
      {campaigns.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff",flex:1,marginRight:8 }}>{c.name}</div>
            <StatusBadge status={c.status} colors={sc}/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10 }}>
            {[{ l:"Reach",v:c.reach },{ l:"Converted",v:c.conv },{ l:"Budget",v:c.budget }].map(s => (
              <div key={s.l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"6px",textAlign:"center" }}>
                <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize:8,color:"#60A5FA" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <ARow title="" actions={c.status==="Active" ? ["Launch Campaign","Pause Campaign","End Campaign","Campaign Analytics"] : ["View Results","Campaign Analytics"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventManagementCenter({ onBack }) {
  const events = [
    { name:"Host Talent Hunt June",  status:"Active",    participants:84, prize:"10K Coins",date:"Jun 20" },
    { name:"Agency Summit Q2",       status:"Scheduled", participants:24, prize:"Special",  date:"Jun 28" },
    { name:"Agent Challenge May",    status:"Completed", participants:42, prize:"5K Coins", date:"May 31" },
  ];
  const sc = { Active:"#10B981",Scheduled:"#F59E0B",Completed:"#9CA3AF" };
  return (
    <Shell title="🎉 Event Management Center" subtitle="Promotional & Operational Events" onBack={onBack}>
      <KGrid items={[
        { l:"Active Events", v:"1",  color:"#10B981",icon:"🎉" },
        { l:"Participants",  v:"150",color:"#60A5FA",icon:"👥" },
        { l:"Upcoming",      v:"1",  color:"#F59E0B",icon:"📅" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Event"]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(168,85,247,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🎉</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{e.participants} participants · {e.date}</div>
            </div>
            <StatusBadge status={e.status} colors={sc}/>
          </div>
          <ARow title="" actions={e.status !== "Completed" ? ["Edit Event","Launch Event","Monitor Event","Close Event"] : ["View Results"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ApplicationManagementCenter({ onBack }) {
  const apps = [
    { type:"Host Application",        icon:"🎙️",pending:24,color:"#A78BFA" },
    { type:"Agent Application",       icon:"🤝", pending:8, color:"#60A5FA" },
    { type:"Agency Application",      icon:"🏢", pending:5, color:"#FFC83D" },
    { type:"Team Member Application", icon:"👥", pending:3, color:"#10B981" },
  ];
  return (
    <Shell title="📋 Application Management" subtitle="Review & Process Applications" onBack={onBack}>
      <KGrid items={[
        { l:"Pending",       v:"40", color:"#F59E0B",icon:"⏳" },
        { l:"Approved Today",v:"16", color:"#10B981",icon:"✅" },
        { l:"Rejected",      v:"4",  color:"#EF4444",icon:"❌" },
      ]}/>
      {apps.map((a,i) => (
        <motion.div key={a.type} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.type}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{a.pending} pending</div>
            </div>
            <div style={{ padding:"3px 8px",borderRadius:8,background:"rgba(255,200,61,0.12)",border:"1px solid rgba(255,200,61,0.3)" }}>
              <span style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{a.pending}</span>
            </div>
          </div>
          <ARow title="" actions={["Review Application","Approve","Reject","Hold","Request Documents"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Team");
  return (
    <Shell title="📨 Communication Center" subtitle="Business Communications" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>👥 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Team","All Hosts","All Agents","All Agencies","VIP Members"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:target===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#60A5FA" }}>
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
      <ARow title="⚡ MORE" actions={["Create Announcement","Schedule Meeting","Broadcast Notification"]}/>
    </Shell>
  );
}

function AnalyticsCenter({ onBack }) {
  return (
    <Shell title="📊 Analytics Center" subtitle="Business Performance Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Reports Generated",v:"142",   color:"#60A5FA",icon:"📊" },
        { l:"Revenue Insight",  v:"$88K",  color:"#FFC83D",icon:"💰" },
        { l:"Growth Score",     v:"92/100",color:"#10B981",icon:"🏆" },
      ]}/>
      <Chart label="📈 REVENUE ANALYTICS" data={revData} color="#FFC83D" gid="ac1"/>
      <Chart label="📊 GROWTH ANALYTICS" data={growData} color="#10B981" gid="ac2"/>
      <Chart label="🏆 PERFORMANCE TREND" data={perfData} color="#A78BFA" gid="ac3" type="bar"/>
      <ARow title="⚡" actions={["View Analytics","Generate Analytics Report","Export Analytics","Compare Performance"]}/>
    </Shell>
  );
}

function BusinessIntelligenceCenter({ onBack }) {
  const insights = [
    "Saudi Arabia showing 28% YoY growth — expand host network",
    "Agency commissions up 18% — increase agency partnerships",
    "Peak streaming hours: 8pm–12am GST — focus recruitment here",
    "VIP conversion rate at 4.2% — optimize VIP onboarding flow",
  ];
  return (
    <Shell title="🧠 Business Intelligence" subtitle="AI-Powered Forecasting & Insights" onBack={onBack}>
      <KGrid items={[
        { l:"Forecast Accuracy",v:"94%",     color:"#10B981",icon:"🧠" },
        { l:"Growth Forecast",  v:"+28% QoQ",color:"#FFC83D",icon:"📈" },
        { l:"Risk Score",       v:"Low",     color:"#60A5FA",icon:"🛡️" },
      ]}/>
      <Chart label="📈 GROWTH FORECAST" data={[...growData,{d:"Jul",v:58},{d:"Aug",v:66}]} color="#10B981" gid="bi1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 AI BUSINESS INSIGHTS</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"7px 0",borderBottom:i<insights.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#FFC83D",fontWeight:800,fontSize:11,flexShrink:0 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{ins}</span>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Forecast Growth","Analyze Trends","Generate Insights","Risk Assessment"]}/>
    </Shell>
  );
}

function PerformanceManagementCenter({ onBack }) {
  const scorecards = [
    { name:"Team Operations",  score:92,prev:88,color:"#10B981" },
    { name:"Revenue KPI",      score:88,prev:82,color:"#FFC83D" },
    { name:"Host Performance", score:84,prev:79,color:"#A78BFA" },
    { name:"Agency Growth",    score:76,prev:74,color:"#60A5FA" },
  ];
  return (
    <Shell title="🏆 Performance Management" subtitle="Team & Business Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Overall Score", v:"88%", color:"#10B981",icon:"🏆" },
        { l:"Team Score",    v:"92%", color:"#FFC83D",icon:"👥" },
        { l:"Achievements",  v:"14",  color:"#A78BFA",icon:"🥇" },
      ]}/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 PERFORMANCE SCORECARDS</div>
        {scorecards.map(s => (
          <div key={s.name} style={{ marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{s.name}</span>
              <div style={{ display:"flex",gap:8 }}>
                <span style={{ fontSize:9,color:"#9CA3AF" }}>Prev: {s.prev}</span>
                <span style={{ fontSize:11,fontWeight:900,color:s.color }}>{s.score}</span>
              </div>
            </div>
            <PBar label="" value={s.score} max={100} color={s.color}/>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Review Performance","Generate Scorecard","Assign Rewards","Track Achievements"]}/>
    </Shell>
  );
}

function ReportManagementCenter({ onBack }) {
  const reports = [
    { name:"Monthly Business Report", type:"Business",   date:"Jun 15",status:"Ready",   size:"2.4 MB" },
    { name:"Host Performance Report", type:"Performance", date:"Jun 14",status:"Ready",   size:"1.8 MB" },
    { name:"Revenue Analytics Q2",    type:"Revenue",    date:"Jun 10",status:"Ready",   size:"3.2 MB" },
    { name:"Agency Growth Report",    type:"Growth",     date:"Jun 8", status:"Archived", size:"1.1 MB" },
  ];
  const tc = { Business:"#1F6BFF",Performance:"#A78BFA",Revenue:"#FFC83D",Growth:"#10B981" };
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📑 Report Management" subtitle="Generate & Manage Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports", v:"48", color:"#60A5FA",icon:"📑" },
        { l:"This Month",    v:"12", color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",     v:"3",  color:"#10B981",icon:"⏰" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${tc[r.type]}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📑</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{r.name}</div>
            <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>{r.date} · {r.size}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end" }}>
            <StatusBadge status={r.status} colors={sc}/>
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

function DocumentManagementCenter({ onBack }) {
  const docs = [
    { name:"Agency Contract Template",    icon:"📄",type:"Contract",  date:"Jun 10",size:"248 KB" },
    { name:"Host Management Policy",      icon:"📋",type:"Policy",    date:"Jun 5", size:"180 KB" },
    { name:"Q2 Business Operations Plan", icon:"📊",type:"Plan",      date:"May 28",size:"1.2 MB" },
    { name:"Revenue Optimization Guide",  icon:"💰",type:"Guide",     date:"May 15",size:"540 KB" },
  ];
  const tc = { Contract:"#1F6BFF",Policy:"#A78BFA",Plan:"#FFC83D",Guide:"#10B981" };
  return (
    <Shell title="📁 Document Management" subtitle="Contracts, Policies & Business Files" onBack={onBack}>
      <ARow title="⚡ UPLOAD" actions={["Upload Document"]}/>
      {docs.map((d,i) => (
        <motion.div key={d.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${tc[d.type]}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{d.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{d.name}</div>
            <div style={{ display:"flex",gap:8,marginTop:3 }}>
              <span style={{ fontSize:9,padding:"2px 6px",borderRadius:6,background:`${tc[d.type]}18`,color:tc[d.type],fontWeight:700 }}>{d.type}</span>
              <span style={{ fontSize:9,color:"#9CA3AF" }}>{d.date} · {d.size}</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:4 }}>
            {["⬇️","📤","🗄️"].map((ic,ii) => (
              <motion.button key={ii} whileTap={{ scale:0.9 }}
                style={{ width:28,height:28,borderRadius:8,border:"none",cursor:"pointer",background:"rgba(255,255,255,0.08)",fontSize:13 }}>
                {ic}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </Shell>
  );
}

function OperationsCenter({ onBack }) {
  const ops = [
    { name:"Daily Host Check-In Review",     status:"In Progress",priority:"High",   color:"#EF4444" },
    { name:"Weekly Agent Report Collection", status:"Pending",     priority:"Medium", color:"#F59E0B" },
    { name:"Agency KPI Review",              status:"Completed",   priority:"High",   color:"#10B981" },
    { name:"Campaign Performance Audit",     status:"Pending",     priority:"Medium", color:"#F59E0B" },
  ];
  const sc = { "In Progress":"#1F6BFF",Pending:"#F59E0B",Completed:"#10B981" };
  return (
    <Shell title="⚙️ Operations Center" subtitle="Day-to-Day Business Operations" onBack={onBack}>
      <KGrid items={[
        { l:"Active Ops",  v:"8",   color:"#60A5FA",icon:"⚙️" },
        { l:"Completed",   v:"42",  color:"#10B981",icon:"✅" },
        { l:"Efficiency",  v:"91%", color:"#FFC83D",icon:"🚀" },
      ]}/>
      {ops.map((o,i) => (
        <motion.div key={o.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${o.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{o.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>Priority: <span style={{ color:o.color,fontWeight:800 }}>{o.priority}</span></div>
            </div>
            <StatusBadge status={o.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Monitor Operations","Assign Operations","Optimize Workflow"]}/>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["Review Activities"]}/>
    </Shell>
  );
}

function NotificationCenter({ onBack }) {
  const [notifs, setNotifs] = useState([
    { id:1,icon:"🎙️",title:"New Host Application",     body:"24 host applications pending review.",    time:"5m ago", read:false },
    { id:2,icon:"💰",title:"Revenue Alert",            body:"Daily revenue reached $4.8K target.",     time:"1h ago", read:false },
    { id:3,icon:"⚠️",title:"Agent Performance Alert",  body:"3 agents below monthly target.",          time:"3h ago", read:false },
    { id:4,icon:"🏆",title:"Achievement Unlocked",     body:"Team reached Q2 host recruitment target.", time:"1d ago", read:true  },
    { id:5,icon:"📊",title:"Weekly Report Ready",      body:"Q2 performance report is ready.",         time:"2d ago", read:true  },
  ]);
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? {...x, read:true} : x));
  return (
    <Shell title="🔔 Notification Center" subtitle="Alerts & Notifications" onBack={onBack}>
      <KGrid items={[
        { l:"Unread",  v:notifs.filter(n=>!n.read).length, color:"#EF4444",icon:"🔔" },
        { l:"Total",   v:notifs.length,                    color:"#60A5FA",icon:"📬" },
        { l:"Alerts",  v:"3",                              color:"#F59E0B",icon:"⚠️" },
      ]}/>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
        <div style={S.sec}>📬 ALL NOTIFICATIONS</div>
        <motion.button whileTap={{ scale:0.92 }} onClick={() => setNotifs(n => n.map(x => ({...x,read:true})))}
          style={{ background:"none",border:"none",fontSize:10,color:"#1F6BFF",fontWeight:700,cursor:"pointer" }}>Mark all read</motion.button>
      </div>
      {notifs.map((n,i) => (
        <motion.div key={n.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          onClick={() => markRead(n.id)}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,cursor:"pointer",
            background:n.read?"rgba(255,255,255,0.03)":"rgba(31,107,255,0.08)",
            borderColor:n.read?"rgba(31,107,255,0.14)":"rgba(31,107,255,0.3)" }}>
          <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
            <div style={{ width:38,height:38,borderRadius:11,background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{n.title}</div>
              <div style={{ fontSize:10,color:"#9CA3AF",lineHeight:1.5,marginTop:2 }}>{n.body}</div>
              <div style={{ fontSize:9,color:"#4B5563",marginTop:4 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width:8,height:8,borderRadius:"50%",background:"#1F6BFF",flexShrink:0,marginTop:4,boxShadow:"0 0 6px rgba(31,107,255,0.6)"}}/>}
          </div>
        </motion.div>
      ))}
      <ARow title="⚡ ACTIONS" actions={["Create Alert","Send Notification","Schedule Notification","View Notification Logs"]}/>
    </Shell>
  );
}

function BMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Business Planning",       icon:"📋",desc:"Create comprehensive business plans",     color:"#1F6BFF" },
    { name:"Revenue Optimization",    icon:"💰",desc:"AI-powered revenue optimization engine",  color:"#FFC83D" },
    { name:"Team Optimization",       icon:"👥",desc:"Optimize team structure and performance", color:"#10B981" },
    { name:"Growth Strategy",         icon:"🚀",desc:"Design growth strategies and roadmaps",   color:"#A78BFA" },
    { name:"Operational Forecasting", icon:"🧠",desc:"Forecast operational needs and capacity", color:"#EC4899" },
  ];
  return (
    <Shell title="🚀 BM Exclusive Tools" subtitle="Executive Operations Tools" onBack={onBack}>
      <div style={{ background:"rgba(31,107,255,0.08)",border:"1px solid rgba(31,107,255,0.25)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#60A5FA",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — BUSINESS MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools are exclusively available for Business Managers. All actions are logged and require Business Manager authentication.</div>
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
  overview:     BusinessOverviewCenter,
  team:         TeamManagementCenter,
  hosts:        HostPerformanceCenter,
  agents:       AgentManagementCenter,
  agencies:     AgencyManagementCenter,
  growth:       BusinessGrowthCenter,
  targets:      TargetManagementCenter,
  revenue:      RevenueManagementCenter,
  campaigns:    CampaignManagementCenter,
  events:       EventManagementCenter,
  applications: ApplicationManagementCenter,
  comms:        CommunicationCenter,
  analytics:    AnalyticsCenter,
  bi:           BusinessIntelligenceCenter,
  performance:  PerformanceManagementCenter,
  reports:      ReportManagementCenter,
  documents:    DocumentManagementCenter,
  operations:   OperationsCenter,
  notifications:NotificationCenter,
  exclusive:    BMExclusiveTools,
};

const MODULES = [
  { id:"overview",     icon:"📊", label:"Business Overview",    subtitle:"Operations Summary",    gradient:"linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow:"rgba(31,107,255,0.4)" },
  { id:"team",         icon:"👥", label:"Team Management",      subtitle:"Workforce Control",      gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.35)" },
  { id:"hosts",        icon:"🎙️", label:"Host Performance",     subtitle:"Productivity Monitor",   gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"agents",       icon:"🤝", label:"Agent Management",     subtitle:"Agent Operations",       gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"agencies",     icon:"🏢", label:"Agency Management",    subtitle:"Agency Monitor",         gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"growth",       icon:"📈", label:"Business Growth",      subtitle:"Growth Engine",          gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"targets",      icon:"🎯", label:"Target Management",    subtitle:"KPIs & Objectives",      gradient:"linear-gradient(145deg,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.35)" },
  { id:"revenue",      icon:"💰", label:"Revenue Management",   subtitle:"Revenue Intelligence",   gradient:"linear-gradient(145deg,#F59E0B,#B45309)", glow:"rgba(245,158,11,0.35)" },
  { id:"campaigns",    icon:"📣", label:"Campaign Management",  subtitle:"Campaigns Hub",          gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"events",       icon:"🎉", label:"Event Management",     subtitle:"Events Command",         gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"applications", icon:"📋", label:"Applications",         subtitle:"Review & Approve",       gradient:"linear-gradient(145deg,#7C3AED,#4C1D95)", glow:"rgba(124,58,237,0.35)" },
  { id:"comms",        icon:"📨", label:"Communication",        subtitle:"Message & Announce",     gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"analytics",    icon:"📊", label:"Analytics Center",     subtitle:"Full Analytics",         gradient:"linear-gradient(145deg,#1F6BFF,#A78BFA)", glow:"rgba(31,107,255,0.35)" },
  { id:"bi",           icon:"🧠", label:"Business Intelligence",subtitle:"AI Forecasting",         gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"performance",  icon:"🏆", label:"Performance Mgmt",     subtitle:"Scorecards",             gradient:"linear-gradient(145deg,#FFC83D,#1F6BFF)", glow:"rgba(255,200,61,0.35)" },
  { id:"reports",      icon:"📑", label:"Report Management",    subtitle:"Generate & Export",      gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"documents",    icon:"📁", label:"Document Management",  subtitle:"Files & Contracts",      gradient:"linear-gradient(145deg,#F97316,#C2410C)", glow:"rgba(249,115,22,0.35)" },
  { id:"operations",   icon:"⚙️", label:"Operations Center",    subtitle:"Daily Operations",       gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"notifications",icon:"🔔", label:"Notification Center",  subtitle:"Alerts & Logs",          gradient:"linear-gradient(145deg,#06B6D4,#0E7490)", glow:"rgba(6,182,212,0.35)" },
  { id:"exclusive",    icon:"🚀", label:"BM Exclusive Tools",   subtitle:"Executive Powers",       gradient:"linear-gradient(145deg,#FFC83D,#EF4444)", glow:"rgba(255,200,61,0.5)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function BusinessManagerDashboard() {
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
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🏢 Business Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>Operations · Revenue · Performance · Growth</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🏢 BM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(31,107,255,0.18),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#1F6BFF,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · BUSINESS OPERATIONS MANAGEMENT · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Business Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central operations hub managing hosts, agents, agencies, revenue, campaigns, events, and overall business performance.</div>
        </div>

        <KGrid items={[
          { l:"Active Hosts",      v:"7.4K",  color:"#A78BFA",icon:"🎙️" },
          { l:"Active Agents",     v:"142",   color:"#60A5FA",icon:"🤝" },
          { l:"Agencies",          v:"18",    color:"#FFC83D",icon:"🏢" },
          { l:"Daily Revenue",     v:"$4.8K", color:"#FFC83D",icon:"💰" },
          { l:"Monthly Revenue",   v:"$88K",  color:"#10B981",icon:"📈" },
          { l:"Growth Rate",       v:"+22%",  color:"#10B981",icon:"🚀" },
          { l:"Active Campaigns",  v:"2",     color:"#EC4899",icon:"📣" },
          { l:"Target Achievement",v:"88%",   color:"#FFC83D",icon:"🎯" },
          { l:"Team Score",        v:"92%",   color:"#60A5FA",icon:"👥" },
          { l:"Rev Forecast",      v:"$100K", color:"#A78BFA",icon:"📊" },
          { l:"New Applications",  v:"40",    color:"#F59E0B",icon:"📋" },
          { l:"Ops Efficiency",    v:"91%",   color:"#10B981",icon:"⚙️" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} MANAGEMENT MODULES · TAP TO ACCESS
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
                  background:mod.featured ? "linear-gradient(90deg,#FFC83D,#EF4444,#FFC83D)" : `linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0] ?? "#1F6BFF"},rgba(255,200,61,0.4))` }}/>
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