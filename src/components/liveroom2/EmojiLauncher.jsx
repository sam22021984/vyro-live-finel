/**
 * EmojiLauncher — Bottom tray for sending 3D-style animated emojis seat-to-seat.
 * Includes: basic emojis (all), VIP emojis (vip members), hammer interaction.
 * Fires onSend({ emojiId, targetSeatId }) — parent handles animation.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

const EMOJI_GROUPS = [
  {
    label: "Basic", tier: "all",
    items: [
      { id: "heart",       icon: "❤️",  label: "Heart" },
      { id: "fire",        icon: "🔥",  label: "Fire" },
      { id: "applause",    icon: "👏",  label: "Clap" },
      { id: "star",        icon: "⭐",  label: "Star" },
      { id: "celebration", icon: "🎉",  label: "Party" },
      { id: "love_eyes",   icon: "😍",  label: "Love" },
    ],
  },
  {
    label: "VIP", tier: "vip",
    items: [
      { id: "rose",    icon: "🌹",  label: "Rose" },
      { id: "kiss",    icon: "💋",  label: "Kiss" },
      { id: "crown",   icon: "👑",  label: "Crown" },
      { id: "diamond", icon: "💎",  label: "Diamond" },
    ],
  },
  {
    label: "Fun", tier: "all",
    items: [
      { id: "hammer", icon: "🔨", label: "Hammer", special: true },
    ],
  },
];

const SEATS_MOCK = [
  { id: 1, name: "SAM" }, { id: 2, name: "Luna" }, { id: 3, name: "Rex" }, { id: 8, name: "Nova" },
];

export default function EmojiLauncher({ onClose, onSend, isVIP = false }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showTargets, setShowTargets] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setShowTargets(true);
  };

  const handleTarget = (seat) => {
    if (selectedEmoji && onSend) {
      onSend({ emoji: selectedEmoji, targetSeatId: seat.id, targetName: seat.name });
    }
    setShowTargets(false);
    setSelectedEmoji(null);
    onClose?.();
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, #0f2a27 0%, #0a1f1d 100%)",
      borderRadius: "22px 22px 0 0",
      border: "1px solid rgba(0,194,184,0.18)",
      overflow: "hidden",
    }}>
      {/* Handle + Header */}
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 12px" }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>✨ Send Emoji</span>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={14} color="rgba(255,255,255,0.6)" />
        </motion.button>
      </div>

      {/* Group tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px 12px", overflowX: "auto" }}>
        {EMOJI_GROUPS.map((g, i) => (
          <motion.button key={g.label} whileTap={{ scale: 0.92 }}
            onClick={() => setActiveGroup(i)}
            style={{
              padding: "5px 14px", borderRadius: 20, cursor: "pointer", flexShrink: 0,
              background: activeGroup === i ? "rgba(0,194,184,0.2)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${activeGroup === i ? "rgba(0,194,184,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: activeGroup === i ? "#00C2B8" : "rgba(255,255,255,0.5)",
              fontSize: 11, fontWeight: 800,
              display: "flex", alignItems: "center", gap: 4,
            }}>
            {g.label}
            {g.tier === "vip" && <span style={{ fontSize: 9, background: "#FFD70033", color: "#FFD700", borderRadius: 10, padding: "1px 5px" }}>VIP</span>}
          </motion.button>
        ))}
      </div>

      {/* Emoji grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8, padding: "0 16px 20px",
      }}>
        {EMOJI_GROUPS[activeGroup].items.map(e => {
          const locked = EMOJI_GROUPS[activeGroup].tier === "vip" && !isVIP;
          return (
            <motion.button key={e.id} whileTap={{ scale: locked ? 1 : 0.88 }}
              onClick={() => !locked && handleEmojiSelect(e)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "14px 8px", borderRadius: 14, cursor: locked ? "not-allowed" : "pointer",
                background: e.special ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${e.special ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
                opacity: locked ? 0.45 : 1, position: "relative",
              }}>
              <span style={{
                fontSize: 30,
                filter: e.special ? "drop-shadow(0 0 8px rgba(255,100,0,0.8))" : "drop-shadow(0 0 6px rgba(255,255,255,0.3))",
              }}>{e.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{e.label}</span>
              {locked && (
                <div style={{
                  position: "absolute", top: 4, right: 4, fontSize: 10
                }}>🔒</div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Target seat selector */}
      <AnimatePresence>
        {showTargets && selectedEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 16px 20px",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 18 }}>{selectedEmoji.icon}</span>
              Send to:
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
              {SEATS_MOCK.map(s => (
                <motion.button key={s.id} whileTap={{ scale: 0.88 }}
                  onClick={() => handleTarget(s)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, flexShrink: 0, cursor: "pointer",
                    background: "rgba(0,194,184,0.15)",
                    border: "1px solid rgba(0,194,184,0.4)",
                    color: "#00C2B8", fontSize: 12, fontWeight: 800,
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                  💺 {s.name}
                  <ChevronRight size={12} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}