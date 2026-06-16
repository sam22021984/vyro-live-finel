/**
 * VYRO LIVE ROOM V2 — Enterprise Audio Live Room
 * Dark Premium theme, #0B0B0B bg, #00C2B8 primary, #FFD700 accent
 * Flutter migration: maps to LiveRoomScreen widget
 */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LiveRoomHeader from "@/components/liveroom2/LiveRoomHeader";
import SeatGrid from "@/components/liveroom2/SeatGrid";
import ChatPanel2 from "@/components/liveroom2/ChatPanel2";
import GiftPanel2 from "@/components/liveroom2/GiftPanel2";
import ToolsPanel from "@/components/liveroom2/ToolsPanel";
import PKBattle from "@/components/liveroom2/PKBattle";
import AnnouncementBanner from "@/components/liveroom2/AnnouncementBanner";
import SpeakRequestQueue from "@/components/liveroom2/SpeakRequestQueue";
import RoomSetupSheet from "@/components/liveroom2/RoomSetupSheet";
import { Mic, Gift, Wrench } from "lucide-react";

// Mock room data
const MOCK_ROOM = {
  id: "ROOM-4821",
  title: "Late Night Vibes 🌙",
  cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
  level: 42,
  xp: 6800,
  xpNext: 10000,
  onlineUsers: 384,
  announcement: "Welcome! No hate speech. Be respectful. Top gifters get VIP seat 🎁",
  hostId: "u1",
  layout: 15,
};

const MOCK_SEATS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  state: i === 0 ? "occupied" : i === 1 ? "active" : i === 2 ? "muted" : i === 4 ? "locked" : i % 4 === 0 ? "occupied" : "empty",
  user: (i === 0 || i === 1 || i === 2 || i % 4 === 0) ? {
    id: `u${i}`,
    name: ["SAM", "Luna", "Rex", "Nova", "Kai"][i % 5],
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${i}`,
    level: 20 + i * 3,
    vip: i < 3 ? `vip${Math.min(i + 1, 5)}` : null,
    country: ["🇺🇸", "🇬🇧", "🇯🇵", "🇧🇷", "🇩🇪"][i % 5],
  } : null,
  isHost: i === 0,
}));

export default function LiveRoomV2() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState(MOCK_SEATS);
  const [layout, setLayout] = useState(15);
  const [activePanel, setActivePanel] = useState(null); // "chat" | "gift" | "tools"
  const [showPK, setShowPK] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [roomTimer, setRoomTimer] = useState(0);

  // Room timer
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

  const handleSeatTap = (seat) => {
    if (seat.state === "empty") setMyHandRaised(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0D1F1E 0%, #0B0B0B 40%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Header */}
      <LiveRoomHeader
        room={MOCK_ROOM}
        timer={formatTimer(roomTimer)}
        onBack={() => navigate("/")}
        onSetup={() => setShowSetup(true)}
      />

      {/* Announcement */}
      <AnnouncementBanner text={MOCK_ROOM.announcement} />

      {/* PK Battle bar */}
      <AnimatePresence>
        {showPK && <PKBattle onClose={() => setShowPK(false)} />}
      </AnimatePresence>

      {/* Seat Grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
        <SeatGrid
          seats={seats.slice(0, layout)}
          layout={layout}
          onSeatTap={handleSeatTap}
        />
      </div>

      {/* Raise Hand / Lock row */}
      <div style={{
        display: "flex", gap: 10, padding: "8px 16px",
        justifyContent: "flex-start",
      }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMyHandRaised(v => !v)}
          style={{
            padding: "7px 18px", borderRadius: 24,
            background: myHandRaised
              ? "linear-gradient(135deg,#00C2B8,#00a89f)"
              : "rgba(0,194,184,0.13)",
            border: "1px solid rgba(0,194,184,0.4)",
            color: myHandRaised ? "#fff" : "#00C2B8",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
          ✋ {myHandRaised ? "Cancel Request" : "Request to Speak"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          style={{
            padding: "7px 16px", borderRadius: 24,
            background: "rgba(255,215,0,0.10)",
            border: "1px solid rgba(255,215,0,0.35)",
            color: "#FFD700",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
          🔒 Lock
        </motion.button>
      </div>

      {/* Bottom Chat Preview */}
      <div style={{ padding: "0 12px 8px", maxHeight: 140, overflowY: "auto" }}>
        <ChatPanel2 compact />
      </div>

      {/* Bottom Action Bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,194,184,0.12)",
        gap: 8,
      }}>
        {/* Chat input pill */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
          style={{
            flex: 1, height: 38, borderRadius: 20,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.13)",
            display: "flex", alignItems: "center",
            padding: "0 14px",
            color: "rgba(255,255,255,0.4)",
            fontSize: 13, cursor: "pointer",
          }}>
          All · Message · Gift
        </motion.div>

        {/* Gift */}
        <motion.button whileTap={{ scale: 0.88 }}
          onClick={() => setActivePanel(activePanel === "gift" ? null : "gift")}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: activePanel === "gift"
              ? "linear-gradient(135deg,#FFD700,#FFA500)"
              : "rgba(255,215,0,0.13)",
            border: "1px solid rgba(255,215,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <Gift size={18} color="#FFD700" />
        </motion.button>

        {/* Tools */}
        <motion.button whileTap={{ scale: 0.88 }}
          onClick={() => setActivePanel(activePanel === "tools" ? null : "tools")}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: activePanel === "tools"
              ? "linear-gradient(135deg,#00C2B8,#006e6a)"
              : "rgba(0,194,184,0.13)",
            border: "1px solid rgba(0,194,184,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
          <Wrench size={18} color="#00C2B8" />
        </motion.button>
      </div>

      {/* Slide-up Panels */}
      <AnimatePresence>
        {activePanel === "chat" && (
          <motion.div key="chat-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              height: "70vh",
              background: "#111",
              borderRadius: "24px 24px 0 0",
              border: "1px solid rgba(0,194,184,0.2)",
              overflow: "hidden",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px" }}>
              <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
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
              height: "60vh",
              background: "#111",
              borderRadius: "24px 24px 0 0",
              border: "1px solid rgba(255,215,0,0.2)",
              overflow: "hidden",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px" }}>
              <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
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
              height: "75vh",
              background: "#111",
              borderRadius: "24px 24px 0 0",
              border: "1px solid rgba(0,194,184,0.2)",
              overflow: "hidden",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px" }}>
              <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.2)" }} />
            </div>
            <ToolsPanel onClose={() => setActivePanel(null)} onPK={() => { setShowPK(true); setActivePanel(null); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speak Request Queue */}
      <AnimatePresence>
        {showRequests && <SpeakRequestQueue onClose={() => setShowRequests(false)} />}
      </AnimatePresence>

      {/* Room Setup Sheet */}
      <AnimatePresence>
        {showSetup && <RoomSetupSheet onClose={() => setShowSetup(false)} />}
      </AnimatePresence>

      {/* Tap-outside overlay */}
      {activePanel && (
        <div onClick={() => setActivePanel(null)}
          style={{ position: "fixed", inset: 0, zIndex: 199, background: "transparent" }} />
      )}
    </div>
  );
}