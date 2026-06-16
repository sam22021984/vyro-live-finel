import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Archive, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";
import InboxChatRow from "@/components/inbox/InboxChatRow";
import InboxLongPressMenu from "@/components/inbox/InboxLongPressMenu";
import InboxSearch from "@/components/inbox/InboxSearch";
import NotificationCenter from "@/components/inbox/NotificationCenter";

const MOCK_CHATS = [
  { id:"c1", other_user_id:"u1", other_user_name:"★ SARA ★", other_user_avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", other_user_online:true, other_user_vip:"vip3", other_user_country:"🇸🇦", other_user_gender:"female", last_message:"Hey! Are you coming live tonight? 🎤", last_message_time: new Date(Date.now()-3*60000).toISOString(), last_message_type:"text", unread_count:3, is_pinned:true, is_muted:false, is_typing:true },
  { id:"c2", other_user_id:"u2", other_user_name:"KING PRO", other_user_avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", other_user_online:false, other_user_vip:"vip5", other_user_country:"🇦🇪", other_user_gender:"male", last_message:"💎 Sent you a Royal Gift!", last_message_time: new Date(Date.now()-25*60000).toISOString(), last_message_type:"gift", unread_count:1, is_pinned:false, is_muted:false },
  { id:"c3", other_user_id:"u3", other_user_name:"LUNA ✨", other_user_avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", other_user_online:true, other_user_vip:"vip2", other_user_country:"🇹🇷", other_user_gender:"female", last_message:"📞 Missed audio call", last_message_time: new Date(Date.now()-2*3600000).toISOString(), last_message_type:"call", unread_count:0, is_pinned:false, is_muted:true },
  { id:"c4", other_user_id:"u4", other_user_name:"STORM KING", other_user_avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", other_user_online:false, other_user_vip:null, other_user_country:"🇵🇰", other_user_gender:"male", last_message:"Thanks for the gift bro 🙏", last_message_time: new Date(Date.now()-24*3600000).toISOString(), last_message_type:"text", unread_count:0, is_pinned:false, is_muted:false },
  { id:"c5", other_user_id:"u5", other_user_name:"DIANA 👑", other_user_avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80", other_user_online:true, other_user_vip:"vip4", other_user_country:"🇮🇩", other_user_gender:"female", last_message:"Can we do a collab stream? 🔥", last_message_time: new Date(Date.now()-3*24*3600000).toISOString(), last_message_type:"text", unread_count:7, is_pinned:false, is_muted:false },
];

export default function Inbox() {
  const navigate = useNavigate();
  const [chats, setChats] = useState(MOCK_CHATS);
  const [filter, setFilter] = useState("all");
  const [longPressChat, setLongPressChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const totalUnread = chats.reduce((s, c) => s + (c.unread_count || 0), 0);

  const filtered = chats.filter(c => {
    if (filter === "pinned") return c.is_pinned;
    if (filter === "unread") return c.unread_count > 0;
    if (filter === "online") return c.other_user_online;
    return true;
  });

  const handleAction = (chatId, action) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      if (action === "pin") return { ...c, is_pinned: !c.is_pinned };
      if (action === "mute") return { ...c, is_muted: !c.is_muted };
      if (action === "archive") return { ...c, is_archived: true };
      if (action === "read") return { ...c, unread_count: 0 };
      return c;
    }).filter(c => action === "delete" ? c.id !== chatId : true));
    setLongPressChat(null);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#fdfcff 0%,#f5f0ff 40%,#fff8f0 100%)", paddingBottom:100 }}>
      {/* Header */}
      <div style={{ padding:"52px 16px 0", background:"rgba(255,255,255,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(124,58,237,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:"#1a1a2e" }}>
              Messages
              {totalUnread > 0 && (
                <span style={{ marginLeft:8, background:"linear-gradient(135deg,#7C3AED,#EC4899)", color:"#fff", borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:800 }}>{totalUnread}</span>
              )}
            </div>
            <div style={{ fontSize:12, color:"#9CA3AF", fontWeight:600 }}>Private Inbox</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[
            { label:"search",  Ic: Search,   action: () => setShowSearch(true) },
            { label:"bell",    Ic: Bell,     action: () => setShowNotifications(true), badge: 4 },
            { label:"archive", Ic: Archive,  action: () => {} },
            { label:"settings",Ic: Settings, action: () => {} },
          ].map(({ label, Ic, action, badge }) => (
            <motion.button key={label} whileTap={{ scale:0.88 }} onClick={action}
              style={{ position:"relative", width:36, height:36, borderRadius:12, background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.1)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Ic size={16} color="#7C3AED" />
              {badge && <span style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:"linear-gradient(135deg,#EF4444,#F97316)", color:"#fff", fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{badge}</span>}
            </motion.button>
          ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display:"flex", gap:6, paddingBottom:12, overflowX:"auto" }}>
          {["all","pinned","unread","online"].map(f => (
            <motion.button key={f} whileTap={{ scale:0.94 }} onClick={() => setFilter(f)}
              style={{ padding:"5px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:800, whiteSpace:"nowrap",
                background: filter === f ? "linear-gradient(135deg,#7C3AED,#C084FC)" : "rgba(124,58,237,0.06)",
                color: filter === f ? "#fff" : "#7C3AED",
                boxShadow: filter === f ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
              }}>{f === "all" ? "All Chats" : f.charAt(0).toUpperCase()+f.slice(1)}</motion.button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div style={{ padding:"8px 0" }}>
        <AnimatePresence>
          {filtered.map((chat, i) => (
            <InboxChatRow key={chat.id} chat={chat} index={i}
              onClick={() => navigate(`/chat/${chat.id}`, { state: { chat } })}
              onLongPress={() => setLongPressChat(chat)}
              onAction={handleAction}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"#9CA3AF" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
            <div style={{ fontSize:16, fontWeight:700 }}>No conversations yet</div>
          </div>
        )}
      </div>

      {/* Long Press Menu */}
      <AnimatePresence>
        {longPressChat && <InboxLongPressMenu chat={longPressChat} onAction={handleAction} onClose={() => setLongPressChat(null)} />}
      </AnimatePresence>

      {/* Search */}
      <AnimatePresence>
        {showSearch && <InboxSearch chats={chats} onClose={() => setShowSearch(false)} onSelect={chat => { setShowSearch(false); navigate(`/chat/${chat.id}`, { state: { chat } }); }} />}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}