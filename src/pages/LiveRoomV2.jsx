/**
 * VYRO LIVE ROOM V2 — Full Enterprise Audio Live Room
 * Implements: Header (exit confirm, room info, notifications, more menu)
 * Seat Grid, Chat, Gift, Tools, PK, Speak Requests, Announcement, Audience, Bottom Bar
 */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LiveRoomHeader from "@/components/liveroom2/LiveRoomHeader";
import SeatGrid from "@/components/liveroom2/SeatGrid";
import ChatPanel2 from "@/components/liveroom2/ChatPanel2";
import GiftPanel2 from "@/components/liveroom2/GiftPanel2";
import ToolsPanel from "@/components/liveroom2/ToolsPanel";
import PKBattle from "@/components/liveroom2/PKBattle";
import SpeakRequestQueue from "@/components/liveroom2/SpeakRequestQueue";
import AnnouncementBanner from "@/components/liveroom2/AnnouncementBanner";
import { MessageCircle, Gift, Wrench, Smile, Trophy } from "lucide-react";
import SeatProfileCard from "@/components/liveroom2/SeatProfileCard";
import SeatManager from "@/components/liveroom2/SeatManager";
import GiftFlyAnimation from "@/components/liveroom2/GiftFlyAnimation";
import EmojiFlyAnimation from "@/components/liveroom2/EmojiFlyAnimation";
import EmojiLauncher from "@/components/liveroom2/EmojiLauncher";
import GiftLeaderboard from "@/components/liveroom2/GiftLeaderboard";

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

