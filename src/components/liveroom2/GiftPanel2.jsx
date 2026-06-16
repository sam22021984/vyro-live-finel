/**
 * GiftPanel2 — gift categories, grid, send with full-screen effect
 * Flutter: BottomSheet with TabBar + GridView
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins } from "lucide-react";

const CATEGORIES = ["Basic", "Premium", "VIP", "Festival", "Animated"];

const GIFTS = {
  Basic: [
    { id: 1, name: "Rose", icon: "🌹", cost: 10 },
    { id: 2, name: "Heart", icon: "❤️", cost: 20 },
    { id: 3, name: "Star", icon: "⭐", cost: 30 },
    { id: 4, name: "Hug", icon: "🤗", cost: 50 },
    { id: 5, name: "Cake", icon: "🎂", cost: 88 },
    { id: 6, name: "Crown", icon: "👑", cost: 99 },
    { id: 7, name: "Gift", icon: "🎁", cost: 100 },
    { id: 8, name: "Music", icon: "🎵", cost: 150 },
  ],
  Premium: [
    { id: 9, name: "Diamond", icon: "💎", cost: 299 },
    { id: 10, name: "Trophy", icon: "🏆", cost: 399 },
    { id: 11, name: "Castle", icon: "🏰", cost: 499 },
    { id: 12, name: "Unicorn", icon: "🦄", cost: 599 },
  ],
  VIP: [
    { id: 13, name: "Rocket", icon: "🚀", cost: 999 },
    { id: 14, name: "Galaxy", icon: "🌌", cost: 1999 },
    { id: 15, name: "Dragon", icon: "🐉", cost: 2999 },
    { id: 16, name: "Crown+", icon: "👸", cost: 4999 },
  ],
  Festival: [
    { id: 17, name: "Firework", icon: "🎆", cost: 199 },
    { id: 18, name: "Party", icon: "🎉", cost: 299 },
    { id: 19, name: "Balloon", icon: "🎈", cost: 149 },
    { id: 20, name: "Confetti", icon: "🎊", cost: 249 },
  ],
  Animated: [
    { id: 21, name: "Lightning", icon: "⚡", cost: 799 },
    { id: 22, name: "Magic", icon: "✨", cost: 899 },
    { id: 23, name: "Explosion", icon: "💥", cost: 1299 },
    { id: 24, name: "Aurora", icon: "🌈", cost: 1599 },
  ],
};

export default function GiftPanel2({ onClose }) {
  const [activeTab, setActiveTab] = useState("Basic");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [showEffect, setShowEffect] = useState(null);
  const myCoins = 2450;

  const sendGift = () => {
    if (!selected) return;
    setShowEffect(selected);
    setTimeout(() => setShowEffect(null), 2200);
    setSelected(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#111" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px 4px",
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>🎁 Send Gift</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(255,215,0,0.1)", padding: "4px 10px", borderRadius: 12,
          }}>
            <span style={{ fontSize: 13 }}>🪙</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#FFD700" }}>{myCoins.toLocaleString()}</span>
          </div>
          {onClose && (
            <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <X size={13} color="rgba(255,255,255,0.6)" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{
        display: "flex", gap: 6, padding: "8px 14px",
        overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {CATEGORIES.map(c => (
          <motion.button key={c} whileTap={{ scale: 0.92 }}
            onClick={() => { setActiveTab(c); setSelected(null); }}
            style={{
              padding: "5px 14px", borderRadius: 16, fontSize: 11, fontWeight: 700,
              border: "none", cursor: "pointer", whiteSpace: "nowrap",
              background: activeTab === c
                ? "linear-gradient(135deg,#00C2B8,#006e6a)"
                : "rgba(255,255,255,0.06)",
              color: activeTab === c ? "#000" : "rgba(255,255,255,0.55)",
            }}>{c}</motion.button>
        ))}
      </div>

      {/* Gift grid */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px 14px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
      }}>
        {(GIFTS[activeTab] || []).map(gift => (
          <motion.button key={gift.id}
            whileTap={{ scale: 0.88 }}
            onClick={() => setSelected(gift)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: selected?.id === gift.id
                ? "rgba(0,194,184,0.18)"
                : "rgba(255,255,255,0.04)",
              border: selected?.id === gift.id
                ? "1.5px solid #00C2B8"
                : "1.5px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "10px 4px",
              cursor: "pointer",
            }}>
            <span style={{ fontSize: 26 }}>{gift.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>
              {gift.name}
            </span>
            <span style={{ fontSize: 9, fontWeight: 800, color: "#FFD700" }}>
              🪙 {gift.cost}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Send bar */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
          <span style={{ fontSize: 24 }}>{selected.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{selected.name}</div>
            <div style={{ fontSize: 11, color: "#FFD700" }}>🪙 {(selected.cost * qty).toLocaleString()}</div>
          </div>
          {/* Qty */}
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[1, 5, 10, 99].map(q => (
              <motion.button key={q} whileTap={{ scale: 0.88 }}
                onClick={() => setQty(q)}
                style={{
                  padding: "4px 8px", borderRadius: 8, fontSize: 11, fontWeight: 800,
                  border: "none", cursor: "pointer",
                  background: qty === q ? "#00C2B8" : "rgba(255,255,255,0.08)",
                  color: qty === q ? "#000" : "#fff",
                }}>×{q}</motion.button>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={sendGift}
            style={{
              padding: "9px 20px", borderRadius: 20,
              background: "linear-gradient(135deg,#FFD700,#FFA500)",
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 800, color: "#000",
            }}>Send</motion.button>
        </motion.div>
      )}

      {/* Full-screen gift effect */}
      <AnimatePresence>
        {showEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
              pointerEvents: "none",
            }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
              style={{ fontSize: 100 }}>
              {showEffect.icon}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 22, fontWeight: 900, color: "#FFD700", marginTop: 16 }}>
              {showEffect.name} Gift!
            </motion.div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
              🪙 {showEffect.cost * qty} coins
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}