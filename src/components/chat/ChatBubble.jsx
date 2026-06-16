import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
}

export default function ChatBubble({ msg, isMe, onLongPress }) {
  const isGift = msg.type === "gift";
  const isSystem = msg.type === "system";

  if (isSystem) {
    return (
      <div style={{ textAlign:"center", padding:"6px 0", marginBottom:8 }}>
        <span style={{ background:"rgba(124,58,237,0.08)", borderRadius:20, padding:"4px 14px", fontSize:11, color:"#7C3AED", fontWeight:700 }}>{msg.content}</span>
      </div>
    );
  }

  if (isGift) {
    return (
      <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
        style={{ display:"flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom:12 }}>
        <motion.div whileTap={{ scale:0.95 }} onContextMenu={e => { e.preventDefault(); onLongPress(); }}
          style={{ background: isMe ? "linear-gradient(135deg,#7C3AED,#C084FC)" : "rgba(255,255,255,0.95)", borderRadius:20, padding:"16px 20px", maxWidth:220, textAlign:"center", boxShadow:"0 8px 24px rgba(0,0,0,0.12)", border: isMe ? "none" : "1px solid rgba(124,58,237,0.15)" }}>
          <motion.div animate={{ scale:[1,1.1,1], rotate:[0,5,-5,0] }} transition={{ duration:1.5, repeat:Infinity }}
            style={{ fontSize:48, marginBottom:6 }}>{msg.gift_icon || "🎁"}</motion.div>
          <div style={{ fontSize:13, fontWeight:800, color: isMe ? "#fff" : "#1a1a2e" }}>{msg.gift_name || "Gift"}</div>
          <div style={{ fontSize:11, fontWeight:700, color: isMe ? "rgba(255,255,255,0.8)" : "#F59E0B", marginTop:2 }}>🪙 {(msg.gift_coins||0).toLocaleString()} Coins</div>
          <div style={{ marginTop:6, fontSize:10, color: isMe ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>{formatTime(msg.created_date)}</div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ display:"flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom:8, alignItems:"flex-end", gap:6 }}>
      {!isMe && (
        <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#7C3AED,#C084FC)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, marginBottom:4 }}>👤</div>
      )}
      <div style={{ maxWidth:"72%" }}>
        {/* Reply preview */}
        {msg.reply_preview && (
          <div style={{ background:"rgba(124,58,237,0.08)", borderRadius:"12px 12px 0 0", padding:"6px 12px", fontSize:11, color:"#7C3AED", fontWeight:600, borderLeft:"3px solid #7C3AED" }}>
            ↩ {msg.reply_preview}
          </div>
        )}
        <motion.div
          onContextMenu={e => { e.preventDefault(); onLongPress(); }}
          onTouchStart={e => { const t = setTimeout(() => onLongPress(), 600); e.currentTarget._longPress = t; }}
          onTouchEnd={e => clearTimeout(e.currentTarget._longPress)}
          whileTap={{ scale:0.97 }}
          style={{
            background: isMe ? "linear-gradient(135deg,#7C3AED,#C084FC)" : "rgba(255,255,255,0.95)",
            borderRadius: isMe ? "18px 18px 4px 18px" : (msg.reply_preview ? "0 18px 18px 18px" : "18px 18px 18px 4px"),
            padding:"10px 14px",
            boxShadow: isMe ? "0 4px 16px rgba(124,58,237,0.35)" : "0 2px 12px rgba(0,0,0,0.08)",
            border: isMe ? "none" : "1px solid rgba(124,58,237,0.08)",
          }}>
          {msg.translation && (
            <div style={{ fontSize:11, color: isMe ? "rgba(255,255,255,0.7)" : "#9CA3AF", marginBottom:4, fontStyle:"italic" }}>🌐 {msg.translation}</div>
          )}
          <span style={{ fontSize:14, color: isMe ? "#fff" : "#1a1a2e", lineHeight:1.5, wordBreak:"break-word" }}>{msg.content}</span>
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:4, marginTop:4 }}>
            <span style={{ fontSize:10, color: isMe ? "rgba(255,255,255,0.65)" : "#9CA3AF" }}>{formatTime(msg.created_date)}</span>
            {isMe && (msg.is_read ? <CheckCheck size={12} color="rgba(255,255,255,0.8)" /> : <Check size={12} color="rgba(255,255,255,0.6)" />)}
          </div>
        </motion.div>
        {/* Reactions */}
        {msg.reactions?.length > 0 && (
          <div style={{ display:"flex", gap:2, marginTop:3, justifyContent: isMe ? "flex-end" : "flex-start" }}>
            {[...new Set(msg.reactions)].map((r, i) => (
              <span key={i} style={{ background:"rgba(255,255,255,0.9)", borderRadius:12, padding:"2px 6px", fontSize:12, boxShadow:"0 1px 4px rgba(0,0,0,0.1)", border:"1px solid rgba(124,58,237,0.1)" }}>{r}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}