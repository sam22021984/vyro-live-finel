/**
 * SeatProfileCard — Tap an occupied seat to see user profile + actions
 * Shows: avatar, name, ID, level, VIP, follow, gift, message, share
 */
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Gift, MessageCircle, Share2, Flag, Eye } from "lucide-react";

const VIP_LABELS = { vip1: "VIP 1", vip2: "VIP 2", vip3: "VIP 3", vip4: "VIP 4", vip5: "VIP 5" };
const VIP_COLORS = { vip1: "#CD7F32", vip2: "#A8A8A8", vip3: "#FFD700", vip4: "#00C2B8", vip5: "#C084FC" };

export default function SeatProfileCard({ seat, onClose, onAdminAction }) {
  if (!seat?.user) return null;
  const u = seat.user;
  const vipColor = u.vip ? VIP_COLORS[u.vip] : null;

  const ACTIONS = [
    { id: "visit",   icon: <Eye size={18} />,           label: "Profile",  color: "#00C2B8" },
    { id: "gift",    icon: <Gift size={18} />,           label: "Gift",     color: "#FFD700" },
    { id: "follow",  icon: <UserPlus size={18} />,       label: "Follow",   color: "#C084FC" },
    { id: "message", icon: <MessageCircle size={18} />,  label: "Message",  color: "#3B82F6" },
    { id: "share",   icon: <Share2 size={18} />,         label: "Share",    color: "#10B981" },
    { id: "report",  icon: <Flag size={18} />,           label: "Report",   color: "#EF4444" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "flex-end", justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 480,
            background: "linear-gradient(180deg, #0f2a27 0%, #0a1f1d 100%)",
            borderRadius: "24px 24px 0 0",
            border: "1px solid rgba(0,194,184,0.2)",
            padding: "0 0 32px",
            overflow: "hidden",
          }}
        >
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
          </div>

          {/* Close */}
          <div style={{ position: "absolute", top: 16, right: 16 }}>
            <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={14} color="rgba(255,255,255,0.6)" />
            </motion.button>
          </div>

          {/* Profile header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 20px 16px" }}>
            {/* Avatar */}
            <div style={{ position: "relative", marginBottom: 10 }}>
              {vipColor && (
                <div style={{
                  position: "absolute", inset: -3, borderRadius: "50%",
                  border: `2.5px solid ${vipColor}`,
                  boxShadow: `0 0 14px ${vipColor}88`,
                }} />
              )}
              <div style={{
                width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                border: "2px solid rgba(0,194,184,0.6)",
                background: "#1a3532",
              }}>
                <img src={u.avatar} alt={u.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {seat.isHost && (
                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", fontSize: 14 }}>👑</div>
              )}
              <div style={{
                position: "absolute", bottom: 2, right: 2,
                width: 12, height: 12, borderRadius: "50%",
                background: "#22C55E", border: "2px solid #0a1f1d",
              }} />
            </div>

            {/* Name */}
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{u.name}</div>

            {/* Badges row */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 8 }}>
              {u.vip && (
                <span style={{
                  background: `linear-gradient(135deg, ${vipColor}33, ${vipColor}22)`,
                  border: `1px solid ${vipColor}66`,
                  color: vipColor, borderRadius: 20, padding: "2px 10px",
                  fontSize: 10, fontWeight: 800,
                }}>👑 {VIP_LABELS[u.vip]}</span>
              )}
              <span style={{
                background: "linear-gradient(135deg,#00C2B833,#00C2B811)",
                border: "1px solid rgba(0,194,184,0.4)",
                color: "#00C2B8", borderRadius: 20, padding: "2px 10px",
                fontSize: 10, fontWeight: 800,
              }}>Lv.{u.level}</span>
              <span style={{
                background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                color: "#22C55E", borderRadius: 20, padding: "2px 10px",
                fontSize: 10, fontWeight: 800,
              }}>● Online</span>
              {u.country && <span style={{ fontSize: 16 }}>{u.country}</span>}
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex", gap: 0,
              background: "rgba(255,255,255,0.04)", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.07)",
              width: "100%", overflow: "hidden", marginBottom: 0,
            }}>
              {[
                { label: "Followers", val: "12.4K" },
                { label: "Following", val: "384" },
                { label: "Friends", val: "120" },
              ].map((s, i, arr) => (
                <div key={s.label} style={{
                  flex: 1, padding: "10px 4px", textAlign: "center",
                  borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#00C2B8" }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8, padding: "0 16px 8px",
          }}>
            {ACTIONS.map(a => (
              <motion.button key={a.id} whileTap={{ scale: 0.9 }}
                onClick={() => onClose()}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  padding: "12px 8px", borderRadius: 14, cursor: "pointer",
                  background: `${a.color}15`,
                  border: `1px solid ${a.color}33`,
                }}>
                <div style={{ color: a.color }}>{a.icon}</div>
                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.7)" }}>{a.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Admin panel */}
          {onAdminAction && (
            <div style={{ padding: "8px 16px 0" }}>
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 14, padding: "12px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#EF4444", marginBottom: 10, letterSpacing: "0.06em" }}>
                  🛡️ ADMIN CONTROLS
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[
                    { id: "mute", label: "Mute", color: "#F59E0B" },
                    { id: "kick_seat", label: "Kick Seat", color: "#EF4444" },
                    { id: "lock_seat", label: "Lock Seat", color: "#9CA3AF" },
                    { id: "kick_room", label: "Kick Room", color: "#EF4444" },
                    { id: "ban_24h", label: "Ban 24h", color: "#DC2626" },
                    { id: "ban_perm", label: "Perm Ban", color: "#7F1D1D" },
                    { id: "mod", label: "Make Mod", color: "#10B981" },
                  ].map(a => (
                    <motion.button key={a.id} whileTap={{ scale: 0.9 }}
                      onClick={() => { onAdminAction(a.id, seat); onClose(); }}
                      style={{
                        padding: "5px 10px", borderRadius: 20, cursor: "pointer",
                        background: `${a.color}18`, border: `1px solid ${a.color}44`,
                        color: a.color, fontSize: 10, fontWeight: 800,
                      }}>{a.label}</motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}