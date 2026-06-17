/**
 * BusinessDeveloperDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Business Developer
 * Theme: Enterprise Dark Blue & Gold · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  page: { minHeight: "100dvh", background: "linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)", fontFamily: "'Inter',system-ui,sans-serif", paddingBottom: 90 },
  glass: (extra = {}) => ({ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(14px)", border: "1px solid rgba(31,107,255,0.18)", borderRadius: 18, ...extra }),
  goldBadge: { padding: "4px 10px", borderRadius: 20, background: "rgba(255,200,61,0.12)", border: "1px solid rgba(255,200,61,0.3)" },
  sectionTitle: { fontSize: 10, fontWeight: 800, color: "#60A5FA", letterSpacing: "0.08em", marginBottom: 10 },
  kpiCard: (color) => ({ background: `linear-gradient(145deg,${color}18,${color}08)`, border: `1px solid ${color}30`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }),
  chip: (color) => ({ display: "inline-block", padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: `${color}15`, color, border: `1px solid ${color}25`, margin: "2px" }),
  actionBtn: (grad, glow) => ({ padding: "8px 11px", borderRadius: 11, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 10, color: "#fff", background: grad, boxShadow: `0 4px 12px ${glow}`, margin: "3px", flexShrink: 0 }),
};

const growthData = [{ d:"Jan",v:12},{ d:"Feb",v:18},{ d:"Mar",v:24},{ d:"Apr",v:31},{ d:"May",v:38},{ d:"Jun",v:45}];
const revenueData = [{ d:"Jan",v:28},{ d:"Feb",v:34},{ d:"Mar",v:29},{ d:"Apr",v:48},{ d:"May",v:56},{ d:"Jun",v:62}];
const hostData = [{ d:"Jan",v:84},{ d:"Feb",v:102},{ d:"Mar",v:128},{ d:"Apr",v:156},{ d:"May",v:184},{ d:"Jun",v:214}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function PageShell({ title, subtitle, onBack, children }) {
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
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🚀 BD</span></div>
        </div>
      </div>
      <div style={{ padding:"14px" }}>{children}</div>
    </div>
  );
}

function KpiGrid({ items }) {
  return (
    <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14 }}>
      {items.map(({ l,v,icon,color="#60A5FA" }) => (
        <div key={l} style={S.kpiCard(color)}>
          {icon && <div style={{ fontSize:15,marginBottom:2 }}>{icon}</div>}
          <div style={{ fontSize:13,fontWeight:900,color }}>{v}</div>
          <div style={{ fontSize:8,color:"rgba(255,255,255,0.45)",marginTop:2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function ActionRow({ title, actions }) {
  const grads = ["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#7C3AED,#5B21B6)","linear-gradient(135deg,#0EA5E9,#0369A1)"];
  const glows = ["rgba(31,107,255,0.3)","rgba(16,185,129,0.3)","rgba(245,158,11,0.3)","rgba(239,68,68,0.3)","rgba(124,58,237,0.3)","rgba(14,165,233,0.3)"];
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      {title && <div style={S.sectionTitle}>{title}</div>}
      <div style={{ display:"flex",flexWrap:"wrap" }}>
        {actions.map((a,i) => (
          <motion.button key={a} whileTap={{ scale:0.92 }} style={S.actionBtn(grads[i%grads.length],glows[i%glows.length])}>{a}</motion.button>
        ))}
      </div>
    </div>
  );
}

function MiniChart({ label, data, color, gradId, type="area" }) {
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      <div style={S.sectionTitle}>{label}</div>
      <ResponsiveContainer width="100%" height={90}>
        {type === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#60A5FA" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill={color} radius={[4,4,0,0]}/>
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#60A5FA" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gradId})`} strokeWidth={2} dot={{ fill:"#FFC83D",r:2 }}/>
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
        <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{label}</span>
        <span style={{ fontSize:11,fontWeight:900,color }}>{value}/{max}</span>
      </div>
      <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${(value/max)*100}%` }} transition={{ duration:0.7 }}
          style={{ height:"100%",borderRadius:3,background:color }} />
      </div>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function BusinessOverviewCenter({ onBack }) {
  return (
    <PageShell title="📊 Business Overview Center" subtitle="Growth & Expansion Performance" onBack={onBack}>
      <KpiGrid items={[
        { l:"Hosts Recruited",   v:"214",    color:"#A78BFA",icon:"🎙️" },
        { l:"Agents Onboarded",  v:"42",     color:"#60A5FA",icon:"🤝" },
        { l:"Partner Agencies",  v:"18",     color:"#FFC83D",icon:"🏢" },
        { l:"Monthly Growth",    v:"+22%",   color:"#10B981",icon:"📈" },
        { l:"Revenue Contrib.",  v:"$62K",   color:"#FFC83D",icon:"💰" },
        { l:"Target Achievement",v:"87%",    color:"#10B981",icon:"🎯" },
      ]} />
      <MiniChart label="📈 GROWTH TREND" data={growthData} color="#1F6BFF" gradId="bo1" />
      <MiniChart label="💰 REVENUE CONTRIBUTION" data={revenueData} color="#FFC83D" gradId="bo2" />
      <ActionRow title="⚡ QUICK ACTIONS" actions={["View Performance","Growth Analytics","Business Report","Export Data"]} />
    </PageShell>
  );
}

function HostRecruitmentCenter({ onBack }) {
  const [search, setSearch] = useState("");
  const recruits = [
    { name:"Sara Al-Rashid",  id:"REC-4821",status:"Pending",   country:"🇸🇦 SA",score:"High" },
    { name:"Ahmed Mansoor",   id:"REC-3841",status:"Approved",  country:"🇶🇦 QA",score:"Medium" },
    { name:"Noor Khalifa",    id:"REC-2918",status:"Reviewing", country:"🇦🇪 AE",score:"High" },
  ];
  const statusColors = { Pending:"#F59E0B",Approved:"#10B981",Reviewing:"#1F6BFF" };
  return (
    <PageShell title="🎙️ Host Recruitment Center" subtitle="Manage Host Recruitment" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Recruited",v:"214",  color:"#A78BFA",icon:"🎙️" },
        { l:"This Month",     v:"38",   color:"#10B981",icon:"📈" },
        { l:"Pending Review", v:"12",   color:"#F59E0B",icon:"⏳" },
      ]} />
      <MiniChart label="🎙️ RECRUITS TREND" data={hostData} color="#A78BFA" gradId="hr1" />
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#60A5FA"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search recruits…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {recruits.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())).map((r,i) => (
        <motion.div key={r.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🎙️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{r.id} · {r.country}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ padding:"2px 7px",borderRadius:7,background:`${statusColors[r.status]}18`,border:`1px solid ${statusColors[r.status]}30` }}>
                <span style={{ fontSize:9,fontWeight:800,color:statusColors[r.status] }}>{r.status}</span>
              </div>
              <div style={{ fontSize:9,color:"#FFC83D",marginTop:3 }}>{r.score} Potential</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:5 }}>
            {["Add New Host","Review","Approve","Reject","Track"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px 3px",borderRadius:8,border:"none",cursor:"pointer",fontSize:7.5,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#F59E0B,#D97706)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function TalentAgentRecruitmentCenter({ onBack }) {
  const agents = [
    { name:"Ali Hassan",    id:"AGT-R-021",region:"Saudi Arabia",hosts:0, status:"Pending" },
    { name:"Mariam Khalid", id:"AGT-R-019",region:"Qatar",       hosts:0, status:"Approved" },
  ];
  return (
    <PageShell title="🤝 Talent Agent Recruitment" subtitle="Recruit & Manage Agents" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Agents",  v:"42",  color:"#60A5FA",icon:"🤝" },
        { l:"This Month",    v:"8",   color:"#10B981",icon:"📈" },
        { l:"Under Review",  v:"3",   color:"#F59E0B",icon:"⏳" },
      ]} />
      {agents.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🤝</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{a.id} · {a.region}</div>
            </div>
            <div style={{ padding:"2px 7px",borderRadius:7,background:a.status==="Approved"?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",border:`1px solid ${a.status==="Approved"?"rgba(16,185,129,0.3)":"rgba(245,158,11,0.3)"}` }}>
              <span style={{ fontSize:9,fontWeight:800,color:a.status==="Approved"?"#10B981":"#F59E0B" }}>{a.status}</span>
            </div>
          </div>
          <ActionRow title="" actions={["Add Agent","Review Agent","Approve Agent","Track Performance"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function AgencyDevelopmentCenter({ onBack }) {
  const agencies = [
    { name:"StarPro Agency",  id:"AGC-DEV-08",region:"Saudi Arabia",stage:"Partnership",rev:"$12.4K" },
    { name:"EliteMedia QA",   id:"AGC-DEV-06",region:"Qatar",       stage:"Evaluation", rev:"$6.8K" },
    { name:"GlobalSound AE",  id:"AGC-DEV-04",region:"UAE",         stage:"Onboarding", rev:"$9.2K" },
  ];
  const stageColors = { Partnership:"#10B981",Evaluation:"#F59E0B",Onboarding:"#1F6BFF" };
  return (
    <PageShell title="🏢 Agency Development Center" subtitle="Build & Expand Agency Network" onBack={onBack}>
      <KpiGrid items={[
        { l:"Partner Agencies",v:"18",    color:"#FFC83D",icon:"🏢" },
        { l:"This Month",      v:"3",     color:"#10B981",icon:"📈" },
        { l:"In Evaluation",   v:"4",     color:"#F59E0B",icon:"⏳" },
      ]} />
      {agencies.map((ag,i) => (
        <motion.div key={ag.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🏢</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{ag.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{ag.id} · {ag.region}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ padding:"2px 7px",borderRadius:7,background:`${stageColors[ag.stage]}18`,border:`1px solid ${stageColors[ag.stage]}30` }}>
                <span style={{ fontSize:9,fontWeight:800,color:stageColors[ag.stage] }}>{ag.stage}</span>
              </div>
              <div style={{ fontSize:10,fontWeight:900,color:"#FFC83D",marginTop:3 }}>{ag.rev}</div>
            </div>
          </div>
          <ActionRow title="" actions={["Agency Evaluation","Partnership Approval","Growth Monitoring"]} />
        </motion.div>
      ))}
      <ActionRow title="⚡ CREATE" actions={["Add Agency"]} />
    </PageShell>
  );
}

function LeadManagementCenter({ onBack }) {
  const leads = [
    { name:"Khalid Al-Otaibi",type:"Host Lead",   priority:"High",  stage:"Contacted",color:"#EF4444" },
    { name:"Mona Rashid",     type:"Agency Lead",  priority:"Medium",stage:"Qualified",color:"#F59E0B" },
    { name:"Omar Nassef",     type:"Agent Lead",   priority:"High",  stage:"Converted",color:"#10B981" },
    { name:"Sara Al-Manai",   type:"Host Lead",    priority:"Low",   stage:"New",      color:"#60A5FA" },
  ];
  const stageColors = { Contacted:"#F59E0B",Qualified:"#1F6BFF",Converted:"#10B981",New:"#9CA3AF" };
  return (
    <PageShell title="🎯 Lead Management Center" subtitle="Business Leads & Opportunities" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Leads",   v:"84",  color:"#10B981",icon:"🎯" },
        { l:"Hot Leads",     v:"18",  color:"#EF4444",icon:"🔥" },
        { l:"Converted",     v:"42",  color:"#FFC83D",icon:"✅" },
      ]} />
      <ActionRow title="⚡ ACTIONS" actions={["Create Lead","Assign Lead"]} />
      {leads.map((l,i) => (
        <motion.div key={l.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"12px 14px",marginBottom:10,borderLeft:`3px solid ${l.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{l.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{l.type} · Priority: <span style={{ color:l.color,fontWeight:800 }}>{l.priority}</span></div>
            </div>
            <div style={{ padding:"2px 8px",borderRadius:8,background:`${stageColors[l.stage]}18`,border:`1px solid ${stageColors[l.stage]}30`,alignSelf:"flex-start" }}>
              <span style={{ fontSize:9,fontWeight:800,color:stageColors[l.stage] }}>{l.stage}</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:5 }}>
            {["Update Lead","Convert Lead"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px",borderRadius:9,border:"none",cursor:"pointer",fontSize:9,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function MarketExpansionCenter({ onBack }) {
  const markets = [
    { country:"🇸🇦 Saudi Arabia",potential:"Very High",users:"2.4M",penetration:"12%",color:"#10B981" },
    { country:"🇮🇶 Iraq",        potential:"High",     users:"1.8M",penetration:"4%", color:"#FFC83D" },
    { country:"🇲🇦 Morocco",     potential:"Medium",   users:"1.2M",penetration:"2%", color:"#60A5FA" },
    { country:"🇵🇰 Pakistan",    potential:"High",     users:"3.1M",penetration:"1%", color:"#F97316" },
  ];
  return (
    <PageShell title="🌎 Market Expansion Center" subtitle="New Markets & Growth Opportunities" onBack={onBack}>
      <KpiGrid items={[
        { l:"Active Markets", v:"47",    color:"#60A5FA",icon:"🌍" },
        { l:"New Targets",    v:"8",     color:"#FFC83D",icon:"🎯" },
        { l:"Opportunity",    v:"High",  color:"#10B981",icon:"🚀" },
      ]} />
      {markets.map((m,i) => (
        <motion.div key={m.country} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div>
              <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{m.country}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>Audience: {m.users} · Penetration: {m.penetration}</div>
            </div>
            <div style={{ padding:"3px 9px",borderRadius:9,background:`${m.color}18`,border:`1px solid ${m.color}30`,alignSelf:"flex-start" }}>
              <span style={{ fontSize:9,fontWeight:800,color:m.color }}>{m.potential}</span>
            </div>
          </div>
          <ProgressBar label="Market Penetration" value={parseInt(m.penetration)} max={100} color={m.color} />
        </motion.div>
      ))}
      <ActionRow title="⚡ ACTIONS" actions={["Market Analysis","Growth Opportunities","Expansion Planning","Regional Reports"]} />
    </PageShell>
  );
}

function PartnershipManagementCenter({ onBack }) {
  const partnerships = [
    { name:"TelecomCo QA",    type:"Media Partner",  status:"Active",  value:"$8.4K/mo", signed:"May 2026" },
    { name:"StarMedia Group",  type:"Content Partner",status:"Active",  value:"$4.2K/mo", signed:"Apr 2026" },
    { name:"Gulf Talents Ltd", type:"Talent Partner", status:"Pending", value:"$6.8K/mo", signed:"—" },
  ];
  return (
    <PageShell title="🤝 Partnership Management" subtitle="Strategic Business Partnerships" onBack={onBack}>
      <KpiGrid items={[
        { l:"Active Partners",v:"12",    color:"#60A5FA",icon:"🤝" },
        { l:"Pending",        v:"3",     color:"#F59E0B",icon:"⏳" },
        { l:"Partner Revenue",v:"$18K",  color:"#FFC83D",icon:"💰" },
      ]} />
      <ActionRow title="⚡ CREATE" actions={["Create Partnership"]} />
      {partnerships.map((p,i) => (
        <motion.div key={p.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🤝</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{p.type} · Signed: {p.signed}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10,fontWeight:900,color:"#FFC83D" }}>{p.value}</div>
              <div style={{ fontSize:9,fontWeight:800,color:p.status==="Active"?"#10B981":"#F59E0B",marginTop:2 }}>{p.status}</div>
            </div>
          </div>
          <ActionRow title="" actions={["Review Partnership","Approve Partnership","Manage Agreements"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function CampaignManagementCenter({ onBack }) {
  const campaigns = [
    { name:"Host Recruitment Drive Q2", status:"Active",   reach:"48K",conversions:"214",budget:"$1.2K" },
    { name:"Agency Expansion June",     status:"Active",   reach:"22K",conversions:"8",  budget:"$800" },
    { name:"Agent Onboarding May",      status:"Completed",reach:"18K",conversions:"42", budget:"$600" },
  ];
  const statusColors = { Active:"#10B981",Completed:"#9CA3AF",Draft:"#F59E0B" };
  return (
    <PageShell title="📣 Campaign Management" subtitle="Recruitment & Growth Campaigns" onBack={onBack}>
      <KpiGrid items={[
        { l:"Active Campaigns",v:"3",    color:"#10B981",icon:"📣" },
        { l:"Total Reach",     v:"88K",  color:"#60A5FA",icon:"👥" },
        { l:"Conversions",     v:"264",  color:"#FFC83D",icon:"✅" },
      ]} />
      <ActionRow title="⚡ CREATE" actions={["Create Campaign"]} />
      {campaigns.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff",flex:1,marginRight:8 }}>{c.name}</div>
            <div style={{ padding:"2px 8px",borderRadius:7,background:`${statusColors[c.status]}18`,border:`1px solid ${statusColors[c.status]}30`,flexShrink:0 }}>
              <span style={{ fontSize:9,fontWeight:800,color:statusColors[c.status] }}>{c.status}</span>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10 }}>
            {[{ l:"Reach",v:c.reach },{ l:"Converted",v:c.conversions },{ l:"Budget",v:c.budget }].map(s => (
              <div key={s.l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:9,padding:"6px",textAlign:"center" }}>
                <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize:8,color:"#60A5FA" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",gap:5 }}>
            {(c.status==="Active"?["Launch Campaign","Monitor Campaign","Campaign Analytics"]:["View Results","Campaign Analytics"]).map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px 3px",borderRadius:8,border:"none",cursor:"pointer",fontSize:8,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#F59E0B,#D97706)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function RevenueGrowthCenter({ onBack }) {
  const sources = [
    { l:"Host Revenue Share",   v:"$28K",  pct:45,color:"#A78BFA" },
    { l:"Agency Commissions",   v:"$18K",  pct:29,color:"#FFC83D" },
    { l:"Campaign Revenue",     v:"$10K",  pct:16,color:"#10B981" },
    { l:"Partnership Revenue",  v:"$6K",   pct:10,color:"#60A5FA" },
  ];
  return (
    <PageShell title="💰 Revenue Growth Center" subtitle="Business Revenue Tracking" onBack={onBack}>
      <KpiGrid items={[
        { l:"Revenue Contrib.",  v:"$62K",  color:"#FFC83D",icon:"💰" },
        { l:"Monthly Growth",    v:"+22%",  color:"#10B981",icon:"📈" },
        { l:"Target",            v:"87%",   color:"#60A5FA",icon:"🎯" },
      ]} />
      <MiniChart label="💰 REVENUE TREND" data={revenueData} color="#FFC83D" gradId="rg1" />
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>💡 REVENUE BREAKDOWN</div>
        {sources.map(s => (
          <div key={s.l} style={{ marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:11,fontWeight:700,color:"#DCE3F0" }}>{s.l}</span>
              <span style={{ fontSize:11,fontWeight:900,color:s.color }}>{s.v}</span>
            </div>
            <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${s.pct}%` }} transition={{ duration:0.7 }}
                style={{ height:"100%",borderRadius:3,background:s.color }} />
            </div>
          </div>
        ))}
      </div>
      <ActionRow title="⚡ ACTIONS" actions={["Revenue Analysis","Growth Tracking","Performance Report","Forecast Revenue"]} />
    </PageShell>
  );
}

function RegionalPerformanceCenter({ onBack }) {
  const regions = [
    { name:"Saudi Arabia",flag:"🇸🇦",hosts:84,  revenue:"$28K",growth:"+24%",score:92 },
    { name:"Qatar",       flag:"🇶🇦",hosts:41,  revenue:"$12K",growth:"+18%",score:84 },
    { name:"UAE",         flag:"🇦🇪",hosts:56,  revenue:"$18K",growth:"+21%",score:88 },
    { name:"Egypt",       flag:"🇪🇬",hosts:33,  revenue:"$4K", growth:"+31%",score:76 },
  ];
  return (
    <PageShell title="📈 Regional Performance" subtitle="Regional Growth Analytics" onBack={onBack}>
      <MiniChart label="📊 REGIONAL COMPARISON" data={[{d:"SA",v:28},{d:"QA",v:12},{d:"AE",v:18},{d:"EG",v:4}]} color="#1F6BFF" gradId="rp1" type="bar" />
      {regions.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ fontSize:26 }}>{r.flag}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{r.hosts} hosts · {r.revenue} revenue</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#10B981" }}>{r.growth}</div>
              <div style={{ fontSize:9,color:"#FFC83D" }}>Score: {r.score}</div>
            </div>
          </div>
          <ProgressBar label="Performance Score" value={r.score} max={100} color="#1F6BFF" />
        </motion.div>
      ))}
      <ActionRow title="⚡" actions={["View Region","Growth Analysis","Compare Regions","Export Reports"]} />
    </PageShell>
  );
}

function ApplicationManagementCenter({ onBack }) {
  const apps = [
    { type:"Host Application",       icon:"🎙️",pending:24,color:"#A78BFA" },
    { type:"Agent Application",      icon:"🤝",pending:8, color:"#60A5FA" },
    { type:"Agency Application",     icon:"🏢",pending:5, color:"#FFC83D" },
    { type:"Partnership Application",icon:"🤝",pending:3, color:"#10B981" },
  ];
  return (
    <PageShell title="📋 Application Management" subtitle="Review & Process Applications" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Pending",  v:"40",  color:"#F59E0B",icon:"⏳" },
        { l:"Approved Today", v:"14",  color:"#10B981",icon:"✅" },
        { l:"Rejected",       v:"3",   color:"#EF4444",icon:"❌" },
      ]} />
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
          <ActionRow title="" actions={["Approve","Reject","Hold","Request Information"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function CommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Hosts");
  return (
    <PageShell title="📨 Communication Center" subtitle="Message Hosts, Agents & Partners" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>👥 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Hosts","All Agents","All Agencies","Partners","New Recruits"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:target===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Write your message…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(31,107,255,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#1F6BFF,#7C3AED)",boxShadow:"0 6px 20px rgba(31,107,255,0.35)" }}>
          📨 Send Message
        </motion.button>
      </div>
      <ActionRow title="⚡ MORE OPTIONS" actions={["Create Announcement","Schedule Meeting","Broadcast Notice"]} />
    </PageShell>
  );
}

function EventDevelopmentCenter({ onBack }) {
  const events = [
    { name:"Host Recruitment Drive",  status:"Active",   participants:48, date:"Jun 20" },
    { name:"Agency Partnership Summit",status:"Scheduled",participants:12, date:"Jun 25" },
    { name:"Talent Search May",       status:"Completed",participants:84, date:"May 30" },
  ];
  const statusColors = { Active:"#10B981",Scheduled:"#F59E0B",Completed:"#9CA3AF" };
  return (
    <PageShell title="🎉 Event Development Center" subtitle="Growth Events & Recruitment Programs" onBack={onBack}>
      <KpiGrid items={[
        { l:"Active Events",  v:"2",   color:"#10B981",icon:"🎉" },
        { l:"Participants",   v:"144", color:"#60A5FA",icon:"👥" },
        { l:"Upcoming",       v:"1",   color:"#F59E0B",icon:"📅" },
      ]} />
      <ActionRow title="⚡ CREATE" actions={["Create Event"]} />
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(168,85,247,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🎉</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{e.participants} participants · {e.date}</div>
            </div>
            <div style={{ padding:"2px 7px",borderRadius:7,background:`${statusColors[e.status]}18`,border:`1px solid ${statusColors[e.status]}30` }}>
              <span style={{ fontSize:9,fontWeight:800,color:statusColors[e.status] }}>{e.status}</span>
            </div>
          </div>
          <ActionRow title="" actions={e.status!=="Completed"?["Launch Event","Manage Participants","Close Event"]:["View Results"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function PerformanceTrackingCenter({ onBack }) {
  const kpis = [
    { name:"Host Recruitment Target",    current:214, target:250, color:"#A78BFA" },
    { name:"Agency Development Target",  current:18,  target:25,  color:"#FFC83D" },
    { name:"Revenue Contribution Target",current:62,  target:80,  color:"#10B981" },
    { name:"Agent Onboarding Target",    current:42,  target:50,  color:"#60A5FA" },
  ];
  return (
    <PageShell title="🏆 Performance Tracking" subtitle="KPIs, Targets & Achievements" onBack={onBack}>
      <KpiGrid items={[
        { l:"Overall Score", v:"87%",    color:"#10B981",icon:"🏆" },
        { l:"KPIs Met",      v:"3/4",    color:"#FFC83D",icon:"✅" },
        { l:"Rank",          v:"#2 BD",  color:"#60A5FA",icon:"📊" },
      ]} />
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>🎯 KPI PROGRESS</div>
        {kpis.map(k => (
          <ProgressBar key={k.name} label={k.name} value={k.current} max={k.target} color={k.color} />
        ))}
      </div>
      <ActionRow title="⚡" actions={["View KPI","Target Monitoring","Achievement Report","Performance Review"]} />
    </PageShell>
  );
}

function BusinessIntelligenceCenter({ onBack }) {
  return (
    <PageShell title="🧠 Business Intelligence" subtitle="Advanced Analytics & Forecasting" onBack={onBack}>
      <KpiGrid items={[
        { l:"Growth Forecast", v:"+28% QoQ",color:"#10B981",icon:"📈" },
        { l:"Market Potential",v:"$2.4M",   color:"#FFC83D",icon:"💰" },
        { l:"Opportunities",   v:"12",       color:"#60A5FA",icon:"🎯" },
      ]} />
      <MiniChart label="📊 GROWTH FORECAST" data={[...growthData,{d:"Jul",v:54},{d:"Aug",v:62}]} color="#10B981" gradId="bi1" />
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>💡 TOP GROWTH OPPORTUNITIES</div>
        {["Expand into Iraq market — High potential","Recruit 50 more hosts in Egypt","Launch agency program in Morocco","Develop 3 new strategic partnerships"].map((o,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"7px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#FFC83D",fontWeight:800,fontSize:11 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{o}</span>
          </div>
        ))}
      </div>
      <ActionRow title="⚡" actions={["Forecast Growth","Analyze Trends","Business Insights","Market Intelligence"]} />
    </PageShell>
  );
}

function TaskManagementCenter({ onBack }) {
  const [tasks, setTasks] = useState([
    { id:1,title:"Contact 5 potential hosts",       priority:"High",   done:false,due:"Jun 18" },
    { id:2,title:"Submit agency evaluation report", priority:"High",   done:false,due:"Jun 19" },
    { id:3,title:"Follow up with StarPro QA",       priority:"Medium", done:true, due:"Jun 17" },
    { id:4,title:"Launch Q2 recruitment campaign",  priority:"Medium", done:false,due:"Jun 20" },
  ]);
  const prioColor = { High:"#EF4444",Medium:"#F59E0B",Low:"#60A5FA" };
  const toggle = (id) => setTasks(t => t.map(x => x.id===id ? {...x,done:!x.done} : x));
  return (
    <PageShell title="✅ Task Management Center" subtitle="Daily Business Development Tasks" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Tasks",  v:tasks.length,            color:"#60A5FA",icon:"📋" },
        { l:"Completed",    v:tasks.filter(t=>t.done).length, color:"#10B981",icon:"✅" },
        { l:"Pending",      v:tasks.filter(t=>!t.done).length,color:"#F59E0B",icon:"⏳" },
      ]} />
      <ActionRow title="⚡ CREATE" actions={["Create Task","Assign Task"]} />
      {tasks.map((t,i) => (
        <motion.div key={t.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          onClick={() => toggle(t.id)}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,cursor:"pointer",opacity:t.done?0.6:1 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:26,height:26,borderRadius:"50%",border:`2px solid ${t.done?"#10B981":"rgba(255,255,255,0.2)"}`,background:t.done?"rgba(16,185,129,0.2)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              {t.done && <span style={{ fontSize:12 }}>✓</span>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:800,color:"#fff",textDecoration:t.done?"line-through":"none" }}>{t.title}</div>
              <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>Due: {t.due} · <span style={{ color:prioColor[t.priority],fontWeight:800 }}>{t.priority}</span></div>
            </div>
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function DocumentCenter({ onBack }) {
  const docs = [
    { name:"Host Recruitment Contract Template", icon:"📄", type:"Contract",  date:"Jun 10", size:"248 KB" },
    { name:"Agency Partnership Agreement",       icon:"🤝", type:"Agreement", date:"Jun 5",  size:"412 KB" },
    { name:"Q2 Business Development Proposal",   icon:"📊", type:"Proposal",  date:"May 28", size:"1.2 MB" },
    { name:"Market Expansion Plan 2026",         icon:"🌎", type:"Plan",      date:"May 15", size:"890 KB" },
  ];
  const typeColors = { Contract:"#1F6BFF",Agreement:"#10B981",Proposal:"#FFC83D",Plan:"#A78BFA" };
  return (
    <PageShell title="📁 Document Center" subtitle="Contracts, Proposals & Business Docs" onBack={onBack}>
      <ActionRow title="⚡ UPLOAD" actions={["Upload Document"]} />
      {docs.map((d,i) => (
        <motion.div key={d.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${typeColors[d.type]}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{d.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{d.name}</div>
            <div style={{ display:"flex",gap:8,marginTop:3 }}>
              <span style={{ fontSize:9,padding:"2px 6px",borderRadius:6,background:`${typeColors[d.type]}18`,color:typeColors[d.type],fontWeight:700 }}>{d.type}</span>
              <span style={{ fontSize:9,color:"#9CA3AF" }}>{d.date} · {d.size}</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:4 }}>
            {["⬇️","📤","🗄️"].map((icon,ii) => (
              <motion.button key={ii} whileTap={{ scale:0.9 }}
                style={{ width:28,height:28,borderRadius:8,border:"none",cursor:"pointer",background:"rgba(255,255,255,0.08)",fontSize:13 }}>
                {icon}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function AnalyticsCenter({ onBack }) {
  return (
    <PageShell title="📊 Analytics Center" subtitle="Comprehensive Business Analytics" onBack={onBack}>
      <KpiGrid items={[
        { l:"Hosts Recruited",  v:"214",   color:"#A78BFA",icon:"🎙️" },
        { l:"Revenue Contrib.", v:"$62K",  color:"#FFC83D",icon:"💰" },
        { l:"Growth Rate",      v:"+22%",  color:"#10B981",icon:"📈" },
      ]} />
      <MiniChart label="📈 RECRUITMENT GROWTH" data={growthData} color="#1F6BFF" gradId="ac1" />
      <MiniChart label="💰 REVENUE TREND" data={revenueData} color="#FFC83D" gradId="ac2" />
      <MiniChart label="🎙️ HOST ONBOARDING" data={hostData} color="#A78BFA" gradId="ac3" type="bar" />
      <ActionRow title="⚡" actions={["View Analytics","Generate Report","Export Analytics","Compare Performance"]} />
    </PageShell>
  );
}

function BusinessSettingsCenter({ onBack }) {
  const settings = [
    { name:"Recruitment Settings",    icon:"🎙️",desc:"Host/agent recruitment rules",        color:"#A78BFA" },
    { name:"Campaign Settings",       icon:"📣",desc:"Default campaign parameters",          color:"#F97316" },
    { name:"Commission Settings",     icon:"💰",desc:"Commission rates & structures",        color:"#FFC83D" },
    { name:"Partnership Settings",    icon:"🤝",desc:"Partnership terms & conditions",       color:"#60A5FA" },
    { name:"Notification Preferences",icon:"🔔",desc:"Alert and report preferences",         color:"#10B981" },
    { name:"Region Preferences",      icon:"🌍",desc:"Primary region and market settings",   color:"#EC4899" },
  ];
  return (
    <PageShell title="⚙️ Business Settings" subtitle="Business Development Configuration" onBack={onBack}>
      {settings.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
          <div style={{ width:44,height:44,borderRadius:13,background:`${s.color}18`,border:`1px solid ${s.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{s.name}</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>{s.desc}</div>
          </div>
          <span style={{ fontSize:16,color:"#4B5563" }}>›</span>
        </motion.div>
      ))}
      <ActionRow title="⚡" actions={["Update Settings","Manage Preferences","Save Configuration"]} />
    </PageShell>
  );
}

function BDExclusiveTools({ onBack }) {
  const tools = [
    { name:"Launch Recruitment Drive",   icon:"🚀",desc:"Start a mass recruitment campaign",  color:"#1F6BFF",danger:false },
    { name:"Create Expansion Plan",      icon:"🌎",desc:"Design a new market expansion plan", color:"#10B981",danger:false },
    { name:"Manage Strategic Partnerships",icon:"🤝",desc:"Create and manage partnerships",   color:"#FFC83D",danger:false },
    { name:"Growth Optimization",        icon:"📈",desc:"AI-powered growth optimization",     color:"#A78BFA",danger:false },
  ];
  return (
    <PageShell title="🚀 BD Exclusive Tools" subtitle="Special Business Developer Tools" onBack={onBack}>
      <div style={{ background:"rgba(31,107,255,0.08)",border:"1px solid rgba(31,107,255,0.25)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#60A5FA",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools are available exclusively for Business Developers. All actions are logged and monitored by the Business Director.</div>
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
    </PageShell>
  );
}

/* ─────────────── MODULE REGISTRY ─────────────── */
const MODULE_SCREENS = {
  overview:      BusinessOverviewCenter,
  host_recruit:  HostRecruitmentCenter,
  agent_recruit: TalentAgentRecruitmentCenter,
  agency_dev:    AgencyDevelopmentCenter,
  leads:         LeadManagementCenter,
  market:        MarketExpansionCenter,
  partnerships:  PartnershipManagementCenter,
  campaigns:     CampaignManagementCenter,
  revenue:       RevenueGrowthCenter,
  regional:      RegionalPerformanceCenter,
  applications:  ApplicationManagementCenter,
  comms:         CommunicationCenter,
  events:        EventDevelopmentCenter,
  performance:   PerformanceTrackingCenter,
  bi:            BusinessIntelligenceCenter,
  tasks:         TaskManagementCenter,
  documents:     DocumentCenter,
  analytics:     AnalyticsCenter,
  settings:      BusinessSettingsCenter,
  exclusive:     BDExclusiveTools,
};

