/**
 * MeVIPTab — VIP Membership profile tab display
 * Shows current VIP status, badge, frame, expiry, benefits & next level
 * Links to full VIP Membership Dashboard
 */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CURRENT_VIP = {
  level: "VVIP",
  icon: "👑",
  color: "#FCD34D",
  gradient: "linear-gradient(135deg,#FDE68A,#F59E0B,#D97706)",
  glow: "rgba(245,158,11,0.45)",
  stone: "Golden Crystal Crown",
  benefits: ["Golden VIP Badge","Premium Frame","Chat Effect","VIP Support"],
  expiry: "Jul 5, 2026",
  duration: "1 Month",
  daysLeft: 18,
};
const NEXT_VIP = { level:"SVIP", icon:"💎", color:"#38BDF8", gradient:"linear-gradient(135deg,#7DD3FC,#0EA5E9,#0369A1)", glow:"rgba(14,165,233,0.4)" };

export default function MeVIPTab() {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:12 }}>

      {/* VIP Identity Card */}
      <div style={{
        borderRadius:22, overflow:"hidden", position:"relative",
        background:"linear-gradient(135deg,#1A0E00,#2A1800,#1A0E00)",
        border:`1px solid rgba(245,158,11,0.3)`,
        boxShadow:`0 12px 40px ${CURRENT_VIP.glow}`,
      }}>
        <div style={{ height:4, background:"linear-gradient(90deg,#FFC83D,#F59E0B,#FFF1A8,#F59E0B,#FFC83D)" }}/>
        <div style={{ position:"absolute",top:-30,right:-30,width:130,height:130,borderRadius:"50%",background:`radial-gradient(circle,${CURRENT_VIP.glow},transparent 70%)`,pointerEvents:"none" }}/>

        <div style={{ padding:"16px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
            {/* 3D Badge */}
            <div style={{ width:64,height:64,borderRadius:18,flexShrink:0,background:CURRENT_VIP.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,
              boxShadow:`0 6px 20px ${CURRENT_VIP.glow}, inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)`,position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"44%",background:"linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
              {CURRENT_VIP.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9,fontWeight:800,color:"rgba(255,200,61,0.55)",letterSpacing:"0.08em",marginBottom:1 }}>ACTIVE VIP LEVEL</div>
              <div style={{ fontSize:20,fontWeight:900,color:CURRENT_VIP.color }}>{CURRENT_VIP.level}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.45)" }}>{CURRENT_VIP.stone}</div>
              <div style={{ marginTop:5,display:"inline-flex",alignItems:"center",gap:4,background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:8,padding:"2px 8px" }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#10B981" }}/>
                <span style={{ fontSize:9,fontWeight:800,color:"#10B981" }}>ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
            {[
              {l:"Duration",v:CURRENT_VIP.duration,icon:"📅"},
              {l:"Expiry Date",v:CURRENT_VIP.expiry,icon:"⏰"},
              {l:"Days Left",v:`${CURRENT_VIP.daysLeft} days`,icon:"🔄"},
              {l:"Benefits",v:`${CURRENT_VIP.benefits.length} Active`,icon:"✅"},
            ].map(s => (
              <div key={s.l} style={{ background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"9px 11px",border:"1px solid rgba(255,200,61,0.1)" }}>
                <div style={{ fontSize:11,marginBottom:2 }}>{s.icon}</div>
                <div style={{ fontSize:12,fontWeight:900,color:"#fff" }}>{s.v}</div>
                <div style={{ fontSize:8,color:"rgba(255,255,255,0.4)" }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Duration bar */}
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontSize:9,color:"rgba(255,255,255,0.45)" }}>Membership Progress</span>
              <span style={{ fontSize:9,fontWeight:800,color:"#FFC83D" }}>{CURRENT_VIP.daysLeft} days remaining</span>
            </div>
            <div style={{ height:5,borderRadius:3,background:"rgba(255,255,255,0.08)",overflow:"hidden" }}>
              <div style={{ width:`${(CURRENT_VIP.daysLeft/30)*100}%`,height:"100%",borderRadius:3,background:`linear-gradient(90deg,${CURRENT_VIP.color},#FFC83D)` }}/>
            </div>
          </div>

          {/* Active benefits */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9,fontWeight:800,color:"rgba(255,200,61,0.5)",letterSpacing:"0.07em",marginBottom:6 }}>🎁 ACTIVE BENEFITS</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
              {CURRENT_VIP.benefits.map(b => (
                <span key={b} style={{ fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:8,background:`${CURRENT_VIP.color}15`,color:CURRENT_VIP.color,border:`1px solid ${CURRENT_VIP.color}25` }}>✓ {b}</span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
            <motion.button whileTap={{ scale:0.94 }} onClick={() => navigate("/vip-membership")}
              style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,color:"#1A0E00",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 4px 14px rgba(255,200,61,0.4)" }}>
              👑 VIP Dashboard
            </motion.button>
            <motion.button whileTap={{ scale:0.94 }} onClick={() => navigate("/vip-membership")}
              style={{ padding:"11px",borderRadius:13,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,200,61,0.2)" }}>
              🚀 Upgrade VIP
            </motion.button>
          </div>
        </div>
      </div>

      {/* Next Level Teaser */}
      <div style={{ background:"rgba(255,255,255,0.85)",backdropFilter:"blur(14px)",borderRadius:18,padding:"14px 16px",border:"1px solid rgba(14,165,233,0.2)",boxShadow:"0 4px 16px rgba(14,165,233,0.1)" }}>
        <div style={{ fontSize:9,fontWeight:800,color:"#9CA3AF",letterSpacing:"0.07em",marginBottom:10 }}>⬆️ NEXT VIP LEVEL</div>
        <div style={{ display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:CURRENT_VIP.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 4px 12px ${CURRENT_VIP.glow}` }}>{CURRENT_VIP.icon}</div>
            <span style={{ fontSize:8,fontWeight:700,color:CURRENT_VIP.color }}>{CURRENT_VIP.level}</span>
          </div>
          <div style={{ flex:1,textAlign:"center",fontSize:18,color:"#D1D5DB" }}>→</div>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
            <div style={{ width:38,height:38,borderRadius:11,background:NEXT_VIP.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 4px 12px ${NEXT_VIP.glow}` }}>{NEXT_VIP.icon}</div>
            <span style={{ fontSize:8,fontWeight:700,color:NEXT_VIP.color }}>{NEXT_VIP.level}</span>
          </div>
          <motion.button whileTap={{ scale:0.92 }} onClick={() => navigate("/vip-membership")}
            style={{ padding:"9px 14px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:10,color:"#1A0E00",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 4px 12px rgba(255,200,61,0.35)" }}>
            Upgrade
          </motion.button>
        </div>
        <div style={{ marginTop:10 }}>
          <div style={{ height:4,borderRadius:2,background:"rgba(14,165,233,0.12)",overflow:"hidden" }}>
            <div style={{ width:"45%",height:"100%",borderRadius:2,background:NEXT_VIP.gradient }}/>
          </div>
          <div style={{ fontSize:9,color:"#9CA3AF",marginTop:3 }}>🪙 500K coins to unlock SVIP</div>
        </div>
      </div>

    </div>
  );
}