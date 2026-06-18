/**
 * SeatGlowEffect — Renders glow + gold ring + floating hearts/stars on a seat
 * after receiving a gift or emoji.
 * Attach as overlay on seat position; auto-expires after 3s.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLOAT_ITEMS = { gift: ["💎","✨","🌟","🔥","⭐"], emoji: ["💖","💗","💕","✨","🌸"], hammer: ["💥","🔨","⚡","😵","🌟"] };

export default function SeatGlowEffect({ type = "gift", active, color = "#FFD700" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, [active]);

  const items = FLOAT_ITEMS[type] || FLOAT_ITEMS.gift;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Gold ring pulse */}
          <motion.div
            key="ring"
            initial={{ scale: 0.8, opacity: 0.9 }}
            animate={{ scale: [0.8, 2, 2.5], opacity: [0.9, 0.6, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              border: `3px solid ${color}`,
              boxShadow: `0 0 18px ${color}99`,
              zIndex: 10, pointerEvents: "none",
            }}
          />

          {/* Floating particles */}
          {items.map((item, i) => (
            <motion.span
              key={i}
              initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
              animate={{
                y: -40 - i * 10,
                x: (i % 2 === 0 ? 1 : -1) * (10 + i * 8),
                opacity: 0, scale: 0.5,
              }}
              transition={{ duration: 1.4, delay: i * 0.1, ease: "easeOut" }}
              style={{
                position: "absolute", fontSize: 14,
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                pointerEvents: "none", zIndex: 11,
              }}
            >{item}</motion.span>
          ))}

          {/* Seat glow overlay */}
          <motion.div
            key="glow"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
              zIndex: 9, pointerEvents: "none",
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}