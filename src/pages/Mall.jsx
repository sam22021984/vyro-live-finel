/**
 * Mall — VYRO Premium Digital Marketplace
 * Access: Profile > More Services > Mall
 * Theme: Global Luxury Entertainment · Gold · Diamond · Neon
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  page: { minHeight:"100dvh", background:"linear-gradient(160deg,#0A0500 0%,#130800 40%,#0D0010 100%)", fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:90 },
  glass: (x={}) => ({ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(14px)", border:"1px solid rgba(255,200,61,0.15)", borderRadius:18, ...x }),
  sec: { fontSize:10, fontWeight:800, color:"#FFC83D", letterSpacing:"0.08em", marginBottom:10 },
  hdr: { position:"sticky",top:0,zIndex:50,background:"rgba(10,5,0,0.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,200,61,0.18)",boxShadow:"0 2px 20px rgba(0,0,0,0.6)" },
  btn: (g,glow,tc="#fff") => ({ padding:"7px 13px", borderRadius:10, border:"none", cursor:"pointer", fontWeight:700, fontSize:9, color:tc, background:g, boxShadow:`0 3px 10px ${glow}`, margin:"3px", flexShrink:0 }),
};

const GOLD = "linear-gradient(135deg,#FFC83D,#F59E0B)";
const GLOW_GOLD = "rgba(255,200,61,0.4)";

function BackHeader({ title, subtitle, onBack, extra }) {
  return (
    <div style={S.hdr}>
      <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
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

function Badge({ label, color="#FFC83D", bg }) {
  return (
    <span style={{ fontSize:8,fontWeight:900,padding:"2px 7px",borderRadius:8,background:bg||`${color}20`,color,border:`1px solid ${color}30`,flexShrink:0 }}>{label}</span>
  );
}

function ActionRow({ actions }) {
  const grads = [GOLD,"linear-gradient(135deg,#A855F7,#7E22CE)","linear-gradient(135deg,#10B981,#059669)","linear-gradient(135deg,#0EA5E9,#0369A1)","linear-gradient(135deg,#EF4444,#B91C1C)"];
  const glows = [GLOW_GOLD,"rgba(168,85,247,0.35)","rgba(16,185,129,0.35)","rgba(14,165,233,0.35)","rgba(239,68,68,0.35)"];
  const tcs   = ["#0A0500","#fff","#fff","#fff","#fff"];
  return (
    <div style={{ display:"flex",flexWrap:"wrap",marginTop:10 }}>
      {actions.map((a,i) => <motion.button key={a} whileTap={{ scale:0.91 }} style={S.btn(grads[i%5],glows[i%5],tcs[i%5])}>{a}</motion.button>)}
    </div>
  );
}

function ItemCard({ item, onAdd, inCart }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)",border:`1px solid ${item.color||"rgba(255,200,61,0.15)"}25`,borderRadius:16,overflow:"hidden",position:"relative" }}>
      {item.badge && <div style={{ position:"absolute",top:6,right:6,zIndex:1 }}><Badge label={item.badge} color={item.badgeColor||"#FFC83D"}/></div>}
      <div style={{ height:72,background:item.gradient||GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(255,255,255,0.14) 0%,transparent 100%)" }}/>
        {item.icon}
      </div>
      <div style={{ padding:"9px 10px 10px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#fff",marginBottom:3,lineHeight:1.3 }}>{item.name}</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <span style={{ fontSize:11,fontWeight:900,color:item.color||"#FFC83D" }}>🪙 {item.price?.toLocaleString()??""}</span>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => onAdd?.(item.id)}
            style={{ width:26,height:26,borderRadius:8,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,
              background:inCart?"linear-gradient(135deg,#10B981,#059669)":"rgba(255,200,61,0.15)",
              boxShadow:inCart?"0 3px 10px rgba(16,185,129,0.4)":GLOW_GOLD }}>
            {inCart?"✓":"+"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── SECTION SCREENS ─────────────── */

