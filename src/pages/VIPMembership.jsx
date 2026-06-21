/**
 * VIPMembership — VYRO LIVE CONNECT EARNING VIP Premium Membership System
 * Access: Profile > More Services > VIP Membership
 * Theme: Dark Luxury Enterprise · Gold Platinum · Premium Glassmorphism
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";

/* ─────────────── DATA ─────────────── */
const VIP_LEVELS = [
  { id:"vip1",    level:"VIP 1",           icon:"🛡️", price_coins:100000,    price_cash:"$5",     color:"#60A5FA", gradient:"linear-gradient(135deg,#93C5FD,#3B82F6,#1E40AF)", glow:"rgba(59,130,246,0.5)",   stone:"Crystal Shield",  tier:1, daily_coins:300,
    design:["Silver Crown","Crystal Center Stone","Blue Glow Effect","Premium Metal Frame"],
    benefits:["VIP Badge","Basic Profile Frame","Colored Username","Exclusive VIP Emojis","VIP Welcome Message","Basic Priority Support"] },
  { id:"vvip",    level:"VVIP",            icon:"👑", price_coins:200000,    price_cash:"$10",    color:"#FCD34D", gradient:"linear-gradient(135deg,#FDE68A,#F59E0B,#D97706)", glow:"rgba(245,158,11,0.5)",   stone:"Golden Crystal Crown", tier:2, daily_coins:500,
    design:["Gold Crown","Emerald Stone","Luxury Glow"],
    benefits:["VVIP Badge","Premium Profile Frame","Colored Username","Exclusive Chat Bubble","VIP Emojis Pack","Priority Support","2% Gift Cashback"] },
  { id:"svip",    level:"SVIP",            icon:"💎", price_coins:500000,    price_cash:"$25",    color:"#38BDF8", gradient:"linear-gradient(135deg,#7DD3FC,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.5)",   stone:"Royal Sapphire Crown", tier:3, daily_coins:700,
    design:["Blue Sapphire Crystal","Golden Crown","Diamond Particles"],
    benefits:["SVIP Badge","Animated Profile Frame","Premium Chat Bubble","Exclusive Stickers","Entrance Effect","Priority Support","3% Gift Cashback"] },
  { id:"ssvip",   level:"SSVIP",           icon:"🏆", price_coins:800000,    price_cash:"$40",    color:"#E2E8F0", gradient:"linear-gradient(135deg,#F1F5F9,#CBD5E1,#64748B)", glow:"rgba(203,213,225,0.5)",  stone:"Imperial Diamond Shield", tier:4, daily_coins:1000,
    design:["Platinum Shield","Large Diamond","Golden Wings"],
    benefits:["SSVIP Badge","Animated Frame","Animated Entrance Effect","Exclusive Username Color","Room Entry Priority","VIP Support","5% Gift Cashback"] },
  { id:"msvip",   level:"MSVIP",           icon:"🔥", price_coins:1500000,   price_cash:"$75",    color:"#F97316", gradient:"linear-gradient(135deg,#FED7AA,#F97316,#C2410C)", glow:"rgba(249,115,22,0.5)",   stone:"Master Royal Crown", tier:5, daily_coins:1500,
    design:["Black Gold Crown","Ruby Stone","Luxury Fire Effect"],
    benefits:["MSVIP Crown Badge","Luxury Profile Frame","Vehicle Entry Effect","Premium Chat Bubble","Exclusive Gifts Access","VIP Support","7% Gift Cashback"] },
  { id:"mssvip",  level:"MSSVIP",          icon:"🦅", price_coins:2500000,   price_cash:"$125",   color:"#C084FC", gradient:"linear-gradient(135deg,#E9D5FF,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.5)",   stone:"Royal Phoenix Crown", tier:6, daily_coins:2500,
    design:["Phoenix Wings","Purple Crystal","Fire Animation"],
    benefits:["MSSVIP Crown Badge","Luxury Animated Frame","Premium Entrance Animation","Exclusive Gift Collection","VIP Lounge Access","Enhanced Support","10% Gift Cashback"] },
  { id:"misvip",  level:"MISVIP",          icon:"⚜️", price_coins:5000000,   price_cash:"$250",   color:"#FFC83D", gradient:"linear-gradient(135deg,#FEF3C7,#FFC83D,#92400E)", glow:"rgba(255,200,61,0.55)",  stone:"Imperial Emperor Badge", tier:7, daily_coins:4000,
    design:["Emperor Crown","Platinum Gold Style","Royal Energy Effect"],
    benefits:["MISVIP Royal Crown","Diamond Profile Frame","Premium Vehicle Effect","Exclusive ID Tag","VIP Room Access","Priority Verification","VIP Exclusive Tasks","VIP Lucky Draw Tickets","VIP Shop Discounts","12% Gift Cashback"] },
  { id:"missvip", level:"MISSVIP",         icon:"💠", price_coins:10000000,  price_cash:"$500",   color:"#818CF8", gradient:"linear-gradient(135deg,#C7D2FE,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.55)",  stone:"Ultimate Diamond King", tier:8, daily_coins:6000,
    design:["Purple Royal Crystal","Diamond Crown","Platinum Wings"],
    benefits:["MISSVIP Diamond Crown","Diamond Animated Frame","Legendary Entrance Effect","Exclusive Room Theme","Exclusive Avatar Items","VIP Event Access","Monthly Exclusive Gift Pack","Double Daily Check-in Rewards","VIP Event Invitations","15% Gift Cashback"] },
  { id:"ultra",   level:"ULTRA MISSVIP",   icon:"🐉", price_coins:20000000,  price_cash:"$1,000", color:"#EF4444", gradient:"linear-gradient(135deg,#FCA5A5,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.55)",   stone:"Royal Dragon Crown", tier:9, daily_coins:30000,
    design:["Dragon Wings","Golden Crown","Red Ruby Effect"],
    benefits:["Ultra Crown Badge","Ultra Animated Frame","Super Entrance Effect","Ultra Vehicle Effect","Exclusive Gifts","VIP Event Priority","Monthly 500,000 Bonus Coins","Priority Room Seat Reservation","Exclusive Seasonal Avatar Set","18% Gift Cashback"] },
  { id:"legend",  level:"LEGEND IMISVIP",  icon:"🌌", price_coins:50000000,  price_cash:"$2,500", color:"#A5F3FC", gradient:"linear-gradient(135deg,#CFFAFE,#06B6D4,#164E63)", glow:"rgba(6,182,212,0.55)",   stone:"Galaxy Legendary Crown", tier:10, daily_coins:50000,
    design:["Cosmic Diamond","Galaxy Particles","Platinum Wings"],
    benefits:["Legend Crown Badge","Legendary Profile Frame","Mythical Entrance Effect","Custom Chat Bubble","Exclusive Username Style","Special VIP Events","Monthly 1,500,000 Bonus Coins","Custom Profile Background","Priority Feature Testing Access","Dedicated VIP Support","20% Gift Cashback"] },
  { id:"royal",   level:"ROYAL IMISSVIP",  icon:"🔱", price_coins:100000000, price_cash:"$5,000", color:"#FFC83D", gradient:"linear-gradient(135deg,#FFC83D,#EF4444,#A855F7)", glow:"rgba(255,200,61,0.65)",  stone:"Royal Emperor Throne", tier:11, daily_coins:100000, isMax:true,
    design:["Emperor Crown","Royal Throne Symbol","Red Diamond","Platinum Wings"],
    benefits:["Royal King Crown Badge","Ultimate Animated Frame","Royal Entrance Effect","Royal Vehicle Effect","Custom Username Color","Custom Profile Theme","Exclusive Royal Gifts","Highest Room Priority","Dedicated Account Manager","Premium 24/7 Support","Private VIP Events","Monthly 5,000,000 Bonus Coins","Custom Animated Profile Background","Royal Leaderboard Badge","Early Access To New Features","25% Gift Cashback"] },
];

