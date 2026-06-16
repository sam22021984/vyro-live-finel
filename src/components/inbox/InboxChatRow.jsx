import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Pin, VolumeX, Gift, Phone, Check, CheckCheck } from "lucide-react";

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const VIP_COLORS = {
  vip1: "#F59E0B", vip2: "#10B981", vip3: "#3B82F6",
  vip4: "#8B5CF6", vip5: "linear-gradient(135deg,#F59E0B,#EC4899)",
};

export default function InboxChatRow({ chat, index, onClick, onLongPress, onAction }) {
  const [swipeX, setSwipeX] = useState(0);
  const [showSwipeHints, setShowSwipeHints] = useState(false);
  const longPressTimer = useRef(null);

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => onLongPress(), 600);
  };
  const handlePointerUp = () => clearTimeout(longPressTimer.current);

  const lastMsgIcon = chat.last_message_type === "gift" ? "🎁" :
    chat.last_message_type === "call" ? "📞" :
    chat.last_message_type === "sticker" ? "🖼" : null;

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index * 0.04, duration:0.3 }}
      style={{ position:"relative", overflow:"hidden" }}
    >
      {/* Swipe action hints */}
      <div style={{ position:"absolute", inset:0, display:"flex", justifyContent:"space-between", alignItems:"center", pointerEvents:"none" }}>
        <div style={{ display:"flex", gap:4, padding:"0 16px", opacity: swipeX > 30 ? 1 : 0, transition:"opacity 0.2s" }}>
          <span style={{ background:"#22C55E", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:800, color:"#fff" }}>✓ Read</span>
          <span style={{ background:"#EF4444", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:800, color:"#fff" }}>🗑 Delete</span>
        </div>
        <div style={{ display:"flex", gap:4, padding:"0 16px", opacity: swipeX < -30 ? 1 : 0, transition:"opacity 0.2s" }}>
          <span style={{ background:"#7C3AED", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:800, color:"#fff" }}>📌 Pin</span>
          <span style={{ background:"#6B7280", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:800, color:"#fff" }}>🔇 Mute</span>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left:-100, right:100 }}
        onDrag={(e, info) => setSwipeX(info.offset.x)}
        onDragEnd={(e, info) => {
          if (info.offset.x > 60) { onAction(chat.id, "read"); }
          else if (info.offset.x < -60) { onAction(chat.id, "pin"); }
          setSwipeX(0);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={onClick}
        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)", borderBottom:"1px solid rgba(124,58,237,0.05)", cursor:"pointer", position:"relative", zIndex:1 }}
        whileTap={{ backgroundColor:"rgba(124,58,237,0.04)" }}
      >
        {/* Avatar */}
        <div style={{ position:"relative", flexShrink:0 }}>
          {/* VIP Frame */}
          {chat.other_user_vip && (
            <div style={{ position:"absolute", inset:-3, borderRadius:"50%", background: VIP_COLORS[chat.other_user_vip] || "#7C3AED", zIndex:0 }} />
          )}
          <div style={{ position:"absolute", inset:-1, borderRadius:"50%", background:"#fff", zIndex:1 }} />
          <img src={chat.other_user_avatar} alt="" style={{ width:52, height:52, borderRadius:"50%", objectFit:"cover", position:"relative", zIndex:2, display:"block" }} />
          {/* Online dot */}
          <div style={{
            position:"absolute", bottom:2, right:2, zIndex:3,
            width:12, height:12, borderRadius:"50%",
            background: chat.other_user_online ? "#22C55E" : "#9CA3AF",
            border:"2.5px solid #fff",
          }} />
        </div>

        {/* Content */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:3 }}>
            <span style={{ fontWeight:800, fontSize:14, color:"#1a1a2e", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:140 }}>
              {chat.other_user_name}
            </span>
            {chat.other_user_vip && (
              <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:"linear-gradient(135deg,#F59E0B,#D97706)", borderRadius:6, padding:"1px 5px" }}>
                {chat.other_user_vip.toUpperCase()}
              </span>
            )}
            <span style={{ fontSize:11 }}>✔️</span>
            {chat.other_user_country && <span style={{ fontSize:12 }}>{chat.other_user_country}</span>}
            {chat.other_user_gender && <span style={{ fontSize:9, background: chat.other_user_gender==="female" ? "#EC4899" : "#3B82F6", color:"#fff", borderRadius:6, padding:"1px 4px", fontWeight:800 }}>{chat.other_user_gender==="female"?"♀":"♂"}</span>}
            {chat.is_pinned && <Pin size={10} color="#7C3AED" />}
            {chat.is_muted && <VolumeX size={10} color="#9CA3AF" />}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {chat.is_typing ? (
              <span style={{ fontSize:12, color:"#7C3AED", fontWeight:700, fontStyle:"italic" }}>typing...</span>
            ) : (
              <span style={{ fontSize:12, color:"#6B7280", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                {lastMsgIcon && <span style={{ marginRight:3 }}>{lastMsgIcon}</span>}
                {chat.last_message}
              </span>
            )}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
          <span style={{ fontSize:10, color:"#9CA3AF", fontWeight:600 }}>{timeAgo(chat.last_message_time)}</span>
          {chat.unread_count > 0 ? (
            <span style={{ background:"linear-gradient(135deg,#7C3AED,#EC4899)", color:"#fff", borderRadius:20, padding:"2px 7px", fontSize:10, fontWeight:900, minWidth:20, textAlign:"center" }}>
              {chat.unread_count > 99 ? "99+" : chat.unread_count}
            </span>
          ) : (
            <CheckCheck size={14} color="#7C3AED" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}