/**
 * MarketingManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Marketing Manager
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

const GRADS = ["linear-gradient(135deg,#1F6BFF,#6366F1)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#F59E0B,#D97706)","linear-gradient(135deg,#EF4444,#B91C1C)","linear-gradient(135deg,#7C3AED,#5B21B6)","linear-gradient(135deg,#EC4899,#BE185D)"];
const GLOWS  = ["rgba(31,107,255,0.3)","rgba(16,185,129,0.3)","rgba(245,158,11,0.3)","rgba(239,68,68,0.3)","rgba(124,58,237,0.3)","rgba(236,72,153,0.3)"];

const campaignData = [{d:"Mon",v:4200},{d:"Tue",v:5800},{d:"Wed",v:4900},{d:"Thu",v:7100},{d:"Fri",v:8400},{d:"Sat",v:6200},{d:"Sun",v:5100}];
const acquisData   = [{d:"Jan",v:1.2},{d:"Feb",v:1.8},{d:"Mar",v:2.4},{d:"Apr",v:3.1},{d:"May",v:3.8},{d:"Jun",v:4.6}];
const engageData   = [{d:"Mon",v:68},{d:"Tue",v:74},{d:"Wed",v:71},{d:"Thu",v:82},{d:"Fri",v:88},{d:"Sat",v:79},{d:"Sun",v:76}];

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
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>📣 MM</span></div>
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

/* ─────────────── MODULES ─────────────── */

function MarketingOverviewCenter({ onBack }) {
  return (
    <Shell title="📊 Marketing Overview" subtitle="Complete Marketing Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Total Campaigns", v:"42",   color:"#1F6BFF",icon:"📣" },
        { l:"Active",          v:"18",   color:"#10B981",icon:"🟢" },
        { l:"Total Reach",     v:"2.4M", color:"#FFC83D",icon:"👁️" },
        { l:"Impressions",     v:"8.1M", color:"#A78BFA",icon:"📊" },
        { l:"ROI",             v:"340%", color:"#10B981",icon:"📈" },
        { l:"Growth Rate",     v:"+28%", color:"#EC4899",icon:"🚀" },
      ]}/>
      <Chart label="📣 CAMPAIGN REACH THIS WEEK" data={campaignData} color="#1F6BFF" gid="mo1"/>
      <Chart label="🎯 USER ACQUISITIONS (K)" data={acquisData} color="#EC4899" gid="mo2"/>
      <ARow title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data","Compare Performance"]}/>
    </Shell>
  );
}

function CampaignManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const campaigns = [
    { id:"CMP-0841",name:"Summer Streaming Fest",type:"User Acquisition",reach:"840K",status:"Active",    start:"Jun 1",  budget:"$4,200" },
    { id:"CMP-0828",name:"VIP Gifter Program",   type:"Retention",      reach:"420K",status:"Active",    start:"Jun 5",  budget:"$2,100" },
    { id:"CMP-0812",name:"Host Recruitment Drive",type:"Host Growth",   reach:"280K",status:"Paused",    start:"May 28", budget:"$1,800" },
    { id:"CMP-0794",name:"Agency Awareness",      type:"B2B",           reach:"184K",status:"Completed", start:"May 14", budget:"$3,000" },
    { id:"CMP-0781",name:"Ramadan Special",       type:"Seasonal",      reach:"1.2M",status:"Completed", start:"Mar 15", budget:"$8,500" },
  ];
  const sc = { Active:"#10B981",Paused:"#F59E0B",Completed:"#60A5FA",Stopped:"#EF4444",Draft:"#9CA3AF" };
  const filters = ["All","Active","Paused","Completed","Draft"];
  const visible = filter==="All" ? campaigns : campaigns.filter(c => c.status===filter);
  return (
    <Shell title="📣 Campaign Management" subtitle="All Marketing Campaigns" onBack={onBack}>
      <KGrid items={[
        { l:"Active",    v:"18",   color:"#10B981",icon:"🟢" },
        { l:"Paused",    v:"4",    color:"#F59E0B",icon:"⏸" },
        { l:"Total Reach",v:"2.4M",color:"#FFC83D",icon:"👁️" },
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
      <ARow title="⚡ CREATE" actions={["Create Campaign"]}/>
      {visible.map((c,i) => (
        <motion.div key={c.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{c.id} · {c.type} · Reach: {c.reach}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:2 }}>Budget: <span style={{ color:"#FFC83D",fontWeight:800 }}>{c.budget}</span> · Started: {c.start}</div>
            </div>
            <SBadge status={c.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Edit Campaign","Launch Campaign","Pause Campaign","Resume Campaign","Stop Campaign","View Analytics"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function UserAcquisitionCenter({ onBack }) {
  const channels = [
    { name:"Organic Search",  icon:"🔍",acq:"1.2K",conv:"4.8%",color:"#10B981" },
    { name:"Social Media",    icon:"📱",acq:"2.4K",conv:"6.2%",color:"#1F6BFF" },
    { name:"Referral Program",icon:"🎁",acq:"984", conv:"8.4%",color:"#FFC83D" },
    { name:"Paid Ads",        icon:"💰",acq:"1.8K",conv:"3.2%",color:"#EC4899" },
    { name:"Influencer",      icon:"🤝",acq:"640", conv:"7.1%",color:"#A78BFA" },
  ];
  return (
    <Shell title="🎯 User Acquisition Center" subtitle="New User Growth Activities" onBack={onBack}>
      <KGrid items={[
        { l:"New Users Today", v:"284",   color:"#10B981",icon:"👤" },
        { l:"Monthly Acq.",    v:"8.4K",  color:"#FFC83D",icon:"📈" },
        { l:"Avg Conv. Rate",  v:"6.1%",  color:"#60A5FA",icon:"🎯" },
      ]}/>
      <Chart label="🎯 USER ACQUISITIONS (K)" data={acquisData} color="#EC4899" gid="ua1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 ACQUISITION CHANNELS</div>
        {channels.map((ch,i) => (
          <div key={ch.name} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:i<channels.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ fontSize:16 }}>{ch.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,fontWeight:800,color:"#DCE3F0" }}>{ch.name}</div>
            </div>
            <span style={{ fontSize:11,fontWeight:900,color:ch.color }}>{ch.acq}</span>
            <span style={{ fontSize:10,color:"#9CA3AF" }}>{ch.conv}</span>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Create Acquisition Campaign","Monitor Registrations","Analyze Conversion Rate","Export Acquisition Report"]}/>
    </Shell>
  );
}

function HostPromotionCenter({ onBack }) {
  const hosts = [
    { name:"@SaraLive",  genre:"Music",    followers:"48K",growth:"+24%",status:"Featured",icon:"🎙️" },
    { name:"@MoonVoice", genre:"Storytelling",followers:"32K",growth:"+18%",status:"Promoted",icon:"🎙️" },
    { name:"@StarQA",    genre:"Talk",     followers:"28K",growth:"+31%",status:"Active",  icon:"🎙️" },
    { name:"@NoorQA",    genre:"Karaoke",  followers:"21K",growth:"+42%",status:"Active",  icon:"🎙️" },
  ];
  const sc = { Featured:"#FFC83D",Promoted:"#A78BFA",Active:"#10B981" };
  return (
    <Shell title="🎙️ Host Promotion Center" subtitle="Host Visibility & Growth" onBack={onBack}>
      <KGrid items={[
        { l:"Featured Hosts", v:"8",   color:"#FFC83D",icon:"⭐" },
        { l:"Promoted",       v:"24",  color:"#A78BFA",icon:"🚀" },
        { l:"Avg Growth",     v:"+29%",color:"#10B981",icon:"📈" },
      ]}/>
      {hosts.map((h,i) => (
        <motion.div key={h.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{h.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{h.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{h.genre} · {h.followers} followers</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10,fontWeight:900,color:"#10B981",marginBottom:3 }}>{h.growth}</div>
              <SBadge status={h.status} colors={sc}/>
            </div>
          </div>
          <ARow title="" actions={["Feature Host","Promote Live Stream","Launch Host Campaign","Track Host Growth","Analyze Engagement"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AgencyPromotionCenter({ onBack }) {
  const agencies = [
    { name:"StarPro QA",  hosts:"42",revenue:"$12.4K",status:"Featured",icon:"🏢" },
    { name:"EliteMedia",  hosts:"28",revenue:"$8.1K", status:"Promoted",icon:"🏢" },
    { name:"VoiceHouse",  hosts:"21",revenue:"$4.8K", status:"Active",  icon:"🏢" },
  ];
  const sc = { Featured:"#FFC83D",Promoted:"#A78BFA",Active:"#10B981" };
  return (
    <Shell title="🏢 Agency Promotion Center" subtitle="Agency Campaigns & Recruitment" onBack={onBack}>
      <KGrid items={[
        { l:"Featured Agencies",v:"4",    color:"#FFC83D",icon:"⭐" },
        { l:"Promoted",         v:"12",   color:"#A78BFA",icon:"📣" },
        { l:"Recruitment Rate", v:"+18%", color:"#10B981",icon:"📈" },
      ]}/>
      {agencies.map((a,i) => (
        <motion.div key={a.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{a.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{a.hosts} hosts · Revenue: <span style={{ color:"#FFC83D",fontWeight:800 }}>{a.revenue}</span></div>
            </div>
            <SBadge status={a.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Feature Agency","Launch Agency Campaign","Agency Advertisement","Performance Tracking"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function BrandManagementCenter({ onBack }) {
  const metrics = [
    { label:"Brand Awareness",   value:84,color:"#1F6BFF" },
    { label:"Brand Sentiment",   value:91,color:"#10B981" },
    { label:"Share of Voice",    value:68,color:"#FFC83D" },
    { label:"Brand Consistency", value:96,color:"#A78BFA" },
  ];
  const assets = [
    { name:"Logo & Brand Kit",     icon:"🎨",status:"Updated",color:"#10B981" },
    { name:"App Store Graphics",   icon:"📱",status:"Updated",color:"#10B981" },
    { name:"Social Media Templates",icon:"📋",status:"Review",color:"#F59E0B" },
    { name:"Marketing Banners",    icon:"🖼️",status:"Updated",color:"#10B981" },
    { name:"Brand Guidelines PDF", icon:"📄",status:"Updated",color:"#10B981" },
  ];
  const sc = { Updated:"#10B981",Review:"#F59E0B",Outdated:"#EF4444" };
  return (
    <Shell title="🌍 Brand Management Center" subtitle="Brand Identity & Reputation" onBack={onBack}>
      <KGrid items={[
        { l:"Brand Score",   v:"91/100",color:"#FFC83D",icon:"🌍" },
        { l:"Reach",         v:"2.4M",  color:"#60A5FA",icon:"👁️" },
        { l:"Mentions",      v:"8.4K",  color:"#10B981",icon:"💬" },
      ]}/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 BRAND HEALTH METRICS</div>
        {metrics.map(m => <PBar key={m.label} label={m.label} value={m.value} color={m.color}/>)}
      </div>
      <div style={S.sec}>🎨 BRAND ASSETS</div>
      {assets.map((a,i) => (
        <div key={a.name} style={{ ...S.glass(),padding:"11px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12 }}>
          <span style={{ fontSize:20 }}>{a.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff" }}>{a.name}</div>
          </div>
          <SBadge status={a.status} colors={sc}/>
        </div>
      ))}
      <ARow title="⚡" actions={["Manage Brand Assets","Update Brand Guidelines","Launch Branding Campaign","Monitor Brand Performance"]}/>
    </Shell>
  );
}

function SocialMediaCenter({ onBack }) {
  const [platform, setPlatform] = useState("Instagram");
  const platforms = { Instagram:{ followers:"124K",reach:"840K",engagement:"6.2%",posts:284,color:"#EC4899" }, TikTok:{ followers:"88K",reach:"1.2M",engagement:"8.4%",posts:142,color:"#60A5FA" }, Twitter:{ followers:"42K",reach:"420K",engagement:"3.8%",posts:628,color:"#1F6BFF" }, YouTube:{ followers:"28K",reach:"184K",engagement:"4.2%",posts:48,color:"#EF4444" } };
  const p = platforms[platform];
  return (
    <Shell title="📱 Social Media Center" subtitle="Social Channel Management" onBack={onBack}>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {Object.keys(platforms).map(pl => (
          <motion.button key={pl} whileTap={{ scale:0.92 }} onClick={() => setPlatform(pl)}
            style={{ flex:1,padding:"7px",borderRadius:11,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
              background:platform===pl?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:platform===pl?"#fff":"#60A5FA" }}>
            {pl}
          </motion.button>
        ))}
      </div>
      <KGrid items={[
        { l:"Followers",  v:p.followers, color:p.color,  icon:"👥" },
        { l:"Reach",      v:p.reach,     color:"#FFC83D",icon:"👁️" },
        { l:"Engagement", v:p.engagement,color:"#10B981",icon:"❤️" },
      ]}/>
      <Chart label="📊 ENGAGEMENT THIS WEEK" data={engageData} color={p.color} gid={`sm${platform}`}/>
      <ARow title="⚡" actions={["Create Post","Schedule Post","Publish Content","Monitor Engagement","Analyze Performance"]}/>
    </Shell>
  );
}

function InfluencerManagementCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const influencers = [
    { name:"@TechReviewQA",  platform:"TikTok",   followers:"2.1M",tier:"Mega",   status:"Active",    rate:"$1,200/post" },
    { name:"@LifestyleArabia",platform:"Instagram",followers:"840K", tier:"Macro",  status:"Active",    rate:"$480/post" },
    { name:"@GamingQA",      platform:"YouTube",   followers:"420K", tier:"Mid",    status:"Reviewing", rate:"$240/post" },
    { name:"@TravelMiddleEast",platform:"Instagram",followers:"184K",tier:"Micro",  status:"Pending",   rate:"$120/post" },
  ];
  const sc = { Active:"#10B981",Reviewing:"#1F6BFF",Pending:"#F59E0B",Paused:"#9CA3AF" };
  const tc = { Mega:"#FFC83D",Macro:"#A78BFA",Mid:"#60A5FA",Micro:"#10B981" };
  return (
    <Shell title="🤝 Influencer Management" subtitle="Influencer Collaborations" onBack={onBack}>
      <KGrid items={[
        { l:"Active Partners", v:"18",   color:"#10B981",icon:"🤝" },
        { l:"Total Reach",     v:"12.4M",color:"#FFC83D",icon:"👁️" },
        { l:"Avg Engagement",  v:"5.8%", color:"#60A5FA",icon:"❤️" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#60A5FA"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search influencers…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      <ARow title="⚡ ADD" actions={["Add Influencer"]}/>
      {influencers.filter(inf=>inf.name.toLowerCase().includes(query.toLowerCase())).map((inf,i) => (
        <motion.div key={inf.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🌟</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{inf.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{inf.platform} · {inf.followers} · {inf.rate}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9,padding:"2px 7px",borderRadius:7,background:`${tc[inf.tier]}18`,color:tc[inf.tier],fontWeight:800,marginBottom:4 }}>{inf.tier}</div>
              <SBadge status={inf.status} colors={sc}/>
            </div>
          </div>
          <ARow title="" actions={["Review Influencer","Approve Collaboration","Monitor Campaign","Analyze Results"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function EventPromotionCenter({ onBack }) {
  const events = [
    { name:"Summer Streaming Fest",  date:"Jun 20",participants:"4.2K",status:"Upcoming",  icon:"🎉" },
    { name:"Host Battle Championship",date:"Jun 25",participants:"1.8K",status:"Upcoming",  icon:"⚔️" },
    { name:"VIP Gifter Award Night",  date:"Jul 1", participants:"840", status:"Planning",  icon:"🏆" },
    { name:"Ramadan Special 2027",    date:"Feb 14",participants:"-",   status:"Planning",  icon:"🌙" },
  ];
  const sc = { Upcoming:"#FFC83D",Live:"#10B981",Completed:"#60A5FA",Planning:"#A78BFA" };
  return (
    <Shell title="🎉 Event Promotion Center" subtitle="Platform Events & Competitions" onBack={onBack}>
      <KGrid items={[
        { l:"Upcoming Events",v:"4",    color:"#FFC83D",icon:"📅" },
        { l:"Total Reach",    v:"840K", color:"#60A5FA",icon:"👁️" },
        { l:"Registrations",  v:"8.4K", color:"#10B981",icon:"🎟" },
      ]}/>
      {events.map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{e.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{e.date} · {e.participants !== "-" ? `${e.participants} registered` : "Planning phase"}</div>
            </div>
            <SBadge status={e.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Create Promotion","Launch Event Campaign","Manage Advertisement","Monitor Participation"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function AdvertisingCenter({ onBack }) {
  const ads = [
    { name:"App Store Ads",       platform:"Apple/Google",spend:"$1,800",impressions:"420K",ctr:"3.2%",roi:"280%",status:"Active" },
    { name:"Facebook/Instagram",  platform:"Meta",        spend:"$2,400",impressions:"840K",ctr:"4.8%",roi:"340%",status:"Active" },
    { name:"TikTok Ads",          platform:"TikTok",      spend:"$1,200",impressions:"1.2M",ctr:"5.4%",roi:"420%",status:"Active" },
    { name:"Google Display",      platform:"Google",      spend:"$960",  impressions:"284K",ctr:"2.8%",roi:"240%",status:"Paused" },
  ];
  const sc = { Active:"#10B981",Paused:"#F59E0B",Stopped:"#EF4444" };
  return (
    <Shell title="💰 Advertising Center" subtitle="Paid Advertising Management" onBack={onBack}>
      <KGrid items={[
        { l:"Total Spend",    v:"$6.4K", color:"#EF4444",icon:"💰" },
        { l:"Total Reach",    v:"2.7M",  color:"#FFC83D",icon:"👁️" },
        { l:"Avg ROI",        v:"320%",  color:"#10B981",icon:"📈" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Ad Campaign"]}/>
      {ads.map((ad,i) => (
        <motion.div key={ad.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{ad.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{ad.platform} · Spend: <span style={{ color:"#EF4444",fontWeight:800 }}>{ad.spend}</span> · Impressions: {ad.impressions}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:2 }}>CTR: {ad.ctr} · ROI: <span style={{ color:"#10B981",fontWeight:800 }}>{ad.roi}</span></div>
            </div>
            <SBadge status={ad.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Manage Budget","Analyze ROI","Optimize Campaign"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function GrowthAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📈 Growth Analytics Center" subtitle="Platform Growth & Engagement" onBack={onBack}>
      <KGrid items={[
        { l:"Monthly Growth",  v:"+28%",  color:"#10B981",icon:"🚀" },
        { l:"YoY Growth",      v:"+84%",  color:"#FFC83D",icon:"📈" },
        { l:"Retention Rate",  v:"72%",   color:"#60A5FA",icon:"🔄" },
      ]}/>
      <Chart label="🎯 USER ACQUISITIONS (K)" data={acquisData} color="#EC4899" gid="ga1"/>
      <Chart label="📣 WEEKLY CAMPAIGN REACH" data={campaignData} color="#1F6BFF" gid="ga2"/>
      <Chart label="💫 ENGAGEMENT SCORE" data={engageData} color="#10B981" gid="ga3"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 GROWTH vs TARGETS</div>
        <PBar label="User Acquisition Target" value={84} color="#EC4899"/>
        <PBar label="Host Recruitment Target" value={72} color="#A78BFA"/>
        <PBar label="Campaign Reach Target"   value={91} color="#1F6BFF"/>
        <PBar label="Engagement Score Target" value={88} color="#10B981"/>
      </div>
      <ARow title="⚡" actions={["View Analytics","Export Analytics","Compare Performance","Generate Insights"]}/>
    </Shell>
  );
}

function AIMarketingIntelligence({ onBack }) {
  const insights = [
    "TikTok campaigns showing 5.4% CTR — highest performing channel this month",
    "Host streaming content drives 3x more app downloads vs gift-based campaigns",
    "Saudi Arabia audience responding 42% better to Arabic-language content",
    "Evening (7–10pm GST) campaigns reach 2.8x more users than morning slots",
    "Micro-influencers delivering 3.2x higher engagement than mega-influencers",
    "Referral program conversion rate at 8.4% — best performing acquisition channel",
  ];
  return (
    <Shell title="🧠 AI Marketing Intelligence" subtitle="AI-Powered Insights & Forecasting" onBack={onBack}>
      <KGrid items={[
        { l:"AI Accuracy",    v:"96%",    color:"#10B981",icon:"🧠" },
        { l:"Forecast Q3",    v:"12.8K",  color:"#FFC83D",icon:"🔮" },
        { l:"Trend Score",    v:"Rising", color:"#60A5FA",icon:"📈" },
      ]}/>
      <Chart label="📈 AI GROWTH FORECAST" data={[...acquisData,{d:"Jul",v:5.4},{d:"Aug",v:6.2}]} color="#10B981" gid="ai1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 AI MARKETING INSIGHTS</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"8px 0",borderBottom:i<insights.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#FFC83D",fontWeight:800,fontSize:11,flexShrink:0 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{ins}</span>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Generate Insights","Analyze Trends","Forecast Growth","Audience Prediction"]}/>
    </Shell>
  );
}

function BrandPerformanceCenter({ onBack }) {
  const rankings = [
    { platform:"Instagram",rank:"#3",category:"Live Streaming Apps",reach:"840K",growth:"+18%",icon:"📸" },
    { platform:"TikTok",   rank:"#1",category:"Middle East Entertainment",reach:"1.2M",growth:"+42%",icon:"🎵" },
    { platform:"Twitter",  rank:"#7",category:"Social Audio Platforms",reach:"420K",growth:"+12%",icon:"🐦" },
    { platform:"YouTube",  rank:"#5",category:"Live Audio Apps",reach:"184K",growth:"+24%",icon:"▶️" },
  ];
  return (
    <Shell title="🏆 Brand Performance Center" subtitle="Brand Visibility & Engagement" onBack={onBack}>
      <KGrid items={[
        { l:"Brand Score",   v:"91/100",color:"#FFC83D",icon:"🏆" },
        { l:"Share of Voice",v:"28%",   color:"#60A5FA",icon:"📣" },
        { l:"Sentiment",     v:"94%",   color:"#10B981",icon:"❤️" },
      ]}/>
      {rankings.map((r,i) => (
        <div key={r.platform} style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <span style={{ fontSize:22 }}>{r.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.platform}</div>
            <div style={{ fontSize:9,color:"#60A5FA" }}>{r.category} · Reach: {r.reach}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:14,fontWeight:900,color:"#FFC83D" }}>{r.rank}</div>
            <div style={{ fontSize:10,color:"#10B981",fontWeight:700 }}>{r.growth}</div>
          </div>
        </div>
      ))}
      <ARow title="⚡" actions={["View Rankings","Analyze Reach","Monitor Engagement","Export Reports"]}/>
    </Shell>
  );
}

function CommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Users");
  const [type, setType] = useState("Push Notification");
  return (
    <Shell title="📨 Communication Center" subtitle="Marketing Communications" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>👥 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Users","All Hosts","Top Gifters","New Users","Inactive Users"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📡 CHANNEL</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["Push Notification","In-App Message","Email","SMS"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setType(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:type===t?"linear-gradient(135deg,#EC4899,#A855F7)":"rgba(255,255,255,0.06)",color:type===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Write your marketing announcement or promotion…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(31,107,255,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#EC4899,#A855F7)",boxShadow:"0 6px 20px rgba(236,72,153,0.35)" }}>
          📨 Send Message
        </motion.button>
      </div>
      <ARow title="⚡ MORE" actions={["Send Announcement","Broadcast Promotion","Create News Update"]}/>
    </Shell>
  );
}

function ContentManagementCenter({ onBack }) {
  const content = [
    { title:"Summer Campaign Banner",  type:"Image",  size:"2.4 MB",platform:"All",   status:"Published",icon:"🖼️" },
    { title:"Host Promo Video",        type:"Video",  size:"18 MB", platform:"TikTok", status:"Published",icon:"🎬" },
    { title:"VIP Benefits Infographic",type:"Image",  size:"1.2 MB",platform:"Instagram",status:"Review",icon:"📊" },
    { title:"App Launch Blog Post",    type:"Article",size:"8 KB",  platform:"Web",    status:"Draft",   icon:"📝" },
    { title:"Brand Story Video",       type:"Video",  size:"42 MB", platform:"YouTube",status:"Published",icon:"🎥" },
  ];
  const sc = { Published:"#10B981",Review:"#F59E0B",Draft:"#9CA3AF",Archived:"#4B5563" };
  return (
    <Shell title="📋 Content Management" subtitle="Marketing Content Library" onBack={onBack}>
      <KGrid items={[
        { l:"Total Assets",v:"142", color:"#60A5FA",icon:"📋" },
        { l:"Published",   v:"98",  color:"#10B981",icon:"✅" },
        { l:"In Review",   v:"12",  color:"#F59E0B",icon:"👁️" },
      ]}/>
      <ARow title="⚡ UPLOAD" actions={["Upload Content"]}/>
      {content.map((c,i) => (
        <motion.div key={c.title} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{c.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#fff",lineHeight:1.4 }}>{c.title}</div>
            <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>{c.type} · {c.size} · {c.platform}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end" }}>
            <SBadge status={c.status} colors={sc}/>
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

function PromotionManagementCenter({ onBack }) {
  const promos = [
    { name:"Summer 30% Coin Bonus",    type:"Coin Bonus",   expiry:"Jun 30",status:"Active",  users:"8.4K",icon:"🪙" },
    { name:"New User Gift Pack",       type:"Gift",         expiry:"Jul 15",status:"Active",  users:"12.1K",icon:"🎁" },
    { name:"VIP Trial Weekend",        type:"VIP Trial",    expiry:"Jun 22",status:"Upcoming",users:"-",   icon:"💎" },
    { name:"Host Debut Boost",         type:"Visibility",   expiry:"Jul 31",status:"Active",  users:"284", icon:"🎙️" },
  ];
  const sc = { Active:"#10B981",Upcoming:"#FFC83D",Expired:"#9CA3AF",Paused:"#F59E0B" };
  return (
    <Shell title="🎁 Promotion Management" subtitle="Promotions & Special Offers" onBack={onBack}>
      <KGrid items={[
        { l:"Active Promos",  v:"8",    color:"#10B981",icon:"🎁" },
        { l:"Total Reached",  v:"84K",  color:"#FFC83D",icon:"👁️" },
        { l:"Upcoming",       v:"3",    color:"#60A5FA",icon:"📅" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Offer"]}/>
      {promos.map((p,i) => (
        <motion.div key={p.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(16,185,129,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{p.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{p.type} · Expires: {p.expiry}{p.users!=="-" ? ` · ${p.users} users` : ""}</div>
            </div>
            <SBadge status={p.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Launch Promotion","Schedule Promotion","Analyze Results"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ReportManagementCenter({ onBack }) {
  const reports = [
    { name:"Daily Marketing Report",    date:"Jun 17",size:"480 KB",status:"Ready" },
    { name:"Campaign Performance Report",date:"Jun 15",size:"1.8 MB",status:"Ready" },
    { name:"User Acquisition Report",   date:"Jun 14",size:"940 KB",status:"Ready" },
    { name:"Influencer Performance",    date:"Jun 10",size:"620 KB",status:"Ready" },
    { name:"Social Media Report",       date:"Jun 7", size:"1.2 MB",status:"Archived" },
    { name:"Brand Performance Report",  date:"Jun 1", size:"2.1 MB",status:"Archived" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📊 Report Management" subtitle="Marketing Performance Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports",v:"48",  color:"#60A5FA",icon:"📊" },
        { l:"This Month",   v:"14",  color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",    v:"3",   color:"#10B981",icon:"⏰" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Generate Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>📊</div>
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

function MarketingTeamCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior Campaign Manager",tasks:8, score:94,status:"Online" },
    { name:"Khalid Omar",     role:"Social Media Specialist", tasks:12,score:88,status:"Online" },
    { name:"Fatima Hassan",   role:"Content Creator",         tasks:6, score:91,status:"Busy" },
    { name:"Ahmad Nasser",    role:"Performance Analyst",     tasks:5, score:86,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#F59E0B",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 Marketing Team Center" subtitle="Marketing Staff Management" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff", v:"16",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",  v:"11",  color:"#10B981",icon:"🟢" },
        { l:"Avg Score",   v:"90%", color:"#FFC83D",icon:"🏆" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Add Staff"]}/>
      {staff.map((s,i) => (
        <motion.div key={s.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"rgba(96,165,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{s.role} · {s.tasks} active tasks</div>
            </div>
            <SBadge status={s.status} colors={sc}/>
          </div>
          <PBar label="Performance Score" value={s.score} color="#1F6BFF"/>
          <ARow title="" actions={["Assign Tasks","Monitor Productivity","Review Performance"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function MarketingSettingsCenter({ onBack }) {
  const settings = [
    { name:"Campaign Defaults",        icon:"📣",desc:"Default settings for new campaigns",       color:"#1F6BFF" },
    { name:"Budget Limits",            icon:"💰",desc:"Set per-campaign budget thresholds",        color:"#FFC83D" },
    { name:"Target Audience Config",   icon:"🎯",desc:"Default audience targeting parameters",     color:"#EC4899" },
    { name:"Notification Preferences", icon:"🔔",desc:"Marketing alert and notification settings", color:"#A78BFA" },
    { name:"Analytics Integrations",   icon:"📊",desc:"Connect analytics and tracking platforms",  color:"#10B981" },
    { name:"Content Approval Workflow",icon:"✅",desc:"Set content review and approval process",   color:"#60A5FA" },
  ];
  return (
    <Shell title="⚙️ Marketing Settings" subtitle="Marketing Platform Configuration" onBack={onBack}>
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
      <ARow title="⚡" actions={["Update Settings","Save Configuration","Manage Preferences","Reset Settings"]}/>
    </Shell>
  );
}

function MMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Global Campaign Launch",       icon:"🌍",desc:"Launch a simultaneous campaign across all markets",     color:"#1F6BFF" },
    { name:"Emergency Promotion",          icon:"🚨",desc:"Instantly activate an emergency promotional offer",     color:"#EF4444" },
    { name:"Brand Protection Mode",        icon:"🛡️",desc:"Activate brand protection and reputation defense",      color:"#10B981" },
    { name:"Marketing Budget Optimization",icon:"💰",desc:"AI-powered budget reallocation for maximum ROI",        color:"#FFC83D" },
    { name:"Audience Expansion Planning",  icon:"🎯",desc:"Strategic audience expansion plan generation",          color:"#EC4899" },
    { name:"Market Opportunity Analysis",  icon:"🔍",desc:"Identify and analyze untapped market opportunities",    color:"#A78BFA" },
    { name:"Strategic Marketing Planning", icon:"🧠",desc:"AI-powered quarterly marketing strategy builder",       color:"#60A5FA" },
  ];
  return (
    <Shell title="🚀 MM Exclusive Tools" subtitle="Marketing Manager Exclusive Powers" onBack={onBack}>
      <div style={{ background:"rgba(255,200,61,0.08)",border:"1px solid rgba(255,200,61,0.25)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — MARKETING MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools carry global marketing authority. All activations are logged and audited.</div>
      </div>
      {tools.map((t,i) => (
        <motion.div key={t.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
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
  overview:   MarketingOverviewCenter,
  campaigns:  CampaignManagementCenter,
  acquisition:UserAcquisitionCenter,
  hosts:      HostPromotionCenter,
  agencies:   AgencyPromotionCenter,
  brand:      BrandManagementCenter,
  social:     SocialMediaCenter,
  influencers:InfluencerManagementCenter,
  events:     EventPromotionCenter,
  advertising:AdvertisingCenter,
  growth:     GrowthAnalyticsCenter,
  ai:         AIMarketingIntelligence,
  performance:BrandPerformanceCenter,
  comms:      CommunicationCenter,
  content:    ContentManagementCenter,
  promotions: PromotionManagementCenter,
  reports:    ReportManagementCenter,
  team:       MarketingTeamCenter,
  settings:   MarketingSettingsCenter,
  exclusive:  MMExclusiveTools,
};

const MODULES = [
  { id:"overview",    icon:"📊", label:"Marketing Overview",    subtitle:"Performance Summary",  gradient:"linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow:"rgba(31,107,255,0.4)" },
  { id:"campaigns",   icon:"📣", label:"Campaign Management",   subtitle:"All Campaigns",        gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.4)" },
  { id:"acquisition", icon:"🎯", label:"User Acquisition",      subtitle:"Growth Activities",    gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"hosts",       icon:"🎙️", label:"Host Promotion",        subtitle:"Host Visibility",      gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"agencies",    icon:"🏢", label:"Agency Promotion",      subtitle:"Agency Campaigns",     gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.4)" },
  { id:"brand",       icon:"🌍", label:"Brand Management",      subtitle:"Identity & Reputation",gradient:"linear-gradient(145deg,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.35)" },
  { id:"social",      icon:"📱", label:"Social Media",          subtitle:"Channel Management",   gradient:"linear-gradient(145deg,#EC4899,#A855F7)", glow:"rgba(236,72,153,0.35)" },
  { id:"influencers", icon:"🤝", label:"Influencer Management", subtitle:"Collaborations",       gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"events",      icon:"🎉", label:"Event Promotion",       subtitle:"Events & Competitions",gradient:"linear-gradient(145deg,#F97316,#C2410C)", glow:"rgba(249,115,22,0.35)" },
  { id:"advertising", icon:"💰", label:"Advertising Center",    subtitle:"Paid Ad Management",   gradient:"linear-gradient(145deg,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.35)" },
  { id:"growth",      icon:"📈", label:"Growth Analytics",      subtitle:"Platform Growth",      gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.3)" },
  { id:"ai",          icon:"🧠", label:"AI Marketing Intel.",   subtitle:"AI Insights",          gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"performance", icon:"🏆", label:"Brand Performance",     subtitle:"Visibility & Reach",   gradient:"linear-gradient(145deg,#FFC83D,#F59E0B)", glow:"rgba(255,200,61,0.4)" },
  { id:"comms",       icon:"📨", label:"Communication",         subtitle:"Announcements",        gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"content",     icon:"📋", label:"Content Management",    subtitle:"Content Library",      gradient:"linear-gradient(145deg,#06B6D4,#0E7490)", glow:"rgba(6,182,212,0.35)" },
  { id:"promotions",  icon:"🎁", label:"Promotion Management",  subtitle:"Offers & Deals",       gradient:"linear-gradient(145deg,#EC4899,#1F6BFF)", glow:"rgba(236,72,153,0.3)" },
  { id:"reports",     icon:"📊", label:"Report Management",     subtitle:"Generate Reports",     gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"team",        icon:"👥", label:"Marketing Team",        subtitle:"Staff Management",     gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"settings",    icon:"⚙️", label:"Marketing Settings",    subtitle:"Platform Config",      gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",   icon:"🚀", label:"MM Exclusive Tools",    subtitle:"Executive Powers",     gradient:"linear-gradient(145deg,#FFC83D,#EC4899)", glow:"rgba(255,200,61,0.5)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function MarketingManagerDashboard() {
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
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>📣 Marketing Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>Campaigns · Acquisition · Brand · Social · Analytics</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>📣 MM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(236,72,153,0.15),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#EC4899,#1F6BFF,#10B981)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · MARKETING & BRAND GROWTH DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Marketing Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central marketing hub — campaigns, user acquisition, host promotion, social media, influencers, brand management, and AI-powered growth analytics.</div>
        </div>

        <KGrid items={[
          { l:"Total Campaigns",       v:"42",    color:"#1F6BFF",icon:"📣" },
          { l:"Active Campaigns",      v:"18",    color:"#10B981",icon:"🟢" },
          { l:"Campaign Reach",        v:"2.4M",  color:"#FFC83D",icon:"👁️" },
          { l:"Impressions",           v:"8.1M",  color:"#A78BFA",icon:"📊" },
          { l:"User Acquisitions",     v:"8.4K",  color:"#EC4899",icon:"🎯" },
          { l:"Host Acquisitions",     v:"284",   color:"#60A5FA",icon:"🎙️" },
          { l:"Agency Acquisitions",   v:"12",    color:"#FFC83D",icon:"🏢" },
          { l:"Marketing Budget",      v:"$28K",  color:"#EF4444",icon:"💰" },
          { l:"Marketing ROI",         v:"340%",  color:"#10B981",icon:"📈" },
          { l:"Conversion Rate",       v:"6.1%",  color:"#60A5FA",icon:"🎯" },
          { l:"Brand Engagement",      v:"91/100",color:"#FFC83D",icon:"❤️" },
          { l:"Growth Rate",           v:"+28%",  color:"#10B981",icon:"🚀" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} MARKETING MODULES · TAP TO ACCESS
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
                  background:mod.featured?"linear-gradient(90deg,#FFC83D,#EC4899,#FFC83D)":`linear-gradient(90deg,rgba(255,200,61,0.4),${mod.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]??"#1F6BFF"},rgba(255,200,61,0.4))` }}/>
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