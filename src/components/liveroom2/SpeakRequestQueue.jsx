/**
 * SpeakRequestQueue — host view of waiting users
 * Actions: Accept, Reject, Priority Accept, Block Request
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MOCK_REQUESTS = [
  { id: "r1", name: "Zara", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=zara", vip: "vip2", waitTime: "0:45", level: 32 },
  { id: "r2", name: "Kai",  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=kai",  vip: null,   waitTime: "1:12", level: 18 },
  { id: "r3", name: "Mia",  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=mia",  vip: "vip1", waitTime: "2:05", level: 45 },
];

export default function SpeakRequestQueue({ onClose }) {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const remove = (id) => setRequests(prev => prev.filter(r => r.id !== id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#162420", borderRadius: "22px 22px 0 0", padding: "20px 20px 40px", width: "100%", maxWidth: 480, border: "1px solid rgba(0,194,184,0.15)", maxHeight: "70vh", overflowY: "auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>✋ Speak Requests ({requests.length})</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "30px 0", fontSize: 13 }}>No pending requests</div>
        ) : (
          requests.map((req, i) => (
            <motion.div key={req.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              exit={{ opacity: 0, x: 30 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: req.vip ? "2px solid #FFD700" : "2px solid rgba(0,194,184,0.4)" }}>
                  <img src={req.avatar} alt={req.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                {req.vip && (
                  <div style={{ position: "absolute", top: -4, right: -4, fontSize: 10 }}>👑</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{req.name}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 9, color: "#00C2B8", background: "rgba(0,194,184,0.12)", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>Lv.{req.level}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>⏱ {req.waitTime}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => remove(req.id)}
                  style={{ padding: "5px 10px", borderRadius: 10, background: "linear-gradient(135deg,#00C2B8,#006e6a)", border: "none", color: "#000", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                  Accept
                </button>
                <button onClick={() => remove(req.id)}
                  style={{ padding: "5px 10px", borderRadius: 10, background: "rgba(255,82,82,0.15)", border: "1px solid rgba(255,82,82,0.3)", color: "#FF5252", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                  Reject
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}