/**
 * ToolsPanel — host/owner tools grid
 * Flutter: GridView in BottomSheet
 */
import { motion } from "framer-motion";
import { X } from "lucide-react";

const TOOLS = [
  { icon: "🔴", label: "Red Packet", key: "red_packet" },
  { icon: "🚀", label: "Rocket", key: "rocket" },
  { icon: "⚔️", label: "PK", key: "pk" },
  { icon: "🧹", label: "Clear Chat", key: "clear_chat" },
  { icon: "🪑", label: "Seat Manager", key: "seat_manager" },
  { icon: "🎨", label: "Room Theme", key: "room_theme" },
  { icon: "🔇", label: "Sound Effects", key: "sound_effects" },
  { icon: "🔗", label: "Share", key: "share" },
  { icon: "🔒", label: "Lock", key: "lock" },
  { icon: "📹", label: "Videos", key: "videos" },
  { icon: "🙋", label: "Apply", key: "apply_mod" },
  { icon: "🖼️", label: "Photo", key: "photo" },
];

const ENTERTAINMENT = [
  { icon: "🎙️", label: "Mic FX", key: "mic_fx" },
  { icon: "🎂", label: "Birthday", key: "birthday" },
  { icon: "💞", label: "Match", key: "match" },
];

export default function ToolsPanel({ onClose, onPK }) {
  const handleTool = (key) => {
    if (key === "pk") { onPK?.(); return; }
    onClose?.();
  };

  return (
    <div style={{
      height: "100%", overflowY: "auto",
      background: "#111",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px 4px",
      }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>🛠 Tools</span>
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

      {/* Main grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12, padding: "12px 16px",
      }}>
        {TOOLS.map((tool, i) => (
          <motion.button key={tool.key}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => handleTool(tool.key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "14px 6px",
              cursor: "pointer",
            }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(0,194,184,0.12)",
              border: "1px solid rgba(0,194,184,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>{tool.icon}</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
              {tool.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Entertainment section */}
      <div style={{ padding: "4px 16px 16px" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)",
          marginBottom: 10, letterSpacing: "0.08em",
        }}>ENTERTAINMENT</div>
        <div style={{ display: "flex", gap: 12 }}>
          {ENTERTAINMENT.map((tool, i) => (
            <motion.button key={tool.key}
              whileTap={{ scale: 0.88 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "14px 20px",
                cursor: "pointer",
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(255,215,0,0.10)",
                border: "1px solid rgba(255,215,0,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>{tool.icon}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                {tool.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}