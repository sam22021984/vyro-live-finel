/**
 * SeatGrid — matches reference: teal-bordered circles on dark teal bg, 5-col grid
 * States: empty (numbered mic icon), occupied, active (wave+glow), muted, locked
 * Flutter: GridView.builder with SeatTile widget
 */
import { motion, AnimatePresence } from "framer-motion";
import { MicOff, Lock } from "lucide-react";
import AudioWave from "@/components/liveroom2/AudioWave";
import SeatGlowEffect from "@/components/liveroom2/SeatGlowEffect";

const VIP_COLORS = {
  vip1: "#CD7F32",
  vip2: "#A8A8A8",
  vip3: "#FFD700",
  vip4: "#00C2B8",
  vip5: "#C084FC",
};

function SeatItem({ seat, onTap, index, glowType }) {
  const isEmpty = seat.state === "empty";
  const isActive = seat.state === "active";
  const isMuted = seat.state === "muted";
  const isLocked = seat.state === "locked";
  const isOccupied = !isEmpty && !isLocked;
  const vipColor = seat.user?.vip ? VIP_COLORS[seat.user.vip] : null;

  return (
    <motion.button
      whileTap={{ scale: 0.86 }}
      onClick={() => onTap(seat)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.025, type: "spring", stiffness: 320, damping: 22 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        background: "none", border: "none", cursor: "pointer",
        position: "relative", padding: "10px 2px 2px",
        minWidth: 0,
      }}>

      {/* Seat number label */}
      <span style={{
        position: "absolute", top: 2, left: "50%", transform: "translateX(-50%)",
        fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700,
        lineHeight: 1,
      }}>{seat.id}</span>

      {/* Avatar container */}
      <div style={{ position: "relative" }}>
        {/* Active glow pulse ring */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{
              position: "absolute", inset: -5, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,194,184,0.55) 0%, transparent 70%)",
              zIndex: 0,
            }}
          />
        )}

        {/* VIP ring */}
        {vipColor && (
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{
              position: "absolute", inset: -3, borderRadius: "50%",
              border: `2px solid ${vipColor}`,
              boxShadow: `0 0 8px ${vipColor}99`,
              zIndex: 1,
            }}
          />
        )}

        {/* Outer teal border ring — matches reference */}
        <div style={{
          position: "absolute", inset: -2, borderRadius: "50%",
          border: isActive
            ? "2px solid #00C2B8"
            : isLocked
            ? "2px solid rgba(255,255,255,0.1)"
            : isEmpty
            ? "2px solid rgba(0,194,184,0.5)"
            : "2px solid rgba(0,194,184,0.6)",
          boxShadow: isActive ? "0 0 14px rgba(0,194,184,0.6)" : "none",
          zIndex: 2,
        }} />

        {/* Avatar circle */}
        <div style={{
          width: 46, height: 46, borderRadius: "50%",
          position: "relative", zIndex: 3,
          background: isLocked
            ? "#1a3532"
            : isEmpty
            ? "#153530"
            : "#1a3532",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {isLocked ? (
            <Lock size={16} color="rgba(255,255,255,0.3)" />
          ) : isEmpty ? (
            <span style={{ fontSize: 16, opacity: 0.55 }}>🎙️</span>
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
            position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
            fontSize: 12, zIndex: 4,
          }}>👑</div>
        )}

        {/* Muted badge */}
        {isMuted && (
          <div style={{
            position: "absolute", bottom: -1, right: -1, zIndex: 4,
            width: 14, height: 14, borderRadius: "50%",
            background: "#FF5252",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid #0D2B28",
          }}>
            <MicOff size={7} color="#fff" />
          </div>
        )}

        {/* Country flag */}
        {seat.user?.country && !isMuted && (
          <div style={{
            position: "absolute", bottom: -2, right: -3, zIndex: 4,
            fontSize: 9, lineHeight: 1,
          }}>{seat.user.country}</div>
        )}

        {/* Glow effect on gift/emoji receive */}
        <SeatGlowEffect
          type={glowType || "gift"}
          active={!!glowType}
          color={glowType === "hammer" ? "#FF5252" : glowType === "emoji" ? "#C084FC" : "#FFD700"}
        />
      </div>

      {/* Audio wave below avatar for active speaker */}
      {isActive && (
        <div style={{ marginTop: 1 }}>
          <AudioWave size="sm" color="#00C2B8" />
        </div>
      )}

      {/* Name */}
      <span style={{
        fontSize: 9, fontWeight: 700,
        color: isActive ? "#00C2B8" : isEmpty ? "rgba(255,255,255,0.28)" : "#e0f7f5",
        maxWidth: 52, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        lineHeight: 1.2,
        marginTop: isActive ? 0 : 1,
      }}>
        {isLocked ? "Locked" : isEmpty ? `${seat.id}` : seat.user?.name}
      </span>

      {/* Level badge */}
      {seat.user?.level && (
        <span style={{
          fontSize: 7, fontWeight: 800,
          background: "linear-gradient(135deg,#00C2B8,#006e6a)",
          color: "#fff", padding: "1px 4px", borderRadius: 4,
          marginTop: -1,
        }}>Lv.{seat.user.level}</span>
      )}
    </motion.button>
  );
}

export default function SeatGrid({ seats, layout, onSeatTap, seatGlows = {} }) {
  const cols = layout <= 4 ? 4 : 5;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "8px 4px",
      paddingTop: 6,
    }}>
      {seats.map((seat, i) => (
        <SeatItem key={seat.id} seat={seat} onTap={onSeatTap} index={i} glowType={seatGlows[seat.id]} />
      ))}
    </div>
  );
}