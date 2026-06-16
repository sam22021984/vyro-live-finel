/**
 * PKBattle — room vs room PK battle bar with real-time scores and countdown
 * Flutter: PKBattleWidget with AnimatedBuilder
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function PKBattle({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [scoreA, setScoreA] = useState(1240);
  const [scoreB, setScoreB] = useState(980);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => s > 0 ? s - 1 : 0);
      if (Math.random() > 0.5) setScoreA(s => s + Math.floor(Math.random() * 50));
      else setScoreB(s => s + Math.floor(Math.random() * 50));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const total = scoreA + scoreB;
  const pctA = total > 0 ? (scoreA / total) * 100 : 50;
  const pctB = 100 - pctA;
  const winner = scoreA > scoreB ? "A" : "B";

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        margin: "0 12px 8px",
        background: "linear-gradient(135deg, rgba(147,51,234,0.15), rgba(0,194,184,0.12))",
        border: "1px solid rgba(147,51,234,0.3)",
        borderRadius: 16,
        padding: "12px 14px",
        position: "relative",
      }}>
      {/* Close */}
      <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
        style={{
          position: "absolute", top: 8, right: 8,
          width: 22, height: 22, borderRadius: "50%",
          background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
        <X size={11} color="rgba(255,255,255,0.6)" />
      </motion.button>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#C084FC", letterSpacing: "0.1em" }}>
          ⚔️ PK BATTLE
        </span>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          background: "rgba(0,0,0,0.4)", padding: "2px 10px", borderRadius: 10, marginLeft: 8,
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: timeLeft < 60 ? "#FF5252" : "#FFD700", fontVariantNumeric: "tabular-nums" }}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 16, marginBottom: 2 }}>🏠</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#00C2B8" }}>
            {scoreA.toLocaleString()}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>VYRO Room</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#C084FC" }}>VS</div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 16, marginBottom: 2 }}>🏯</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#FF5252" }}>
            {scoreB.toLocaleString()}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Luna Room</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8, borderRadius: 4, overflow: "hidden",
        background: "rgba(255,82,82,0.3)",
        display: "flex",
      }}>
        <motion.div
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#00C2B8,#00ffee)",
            borderRadius: "4px 0 0 4px",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 9, color: "#00C2B8", fontWeight: 700 }}>{pctA.toFixed(0)}%</span>
        <span style={{ fontSize: 9, color: "#FF5252", fontWeight: 700 }}>{pctB.toFixed(0)}%</span>
      </div>
    </motion.div>
  );
}