/**
 * CountryManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Country Manager
 * Theme: Enterprise Dark Blue · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ─────────────── UTILS ─────────────── */
const S = {
  page: { minHeight: "100dvh", background: "linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)", fontFamily: "'Inter',system-ui,sans-serif", paddingBottom: 90 },
  glass: (extra = {}) => ({ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(14px)", border: "1px solid rgba(31,107,255,0.18)", borderRadius: 18, ...extra }),
  goldBadge: { padding: "4px 10px", borderRadius: 20, background: "rgba(255,200,61,0.12)", border: "1px solid rgba(255,200,61,0.3)" },
  sectionTitle: { fontSize: 10, fontWeight: 800, color: "#60A5FA", letterSpacing: "0.08em", marginBottom: 10 },
  kpiCard: (color) => ({ background: `linear-gradient(145deg,${color}18,${color}08)`, border: `1px solid ${color}30`, borderRadius: 14, padding: "12px 10px", textAlign: "center" }),
  chip: (color) => ({ display: "inline-block", padding: "4px 9px", borderRadius: 8, fontSize: 9, fontWeight: 700, background: `${color}15`, color, border: `1px solid ${color}25`, margin: "2px" }),
  actionBtn: (grad, glow) => ({ padding: "8px 12px", borderRadius: 11, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 10, color: "#fff", background: grad, boxShadow: `0 4px 12px ${glow}`, margin: "3px", flexShrink: 0 }),
};

const revData  = [{ d:"Jan",v:28},{ d:"Feb",v:34},{ d:"Mar",v:29},{ d:"Apr",v:42},{ d:"May",v:51},{ d:"Jun",v:48}];
const userData = [{ d:"Jan",v:84},{ d:"Feb",v:98},{ d:"Mar",v:112},{ d:"Apr",v:127},{ d:"May",v:143},{ d:"Jun",v:158}];
const hostData = [{ d:"Jan",v:12},{ d:"Feb",v:18},{ d:"Mar",v:24},{ d:"Apr",v:29},{ d:"May",v:35},{ d:"Jun",v:41}];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function PageShell({ title, subtitle, onBack, flag, children }) {
  return (
    <div style={S.page}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(31,107,255,0.2)",boxShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(31,107,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#60A5FA" />
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>{subtitle}</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>{flag || "🌍"} CM</span></div>
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
      <div style={S.sectionTitle}>{title}</div>
      <div style={{ display:"flex",flexWrap:"wrap" }}>
        {actions.map((a,i) => (
          <motion.button key={a} whileTap={{ scale:0.92 }} style={S.actionBtn(grads[i%grads.length],glows[i%glows.length])}>{a}</motion.button>
        ))}
      </div>
    </div>
  );
}

function ChipList({ title, items, color="#60A5FA" }) {
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      <div style={S.sectionTitle}>{title}</div>
      <div>{items.map(t => <span key={t} style={S.chip(color)}>{t}</span>)}</div>
    </div>
  );
}

function MiniChart({ label, data, color, gradient }) {
  return (
    <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
      <div style={S.sectionTitle}>{label}</div>
      <ResponsiveContainer width="100%" height={90}>
        <AreaChart data={data}>
          <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.45}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
          <XAxis dataKey="d" tick={{ fontSize:9,fill:"#60A5FA" }} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{ background:"#0D1B3E",border:`1px solid ${color}`,borderRadius:8,color:"#fff",fontSize:10 }}/>
          <Area type="monotone" dataKey="v" stroke={color} fill={`url(#${gradient})`} strokeWidth={2} dot={{ fill:"#FFC83D",r:2 }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─────────────── MODULE SCREENS ─────────────── */

function CountryOverview({ onBack }) {
  return (
    <PageShell title="🌍 Country Overview" subtitle="Country Performance Summary" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Users",    v:"214K",  icon:"👥", color:"#60A5FA" },
        { l:"Total Hosts",    v:"7.4K",  icon:"🎙️", color:"#A78BFA" },
        { l:"Agencies",       v:"18",    icon:"🏢", color:"#FFC83D" },
        { l:"Today Revenue",  v:"$4.8K", icon:"💰", color:"#10B981" },
        { l:"Live Streams",   v:"284",   icon:"📡", color:"#EF4444" },
        { l:"VIP Users",      v:"1.2K",  icon:"💎", color:"#EC4899" },
      ]} />
      <MiniChart label="📊 REVENUE TREND (USD K)" data={revData} color="#1F6BFF" gradient="cov1" />
      <MiniChart label="👥 USER GROWTH (K)" data={userData} color="#10B981" gradient="cov2" />
      <ActionRow title="⚡ QUICK ACTIONS" actions={["Open Analytics","Revenue Report","Export Report"]} />
    </PageShell>
  );
}

function CountrySearchCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("User ID");
  const types = ["User ID","VYRO ID","Username","Phone Number","Email","Host ID","Agent ID","Agency ID"];
  const mockResult = query ? { name:"Sara_QA", id:"USR-21483", level:"LV28", country:"🇶🇦 Qatar", status:"Active", wallet:"1,240 Coins" } : null;
  return (
    <PageShell title="🔍 Country Search Center" subtitle="Search Users, Hosts, Agents & Agencies" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>🔎 SEARCH BY</div>
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:6,marginBottom:10 }}>
          {types.map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setType(t)}
              style={{ flexShrink:0,padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:type===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:type===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search by ${type}…`}
            style={{ flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(31,107,255,0.25)",borderRadius:11,padding:"10px 13px",color:"#fff",fontSize:12,outline:"none" }}/>
          <motion.button whileTap={{ scale:0.92 }} style={{ padding:"10px 14px",borderRadius:11,background:"linear-gradient(135deg,#1F6BFF,#6366F1)",border:"none",cursor:"pointer" }}>
            <Search size={14} color="#fff"/>
          </motion.button>
        </div>
      </div>
      {mockResult && (
        <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
          <div style={S.sectionTitle}>✅ RESULT</div>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
            <div style={{ width:46,height:46,borderRadius:13,background:"linear-gradient(135deg,#1F6BFF,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{mockResult.name}</div>
              <div style={{ fontSize:10,color:"#60A5FA" }}>{mockResult.id} · {mockResult.country}</div>
              <div style={{ fontSize:9,color:"#10B981",marginTop:2 }}>● {mockResult.status} · {mockResult.level}</div>
            </div>
            <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{mockResult.wallet}</div>
          </div>
          <ActionRow title="⚡ ACTIONS" actions={["View Profile","Send Message","Issue Warning","Suspend","Reactivate"]} />
        </div>
      )}
    </PageShell>
  );
}

function UserManagementCenter({ onBack }) {
  const users = [
    { name:"Sara_QA",    id:"USR-21483",status:"Active",  level:"LV28",joined:"Jun 1, 2026" },
    { name:"Ahmed_QA",   id:"USR-18421",status:"Active",  level:"LV41",joined:"May 14, 2026" },
    { name:"NoorStar",   id:"USR-09182",status:"Suspended",level:"LV15",joined:"Apr 22, 2026" },
  ];
  return (
    <PageShell title="👤 User Management Center" subtitle="Manage Country Users" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Users",   v:"214K", color:"#60A5FA",icon:"👥" },
        { l:"New Today",     v:"284",  color:"#10B981",icon:"🆕" },
        { l:"Suspended",     v:"41",   color:"#EF4444",icon:"🚫" },
      ]} />
      {users.map((u,i) => (
        <motion.div key={u.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(31,107,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{u.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{u.id} · {u.level}</div>
            </div>
            <div style={{ padding:"3px 8px",borderRadius:7,background:u.status==="Active"?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)",border:`1px solid ${u.status==="Active"?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)"}` }}>
              <span style={{ fontSize:9,fontWeight:800,color:u.status==="Active"?"#10B981":"#EF4444" }}>{u.status}</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
            {["View Profile","Send Message","Issue Warning",u.status==="Active"?"Suspend":"Reactivate"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ padding:"6px 10px",borderRadius:9,border:"none",cursor:"pointer",fontSize:8,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#EF4444,#B91C1C)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function HostManagementCenter({ onBack }) {
  const hosts = [
    { name:"@SaraLive",   id:"HST-4821",viewers:"4.2K",revenue:"$1.2K",status:"Active" },
    { name:"@MoonVoice",  id:"HST-3812",viewers:"2.8K",revenue:"$840",status:"Active" },
    { name:"@StarQA",     id:"HST-2948",viewers:"1.1K",revenue:"$320",status:"Suspended" },
  ];
  return (
    <PageShell title="🎙️ Host Management Center" subtitle="Manage Country Hosts" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Hosts",  v:"7.4K",  color:"#A78BFA",icon:"🎙️" },
        { l:"Active Now",   v:"284",   color:"#10B981",icon:"📡" },
        { l:"Suspended",    v:"18",    color:"#EF4444",icon:"🚫" },
      ]} />
      <MiniChart label="📈 HOST GROWTH" data={hostData} color="#A78BFA" gradient="hst1" />
      {hosts.map((h,i) => (
        <motion.div key={h.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🎙️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{h.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{h.id} · {h.viewers} viewers</div>
            </div>
            <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{h.revenue}</div>
          </div>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
            {["View Host","Performance Report","Feature Host","Warning",h.status==="Active"?"Suspend":"Reactivate"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ padding:"6px 10px",borderRadius:9,border:"none",cursor:"pointer",fontSize:8,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#A78BFA,#7C3AED)","linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#EF4444,#B91C1C)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function TalentAgentCenter({ onBack }) {
  const agents = [
    { name:"Ali Hassan",  id:"AGT-1842",hosts:12,revenue:"$3.2K",status:"Active" },
    { name:"Fatima Al-Q", id:"AGT-0921",hosts:8, revenue:"$1.8K",status:"Active" },
  ];
  return (
    <PageShell title="🤝 Talent Agent Management" subtitle="Manage Country Agents" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Agents",v:"142", color:"#60A5FA",icon:"🤝" },
        { l:"Active",      v:"128", color:"#10B981",icon:"✅" },
        { l:"Total Hosts", v:"842", color:"#A78BFA",icon:"🎙️" },
      ]} />
      {agents.map((a,i) => (
        <motion.div key={a.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🤝</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{a.id} · {a.hosts} hosts managed</div>
            </div>
            <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{a.revenue}</div>
          </div>
          <ActionRow title="⚡" actions={["View Agent","Performance Analytics","Suspend Agent","Issue Warning"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function AgencyManagementCenter({ onBack }) {
  const agencies = [
    { name:"StarPro QA",  id:"AGC-041",hosts:48, revenue:"$12.4K",status:"Active" },
    { name:"EliteQA",     id:"AGC-028",hosts:32, revenue:"$8.1K", status:"Active" },
    { name:"VoiceHouse",  id:"AGC-019",hosts:21, revenue:"$4.8K", status:"Suspended" },
  ];
  return (
    <PageShell title="🏢 Agency Management Center" subtitle="Monitor Country Agencies" onBack={onBack}>
      <KpiGrid items={[
        { l:"Agencies",    v:"18",    color:"#FFC83D",icon:"🏢" },
        { l:"Active",      v:"16",    color:"#10B981",icon:"✅" },
        { l:"Total Hosts", v:"7.4K",  color:"#A78BFA",icon:"🎙️" },
      ]} />
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
              <div style={{ fontSize:12,fontWeight:900,color:"#FFC83D" }}>{ag.revenue}</div>
              <div style={{ fontSize:8,color:ag.status==="Active"?"#10B981":"#EF4444",fontWeight:700 }}>{ag.status}</div>
            </div>
          </div>
          <ActionRow title="⚡" actions={["View Agency","Revenue Analytics","Suspend Agency","Issue Warning"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function CountryApplicationCenter({ onBack }) {
  const apps = [
    { type:"Host Application",         icon:"🎙️", pending:24,color:"#A78BFA" },
    { type:"Talent Agent Application", icon:"🤝", pending:8, color:"#60A5FA" },
    { type:"Agency Application",       icon:"🏢", pending:3, color:"#FFC83D" },
  ];
  return (
    <PageShell title="📋 Country Application Center" subtitle="Review Country Applications" onBack={onBack}>
      <KpiGrid items={[
        { l:"Total Pending",  v:"35",  color:"#FFC83D",icon:"⏳" },
        { l:"Approved Today", v:"12",  color:"#10B981",icon:"✅" },
        { l:"Rejected Today", v:"4",   color:"#EF4444",icon:"❌" },
      ]} />
      {apps.map((a,i) => (
        <motion.div key={a.type} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"14px",marginBottom:12 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${a.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{a.type}</div>
              <div style={{ fontSize:10,color:"#60A5FA" }}>{a.pending} pending review</div>
            </div>
            <div style={{ padding:"3px 8px",borderRadius:8,background:"rgba(255,200,61,0.12)",border:"1px solid rgba(255,200,61,0.3)" }}>
              <span style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{a.pending}</span>
            </div>
          </div>
          <ActionRow title="⚡ ACTIONS" actions={["Approve","Reject","Hold","Request Documents"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function CountryRevenueCenter({ onBack }) {
  const sources = [
    { l:"Gifts",          v:"$9.2K",  pct:58,color:"#EC4899" },
    { l:"VIP",            v:"$3.8K",  pct:24,color:"#A78BFA" },
    { l:"Coin Purchases", v:"$2.8K",  pct:18,color:"#FFC83D" },
  ];
  return (
    <PageShell title="💰 Country Revenue Center" subtitle="Country Financial Overview" onBack={onBack}>
      <KpiGrid items={[
        { l:"Today",       v:"$4.8K",  color:"#FFC83D",icon:"📈" },
        { l:"This Month",  v:"$48K",   color:"#10B981",icon:"💰" },
        { l:"Growth",      v:"+22%",   color:"#60A5FA",icon:"🚀" },
      ]} />
      <MiniChart label="📊 REVENUE TREND (USD K)" data={revData} color="#FFC83D" gradient="rev1" />
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>💡 REVENUE SOURCES</div>
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
      <ActionRow title="⚡ ACTIONS" actions={["Revenue Analytics","Revenue Forecast","Export Revenue Report"]} />
    </PageShell>
  );
}

function CountryGiftCenter({ onBack }) {
  const gifts = [
    { name:"Diamond Star",icon:"💎",revenue:"$2.4K",uses:"9.2K" },
    { name:"Golden Rose", icon:"🌹",revenue:"$1.8K",uses:"18.1K" },
    { name:"Crown Jewel", icon:"👑",revenue:"$1.2K",uses:"4.8K" },
  ];
  return (
    <PageShell title="🎁 Country Gift Center" subtitle="Gift Analytics & Performance" onBack={onBack}>
      <KpiGrid items={[
        { l:"Gifts Sent", v:"84K",   color:"#EC4899",icon:"🎁" },
        { l:"Revenue",    v:"$9.2K", color:"#FFC83D",icon:"💰" },
        { l:"Top Gift",   v:"Diamond",color:"#60A5FA",icon:"💎" },
      ]} />
      {gifts.map((g,i) => (
        <div key={g.name} style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:42,height:42,borderRadius:12,background:"rgba(236,72,153,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{g.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{g.name}</div>
            <div style={{ fontSize:9,color:"#60A5FA" }}>{g.uses} uses</div>
          </div>
          <div style={{ fontSize:12,fontWeight:900,color:"#FFC83D" }}>{g.revenue}</div>
        </div>
      ))}
      <ActionRow title="⚡ ACTIONS" actions={["Gift Statistics","Gift Reports","Gift Trends"]} />
    </PageShell>
  );
}

function CountryCoinCenter({ onBack }) {
  return (
    <PageShell title="🪙 Country Coin Center" subtitle="Coin Economy Monitoring" onBack={onBack}>
      <KpiGrid items={[
        { l:"Coins Purchased",v:"1.2M",  color:"#FFC83D",icon:"🪙" },
        { l:"Coins Spent",    v:"984K",  color:"#10B981",icon:"💸" },
        { l:"Coins Gifted",   v:"342K",  color:"#EC4899",icon:"🎁" },
      ]} />
      <MiniChart label="🪙 COIN PURCHASES" data={revData} color="#FFC83D" gradient="coin1" />
      <ActionRow title="⚡ ACTIONS" actions={["Coin Analytics","Promotion Reports","Sales Reports"]} />
    </PageShell>
  );
}

function CountryRankingCenter({ onBack }) {
  const rankings = [
    { title:"Top Hosts",    items:["🥇 @SaraLive — $1.2K","🥈 @MoonVoice — $840","🥉 @StarQA — $620"] },
    { title:"Top Gifters",  items:["🥇 @DiamondQA — 480K","🥈 @GoldRose — 320K","🥉 @StarLight — 218K"] },
    { title:"Top Agencies", items:["🥇 StarPro QA — $12.4K","🥈 EliteQA — $8.1K","🥉 VoiceHouse — $4.8K"] },
  ];
  return (
    <PageShell title="🏆 Country Ranking Center" subtitle="Country Leaderboards" onBack={onBack}>
      {rankings.map((r,i) => (
        <motion.div key={r.title} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
          <div style={S.sectionTitle}>🏆 {r.title.toUpperCase()}</div>
          {r.items.map((item,ii) => (
            <div key={item} style={{ display:"flex",gap:10,padding:"7px 0",borderBottom:ii<r.items.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
              <span style={{ fontSize:11,color:"#DCE3F0",flex:1 }}>{item}</span>
            </div>
          ))}
        </motion.div>
      ))}
      <ActionRow title="⚡" actions={["View Rankings","Export Rankings"]} />
    </PageShell>
  );
}

function LiveMonitoringCenter({ onBack }) {
  const streams = [
    { id:"LV-1842",host:"@SaraLive",viewers:"4.2K",revenue:"$284",type:"Live" },
    { id:"PK-0921",host:"@MoonVoice vs @StarQA",viewers:"8.1K",revenue:"$641",type:"PK" },
    { id:"VR-0482",host:"@QANight",viewers:"1.8K",revenue:"$96",type:"Voice" },
  ];
  return (
    <PageShell title="📡 Live Monitoring Center" subtitle="Real-Time Stream Monitor" onBack={onBack}>
      <KpiGrid items={[
        { l:"Live Streams",v:"284",   color:"#EF4444",icon:"📡" },
        { l:"Viewers",     v:"84.2K", color:"#60A5FA",icon:"👁️" },
        { l:"PK Battles",  v:"12",    color:"#FFC83D",icon:"⚔️" },
      ]} />
      {streams.map((s,i) => (
        <motion.div key={s.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"#EF4444",boxShadow:"0 0 6px #EF4444",flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.id} · {s.host}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{s.type} · {s.viewers} viewers</div>
            </div>
            <span style={{ fontSize:11,fontWeight:900,color:"#FFC83D" }}>{s.revenue}</span>
          </div>
          <div style={{ display:"flex",gap:5 }}>
            {["Watch Live","Send Warning","Contact Host","End Stream"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px 4px",borderRadius:9,border:"none",cursor:"pointer",fontSize:8,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#EF4444,#B91C1C)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function PKMonitoringCenter({ onBack }) {
  const pks = [
    { id:"PK-0921",p1:"@MoonVoice",p2:"@StarQA",viewers:"8.1K",gift1:"$420",gift2:"$221" },
    { id:"PK-0814",p1:"@SaraLive", p2:"@NoorQA",viewers:"3.4K",gift1:"$180",gift2:"$143" },
  ];
  return (
    <PageShell title="⚔️ PK Monitoring Center" subtitle="PK Battle Monitor" onBack={onBack}>
      <KpiGrid items={[
        { l:"Active PKs",  v:"12",   color:"#F97316",icon:"⚔️" },
        { l:"Viewers",     v:"28.4K",color:"#60A5FA",icon:"👁️" },
        { l:"Revenue",     v:"$1.8K",color:"#FFC83D",icon:"💰" },
      ]} />
      {pks.map((pk,i) => (
        <motion.div key={pk.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:9,color:"#9CA3AF" }}>{pk.id}</span>
            <span style={{ fontSize:9,color:"#60A5FA" }}>{pk.viewers} viewers</span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
            <div style={{ flex:1,textAlign:"center" }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{pk.p1}</div>
              <div style={{ fontSize:11,fontWeight:900,color:"#1F6BFF" }}>{pk.gift1}</div>
            </div>
            <div style={{ fontSize:14,fontWeight:900,color:"#EF4444" }}>VS</div>
            <div style={{ flex:1,textAlign:"center" }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{pk.p2}</div>
              <div style={{ fontSize:11,fontWeight:900,color:"#A78BFA" }}>{pk.gift2}</div>
            </div>
          </div>
          <ActionRow title="⚡" actions={["Monitor PK","Issue Warning","End PK"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function EventManagementCenter({ onBack }) {
  const events = [
    { name:"Qatar Voice Battle", status:"Active",  prize:"5,000 Coins", ends:"Jun 20" },
    { name:"Top Host of the Week",status:"Scheduled",prize:"3,000 Coins",ends:"Jun 21" },
    { name:"Gift Fest June",      status:"Ended",   prize:"10,000 Coins",ends:"Jun 15" },
  ];
  const statusColors = { Active:"#10B981",Scheduled:"#F59E0B",Ended:"#9CA3AF" };
  return (
    <PageShell title="🎉 Event Management Center" subtitle="Country Events & Competitions" onBack={onBack}>
      <ActionRow title="⚡ CREATE NEW EVENT" actions={["Create Event","Launch Event"]} />
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(168,85,247,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🎉</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>Prize: {e.prize} · Ends {e.ends}</div>
            </div>
            <div style={{ padding:"3px 8px",borderRadius:8,background:`${statusColors[e.status]}18`,border:`1px solid ${statusColors[e.status]}30` }}>
              <span style={{ fontSize:9,fontWeight:800,color:statusColors[e.status] }}>{e.status}</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:5 }}>
            {(e.status!=="Ended"?["Edit Event","Launch Event","End Event"]:["View Results"]).map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px 4px",borderRadius:9,border:"none",cursor:"pointer",fontSize:8,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#9CA3AF,#6B7280)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function VIPManagementCenter({ onBack }) {
  const vips = [
    { name:"@DiamondQA",tier:"VIP 5",spent:"8.4M coins",joined:"Jan 2026" },
    { name:"@GoldRose",  tier:"VIP 4",spent:"3.2M coins",joined:"Mar 2026" },
    { name:"@StarLight", tier:"VIP 3",spent:"1.8M coins",joined:"Apr 2026" },
  ];
  const tierColors = { "VIP 5":"#FFC83D","VIP 4":"#A78BFA","VIP 3":"#60A5FA" };
  return (
    <PageShell title="💎 VIP Management Center" subtitle="Country VIP Members" onBack={onBack}>
      <KpiGrid items={[
        { l:"VIP Members", v:"1.2K",  color:"#FFC83D",icon:"💎" },
        { l:"VIP Revenue", v:"$3.8K", color:"#A78BFA",icon:"💰" },
        { l:"New VIPs",    v:"24",    color:"#10B981",icon:"🆕" },
      ]} />
      {vips.map((v,i) => (
        <motion.div key={v.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>💎</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{v.name}</div>
            <div style={{ fontSize:9,color:"#60A5FA" }}>{v.spent} · Joined {v.joined}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10,fontWeight:900,color:tierColors[v.tier] }}>{v.tier}</div>
            <motion.button whileTap={{ scale:0.9 }}
              style={{ marginTop:4,padding:"4px 9px",borderRadius:8,border:"none",cursor:"pointer",fontSize:8,fontWeight:800,color:"#fff",background:"linear-gradient(135deg,#FFC83D,#F59E0B)" }}>
              Upgrade VIP
            </motion.button>
          </div>
        </motion.div>
      ))}
      <ActionRow title="⚡" actions={["View VIP","VIP Analytics"]} />
    </PageShell>
  );
}

function ReportManagementCenter({ onBack }) {
  const reports = [
    { type:"Spam / Bot Activity",  reporter:"@User_4821",target:"@SuspectQA",status:"Pending",  color:"#F59E0B" },
    { type:"Harassment",           reporter:"@User_2841",target:"@TrollUser", status:"Reviewing",color:"#1F6BFF" },
    { type:"Inappropriate Content",reporter:"@User_1924",target:"@HostXQA",  status:"Resolved", color:"#10B981" },
  ];
  const statusColors = { Pending:"#F59E0B",Reviewing:"#1F6BFF",Resolved:"#10B981" };
  return (
    <PageShell title="📑 Report Management Center" subtitle="Handle Reports & Violations" onBack={onBack}>
      <KpiGrid items={[
        { l:"Pending",   v:"18",  color:"#F59E0B",icon:"⏳" },
        { l:"Reviewing", v:"7",   color:"#1F6BFF",icon:"🔍" },
        { l:"Resolved",  v:"142", color:"#10B981",icon:"✅" },
      ]} />
      {reports.map((r,i) => (
        <motion.div key={r.type+i} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${statusColors[r.status]}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.type}</span>
            <div style={{ padding:"2px 7px",borderRadius:7,background:`${statusColors[r.status]}18`,border:`1px solid ${statusColors[r.status]}30` }}>
              <span style={{ fontSize:9,fontWeight:800,color:statusColors[r.status] }}>{r.status}</span>
            </div>
          </div>
          <div style={{ fontSize:10,color:"#60A5FA",marginBottom:10 }}>Reporter: {r.reporter} → Target: {r.target}</div>
          <ActionRow title="⚡" actions={["Review Report","Suspend Account","Resolve Case","Issue Warning"]} />
        </motion.div>
      ))}
    </PageShell>
  );
}

function SecurityCenter({ onBack }) {
  const logs = [
    { type:"Suspicious Login",  ip:"185.220.x.x",device:"iPhone",time:"8m ago",  risk:"Medium",color:"#F59E0B" },
    { type:"Multiple Failures", ip:"91.x.x.x",   device:"Android",time:"35m ago",risk:"High",  color:"#EF4444" },
    { type:"VPN Detected",      ip:"10.x.x.x",   device:"Chrome", time:"2h ago", risk:"Low",   color:"#60A5FA" },
  ];
  return (
    <PageShell title="🛡️ Security Center" subtitle="Country Security Monitor" onBack={onBack}>
      <KpiGrid items={[
        { l:"Active Alerts",v:"8",   color:"#EF4444",icon:"⚠️" },
        { l:"VPNs Blocked", v:"24",  color:"#F59E0B",icon:"🔒" },
        { l:"Security",     v:"A",   color:"#10B981",icon:"🛡️" },
      ]} />
      {logs.map((l,i) => (
        <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"12px 14px",marginBottom:10,borderLeft:`3px solid ${l.color}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
            <span style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{l.type}</span>
            <span style={{ fontSize:9,color:"#9CA3AF" }}>{l.time}</span>
          </div>
          <div style={{ fontSize:10,color:"#60A5FA",marginBottom:8 }}>IP: {l.ip} · Device: {l.device}</div>
          <div style={{ display:"flex",gap:5 }}>
            {["Lock Account","Freeze Account","Unlock Account","Review Logs"].map((a,ai) => (
              <motion.button key={a} whileTap={{ scale:0.9 }}
                style={{ flex:1,padding:"6px 3px",borderRadius:8,border:"none",cursor:"pointer",fontSize:7.5,fontWeight:800,color:"#fff",
                  background:["linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#1F6BFF,#6366F1)"][ai] }}>
                {a}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}
    </PageShell>
  );
}

function BroadcastCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Users");
  const [type, setType] = useState("Push Notification");
  return (
    <PageShell title="📢 Broadcast Center" subtitle="Country-Wide Announcements" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>👥 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Users","Hosts","Agents","Agencies","VIP Members"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:target===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>📡 MESSAGE TYPE</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["Push Notification","Email","In-App Message","SMS"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setType(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:type===t?"linear-gradient(135deg,#F59E0B,#D97706)":"rgba(255,255,255,0.06)",color:type===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Write your broadcast message…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(31,107,255,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }} />
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#1F6BFF,#7C3AED)",boxShadow:"0 6px 20px rgba(31,107,255,0.35)" }}>
          📢 Send Broadcast
        </motion.button>
      </div>
    </PageShell>
  );
}

function CountryAnalyticsCenter({ onBack }) {
  return (
    <PageShell title="📈 Country Analytics Center" subtitle="Growth & Performance Analytics" onBack={onBack}>
      <KpiGrid items={[
        { l:"Reports",   v:"42",    color:"#10B981",icon:"📊" },
        { l:"Forecast",  v:"+19% QoQ",color:"#FFC83D",icon:"📈" },
        { l:"Rank",      v:"#3 Global",color:"#60A5FA",icon:"🏆" },
      ]} />
      <MiniChart label="📊 REVENUE GROWTH" data={revData} color="#10B981" gradient="anl1" />
      <MiniChart label="👥 USER GROWTH (K)" data={userData} color="#60A5FA" gradient="anl2" />
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sectionTitle}>📊 MONTHLY HOSTS</div>
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={hostData}>
            <XAxis dataKey="d" tick={{ fontSize:9,fill:"#60A5FA" }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{ background:"#0D1B3E",border:"1px solid #A78BFA",borderRadius:8,color:"#fff",fontSize:10 }}/>
            <Bar dataKey="v" fill="#A78BFA" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ActionRow title="⚡" actions={["Generate Report","Export Analytics","View Forecast"]} />
    </PageShell>
  );
}

function CountrySettingsCenter({ onBack }) {
  const settings = [
    { name:"Country Language",       icon:"🌐",desc:"Default language settings",          color:"#60A5FA" },
    { name:"Commission Settings",    icon:"💰",desc:"Agent/agency commission rates",       color:"#FFC83D" },
    { name:"Event Settings",         icon:"🎉",desc:"Event rules and prize configuration", color:"#A78BFA" },
    { name:"Security Settings",      icon:"🛡️",desc:"Account security policies",           color:"#EF4444" },
    { name:"Notification Settings",  icon:"🔔",desc:"Broadcast and alert settings",        color:"#F97316" },
    { name:"VIP Settings",           icon:"💎",desc:"VIP tier and benefit settings",       color:"#EC4899" },
  ];
  return (
    <PageShell title="⚙️ Country Settings Center" subtitle="Country Configuration" onBack={onBack}>
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
      <ActionRow title="⚡" actions={["Update Settings","Save Configuration","Reset Settings"]} />
    </PageShell>
  );
}

/* ─────────────── MODULE REGISTRY ─────────────── */
const MODULE_SCREENS = {
  overview:      CountryOverview,
  search:        CountrySearchCenter,
  users:         UserManagementCenter,
  hosts:         HostManagementCenter,
  agents:        TalentAgentCenter,
  agencies:      AgencyManagementCenter,
  applications:  CountryApplicationCenter,
  revenue:       CountryRevenueCenter,
  gifts:         CountryGiftCenter,
  coins:         CountryCoinCenter,
  rankings:      CountryRankingCenter,
  live:          LiveMonitoringCenter,
  pk:            PKMonitoringCenter,
  events:        EventManagementCenter,
  vip:           VIPManagementCenter,
  reports:       ReportManagementCenter,
  security:      SecurityCenter,
  broadcast:     BroadcastCenter,
  analytics:     CountryAnalyticsCenter,
  settings:      CountrySettingsCenter,
};

const MODULES = [
  { id:"overview",     icon:"🌍", label:"Country Overview",   subtitle:"Executive Summary",      gradient:"linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow:"rgba(31,107,255,0.4)" },
  { id:"search",       icon:"🔍", label:"Search Center",      subtitle:"Find Anyone",            gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.35)" },
  { id:"users",        icon:"👤", label:"User Management",    subtitle:"Country Users",          gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"hosts",        icon:"🎙️", label:"Host Management",    subtitle:"Broadcasters",           gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"agents",       icon:"🤝", label:"Agent Management",   subtitle:"Talent Agents",          gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"agencies",     icon:"🏢", label:"Agency Management",  subtitle:"Country Agencies",       gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"applications", icon:"📋", label:"Applications",       subtitle:"Review & Approve",       gradient:"linear-gradient(145deg,#7C3AED,#4C1D95)", glow:"rgba(124,58,237,0.35)" },
  { id:"revenue",      icon:"💰", label:"Revenue Center",     subtitle:"Financial Overview",     gradient:"linear-gradient(145deg,#F59E0B,#B45309)", glow:"rgba(245,158,11,0.35)" },
  { id:"gifts",        icon:"🎁", label:"Gift Center",        subtitle:"Gift Analytics",         gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"coins",        icon:"🪙", label:"Coin Center",        subtitle:"Coin Economy",           gradient:"linear-gradient(145deg,#F97316,#C2410C)", glow:"rgba(249,115,22,0.35)" },
  { id:"rankings",     icon:"🏆", label:"Rankings",           subtitle:"Leaderboards",           gradient:"linear-gradient(145deg,#FFC83D,#1F6BFF)", glow:"rgba(255,200,61,0.35)" },
  { id:"live",         icon:"📡", label:"Live Monitoring",    subtitle:"Real-Time Streams",      gradient:"linear-gradient(145deg,#EF4444,#B91C1C)", glow:"rgba(239,68,68,0.35)" },
  { id:"pk",           icon:"⚔️", label:"PK Monitoring",      subtitle:"Battle Monitor",         gradient:"linear-gradient(145deg,#F97316,#7C3AED)", glow:"rgba(249,115,22,0.35)" },
  { id:"events",       icon:"🎉", label:"Event Management",   subtitle:"Competitions",           gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"vip",          icon:"💎", label:"VIP Management",     subtitle:"VIP Members",            gradient:"linear-gradient(145deg,#FFC83D,#EC4899)", glow:"rgba(255,200,61,0.4)" },
  { id:"reports",      icon:"📑", label:"Report Management",  subtitle:"Violations",             gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"security",     icon:"🛡️", label:"Security Center",    subtitle:"Protection",             gradient:"linear-gradient(145deg,#1F6BFF,#7C3AED)", glow:"rgba(31,107,255,0.35)" },
  { id:"broadcast",    icon:"📢", label:"Broadcast Center",   subtitle:"Announcements",          gradient:"linear-gradient(145deg,#F59E0B,#7C3AED)", glow:"rgba(245,158,11,0.3)" },
  { id:"analytics",    icon:"📈", label:"Analytics Center",   subtitle:"Growth & Insights",      gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"settings",     icon:"⚙️", label:"Settings Center",    subtitle:"Configuration",          gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function CountryManagerDashboard() {
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
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🌍 Country Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>Enterprise International Level · Country Scope</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🌍 CM</span></div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding:"14px 14px 0", position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(31,107,255,0.18),transparent 70%)",pointerEvents:"none" }} />
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#1F6BFF,#10B981)",marginBottom:12 }} />
          <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · COUNTRY MANAGER · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Country Manager Dashboard</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Complete country-level visibility — users, hosts, agents, agencies, revenue, events, and security.</div>
        </div>
        <KpiGrid items={[
          { l:"Total Users",   v:"214K",  color:"#60A5FA",icon:"👥" },
          { l:"Total Hosts",   v:"7.4K",  color:"#A78BFA",icon:"🎙️" },
          { l:"Agents",        v:"142",   color:"#10B981",icon:"🤝" },
          { l:"Agencies",      v:"18",    color:"#FFC83D",icon:"🏢" },
          { l:"Today Revenue", v:"$4.8K", color:"#FFC83D",icon:"💰" },
          { l:"Live Streams",  v:"284",   color:"#EF4444",icon:"📡" },
          { l:"PK Active",     v:"12",    color:"#F97316",icon:"⚔️" },
          { l:"VIP Members",   v:"1.2K",  color:"#EC4899",icon:"💎" },
          { l:"New Users",     v:"284",   color:"#10B981",icon:"🆕" },
          { l:"Pending Apps",  v:"35",    color:"#F59E0B",icon:"📋" },
          { l:"Active Events", v:"3",     color:"#A855F7",icon:"🎉" },
          { l:"Alerts",        v:"8",     color:"#EF4444",icon:"⚠️" },
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
                background:"rgba(255,255,255,0.04)",
                border:"1.5px solid rgba(31,107,255,0.14)",
                backdropFilter:"blur(10px)",
                boxShadow:`0 5px 18px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                display:"flex",flexDirection:"column",alignItems:"center",
                padding:"14px 5px 11px",position:"relative",
              }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"18px 18px 0 0",
                  background:`linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#1F6BFF"},rgba(255,200,61,0.4))` }} />
                <div style={{ width:48,height:48,borderRadius:13,marginBottom:7,background:mod.gradient,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                  position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.27) 0%,transparent 100%)",borderRadius:"0 0 50% 50%" }} />
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#60A5FA",textAlign:"center",lineHeight:1.2 }}>{mod.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}