const MODULES = [
  { id:"overview",     icon:"📊", label:"Business Overview",    subtitle:"Performance Summary",     gradient:"linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow:"rgba(31,107,255,0.4)" },
  { id:"host_recruit", icon:"🎙️", label:"Host Recruitment",     subtitle:"Talent Acquisition",      gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"agent_recruit",icon:"🤝", label:"Agent Recruitment",    subtitle:"Agent Onboarding",        gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"agency_dev",   icon:"🏢", label:"Agency Development",   subtitle:"Agency Network",          gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"leads",        icon:"🎯", label:"Lead Management",      subtitle:"Opportunities",           gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"market",       icon:"🌎", label:"Market Expansion",     subtitle:"New Markets",             gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.35)" },
  { id:"partnerships", icon:"🤝", label:"Partnership Mgmt",     subtitle:"Strategic Alliances",     gradient:"linear-gradient(145deg,#06B6D4,#0E7490)", glow:"rgba(6,182,212,0.35)" },
  { id:"campaigns",    icon:"📣", label:"Campaign Mgmt",        subtitle:"Recruitment Campaigns",   gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"revenue",      icon:"💰", label:"Revenue Growth",       subtitle:"Revenue Tracking",        gradient:"linear-gradient(145deg,#F59E0B,#B45309)", glow:"rgba(245,158,11,0.35)" },
  { id:"regional",     icon:"📈", label:"Regional Performance", subtitle:"Region Analytics",        gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.3)" },
  { id:"applications", icon:"📋", label:"Applications",         subtitle:"Review & Approve",        gradient:"linear-gradient(145deg,#7C3AED,#4C1D95)", glow:"rgba(124,58,237,0.35)" },
  { id:"comms",        icon:"📨", label:"Communication",        subtitle:"Message & Announce",      gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"events",       icon:"🎉", label:"Event Development",    subtitle:"Growth Events",           gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"performance",  icon:"🏆", label:"Performance Tracking", subtitle:"KPIs & Targets",          gradient:"linear-gradient(145deg,#FFC83D,#1F6BFF)", glow:"rgba(255,200,61,0.35)" },
  { id:"bi",           icon:"🧠", label:"Business Intelligence",subtitle:"AI Forecasting",          gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"tasks",        icon:"✅", label:"Task Management",      subtitle:"Daily Tasks",             gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"documents",    icon:"📁", label:"Document Center",      subtitle:"Files & Contracts",       gradient:"linear-gradient(145deg,#F97316,#C2410C)", glow:"rgba(249,115,22,0.35)" },
  { id:"analytics",    icon:"📊", label:"Analytics Center",     subtitle:"Full Analytics",          gradient:"linear-gradient(145deg,#1F6BFF,#7C3AED)", glow:"rgba(31,107,255,0.35)" },
  { id:"settings",     icon:"⚙️", label:"Settings Center",      subtitle:"BD Configuration",        gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",    icon:"🚀", label:"BD Exclusive Tools",   subtitle:"Special Powers",          gradient:"linear-gradient(145deg,#FFC83D,#EF4444)", glow:"rgba(255,200,61,0.5)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function BusinessDeveloperDashboard() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  if (activeModule) {
    const Screen = MODULE_SCREENS[activeModule];
    if (Screen) return <Screen onBack={() => setActiveModule(null)} />;
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(31,107,255,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(31,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#60A5FA"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🚀 Business Developer Dashboard</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>Growth · Expansion · Partnerships · Revenue</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🚀 BD</span></div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(31,107,255,0.18),transparent 70%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:-30,left:-30,width:140,height:140,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,200,61,0.1),transparent 70%)",pointerEvents:"none" }} />
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#1F6BFF,#10B981)",marginBottom:12 }} />
          <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · BUSINESS DEVELOPMENT DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Business Developer Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Platform expansion, agency growth, talent acquisition, host recruitment, strategic partnerships, and revenue development.</div>
        </div>

        <KpiGrid items={[
          { l:"Hosts Recruited",  v:"214",    color:"#A78BFA",icon:"🎙️" },
          { l:"Agents Onboarded", v:"42",     color:"#60A5FA",icon:"🤝" },
          { l:"Partner Agencies", v:"18",     color:"#FFC83D",icon:"🏢" },
          { l:"Monthly Growth",   v:"+22%",   color:"#10B981",icon:"📈" },
          { l:"New Applications", v:"40",     color:"#F59E0B",icon:"📋" },
          { l:"Active Campaigns", v:"3",      color:"#EC4899",icon:"📣" },
          { l:"Revenue Contrib.", v:"$62K",   color:"#FFC83D",icon:"💰" },
          { l:"Target Achievement",v:"87%",   color:"#10B981",icon:"🎯" },
          { l:"New Partnerships", v:"3",      color:"#06B6D4",icon:"🤝" },
          { l:"Active Leads",     v:"84",     color:"#A855F7",icon:"🎯" },
          { l:"Active Events",    v:"2",      color:"#A78BFA",icon:"🎉" },
          { l:"Business Score",   v:"92/100", color:"#FFC83D",icon:"🏆" },
        ]} />
      </div>

      {/* Module Grid */}
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
                  background:mod.featured?"linear-gradient(90deg,#FFC83D,#EF4444,#FFC83D)":`linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#1F6BFF"},rgba(255,200,61,0.4))` }} />
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%" }} />
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#60A5FA",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
                {mod.featured && <div style={{ position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#FFC83D",boxShadow:"0 0 7px rgba(255,200,61,0.8)" }} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}