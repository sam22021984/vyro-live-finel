import { motion } from "framer-motion";
import { X } from "lucide-react";

const ITEMS = [
  { icon:"👤", label:"View Full Profile",    color:"#7C3AED" },
  { icon:"❤️", label:"Follow User",          color:"#EC4899" },
  { icon:"🔗", label:"Share Profile",        color:"#3B82F6" },
  { icon:"🔇", label:"Mute Notifications",   color:"#6B7280" },
  { icon:"🔍", label:"Search in Chat",       color:"#10B981" },
  { icon:"📤", label:"Export Chat",          color:"#F59E0B" },
  { icon:"🗑",  label:"Clear Chat History",   color:"#EF4444" },
  { icon:"🚫", label:"Block User",           color:"#EF4444" },
  { icon:"🚩", label:"Report User",          color:"#F97316" },
];

export default function ChatMoreMenu({ chat, onClose, onNavigate }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)", zIndex:2000, display:"flex", alignItems:"flex-end" }}>
      <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:300, damping:30 }}
        onClick={e => e.stopPropagation()}
        style={{ width:"100%", background:"rgba(255,255,255,0.98)", borderRadius:"24px 24px 0 0", padding:"16px 16px 40px" }}>
        <div style={{ width:40, height:4, borderRadius:2, background:"rgba(0,0,0,0.15)", margin:"0 auto 16px" }} />
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(124,58,237,0.05)", borderRadius:16, marginBottom:16 }}>
          <img src={chat.other_user_avatar} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover" }} />
          <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e" }}>{chat.other_user_name}</div>
        </div>
        {ITEMS.map((item, i) => (
          <motion.button key={item.label} initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i*0.03 }} whileTap={{ scale:0.97 }}
            onClick={onClose}
            style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"12px 14px", borderRadius:14, marginBottom:4, background:`${item.color}08`, border:`1px solid ${item.color}12`, cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ fontSize:13, fontWeight:700, color: item.color }}>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}