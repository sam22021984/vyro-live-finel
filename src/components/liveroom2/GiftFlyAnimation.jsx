/**
 * GiftFlyAnimation — Animated gift flying from sender seat to receiver seat
 * Also handles audience → seat gifts.
 * Triggers seat glow + explosion on arrival.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GIFT_EMOJIS = {
  rose: "🌹", diamond: "💎", crown: "👑", heart: "❤️",
  star: "⭐", fire: "🔥", cake: "🎂", rocket: "🚀",
  bomb: "💣", trophy: "🏆",
};

export default function GiftFlyAnimation({ event, onDone }) {
  const [phase, setPhase] = useState("fly"); // fly | impact | done
  const giftIcon = GIFT_EMOJIS[event?.giftId] || "🎁";

  useEffect(() => {
    if (!event) return;
    const t1 = setTimeout(() => setPhase("impact"), 900);
    const t2 = setTimeout(() => { setPhase("done"); onDone?.(); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [event]);

  if (!event || phase === "done") return null;

  return (
    <AnimatePresence>
      {/* Full-screen overlay for premium gift */}
      {event.isPremium && phase === "impact" && (
        <motion.div
          key="flash"
          initial={{ opacity: 0.6 }} animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed", inset: 0, zIndex: 400,
            background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Flying gift */}
      {phase === "fly" && (
        <motion.div
          key="fly"
          initial={{ x: event.fromX, y: event.fromY, scale: 0.6, opacity: 1 }}
          animate={{ x: event.toX, y: event.toY, scale: 1.3, opacity: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed", zIndex: 450, pointerEvents: "none",
            fontSize: 36,
            filter: "drop-shadow(0 0 12px rgba(255,215,0,0.8))",
          }}
        >
          {giftIcon}
        </motion.div>
      )}

      {/* Impact explosion */}
      {phase === "impact" && (
        <motion.div
          key="impact"
          initial={{ x: event.toX - 30, y: event.toY - 30, scale: 0, opacity: 1 }}
          animate={{ scale: [0, 2.5, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{
            position: "fixed", zIndex: 450, pointerEvents: "none",
            width: 60, height: 60,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Particles */}
          {["✨","🌟","💫","⭐","🔥"].map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 5) * Math.PI * 2) * 60,
                y: Math.sin((i / 5) * Math.PI * 2) * 60,
                opacity: 0, scale: 0.4,
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ position: "absolute", fontSize: 18 }}
            >{p}</motion.span>
          ))}
          <span style={{ fontSize: 42 }}>{giftIcon}</span>
        </motion.div>
      )}

      {/* Gift info banner */}
      {phase === "impact" && (
        <motion.div
          key="banner"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed", bottom: 160, left: "50%", transform: "translateX(-50%)",
            zIndex: 460, pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(30,30,30,0.9))",
            border: "1px solid rgba(255,215,0,0.5)",
            borderRadius: 20, padding: "10px 20px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 32px rgba(255,215,0,0.3)",
            backdropFilter: "blur(12px)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 24 }}>{giftIcon}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#FFD700" }}>
              {event.senderName} → {event.receiverName}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
              {event.giftName} × {event.quantity || 1} &nbsp;·&nbsp; {event.coinValue} 🪙
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}