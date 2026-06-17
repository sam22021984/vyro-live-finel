/**
 * MeOwnerWallet — Application Owner Wallet Dashboard
 * Shows Primary Coin Wallet + Offline Coin Reserve Wallet
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WALLETS = [
  {
    id: "primary",
    name: "VYRO Coin Wallet",
    type: "Primary",
    balance: "100,000,000,000",
    formatted: "100 Billion",
    unit: "Coins",
    icon: "🪙",
    gradient: "linear-gradient(135deg,#1F6BFF,#0D1B3E)",
    accentColor: "#FFC83D",
    glowColor: "rgba(31,107,255,0.35)",
    status: "Active",
    statusColor: "#22C55E",
    tag: "LIVE WALLET",
  },
  {
    id: "offline",
    name: "Offline Coin Reserve",
    type: "Reserve",
    balance: "1,000,000,000,000",
    formatted: "1 Trillion",
    unit: "Coins",
    icon: "🏦",
    gradient: "linear-gradient(135deg,#7C3AED,#4C1D95)",
    accentColor: "#C084FC",
    glowColor: "rgba(124,58,237,0.35)",
    status: "Reserve",
    statusColor: "#C084FC",
    tag: "OFFLINE RESERVE",
    usage: "Offline System Operations",
  },
];

export default function MeOwnerWallet() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      marginTop: 14,
      borderRadius: 24,
      overflow: "hidden",
      border: "1px solid rgba(31,107,255,0.15)",
      boxShadow: "0 8px 32px rgba(31,107,255,0.12)",
      width: "100%",
      boxSizing: "border-box",
    }}>
      {/* Header toggle */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setExpanded(v => !v)}
        style={{
          width: "100%", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
          padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 14, flexShrink: 0,
          background: "rgba(255,200,61,0.15)",
          border: "1px solid rgba(255,200,61,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>💎</div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#FFC83D" }}>Owner Wallet System</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>
            Primary · Reserve · Enterprise Controls
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>⌄</span>
        </motion.div>
      </motion.button>

      {/* Wallet Cards */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden", background: "#F5F7FA" }}
          >
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
              {WALLETS.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    borderRadius: 20, overflow: "hidden",
                    boxShadow: `0 8px 28px ${w.glowColor}`,
                  }}
                >
                  {/* Card gradient top */}
                  <div style={{ background: w.gradient, padding: "16px 16px 20px", position: "relative", overflow: "hidden" }}>
                    {/* Decorative circle */}
                    <div style={{
                      position: "absolute", top: -20, right: -20,
                      width: 100, height: 100, borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)", pointerEvents: "none",
                    }} />

                    {/* Tag */}
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "2px 8px",
                      marginBottom: 10,
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: w.statusColor }} />
                      <span style={{ fontSize: 8, fontWeight: 900, color: "rgba(255,255,255,0.8)", letterSpacing: "0.07em" }}>
                        {w.tag}
                      </span>
                    </div>

                    {/* Wallet name + icon */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 26 }}>{w.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{w.name}</div>
                        {w.usage && (
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{w.usage}</div>
                        )}
                      </div>
                    </div>

                    {/* Balance */}
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 2, letterSpacing: "0.06em" }}>
                        TOTAL BALANCE
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: w.accentColor, lineHeight: 1 }}>
                        {w.formatted}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                        {w.balance} {w.unit}
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div style={{
                    background: "#fff", padding: "10px 16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: w.statusColor }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#374151" }}>{w.status}</span>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 800, color: "#9CA3AF",
                      background: "#F3F4F6", borderRadius: 8, padding: "2px 8px",
                    }}>
                      {w.type} Wallet
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Total summary row */}
              <div style={{
                background: "linear-gradient(135deg,#FFF9E6,#FFFBF0)",
                borderRadius: 16, padding: "12px 14px",
                border: "1px solid rgba(255,200,61,0.25)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700 }}>COMBINED TOTAL</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#1F6BFF" }}>1.1 Trillion Coins</div>
                </div>
                <div style={{
                  background: "linear-gradient(135deg,#FFC83D,#F59E0B)",
                  borderRadius: 12, padding: "6px 12px",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: "#fff" }}>🔐 Enterprise</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}