function LuckyID({ onBack }) {
  const ids = [
    { id:1,name:"Diamond ID #8888",icon:"💎",price:50000,badge:"RARE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#7DD3FC,#0369A1)" },
    { id:2,name:"Gold ID #6666",  icon:"🥇",price:30000,badge:"HOT", badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:3,name:"Lucky ID #7777", icon:"🍀",price:25000,badge:"",    color:"#10B981",gradient:"linear-gradient(135deg,#6EE7B7,#065F46)" },
    { id:4,name:"Short ID #999",  icon:"⚡",price:80000,badge:"ELITE",badgeColor:"#A855F7",color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#7E22CE)" },
    { id:5,name:"Neon ID #0001",  icon:"🌟",price:15000,badge:"NEW", badgeColor:"#10B981",color:"#E2E8F0",gradient:"linear-gradient(135deg,#F1F5F9,#475569)" },
    { id:6,name:"Royal ID #1111", icon:"👑",price:45000,badge:"VIP", badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🎲 Lucky ID System" subtitle="Premium Unique IDs" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ ...S.glass(),padding:"13px",marginBottom:14,background:"linear-gradient(135deg,rgba(255,200,61,0.08),rgba(59,130,246,0.05))" }}>
          <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",marginBottom:4 }}>🎲 WHAT IS LUCKY ID?</div>
          <p style={{ fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.7,margin:0 }}>Premium unique ID numbers with special designs, glow effects, animated displays, and premium fonts that elevate your platform identity.</p>
        </div>
        <div style={{ ...S.sec }}>🏆 FEATURED IDs</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {ids.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}>
          <div style={S.sec}>⚡ ID ACTIONS</div>
          <ActionRow actions={["Preview ID","Purchase ID","Apply ID","Change ID Style","Animated Display","Glow Effects"]}/>
        </div>
      </div>
    </div>
  );
}

function AvatarFrameStore({ onBack }) {
  const [cat,setCat] = useState("All");
  const cats = ["All","VIP","Diamond","Seasonal","Event","Royal","Animated"];
  const frames = [
    { id:1,name:"Gold Royal Frame",   icon:"🖼️",price:8000, badge:"HOT",  badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"Diamond Crystal",    icon:"💠",price:12000,badge:"ELITE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:3,name:"Fire Aura Frame",    icon:"🔥",price:6000, badge:"",     color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:4,name:"Galaxy Frame",       icon:"🌌",price:9500, badge:"NEW",  badgeColor:"#10B981",color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
    { id:5,name:"Royal Crown Frame",  icon:"👑",price:15000,badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
    { id:6,name:"Spring Blossom",     icon:"🌸",price:4000, badge:"SEASONAL",badgeColor:"#EC4899",color:"#EC4899",gradient:"linear-gradient(135deg,#FBCFE8,#BE185D)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🖼️ Avatar Frame Store" subtitle="Royal Frame Gallery" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12 }}>
          {cats.map(c => <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setCat(c)} style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:cat===c?GOLD:"rgba(255,255,255,0.07)",color:cat===c?"#0A0500":"#FFC83D" }}>{c}</motion.button>)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {frames.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}>
          <div style={S.sec}>⚡ FRAME ACTIONS</div>
          <ActionRow actions={["Preview","Equip","Remove","Upgrade"]}/>
        </div>
      </div>
    </div>
  );
}

function EntryEffectCenter({ onBack }) {
  const effects = [
    { id:1,name:"Crown Entry",        icon:"👑",price:10000,badge:"HOT",  badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"Diamond Explosion",  icon:"💎",price:14000,badge:"ELITE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:3,name:"Fire Entrance",      icon:"🔥",price:8000, badge:"",     color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:4,name:"Dragon Entry",       icon:"🐉",price:20000,badge:"RARE", badgeColor:"#EF4444",color:"#EF4444",gradient:"linear-gradient(135deg,#FCA5A5,#991B1B)" },
    { id:5,name:"Galaxy Entrance",    icon:"🌌",price:12000,badge:"NEW",  badgeColor:"#10B981",color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
    { id:6,name:"Royal Car Arrival",  icon:"🚗",price:18000,badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🚀 Entry Effect Center" subtitle="Luxury Entrance Animations" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ ...S.glass(),padding:"14px",marginBottom:14,background:"linear-gradient(135deg,rgba(239,68,68,0.07),rgba(255,200,61,0.05))",display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ fontSize:32,flexShrink:0 }}>🎭</div>
          <div>
            <div style={{ fontSize:12,fontWeight:900,color:"#fff",marginBottom:2 }}>Live Room Entry Effects</div>
            <p style={{ fontSize:10,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6 }}>Make a grand entrance every time you join a live room with stunning animations.</p>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {effects.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Preview Animation","Activate","Change Effect","Set Duration"]}/></div>
      </div>
    </div>
  );
}

function RoomEntryItems({ onBack }) {
  const items = [
    { id:1,name:"Name Highlight Gold", icon:"✨",price:3000, badge:"",     color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"VIP Entry Sound",     icon:"🔔",price:2500, badge:"NEW",  badgeColor:"#10B981",color:"#10B981",gradient:"linear-gradient(135deg,#6EE7B7,#065F46)" },
    { id:3,name:"Royal Badge Entry",   icon:"🏅",price:5000, badge:"VIP",  badgeColor:"#FFC83D",color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#7E22CE)" },
    { id:4,name:"Dragon Aura Entry",   icon:"🐉",price:8000, badge:"RARE", badgeColor:"#EF4444",color:"#EF4444",gradient:"linear-gradient(135deg,#FCA5A5,#991B1B)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="👑 Room Entry Items" subtitle="VIP Door Effects" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14 }}>
          {items.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px" }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Activate","Disable","Customize","Name Highlight","Entry Sound","Special Badge"]}/></div>
      </div>
    </div>
  );
}

function BubbleChatSystem({ onBack }) {
  const bubbles = [
    { id:1,name:"Gold Bubble",    icon:"💬",price:4000, badge:"HOT",  badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"Diamond Bubble", icon:"💎",price:6000, badge:"ELITE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:3,name:"Fire Bubble",    icon:"🔥",price:4500, badge:"",     color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:4,name:"Neon Bubble",    icon:"⚡",price:3500, badge:"NEW",  badgeColor:"#10B981",color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
    { id:5,name:"Royal Bubble",   icon:"👑",price:8000, badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="💬 Bubble Chat System" subtitle="Magic Chat Bubbles" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ ...S.glass(),padding:"13px",marginBottom:14 }}>
          <div style={S.sec}>💬 LIVE PREVIEW</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {[{msg:"Hello everyone! 🎉",color:"#FFC83D"},{msg:"This is my Gold bubble ✨",color:"#FFC83D"}].map((m,i) => (
              <div key={i} style={{ alignSelf:i%2===0?"flex-start":"flex-end",maxWidth:"70%",padding:"8px 14px",borderRadius:16,
                background:`linear-gradient(135deg,${m.color}20,${m.color}08)`,border:`1px solid ${m.color}30`,
                fontSize:11,color:"#fff",boxShadow:`0 2px 8px ${m.color}25` }}>
                {m.msg}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {bubbles.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Apply","Preview","Change Style"]}/></div>
      </div>
    </div>
  );
}

function TextStyleStore({ onBack }) {
  const styles = [
    { id:1,name:"Golden Text",   icon:"✨",price:2000, badge:"HOT",  badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"Neon Text",     icon:"💡",price:2500, badge:"NEW",  badgeColor:"#10B981",color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
    { id:3,name:"Fire Text",     icon:"🔥",price:3000, badge:"",     color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:4,name:"Diamond Text",  icon:"💎",price:4500, badge:"ELITE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:5,name:"Royal Text",    icon:"👑",price:5000, badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="✨ Text Style Store" subtitle="Premium Text Effects" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ ...S.glass(),padding:"13px",marginBottom:14,textAlign:"center" }}>
          {["Golden Text","💎 Diamond Text","🔥 Fire Text"].map((t,i) => (
            <div key={i} style={{ fontSize:16,fontWeight:900,marginBottom:6,background:["linear-gradient(135deg,#FFC83D,#D97706)","linear-gradient(135deg,#BAE6FD,#0369A1)","linear-gradient(135deg,#FED7AA,#C2410C)"][i],WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>{t}</div>
          ))}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {styles.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Preview","Apply","Save Style"]}/></div>
      </div>
    </div>
  );
}

function RoomCoverStore({ onBack }) {
  const [cat,setCat] = useState("All");
  const cats = ["All","Luxury","Gaming","Music","VIP","Festival"];
  const covers = [
    { id:1,name:"Luxury Palace",    icon:"🏰",price:12000,badge:"HOT",  badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#92400E)" },
    { id:2,name:"Gaming Arena",     icon:"🎮",price:8000, badge:"NEW",  badgeColor:"#10B981",color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#1E1B4B)" },
    { id:3,name:"Music Stage",      icon:"🎵",price:9000, badge:"",     color:"#EC4899",gradient:"linear-gradient(135deg,#FBCFE8,#9D174D)" },
    { id:4,name:"VIP Lounge",       icon:"👑",price:15000,badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
    { id:5,name:"Festival Night",   icon:"🎆",price:10000,badge:"LIMITED",badgeColor:"#A855F7",color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#6B21A8)" },
    { id:6,name:"Galaxy Space",     icon:"🌌",price:11000,badge:"",     color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#1E3A5F)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🏰 Room Cover Store" subtitle="Live Room Design Studio" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12 }}>
          {cats.map(c => <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setCat(c)} style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:cat===c?GOLD:"rgba(255,255,255,0.07)",color:cat===c?"#0A0500":"#FFC83D" }}>{c}</motion.button>)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {covers.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Preview Room","Apply Cover","Change Theme"]}/></div>
      </div>
    </div>
  );
}

function GiftStore({ onBack }) {
  const [cat,setCat] = useState("All");
  const cats = ["All","Flowers","Cars","Diamonds","Crowns","Animals","Legendary"];
  const gifts = [
    { id:1,name:"Rose Bouquet",     icon:"🌹",price:100,  badge:"",     color:"#EC4899",gradient:"linear-gradient(135deg,#FBCFE8,#9D174D)" },
    { id:2,name:"Luxury Car",       icon:"🚗",price:5000, badge:"HOT",  badgeColor:"#EF4444",color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:3,name:"Diamond Ring",     icon:"💍",price:8000, badge:"ELITE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:4,name:"Royal Crown",      icon:"👑",price:10000,badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:5,name:"Golden Dragon",    icon:"🐉",price:50000,badge:"LEGENDARY",badgeColor:"#EF4444",color:"#EF4444",gradient:"linear-gradient(135deg,#FCA5A5,#7F1D1D)" },
    { id:6,name:"Galaxy Castle",    icon:"🏰",price:30000,badge:"RARE", badgeColor:"#A855F7",color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#4C1D95)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🎁 Virtual Gift Store" subtitle="Luxury Gift Box" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12 }}>
          {cats.map(c => <motion.button key={c} whileTap={{ scale:0.92 }} onClick={() => setCat(c)} style={{ flexShrink:0,padding:"5px 12px",borderRadius:14,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",background:cat===c?GOLD:"rgba(255,255,255,0.07)",color:cat===c?"#0A0500":"#FFC83D" }}>{c}</motion.button>)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {gifts.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.04 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Send Gift","Buy Gift","Favorite","3D Animation","Sound Effects"]}/></div>
      </div>
    </div>
  );
}

function ProfileEffects({ onBack }) {
  const effects = [
    { id:1,name:"Gold Aura",       icon:"🌟",price:6000, badge:"HOT",  badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"Diamond Glow",    icon:"💎",price:8000, badge:"ELITE",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:3,name:"Galaxy BG",       icon:"🌌",price:7000, badge:"",     color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
    { id:4,name:"Fire Particles",  icon:"🔥",price:5000, badge:"NEW",  badgeColor:"#10B981",color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🌟 Profile Effects" subtitle="Profile Magic Effects" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {effects.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px" }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Activate","Preview","Change","Aura Effect","Glow Effect","Particle Effect"]}/></div>
      </div>
    </div>
  );
}

function BadgeCollection({ onBack }) {
  const badges = [
    { id:1,name:"VIP Crown Badge",      icon:"👑",price:5000, badge:"VIP",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#D97706)" },
    { id:2,name:"Event Champion Badge", icon:"🏆",price:0,    badge:"EARNED",badgeColor:"#10B981",color:"#10B981",gradient:"linear-gradient(135deg,#6EE7B7,#065F46)" },
    { id:3,name:"Top Gifter Badge",     icon:"🎁",price:8000, badge:"RARE", badgeColor:"#EF4444",color:"#EF4444",gradient:"linear-gradient(135deg,#FCA5A5,#991B1B)" },
    { id:4,name:"Ranking Star Badge",   icon:"⭐",price:3000, badge:"",     color:"#F59E0B",gradient:"linear-gradient(135deg,#FDE68A,#92400E)" },
    { id:5,name:"Founder Badge",        icon:"🔱",price:0,    badge:"EARNED",badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#1E3A5F)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🏅 Badge Collection" subtitle="Premium Badge Center" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
          {badges.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={{ ...item,price:item.price||undefined }} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px",marginTop:14 }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Equip","Hide","Replace"]}/></div>
      </div>
    </div>
  );
}

function VoiceEffects({ onBack }) {
  const items = [
    { id:1,name:"Voice Glow Frame",  icon:"🎙️",price:5000,badge:"",     color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#7E22CE)" },
    { id:2,name:"Wave Animation",    icon:"〰️",price:4000,badge:"NEW",  badgeColor:"#10B981",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#0369A1)" },
    { id:3,name:"Speaker FX Gold",   icon:"🔊",price:3500,badge:"",     color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:4,name:"Room Atmosphere",   icon:"🌊",price:6000,badge:"VIP",  badgeColor:"#FFC83D",color:"#10B981",gradient:"linear-gradient(135deg,#6EE7B7,#065F46)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🎙️ Voice Room Effects" subtitle="Audio Premium Studio" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {items.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px" }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Activate","Customize"]}/></div>
      </div>
    </div>
  );
}

function EventItems({ onBack }) {
  const items = [
    { id:1,name:"Summer Frame 2026",  icon:"☀️",price:4000,badge:"LIMITED",badgeColor:"#EF4444",color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:2,name:"Event Champion Badge",icon:"🏅",price:0,  badge:"EARNED", badgeColor:"#10B981",color:"#10B981",gradient:"linear-gradient(135deg,#6EE7B7,#065F46)" },
    { id:3,name:"Festival Gift Box",  icon:"🎊",price:6000,badge:"LIMITED",badgeColor:"#A855F7",color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#6B21A8)" },
    { id:4,name:"Competition Item",   icon:"🎮",price:3500,badge:"",       color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🎮 Event Items" subtitle="Event Treasure Box" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ ...S.glass(),padding:"11px",marginBottom:12,background:"linear-gradient(135deg,rgba(239,68,68,0.08),rgba(168,85,247,0.05))",display:"flex",gap:8,alignItems:"center" }}>
          <span style={{ fontSize:20 }}>⏰</span>
          <div><div style={{ fontSize:11,fontWeight:800,color:"#EF4444" }}>Limited Time Offer!</div><div style={{ fontSize:9,color:"rgba(255,255,255,0.5)" }}>Event items expire when the event ends</div></div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {items.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px" }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Collect","Use","Exchange"]}/></div>
      </div>
    </div>
  );
}

function VIPMallSection({ onBack }) {
  const items = [
    { id:1,name:"Ultra Crown Frame",   icon:"👑",price:50000,badge:"ULTRA",  badgeColor:"#FFC83D",color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
    { id:2,name:"Royal Dragon Entry",  icon:"🐉",price:80000,badge:"ROYAL",  badgeColor:"#EF4444",color:"#EF4444",gradient:"linear-gradient(135deg,#FCA5A5,#7F1D1D)" },
    { id:3,name:"Legendary Gift Pack", icon:"🏆",price:100000,badge:"LEGEND",badgeColor:"#A855F7",color:"#A855F7",gradient:"linear-gradient(135deg,#E9D5FF,#4C1D95)" },
    { id:4,name:"Exclusive Theme",     icon:"🌌",price:40000,badge:"VIP",    badgeColor:"#38BDF8",color:"#38BDF8",gradient:"linear-gradient(135deg,#BAE6FD,#1E3A5F)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="👑 VIP Exclusive Mall" subtitle="Royal VIP Store" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ ...S.glass(),padding:"14px",marginBottom:14,background:"linear-gradient(135deg,rgba(255,200,61,0.1),rgba(168,85,247,0.08))",textAlign:"center" }}>
          <div style={{ fontSize:28,marginBottom:6 }}>👑</div>
          <div style={{ fontSize:14,fontWeight:900,color:"#FFC83D" }}>VIP Exclusive Access</div>
          <div style={{ fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:4 }}>These ultra-premium items are exclusively available to VIP members</div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {items.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px" }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Purchase","Activate"]}/></div>
      </div>
    </div>
  );
}

function LimitedEdition({ onBack }) {
  const items = [
    { id:1,name:"Anniversary Crown",   icon:"🎂",price:25000,badge:"48H LEFT",badgeColor:"#EF4444",color:"#FFC83D",gradient:"linear-gradient(135deg,#FDE68A,#D97706)" },
    { id:2,name:"Eid Festival Frame",  icon:"🌙",price:12000,badge:"3 DAYS",  badgeColor:"#10B981",color:"#10B981",gradient:"linear-gradient(135deg,#6EE7B7,#065F46)" },
    { id:3,name:"Summer Collection",   icon:"☀️",price:8000, badge:"LIMITED", badgeColor:"#A855F7",color:"#F97316",gradient:"linear-gradient(135deg,#FED7AA,#C2410C)" },
    { id:4,name:"Global Event Item",   icon:"🌍",price:20000,badge:"RARE",    badgeColor:"#38BDF8",color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
  ];
  const [cart,setCart] = useState(new Set());
  const toggle = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  return (
    <div style={S.page}>
      <BackHeader title="🔥 Limited Edition" subtitle="Rare Collection · Buy Before Expiry" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.15),rgba(249,115,22,0.1))",border:"1px solid rgba(239,68,68,0.3)",borderRadius:14,padding:"12px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center" }}>
          <span style={{ fontSize:20 }}>🔥</span>
          <div><div style={{ fontSize:11,fontWeight:900,color:"#EF4444" }}>Limited Time Only!</div><div style={{ fontSize:9,color:"rgba(255,255,255,0.5)" }}>These items will disappear forever once the timer ends. Don't miss out!</div></div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
          {items.map((item,i) => <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}><ItemCard item={item} inCart={cart.has(item.id)} onAdd={toggle}/></motion.div>)}
        </div>
        <div style={{ ...S.glass(),padding:"13px" }}><div style={S.sec}>⚡ ACTIONS</div><ActionRow actions={["Buy Before Expiry","Collect"]}/></div>
      </div>
    </div>
  );
}

function Inventory({ onBack }) {
  const [tab,setTab] = useState("owned");
  const owned = [
    { id:1,name:"Gold Royal Frame",    icon:"🖼️",status:"Active", color:"#FFC83D" },
    { id:2,name:"Diamond Bubble",      icon:"💬",status:"Active", color:"#38BDF8" },
    { id:3,name:"Crown Entry Effect",  icon:"👑",status:"Inactive",color:"#A855F7" },
    { id:4,name:"Gold Aura",           icon:"🌟",status:"Active", color:"#FFC83D" },
    { id:5,name:"Fire Entrance",       icon:"🔥",status:"Expired",color:"#EF4444" },
    { id:6,name:"Rose Bouquet x20",    icon:"🌹",status:"Owned",  color:"#EC4899" },
  ];
  const statusColor = { Active:"#10B981",Inactive:"#9CA3AF",Expired:"#EF4444",Owned:"#FFC83D" };
  return (
    <div style={S.page}>
      <BackHeader title="🎒 Item Inventory" subtitle="Your Personal Collection" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:14 }}>
          {[{v:"6",l:"Owned",icon:"📦",c:"#FFC83D"},{v:"3",l:"Active",icon:"✅",c:"#10B981"},{v:"1",l:"Expired",icon:"⏰",c:"#EF4444"}].map(s => (
            <div key={s.l} style={{ background:`${s.c}10`,border:`1px solid ${s.c}25`,borderRadius:14,padding:"12px 8px",textAlign:"center" }}>
              <div style={{ fontSize:16 }}>{s.icon}</div><div style={{ fontSize:14,fontWeight:900,color:s.c }}>{s.v}</div><div style={{ fontSize:8,color:"rgba(255,255,255,0.45)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:6,marginBottom:12 }}>
          {["owned","active","expired"].map(t => <motion.button key={t} whileTap={{ scale:0.92 }} onClick={() => setTab(t)} style={{ flex:1,padding:"8px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:10,background:tab===t?GOLD:"rgba(255,255,255,0.07)",color:tab===t?"#0A0500":"#FFC83D",textTransform:"capitalize" }}>{t}</motion.button>)}
        </div>
        {owned.filter(i => tab==="owned"||tab===i.status.toLowerCase()).map((item,i) => (
          <motion.div key={item.id} initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
            style={{ ...S.glass(),padding:"12px 14px",marginBottom:10,display:"flex",gap:12,alignItems:"center",borderLeft:`3px solid ${item.color}` }}>
            <div style={{ width:42,height:42,borderRadius:12,background:`${item.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12,fontWeight:800,color:"#fff" }}>{item.name}</div>
              <div style={{ fontSize:9,fontWeight:700,color:statusColor[item.status],marginTop:2 }}>● {item.status}</div>
            </div>
            <ActionRow actions={["Equip","Remove","Gift"]}/>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PaymentCenter({ onBack }) {
  const [method,setMethod] = useState("Coins");
  const methods = ["Coins","Wallet","Card","PayPal","JazzCash","EasyPaisa"];
  const history = [
    { item:"Gold Royal Frame",    amount:"8,000 Coins", date:"Jun 15", method:"Coins",  color:"#FFC83D" },
    { item:"Diamond Bubble",      amount:"$6.00",       date:"Jun 10", method:"Card",   color:"#38BDF8" },
    { item:"Crown Entry Effect",  amount:"10,000 Coins",date:"Jun 5",  method:"Coins",  color:"#A855F7" },
    { item:"Coin Pack ×5000",     amount:"$4.99",       date:"Jun 1",  method:"PayPal", color:"#10B981" },
  ];
  return (
    <div style={S.page}>
      <BackHeader title="💳 Payment Center" subtitle="Premium Wallet & Transactions" onBack={onBack}/>
      <div style={{ padding:"14px" }}>
        {/* Wallet balance */}
        <div style={{ ...S.glass(),padding:"16px",marginBottom:14,background:"linear-gradient(135deg,rgba(255,200,61,0.1),rgba(16,185,129,0.06))",textAlign:"center" }}>
          <div style={{ fontSize:10,fontWeight:800,color:"#FFC83D",letterSpacing:"0.08em",marginBottom:4 }}>YOUR WALLET BALANCE</div>
          <div style={{ fontSize:28,fontWeight:900,color:"#FFC83D" }}>🪙 24,680</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2 }}>≈ $24.68 USD</div>
          <motion.button whileTap={{ scale:0.94 }}
            style={{ marginTop:12,padding:"9px 22px",borderRadius:12,border:"none",cursor:"pointer",fontWeight:800,fontSize:11,color:"#0A0500",background:GOLD,boxShadow:`0 4px 14px ${GLOW_GOLD}` }}>
            + Buy Coins
          </motion.button>
        </div>
        {/* Payment method */}
        <div style={{ ...S.glass(),padding:"13px",marginBottom:14 }}>
          <div style={S.sec}>💳 PAYMENT METHOD</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {methods.map(m => (
              <motion.button key={m} whileTap={{ scale:0.92 }} onClick={() => setMethod(m)}
                style={{ padding:"7px 13px",borderRadius:11,border:"none",cursor:"pointer",fontWeight:700,fontSize:10,
                  background:method===m?GOLD:"rgba(255,255,255,0.08)",color:method===m?"#0A0500":"rgba(255,255,255,0.7)" }}>
                {m}
              </motion.button>
            ))}
          </div>
        </div>
        {/* Transaction history */}
        <div style={S.sec}>📋 TRANSACTION HISTORY</div>
        {history.map((h,i) => (
          <div key={i} style={{ ...S.glass(),padding:"11px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"center" }}>
            <div style={{ width:36,height:36,borderRadius:10,background:`${h.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>💳</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,fontWeight:800,color:"#fff" }}>{h.item}</div>
              <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)" }}>{h.date} · {h.method}</div>
            </div>
            <span style={{ fontSize:11,fontWeight:900,color:h.color }}>{h.amount}</span>
          </div>
        ))}
        <div style={{ ...S.glass(),padding:"13px",marginTop:4 }}><ActionRow actions={["Buy Coins","Purchase Item","Transaction History"]}/></div>
      </div>
    </div>
  );
}

/* ─────────────── MENU CONFIG ─────────────── */
const MENU = [
  { id:"luckyid",    icon:"🎲", label:"Lucky ID",       sub:"Premium IDs",      gradient:"linear-gradient(145deg,#FFC83D,#D97706)", glow:"rgba(255,200,61,0.45)" },
  { id:"frames",     icon:"🖼️", label:"Avatar Frames",  sub:"Royal Gallery",    gradient:"linear-gradient(145deg,#60A5FA,#1D4ED8)", glow:"rgba(96,165,250,0.4)" },
  { id:"entry",      icon:"🚀", label:"Entry Effects",  sub:"Live Entrance",    gradient:"linear-gradient(145deg,#EF4444,#991B1B)", glow:"rgba(239,68,68,0.4)" },
  { id:"roomentry",  icon:"👑", label:"Room Entry",     sub:"VIP Door",         gradient:"linear-gradient(145deg,#FCD34D,#92400E)", glow:"rgba(252,211,77,0.4)" },
  { id:"bubble",     icon:"💬", label:"Bubble Chat",    sub:"Magic Bubbles",    gradient:"linear-gradient(145deg,#A855F7,#6D28D9)", glow:"rgba(168,85,247,0.4)" },
  { id:"textstyle",  icon:"✨", label:"Text Styles",    sub:"Premium Fonts",    gradient:"linear-gradient(145deg,#F9A8D4,#DB2777)", glow:"rgba(249,168,212,0.4)" },
  { id:"roomcover",  icon:"🏰", label:"Room Cover",     sub:"Design Studio",    gradient:"linear-gradient(145deg,#6EE7B7,#065F46)", glow:"rgba(110,231,183,0.4)" },
  { id:"gifts",      icon:"🎁", label:"Gifts",          sub:"Luxury Gifts",     gradient:"linear-gradient(145deg,#FCA5A5,#7F1D1D)", glow:"rgba(252,165,165,0.4)" },
  { id:"profilefx",  icon:"🌟", label:"Profile FX",     sub:"Magic Effects",    gradient:"linear-gradient(145deg,#FDE68A,#B45309)", glow:"rgba(253,230,138,0.4)" },
  { id:"badges",     icon:"🏅", label:"Badges",         sub:"Premium Badges",   gradient:"linear-gradient(145deg,#BAE6FD,#075985)", glow:"rgba(186,230,253,0.4)" },
  { id:"voicefx",    icon:"🎙️", label:"Voice Effects",  sub:"Audio Studio",     gradient:"linear-gradient(145deg,#C084FC,#5B21B6)", glow:"rgba(192,132,252,0.4)" },
  { id:"eventitems", icon:"🎮", label:"Event Items",    sub:"Treasure Box",     gradient:"linear-gradient(145deg,#6EE7B7,#065F46)", glow:"rgba(110,231,183,0.4)" },
  { id:"vipmall",    icon:"💎", label:"VIP Mall",       sub:"Royal Store",      gradient:"linear-gradient(145deg,#FFC83D,#A855F7)", glow:"rgba(255,200,61,0.5)" },
  { id:"limited",    icon:"🔥", label:"Limited Edition",sub:"Rare Items",       gradient:"linear-gradient(145deg,#EF4444,#F97316)", glow:"rgba(239,68,68,0.45)" },
  { id:"inventory",  icon:"🎒", label:"Inventory",      sub:"My Collection",    gradient:"linear-gradient(145deg,#374151,#1F2937)", glow:"rgba(55,65,81,0.4)" },
  { id:"payment",    icon:"💳", label:"Payment Center", sub:"Wallet & Pay",     gradient:"linear-gradient(145deg,#10B981,#065F46)", glow:"rgba(16,185,129,0.4)" },
];

const SECTION_MAP = { luckyid:LuckyID, frames:AvatarFrameStore, entry:EntryEffectCenter, roomentry:RoomEntryItems, bubble:BubbleChatSystem, textstyle:TextStyleStore, roomcover:RoomCoverStore, gifts:GiftStore, profilefx:ProfileEffects, badges:BadgeCollection, voicefx:VoiceEffects, eventitems:EventItems, vipmall:VIPMallSection, limited:LimitedEdition, inventory:Inventory, payment:PaymentCenter };

/* ─────────────── MAIN HOME ─────────────── */
const FEATURED = [
  { id:"f1",name:"Dragon Entry",    icon:"🐉",price:20000,badge:"🔥 TRENDING",color:"#EF4444",gradient:"linear-gradient(135deg,#FCA5A5,#7F1D1D)" },
  { id:"f2",name:"Gold Crown Frame",icon:"👑",price:15000,badge:"⭐ TOP PICK", color:"#FFC83D",gradient:"linear-gradient(135deg,#FCD34D,#92400E)" },
  { id:"f3",name:"Galaxy Bubble",   icon:"🌌",price:9500, badge:"💎 NEW",     color:"#818CF8",gradient:"linear-gradient(135deg,#C7D2FE,#3730A3)" },
];

export default function Mall() {
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(new Set());

  if (section) {
    const Screen = SECTION_MAP[section];
    if (Screen) return <Screen onBack={() => setSection(null)}/>;
  }

  const toggleCart = id => setCart(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const filtered = query ? MENU.filter(m => m.label.toLowerCase().includes(query.toLowerCase())) : MENU;

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
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🏬 VYRO Mall</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>Premium Digital Marketplace · 16 Stores</div>
          </div>
          {cart.size>0 && (
            <motion.button whileTap={{ scale:0.92 }} onClick={() => setSection("inventory")}
              style={{ position:"relative",width:36,height:36,borderRadius:"50%",background:GOLD,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>
              🛒
              <div style={{ position:"absolute",top:-2,right:-2,width:15,height:15,borderRadius:"50%",background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:8,fontWeight:900,color:"#fff" }}>{cart.size}</span>
              </div>
            </motion.button>
          )}
        </div>
      </div>

      <div style={{ padding:"14px" }}>
        {/* Hero */}
        <div style={{ borderRadius:20,overflow:"hidden",marginBottom:14,position:"relative",background:"linear-gradient(135deg,#1A0E00,#2A0820)",border:"1px solid rgba(255,200,61,0.2)",boxShadow:"0 8px 32px rgba(255,200,61,0.15)" }}>
          <div style={{ height:3,background:"linear-gradient(90deg,#FFC83D,#EF4444,#A855F7,#38BDF8,#FFC83D)" }}/>
          <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,200,61,0.15),transparent 70%)",pointerEvents:"none" }}/>
          <div style={{ padding:"16px" }}>
            <div style={{ fontSize:10,fontWeight:800,color:"rgba(255,200,61,0.6)",letterSpacing:"0.08em",marginBottom:3 }}>VYRO LIVE · PREMIUM MARKETPLACE</div>
            <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:4 }}>Digital Items Mall</div>
            <div style={{ fontSize:11,color:"rgba(255,255,255,0.55)",marginBottom:14,lineHeight:1.7 }}>Frames · Effects · Gifts · Bubbles · Badges · and much more</div>
            {/* Featured row */}
            <div style={{ display:"flex",gap:8,overflowX:"auto",paddingBottom:4 }}>
              {FEATURED.map(f => (
                <div key={f.id} style={{ flexShrink:0,background:`${f.color}15`,border:`1px solid ${f.color}30`,borderRadius:14,padding:"10px 12px",display:"flex",alignItems:"center",gap:8,minWidth:130 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:f.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize:9,fontWeight:900,color:f.color }}>{f.badge}</div>
                    <div style={{ fontSize:10,fontWeight:800,color:"#fff" }}>{f.name}</div>
                    <div style={{ fontSize:10,fontWeight:900,color:"#FFC83D" }}>🪙 {f.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ ...S.glass(),padding:"11px 13px",display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
          <Search size={14} color="#FFC83D"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search stores…"
            style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
        </div>

        {/* Quick banners */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
          {[
            { icon:"🔥",label:"Limited Edition",sub:"Expiring soon!",id:"limited",color:"#EF4444",g:"linear-gradient(135deg,rgba(239,68,68,0.18),rgba(249,115,22,0.1))" },
            { icon:"👑",label:"VIP Mall",sub:"Exclusive items",id:"vipmall",color:"#FFC83D",g:"linear-gradient(135deg,rgba(255,200,61,0.18),rgba(168,85,247,0.1))" },
          ].map(b => (
            <motion.div key={b.id} whileTap={{ scale:0.95 }} onClick={() => setSection(b.id)}
              style={{ background:b.g,border:`1px solid ${b.color}30`,borderRadius:16,padding:"13px 14px",cursor:"pointer",display:"flex",gap:8,alignItems:"center" }}>
              <span style={{ fontSize:22 }}>{b.icon}</span>
              <div><div style={{ fontSize:12,fontWeight:900,color:b.color }}>{b.label}</div><div style={{ fontSize:9,color:"rgba(255,255,255,0.5)" }}>{b.sub}</div></div>
            </motion.div>
          ))}
        </div>

        {/* Stores grid */}
        <div style={S.sec}>🏬 {filtered.length} STORES · TAP TO ENTER</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {filtered.map((mod,i) => (
            <motion.div key={mod.id} initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.03 }}
              whileTap={{ scale:0.91 }} onClick={() => setSection(mod.id)} style={{ cursor:"pointer" }}>
              <div style={{ borderRadius:17,overflow:"hidden",background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,200,61,0.1)",backdropFilter:"blur(8px)",
                boxShadow:`0 4px 16px ${mod.glow}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"13px 5px 10px",position:"relative" }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"17px 17px 0 0",background:mod.gradient }}/>
                <div style={{ width:44,height:44,borderRadius:13,marginBottom:6,background:mod.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                  boxShadow:`0 4px 12px ${mod.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:"14%",right:0,height:"42%",background:"linear-gradient(180deg,rgba(255,255,255,0.28) 0%,transparent 100%)",borderRadius:"0 0 50% 50%"}}/>
                  {mod.icon}
                </div>
                <div style={{ fontSize:9,fontWeight:900,color:"#fff",textAlign:"center",lineHeight:1.3,marginBottom:1 }}>{mod.label}</div>
                <div style={{ fontSize:7.5,fontWeight:600,color:"#FFC83D",textAlign:"center" }}>{mod.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}