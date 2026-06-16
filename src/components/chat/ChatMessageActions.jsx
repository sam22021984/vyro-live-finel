import { motion } from "framer-motion";

const ACTIONS = [
  { icon:"↩️", label:"Reply",        key:"reply",    color:"#7C3AED" },
  { icon:"📋", label:"Copy",         key:"copy",     color:"#3B82F6" },
  { icon:"🌐", label:"Translate",    key:"translate",color:"#10B981" },
  { icon:"❤️", label:"React",        key:"react",    color:"#EC4899" },
  { icon:"📌", label:"Pin",          key:"pin",      color:"#F59E0B" },
  { icon:"🗑",  label:"Delete for Me",key:"delete",  color:"#EF4444" },
  { icon:"🚩", label:"Report",       key:"report",   color:"#F97316" },
];

export default function ChatMessageActions({ msg, onAction, onClose }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(8px)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.8, opacity:0 }}
        onClick={e => e.stopPropagation()}
        style={{ background:"rgba(255,255,255,0.98)", borderRadius:24, padding:20, width:"100%", maxWidth:320, boxShadow:"0 16px 48px rgba(0,0,0,0.2)" }}>

        {/* Message preview */}
        <div style={{ background:"rgba(124,58,237,0.06)", borderRadius:16, padding:"10px 14px", marginBottom:16, borderLeft:"3px solid #7C3AED" }}>
          <div style={{ fontSize:13, color:"#1a1a2e", lineHeight:1.5 }}>{msg.content || "🎁 " + msg.gift_name}</div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {ACTIONS.map(a => (
            <motion.button key={a.key} whileTap={{ scale:0.88 }} onClick={() => onAction(a.key, msg)}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 6px", borderRadius:14, background:`${a.color}08`, border:`1px solid ${a.color}15`, cursor:"pointer" }}>
              <span style={{ fontSize:20 }}>{a.icon}</span>
              <span style={{ fontSize:9, fontWeight:800, color: a.color, textAlign:"center", lineHeight:1.2 }}>{a.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}