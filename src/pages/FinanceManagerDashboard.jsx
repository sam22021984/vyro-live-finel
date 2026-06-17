/**
 * FinanceManagerDashboard — Enterprise International Level
 * Access: Profile > More Services > Creator Center > Finance Manager
 * Theme: Enterprise Dark Blue & Gold · Glassmorphism
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

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

const revData  = [{d:"Jan",v:38},{d:"Feb",v:44},{d:"Mar",v:52},{d:"Apr",v:61},{d:"May",v:74},{d:"Jun",v:88}];
const wdrData  = [{d:"Mon",v:12},{d:"Tue",v:18},{d:"Wed",v:9},{d:"Thu",v:22},{d:"Fri",v:15},{d:"Sat",v:7},{d:"Sun",v:4}];
const coinData = [{d:"Jan",v:142},{d:"Feb",v:168},{d:"Mar",v:194},{d:"Apr",v:221},{d:"May",v:248},{d:"Jun",v:284}];

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
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>💰 FM</span></div>
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
        <motion.div initial={{ width:0 }} animate={{ width:`${Math.min(pct,100)}%` }} transition={{ duration:0.7 }}
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

function FinanceOverviewCenter({ onBack }) {
  return (
    <Shell title="💰 Finance Overview Center" subtitle="Complete Financial Operations" onBack={onBack}>
      <KGrid items={[
        { l:"Total Revenue",  v:"$2.4M",  color:"#FFC83D",icon:"💰" },
        { l:"Monthly",        v:"$88K",   color:"#10B981",icon:"📈" },
        { l:"Growth Rate",    v:"+22%",   color:"#60A5FA",icon:"🚀" },
        { l:"Withdrawals",    v:"$14.2K", color:"#A78BFA",icon:"🏦" },
        { l:"Pending WDR",    v:"18",     color:"#F59E0B",icon:"⏳" },
        { l:"Risk Alerts",    v:"3",      color:"#EF4444",icon:"⚠️" },
      ]}/>
      <Chart label="📈 REVENUE TREND (USD K)" data={revData} color="#FFC83D" gid="fo1"/>
      <Chart label="🏦 WITHDRAWALS THIS WEEK" data={wdrData} color="#A78BFA" gid="fo2" type="bar"/>
      <ARow title="⚡ QUICK ACTIONS" actions={["View Dashboard","Open Analytics","Generate Report","Export Data"]}/>
    </Shell>
  );
}

function RevenueManagementCenter({ onBack }) {
  const sources = [
    { l:"Gift Revenue",      v:"$42K",pct:48,color:"#EC4899" },
    { l:"Coin Purchases",    v:"$28K",pct:32,color:"#FFC83D" },
    { l:"VIP Subscriptions", v:"$12K",pct:14,color:"#A78BFA" },
    { l:"Entry Fees",        v:"$6K", pct:7, color:"#60A5FA" },
  ];
  return (
    <Shell title="📈 Revenue Management Center" subtitle="Platform Revenue Monitoring" onBack={onBack}>
      <KGrid items={[
        { l:"Today",    v:"$4.8K",  color:"#FFC83D",icon:"📅" },
        { l:"Weekly",   v:"$28.4K", color:"#10B981",icon:"📆" },
        { l:"Monthly",  v:"$88K",   color:"#60A5FA",icon:"📊" },
      ]}/>
      <Chart label="📈 REVENUE TREND" data={revData} color="#FFC83D" gid="rm1"/>
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
      <ARow title="⚡" actions={["View Revenue","Revenue Analysis","Revenue Forecast","Export Revenue Report","Compare Revenue"]}/>
    </Shell>
  );
}

function WithdrawalManagementCenter({ onBack }) {
  const [filter, setFilter] = useState("All");
  const wdrs = [
    { id:"WDR-4821",user:"@SaraLive", amount:"$284",method:"Bank Transfer",submitted:"Jun 17",status:"Pending",  days:1 },
    { id:"WDR-4798",user:"@MoonVoice",amount:"$142",method:"PayPal",       submitted:"Jun 16",status:"Pending",  days:2 },
    { id:"WDR-4762",user:"@StarQA",   amount:"$96", method:"Wise",         submitted:"Jun 14",status:"Processing",days:4 },
    { id:"WDR-4741",user:"@NoorQA",   amount:"$428",method:"Bank Transfer",submitted:"Jun 12",status:"Approved",  days:6 },
    { id:"WDR-4712",user:"@Ahmed_QA", amount:"$64", method:"PayPal",       submitted:"Jun 10",status:"Rejected",  days:8 },
  ];
  const sc = { Pending:"#F59E0B",Processing:"#1F6BFF",Approved:"#10B981",Rejected:"#EF4444",Hold:"#A855F7" };
  const filters = ["All","Pending","Processing","Approved","Rejected"];
  const visible = filter==="All" ? wdrs : wdrs.filter(w => w.status===filter);
  return (
    <Shell title="🏦 Withdrawal Management" subtitle="Withdrawal Requests & Payouts" onBack={onBack}>
      <KGrid items={[
        { l:"Pending",    v:"18",    color:"#F59E0B",icon:"⏳" },
        { l:"Processing", v:"6",     color:"#1F6BFF",icon:"⚙️" },
        { l:"Total Today",v:"$1.2K", color:"#FFC83D",icon:"💰" },
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
      {visible.map((w,i) => (
        <motion.div key={w.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{w.amount}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{w.id} · {w.user} · {w.method}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:2 }}>Submitted: {w.submitted} · Day {w.days}</div>
            </div>
            <SBadge status={w.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Review Withdrawal","Approve Withdrawal","Reject Withdrawal","Hold Withdrawal","Process Payment"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function PaymentManagementCenter({ onBack }) {
  const payments = [
    { id:"PAY-8421",user:"@Sara_QA", amount:"$9.99", type:"VIP Purchase",    status:"Completed",date:"Jun 17" },
    { id:"PAY-8384",user:"@Ahmed_QA",amount:"$4.99", type:"Coin Package",    status:"Completed",date:"Jun 17" },
    { id:"PAY-8362",user:"@NoorQA",  amount:"$19.99",type:"Coin Bundle",     status:"Pending",  date:"Jun 16" },
    { id:"PAY-8341",user:"@StarQA",  amount:"$2.99", type:"Entry Fee",       status:"Failed",   date:"Jun 16" },
  ];
  const sc = { Completed:"#10B981",Pending:"#F59E0B",Failed:"#EF4444",Refunded:"#A855F7" };
  return (
    <Shell title="💳 Payment Management Center" subtitle="Incoming Payments & Transactions" onBack={onBack}>
      <KGrid items={[
        { l:"Today Payments",  v:"284",   color:"#10B981",icon:"💳" },
        { l:"Today Volume",    v:"$4.8K", color:"#FFC83D",icon:"💰" },
        { l:"Failed",          v:"8",     color:"#EF4444",icon:"❌" },
      ]}/>
      {payments.map((p,i) => (
        <motion.div key={p.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:3 }}>
                <span style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{p.amount}</span>
                <span style={{ fontSize:10,color:"#DCE3F0" }}>{p.type}</span>
              </div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{p.id} · {p.user} · {p.date}</div>
            </div>
            <SBadge status={p.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Verify Payment","Approve Payment","Reject Payment","Review Transaction"]}/>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["Export Payment Report"]}/>
    </Shell>
  );
}

function WalletManagementCenter({ onBack }) {
  const [query, setQuery] = useState("");
  const wallets = [
    { user:"@SaraLive",  id:"USR-4821",balance:"8,420 Coins",usd:"$84.2",status:"Active",  type:"Host" },
    { user:"@DiamondQA", id:"USR-2841",balance:"142K Coins",  usd:"$1,420",status:"Active",type:"VIP" },
    { user:"@SuspectX",  id:"USR-1924",balance:"84K Coins",   usd:"$840", status:"Frozen", type:"User" },
  ];
  const sc = { Active:"#10B981",Frozen:"#EF4444",Suspended:"#F59E0B" };
  const tc = { Host:"#A78BFA",VIP:"#FFC83D",User:"#60A5FA" };
  return (
    <Shell title="👛 Wallet Management Center" subtitle="Platform Wallet Monitoring" onBack={onBack}>
      <KGrid items={[
        { l:"Total Wallets", v:"214K", color:"#60A5FA",icon:"👛" },
        { l:"Total Balance", v:"$2.1M",color:"#FFC83D",icon:"💰" },
        { l:"Frozen",        v:"42",   color:"#EF4444",icon:"❄️" },
      ]}/>
      <div style={{ ...S.glass(),padding:"11px",marginBottom:12 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <Search size={13} color="#60A5FA"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search wallet by user ID or name…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>
      </div>
      {wallets.filter(w=>w.user.toLowerCase().includes(query.toLowerCase())||w.id.toLowerCase().includes(query.toLowerCase())).map((w,i) => (
        <motion.div key={w.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:10 }}>
            <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>👛</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{w.user}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{w.id} · {w.balance} ({w.usd})</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9,padding:"2px 7px",borderRadius:7,background:`${tc[w.type]}18`,color:tc[w.type],fontWeight:800,marginBottom:4 }}>{w.type}</div>
              <SBadge status={w.status} colors={sc}/>
            </div>
          </div>
          <ARow title="" actions={["View Wallet","Audit Wallet","Freeze Wallet","Unfreeze Wallet","Review Transactions","Generate Wallet Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function CoinEconomyCenter({ onBack }) {
  const packages = [
    { name:"Starter Pack",   coins:"100 Coins",  price:"$0.99", bonus:"0%",  status:"Active",  sales:"8.4K" },
    { name:"Value Pack",     coins:"500 Coins",  price:"$4.99", bonus:"10%", status:"Active",  sales:"12.1K" },
    { name:"Pro Pack",       coins:"1K Coins",   price:"$9.99", bonus:"15%", status:"Active",  sales:"6.8K" },
    { name:"Elite Bundle",   coins:"5K Coins",   price:"$44.99",bonus:"20%", status:"Active",  sales:"2.4K" },
    { name:"Summer Special", coins:"2K Coins",   price:"$14.99",bonus:"30%", status:"Promo",   sales:"4.2K" },
  ];
  const sc = { Active:"#10B981",Promo:"#FFC83D",Disabled:"#9CA3AF" };
  return (
    <Shell title="🪙 Coin Economy Center" subtitle="Virtual Currency Management" onBack={onBack}>
      <KGrid items={[
        { l:"Coins Sold",   v:"284K",  color:"#FFC83D",icon:"🪙" },
        { l:"Revenue",      v:"$28K",  color:"#10B981",icon:"💰" },
        { l:"Active Pkgs",  v:"5",     color:"#60A5FA",icon:"📦" },
      ]}/>
      <Chart label="🪙 COIN SALES TREND (K)" data={coinData} color="#FFC83D" gid="ce1"/>
      <ARow title="⚡ CREATE" actions={["Create Coin Package","Launch Promotion"]}/>
      {packages.map((p,i) => (
        <motion.div key={p.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:44,height:44,borderRadius:13,background:"rgba(255,200,61,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>🪙</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{p.name}</div>
            <div style={{ fontSize:9,color:"#60A5FA" }}>{p.coins} · Bonus: {p.bonus} · Sales: {p.sales}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{p.price}</div>
            <SBadge status={p.status} colors={sc}/>
          </div>
        </motion.div>
      ))}
      <ARow title="⚡ MANAGE" actions={["Edit Coin Package","Disable Package","Analyze Coin Revenue"]}/>
    </Shell>
  );
}

function GiftRevenueCenter({ onBack }) {
  const gifts = [
    { name:"Diamond Star",icon:"💎",revenue:"$12.4K",sent:"9.2K", pct:28,color:"#60A5FA" },
    { name:"Golden Rose", icon:"🌹",revenue:"$8.8K", sent:"18.1K",pct:20,color:"#EC4899" },
    { name:"Crown Jewel", icon:"👑",revenue:"$6.4K", sent:"4.8K", pct:15,color:"#FFC83D" },
    { name:"Fire Phoenix", icon:"🔥",revenue:"$5.2K",sent:"6.4K", pct:12,color:"#F97316" },
    { name:"Galaxy Blast",icon:"🌌",revenue:"$4.8K", sent:"3.2K", pct:11,color:"#A78BFA" },
  ];
  return (
    <Shell title="🎁 Gift Revenue Center" subtitle="Gift-Based Revenue Analytics" onBack={onBack}>
      <KGrid items={[
        { l:"Total Gift Rev",  v:"$42K",  color:"#EC4899",icon:"🎁" },
        { l:"Gifts Sent",      v:"84K",   color:"#60A5FA",icon:"📨" },
        { l:"Top Gift",        v:"Diamond",color:"#FFC83D",icon:"💎" },
      ]}/>
      {gifts.map((g,i) => (
        <div key={g.name} style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:8 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:`${g.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{g.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{g.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{g.sent} gifts sent</div>
            </div>
            <div style={{ fontSize:12,fontWeight:900,color:"#FFC83D" }}>{g.revenue}</div>
          </div>
          <PBar label="" value={g.pct} max={100} color={g.color}/>
        </div>
      ))}
      <ARow title="⚡" actions={["View Gift Revenue","Analyze Trends","Generate Gift Report","Compare Gift Performance"]}/>
    </Shell>
  );
}

function CommissionManagementCenter({ onBack }) {
  const rules = [
    { name:"Agency Commission",  rate:"30%",  base:"Host Revenue",   applies:"All Agencies",  status:"Active" },
    { name:"Agent Commission",   rate:"10%",  base:"Host Revenue",   applies:"All Agents",    status:"Active" },
    { name:"VIP Referral Bonus", rate:"5%",   base:"Referral Revenue",applies:"VIP Members",  status:"Active" },
    { name:"Seasonal Bonus",     rate:"+5%",  base:"Gift Revenue",   applies:"Top 10 Hosts",  status:"Promo" },
  ];
  const sc = { Active:"#10B981",Promo:"#FFC83D",Disabled:"#9CA3AF" };
  return (
    <Shell title="🤝 Commission Management" subtitle="Commission Structures & Payouts" onBack={onBack}>
      <KGrid items={[
        { l:"Total Distributed",v:"$18K",  color:"#FFC83D",icon:"🤝" },
        { l:"Agency Share",     v:"$12.4K",color:"#60A5FA",icon:"🏢" },
        { l:"Agent Share",      v:"$5.6K", color:"#A78BFA",icon:"👤" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Create Commission Rule"]}/>
      {rules.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>Rate: <span style={{ color:"#FFC83D",fontWeight:900 }}>{r.rate}</span> · Base: {r.base}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:2 }}>Applies to: {r.applies}</div>
            </div>
            <SBadge status={r.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Edit Commission","Approve Commission","Generate Commission Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function ProfitLossCenter({ onBack }) {
  const months = [
    { m:"January", revenue:"$72K",  costs:"$28K",profit:"$44K",margin:"61%" },
    { m:"February",revenue:"$78K",  costs:"$30K",profit:"$48K",margin:"62%" },
    { m:"March",   revenue:"$84K",  costs:"$32K",profit:"$52K",margin:"62%" },
    { m:"April",   revenue:"$88K",  costs:"$33K",profit:"$55K",margin:"63%" },
    { m:"May",     revenue:"$94K",  costs:"$34K",profit:"$60K",margin:"64%" },
    { m:"June",    revenue:"$88K",  costs:"$32K",profit:"$56K",margin:"64%" },
  ];
  return (
    <Shell title="📊 Profit & Loss Center" subtitle="P&L Analysis & Profitability" onBack={onBack}>
      <KGrid items={[
        { l:"Total Revenue",v:"$504K", color:"#FFC83D",icon:"💰" },
        { l:"Total Costs",  v:"$189K", color:"#EF4444",icon:"📉" },
        { l:"Net Profit",   v:"$315K", color:"#10B981",icon:"📈" },
      ]}/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>📊 MONTHLY P&L STATEMENT</div>
        {months.map((m,i) => (
          <div key={m.m} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<months.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ fontSize:10,fontWeight:700,color:"#DCE3F0",width:60 }}>{m.m}</span>
            <span style={{ fontSize:10,color:"#10B981",fontWeight:700 }}>{m.revenue}</span>
            <span style={{ fontSize:10,color:"#EF4444",fontWeight:700 }}>{m.costs}</span>
            <span style={{ fontSize:10,color:"#FFC83D",fontWeight:900 }}>{m.profit}</span>
            <span style={{ fontSize:10,color:"#60A5FA",fontWeight:700 }}>{m.margin}</span>
          </div>
        ))}
        <div style={{ display:"flex",justifyContent:"space-between",marginTop:6,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          {["Month","Revenue","Costs","Profit","Margin"].map(h => (
            <span key={h} style={{ fontSize:8,color:"#9CA3AF",fontWeight:700,width:h==="Month"?60:"auto" }}>{h}</span>
          ))}
        </div>
      </div>
      <ARow title="⚡" actions={["View P&L Statement","Analyze Profitability","Export P&L Report"]}/>
    </Shell>
  );
}

function FinancialReportCenter({ onBack }) {
  const reports = [
    { name:"Daily Revenue Report",    date:"Jun 17",status:"Ready",   size:"480 KB" },
    { name:"Weekly Revenue Report",   date:"Jun 15",status:"Ready",   size:"1.2 MB" },
    { name:"Monthly Revenue Report",  date:"Jun 1", status:"Ready",   size:"2.4 MB" },
    { name:"Withdrawal Report",       date:"Jun 17",status:"Ready",   size:"640 KB" },
    { name:"Commission Report",       date:"Jun 15",status:"Ready",   size:"820 KB" },
    { name:"Profit & Loss Report",    date:"Jun 1", status:"Archived",size:"3.1 MB" },
  ];
  const sc = { Ready:"#10B981",Processing:"#F59E0B",Archived:"#9CA3AF" };
  return (
    <Shell title="📑 Financial Report Center" subtitle="Generate & Manage Reports" onBack={onBack}>
      <KGrid items={[
        { l:"Total Reports",v:"48", color:"#60A5FA",icon:"📑" },
        { l:"This Month",   v:"15", color:"#FFC83D",icon:"📅" },
        { l:"Scheduled",    v:"4",  color:"#10B981",icon:"⏰" },
      ]}/>
      <ARow title="⚡ CREATE" actions={["Generate Report","Schedule Report"]}/>
      {reports.map((r,i) => (
        <motion.div key={r.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
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

function TransactionAuditCenter({ onBack }) {
  const txns = [
    { id:"TXN-9821",user:"@Sara_QA",  amount:"$9.99", type:"VIP Purchase",    flag:false,date:"Jun 17" },
    { id:"TXN-9798",user:"@SuspectX", amount:"$499",  type:"Bulk Coin Buy",   flag:true, date:"Jun 17" },
    { id:"TXN-9762",user:"@DiamondQA",amount:"$44.99",type:"Elite Bundle",    flag:false,date:"Jun 16" },
    { id:"TXN-9741",user:"@BotUser1", amount:"$0.99", type:"Micro-Transaction",flag:true,date:"Jun 16" },
  ];
  return (
    <Shell title="🔍 Transaction Audit Center" subtitle="Audit Financial Transactions" onBack={onBack}>
      <KGrid items={[
        { l:"Audited Today",  v:"284",  color:"#60A5FA",icon:"🔍" },
        { l:"Flagged",        v:"8",    color:"#EF4444",icon:"🚨" },
        { l:"Cleared",        v:"276",  color:"#10B981",icon:"✅" },
      ]}/>
      {txns.map((t,i) => (
        <motion.div key={t.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${t.flag?"#EF4444":"#10B981"}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <span style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{t.amount}</span>
                {t.flag && <span style={{ fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:6,background:"rgba(239,68,68,0.15)",color:"#EF4444" }}>⚠️ FLAGGED</span>}
              </div>
              <div style={{ fontSize:9,color:"#60A5FA",marginTop:2 }}>{t.id} · {t.user} · {t.type}</div>
              <div style={{ fontSize:9,color:"#9CA3AF",marginTop:2 }}>{t.date}</div>
            </div>
          </div>
          <ARow title="" actions={["Review Transaction","Audit Transaction","Flag Activity","Export Audit Report"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function FraudDetectionCenter({ onBack }) {
  const cases = [
    { id:"FRD-0421",type:"Coin Farming",         user:"@BotUser1",  risk:"Critical",status:"Investigating",amount:"$2.4K" },
    { id:"FRD-0384",type:"Fake Payment",          user:"@SuspectX",  risk:"High",    status:"Investigating",amount:"$499" },
    { id:"FRD-0312",type:"Withdrawal Manipulation",user:"@FraudQA", risk:"High",    status:"Escalated",    amount:"$840" },
    { id:"FRD-0284",type:"Gift Chargebacks",      user:"@ScamUser",  risk:"Medium",  status:"Resolved",     amount:"$142" },
  ];
  const sc = { Investigating:"#1F6BFF",Escalated:"#A855F7",Resolved:"#10B981","Under Review":"#F59E0B" };
  const rc = { Critical:"#EF4444",High:"#F97316",Medium:"#F59E0B",Low:"#60A5FA" };
  return (
    <Shell title="🚨 Fraud Detection Center" subtitle="Financial Fraud Monitoring" onBack={onBack}>
      <KGrid items={[
        { l:"Active Cases",  v:"8",    color:"#EF4444",icon:"🚨" },
        { l:"Critical",      v:"2",    color:"#A855F7",icon:"🔴" },
        { l:"Prevented Loss",v:"$4.2K",color:"#10B981",icon:"🛡️" },
      ]}/>
      {cases.map((c,i) => (
        <motion.div key={c.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,borderLeft:`3px solid ${rc[c.risk]}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <div style={{ flex:1,marginRight:8 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.type}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>{c.id} · {c.user} · Amount at risk: <span style={{ color:"#FFC83D",fontWeight:800 }}>{c.amount}</span></div>
              <div style={{ fontSize:9,color:rc[c.risk],fontWeight:800,marginTop:2 }}>Risk: {c.risk}</div>
            </div>
            <SBadge status={c.status} colors={sc}/>
          </div>
          <ARow title="" actions={["Investigate Case","Freeze Wallet","Escalate Case","Submit Findings"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function RevenueAnalyticsCenter({ onBack }) {
  return (
    <Shell title="📈 Revenue Analytics Center" subtitle="Advanced Revenue Analysis" onBack={onBack}>
      <KGrid items={[
        { l:"YoY Growth",    v:"+38%",  color:"#10B981",icon:"📈" },
        { l:"QoQ Growth",    v:"+22%",  color:"#FFC83D",icon:"📊" },
        { l:"Forecast Q3",   v:"$280K", color:"#60A5FA",icon:"🔮" },
      ]}/>
      <Chart label="📈 REVENUE TREND (USD K)" data={revData} color="#FFC83D" gid="rac1"/>
      <Chart label="🪙 COIN SALES (K Units)" data={coinData} color="#10B981" gid="rac2"/>
      <Chart label="🏦 WITHDRAWALS PER DAY" data={wdrData} color="#A78BFA" gid="rac3" type="bar"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 PERFORMANCE vs TARGETS</div>
        <PBar label="Revenue Target (Jun)" value={88} max={100} color="#FFC83D"/>
        <PBar label="Withdrawal SLA" value={92} max={100} color="#10B981"/>
        <PBar label="Fraud Prevention" value={96} max={100} color="#60A5FA"/>
        <PBar label="CSAT Financial" value={89} max={100} color="#A78BFA"/>
      </div>
      <ARow title="⚡" actions={["View Analytics","Compare Revenue","Generate Forecast","Export Analytics"]}/>
    </Shell>
  );
}

function CountryRevenueCenter({ onBack }) {
  const countries = [
    { name:"Saudi Arabia",flag:"🇸🇦",revenue:"$42K",growth:"+24%",pct:48,color:"#10B981" },
    { name:"Qatar",       flag:"🇶🇦",revenue:"$18K",growth:"+18%",pct:21,color:"#FFC83D" },
    { name:"UAE",         flag:"🇦🇪",revenue:"$14K",growth:"+21%",pct:16,color:"#60A5FA" },
    { name:"Egypt",       flag:"🇪🇬",revenue:"$8K", growth:"+31%",pct:9, color:"#A78BFA" },
    { name:"Iraq",        flag:"🇮🇶",revenue:"$6K", growth:"+42%",pct:7, color:"#EC4899" },
  ];
  return (
    <Shell title="🌍 Country Revenue Center" subtitle="Country-Wise Revenue Performance" onBack={onBack}>
      <KGrid items={[
        { l:"Active Countries",v:"47",    color:"#60A5FA",icon:"🌍" },
        { l:"Top Market",      v:"Saudi", color:"#FFC83D",icon:"🏆" },
        { l:"Fastest Growth",  v:"Iraq",  color:"#10B981",icon:"🚀" },
      ]}/>
      {countries.map((c,i) => (
        <motion.div key={c.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10 }}>
          <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:8 }}>
            <div style={{ fontSize:26 }}>{c.flag}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{c.name}</div>
              <div style={{ fontSize:9,color:"#60A5FA" }}>Share: {c.pct}% of total revenue</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{c.revenue}</div>
              <div style={{ fontSize:10,fontWeight:800,color:"#10B981" }}>{c.growth}</div>
            </div>
          </div>
          <PBar label="" value={c.pct} max={100} color={c.color}/>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["View Country Revenue","Compare Countries","Export Country Report","Analyze Growth"]}/>
    </Shell>
  );
}

function TopEarnersCenter({ onBack }) {
  const [tab, setTab] = useState("Hosts");
  const data = {
    Hosts: [
      { rank:1,name:"@SaraLive",  rev:"$4.2K",icon:"🎙️" },
      { rank:2,name:"@MoonVoice", rev:"$3.8K",icon:"🎙️" },
      { rank:3,name:"@StarQA",    rev:"$2.4K",icon:"🎙️" },
    ],
    Agencies: [
      { rank:1,name:"StarPro QA",  rev:"$12.4K",icon:"🏢" },
      { rank:2,name:"EliteQA",     rev:"$8.1K", icon:"🏢" },
      { rank:3,name:"VoiceHouse",  rev:"$4.8K", icon:"🏢" },
    ],
    Gifters: [
      { rank:1,name:"@DiamondQA",  rev:"480K coins",icon:"💎" },
      { rank:2,name:"@GoldRose",   rev:"320K coins",icon:"🌹" },
      { rank:3,name:"@StarLight",  rev:"218K coins",icon:"⭐" },
    ],
  };
  const colors = { 1:"#FFC83D",2:"#C0C0C0",3:"#CD7F32" };
  return (
    <Shell title="🏆 Top Earners Center" subtitle="Revenue Leaderboards" onBack={onBack}>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {["Hosts","Agencies","Gifters"].map(t => (
          <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTab(t)}
            style={{ flex:1,padding:"8px",borderRadius:12,fontSize:10,fontWeight:800,border:"none",cursor:"pointer",
              background:tab===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:tab===t?"#fff":"#60A5FA" }}>
            {t}
          </motion.button>
        ))}
      </div>
      {data[tab].map((e,i) => (
        <motion.div key={e.name} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
          style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:"50%",background:`${colors[e.rank]}22`,border:`2px solid ${colors[e.rank]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:colors[e.rank],flexShrink:0 }}>
            {e.rank}
          </div>
          <div style={{ fontSize:18,flexShrink:0 }}>{e.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{e.name}</div>
          </div>
          <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{e.rev}</div>
        </motion.div>
      ))}
      <ARow title="⚡" actions={["View Rankings","Export Rankings","Compare Earnings"]}/>
    </Shell>
  );
}

function FinancialIntelligenceCenter({ onBack }) {
  const insights = [
    "Gift revenue declining 8% week-over-week — review gift pricing strategy",
    "Saudi Arabia shows 28% YoY growth — increase investment allocation",
    "Coin purchase conversion rate at 4.2% — optimize pricing funnel",
    "Withdrawal processing time averaging 3.2 days — optimize payout flow",
    "3 high-value wallets showing unusual transaction patterns — review for fraud",
  ];
  return (
    <Shell title="🧠 Financial Intelligence" subtitle="AI-Powered Financial Insights" onBack={onBack}>
      <KGrid items={[
        { l:"AI Accuracy",   v:"94%",     color:"#10B981",icon:"🧠" },
        { l:"Revenue Forecast",v:"$100K", color:"#FFC83D",icon:"🔮" },
        { l:"Risk Score",    v:"Low",     color:"#60A5FA",icon:"🛡️" },
      ]}/>
      <Chart label="📈 AI GROWTH FORECAST" data={[...revData,{d:"Jul",v:96},{d:"Aug",v:108}]} color="#10B981" gid="fi1"/>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>💡 AI FINANCIAL INSIGHTS</div>
        {insights.map((ins,i) => (
          <div key={i} style={{ display:"flex",gap:8,padding:"8px 0",borderBottom:i<insights.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
            <span style={{ color:"#FFC83D",fontWeight:800,fontSize:11,flexShrink:0 }}>→</span>
            <span style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.5 }}>{ins}</span>
          </div>
        ))}
      </div>
      <ARow title="⚡" actions={["Generate Forecast","Analyze Risks","View Insights","Profitability Analysis"]}/>
    </Shell>
  );
}

function FinancialCommunicationCenter({ onBack }) {
  const [msg, setMsg] = useState("");
  const [target, setTarget] = useState("All Users");
  return (
    <Shell title="📨 Financial Communication" subtitle="Finance Announcements & Notices" onBack={onBack}>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>👥 SEND TO</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {["All Users","All Hosts","Top Gifters","Pending Withdrawal","Finance Team"].map(t => (
            <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTarget(t)}
              style={{ padding:"5px 11px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                background:target===t?"linear-gradient(135deg,#1F6BFF,#6366F1)":"rgba(255,255,255,0.06)",color:target===t?"#fff":"#60A5FA" }}>
              {t}
            </motion.button>
          ))}
        </div>
      </div>
      <div style={{ ...S.glass(),padding:"13px",marginBottom:12 }}>
        <div style={S.sec}>✍️ MESSAGE</div>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Write your financial notice or announcement…"
          style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(31,107,255,0.2)",borderRadius:11,padding:"10px 12px",color:"#fff",fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit" }}/>
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",marginTop:10,padding:"12px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#1F6BFF,#7C3AED)",boxShadow:"0 6px 20px rgba(31,107,255,0.35)" }}>
          📨 Send Message
        </motion.button>
      </div>
      <ARow title="⚡ MORE" actions={["Create Notice","Broadcast Update","Notify Users"]}/>
    </Shell>
  );
}

function FinanceStaffManagementCenter({ onBack }) {
  const staff = [
    { name:"Rania Al-Kaabi",  role:"Senior Finance Analyst",tasks:12,score:92,status:"Online" },
    { name:"Khalid Omar",     role:"Withdrawal Specialist", tasks:8, score:88,status:"Online" },
    { name:"Fatima Hassan",   role:"Fraud Investigator",    tasks:6, score:96,status:"Busy" },
    { name:"Ahmad Nasser",    role:"Finance Auditor",       tasks:10,score:84,status:"Offline" },
  ];
  const sc = { Online:"#10B981",Busy:"#F59E0B",Offline:"#9CA3AF" };
  return (
    <Shell title="👥 Finance Staff Management" subtitle="Finance Department Team" onBack={onBack}>
      <KGrid items={[
        { l:"Total Staff",  v:"12",  color:"#60A5FA",icon:"👥" },
        { l:"Online Now",   v:"8",   color:"#10B981",icon:"🟢" },
        { l:"Avg Score",    v:"90%", color:"#FFC83D",icon:"🏆" },
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
          <PBar label="Performance Score" value={s.score} max={100} color="#1F6BFF"/>
          <ARow title="" actions={["Assign Tasks","Monitor Performance","Review Productivity"]}/>
        </motion.div>
      ))}
    </Shell>
  );
}

function FinancialSettingsCenter({ onBack }) {
  const settings = [
    { name:"Withdrawal Limits",       icon:"🏦",desc:"Min/max withdrawal thresholds",      color:"#10B981" },
    { name:"Commission Rates",        icon:"🤝",desc:"Global commission rate settings",     color:"#FFC83D" },
    { name:"Coin Exchange Rate",      icon:"🪙",desc:"Coin to USD conversion rates",        color:"#A78BFA" },
    { name:"Tax & Compliance Rules",  icon:"📋",desc:"Tax deduction and compliance config", color:"#EF4444" },
    { name:"Payment Gateway Config",  icon:"💳",desc:"Payment provider settings",           color:"#60A5FA" },
    { name:"Fraud Thresholds",        icon:"🚨",desc:"Suspicious activity detection rules", color:"#F97316" },
  ];
  return (
    <Shell title="⚙️ Financial Settings Center" subtitle="Financial Platform Configuration" onBack={onBack}>
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
      <ARow title="⚡" actions={["Update Settings","Save Configuration","Reset Settings","Manage Tax Rules"]}/>
    </Shell>
  );
}

function FMExclusiveTools({ onBack }) {
  const tools = [
    { name:"Emergency Wallet Freeze",   icon:"❄️",desc:"Instantly freeze all flagged wallets",         color:"#60A5FA" },
    { name:"Revenue Protection Mode",   icon:"🛡️",desc:"Activate revenue protection protocols",         color:"#10B981" },
    { name:"Launch Financial Audit",    icon:"🔍",desc:"Initiate a full platform financial audit",      color:"#FFC83D" },
    { name:"Risk Assessment",           icon:"⚠️",desc:"Run AI-powered financial risk assessment",      color:"#F59E0B" },
    { name:"Profit Optimization",       icon:"📈",desc:"AI-driven profit optimization recommendations", color:"#A78BFA" },
    { name:"Compliance Review",         icon:"📋",desc:"Launch regulatory compliance review",           color:"#EF4444" },
  ];
  return (
    <Shell title="🚀 FM Exclusive Tools" subtitle="Finance Manager Exclusive Powers" onBack={onBack}>
      <div style={{ background:"rgba(255,200,61,0.08)",border:"1px solid rgba(255,200,61,0.25)",borderRadius:14,padding:"12px 14px",marginBottom:16 }}>
        <div style={{ fontSize:11,fontWeight:900,color:"#FFC83D",marginBottom:4 }}>🔐 EXCLUSIVE ACCESS — FINANCE MANAGER ONLY</div>
        <div style={{ fontSize:10,color:"#DCE3F0",lineHeight:1.6 }}>These tools carry high financial authority. All activations are logged, audited, and require Finance Manager authentication.</div>
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
  overview:    FinanceOverviewCenter,
  revenue:     RevenueManagementCenter,
  withdrawals: WithdrawalManagementCenter,
  payments:    PaymentManagementCenter,
  wallets:     WalletManagementCenter,
  coins:       CoinEconomyCenter,
  gifts:       GiftRevenueCenter,
  commission:  CommissionManagementCenter,
  pl:          ProfitLossCenter,
  reports:     FinancialReportCenter,
  audit:       TransactionAuditCenter,
  fraud:       FraudDetectionCenter,
  analytics:   RevenueAnalyticsCenter,
  countries:   CountryRevenueCenter,
  earners:     TopEarnersCenter,
  intelligence:FinancialIntelligenceCenter,
  comms:       FinancialCommunicationCenter,
  staff:       FinanceStaffManagementCenter,
  settings:    FinancialSettingsCenter,
  exclusive:   FMExclusiveTools,
};

const MODULES = [
  { id:"overview",     icon:"💰", label:"Finance Overview",      subtitle:"Financial Summary",    gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.45)" },
  { id:"revenue",      icon:"📈", label:"Revenue Management",    subtitle:"Revenue Monitor",      gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.35)" },
  { id:"withdrawals",  icon:"🏦", label:"Withdrawal Management", subtitle:"Payout Processing",    gradient:"linear-gradient(145deg,#A78BFA,#7C3AED)", glow:"rgba(167,139,250,0.35)" },
  { id:"payments",     icon:"💳", label:"Payment Management",    subtitle:"Incoming Payments",    gradient:"linear-gradient(145deg,#EC4899,#9D174D)", glow:"rgba(236,72,153,0.35)" },
  { id:"wallets",      icon:"👛", label:"Wallet Management",     subtitle:"Wallet Auditing",      gradient:"linear-gradient(145deg,#1F6BFF,#0D4DB8)", glow:"rgba(31,107,255,0.4)" },
  { id:"coins",        icon:"🪙", label:"Coin Economy",          subtitle:"Virtual Currency",     gradient:"linear-gradient(145deg,#FFC83D,#F59E0B)", glow:"rgba(255,200,61,0.4)" },
  { id:"gifts",        icon:"🎁", label:"Gift Revenue",          subtitle:"Gift Analytics",       gradient:"linear-gradient(145deg,#EC4899,#A78BFA)", glow:"rgba(236,72,153,0.35)" },
  { id:"commission",   icon:"🤝", label:"Commission Management", subtitle:"Commission Payouts",   gradient:"linear-gradient(145deg,#60A5FA,#1F6BFF)", glow:"rgba(96,165,250,0.35)" },
  { id:"pl",           icon:"📊", label:"Profit & Loss",         subtitle:"P&L Analysis",         gradient:"linear-gradient(145deg,#10B981,#1F6BFF)", glow:"rgba(16,185,129,0.3)" },
  { id:"reports",      icon:"📑", label:"Financial Reports",     subtitle:"Generate Reports",     gradient:"linear-gradient(145deg,#0EA5E9,#7C3AED)", glow:"rgba(14,165,233,0.3)" },
  { id:"audit",        icon:"🔍", label:"Transaction Audit",     subtitle:"Audit Transactions",   gradient:"linear-gradient(145deg,#06B6D4,#0E7490)", glow:"rgba(6,182,212,0.35)" },
  { id:"fraud",        icon:"🚨", label:"Fraud Detection",       subtitle:"Financial Security",   gradient:"linear-gradient(145deg,#EF4444,#A855F7)", glow:"rgba(239,68,68,0.4)" },
  { id:"analytics",    icon:"📈", label:"Revenue Analytics",     subtitle:"Advanced Analytics",   gradient:"linear-gradient(145deg,#FFC83D,#10B981)", glow:"rgba(255,200,61,0.35)" },
  { id:"countries",    icon:"🌍", label:"Country Revenue",       subtitle:"Global Revenue",       gradient:"linear-gradient(145deg,#0EA5E9,#1F6BFF)", glow:"rgba(14,165,233,0.35)" },
  { id:"earners",      icon:"🏆", label:"Top Earners",           subtitle:"Revenue Leaders",      gradient:"linear-gradient(145deg,#FFC83D,#F97316)", glow:"rgba(255,200,61,0.4)" },
  { id:"intelligence", icon:"🧠", label:"Financial Intelligence",subtitle:"AI Forecasting",       gradient:"linear-gradient(145deg,#10B981,#059669)", glow:"rgba(16,185,129,0.35)" },
  { id:"comms",        icon:"📨", label:"Finance Communication", subtitle:"Notices & Alerts",     gradient:"linear-gradient(145deg,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.35)" },
  { id:"staff",        icon:"👥", label:"Finance Staff",         subtitle:"Team Management",      gradient:"linear-gradient(145deg,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.35)" },
  { id:"settings",     icon:"⚙️", label:"Financial Settings",    subtitle:"Platform Config",      gradient:"linear-gradient(145deg,#374151,#0D1B3E)", glow:"rgba(55,65,81,0.4)" },
  { id:"exclusive",    icon:"🚀", label:"FM Exclusive Tools",    subtitle:"Executive Powers",     gradient:"linear-gradient(145deg,#FFC83D,#EF4444)", glow:"rgba(255,200,61,0.5)", featured:true },
];

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function FinanceManagerDashboard() {
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
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>💰 Finance Manager Dashboard</div>
            <div style={{ fontSize:10,color:"#60A5FA" }}>Revenue · Withdrawals · Payments · Fraud · Analytics</div>
          </div>
          <div style={S.goldBadge}><span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>💰 FM</span></div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:-60,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,200,61,0.15),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{ ...S.glass(),padding:"16px",marginBottom:12 }}>
          <div style={{ height:3,borderRadius:2,background:"linear-gradient(90deg,#FFC83D,#10B981,#1F6BFF)",marginBottom:12 }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:3,letterSpacing:"0.08em" }}>VYRO LIVE · REVENUE & FINANCIAL CONTROL DIVISION · ENTERPRISE LEVEL</div>
          <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Finance Manager Control Center</div>
          <div style={{ fontSize:11,color:"#DCE3F0",lineHeight:1.7 }}>Central financial hub — revenue, withdrawals, payments, wallet audits, commissions, P&L, fraud detection, and forecasting.</div>
        </div>

        <KGrid items={[
          { l:"Total Revenue",    v:"$2.4M",  color:"#FFC83D",icon:"💰" },
          { l:"Today Revenue",    v:"$4.8K",  color:"#10B981",icon:"📅" },
          { l:"Weekly Revenue",   v:"$28.4K", color:"#60A5FA",icon:"📆" },
          { l:"Monthly Revenue",  v:"$88K",   color:"#A78BFA",icon:"📊" },
          { l:"Yearly Revenue",   v:"$880K",  color:"#FFC83D",icon:"📈" },
          { l:"Pending WDR",      v:"18",     color:"#F59E0B",icon:"⏳" },
          { l:"Completed WDR",    v:"142",    color:"#10B981",icon:"✅" },
          { l:"Total Deposits",   v:"$284K",  color:"#60A5FA",icon:"💳" },
          { l:"Wallet Balance",   v:"$2.1M",  color:"#FFC83D",icon:"👛" },
          { l:"Commission Dist.", v:"$18K",   color:"#A78BFA",icon:"🤝" },
          { l:"Growth Rate",      v:"+22%",   color:"#10B981",icon:"🚀" },
          { l:"Risk Alerts",      v:"3",      color:"#EF4444",icon:"⚠️" },
        ]}/>
      </div>

      <div style={{ padding:"0 14px 14px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#60A5FA",marginBottom:12,letterSpacing:"0.08em" }}>
          {MODULES.length} FINANCIAL MODULES · TAP TO ACCESS
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