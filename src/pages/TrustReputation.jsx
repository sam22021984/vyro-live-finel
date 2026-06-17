/**
 * TrustReputation — Trust & Reputation Center
 * Access: Profile > More Services > Trust & Reputation
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const TRUST_SCORE = 84;
const REPUTATION_LEVEL = "Silver Trusted";

const SCORE_FACTORS = [
  { label:"Account Verified",        score:100, weight:20, icon:"✅", color:"#10B981", status:"Complete" },
  { label:"Identity Verified",       score:100, weight:20, icon:"🪪", color:"#10B981", status:"Complete" },
  { label:"Profile Completion",      score:86,  weight:15, icon:"👤", color:"#3B82F6", status:"86%" },
  { label:"Activity & Engagement",   score:78,  weight:15, icon:"📊", color:"#A855F7", status:"Active" },
  { label:"Community Standing",      score:92,  weight:10, icon:"👥", color:"#10B981", status:"Good" },
  { label:"Financial History",       score:80,  weight:10, icon:"💰", color:"#F59E0B", status:"Verified" },
  { label:"Violation Record",        score:64,  weight:10, icon:"🚨", color:"#EF4444", status:"2 warnings" },
];

const REP_LEVELS = [
  { level:"Bronze",       icon:"🥉", min:0,   max:40,  color:"#CD7F32", gradient:"linear-gradient(135deg,#CD7F32,#92400E)" },
  { level:"Silver",       icon:"🥈", min:40,  max:60,  color:"#9CA3AF", gradient:"linear-gradient(135deg,#9CA3AF,#6B7280)" },
  { level:"Silver Trusted",icon:"⭐",min:60,  max:75,  color:"#60A5FA", gradient:"linear-gradient(135deg,#60A5FA,#3B82F6)" },
  { level:"Gold",         icon:"🥇", min:75,  max:85,  color:"#F59E0B", gradient:"linear-gradient(135deg,#FCD34D,#F59E0B)", isCurrent:true },
  { level:"Gold Trusted", icon:"🌟", min:85,  max:92,  color:"#FFC83D", gradient:"linear-gradient(135deg,#FFC83D,#D97706)" },
  { level:"Platinum",     icon:"💠", min:92,  max:96,  color:"#06B6D4", gradient:"linear-gradient(135deg,#38BDF8,#0369A1)" },
  { level:"Diamond",      icon:"💎", min:96,  max:100, color:"#A855F7", gradient:"linear-gradient(135deg,#C084FC,#7C3AED)" },
];

const BADGES = [
  { name:"Verified Member",     icon:"✅", earned:true,  color:"#10B981", desc:"Identity and account verified" },
  { name:"Trusted Host",        icon:"🎙️", earned:true,  color:"#3B82F6", desc:"Consistent hosting performance" },
  { name:"Community Builder",   icon:"👥", earned:true,  color:"#A855F7", desc:"Active community contributor" },
  { name:"Top Gifter",          icon:"🎁", earned:false, color:"#F59E0B", desc:"Send 1,000+ gifts to earn" },
  { name:"Loyalty Member",      icon:"🔐", earned:true,  color:"#06B6D4", desc:"12+ months on platform" },
  { name:"Zero Violations",     icon:"🛡️", earned:false, color:"#EF4444", desc:"Resolve all violations to earn" },
  { name:"VIP Member",          icon:"👑", earned:false, color:"#FFC83D", desc:"Achieve VIP status to earn" },
  { name:"Ambassador",          icon:"🌍", earned:false, color:"#EC4899", desc:"Top 100 community ranking" },
];

const ACTIVITY_LOG = [
  { action:"Identity Verification Approved",  time:"Jun 15, 2026", type:"positive", icon:"✅" },
  { action:"Community Warning Issued",         time:"Jun 2, 2026",  type:"negative", icon:"⚠️" },
  { action:"Trust Score Increased +8 pts",    time:"May 28, 2026", type:"positive", icon:"📈" },
  { action:"Loyalty Badge Earned",            time:"May 20, 2026", type:"positive", icon:"🏅" },
  { action:"Content Policy Warning",          time:"Apr 12, 2026", type:"negative", icon:"🚨" },
  { action:"Account Verification Complete",   time:"Mar 5, 2026",  type:"positive", icon:"🪪" },
];

function ScoreRing({ score }) {
  const r = 52, c = 2*Math.PI*r;
  const fill = (score/100)*c;
  const color = score>=80?"#10B981":score>=60?"#F59E0B":"#EF4444";
  return (
    <div style={{ position:"relative",width:130,height:130,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <svg width="130" height="130" style={{ position:"absolute",transform:"rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round"/>
      </svg>
      <div style={{ textAlign:"center",zIndex:1 }}>
        <div style={{ fontSize:28,fontWeight:900,color }}>{score}</div>
        <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)" }}>Trust Score</div>
      </div>
    </div>
  );
}

export default function TrustReputation() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ minHeight:"100dvh",background:"linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)",fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:90 }}>
      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(16,185,129,0.2)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(16,185,129,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
            <ChevronLeft size={18} color="#34D399"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🛡️ Trust & Reputation</div>
            <div style={{ fontSize:10,color:"#34D399" }}>Your platform standing & credibility score</div>
          </div>
        </div>
        <div style={{ display:"flex",padding:"0 16px" }}>
          {[{id:"overview",label:"Overview"},{id:"badges",label:"Badges"},{id:"levels",label:"Levels"},{id:"history",label:"History"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1,padding:"9px",border:"none",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:800,
                color:tab===t.id?"#34D399":"rgba(255,255,255,0.4)",
                borderBottom:tab===t.id?"2px solid #34D399":"2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px" }}>
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              {/* Score card */}
              <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:22,padding:"20px",marginBottom:14,textAlign:"center" }}>
                <div style={{ display:"flex",justifyContent:"center",marginBottom:14 }}><ScoreRing score={TRUST_SCORE}/></div>
                <div style={{ fontSize:16,fontWeight:900,color:"#fff",marginBottom:3 }}>{REPUTATION_LEVEL}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:16 }}>You're trusted by the VYRO community</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
                  {[{v:"4",l:"Badges",icon:"🏅"},{v:"2",l:"Warnings",icon:"⚠️"},{v:"Gold",l:"Tier",icon:"🥇"}].map(s => (
                    <div key={s.l} style={{ background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:12,padding:"10px 8px" }}>
                      <div style={{ fontSize:16 }}>{s.icon}</div>
                      <div style={{ fontSize:13,fontWeight:900,color:"#34D399" }}>{s.v}</div>
                      <div style={{ fontSize:9,color:"rgba(255,255,255,0.45)" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score breakdown */}
              <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"14px",marginBottom:14 }}>
                <div style={{ fontSize:10,fontWeight:800,color:"#34D399",letterSpacing:"0.08em",marginBottom:12 }}>📊 SCORE BREAKDOWN</div>
                {SCORE_FACTORS.map((f,i) => (
                  <div key={f.label} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        <span>{f.icon}</span>
                        <span style={{ fontSize:11,fontWeight:700,color:"#fff" }}>{f.label}</span>
                      </div>
                      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                        <span style={{ fontSize:9,color:"rgba(255,255,255,0.4)" }}>×{f.weight}%</span>
                        <span style={{ fontSize:11,fontWeight:900,color:f.color }}>{f.score}</span>
                      </div>
                    </div>
                    <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${f.score}%` }} transition={{ duration:0.8,delay:i*0.07 }}
                        style={{ height:"100%",borderRadius:3,background:f.color }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Improvement tips */}
              <div style={{ background:"rgba(255,200,61,0.06)",border:"1px solid rgba(255,200,61,0.18)",borderRadius:18,padding:"14px" }}>
                <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",letterSpacing:"0.08em",marginBottom:10 }}>💡 HOW TO IMPROVE YOUR SCORE</div>
                {[
                  "Resolve your 2 open violation warnings to gain +8 pts",
                  "Complete your profile to 100% for +3 pts",
                  "Increase gifting activity for +4 pts",
                  "Achieve 30 days streak for +5 pts",
                ].map((tip,i) => (
                  <div key={i} style={{ display:"flex",gap:8,padding:"6px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.04)":"none" }}>
                    <span style={{ color:"#FFC83D",fontSize:11,flexShrink:0 }}>→</span>
                    <span style={{ fontSize:11,color:"rgba(255,255,255,0.7)",lineHeight:1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "badges" && (
            <motion.div key="badges" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {BADGES.map((b,i) => (
                <motion.div key={b.name} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
                  style={{ background:b.earned?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.02)",
                    border:`1px solid ${b.earned?b.color+"40":"rgba(255,255,255,0.06)"}`,
                    borderRadius:16,padding:"16px 12px",textAlign:"center",
                    opacity:b.earned?1:0.5 }}>
                  <div style={{ fontSize:32,marginBottom:8,filter:b.earned?"none":"grayscale(100%)" }}>{b.icon}</div>
                  <div style={{ fontSize:10,fontWeight:900,color:b.earned?b.color:"#9CA3AF",marginBottom:4 }}>{b.name}</div>
                  <div style={{ fontSize:9,color:"rgba(255,255,255,0.45)",lineHeight:1.4 }}>{b.desc}</div>
                  {b.earned && (
                    <div style={{ marginTop:8,display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:8,background:`${b.color}15`,border:`1px solid ${b.color}30` }}>
                      <span style={{ fontSize:8,fontWeight:800,color:b.color }}>✓ EARNED</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === "levels" && (
            <motion.div key="levels" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              {REP_LEVELS.map((lv,i) => {
                const isCurrent = TRUST_SCORE >= lv.min && TRUST_SCORE < lv.max;
                const isPassed  = TRUST_SCORE >= lv.max;
                return (
                  <motion.div key={lv.level} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.07 }}
                    style={{ display:"flex",gap:14,alignItems:"center",padding:"12px 14px",marginBottom:10,
                      background:isCurrent?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)",
                      border:`1.5px solid ${isCurrent?lv.color:isPassed?lv.color+"30":"rgba(255,255,255,0.06)"}`,
                      borderRadius:16, opacity:isPassed||isCurrent?1:0.5 }}>
                    <div style={{ width:48,height:48,borderRadius:14,background:lv.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
                      boxShadow:isCurrent?`0 6px 18px ${lv.color}55`:"none",filter:isPassed||isCurrent?"none":"grayscale(60%)" }}>
                      {lv.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <span style={{ fontSize:12,fontWeight:900,color:isCurrent?lv.color:isPassed?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.35)" }}>{lv.level}</span>
                        {isCurrent && <span style={{ fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:8,background:lv.color,color:"#fff" }}>CURRENT</span>}
                        {isPassed && <span style={{ fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:8,background:"rgba(16,185,129,0.2)",color:"#10B981" }}>✓ PASSED</span>}
                      </div>
                      <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:2 }}>Score range: {lv.min} – {lv.max}</div>
                      <div style={{ height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",marginTop:6,overflow:"hidden" }}>
                        <div style={{ height:"100%",borderRadius:2,background:lv.color,width:isCurrent?`${((TRUST_SCORE-lv.min)/(lv.max-lv.min))*100}%`:isPassed?"100%":"0%" }}/>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div key="history" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              {ACTIVITY_LOG.map((log,i) => (
                <motion.div key={i} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
                  style={{ display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",marginBottom:8,
                    background:`${log.type==="positive"?"rgba(16,185,129,0.05)":"rgba(239,68,68,0.05)"}`,
                    border:`1px solid ${log.type==="positive"?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.15)"}`,
                    borderRadius:14 }}>
                  <div style={{ width:36,height:36,borderRadius:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
                    background:log.type==="positive"?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)" }}>
                    {log.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11,fontWeight:800,color:"#fff",marginBottom:2 }}>{log.action}</div>
                    <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)" }}>{log.time}</div>
                  </div>
                  <div style={{ width:8,height:8,borderRadius:"50%",flexShrink:0,marginTop:4,background:log.type==="positive"?"#10B981":"#EF4444" }}/>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}