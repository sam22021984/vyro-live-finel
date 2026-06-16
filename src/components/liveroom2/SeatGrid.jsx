/**
 * SeatGrid — renders seat layout (4/8/10/15/20/25 seats)
 * Each seat shows: avatar, level badge, VIP frame, mic status, country flag
 * Active speaker: audio wave + glow + pulse
 * Flutter: GridView with SeatWidget
 */
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Lock } from "lucide-react";
import AudioWave from "@/components/liveroom2/AudioWave";

const VIP_COLORS = {
  vip1: "#CD7F32",
  vip2: "#A8A8A8",
  vip3: "#FFD700",
  vip4: "#00C2B8",
  vip5: "#C084FC",
};

function SeatItem({ seat, onTap, index }) {
  const isEmpty = seat.state === "empty";
  const isActive = seat.state === "active";
  const isMuted = seat.state === "muted";
  const isLocked = seat.state === "locked";
  const isOccupied = seat.state === "occupied" || isActive || isMuted;
  const vipColor = seat.user?.vip ? VIP_COLORS[seat.user.vip] : null;

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => onTap(seat)}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 20 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer",
        position: "relative",
      }}>
      {/* Seat number */}
      <span style={{
        fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 700,
        position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
      }}>{seat.id}</span>

      {/* Avatar container */}
      <div style={{ position: "relative" }}>
        {/* Active glow pulse */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.0, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,194,184,0.6) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />
        )}

        {/* VIP frame ring */}
        {vipColor && (
          <div style={{
            position: "absolute", inset: -3, borderRadius: "50%",
            border: `2.5px solid ${vipColor}`,
            boxShadow: `0 0 10px ${vipColor}80`,
            zIndex: 1,
          }} />
        )}

        {/* Avatar circle */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          position: "relative", zIndex: 2,
          background: isLocked
            ? "rgba(255,255,255,0.06)"
            : isEmpty
              ? "rgba(0,194,184,0.1)"
              : "rgba(255,255,255,0.05)",
          border: isActive
            ? "2px solid #00C2B8"
            : isEmpty
              ? "2px dashed rgba(0,194,184,0.35)"
              : "2px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          boxShadow: isActive
            ? "0 0 18px rgba(0,194,184,0.55)"
            : "none",
        }}>
          {isLocked ? (
            <Lock size={18} color="rgba(255,255,255,0.3)" />
          ) : isEmpty ? (
            <span style={{ fontSize: 18, opacity: 0.5 }}>🎙️</span>
          ) : (
            <img
              src={seat.user?.avatar}
              alt={seat.user?.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          )}
        </div>

        {/* Host crown */}
        {seat.isHost && (
          <div style={{
            position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
            fontSize: 13, zIndex: 3,
          }}>👑</div>
        )}

        {/* Mic status overlay */}
        {isOccupied && (
          <div style={{
            position: "absolute", bottom: 0, right: 0, zIndex: 3,
            width: 16, height: 16, borderRadius: "50%",
            background: isMuted ? "#FF5252" : isActive ? "#00C2B8" : "#333",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid #0B0B0B",
          }}>
            {isMuted
              ? <MicOff size={8} color="#fff" />
              : <Mic size={8} color="#fff" />
            }
          </div>
        )}

        {/* Country flag */}
        {seat.user?.country && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, zIndex: 3,
            fontSize: 10,
          }}>{seat.user.country}</div>
        )}
      </div>

      {/* Audio wave (active speaker) */}
      {isActive && <AudioWave />}

      {/* Name / label */}
      <span style={{
        fontSize: 10, fontWeight: 700,
        color: isActive ? "#00C2B8" : isEmpty ? "rgba(255,255,255,0.3)" : "#fff",
        maxWidth: 56, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        marginTop: isActive ? 0 : 2,
      }}>
        {isLocked ? "Locked" : isEmpty ? `Seat ${seat.id}` : seat.user?.name}
      </span>

      {/* Level badge */}
      {seat.user?.level && (
        <span style={{
          fontSize: 8, fontWeight: 800,
          background: "linear-gradient(135deg,#00C2B8,#006e6a)",
          color: "#fff", padding: "1px 5px", borderRadius: 6,
          marginTop: -2,
        }}>Lv.{seat.user.level}</span>
      )}
    </motion.button>
  );
}

export default function SeatGrid({ seats, layout, onSeatTap }) {
  // Determine grid columns based on layout
  const cols = layout <= 4 ? 4 : layout <= 8 ? 4 : layout <= 10 ? 5 : layout <= 15 ? 5 : layout <= 20 ? 5 : 5;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "20px 8px",
      paddingTop: 16,
      paddingBottom: 8,
    }}>
      {seats.map((seat, i) => (
        <SeatItem key={seat.id} seat={seat} onTap={onSeatTap} index={i} />
      ))}
    </div>
  );
}