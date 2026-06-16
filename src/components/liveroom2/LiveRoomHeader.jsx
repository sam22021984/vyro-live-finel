/**
 * LiveRoomHeader — room cover, title, ID, level, XP, online count, timer, menu
 * Flutter: AppBar with custom bottom widget
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MoreVertical, Users, Clock } from "lucide-react";

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
    <div style={{ position: "relative", zIndex: 10 }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px 8px",
        background: "linear-gradient(180deg, rgba(0,194,184,0.12) 0%, transparent 100%)",
      }}>
        {/* Back */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <ChevronLeft size={18} color="#fff" />
        </motion.button>

        {/* Cover + info */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={onSetup}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left",
          }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, overflow: "hidden",
            border: "2px solid #00C2B8",
            boxShadow: "0 0 12px rgba(0,194,184,0.4)",
            flexShrink: 0,
          }}>
            <img src={room.cover} alt="cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 800, color: "#fff",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{room.title}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
              <span style={{
                fontSize: 10, color: "#00C2B8", fontWeight: 700,
                background: "rgba(0,194,184,0.12)", padding: "1px 6px", borderRadius: 6,
              }}>ID: {room.id}</span>
              <span style={{
                fontSize: 10, color: "#FFD700", fontWeight: 700,
                background: "rgba(255,215,0,0.12)", padding: "1px 6px", borderRadius: 6,
              }}>Lv.{room.level}</span>
            </div>
          </div>
        </motion.button>

        {/* Stats */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Users size={12} color="rgba(255,255,255,0.5)" />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
              {room.onlineUsers}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 3,
            background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 10,
          }}>
            <Clock size={11} color="#00C2B8" />
            <span style={{ fontSize: 11, color: "#00C2B8", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
              {timer}
            </span>
          </div>
          {/* Menu */}
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowMenu(v => !v)}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
            <MoreVertical size={15} color="#fff" />
          </motion.button>
        </div>
      </div>

      {/* XP bar */}
      <div style={{ padding: "0 14px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
            Room XP
          </span>
          <span style={{ fontSize: 9, color: "#00C2B8", fontWeight: 700 }}>
            {room.xp.toLocaleString()} / {room.xpNext.toLocaleString()}
          </span>
        </div>
        <div style={{
          height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg,#00C2B8,#00ffee)",
              borderRadius: 2,
              boxShadow: "0 0 8px rgba(0,194,184,0.6)",
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
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              style={{
                position: "absolute", top: 56, right: 14, zIndex: 301,
                background: "#1a1a1a",
                border: "1px solid rgba(0,194,184,0.2)",
                borderRadius: 16,
                overflow: "hidden",
                minWidth: 180,
                boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
              }}>
              {MENU_ITEMS.map((item, i) => (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => setShowMenu(false)}
                  style={{
                    width: "100%", padding: "13px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                    background: "none", border: "none", cursor: "pointer",
                    borderBottom: i < MENU_ITEMS.length - 1
                      ? "1px solid rgba(255,255,255,0.05)" : "none",
                    color: item.danger ? "#FF5252" : "#fff",
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