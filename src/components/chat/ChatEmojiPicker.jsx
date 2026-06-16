import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const CATS = {
  "😊 Faces":  ["😀","😂","🥰","😍","🤩","😎","🥺","😭","🤣","😅","🫶","🥳","🤯","🥸","😏","😤"],
  "❤️ Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💕","💞","💗","💓","💘","💝","💟","🫀"],
  "🎉 Fun":    ["🎉","🎊","🎁","🎈","🎆","🎇","✨","⭐","🌟","💫","🔥","💥","🎯","🏆","🥇","🎖"],
  "👑 VIP":    ["👑","💎","💍","🪙","🏅","🥂","🍾","🌹","🦋","🦄","🐉","🌌","🚀","⚡","🌈","🎭"],
};

export default function ChatEmojiPicker({ onSelect, onClose }) {
  const [cat, setCat] = useState("😊 Faces");
  return (
    <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
      transition={{ type:"spring", stiffness:300, damping:30 }}
      style={{ position:"fixed", left:0, right:0, bottom:0, background:"rgba(255,255,255,0.98)", backdropFilter:"blur(24px)", borderRadius:"24px 24px 0 0", zIndex:999, boxShadow:"0 -8px 40px rgba(0,0,0,0.12)", padding:"16px 16px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ fontSize:14, fontWeight:900, color:"#1a1a2e" }}>😊 Emoji</div>
        <motion.button whileTap={{ scale:0.88 }} onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(0,0,0,0.06)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={13} /></motion.button>
      </div>
      <div style={{ display:"flex", gap:4, marginBottom:12, overflowX:"auto" }}>
        {Object.keys(CATS).map(c => (
          <motion.button key={c} whileTap={{ scale:0.9 }} onClick={() => setCat(c)}
            style={{ padding:"4px 10px", borderRadius:16, border:"none", cursor:"pointer", fontSize:10, fontWeight:800, whiteSpace:"nowrap",
              background: cat===c ? "linear-gradient(135deg,#7C3AED,#C084FC)" : "rgba(124,58,237,0.06)",
              color: cat===c ? "#fff" : "#7C3AED" }}>{c}</motion.button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:4 }}>
        {(CATS[cat]||[]).map((e, i) => (
          <motion.button key={i} whileTap={{ scale:0.8 }} onClick={() => onSelect(e)}
            style={{ fontSize:24, padding:6, borderRadius:10, border:"none", background:"transparent", cursor:"pointer" }}>{e}</motion.button>
        ))}
      </div>
    </motion.div>
  );
}