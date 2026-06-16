import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const PEOPLE = [
  { id: 1, name: "Luna Ray",    avatar: "🌙", online: true,  level: 42, lastSeen: "Now",       country: "🇶🇦", following: false },
  { id: 2, name: "Rex Storm",   avatar: "⚡", online: true,  level: 38, lastSeen: "Now",       country: "🇸🇦", following: true  },
  { id: 3, name: "Nova Star",   avatar: "⭐", online: false, level: 55, lastSeen: "2h ago",    country: "🇦🇪", following: false },
  { id: 4, name: "Kai Blaze",   avatar: "🔥", online: false, level: 29, lastSeen: "Yesterday", country: "🇪🇬", following: true  },
  { id: 5, name: "Sky Blue",    avatar: "🌊", online: true,  level: 61, lastSeen: "Now",       country: "🇹🇷", following: false },
  { id: 6, name: "Aria Song",   avatar: "🎵", online: false, level: 47, lastSeen: "3h ago",    country: "🇮🇩", following: false },
];

const card = { background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 10 };

export default function SocialMyPeople() {
  const [people, setPeople] = useState(PEOPLE);
  const [following, setFollowing] = useState(PEOPLE.reduce((a, u) => ({ ...a, [u.id]: u.following }), {}));
  const [removing, setRemoving] = useState(null);

  const toggleFollow = (id, name) => {
    setFollowing(f => ({ ...f, [id]: !f[id] }));
    toast.success(following[id] ? `Unfollowed ${name}` : `Following ${name}!`);
  };

  const remove = (id) => {
    setPeople(p => p.filter(u => u.id !== id));
    setRemoving(null);
    toast.success("Removed from My People.");
  };

  const online = people.filter(u => u.online).length;

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total", val: people.length, color: "#1F6BFF" },
          { label: "Online", val: online, color: "#10B981" },
          { label: "Offline", val: people.length - online, color: "#9CA3AF" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, ...card, marginBottom: 0, textAlign: "center", padding: "12px 8px" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {people.map((u, i) => (
        <motion.div key={u.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0F0F8", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #E5E7EB" }}>{u.avatar}</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: u.online ? "#10B981" : "#D1D5DB", border: "2px solid #fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", display: "flex", alignItems: "center", gap: 6 }}>
                {u.name} <span style={{ fontSize: 12 }}>{u.country}</span>
              </div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>Lv.{u.level} · {u.online ? "🟢 Online" : `⚫ ${u.lastSeen}`}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info(`Viewing ${u.name}'s profile`)}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "#F5F7FA", border: "1px solid #E5E7EB", color: "#374151" }}>
              👤 Profile
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info("Opening chat...")}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#1F6BFF,#60A5FA)", border: "none", color: "#fff" }}>
              💬 Message
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toggleFollow(u.id, u.name)}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: following[u.id] ? "#ECFDF5" : "#F0F7FF", border: `1px solid ${following[u.id] ? "#D1FAE5" : "#BFDBFE"}`, color: following[u.id] ? "#10B981" : "#1F6BFF" }}>
              {following[u.id] ? "✓ Following" : "+ Follow"}
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => setRemoving(u.id)}
              style={{ padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", background: "#FEF2F2", border: "1px solid #FEE2E2", color: "#EF4444" }}>
              Remove
            </motion.button>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {removing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setRemoving(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Remove from My People?</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>This person will be removed from your list.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setRemoving(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={() => remove(removing)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#EF4444", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}