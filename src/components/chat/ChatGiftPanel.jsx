import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const GIFT_CATS = ["Standard","Luxury","Royal","VIP","Event"];
const GIFTS = {
  Standard: [
    { id:"g1", name:"Rose",      icon:"🌹", coins:100 },
    { id:"g2", name:"Heart",     icon:"❤️",  coins:200 },
    { id:"g3", name:"Star",      icon:"⭐",  coins:500 },
    { id:"g4", name:"Rainbow",   icon:"🌈",  coins:1000 },
    { id:"g5", name:"Trophy",    icon:"🏆",  coins:2000 },
    { id:"g6", name:"Diamond",   icon:"💎",  coins:5000 },
  ],
  Luxury: [
    { id:"g7",  name:"Crown",      icon:"👑",  coins:10000 },
    { id:"g8",  name:"Castle",     icon:"🏰",  coins:20000 },
    { id:"g9",  name:"Rocket",     icon:"🚀",  coins:30000 },
    { id:"g10", name:"Dragon",     icon:"🐉",  coins:50000 },
    { id:"g11", name:"Galaxy",     icon:"🌌",  coins:75000 },
    { id:"g12", name:"Universe",   icon:"🌠",  coins:100000 },
  ],
  Royal: [
    { id:"g13", name:"Royal Crown",icon:"👑",  coins:200000 },
    { id:"g14", name:"Throne",     icon:"⚜️",  coins:500000 },
    { id:"g15", name:"Legend",     icon:"🦁",  coins:1000000 },
  ],
  VIP: [
    { id:"g16", name:"VIP Star",   icon:"🌟",  coins:50000 },
    { id:"g17", name:"VIP Gift",   icon:"🎁",  coins:100000 },
  ],
  Event: [
    { id:"g18", name:"Firework",   icon:"🎆",  coins:5000 },
    { id:"g19", name:"Confetti",   icon:"🎊",  coins:10000 },
  ],
};

export default function ChatGiftPanel({ onSend, onClose }) {
  const [cat, setCat] = useState("Standard");
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleSend = () => {
    if (!selected) return;
    onSend(selected);
    setSelected(null);
    setConfirming(false);
  };

  return (
    <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
      transition={{ type:"spring", stiffness:300, damping:30 }}
      style={{ position:"fixed", left:0, right:0, bottom:0, background:"rgba(255,255,255,0.98)", backdropFilter:"blur(24px)", borderRadius:"24px 24px 0 0", zIndex:1000, boxShadow:"0 -8px 40px rgba(0,0,0,0.15)" }}>

      <div style={{ padding:"16px 16px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:16, fontWeight:900, color:"#1a1a2e" }}>🎁 Send a Gift</div>
        <motion.button whileTap={{ scale:0.88 }} onClick={onClose} style={{ width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,0.06)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={14} /></motion.button>
      </div>

      {/* Categories */}
      <div style={{ display:"flex", gap:6, padding:"0 16px 12px", overflowX:"auto" }}>
        {GIFT_CATS.map(c => (
          <motion.button key={c} whileTap={{ scale:0.9 }} onClick={() => setCat(c)}
            style={{ padding:"5px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:800, whiteSpace:"nowrap",
              background: cat===c ? "linear-gradient(135deg,#7C3AED,#C084FC)" : "rgba(124,58,237,0.06)",
              color: cat===c ? "#fff" : "#7C3AED", boxShadow: cat===c ? "0 4px 12px rgba(124,58,237,0.3)" : "none" }}>{c}</motion.button>
        ))}
      </div>

      {/* Gift Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"0 16px 16px", maxHeight:220, overflowY:"auto" }}>
        {(GIFTS[cat]||[]).map(g => (
          <motion.button key={g.id} whileTap={{ scale:0.9 }}
            onClick={() => { setSelected(g); setConfirming(true); }}
            style={{ padding:"12px 6px", borderRadius:16, border: selected?.id===g.id ? "2px solid #7C3AED" : "2px solid transparent",
              background: selected?.id===g.id ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.03)",
              cursor:"pointer", textAlign:"center", transition:"all 0.15s" }}>
            <motion.div animate={ selected?.id===g.id ? { scale:[1,1.2,1] } : {}} transition={{ duration:0.3 }}
              style={{ fontSize:28, marginBottom:4 }}>{g.icon}</motion.div>
            <div style={{ fontSize:9, fontWeight:800, color:"#1a1a2e", lineHeight:1.2 }}>{g.name}</div>
            <div style={{ fontSize:9, color:"#F59E0B", fontWeight:700, marginTop:2 }}>🪙{g.coins>=1000?`${g.coins/1000}K`:g.coins}</div>
          </motion.button>
        ))}
      </div>

      {/* Confirm Bar */}
      <AnimatePresence>
        {confirming && selected && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:12 }}
            style={{ padding:"12px 16px 32px", borderTop:"1px solid rgba(124,58,237,0.1)", display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:32 }}>{selected.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e" }}>{selected.name}</div>
              <div style={{ fontSize:12, color:"#F59E0B", fontWeight:700 }}>🪙 {selected.coins.toLocaleString()} Coins</div>
            </div>
            <motion.button whileTap={{ scale:0.95 }} onClick={handleSend}
              style={{ padding:"10px 24px", borderRadius:20, background:"linear-gradient(135deg,#7C3AED,#C084FC)", color:"#fff", fontWeight:800, fontSize:13, border:"none", cursor:"pointer", boxShadow:"0 4px 16px rgba(124,58,237,0.4)" }}>
              Send Gift 🎁
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}