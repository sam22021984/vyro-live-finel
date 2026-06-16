/**
 * CommunityGroups — public/admin/support group list + group chat
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Users, Shield, Headphones } from "lucide-react";

const AVATAR = (seed) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

const MOCK_GROUPS = [
  { id: "g1", name: "VYRO Official", description: "Official announcements & updates", type: "admin", member_count: 12840, icon: "🏆", last_message: "New feature drop! Check it out →", last_activity: new Date(Date.now() - 1000*60*5).toISOString() },
  { id: "g2", name: "Music Lovers 🎵", description: "For everyone who loves music streams", type: "public", member_count: 4320, icon: "🎵", last_message: "Who's going live tonight?", last_activity: new Date(Date.now() - 1000*60*30).toISOString() },
  { id: "g3", name: "Support Center", description: "Get help from our support team", type: "support", member_count: 890, icon: "🛟", last_message: "Your ticket #4821 has been resolved.", last_activity: new Date(Date.now() - 1000*60*60).toISOString() },
  { id: "g4", name: "Top Hosts Club", description: "Community for top-ranked hosts", type: "public", member_count: 1250, icon: "👑", last_message: "Congrats to @Luna for reaching Level 100!", last_activity: new Date(Date.now() - 1000*60*90).toISOString() },
  { id: "g5", name: "New Members 👋", description: "Welcome new users to VYRO", type: "public", member_count: 6780, icon: "🌟", last_message: "Welcome everyone! Feel free to introduce yourself 😊", last_activity: new Date(Date.now() - 1000*60*120).toISOString() },
];

const MOCK_MESSAGES = {
  g1: [
    { id: "m1", user_name: "VYRO Admin", user_avatar: AVATAR("admin"), message: "🎉 New feature: Community Feed is now live!", type: "text", created_date: new Date(Date.now()-1000*60*10).toISOString(), reactions: ["🔥","🔥","❤️"] },
    { id: "m2", user_name: "Luna ✨", user_avatar: AVATAR("luna"), message: "This is so awesome!! 🙌", type: "text", created_date: new Date(Date.now()-1000*60*8).toISOString(), reactions: [] },
  ],
  g2: [
    { id: "m1", user_name: "Rex 🎵", user_avatar: AVATAR("rex"), message: "Anyone doing a late night music stream? 🎶", type: "text", created_date: new Date(Date.now()-1000*60*20).toISOString(), reactions: ["❤️"] },
    { id: "m2", user_name: "Nova 🌺", user_avatar: AVATAR("nova"), message: "I'll be live at 10pm! 🎤", type: "text", created_date: new Date(Date.now()-1000*60*15).toISOString(), reactions: [] },
  ],
};

const TYPE_META = {
  admin: { icon: Shield, color: "#FFD700", label: "Official" },
  support: { icon: Headphones, color: "#00C2B8", label: "Support" },
  public: { icon: Users, color: "#9333EA", label: "Public" },
};

function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  return `${Math.floor(m/60)}h`;
}

function GroupChat({ group, onClose, currentUser }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES[group.id] || []);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      user_name: currentUser?.full_name || "You",
      user_avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.id || "me"}`,
      message: input.trim(), type: "text",
      created_date: new Date().toISOString(), reactions: [],
    }]);
    setInput("");
  };

  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 26, stiffness: 280 }}
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        background: "#0D0D1A", display: "flex", flexDirection: "column",
      }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexShrink: 0,
      }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <X size={20} color="rgba(255,255,255,0.7)" />
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(147,51,234,0.2)", border: "1.5px solid rgba(147,51,234,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>{group.icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{group.name}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{group.member_count.toLocaleString()} members</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <img src={m.user_avatar} alt={m.user_name}
              style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(147,51,234,0.3)", flexShrink: 0 }} />
            <div>
              <div style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#9333EA", marginBottom: 3 }}>{m.user_name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{m.message}</div>
              </div>
              {m.reactions?.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                  {[...new Set(m.reactions)].map(r => (
                    <span key={r} style={{
                      fontSize: 11, background: "rgba(255,255,255,0.07)",
                      borderRadius: 20, padding: "2px 7px",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}>{r} {m.reactions.filter(x => x === r).length}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 14px 20px",
        borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)",
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Message..."
          style={{
            flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
          }} />
        <motion.button whileTap={{ scale: 0.86 }} onClick={send}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg,#9333EA,#3B82F6)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <Send size={15} color="#fff" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CommunityGroups({ currentUser }) {
  const [activeGroup, setActiveGroup] = useState(null);

  return (
    <div style={{ paddingBottom: 80 }}>
      {MOCK_GROUPS.map((group, i) => {
        const meta = TYPE_META[group.type];
        const MetaIcon = meta.icon;
        return (
          <motion.div key={group.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveGroup(group)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", marginBottom: 8, borderRadius: 16, cursor: "pointer",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: `rgba(${meta.color === "#FFD700" ? "255,215,0" : meta.color === "#00C2B8" ? "0,194,184" : "147,51,234"},0.15)`,
              border: `1.5px solid ${meta.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>{group.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{group.name}</span>
                <div style={{
                  display: "flex", alignItems: "center", gap: 3,
                  background: `${meta.color}22`, borderRadius: 8, padding: "1px 6px",
                }}>
                  <MetaIcon size={9} color={meta.color} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {group.last_message}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{timeAgo(group.last_activity)}</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{group.member_count.toLocaleString()}</span>
            </div>
          </motion.div>
        );
      })}
      <AnimatePresence>
        {activeGroup && (
          <GroupChat group={activeGroup} onClose={() => setActiveGroup(null)} currentUser={currentUser} />
        )}
      </AnimatePresence>
    </div>
  );
}