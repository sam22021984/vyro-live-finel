/**
 * LiveRoomHeader — matches reference: avatar left, name+ID, online count, timer, menu
 * Flutter: SliverAppBar / custom AppBar widget
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MoreVertical, Users } from "lucide-react";

const MENU_ITEMS = [
  { icon: "ℹ️", label: "Room Info" },
  { icon: "📋", label: "Room Rules" },
  { icon: "🔗", label: "Share Room" },
  { icon: "🚩", label: "Report Room" },
  { icon: "📊", label: "Statistics" },
  { icon: "🚪", label: "Exit Room", danger: true },
];

export default function LiveRoomHeader({ room, timer, onBack, onSetup }) {
  const [showMenu, setShowMenu] = useState(false);
  const xpPct = Math.min((room.xp / room.xpNext) * 100, 100);

  return (
    <div style={{ position: "relative", zIndex: 10, background: "#0D2B28" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px 6px",
      }}>
        {/* Back */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
          <ChevronLeft size={18} color="#fff" />
        </motion.button>

        {/* Avatar + info */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={onSetup}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left",
            minWidth: 0,
          }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", overflow: "hidden",
            border: "2px solid #00C2B8",
            boxShadow: "0 0 10px rgba(0,194,184,0.45)",
            flexShrink: 0,
          }}>
            <img src={room.cover} alt="host"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 800, color: "#fff",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{room.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
                ID: {room.id}
              </span>
              <span style={{
                fontSize: 9, color: "#00C2B8", fontWeight: 800,
                background: "rgba(0,194,184,0.14)", padding: "1px 5px", borderRadius: 5,
              }}>Lv.{room.level}</span>
            </div>
          </div>
        </motion.button>

        {/* Right: online + timer + menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Users size={11} color="rgba(255,255,255,0.45)" />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 700 }}>
              {room.onlineUsers}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            background: "rgba(0,194,184,0.1)", padding: "3px 8px", borderRadius: 10,
            border: "1px solid rgba(0,194,184,0.2)",
          }}>
            <span style={{ fontSize: 10, color: "#00C2B8", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {timer}
            </span>
          </div>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowMenu(v => !v)}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
            <MoreVertical size={14} color="rgba(255,255,255,0.8)" />
          </motion.button>
        </div>
      </div>

      {/* XP progress bar */}
      <div style={{ padding: "0 12px 8px" }}>
        <div style={{
          height: 3, borderRadius: 2,
          background: "rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg,#00C2B8,#00ffee)",
              borderRadius: 2,
              boxShadow: "0 0 6px rgba(0,194,184,0.7)",
            }}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div onClick={() => setShowMenu(false)}
              style={{ position: "fixed", inset: 0, zIndex: 300 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{ duration: 0.16 }}
              style={{
                position: "absolute", top: 52, right: 12, zIndex: 301,
                background: "#162420",
                border: "1px solid rgba(0,194,184,0.22)",
                borderRadius: 14,
                overflow: "hidden",
                minWidth: 170,
                boxShadow: "0 12px 36px rgba(0,0,0,0.7)",
              }}>
              {MENU_ITEMS.map((item, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowMenu(false)}
                  style={{
                    width: "100%", padding: "12px 14px",
                    display: "flex", alignItems: "center", gap: 9,
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: i < MENU_ITEMS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)" : "none",
                    color: item.danger ? "#FF5252" : "#e0f7f5",
                    fontSize: 13, fontWeight: 600, textAlign: "left",
                  }}>
                  <span>{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}