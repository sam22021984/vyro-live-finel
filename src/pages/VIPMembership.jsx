/**
 * VIPMembership — VIP Premium Membership Center
 * Access: Profile > More Services > VIP Premium Membership
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const TIERS = [
  {
    id: "vip1", tier: "VIP 1", icon: "💎", price: "$9.99", period: "/month",
    gradient: "linear-gradient(135deg,#60A5FA,#3B82F6)",
    glow: "rgba(59,130,246,0.4)",
    color: "#3B82F6",
    benefits: ["Blue VIP Badge","Enhanced Profile Frame","Priority Support","5% Coin Bonus","Exclusive Chat Stickers"],
  },
  {
    id: "vip2", tier: "VIP 2", icon: "👑", price: "$19.99", period: "/month",
    gradient: "linear-gradient(135deg,#C084FC,#A855F7)",
    glow: "rgba(168,85,247,0.4)",
    color: "#A855F7",
    benefits: ["Purple VIP Badge","Animated Profile Frame","VIP Entry Animation","10% Coin Bonus","Exclusive Gift Effects","VIP Lounge Access"],
  },
  {
    id: "vip3", tier: "VIP 3", icon: "🔱", price: "$39.99", period: "/month",
    gradient: "linear-gradient(135deg,#34D399,#10B981)",
    glow: "rgba(16,185,129,0.4)",
    color: "#10B981",
    featured: true,
    benefits: ["Emerald VIP Badge","Premium Animated Frame","Special Room Entry","15% Coin Bonus","Exclusive Gifts","VIP Lounge","Name Color Effect","Priority Seat"],
  },
  {
    id: "vip4", tier: "VIP 4", icon: "🏆", price: "$79.99", period: "/month",
    gradient: "linear-gradient(135deg,#FCD34D,#F59E0B)",
    glow: "rgba(245,158,11,0.45)",
    color: "#F59E0B",
    benefits: ["Gold VIP Badge","Luxury Animated Frame","Gold Entry Animation","20% Coin Bonus","Premium Gift Pack","Exclusive VIP Room","Gold Name Effect","Priority Seat","Custom Chat Bubble"],
  },
  {
    id: "vip5", tier: "VIP 5", icon: "💫", price: "$149.99", period: "/month",
    gradient: "linear-gradient(135deg,#FFC83D,#EF4444,#A855F7)",
    glow: "rgba(255,200,61,0.5)",
    color: "#FFC83D",
    isMax: true,
    benefits: ["Legendary VIP Crown","Ultimate Animated Frame","Royal Entry Effect","30% Coin Bonus","Legendary Gift Pack","Exclusive Royal Room","Animated Name","Priority Seat","Custom Bubble","Personal VIP Host","Monthly Surprise Gift","Lifetime Achievement Badge"],
  },
];

const PERKS = [
  { icon:"🎁", title:"Coin Bonuses",       desc:"Earn bonus coins on every recharge based on your VIP tier." },
  { icon:"🖼️", title:"Exclusive Frames",   desc:"Premium animated profile frames visible across the platform." },
  { icon:"🎭", title:"Entry Animations",   desc:"Special room entry animations that wow every audience." },
  { icon:"💬", title:"VIP Chat Bubbles",   desc:"Custom styled chat bubbles in live rooms and private messages." },
  { icon:"🔑", title:"VIP Lounges",        desc:"Access exclusive VIP-only rooms and premium events." },
  { icon:"⚡", title:"Priority Support",   desc:"Skip the queue and get dedicated priority customer support." },
];

function TierCard({ tier, isActive, onSelect }) {
  return (
    <motion.div whileTap={{ scale:0.96 }} onClick={() => onSelect(tier.id)}
      style={{
        borderRadius:20, overflow:"hidden", cursor:"pointer", marginBottom:14,
        background: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${isActive ? tier.color : "rgba(255,255,255,0.08)"}`,
        boxShadow: isActive ? `0 8px 28px ${tier.glow}` : "none",
        position:"relative",
      }}>
      {tier.featured && (
        <div style={{ position:"absolute",top:12,right:12,background:"linear-gradient(135deg,#FFC83D,#F59E0B)",borderRadius:20,padding:"3px 10px",fontSize:9,fontWeight:900,color:"#fff",zIndex:1 }}>
          MOST POPULAR
        </div>
      )}
      {tier.isMax && (
        <div style={{ position:"absolute",top:12,right:12,background:"linear-gradient(135deg,#A855F7,#EF4444)",borderRadius:20,padding:"3px 10px",fontSize:9,fontWeight:900,color:"#fff",zIndex:1 }}>
          ULTIMATE
        </div>
      )}
      {/* Top gradient bar */}
      <div style={{ height:4,background:tier.gradient }}/>
      <div style={{ padding:"16px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
          <div style={{ width:54,height:54,borderRadius:16,background:tier.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,
            boxShadow:`0 6px 18px ${tier.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:"15%",right:0,height:"44%",background:"linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)",borderRadius:"0 0 50% 50%" }}/>
            {tier.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16,fontWeight:900,color:"#fff" }}>{tier.tier}</div>
            <div style={{ display:"flex",alignItems:"baseline",gap:2 }}>
              <span style={{ fontSize:20,fontWeight:900,color:tier.color }}>{tier.price}</span>
              <span style={{ fontSize:11,color:"rgba(255,255,255,0.45)" }}>{tier.period}</span>
            </div>
          </div>
          <div style={{ width:22,height:22,borderRadius:"50%",border:`2px solid ${tier.color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            {isActive && <div style={{ width:12,height:12,borderRadius:"50%",background:tier.color }}/>}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
          {tier.benefits.slice(0,isActive ? tier.benefits.length : 4).map((b,i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 6px",borderRadius:8,background:`${tier.color}10`,border:`1px solid ${tier.color}20` }}>
              <span style={{ color:tier.color,fontSize:10 }}>✓</span>
              <span style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.8)",lineHeight:1.3 }}>{b}</span>
            </div>
          ))}
          {!isActive && tier.benefits.length > 4 && (
            <div style={{ display:"flex",alignItems:"center",gap:5,padding:"4px 6px",borderRadius:8,background:"rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.4)" }}>+{tier.benefits.length-4} more</span>
            </div>
          )}
        </div>
        <AnimatePresence>
          {isActive && (
            <motion.div initial={{ opacity:0,y:4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              <motion.button whileTap={{ scale:0.96 }}
                style={{ width:"100%",marginTop:14,padding:"12px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:tier.gradient,boxShadow:`0 6px 20px ${tier.glow}` }}>
                Subscribe to {tier.tier} →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function VIPMembership() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState("vip3");
  const [tab, setTab] = useState("tiers");

  return (
    <div style={{ minHeight:"100dvh",background:"linear-gradient(160deg,#0D0826 0%,#1A0B3E 50%,#080B18 100%)",fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:90 }}>
      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(13,8,38,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(168,85,247,0.2)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(168,85,247,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
            <ChevronLeft size={18} color="#C084FC"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>💎 VIP Premium Membership</div>
            <div style={{ fontSize:10,color:"#C084FC" }}>Unlock exclusive privileges & benefits</div>
          </div>
        </div>
        <div style={{ display:"flex",padding:"0 16px" }}>
          {[{id:"tiers",label:"VIP Tiers"},{id:"perks",label:"All Perks"},{id:"current",label:"My VIP"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1,padding:"9px",border:"none",background:"transparent",cursor:"pointer",fontSize:11,fontWeight:800,
                color:tab===t.id?"#C084FC":"rgba(255,255,255,0.4)",
                borderBottom:tab===t.id?"2px solid #C084FC":"2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px" }}>
        {/* Hero banner */}
        <div style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.2),rgba(255,200,61,0.08))",border:"1px solid rgba(168,85,247,0.25)",borderRadius:20,padding:"18px",marginBottom:16,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,200,61,0.15),transparent 70%)",pointerEvents:"none" }}/>
          <div style={{ fontSize:10,fontWeight:800,color:"#C084FC",letterSpacing:"0.08em",marginBottom:4 }}>VYRO LIVE · EXCLUSIVE MEMBERSHIP PROGRAM</div>
          <div style={{ fontSize:20,fontWeight:900,color:"#fff",marginBottom:4 }}>Elevate Your Experience</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.7 }}>Join VYRO VIP and unlock premium frames, coin bonuses, exclusive rooms, and much more.</div>
          {/* Current status */}
          <div style={{ marginTop:14,display:"flex",gap:8 }}>
            {[{v:"5",l:"VIP Tiers"},{v:"50+",l:"Benefits"},{v:"30%",l:"Max Bonus"}].map(s => (
              <div key={s.l} style={{ flex:1,background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"8px",textAlign:"center",border:"1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize:13,fontWeight:900,color:"#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "tiers" && (
            <motion.div key="tiers" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              {TIERS.map(tier => (
                <TierCard key={tier.id} tier={tier} isActive={selectedTier===tier.id} onSelect={setSelectedTier}/>
              ))}
            </motion.div>
          )}

          {tab === "perks" && (
            <motion.div key="perks" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {PERKS.map((p,i) => (
                <motion.div key={p.title} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
                  style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(168,85,247,0.18)",borderRadius:16,padding:"16px 12px",textAlign:"center" }}>
                  <div style={{ fontSize:28,marginBottom:8 }}>{p.icon}</div>
                  <div style={{ fontSize:11,fontWeight:900,color:"#fff",marginBottom:5 }}>{p.title}</div>
                  <div style={{ fontSize:9,color:"rgba(255,255,255,0.5)",lineHeight:1.5 }}>{p.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === "current" && (
            <motion.div key="current" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"20px",textAlign:"center",marginBottom:16 }}>
                <div style={{ fontSize:40,marginBottom:8 }}>🔓</div>
                <div style={{ fontSize:15,fontWeight:900,color:"#fff",marginBottom:6 }}>No Active VIP Membership</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.6,marginBottom:16 }}>Subscribe to a VIP tier to unlock exclusive benefits and privileges across the platform.</div>
                <motion.button whileTap={{ scale:0.96 }} onClick={() => setTab("tiers")}
                  style={{ padding:"12px 28px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:900,fontSize:13,color:"#fff",background:"linear-gradient(135deg,#A855F7,#7C3AED)",boxShadow:"0 6px 20px rgba(168,85,247,0.4)" }}>
                  Explore VIP Tiers
                </motion.button>
              </div>
              <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"16px" }}>
                <div style={{ fontSize:10,fontWeight:800,color:"#C084FC",marginBottom:12,letterSpacing:"0.07em" }}>📋 MEMBERSHIP HISTORY</div>
                <div style={{ textAlign:"center",padding:"20px",color:"rgba(255,255,255,0.3)",fontSize:12 }}>No previous memberships</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}