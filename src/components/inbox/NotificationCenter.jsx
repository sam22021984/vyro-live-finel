import { motion } from "framer-motion";
import { X } from "lucide-react";

const NOTIFS = [
  { icon:"💎", title:"Gift Received", body:"KING PRO sent you a Royal Gift!", time:"2m ago", color:"#F59E0B" },
  { icon:"❤️", title:"New Follower",  body:"LUNA ✨ started following you",   time:"15m ago", color:"#EC4899" },
  { icon:"📞", title:"Missed Call",   body:"SARA called you",                 time:"1h ago",  color:"#EF4444" },
  { icon:"👑", title:"VIP Upgrade",   body:"You've been upgraded to VIP 3!",  time:"2h ago",  color:"#7C3AED" },
  { icon:"💬", title:"New Message",   body:"DIANA 👑: Can we collab?",        time:"3h ago",  color:"#3B82F6" },
  { icon:"🔔", title:"User Online",   body:"STORM KING is now online",        time:"5h ago",  color:"#10B981" },
];

export default function NotificationCenter({ onClose }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(6px)", zIndex:2000, display:"flex", alignItems:"flex-end" }}>
      <motion.div initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
        transition={{ type:"spring", stiffness:300, damping:30 }}
        onClick={e => e.stopPropagation()}
        style={{ width:"100%", background:"rgba(255,255,255,0.98)", borderRadius:"24px 24px 0 0", padding:"20px 16px 40px", maxHeight:"80vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:18, fontWeight:900, color:"#1a1a2e" }}>🔔 Notifications</div>
          <motion.button whileTap={{ scale:0.88 }} onClick={onClose} style={{ background:"rgba(0,0,0,0.06)", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", border:"none", cursor:"pointer" }}><X size={16} /></motion.button>
        </div>
        {NOTIFS.map((n, i) => (
          <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i*0.05 }}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", borderRadius:16, marginBottom:8, background:`${n.color}08`, border:`1px solid ${n.color}15` }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:`${n.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#1a1a2e" }}>{n.title}</div>
              <div style={{ fontSize:12, color:"#6B7280" }}>{n.body}</div>
            </div>
            <span style={{ fontSize:10, color:"#9CA3AF", fontWeight:600, flexShrink:0 }}>{n.time}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}