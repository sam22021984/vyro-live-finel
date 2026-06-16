import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function InboxSearch({ chats, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const results = query.length > 0
    ? chats.filter(c => c.other_user_name.toLowerCase().includes(query.toLowerCase()) || (c.last_message||"").toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, background:"rgba(255,255,255,0.98)", backdropFilter:"blur(20px)", zIndex:3000 }}>
      <div style={{ padding:"52px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(124,58,237,0.06)", borderRadius:20, padding:"10px 16px", border:"1.5px solid rgba(124,58,237,0.2)" }}>
          <Search size={16} color="#7C3AED" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search messages, users..."
            style={{ flex:1, border:"none", background:"transparent", fontSize:14, color:"#1a1a2e", outline:"none", fontWeight:600 }} />
          <motion.button whileTap={{ scale:0.88 }} onClick={onClose}><X size={16} color="#9CA3AF" /></motion.button>
        </div>
      </div>
      <div style={{ padding:"0 16px" }}>
        {query.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"#9CA3AF" }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🔍</div>
            <div style={{ fontSize:14, fontWeight:700 }}>Search conversations</div>
          </div>
        )}
        {results.map(chat => (
          <motion.div key={chat.id} whileTap={{ scale:0.98 }} onClick={() => onSelect(chat)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", borderRadius:16, marginBottom:6, background:"rgba(124,58,237,0.04)", cursor:"pointer" }}>
            <img src={chat.other_user_avatar} alt="" style={{ width:44, height:44, borderRadius:"50%", objectFit:"cover" }} />
            <div>
              <div style={{ fontWeight:800, fontSize:14, color:"#1a1a2e" }}>{chat.other_user_name}</div>
              <div style={{ fontSize:12, color:"#6B7280" }}>{chat.last_message}</div>
            </div>
          </motion.div>
        ))}
        {query.length > 0 && results.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:"#9CA3AF" }}>
            <div style={{ fontSize:14 }}>No results for "{query}"</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}