/**
 * MeRelationshipTab — Relationship profile tab display
 * Shows connection types, bonding status, partner badges, and relationship grid
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RELATIONSHIPS = [
  {
    id:"bestfriend", name:"Best Friend", icon:"❤️",
    color:"#EF4444", gradient:"linear-gradient(135deg,#FCA5A5,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.4)",
    desc:"Premium friendship connection with strong bonding",
    user:{ name:"Sarah Al-Rashid", avatar:"👩", level:"LV42", badge:"💎", duration:"8 months" },
    stats:[{l:"Friend Level",v:"LV 18"},{l:"Shared Gifts",v:"234"},{l:"Interaction",v:"92%"},{l:"Duration",v:"8 mo"}],
    actions:["View Profile","Send Gift","Message","Remove"],
  },
  {
    id:"vippartner", name:"VIP Partner", icon:"💎",
    color:"#38BDF8", gradient:"linear-gradient(135deg,#7DD3FC,#38BDF8,#0369A1)", glow:"rgba(56,189,248,0.4)",
    desc:"Premium VIP connection with exclusive privileges",
    user:{ name:"Ahmed Al-Qatari", avatar:"👨", level:"LV68", badge:"👑", duration:"3 months" },
    stats:[{l:"VIP Level",v:"SVIP"},{l:"Partner Badge",v:"Active"},{l:"Shared",v:"145"},{l:"Duration",v:"3 mo"}],
    actions:["View Partnership","Send Gift","Chat","Manage"],
  },
  {
    id:"royal", name:"Royal Connection", icon:"👑",
    color:"#FFC83D", gradient:"linear-gradient(135deg,#FDE68A,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.45)",
    desc:"High-level royal relationship with exclusive effects",
    user:{ name:"Layla Hassan", avatar:"👸", level:"LV55", badge:"🔱", duration:"5 months" },
    stats:[{l:"Royal Rank",v:"#3"},{l:"Badge",v:"Active"},{l:"Effects",v:"ON"},{l:"Duration",v:"5 mo"}],
    actions:["View Details","Activate Badge","Send Gift","Manage"],
  },
  {
    id:"closecircle", name:"Close Circle", icon:"🔥",
    color:"#F97316", gradient:"linear-gradient(135deg,#FED7AA,#F97316,#C2410C)", glow:"rgba(249,115,22,0.4)",
    desc:"Close community bond with frequent interaction",
    user:{ name:"Omar Al-Farsi", avatar:"👦", level:"LV29", badge:"⭐", duration:"2 months" },
    stats:[{l:"Bond Level",v:"LV 9"},{l:"Activities",v:"67"},{l:"Interactions",v:"78%"},{l:"Status",v:"Active"}],
    actions:["View Connection","Chat","Gift","Remove"],
  },
];

function RelCard({ rel, onOpen }) {
  return (
    <motion.div whileTap={{ scale:0.96 }} onClick={() => onOpen(rel)}
      style={{ background:"rgba(255,255,255,0.9)",backdropFilter:"blur(14px)",borderRadius:18,overflow:"hidden",cursor:"pointer",
        border:`1px solid ${rel.color}20`,boxShadow:`0 4px 16px ${rel.glow}` }}>
      <div style={{ height:3,background:rel.gradient }}/>
      <div style={{ padding:"13px" }}>
        <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:10 }}>
          {/* 3D icon */}
          <div style={{ width:44,height:44,borderRadius:13,flexShrink:0,background:rel.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
            boxShadow:`0 4px 12px ${rel.glow}, inset 0 1px 0 rgba(255,255,255,0.4)`,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)",borderRadius:"0 0 50% 50%" }}/>
            {rel.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12,fontWeight:900,color:"#1a1a2e" }}>{rel.name}</div>
            <div style={{ fontSize:9,color:"#9CA3AF",marginTop:1 }}>{rel.desc.slice(0,38)}…</div>
          </div>
        </div>
        {/* User */}
        <div style={{ display:"flex",gap:8,alignItems:"center",background:`${rel.color}08`,borderRadius:12,padding:"8px 10px",marginBottom:8 }}>
          <div style={{ width:30,height:30,borderRadius:"50%",background:rel.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{rel.user.avatar}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11,fontWeight:800,color:"#1a1a2e" }}>{rel.user.name}</div>
            <div style={{ fontSize:9,color:rel.color }}>{rel.user.level} · {rel.user.badge} · {rel.user.duration}</div>
          </div>
          <div style={{ width:8,height:8,borderRadius:"50%",background:"#10B981",flexShrink:0 }}/>
        </div>
        {/* Mini stats */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
          {rel.stats.slice(0,2).map(s => (
            <div key={s.l} style={{ background:`${rel.color}08`,borderRadius:9,padding:"5px 8px" }}>
              <div style={{ fontSize:11,fontWeight:900,color:rel.color }}>{s.v}</div>
              <div style={{ fontSize:8,color:"#9CA3AF" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RelDetail({ rel, onClose }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }} transition={{ type:"spring",damping:30,stiffness:280 }}
        onClick={e => e.stopPropagation()}
        style={{ background:"#fff",borderRadius:"22px 22px 0 0",width:"100%",maxHeight:"85vh",overflowY:"auto",paddingBottom:32 }}>
        <div style={{ width:36,height:4,borderRadius:2,background:"#E5E7EB",margin:"12px auto 0" }}/>
        {/* Sheet header */}
        <div style={{ background:`linear-gradient(135deg,${rel.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0]||"#1a1a2e"},${rel.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[1]||"#374151"})`,padding:"16px 20px 14px",borderRadius:"22px 22px 0 0" }}>
          <div style={{ display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:52,height:52,borderRadius:15,flexShrink:0,background:rel.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
              boxShadow:`0 6px 18px ${rel.glow}, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
              {rel.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16,fontWeight:900,color:"#fff" }}>{rel.name}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)" }}>{rel.desc}</div>
            </div>
          </div>
        </div>
        <div style={{ padding:"16px 20px" }}>
          {/* Partner */}
          <div style={{ background:`${rel.color}08`,border:`1px solid ${rel.color}20`,borderRadius:16,padding:"13px",marginBottom:14,display:"flex",gap:12,alignItems:"center" }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:rel.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:`0 4px 12px ${rel.glow}` }}>{rel.user.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#1a1a2e" }}>{rel.user.name}</div>
              <div style={{ fontSize:10,color:rel.color,marginTop:1 }}>{rel.user.level} · VIP {rel.user.badge}</div>
              <div style={{ fontSize:9,color:"#9CA3AF" }}>Connected for {rel.user.duration}</div>
            </div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:3,background:"rgba(16,185,129,0.12)",borderRadius:8,padding:"3px 8px" }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#10B981" }}/>
              <span style={{ fontSize:9,fontWeight:800,color:"#10B981" }}>Online</span>
            </div>
          </div>
          {/* Stats */}
          <div style={{ fontSize:10,fontWeight:800,color:"#9CA3AF",letterSpacing:"0.07em",marginBottom:10 }}>📊 RELATIONSHIP STATS</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
            {rel.stats.map(s => (
              <div key={s.l} style={{ background:`${rel.color}08`,border:`1px solid ${rel.color}15`,borderRadius:13,padding:"11px",textAlign:"center" }}>
                <div style={{ fontSize:14,fontWeight:900,color:rel.color }}>{s.v}</div>
                <div style={{ fontSize:9,color:"#9CA3AF" }}>{s.l}</div>
              </div>
            ))}
          </div>
          {/* Actions */}
          <div style={{ fontSize:10,fontWeight:800,color:"#9CA3AF",letterSpacing:"0.07em",marginBottom:10 }}>⚡ ACTIONS</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
            {rel.actions.map((a,i) => {
              const grads = [`linear-gradient(135deg,${rel.color},${rel.gradient.match(/#[A-Fa-f0-9]{6}/g)?.[2]||"#374151"})`, "rgba(0,0,0,0.06)","rgba(0,0,0,0.06)","rgba(239,68,68,0.1)"];
              const tcs = ["#fff","#374151","#374151","#EF4444"];
              return (
                <motion.button key={a} whileTap={{ scale:0.94 }}
                  style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,background:grads[i]||grads[1],color:tcs[i]||tcs[1],boxShadow:i===0?`0 4px 14px ${rel.glow}`:"none" }}>
                  {a}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MeRelationshipTab() {
  const navigate = useNavigate();
  const [openRel, setOpenRel] = useState(null);

  return (
    <div style={{ marginTop:14 }}>
      {/* Header banner */}
      <div style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.08),rgba(56,189,248,0.06))",border:"1px solid rgba(239,68,68,0.15)",borderRadius:18,padding:"14px 16px",marginBottom:14 }}>
        <div style={{ fontSize:9,fontWeight:800,color:"#9CA3AF",letterSpacing:"0.07em",marginBottom:3 }}>RELATIONSHIP NETWORK</div>
        <div style={{ fontSize:16,fontWeight:900,color:"#1a1a2e",marginBottom:4 }}>🤝 Your Connections</div>
        <div style={{ display:"flex",gap:12 }}>
          {[{v:"4",l:"Connections"},{v:"LV18",l:"Top Bond"},{v:"92%",l:"Interaction"}].map(s => (
            <div key={s.l} style={{ flex:1,textAlign:"center",background:"rgba(255,255,255,0.7)",borderRadius:11,padding:"8px 4px" }}>
              <div style={{ fontSize:13,fontWeight:900,color:"#7C3AED" }}>{s.v}</div>
              <div style={{ fontSize:8,color:"#9CA3AF" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationship grid */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
        {RELATIONSHIPS.map((rel,i) => (
          <motion.div key={rel.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}>
            <RelCard rel={rel} onOpen={setOpenRel}/>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ background:"rgba(255,255,255,0.85)",backdropFilter:"blur(14px)",borderRadius:18,padding:"14px 16px",border:"1px solid rgba(124,58,237,0.1)" }}>
        <div style={{ fontSize:9,fontWeight:800,color:"#9CA3AF",letterSpacing:"0.07em",marginBottom:10 }}>⚡ RELATIONSHIP ACTIONS</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
          {[
            {label:"Add Connection",icon:"➕",g:"linear-gradient(135deg,#7C3AED,#C084FC)"},
            {label:"Send Gift",icon:"🎁",g:"linear-gradient(135deg,#EF4444,#F97316)"},
            {label:"View History",icon:"📋",g:"linear-gradient(135deg,#0EA5E9,#0369A1)"},
            {label:"Manage Privacy",icon:"🔒",g:"rgba(0,0,0,0.07)"},
            {label:"Send Message",icon:"💬",g:"rgba(0,0,0,0.07)"},
            {label:"Relationship Mgr",icon:"🤝",g:"rgba(0,0,0,0.07)",nav:"/social"},
          ].map((a,i) => (
            <motion.button key={a.label} whileTap={{ scale:0.92 }} onClick={() => a.nav && navigate(a.nav)}
              style={{ padding:"10px 6px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:700,fontSize:9,
                background:a.g,color:i<3?"#fff":"#374151",
                boxShadow:i<3?`0 4px 12px rgba(0,0,0,0.15)`:"none",
                display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
              <span style={{ fontSize:16 }}>{a.icon}</span>{a.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openRel && <RelDetail rel={openRel} onClose={() => setOpenRel(null)}/>}
      </AnimatePresence>
    </div>
  );
}