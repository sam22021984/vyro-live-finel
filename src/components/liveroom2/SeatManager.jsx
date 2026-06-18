/**
 * SeatManager — Owner/Admin panel for seat layout management & per-seat controls
 * Accessible from ToolsPanel → Seat Manager
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Unlock, MicOff, Mic, UserMinus, ArrowRightLeft, ChevronRight } from "lucide-react";

const LAYOUTS = [
  { id: "4_seats",  label: "4 Seats",  count: 4,  icon: "⬜" },
  { id: "8_seats",  label: "8 Seats",  count: 8,  icon: "🔲" },
  { id: "10_seats", label: "10 Seats", count: 10, icon: "🔳" },
  { id: "15_seats", label: "15 Seats", count: 15, icon: "🟦" },
  { id: "20_seats", label: "20 Seats", count: 20, icon: "🟥" },
];

const VIP_COLORS = { vip1: "#CD7F32", vip2: "#A8A8A8", vip3: "#FFD700" };

function buildPreviewSeats(count, currentSeats) {
  return Array.from({ length: count }, (_, i) => {
    const existing = currentSeats?.[i];
    return existing || { id: i + 1, state: "empty", user: null, isHost: i === 0 };
  });
}

export default function SeatManager({ onClose, currentSeats = [], currentLayout = "8_seats", onLayoutChange, onSeatAction }) {
  const [activeLayout, setActiveLayout] = useState(currentLayout);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [tab, setTab] = useState("layout"); // layout | seats
  const [confirmAction, setConfirmAction] = useState(null);

  const seatCount = LAYOUTS.find(l => l.id === activeLayout)?.count || 8;
  const previewSeats = buildPreviewSeats(seatCount, currentSeats);
  const selectedSeat = previewSeats.find(s => s.id === selectedSeatId);

  const handleApplyLayout = () => {
    onLayoutChange?.(activeLayout, seatCount);
    onClose?.();
  };

  const execSeatAction = (action) => {
    onSeatAction?.(action, selectedSeat);
    setSelectedSeatId(null);
    setConfirmAction(null);
  };

  const SEAT_ACTIONS = [
    { id: "lock_seat",       icon: <Lock size={15} />,           label: "Lock Seat",       color: "#9CA3AF", needsUser: false },
    { id: "unlock_seat",     icon: <Unlock size={15} />,         label: "Unlock Seat",     color: "#10B981", needsUser: false },
    { id: "mute_seat",       icon: <MicOff size={15} />,         label: "Mute User",       color: "#F59E0B", needsUser: true  },
    { id: "unmute_seat",     icon: <Mic size={15} />,            label: "Unmute User",     color: "#10B981", needsUser: true  },
    { id: "remove_user",     icon: <UserMinus size={15} />,      label: "Remove User",     color: "#EF4444", needsUser: true  },
    { id: "kick_to_audience",icon: <ArrowRightLeft size={15} />, label: "Kick to Audience",color: "#EF4444", needsUser: true  },
    { id: "move_user",       icon: <ArrowRightLeft size={15} />, label: "Move User",       color: "#3B82F6", needsUser: true  },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 350,
      background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480,
          background: "linear-gradient(180deg, #0f2a27 0%, #091e1b 100%)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(0,194,184,0.2)",
          maxHeight: "85vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 12px" }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: "#00C2B8" }}>🪑 Seat Manager</span>
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="rgba(255,255,255,0.6)" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: "0 16px 12px" }}>
          {[{ id: "layout", label: "Layout" }, { id: "seats", label: "Seat Controls" }].map(t => (
            <motion.button key={t.id} whileTap={{ scale: 0.94 }}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "9px 4px", borderRadius: 12, cursor: "pointer",
                background: tab === t.id ? "rgba(0,194,184,0.18)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${tab === t.id ? "rgba(0,194,184,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: tab === t.id ? "#00C2B8" : "rgba(255,255,255,0.45)",
                fontSize: 12, fontWeight: 800,
              }}>{t.label}</motion.button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* ── LAYOUT TAB ── */}
          {tab === "layout" && (
            <div style={{ padding: "0 16px 24px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, marginBottom: 12, letterSpacing: "0.06em" }}>
                SELECT SEAT LAYOUT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {LAYOUTS.map(l => (
                  <motion.button key={l.id} whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveLayout(l.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", borderRadius: 16, cursor: "pointer",
                      background: activeLayout === l.id ? "rgba(0,194,184,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${activeLayout === l.id ? "rgba(0,194,184,0.55)" : "rgba(255,255,255,0.07)"}`,
                    }}>
                    <span style={{ fontSize: 22 }}>{l.icon}</span>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: activeLayout === l.id ? "#00C2B8" : "#fff" }}>{l.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{l.count} microphone seats</div>
                    </div>
                    {activeLayout === l.id && (
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#00C2B8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: "#fff", fontWeight: 900,
                      }}>✓</div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Seat preview */}
              <div style={{
                marginTop: 16, padding: 14, borderRadius: 16,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(0,194,184,0.12)",
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: 10, letterSpacing: "0.06em" }}>PREVIEW</div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "6px 4px",
                }}>
                  {Array.from({ length: seatCount }, (_, i) => (
                    <div key={i} style={{
                      width: "100%", aspectRatio: "1",
                      borderRadius: "50%", maxWidth: 36,
                      background: i === 0 ? "rgba(255,215,0,0.2)" : "rgba(0,194,184,0.1)",
                      border: `1.5px solid ${i === 0 ? "rgba(255,215,0,0.5)" : "rgba(0,194,184,0.3)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 700,
                      margin: "0 auto",
                    }}>{i === 0 ? "👑" : i + 1}</div>
                  ))}
                </div>
              </div>

              {/* Apply button */}
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={handleApplyLayout}
                style={{
                  width: "100%", marginTop: 16, padding: "14px", borderRadius: 16,
                  background: "linear-gradient(135deg, #00C2B8, #009991)",
                  border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 900, color: "#fff",
                  boxShadow: "0 6px 20px rgba(0,194,184,0.35)",
                }}>
                Apply Layout
              </motion.button>
            </div>
          )}

          {/* ── SEAT CONTROLS TAB ── */}
          {tab === "seats" && (
            <div style={{ padding: "0 16px 24px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, marginBottom: 12, letterSpacing: "0.06em" }}>
                TAP A SEAT TO MANAGE
              </div>

              {/* Seat grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px 6px", marginBottom: 16,
              }}>
                {previewSeats.map(seat => {
                  const isSelected = selectedSeatId === seat.id;
                  const isOccupied = seat.state !== "empty" && seat.state !== "locked" && seat.user;
                  const isLocked = seat.state === "locked";
                  return (
                    <motion.button key={seat.id} whileTap={{ scale: 0.86 }}
                      onClick={() => setSelectedSeatId(isSelected ? null : seat.id)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                        padding: "8px 2px", borderRadius: 12, cursor: "pointer",
                        background: isSelected ? "rgba(0,194,184,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1.5px solid ${isSelected ? "#00C2B8" : isLocked ? "rgba(239,68,68,0.3)" : isOccupied ? "rgba(0,194,184,0.3)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: isLocked ? "rgba(239,68,68,0.15)" : isOccupied ? "rgba(0,194,184,0.15)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isLocked ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, overflow: "hidden",
                      }}>
                        {isLocked ? "🔒" : seat.isHost ? "👑" : isOccupied ? (
                          <img src={seat.user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : "🎙️"}
                      </div>
                      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                        {isOccupied ? seat.user.name.slice(0, 4) : seat.id}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action panel for selected seat */}
              <AnimatePresence>
                {selectedSeat && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      background: "rgba(0,0,0,0.4)", borderRadius: 16,
                      border: "1px solid rgba(0,194,184,0.18)", overflow: "hidden",
                    }}
                  >
                    {/* Selected seat info */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px 10px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "rgba(0,194,184,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                      }}>
                        {selectedSeat.user ? (
                          <img src={selectedSeat.user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: 16 }}>🎙️</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
                          Seat #{selectedSeat.id} {selectedSeat.isHost ? "👑" : ""}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                          {selectedSeat.user ? selectedSeat.user.name : "Empty"} · {selectedSeat.state}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 14px 14px" }}>
                      {SEAT_ACTIONS.filter(a => !a.needsUser || selectedSeat.user).map(a => (
                        <motion.button key={a.id} whileTap={{ scale: 0.9 }}
                          onClick={() => execSeatAction(a.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "7px 12px", borderRadius: 20, cursor: "pointer",
                            background: `${a.color}15`,
                            border: `1px solid ${a.color}44`,
                            color: a.color, fontSize: 11, fontWeight: 800,
                          }}>
                          {a.icon} {a.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedSeat && (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, padding: "20px 0" }}>
                  Select a seat above to manage it
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}