const DURATIONS = [
  { id:"15d",  label:"15 Days",   discount:"",       badge:"",          mult:0.5  },
  { id:"1m",   label:"1 Month",   discount:"",       badge:"Standard",  mult:1    },
  { id:"3m",   label:"3 Months",  discount:"15% OFF",badge:"SAVE 15%",  mult:2.55 },
  { id:"6m",   label:"6 Months",  discount:"25% OFF",badge:"SAVE 25%",  mult:4.5  },
  { id:"12m",  label:"12 Months", discount:"40% OFF",badge:"BEST VALUE",mult:7.2  },
];

/* ─────────────── SHARED ─────────────── */
function fmt(n) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n/1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

const S = {
  page:{ minHeight:"100dvh", background:"linear-gradient(160deg,#0A0500 0%,#1A0E00 40%,#0D0826 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:90 },
  glass:(x={})=>({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,200,61,0.15)", borderRadius:20, ...x }),
  sec:{ fontSize:10, fontWeight:800, color:"#FFC83D", letterSpacing:"0.08em", marginBottom:10 },
  hdr:{ position:"sticky",top:0,zIndex:50,background:"rgba(10,5,0,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,200,61,0.18)",boxShadow:"0 2px 20px rgba(0,0,0,0.6)" },
};

function BackHeader({ title, subtitle, onBack, extra }) {
  return (
    <div style={S.hdr}>
      <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
        <motion.button whileTap={{ scale:0.88 }} onClick={onBack}
          style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,200,61,0.1)",border:"1px solid rgba(255,200,61,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
          <ChevronLeft size={18} color="#FFC83D"/>
        </motion.button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>{title}</div>
          <div style={{ fontSize:10,color:"#FFC83D" }}>{subtitle}</div>
        </div>
        {extra}
      </div>
    </div>
  );
}

function VIPBadge3D({ vip, size=52 }) {
  return (
    <div style={{ width:size,height:size,borderRadius:size*0.27,flexShrink:0,background:vip.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.46,
      boxShadow:`0 6px 20px ${vip.glow}, inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)`,position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"44%",background:"linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)",borderRadius:"0 0 50% 50%" }}/>
      {vip.icon}
    </div>
  );
}

function PBar({ value, color, height=5 }) {
  return (
    <div style={{ height,borderRadius:height/2,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
      <motion.div initial={{ width:0 }} animate={{ width:`${Math.min(value,100)}%` }} transition={{ duration:0.8 }}
        style={{ height:"100%",borderRadius:height/2,background:color }}/>
    </div>
  );
}

/* ─────────────── MODULE: UPGRADE ─────────────── */
function UpgradeModule({ currentVip, vipLevels = VIP_LEVELS, onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedDur, setSelectedDur] = useState("1m");
  const [payWith, setPayWith] = useState("coins");
  const [step, setStep] = useState(1); // 1=select, 2=duration, 3=confirm

  const dur = DURATIONS.find(d => d.id===selectedDur);
  const calcCoins = (vip) => Math.round(vip.price_coins * (dur?.mult||1));
  const calcCash  = (vip) => {
    const base = parseFloat((vip.price_cash||"$0").replace(/[^0-9.]/g,""));
    return `$${(base*(dur?.mult||1)).toFixed(0)}`;
  };

  return (
    <div style={S.page}>
      <BackHeader title="🚀 VIP Growth Engine" subtitle="Upgrade Your VIP Level" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        {/* Progress indicator */}
        <div style={{ display:"flex",gap:0,marginBottom:16 }}>
          {["Select Level","Duration","Confirm"].map((s,i) => (
            <div key={s} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
              <div style={{ width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,
                background:step>i?"linear-gradient(135deg,#FFC83D,#F59E0B)":step===i+1?"rgba(255,200,61,0.3)":"rgba(255,255,255,0.06)",
                color:step>i?"#0A0500":step===i+1?"#FFC83D":"rgba(255,255,255,0.3)",
                border:step===i+1?"1px solid rgba(255,200,61,0.5)":"none" }}>
                {step>i+1 ? "✓" : i+1}
              </div>
              <span style={{ fontSize:8,fontWeight:700,color:step===i+1?"#FFC83D":"rgba(255,255,255,0.3)" }}>{s}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: Level Selection */}
        {step===1 && (
          <>
            <div style={S.sec}>👑 SELECT VIP LEVEL</div>
            {vipLevels.map((vip,i) => (
              <motion.div key={vip.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.03 }}
                whileTap={{ scale:0.97 }} onClick={() => setSelectedLevel(vip.id)}
                style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,cursor:"pointer",
                  border:`1.5px solid ${selectedLevel===vip.id?vip.color:"rgba(255,200,61,0.12)"}`,
                  boxShadow:selectedLevel===vip.id?`0 6px 24px ${vip.glow}`:"none",
                  position:"relative",overflow:"hidden" }}>
                {vip.isMax && <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#FFC83D,#EF4444,#A855F7)" }}/>}
                <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                  <VIPBadge3D vip={vip} size={48}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{vip.level}</div>
                    <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:1 }}>{vip.stone}</div>
                    <div style={{ display:"flex",gap:8,marginTop:4 }}>
                      <span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🪙 {fmt(vip.price_coins)}</span>
                      <span style={{ fontSize:10,color:"rgba(255,255,255,0.4)" }}>·</span>
                      <span style={{ fontSize:10,fontWeight:800,color:"#34D399" }}>{vip.price_cash}</span>
                    </div>
                  </div>
                  <div style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${selectedLevel===vip.id?vip.color:"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    {selectedLevel===vip.id && <div style={{ width:10,height:10,borderRadius:"50%",background:vip.color }}/>}
                  </div>
                </div>
              </motion.div>
            ))}
            <motion.button whileTap={{ scale:0.96 }} disabled={!selectedLevel} onClick={() => setStep(2)}
              style={{ width:"100%",padding:"13px",borderRadius:14,border:"none",cursor:selectedLevel?"pointer":"default",fontWeight:900,fontSize:14,color:"#0A0500",
                background:selectedLevel?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.1)",
                boxShadow:selectedLevel?"0 6px 22px rgba(255,200,61,0.4)":"none",marginTop:4 }}>
              Next: Choose Duration →
            </motion.button>
          </>
        )}

        {/* STEP 2: Duration */}
        {step===2 && (() => {
          const vip = vipLevels.find(v => v.id===selectedLevel);
          if (!vip) return null;
          return (
            <>
              <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:14 }}>
                <VIPBadge3D vip={vip} size={44}/>
                <div>
                  <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{vip.level}</div>
                  <div style={{ fontSize:10,color:vip.color }}>{vip.stone}</div>
                </div>
              </div>
              <div style={S.sec}>📅 SELECT DURATION PLAN</div>
              {DURATIONS.map(d => (
                <motion.div key={d.id} whileTap={{ scale:0.97 }} onClick={() => setSelectedDur(d.id)}
                  style={{ ...S.glass(),padding:"12px 14px",marginBottom:10,cursor:"pointer",
                    border:`1.5px solid ${selectedDur===d.id?"#FFC83D":"rgba(255,200,61,0.12)"}`,
                    boxShadow:selectedDur===d.id?"0 6px 22px rgba(255,200,61,0.3)":"none" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",gap:6,alignItems:"center",marginBottom:3 }}>
                        <span style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{d.label}</span>
                        {d.badge && <span style={{ fontSize:8,fontWeight:900,padding:"2px 7px",borderRadius:8,
                          background:d.id==="12m"?"linear-gradient(135deg,#10B981,#059669)":"linear-gradient(135deg,#FFC83D,#F59E0B)",
                          color:d.id==="12m"?"#fff":"#0A0500" }}>{d.badge}</span>}
                      </div>
                      {d.discount && <div style={{ fontSize:10,fontWeight:800,color:"#10B981" }}>{d.discount}</div>}
                      <div style={{ marginTop:6,display:"flex",gap:10 }}>
                        <span style={{ fontSize:11,fontWeight:800,color:"#FFC83D" }}>🪙 {fmt(calcCoins(vip))}</span>
                        <span style={{ fontSize:11,fontWeight:800,color:"#34D399" }}>{calcCash(vip)}</span>
                      </div>
                    </div>
                    <div style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${selectedDur===d.id?"#FFC83D":"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      {selectedDur===d.id && <div style={{ width:10,height:10,borderRadius:"50%",background:"#FFC83D" }}/>}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div style={{ display:"flex",gap:8,marginTop:4 }}>
                <motion.button whileTap={{ scale:0.96 }} onClick={() => setStep(1)}
                  style={{ flex:1,padding:"13px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:800,fontSize:13,background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.7)" }}>
                  ← Back
                </motion.button>
                <motion.button whileTap={{ scale:0.96 }} onClick={() => setStep(3)}
                  style={{ flex:2,padding:"13px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#0A0500",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 6px 22px rgba(255,200,61,0.4)" }}>
                  Review Order →
                </motion.button>
              </div>
            </>
          );
        })()}

        {/* STEP 3: Confirm */}
        {step===3 && (() => {
          const vip = vipLevels.find(v => v.id===selectedLevel);
          const dur2 = DURATIONS.find(d => d.id===selectedDur);
          if (!vip || !dur2) return null;
          return (
            <>
              <div style={{ ...S.glass(),padding:"18px",marginBottom:14,textAlign:"center" }}>
                <div style={{ display:"flex",justifyContent:"center",marginBottom:10 }}><VIPBadge3D vip={vip} size={64}/></div>
                <div style={{ fontSize:18,fontWeight:900,color:vip.color,marginBottom:2 }}>{vip.level}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)" }}>{dur2.label} · {vip.stone}</div>
              </div>
              {/* Pay method toggle */}
              <div style={{ display:"flex",gap:6,marginBottom:14 }}>
                {[{id:"coins",label:"🪙 Pay with Coins"},{id:"cash",label:"💳 Pay with Cash"}].map(p => (
                  <motion.button key={p.id} whileTap={{ scale:0.94 }} onClick={() => setPayWith(p.id)}
                    style={{ flex:1,padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,
                      background:payWith===p.id?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.07)",
                      color:payWith===p.id?"#0A0500":"rgba(255,255,255,0.6)" }}>
                    {p.label}
                  </motion.button>
                ))}
              </div>
              {/* Order summary */}
              <div style={{ ...S.glass(),padding:"14px",marginBottom:14 }}>
                <div style={S.sec}>📋 ORDER SUMMARY</div>
                {[
                  {l:"VIP Level",v:vip.level},
                  {l:"Duration",v:dur2.label},
                  {l:"Discount",v:dur2.discount||"—"},
                  {l:"Price (Coins)",v:`🪙 ${fmt(calcCoins(vip))}`},
                  {l:"Price (Cash)",v:calcCash(vip)},
                ].map(row => (
                  <div key={row.l} style={{ display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize:11,color:"rgba(255,255,255,0.5)" }}>{row.l}</span>
                    <span style={{ fontSize:11,fontWeight:800,color:row.l==="VIP Level"?vip.color:"#fff" }}>{row.v}</span>
                  </div>
                ))}
              </div>
              {payWith==="cash" && (
                <div style={{ ...S.glass(),padding:"13px",marginBottom:14 }}>
                  <div style={S.sec}>💳 SELECT PAYMENT METHOD</div>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                    {["Credit Card","Debit Card","PayPal","JazzCash","EasyPaisa","Bank Payment"].map(m => (
                      <motion.button key={m} whileTap={{ scale:0.92 }}
                        style={{ padding:"7px 13px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:700,fontSize:10,background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.8)" }}>
                        {m}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display:"flex",gap:8 }}>
                <motion.button whileTap={{ scale:0.96 }} onClick={() => setStep(2)}
                  style={{ flex:1,padding:"13px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:800,fontSize:13,background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.7)" }}>
                  ← Back
                </motion.button>
                <motion.button whileTap={{ scale:0.96 }}
                  style={{ flex:2,padding:"13px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#0A0500",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 6px 22px rgba(255,200,61,0.45)" }}>
                  ✅ Confirm & Activate VIP
                </motion.button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

/* ─────────────── MODULE: CUSTOMIZE ─────────────── */
function CustomizeModule({ onBack }) {
  const [settings, setSettings] = useState({ badge:true, frame:true, entry:true, chat:false });
  const toggle = k => setSettings(p => ({ ...p, [k]:!p[k] }));
  const options = [
    { key:"frame",  name:"Profile Frame",  icon:"🖼️",  actions:["Preview","Apply","Remove","Change"] },
    { key:"badge",  name:"VIP Badge",      icon:"🏅",  actions:["Activate","Hide","Change Style"] },
    { key:"entry",  name:"Entry Effect",   icon:"🎭",  actions:["Preview","Activate","Change"] },
    { key:"chat",   name:"Chat Effect",    icon:"💬",  actions:["Enable","Disable"] },
  ];
  return (
    <div style={S.page}>
      <BackHeader title="🎨 VIP Customization" subtitle="Personalize Your VIP Experience" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        {/* Preview card */}
        <div style={{ ...S.glass(),padding:"18px",marginBottom:14,textAlign:"center",background:"linear-gradient(135deg,rgba(255,200,61,0.08),rgba(168,85,247,0.06))" }}>
          <div style={{ width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#FFC83D,#A855F7)",margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 6px 24px rgba(255,200,61,0.4),0 0 0 3px rgba(255,200,61,0.3),0 0 0 6px rgba(255,200,61,0.1)" }}>
            👤
          </div>
          <div style={{ fontSize:12,fontWeight:900,color:"#FFC83D" }}>VVIP Member</div>
          <div style={{ fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:2 }}>Live Preview</div>
        </div>
        {options.map((opt,i) => (
          <motion.div key={opt.key} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
            style={{ ...S.glass(),padding:"14px",marginBottom:12 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
              <div style={{ width:40,height:40,borderRadius:12,background:"rgba(255,200,61,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{opt.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{opt.name}</div>
                <div style={{ fontSize:9,color:settings[opt.key]?"#10B981":"#9CA3AF" }}>{settings[opt.key]?"● Active":"● Inactive"}</div>
              </div>
              {/* Toggle */}
              <motion.div whileTap={{ scale:0.9 }} onClick={() => toggle(opt.key)}
                style={{ width:42,height:24,borderRadius:12,cursor:"pointer",position:"relative",
                  background:settings[opt.key]?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.1)",
                  transition:"background 0.25s" }}>
                <motion.div animate={{ x:settings[opt.key]?18:2 }} transition={{ type:"spring",stiffness:500,damping:30 }}
                  style={{ position:"absolute",top:2,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.3)" }}/>
              </motion.div>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
              {opt.actions.map((a,ai) => (
                <motion.button key={a} whileTap={{ scale:0.92 }}
                  style={{ padding:"6px 12px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:9,
                    background:ai===0?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.08)",
                    color:ai===0?"#0A0500":"rgba(255,255,255,0.7)" }}>
                  {a}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── MODULE: REWARDS ─────────────── */
function RewardsModule({ onBack }) {
  const [claimed, setClaimed] = useState(new Set());
  const rewards = [
    { id:"daily",  name:"Daily VIP Reward",    icon:"🎁",  amount:"500 Coins",    ready:true,  color:"#FFC83D" },
    { id:"weekly", name:"Weekly Streak Bonus",  icon:"📅",  amount:"2,000 Coins",  ready:true,  color:"#10B981" },
    { id:"monthly",name:"Monthly VIP Reward",   icon:"🎊",  amount:"8,000 Coins",  ready:false, color:"#A855F7", next:"12 days" },
    { id:"upgrade",name:"Upgrade Reward",       icon:"🚀",  amount:"5,000 Coins",  ready:false, color:"#0EA5E9", next:"After upgrade" },
    { id:"gift1",  name:"Exclusive VIP Gift",   icon:"🏆",  amount:"Luxury Gift",  ready:true,  color:"#F59E0B" },
  ];
  const history = [
    { date:"Jun 10",reward:"Daily Reward",amount:"+500 Coins",color:"#10B981" },
    { date:"Jun 3", reward:"Weekly Bonus",amount:"+2,000 Coins",color:"#10B981" },
    { date:"May 28",reward:"Monthly Reward",amount:"+8,000 Coins",color:"#A855F7" },
    { date:"May 20",reward:"Upgrade Bonus",amount:"+5,000 Coins",color:"#0EA5E9" },
  ];
  return (
    <div style={S.page}>
      <BackHeader title="🎁 VIP Rewards Center" subtitle="Daily & Monthly VIP Rewards" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:14 }}>
          {[{v:"4",l:"Available",icon:"🎁",c:"#FFC83D"},{v:"28.5K",l:"Coins Claimed",icon:"🪙",c:"#10B981"},{v:"6",l:"Days Streak",icon:"🔥",c:"#F97316"}].map(s => (
            <div key={s.l} style={{ background:`${s.c}10`,border:`1px solid ${s.c}25`,borderRadius:14,padding:"12px 8px",textAlign:"center" }}>
              <div style={{ fontSize:16 }}>{s.icon}</div>
              <div style={{ fontSize:14,fontWeight:900,color:s.c }}>{s.v}</div>
              <div style={{ fontSize:8,color:"rgba(255,255,255,0.45)" }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={S.sec}>🎁 AVAILABLE REWARDS</div>
        {rewards.map((r,i) => (
          <motion.div key={r.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
            style={{ ...S.glass(),padding:"13px 14px",marginBottom:10,display:"flex",gap:12,alignItems:"center",borderLeft:`3px solid ${r.color}` }}>
            <div style={{ width:44,height:44,borderRadius:13,background:`${r.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:11,fontWeight:800,color:r.color,marginTop:2 }}>{r.amount}</div>
              {r.next && <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:1 }}>Next: {r.next}</div>}
            </div>
            <motion.button whileTap={{ scale:0.9 }} disabled={!r.ready||claimed.has(r.id)}
              onClick={() => setClaimed(p => new Set([...p,r.id]))}
              style={{ padding:"8px 14px",borderRadius:11,border:"none",cursor:r.ready&&!claimed.has(r.id)?"pointer":"default",fontWeight:800,fontSize:10,
                background:claimed.has(r.id)?"rgba(16,185,129,0.2)":r.ready?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.07)",
                color:claimed.has(r.id)?"#10B981":r.ready?"#0A0500":"rgba(255,255,255,0.3)",
                boxShadow:r.ready&&!claimed.has(r.id)?"0 4px 14px rgba(255,200,61,0.35)":"none" }}>
              {claimed.has(r.id)?"✓ Claimed":r.ready?"Claim":"Locked"}
            </motion.button>
          </motion.div>
        ))}

        <div style={{ ...S.sec,marginTop:10 }}>📋 REWARD HISTORY</div>
        {history.map((h,i) => (
          <div key={i} style={{ ...S.glass(),padding:"11px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11,fontWeight:800,color:"#fff" }}>{h.reward}</div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)" }}>{h.date}</div>
            </div>
            <span style={{ fontSize:12,fontWeight:900,color:h.color }}>{h.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── MODULE: SETTINGS ─────────────── */
function SettingsModule({ onBack }) {
  const [vals, setVals] = useState({ autorenew:true, showbadge:true, showframe:true, entryeffect:true, chateffect:false, privatemode:false });
  const toggle = k => setVals(p => ({ ...p, [k]:!p[k] }));
  const opts = [
    { key:"autorenew",   label:"Auto Renewal",       icon:"🔄", desc:"Automatically renew your VIP membership before expiry" },
    { key:"showbadge",   label:"Show VIP Badge",     icon:"🏅", desc:"Display your VIP badge on your profile" },
    { key:"showframe",   label:"Show Frame",         icon:"🖼️", desc:"Show your VIP profile frame to all users" },
    { key:"entryeffect", label:"Entry Effect ON/OFF",icon:"✨", desc:"Show your VIP entry animation when joining rooms" },
    { key:"chateffect",  label:"Chat Effect ON/OFF", icon:"💬", desc:"Show special VIP effects on your chat messages" },
    { key:"privatemode", label:"Privacy Settings",   icon:"🔒", desc:"Hide your VIP level from public profiles" },
  ];
  return (
    <div style={S.page}>
      <BackHeader title="⚙️ VIP Settings" subtitle="Manage Your VIP Preferences" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        {opts.map((o,i) => (
          <motion.div key={o.key} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
            style={{ ...S.glass(),padding:"14px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:40,height:40,borderRadius:12,background:"rgba(255,200,61,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{o.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:800,color:"#fff" }}>{o.label}</div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.45)",marginTop:2,lineHeight:1.4 }}>{o.desc}</div>
            </div>
            <motion.div whileTap={{ scale:0.9 }} onClick={() => toggle(o.key)}
              style={{ width:42,height:24,borderRadius:12,cursor:"pointer",position:"relative",flexShrink:0,
                background:vals[o.key]?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.1)" }}>
              <motion.div animate={{ x:vals[o.key]?18:2 }} transition={{ type:"spring",stiffness:500,damping:30 }}
                style={{ position:"absolute",top:2,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.3)" }}/>
            </motion.div>
          </motion.div>
        ))}
        <motion.button whileTap={{ scale:0.96 }}
          style={{ width:"100%",padding:"13px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:900,fontSize:14,color:"#0A0500",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 6px 22px rgba(255,200,61,0.4)",marginTop:4 }}>
          💾 Save Settings
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────── MODULE: ALL LEVELS ─────────────── */
function AllLevelsModule({ onBack, vipLevels = VIP_LEVELS }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div style={S.page}>
      <BackHeader title="👑 All VIP Levels" subtitle={`${vipLevels.length} VIP Tiers · Full System`} onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        {vipLevels.map((vip,i) => (
          <motion.div key={vip.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}>
            <motion.div whileTap={{ scale:0.98 }} onClick={() => setOpenId(openId===vip.id?null:vip.id)}
              style={{ ...S.glass(),padding:"13px 14px",marginBottom:openId===vip.id?0:10,cursor:"pointer",
                border:`1.5px solid ${openId===vip.id?vip.color:"rgba(255,200,61,0.12)"}`,
                borderRadius:openId===vip.id?"18px 18px 0 0":"18px",
                boxShadow:openId===vip.id?`0 6px 24px ${vip.glow}`:"none" }}>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                <VIPBadge3D vip={vip} size={48}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" }}>
                    <span style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{vip.level}</span>
                    {vip.isMax && <span style={{ fontSize:8,fontWeight:900,padding:"2px 7px",borderRadius:8,background:"linear-gradient(135deg,#FFC83D,#EF4444)",color:"#fff" }}>ROYAL</span>}
                  </div>
                  <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:1 }}>{vip.stone}</div>
                  <div style={{ display:"flex",gap:8,marginTop:4 }}>
                    <span style={{ fontSize:10,fontWeight:800,color:"#FFC83D" }}>🪙 {fmt(vip.price_coins)}</span>
                    <span style={{ fontSize:10,fontWeight:800,color:"#34D399" }}>{vip.price_cash}/mo</span>
                  </div>
                </div>
                <span style={{ fontSize:14,color:"rgba(255,255,255,0.4)" }}>{openId===vip.id?"▾":"▸"}</span>
              </div>
            </motion.div>
            <AnimatePresence>
              {openId===vip.id && (
                <motion.div initial={{ height:0,opacity:0 }} animate={{ height:"auto",opacity:1 }} exit={{ height:0,opacity:0 }} transition={{ duration:0.22 }} style={{ overflow:"hidden" }}>
                  <div style={{ background:"rgba(255,255,255,0.03)",border:`1.5px solid ${vip.color}`,borderTop:"none",borderRadius:"0 0 18px 18px",padding:"14px",marginBottom:10 }}>
                    <div style={{ fontSize:9,fontWeight:800,color:"#FFC83D",letterSpacing:"0.07em",marginBottom:8 }}>✨ DESIGN</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
                      {vip.design.map(d => <span key={d} style={{ fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:8,background:`${vip.color}14`,color:vip.color,border:`1px solid ${vip.color}25` }}>{d}</span>)}
                    </div>
                    <div style={{ fontSize:9,fontWeight:800,color:"#FFC83D",letterSpacing:"0.07em",marginBottom:8 }}>🎁 BENEFITS</div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
                      {vip.benefits.map(b => (
                        <div key={b} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 8px",borderRadius:9,background:"rgba(255,255,255,0.04)",border:`1px solid ${vip.color}18` }}>
                          <span style={{ color:vip.color,fontSize:9 }}>✓</span>
                          <span style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.85)",lineHeight:1.3 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                    <motion.button whileTap={{ scale:0.96 }}
                      style={{ width:"100%",marginTop:12,padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:900,fontSize:12,color:"#0A0500",background:vip.gradient,boxShadow:`0 5px 18px ${vip.glow}` }}>
                      Subscribe to {vip.level}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── SUPABASE TIER MAPPER ─────────────── */
// Maps a Supabase vip_tiers row to the VIP_LEVELS shape used by the UI
const TIER_VISUAL = {
  VIP1:     { icon:"🛡️", color:"#60A5FA", gradient:"linear-gradient(135deg,#93C5FD,#3B82F6,#1E40AF)", glow:"rgba(59,130,246,0.5)",   stone:"Crystal Shield",         tier:1  },
  VVIP:     { icon:"👑", color:"#FCD34D", gradient:"linear-gradient(135deg,#FDE68A,#F59E0B,#D97706)", glow:"rgba(245,158,11,0.5)",   stone:"Golden Crystal Crown",   tier:2  },
  SVIP:     { icon:"💎", color:"#38BDF8", gradient:"linear-gradient(135deg,#7DD3FC,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.5)",   stone:"Royal Sapphire Crown",   tier:3  },
  SSVIP:    { icon:"🏆", color:"#E2E8F0", gradient:"linear-gradient(135deg,#F1F5F9,#CBD5E1,#64748B)", glow:"rgba(203,213,225,0.5)",  stone:"Imperial Diamond Shield",tier:4  },
  MSVIP:    { icon:"🔥", color:"#F97316", gradient:"linear-gradient(135deg,#FED7AA,#F97316,#C2410C)", glow:"rgba(249,115,22,0.5)",   stone:"Master Royal Crown",     tier:5  },
  MSSVIP:   { icon:"🦅", color:"#C084FC", gradient:"linear-gradient(135deg,#E9D5FF,#A855F7,#7E22CE)", glow:"rgba(168,85,247,0.5)",   stone:"Royal Phoenix Crown",    tier:6  },
  MISVIP:   { icon:"⚜️", color:"#FFC83D", gradient:"linear-gradient(135deg,#FEF3C7,#FFC83D,#92400E)", glow:"rgba(255,200,61,0.55)",  stone:"Imperial Emperor Badge", tier:7  },
  MISSVIP:  { icon:"💠", color:"#818CF8", gradient:"linear-gradient(135deg,#C7D2FE,#6366F1,#3730A3)", glow:"rgba(99,102,241,0.55)",  stone:"Ultimate Diamond King",  tier:8  },
  ULTRA:    { icon:"🐉", color:"#EF4444", gradient:"linear-gradient(135deg,#FCA5A5,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.55)",   stone:"Royal Dragon Crown",     tier:9  },
  LEGEND:   { icon:"🌌", color:"#A5F3FC", gradient:"linear-gradient(135deg,#CFFAFE,#06B6D4,#164E63)", glow:"rgba(6,182,212,0.55)",   stone:"Galaxy Legendary Crown", tier:10 },
  ROYAL:    { icon:"🔱", color:"#FFC83D", gradient:"linear-gradient(135deg,#FFC83D,#EF4444,#A855F7)", glow:"rgba(255,200,61,0.65)",  stone:"Royal Emperor Throne",   tier:11, isMax:true },
};

function mapSupabaseTier(row) {
  const v = TIER_VISUAL[row.tier_code] || TIER_VISUAL.VIP1;
  return {
    id:           row.id,
    code:         row.tier_code,
    level:        row.tier_name,
    price_coins:  row.price_coins,
    price_cash:   `$${row.price_usd}`,
    daily_coins:  row.daily_reward_coins,
    cashback:     row.cashback_percent,
    support:      row.support_level,
    badge:        row.badge,
    profile_frame:row.profile_frame,
    chat_bubble:  row.chat_bubble,
    entrance:     row.entrance_effect,
    username_style: row.username_style,
    design:       [row.profile_frame, row.badge, row.entrance_effect, row.username_style].filter(Boolean),
    benefits:     [
      row.badge, row.profile_frame, row.chat_bubble, row.username_style,
      row.entrance_effect, row.vehicle_effect,
      row.cashback_percent > 0 ? `${row.cashback_percent}% Gift Cashback` : null,
      row.support_level === "priority" ? "Priority Support" : "Basic Support",
      row.monthly_bonus_coins > 0 ? `${fmt(row.monthly_bonus_coins)} Monthly Bonus Coins` : null,
    ].filter(Boolean),
    ...v,
  };
}

/* ─────────────── MAIN DASHBOARD ─────────────── */
export default function VIPMembership() {
  const navigate = useNavigate();
  const [module, setModule] = useState(null); // null=home
  const [vipLevels, setVipLevels] = useState(VIP_LEVELS);
  const [loadingTiers, setLoadingTiers] = useState(true);

  useEffect(() => {
    const loadTiers = async () => {
      try {
        const res = await base44.functions.invoke("supabaseQuery", {
          table: "vip_tiers", method: "GET", select: "*",
          filters: { is_active: "eq.true" }, order: "tier_code.asc", limit: 20,
        });
        if (res?.data?.data?.length) {
          setVipLevels(res.data.data.map(mapSupabaseTier));
        }
      } catch {
        // fallback to static VIP_LEVELS already set
      } finally {
        setLoadingTiers(false);
      }
    };
    loadTiers();
  }, []);

  const CURRENT_VIP = vipLevels[1] || vipLevels[0];
  const NEXT_VIP    = vipLevels[2] || vipLevels[1];

  if (module==="upgrade")   return <UpgradeModule   vipLevels={vipLevels} currentVip={CURRENT_VIP} onBack={() => setModule(null)}/>;
  if (module==="customize") return <CustomizeModule  onBack={() => setModule(null)}/>;
  if (module==="rewards")   return <RewardsModule    onBack={() => setModule(null)}/>;
  if (module==="settings")  return <SettingsModule   onBack={() => setModule(null)}/>;
  if (module==="levels")    return <AllLevelsModule  vipLevels={vipLevels} onBack={() => setModule(null)}/>;

  const daysLeft = 18;
  const progress = ((daysLeft/30)*100).toFixed(0);

  if (loadingTiers) {
    return (
      <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>👑</div>
          <div style={{ color:"#FFC83D", fontSize:13, fontWeight:800 }}>Loading VIP Tiers...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.hdr}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",flexShrink:0,background:"rgba(255,200,61,0.1)",border:"1px solid rgba(255,200,61,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <ChevronLeft size={18} color="#FFC83D"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>👑 VIP Premium Membership</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>VYRO Live · Luxury VIP System</div>
          </div>
          <motion.button whileTap={{ scale:0.92 }} onClick={() => setModule("settings")}
            style={{ width:34,height:34,borderRadius:"50%",background:"rgba(255,200,61,0.1)",border:"1px solid rgba(255,200,61,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16 }}>
            ⚙️
          </motion.button>
        </div>
      </div>

      <div style={{ padding:"14px" }}>
        {/* Current VIP hero card */}
        <div style={{ borderRadius:22,overflow:"hidden",marginBottom:14,position:"relative",
          background:"linear-gradient(135deg,#1A0E00,#2A1800,#1A0E00)",
          border:"1px solid rgba(255,200,61,0.25)",
          boxShadow:`0 12px 40px ${CURRENT_VIP.glow}` }}>
          {/* Top shimmer bar */}
          <div style={{ height:4,background:"linear-gradient(90deg,#FFC83D,#F59E0B,#FFC83D,#FFF1A8,#FFC83D)" }}/>
          {/* BG decoration */}
          <div style={{ position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle,${CURRENT_VIP.glow},transparent 70%)`,pointerEvents:"none" }}/>

          <div style={{ padding:"18px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
              <VIPBadge3D vip={CURRENT_VIP} size={66}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,200,61,0.6)",letterSpacing:"0.08em",marginBottom:2 }}>YOUR CURRENT LEVEL</div>
                <div style={{ fontSize:22,fontWeight:900,color:CURRENT_VIP.color }}>{CURRENT_VIP.level}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)" }}>{CURRENT_VIP.stone}</div>
                <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
                  {CURRENT_VIP.benefits.slice(0,2).map(b => (
                    <span key={b} style={{ fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:8,background:`${CURRENT_VIP.color}18`,color:CURRENT_VIP.color,border:`1px solid ${CURRENT_VIP.color}25` }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Membership info */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
              {[
                {l:"Duration",v:"1 Month",icon:"📅"},
                {l:"Expiry",v:"Jul 5, 2026",icon:"⏰"},
                {l:"Coins Used",v:fmt(CURRENT_VIP.price_coins),icon:"🪙"},
                {l:"Active Benefits",v:`${CURRENT_VIP.benefits.length}`,icon:"✅"},
              ].map(s => (
                <div key={s.l} style={{ background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"10px 12px",border:"1px solid rgba(255,200,61,0.1)" }}>
                  <div style={{ fontSize:10,marginBottom:2 }}>{s.icon}</div>
                  <div style={{ fontSize:13,fontWeight:900,color:"#fff" }}>{s.v}</div>
                  <div style={{ fontSize:9,color:"rgba(255,255,255,0.45)" }}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Days remaining bar */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                <span style={{ fontSize:10,color:"rgba(255,255,255,0.5)" }}>Membership Duration</span>
                <span style={{ fontSize:10,fontWeight:900,color:"#FFC83D" }}>{daysLeft} days left</span>
              </div>
              <PBar value={progress} color={`linear-gradient(90deg,${CURRENT_VIP.color},#FFC83D)`} height={6}/>
            </div>
            {/* Quick actions */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <motion.button whileTap={{ scale:0.94 }} onClick={() => setModule("levels")}
                style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,background:"rgba(255,200,61,0.12)",color:"#FFC83D",border:"1px solid rgba(255,200,61,0.2)" }}>
                👁 View Benefits
              </motion.button>
              <motion.button whileTap={{ scale:0.94 }} onClick={() => setModule("upgrade")}
                style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,color:"#0A0500",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 4px 14px rgba(255,200,61,0.4)" }}>
                🚀 Upgrade VIP
              </motion.button>
              <motion.button whileTap={{ scale:0.94 }} onClick={() => setModule("upgrade")}
                style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.7)" }}>
                🔄 Renew VIP
              </motion.button>
              <motion.button whileTap={{ scale:0.94 }} onClick={() => setModule("customize")}
                style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,background:"rgba(168,85,247,0.15)",color:"#C084FC",border:"1px solid rgba(168,85,247,0.2)" }}>
                🎨 Customize
              </motion.button>
            </div>
          </div>
        </div>

        {/* Next level upgrade teaser */}
        <div style={{ ...S.glass(),padding:"14px",marginBottom:14,display:"flex",gap:12,alignItems:"center",
          background:"linear-gradient(135deg,rgba(14,165,233,0.06),rgba(99,102,241,0.04))" }}>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
            <VIPBadge3D vip={CURRENT_VIP} size={38}/>
            <span style={{ fontSize:8,fontWeight:700,color:CURRENT_VIP.color }}>{CURRENT_VIP.level}</span>
          </div>
          <div style={{ width:30,textAlign:"center",fontSize:16 }}>→</div>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
            <VIPBadge3D vip={NEXT_VIP} size={38}/>
            <span style={{ fontSize:8,fontWeight:700,color:NEXT_VIP.color }}>{NEXT_VIP.level}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:900,color:"#fff",marginBottom:2 }}>Upgrade to {NEXT_VIP.level}</div>
            <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)",marginBottom:6 }}>🪙 {fmt(NEXT_VIP.price_coins - CURRENT_VIP.price_coins)} more coins</div>
            <PBar value={45} color={NEXT_VIP.color} height={4}/>
          </div>
          <motion.button whileTap={{ scale:0.92 }} onClick={() => setModule("upgrade")}
            style={{ padding:"8px 13px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:10,color:"#0A0500",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",flexShrink:0 }}>
            Upgrade
          </motion.button>
        </div>

        {/* Module grid */}
        <div style={S.sec}>⚡ VIP CONTROL CENTER</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14 }}>
          {[
            { id:"levels",    icon:"👑", label:"All VIP Levels",    sub:"11 Tiers",        gradient:"linear-gradient(135deg,#FFC83D,#D97706)",glow:"rgba(255,200,61,0.4)" },
            { id:"upgrade",   icon:"🚀", label:"Upgrade VIP",       sub:"Growth Engine",   gradient:"linear-gradient(135deg,#10B981,#059669)",glow:"rgba(16,185,129,0.4)" },
            { id:"customize", icon:"🎨", label:"Customize",         sub:"Personalize",     gradient:"linear-gradient(135deg,#A855F7,#7E22CE)",glow:"rgba(168,85,247,0.4)" },
            { id:"rewards",   icon:"🎁", label:"VIP Rewards",       sub:"Daily & Monthly", gradient:"linear-gradient(135deg,#EF4444,#F97316)",glow:"rgba(239,68,68,0.4)" },
            { id:"upgrade",   icon:"💳", label:"Purchase Center",   sub:"Coins & Cash",    gradient:"linear-gradient(135deg,#0EA5E9,#0369A1)",glow:"rgba(14,165,233,0.4)" },
            { id:"settings",  icon:"⚙️", label:"VIP Settings",      sub:"Preferences",     gradient:"linear-gradient(135deg,#374151,#1F2937)",glow:"rgba(55,65,81,0.4)" },
          ].map((mod,i) => (
            <motion.div key={mod.id+i} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
              whileTap={{ scale:0.91 }} onClick={() => setModule(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{ borderRadius:17,overflow:"hidden",background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,200,61,0.1)",backdropFilter:"blur(8px)",
                boxShadow:`0 4px 16px ${mod.glow}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 5px 11px",position:"relative" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"17px 17px 0 0",background:mod.gradient }}/>
                <div style={{ width:46,height:46,borderRadius:13,marginBottom:7,background:mod.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:`0 5px 14px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.28) 0%,transparent 100%)",borderRadius:"0 0 50% 50%" }}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:2 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#FFC83D",textAlign:"center" }}>{mod.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Duration plans mini overview */}
        <div style={{ ...S.glass(),padding:"14px" }}>
          <div style={S.sec}>📅 DURATION PLANS</div>
          {DURATIONS.map((d,i) => (
            <div key={d.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<DURATIONS.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <span style={{ fontSize:12,color:"#fff",fontWeight:800 }}>{d.label}</span>
                {d.badge && <span style={{ fontSize:8,fontWeight:900,padding:"2px 7px",borderRadius:7,
                  background:d.id==="12m"?"linear-gradient(135deg,#10B981,#059669)":"linear-gradient(135deg,#FFC83D,#F59E0B)",
                  color:d.id==="12m"?"#fff":"#0A0500" }}>{d.badge}</span>}
              </div>
              <span style={{ fontSize:11,fontWeight:800,color:d.discount?"#10B981":"rgba(255,255,255,0.5)" }}>{d.discount||"Standard"}</span>
            </div>
          ))}
          <motion.button whileTap={{ scale:0.96 }} onClick={() => setModule("upgrade")}
            style={{ width:"100%",marginTop:12,padding:"12px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#0A0500",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 5px 18px rgba(255,200,61,0.4)" }}>
            🚀 Upgrade Now
          </motion.button>
        </div>
      </div>
    </div>
  );
}