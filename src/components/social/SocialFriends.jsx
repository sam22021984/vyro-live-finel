import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const FRIENDS = [
  { id: 1, name: "Luna Ray",   avatar: "🌙", online: true,  since: "Jun 2026", mutual: 12, lastActive: "Now"    },
  { id: 2, name: "Rex Storm",  avatar: "⚡", online: true,  since: "May 2026", mutual: 7,  lastActive: "Now"    },
  { id: 3, name: "Sky Blue",   avatar: "🌊", online: false, since: "Apr 2026", mutual: 15, lastActive: "1h ago" },
  { id: 4, name: "Nova Star",  avatar: "⭐", online: false, since: "Mar 2026", mutual: 4,  lastActive: "3h ago" },
];

const card = { background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 10 };

export default function SocialFriends() {
  const [friends, setFriends] = useState(FRIENDS);
  const [confirming, setConfirming] = useState(null);

  const unfriend = (id) => { setFriends(f => f.filter(u => u.id !== id)); setConfirming(null); toast.success("Unfriended."); };

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700, marginBottom: 12, display: "flex", gap: 16 }}>
        <span>{friends.length} FRIENDS</span>
        <span style={{ color: "#10B981" }}>{friends.filter(u => u.online).length} ONLINE</span>
      </div>

      {friends.map((u, i) => (
        <motion.div key={u.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0F0F8", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #E5E7EB" }}>{u.avatar}</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: u.online ? "#10B981" : "#D1D5DB", border: "2px solid #fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{u.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
                {u.mutual} mutual friends · Since {u.since}
              </div>
              <div style={{ fontSize: 10, color: u.online ? "#10B981" : "#9CA3AF" }}>
                {u.online ? "🟢 Online now" : `⚫ ${u.lastActive}`}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info("Opening friend chat...")}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#1F6BFF,#60A5FA)", border: "none", color: "#fff" }}>
              💬 Chat
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info("Opening gift panel...")}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "#FFF7ED", border: "1px solid #FED7AA", color: "#F59E0B" }}>
              🎁 Gift
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info(`Viewing ${u.name}'s profile`)}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "#F5F7FA", border: "1px solid #E5E7EB", color: "#374151" }}>
              👤 Profile
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => setConfirming(u.id)}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "#FEF2F2", border: "1px solid #FEE2E2", color: "#EF4444" }}>
              Unfriend
            </motion.button>
          </div>
        </motion.div>
      ))}

      {friends.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🤝</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>No friends yet</div>
        </div>
      )}

      <AnimatePresence>
        {confirming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirming(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Unfriend this person?</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>You'll no longer be friends, but can still follow each other.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirming(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={() => unfriend(confirming)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#EF4444", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Unfriend</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}