import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Phone, MoreVertical, Smile, Gift, Send, Mic, Reply, Copy, Globe, Pin, Trash2, Flag } from "lucide-react";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatGiftPanel from "@/components/chat/ChatGiftPanel";
import ChatEmojiPicker from "@/components/chat/ChatEmojiPicker";
import ChatMoreMenu from "@/components/chat/ChatMoreMenu";
import ChatMessageActions from "@/components/chat/ChatMessageActions";

const MOCK_MESSAGES = [
  { id:"m1", sender_id:"other", content:"Hey! You were amazing in the live room tonight 🔥", type:"text", is_read:true, created_date: new Date(Date.now()-3600000*2).toISOString(), reactions:[] },
  { id:"m2", sender_id:"me",    content:"Thank you so much! Your support means everything 🙏", type:"text", is_read:true, created_date: new Date(Date.now()-3600000*1.9).toISOString(), reactions:["❤️"] },
  { id:"m3", sender_id:"other", content:"", type:"gift", gift_name:"Royal Crown", gift_icon:"👑", gift_coins:50000, is_read:true, created_date: new Date(Date.now()-3600000).toISOString(), reactions:[] },
  { id:"m4", sender_id:"me",    content:"OMG! Thank you for the Royal Crown! 😭✨", type:"text", is_read:true, created_date: new Date(Date.now()-1800000).toISOString(), reactions:[] },
  { id:"m5", sender_id:"other", content:"Can we do an audio call later? 🎤", type:"text", is_read:false, created_date: new Date(Date.now()-300000).toISOString(), reactions:[] },
];

