/**
 * VYRO LIVE ROOM V2 — Enterprise Audio Live Room
 * Matches reference design: dark teal bg, 5-col seat grid, inline chat, compact bottom bar
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LiveRoomHeader from "@/components/liveroom2/LiveRoomHeader";
import SeatGrid from "@/components/liveroom2/SeatGrid";
import ChatPanel2 from "@/components/liveroom2/ChatPanel2";
import GiftPanel2 from "@/components/liveroom2/GiftPanel2";
import ToolsPanel from "@/components/liveroom2/ToolsPanel";
import PKBattle from "@/components/liveroom2/PKBattle";
import SpeakRequestQueue from "@/components/liveroom2/SpeakRequestQueue";
import RoomSetupSheet from "@/components/liveroom2/RoomSetupSheet";
import { Gift, Wrench } from "lucide-react";

const MOCK_ROOM = {
  id: "ROOM-4821",
  title: "Sajid Alam",
  cover: "https://api.dicebear.com/7.x/adventurer/svg?seed=sam",
  level: 7,
  xp: 6800,
  xpNext: 10000,
  onlineUsers: 384,
  announcement: "⚠️ Warning: Pornography, vulgarity, violence, minors and other related situations are strictly prohibited during the live broadcast. The AI system will check 24 hours a day, and any violations will be severely punished!",
  hostId: "u1",
  layout: 15,
};

function buildSeats(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    state: i === 0 ? "occupied"
      : i === 1 ? "active"
      : i === 2 ? "muted"
      : i === 4 ? "locked"
      : i === 7 ? "occupied"
      : "empty",
    user: (i === 0 || i === 1 || i === 2 || i === 7) ? {
      id: `u${i}`,
      name: ["SAM", "Luna", "Rex", "Nova"][i === 7 ? 3 : i],
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=seat${i}`,
      level: 20 + i * 3,
      vip: i === 0 ? "vip3" : i === 1 ? "vip2" : null,
      country: ["🇺🇸", "🇬🇧", "🇯🇵", "🇧🇷"][i % 4],
    } : null,
    isHost: i === 0,
  }));
}

export default function LiveRoomV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const liveRoom = location.state?.room;

  // Merge real room data from GoLive with defaults
  const roomData = {
    id: liveRoom?.id || "ROOM-4821",
    title: liveRoom?.title || "Sajid Alam",
    cover: liveRoom?.cover_image_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=sam",
    level: 7,
    xp: 6800,
    xpNext: 10000,
    onlineUsers: liveRoom?.current_listeners || 0,
    announcement: liveRoom?.welcome_message || MOCK_ROOM.announcement,
    hostId: liveRoom?.host_id || "u1",
    layout: 15,
  };

  const [layout, setLayout] = useState(15);
  const [seats] = useState(() => buildSeats(25));
  const [activePanel, setActivePanel] = useState(null);
  const [showPK, setShowPK] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [roomTimer, setRoomTimer] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoomTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
      : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  return (
    <div style={{
      height: "100dvh",
      background: "#0D2B28",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Header */}
      <LiveRoomHeader
        room={roomData}
        timer={formatTimer(roomTimer)}
        onBack={() => navigate("/")}
        onSetup={() => setShowSetup(true)}
      />

      {/* PK Battle */}
      <AnimatePresence>
        {showPK && <PKBattle onClose={() => setShowPK(false)} />}
      </AnimatePresence>

      {/* Seat Grid — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px 0" }}>
        <SeatGrid
          seats={seats.slice(0, layout)}
          layout={layout}
          onSeatTap={(seat) => seat.state === "empty" && setMyHandRaised(true)}
        />

        {/* Inline announcement warning */}
        <div style={{
          margin: "8px 0 4px",
          background: "rgba(0,0,0,0.35)",
          borderRadius: 10,
          padding: "8px 10px",
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, flex: 1 }}>
            {roomData.announcement}
          </span>
        </div>

        {/* Inline chat messages */}
        <div style={{ paddingBottom: 8 }}>
          <ChatPanel2 compact />
        </div>
      </div>

      {/* Request to Speak / Lock row */}
      <div style={{
        display: "flex", gap: 8, padding: "6px 12px 4px",
      }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMyHandRaised(v => !v)}
          style={{
            padding: "6px 16px", borderRadius: 20,
            background: myHandRaised ? "rgba(0,194,184,0.25)" : "rgba(0,0,0,0.4)",
            border: "1px solid rgba(0,194,184,0.5)",
            color: "#00C2B8",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
          ✋ {myHandRaised ? "Cancel Request" : "Request to Speak"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          style={{
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
          🔒 Lock
        </motion.button>
      </div>

      {/* Bottom Action Bar — matches reference: All·Message·Gift pill + Gift icon + Tools icon */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: "8px 12px 12px",
        gap: 8,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Chat tabs pill */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
          style={{
            flex: 1, height: 36, borderRadius: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center",
            padding: "0 12px",
            cursor: "pointer",
            gap: 6,
          }}>
          {["All", "Message", "Gift"].map((label, i) => (
            <span key={label} style={{
              fontSize: 11, fontWeight: 700,
              color: i === 0 ? "#00C2B8" : "rgba(255,255,255,0.45)",
            }}>{label}{i < 2 ? " ·" : ""}</span>
          ))}
        </motion.div>

        {/* Gift */}
        <motion.button whileTap={{ scale: 0.88 }}
          onClick={() => setActivePanel(activePanel === "gift" ? null : "gift")}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: activePanel === "gift"
              ? "linear-gradient(135deg,#FFD700,#FFA500)"
              : "rgba(255,215,0,0.12)",
            border: "1px solid rgba(255,215,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <Gift size={17} color="#FFD700" />
        </motion.button>

        {/* Tools */}
        <motion.button whileTap={{ scale: 0.88 }}
          onClick={() => setActivePanel(activePanel === "tools" ? null : "tools")}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: activePanel === "tools"
              ? "linear-gradient(135deg,#00C2B8,#006e6a)"
              : "rgba(0,194,184,0.12)",
            border: "1px solid rgba(0,194,184,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <Wrench size={17} color="#00C2B8" />
        </motion.button>
      </div>

      {/* Slide-up Panels */}
      <AnimatePresence>
        {activePanel && (
          <div onClick={() => setActivePanel(null)}
            style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.4)" }} />
        )}
        {activePanel === "chat" && (
          <motion.div key="chat-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              height: "68vh",
              background: "#111",
              borderRadius: "22px 22px 0 0",
              border: "1px solid rgba(0,194,184,0.18)",
              overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px", flexShrink: 0 }}>
              <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
            </div>
            <ChatPanel2 onClose={() => setActivePanel(null)} />
          </motion.div>
        )}
        {activePanel === "gift" && (
          <motion.div key="gift-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              height: "58vh",
              background: "#111",
              borderRadius: "22px 22px 0 0",
              border: "1px solid rgba(255,215,0,0.18)",
              overflow: "hidden",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px" }}>
              <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
            </div>
            <GiftPanel2 onClose={() => setActivePanel(null)} />
          </motion.div>
        )}
        {activePanel === "tools" && (
          <motion.div key="tools-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              height: "72vh",
              background: "#111",
              borderRadius: "22px 22px 0 0",
              border: "1px solid rgba(0,194,184,0.18)",
              overflow: "hidden",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px" }}>
              <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
            </div>
            <ToolsPanel onClose={() => setActivePanel(null)} onPK={() => { setShowPK(true); setActivePanel(null); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speak Requests */}
      <AnimatePresence>
        {showRequests && <SpeakRequestQueue onClose={() => setShowRequests(false)} />}
      </AnimatePresence>

      {/* Room Setup */}
      <AnimatePresence>
        {showSetup && <RoomSetupSheet onClose={() => setShowSetup(false)} />}
      </AnimatePresence>
    </div>
  );
}