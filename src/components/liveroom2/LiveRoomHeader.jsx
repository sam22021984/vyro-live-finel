/**
 * LiveRoomHeader — Full spec:
 * Back → exit confirm, Avatar → room info sheet, Online count → users list,
 * Bell → notifications panel, More → 6-item menu
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MoreVertical, Users, Bell, X, Info } from "lucide-react";

const MENU_ITEMS = [
  { icon: "ℹ️", label: "Room Info",       key: "info" },
  { icon: "📋", label: "Room Rules",      key: "rules" },
  { icon: "🔗", label: "Share Room",      key: "share" },
  { icon: "🚩", label: "Report Room",     key: "report" },
  { icon: "📊", label: "Room Statistics", key: "stats" },
  { icon: "🚪", label: "Exit Room",       key: "exit", danger: true },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "gift",   text: "Luna sent 🚀 Rocket (500 coins)", time: "2m" },
  { id: 2, type: "seat",   text: "Jay requested a seat", time: "3m" },
  { id: 3, type: "system", text: "Room reached Top 50 🎉", time: "5m" },
  { id: 4, type: "pk",     text: "PK invitation from Room #2234", time: "8m" },
];

function ExitConfirm({ onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onCancel}>
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#162420", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480, border: "1px solid rgba(0,194,184,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🚪</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>Leave Room?</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>Are you sure you want to exit this live room?</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: 13, borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 800, fontSize: 13, color: "#fff", cursor: "pointer" }}>
            Stay In Room
          </button>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: 13, borderRadius: 14, background: "linear-gradient(135deg,#FF5252,#b91c1c)", border: "none", fontWeight: 900, fontSize: 13, color: "#fff", cursor: "pointer" }}>
            Leave Room
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RoomInfoSheet({ room, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#162420", borderRadius: "22px 22px 0 0", padding: "20px 20px 40px", width: "100%", maxWidth: 480, border: "1px solid rgba(0,194,184,0.15)", maxHeight: "70vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>🏠 Room Information</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
        {/* Cover */}
        <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 14, height: 120 }}>
          <img src={room.cover} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {[
          { label: "Room Name", value: room.title },
          { label: "Room ID",   value: room.id },
          { label: "Room Level",value: `Lv.${room.level}` },
          { label: "Online",    value: `${room.onlineUsers} users` },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.label}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{r.value}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function NotificationsPanel({ onClose }) {
  const typeColor = { gift: "#FFD700", seat: "#00C2B8", system: "#60A5FA", pk: "#EC4899" };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
        transition={{ type: "spring", damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#162420", borderRadius: "22px 22px 0 0", padding: "20px 20px 36px", width: "100%", maxWidth: 480, border: "1px solid rgba(0,194,184,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>🔔 Notifications</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
        {MOCK_NOTIFICATIONS.map(n => (
          <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor[n.type] || "#fff", flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{n.text}</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{n.time}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function LiveRoomHeader({ room, timer, onNavigateBack }) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const xpPct = Math.min((room.xp / room.xpNext) * 100, 100);

  const handleMenu = (key) => {
    setShowMenu(false);
    if (key === "exit") setShowExitConfirm(true);
    if (key === "info") setShowRoomInfo(true);
  };

  return (
    <div style={{ position: "relative", zIndex: 10, background: "#0D2B28" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 6px" }}>

        {/* Back → exit confirm */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowExitConfirm(true)}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}>
          <ChevronLeft size={18} color="#fff" />
        </motion.button>

        {/* Avatar + Room name + ID + Level → room info */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowRoomInfo(true)}
          style={{ display: "flex", alignItems: "center", gap: 9, flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", minWidth: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "2px solid #00C2B8", boxShadow: "0 0 10px rgba(0,194,184,0.45)", flexShrink: 0 }}>
            <img src={room.cover} alt="host" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>ID: {room.id}</span>
              <span style={{ fontSize: 9, color: "#00C2B8", fontWeight: 800, background: "rgba(0,194,184,0.14)", padding: "1px 5px", borderRadius: 5 }}>Lv.{room.level}</span>
            </div>
          </div>
        </motion.button>

        {/* Online count → tappable */}
        <motion.button whileTap={{ scale: 0.9 }}
          style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(0,194,184,0.1)", padding: "5px 8px", borderRadius: 10, border: "1px solid rgba(0,194,184,0.2)", cursor: "pointer" }}>
          <Users size={11} color="#00C2B8" />
          <span style={{ fontSize: 11, color: "#00C2B8", fontWeight: 700 }}>{room.onlineUsers}</span>
        </motion.button>

        {/* Timer */}
        <div style={{ background: "rgba(0,194,184,0.08)", padding: "3px 8px", borderRadius: 10, border: "1px solid rgba(0,194,184,0.15)" }}>
          <span style={{ fontSize: 10, color: "#00C2B8", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{timer}</span>
        </div>

        {/* Notification bell */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowNotifications(true)}
          style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={14} color="rgba(255,255,255,0.8)" />
          <div style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "#FF5252", border: "1.5px solid #0D2B28" }} />
        </motion.button>

        {/* More menu */}
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowMenu(v => !v)}
          style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <MoreVertical size={14} color="rgba(255,255,255,0.8)" />
        </motion.button>
      </div>

      {/* XP bar */}
      <div style={{ padding: "0 12px 8px" }}>
        <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ height: "100%", background: "linear-gradient(90deg,#00C2B8,#00ffee)", borderRadius: 2, boxShadow: "0 0 6px rgba(0,194,184,0.7)" }} />
        </div>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 300 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{ duration: 0.16 }}
              style={{ position: "absolute", top: 54, right: 12, zIndex: 301, background: "#162420", border: "1px solid rgba(0,194,184,0.22)", borderRadius: 14, overflow: "hidden", minWidth: 175, boxShadow: "0 12px 36px rgba(0,0,0,0.7)" }}>
              {MENU_ITEMS.map((item, i) => (
                <motion.button key={item.key} whileTap={{ scale: 0.97 }}
                  onClick={() => handleMenu(item.key)}
                  style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", color: item.danger ? "#FF5252" : "#e0f7f5", fontSize: 13, fontWeight: 600, textAlign: "left" }}>
                  <span>{item.icon}</span>{item.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sheets */}
      <AnimatePresence>
        {showExitConfirm && (
          <ExitConfirm
            onConfirm={() => { setShowExitConfirm(false); onNavigateBack?.(); }}
            onCancel={() => setShowExitConfirm(false)}
          />
        )}
        {showRoomInfo && <RoomInfoSheet room={room} onClose={() => setShowRoomInfo(false)} />}
        {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
      </AnimatePresence>
    </div>
  );
}