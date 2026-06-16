import { motion } from "framer-motion";

const ACTIONS = [
  { icon:"👤", label:"Open Profile",       key:"profile",   color:"#7C3AED" },
  { icon:"❤️", label:"Follow User",        key:"follow",    color:"#EC4899" },
  { icon:"💔", label:"Unfollow User",      key:"unfollow",  color:"#9CA3AF" },
  { icon:"📌", label:"Pin Chat",           key:"pin",       color:"#F59E0B" },
  { icon:"📤", label:"Archive Chat",       key:"archive",   color:"#3B82F6" },
  { icon:"🔇", label:"Mute Notifications", key:"mute",      color:"#6B7280" },
  { icon:"✅", label:"Mark as Read",       key:"read",      color:"#22C55E" },
  { icon:"🚫", label:"Block User",         key:"block",     color:"#EF4444" },
  { icon:"🚩", label:"Report User",        key:"report",    color:"#F97316" },
  { icon:"🗑", label:"Delete Conversation",key:"delete",    color:"#EF4444" },
  { icon:"📋", label:"Copy User ID",       key:"copyid",    color:"#7C3AED" },
];

export default function InboxLongPressMenu({ chat, onAction, onClose }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)", zIndex:2000, display:"flex", alignItems:"flex-end" }}>
      <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:300, damping:30 }}
        onClick={e => e.stopPropagation()}
        style={{ width:"100%", background:"rgba(255,255,255,0.98)", borderRadius:"24px 24px 0 0", padding:"20px 16px 40px", maxHeight:"80vh", overflowY:"auto" }}>
        <div style={{ width:40, height:4, borderRadius:2, background:"rgba(0,0,0,0.15)", margin:"0 auto 16px" }} />

        {/* Chat preview */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"rgba(124,58,237,0.05)", borderRadius:16, marginBottom:16 }}>
          <img src={chat.other_user_avatar} alt="" style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover" }} />
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e" }}>{chat.other_user_name}</div>
            <div style={{ fontSize:11, color:"#9CA3AF" }}>{chat.other_user_online ? "Online" : "Offline"}</div>
          </div>
        </div>

        {ACTIONS.map((a, i) => (
          <motion.button key={a.key} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.03 }} whileTap={{ scale:0.97 }}
            onClick={() => onAction(chat.id, a.key)}
            style={{ display:"flex", alignItems:"center", gap:12, width:"100%", padding:"13px 16px", borderRadius:14, marginBottom:4, background:`${a.color}08`, border:`1px solid ${a.color}15`, cursor:"pointer" }}>
            <span style={{ fontSize:20 }}>{a.icon}</span>
            <span style={{ fontSize:13, fontWeight:700, color: a.color }}>{a.label}</span>
          </motion.button>
        ))}
        <motion.button whileTap={{ scale:0.97 }} onClick={onClose}
          style={{ width:"100%", padding:"14px 0", marginTop:8, borderRadius:20, background:"rgba(0,0,0,0.05)", border:"none", fontSize:14, fontWeight:800, color:"#6B7280", cursor:"pointer" }}>
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );
}