export default function ChatRoom() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { chatId } = useParams();
  const chat = state?.chat || { id: chatId, other_user_name:"User", other_user_avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", other_user_online:true };

  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  // Simulate typing indicator from other user
  useEffect(() => {
    const t = setTimeout(() => setIsTyping(true), 2000);
    const t2 = setTimeout(() => setIsTyping(false), 5000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const sendMessage = (content = text, type = "text", extra = {}) => {
    if (!content.trim() && type === "text") return;
    const msg = { id: `m${Date.now()}`, sender_id:"me", content, type, is_read:false, created_date: new Date().toISOString(), reactions:[], reply_to_id: replyTo?.id, reply_preview: replyTo?.content, ...extra };
    setMessages(prev => [...prev, msg]);
    setText("");
    setReplyTo(null);
    setShowGifts(false);
    setShowEmoji(false);
  };

  const handleMsgAction = (action, msg) => {
    if (action === "reply") setReplyTo(msg);
    if (action === "copy") navigator.clipboard?.writeText(msg.content).catch(()=>{});
    if (action === "delete") setMessages(prev => prev.filter(m => m.id !== msg.id));
    if (action === "react") setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions||[]), "❤️"] } : m));
    setSelectedMsg(null);
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"linear-gradient(160deg,#fdfcff 0%,#f5f0ff 60%,#fff8f0 100%)", overflow:"hidden" }}>

      {/* Header */}
      <div style={{ padding:"48px 16px 12px", background:"rgba(255,255,255,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(124,58,237,0.08)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:36, height:36, borderRadius:12, background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <ArrowLeft size={18} color="#7C3AED" />
          </motion.button>

          <div style={{ position:"relative", flexShrink:0 }}>
            <img src={chat.other_user_avatar} alt="" style={{ width:42, height:42, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(124,58,237,0.3)" }} />
            <div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background: chat.other_user_online ? "#22C55E" : "#9CA3AF", border:"2px solid #fff" }} />
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontWeight:900, fontSize:15, color:"#1a1a2e", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{chat.other_user_name}</span>
              {chat.other_user_vip && <span style={{ fontSize:9, fontWeight:800, color:"#fff", background:"linear-gradient(135deg,#F59E0B,#D97706)", borderRadius:6, padding:"1px 5px" }}>{chat.other_user_vip?.toUpperCase()}</span>}
              <span style={{ fontSize:11 }}>✔️</span>
            </div>
            <div style={{ fontSize:11, fontWeight:600 }}>
              {isTyping ? <span style={{ color:"#7C3AED", fontStyle:"italic" }}>typing...</span> : <span style={{ color: chat.other_user_online ? "#22C55E" : "#9CA3AF" }}>{chat.other_user_online ? "● Active Now" : "● Offline"}</span>}
            </div>
          </div>

          <div style={{ display:"flex", gap:6 }}>
            <motion.button whileTap={{ scale:0.88 }}
              onClick={() => navigate("/call", { state: { chat, outgoing:true } })}
              style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#7C3AED,#C084FC)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Phone size={16} color="#fff" />
            </motion.button>
            <motion.button whileTap={{ scale:0.88 }} onClick={() => setShowMore(true)}
              style={{ width:36, height:36, borderRadius:12, background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <MoreVertical size={16} color="#7C3AED" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 12px 0" }}>
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id} msg={msg} isMe={msg.sender_id==="me"}
            onLongPress={() => setSelectedMsg(msg)} />
        ))}
        {isTyping && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-end" }}>
            <img src={chat.other_user_avatar} alt="" style={{ width:28, height:28, borderRadius:"50%", objectFit:"cover" }} />
            <div style={{ background:"rgba(255,255,255,0.9)", borderRadius:"18px 18px 18px 4px", padding:"10px 14px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ display:"flex", gap:4 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} style={{ width:6, height:6, borderRadius:"50%", background:"#9CA3AF" }}
                    animate={{ y:[0,-5,0] }} transition={{ duration:0.8, repeat:Infinity, delay:i*0.15 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
            style={{ padding:"8px 16px", background:"rgba(124,58,237,0.06)", borderTop:"1px solid rgba(124,58,237,0.1)", display:"flex", alignItems:"center", gap:8 }}>
            <Reply size={14} color="#7C3AED" />
            <span style={{ fontSize:12, color:"#7C3AED", fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>↩ {replyTo.content || "Gift message"}</span>
            <motion.button whileTap={{ scale:0.88 }} onClick={() => setReplyTo(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:14 }}>✕</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div style={{ padding:"8px 12px 28px", background:"rgba(255,255,255,0.95)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(124,58,237,0.08)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => { setShowEmoji(!showEmoji); setShowGifts(false); }}
            style={{ width:36, height:36, borderRadius:12, background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <Smile size={18} color="#7C3AED" />
          </motion.button>
          <div style={{ flex:1, background:"rgba(124,58,237,0.04)", borderRadius:20, padding:"10px 16px", border:"1.5px solid rgba(124,58,237,0.15)", display:"flex", alignItems:"center" }}>
            <input value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key==="Enter" && sendMessage()}
              placeholder="Type a message..." style={{ flex:1, border:"none", background:"transparent", fontSize:14, color:"#1a1a2e", outline:"none" }} />
          </div>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => { setShowGifts(!showGifts); setShowEmoji(false); }}
            style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#F59E0B,#D97706)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <Gift size={18} color="#fff" />
          </motion.button>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => sendMessage()}
            style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#7C3AED,#C084FC)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            <Send size={16} color="#fff" />
          </motion.button>
        </div>
      </div>

      {/* Gift Panel */}
      <AnimatePresence>
        {showGifts && <ChatGiftPanel onSend={(gift) => sendMessage(`🎁 Sent ${gift.name}!`, "gift", { gift_name:gift.name, gift_icon:gift.icon, gift_coins:gift.coins })} onClose={() => setShowGifts(false)} />}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmoji && <ChatEmojiPicker onSelect={(e) => setText(t => t + e)} onClose={() => setShowEmoji(false)} />}
      </AnimatePresence>

      {/* More Menu */}
      <AnimatePresence>
        {showMore && <ChatMoreMenu chat={chat} onClose={() => setShowMore(false)} onNavigate={navigate} />}
      </AnimatePresence>

      {/* Message Actions */}
      <AnimatePresence>
        {selectedMsg && <ChatMessageActions msg={selectedMsg} onAction={handleMsgAction} onClose={() => setSelectedMsg(null)} />}
      </AnimatePresence>
    </div>
  );
}