const AUDIENCE = [
  { id: "a1", name: "Zara", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=a1", vip: "vip2", online: true },
  { id: "a2", name: "Kai",  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=a2", vip: null,   online: true },
  { id: "a3", name: "Mia",  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=a3", vip: "vip1", online: true },
  { id: "a4", name: "Jay",  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=a4", vip: null,   online: true },
  { id: "a5", name: "Aria", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=a5", vip: "vip3", online: true },
];

export default function LiveRoomV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const liveRoom = location.state?.room;

  const roomData = {
    id: liveRoom?.id || "ROOM-4821",
    title: liveRoom?.title || "Sajid Alam",
    cover: liveRoom?.cover_image_url || "https://api.dicebear.com/7.x/adventurer/svg?seed=sam",
    level: 7,
    xp: 6800,
    xpNext: 10000,
    onlineUsers: liveRoom?.current_listeners || 384,
    announcement: liveRoom?.welcome_message || "⚠️ Warning: Pornography, vulgarity, violence, minors and other related situations are strictly prohibited. AI monitors 24/7.",
    hostId: liveRoom?.host_id || "u1",
  };

  const [seats, setSeats] = useState(() => buildSeats(25));
  const [showSeatManager, setShowSeatManager] = useState(false);
  const [seatLayout, setSeatLayout] = useState("8_seats");
  const [seatCount, setSeatCount] = useState(8);
  const [activePanel, setActivePanel] = useState(null); // chat | gift | tools | emoji | leaderboard
  const [showPK, setShowPK] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [myHandRaised, setMyHandRaised] = useState(false);
  const [roomTimer, setRoomTimer] = useState(0);
  const [announcement, setAnnouncement] = useState(roomData.announcement);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [giftFlyEvent, setGiftFlyEvent] = useState(null);
  const [emojiFlyEvent, setEmojiFlyEvent] = useState(null);
  const [seatGlows, setSeatGlows] = useState({}); // { seatId: "gift"|"emoji"|"hammer" }
  const isAdmin = true; // mock: current user is admin

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

  const triggerGiftFly = (fromSeatId, toSeatId) => {
    setGiftFlyEvent({
      fromX: "20vw", fromY: "35vh", toX: "60vw", toY: "25vh",
      senderName: "You", receiverName: "SAM",
      giftName: "Rose", giftId: "rose", quantity: 1, coinValue: 50, isPremium: true,
    });
    setSeatGlows(prev => ({ ...prev, [toSeatId]: "gift" }));
    setTimeout(() => setSeatGlows(prev => { const n={...prev}; delete n[toSeatId]; return n; }), 3500);
  };

  const triggerEmojiSend = ({ emoji, targetSeatId, targetName }) => {
    setEmojiFlyEvent({
      fromX: "40vw", fromY: "70vh", toX: "55vw", toY: "28vh",
      emoji, senderName: "You", targetName,
    });
    const glowType = emoji.id === "hammer" ? "hammer" : "emoji";
    setSeatGlows(prev => ({ ...prev, [targetSeatId]: glowType }));
    setTimeout(() => setSeatGlows(prev => { const n={...prev}; delete n[targetSeatId]; return n; }), 3500);
  };

  const BOTTOM_BUTTONS = [
    { key: "chat",        icon: <MessageCircle size={18} />, label: "Chat",       color: "#00C2B8" },
    { key: "gift",        icon: <Gift size={18} />,          label: "Gift",       color: "#FFD700" },
    { key: "emoji",       icon: <Smile size={18} />,         label: "Emoji",      color: "#C084FC" },
    { key: "leaderboard", icon: <Trophy size={18} />,        label: "Ranks",      color: "#FFD700" },
    { key: "tools",       icon: <Wrench size={18} />,        label: "Tools",      color: "#00C2B8" },
  ];

  const handleBottomBtn = (key) => {
    setActivePanel(prev => prev === key ? null : key);
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
        onBack={() => {}} /* handled inside header with exit confirm */
        onNavigateBack={() => navigate("/")}
        onSetup={() => {}}
      />

      {/* PK Battle */}
      <AnimatePresence>
        {showPK && <PKBattle onClose={() => setShowPK(false)} />}
      </AnimatePresence>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 10px 0" }}>

        {/* Seat Grid */}
        <SeatGrid
          seats={seats.slice(0, seatCount)}
          layout={seatCount}
          seatGlows={seatGlows}
          onSeatTap={(seat) => {
            if (seat.state !== "empty" && seat.state !== "locked" && seat.user) {
              setSelectedSeat(seat);
            }
          }}
        />

        {/* Announcement */}
        <AnnouncementBanner
          text={announcement}
          onEdit={(text) => setAnnouncement(text)}
        />

        {/* Audience row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0 4px", overflowX: "auto" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700, flexShrink: 0 }}>
            👥 {roomData.onlineUsers}
          </span>
          {AUDIENCE.map(a => (
            <div key={a.id} style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", overflow: "hidden",
                border: a.vip ? "2px solid #FFD700" : "2px solid rgba(0,194,184,0.4)",
              }}>
                <img src={a.avatar} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{
                position: "absolute", bottom: -1, right: -1,
                width: 8, height: 8, borderRadius: "50%",
                background: "#22C55E", border: "1.5px solid #0D2B28",
              }} />
            </div>
          ))}
        </div>

        {/* Compact chat feed */}
        <div style={{ paddingBottom: 8 }}>
          <ChatPanel2 compact />
        </div>
      </div>

      {/* Request to Speak row */}
      <div style={{ display: "flex", gap: 8, padding: "6px 12px 4px" }}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setMyHandRaised(v => !v)}
          style={{
            padding: "6px 16px", borderRadius: 20,
            background: myHandRaised ? "rgba(255,82,82,0.2)" : "rgba(0,0,0,0.4)",
            border: `1px solid ${myHandRaised ? "rgba(255,82,82,0.6)" : "rgba(0,194,184,0.5)"}`,
            color: myHandRaised ? "#FF5252" : "#00C2B8",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
          ✋ {myHandRaised ? "Cancel Request" : "Request to Speak"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowRequests(true)}
          style={{
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
          📋 Queue
        </motion.button>
      </div>

      {/* ── Bottom Action Bar — 5 persistent buttons ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "10px 8px 14px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        {BOTTOM_BUTTONS.map(btn => (
          <motion.button
            key={btn.key}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleBottomBtn(btn.key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: (activePanel === btn.key || (btn.key === "hand" && myHandRaised))
                ? `${btn.color}22`
                : "rgba(255,255,255,0.06)",
              border: `1px solid ${(activePanel === btn.key || (btn.key === "hand" && myHandRaised)) ? btn.color + "66" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 14, padding: "8px 14px",
              cursor: "pointer", minWidth: 52,
              color: (activePanel === btn.key || (btn.key === "hand" && myHandRaised)) ? btn.color : "rgba(255,255,255,0.5)",
            }}>
            <div style={{ color: "inherit" }}>{btn.icon}</div>
            <span style={{ fontSize: 9, fontWeight: 700 }}>{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* ── Slide-up Panels ── */}
      <AnimatePresence>
        {activePanel && (
          <div onClick={() => setActivePanel(null)}
            style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.45)" }} />
        )}
        {activePanel === "chat" && (
          <motion.div key="chat-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              height: "68vh", background: "#111",
              borderRadius: "22px 22px 0 0",
              border: "1px solid rgba(0,194,184,0.18)",
              overflow: "hidden", display: "flex", flexDirection: "column",
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
              height: "58vh", background: "#111",
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
              height: "72vh", background: "#111",
              borderRadius: "22px 22px 0 0",
              border: "1px solid rgba(0,194,184,0.18)",
              overflow: "hidden",
            }}>
            <div style={{ display:"flex", justifyContent:"center", padding: "10px 0 4px" }}>
              <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)" }} />
            </div>
            <ToolsPanel
            onClose={() => setActivePanel(null)}
            onPK={() => { setShowPK(true); setActivePanel(null); }}
            onSeatManager={() => { setShowSeatManager(true); setActivePanel(null); }}
          />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speak Requests */}
      <AnimatePresence>
        {showRequests && <SpeakRequestQueue onClose={() => setShowRequests(false)} />}
      </AnimatePresence>

      {/* Seat Profile Card */}
      <AnimatePresence>
        {selectedSeat && (
          <SeatProfileCard
            seat={selectedSeat}
            onClose={() => setSelectedSeat(null)}
            onAdminAction={isAdmin ? (action, seat) => console.log("Admin:", action, seat) : null}
          />
        )}
      </AnimatePresence>

      {/* Emoji Launcher Panel */}
      <AnimatePresence>
        {activePanel === "emoji" && (
          <motion.div key="emoji-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              borderRadius: "22px 22px 0 0", overflow: "hidden",
            }}>
            <EmojiLauncher
              onClose={() => setActivePanel(null)}
              onSend={(e) => { triggerEmojiSend(e); setActivePanel(null); }}
              isVIP={true}
            />
          </motion.div>
        )}

        {/* Gift Leaderboard Panel */}
        {activePanel === "leaderboard" && (
          <motion.div key="lb-panel"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
              height: "65vh", borderRadius: "22px 22px 0 0", overflow: "hidden",
            }}>
            <GiftLeaderboard onClose={() => setActivePanel(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay backdrop for emoji/leaderboard */}
      <AnimatePresence>
        {(activePanel === "emoji" || activePanel === "leaderboard") && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
            style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.45)" }}
          />
        )}
      </AnimatePresence>

      {/* Seat Manager */}
      <AnimatePresence>
        {showSeatManager && (
          <SeatManager
            currentSeats={seats}
            currentLayout={seatLayout}
            onClose={() => setShowSeatManager(false)}
            onLayoutChange={(layout, count) => {
              setSeatLayout(layout);
              setSeatCount(count);
              setSeats(buildSeats(count));
            }}
            onSeatAction={(action, seat) => console.log("Seat action:", action, seat)}
          />
        )}
      </AnimatePresence>

      {/* Gift Fly Animation */}
      <GiftFlyAnimation event={giftFlyEvent} onDone={() => setGiftFlyEvent(null)} />

      {/* Emoji Fly Animation */}
      <EmojiFlyAnimation event={emojiFlyEvent} onDone={() => setEmojiFlyEvent(null)} />
    </div>
  );
}