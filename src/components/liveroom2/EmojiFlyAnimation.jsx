/**
 * EmojiFlyAnimation — Animated emoji flying seat-to-seat or audience-to-seat.
 * Supports hammer special interaction with boom/ouch/shake effects.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HAMMER_REACTIONS = ["💥", "BOOM!", "OUCH!", "😵"];

export default function EmojiFlyAnimation({ event, onDone }) {
  const [phase, setPhase] = useState("fly"); // fly | impact | done
  const isHammer = event?.emoji?.id === "hammer";

  useEffect(() => {
    if (!event) return;
    const t1 = setTimeout(() => setPhase("impact"), 800);
    const t2 = setTimeout(() => { setPhase("done"); onDone?.(); }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [event]);

  if (!event || phase === "done") return null;

  return (
    <AnimatePresence>
      {/* Flying emoji */}
      {phase === "fly" && (
        <motion.div
          key="emoji-fly"
          initial={{ x: event.fromX ?? "40vw", y: event.fromY ?? "60vh", scale: 0.8, opacity: 1, rotate: 0 }}
          animate={{ x: event.toX ?? "50vw", y: event.toY ?? "30vh", scale: 1.6, opacity: 1, rotate: isHammer ? [0, -30, 30, -20, 0] : 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed", zIndex: 450, pointerEvents: "none",
            fontSize: 38,
            filter: isHammer
              ? "drop-shadow(0 0 10px rgba(255,100,0,0.9))"
              : "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
          }}
        >
          {event.emoji.icon}
        </motion.div>
      )}

      {/* Impact effect */}
      {phase === "impact" && (
        <>
          {isHammer ? (
            /* Hammer: boom + shake */
            <motion.div
              key="hammer-impact"
              initial={{ x: (event.toX ?? "50vw"), y: (event.toY ?? "30vh"), scale: 0 }}
              animate={{ scale: [0, 2.5, 0] }}
              transition={{ duration: 0.8 }}
              style={{
                position: "fixed", zIndex: 450, pointerEvents: "none",
                fontSize: 28, fontWeight: 900,
                color: "#FF5252",
                textShadow: "0 0 20px rgba(255,82,82,0.9)",
              }}
            >
              {HAMMER_REACTIONS[Math.floor(Math.random() * HAMMER_REACTIONS.length)]}
            </motion.div>
          ) : (
            /* Normal emoji burst */
            <motion.div
              key="emoji-impact"
              initial={{ x: event.toX ?? "50vw", y: event.toY ?? "30vh", scale: 0, opacity: 1 }}
              animate={{ scale: [0, 2, 0], opacity: [1, 1, 0] }}
              transition={{ duration: 0.9 }}
              style={{
                position: "fixed", zIndex: 450, pointerEvents: "none", fontSize: 40,
              }}
            >
              {event.emoji.icon}
            </motion.div>
          )}

          {/* Floating particles on impact */}
          {["✨","💫","🌟"].map((p, i) => (
            <motion.span
              key={i}
              initial={{ x: event.toX ?? "50vw", y: event.toY ?? "30vh", opacity: 1 }}
              animate={{
                x: `calc(${event.toX ?? "50vw"} + ${(i - 1) * 40}px)`,
                y: `calc(${event.toY ?? "30vh"} - 50px)`,
                opacity: 0,
              }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              style={{ position: "fixed", zIndex: 451, fontSize: 16, pointerEvents: "none" }}
            >{p}</motion.span>
          ))}
        </>
      )}

      {/* Sender/receiver label */}
      {phase === "impact" && (
        <motion.div
          key="label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", bottom: 170, left: "50%", transform: "translateX(-50%)",
            zIndex: 460, pointerEvents: "none",
            background: "rgba(0,0,0,0.75)", borderRadius: 20, padding: "6px 16px",
            border: "1px solid rgba(255,255,255,0.12)",
            fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {event.senderName} sent {event.emoji.icon} to {event.targetName}
        </motion.div>
      )}
    </AnimatePresence>
  );
}