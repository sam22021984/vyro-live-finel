/**
 * SpeakRequestQueue — host view of pending speak requests
 * Flutter: ListView with SwipeToDismiss + actions
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, XCircle } from "lucide-react";

const MOCK_REQUESTS = [
  { id: 1, name: "Alex K.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alex", vip: "vip2", position: 1 },
  { id: 2, name: "Mia S.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=mia", vip: null, position: 2 },
  { id: 3, name: "Tom W.", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=tom", vip: "vip1", position: 3 },
];

export default function SpeakRequestQueue({ onClose }) {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const accept = (id) => setRequests(r => r.filter(x => x.id !== id));
  const reject = (id) => setRequests(r => r.filter(x => x.id !== id));

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.5)" }} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28 }}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401,
          background: "#1a1a1a",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(0,194,184,0.2)",
          padding: "16px 16px 32px",
          maxHeight: "60vh",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
            ✋ Speak Requests ({requests.length})
          </span>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <X size={13} color="rgba(255,255,255,0.6)" />
          </motion.button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence>
            {requests.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                No pending requests
              </div>
            )}
            {requests.map(req => (
              <motion.div key={req.id}
                exit={{ opacity: 0, x: 100 }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "10px 14px",
                }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#00C2B8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 900, color: "#000", flexShrink: 0,
                }}>{req.position}</div>
                <img src={req.avatar} alt={req.name}
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{req.name}</div>
                  {req.vip && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "#FFD700",
                      background: "rgba(255,215,0,0.12)", padding: "1px 6px", borderRadius: 5,
                    }}>{req.vip.toUpperCase()}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => accept(req.id)}
                    style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "rgba(0,194,184,0.15)",
                      border: "1px solid rgba(0,194,184,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}>
                    <Check size={15} color="#00C2B8" />
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.88 }} onClick={() => reject(req.id)}
                    style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: "rgba(255,82,82,0.12)",
                      border: "1px solid rgba(255,82,82,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}>
                    <XCircle size={15} color="#FF5252" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}