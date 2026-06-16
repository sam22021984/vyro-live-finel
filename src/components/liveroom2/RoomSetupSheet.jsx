/**
 * RoomSetupSheet — edit room cover, title, announcement, tags, layout, start
 * Flutter: BottomSheet with Form widgets
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";

const TAGS = ["AI", "Pop", "R&B/Soul", "Party", "Legend", "Lyric", "Hora", "In-Door", "Music", "Lit"];
const LAYOUTS = [4, 8, 10, 15, 20, 25];

export default function RoomSetupSheet({ onClose }) {
  const [title, setTitle] = useState("Late Night Vibes 🌙");
  const [announcement, setAnnouncement] = useState("Welcome! No hate speech. Be respectful.");
  const [selectedTags, setSelectedTags] = useState(["Party", "Music"]);
  const [layout, setLayout] = useState(15);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 5)
    );
  };

  return (
    <>
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.6)" }} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 501,
          background: "#f8f8f8",
          borderRadius: "24px 24px 0 0",
          padding: "0 0 32px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)" }} />
        </div>

        {/* Room Cover */}
        <div style={{ padding: "16px 16px 8px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}>
            ROOM COVER
          </label>
          <div style={{ marginTop: 8 }}>
            <div style={{
              width: "100%", height: 140, borderRadius: 14,
              background: "linear-gradient(135deg,#667eea,#764ba2)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, border: "2px dashed rgba(255,255,255,0.3)", cursor: "pointer",
              overflow: "hidden", position: "relative",
            }}>
              <img
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=60"
                alt="cover"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <Camera size={24} color="#fff" />
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginTop: 4 }}>Add Cover</div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Title */}
        <div style={{ padding: "8px 16px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}>
            ROOM TITLE
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Laughing so much you..."
            style={{
              width: "100%", marginTop: 6,
              padding: "11px 14px", borderRadius: 12,
              background: "#fff", border: "1px solid #e5e7eb",
              fontSize: 14, color: "#111", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Announcement */}
        <div style={{ padding: "8px 16px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}>
            ROOM ANNOUNCEMENT
          </label>
          <textarea
            value={announcement}
            onChange={e => setAnnouncement(e.target.value)}
            placeholder="Please write the room announcement"
            rows={3}
            style={{
              width: "100%", marginTop: 6,
              padding: "11px 14px", borderRadius: 12,
              background: "#fff", border: "1px solid #e5e7eb",
              fontSize: 13, color: "#111", outline: "none", resize: "none",
              boxSizing: "border-box", lineHeight: 1.5,
            }}
          />
        </div>

        {/* Seat Layout */}
        <div style={{ padding: "8px 16px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}>
            SEAT LAYOUT
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {LAYOUTS.map(l => (
              <motion.button key={l} whileTap={{ scale: 0.92 }}
                onClick={() => setLayout(l)}
                style={{
                  padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  border: "none", cursor: "pointer",
                  background: layout === l ? "#00C2B8" : "#f0f0f0",
                  color: layout === l ? "#fff" : "#555",
                }}>{l} Seats</motion.button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ padding: "8px 16px" }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}>
            ROOM TAG
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {TAGS.map(tag => (
              <motion.button key={tag} whileTap={{ scale: 0.92 }}
                onClick={() => toggleTag(tag)}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  border: "none", cursor: "pointer",
                  background: selectedTags.includes(tag)
                    ? "linear-gradient(135deg,#00C2B8,#006e6a)"
                    : "#f0f0f0",
                  color: selectedTags.includes(tag) ? "#fff" : "#555",
                }}>{tag}</motion.button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <div style={{ padding: "20px 16px 8px" }}>
          <motion.button whileTap={{ scale: 0.96 }} onClick={onClose}
            style={{
              width: "100%", padding: "14px 0",
              borderRadius: 24,
              background: "linear-gradient(135deg,#00C2B8,#006e6a)",
              border: "none", cursor: "pointer",
              fontSize: 15, fontWeight: 900, color: "#fff",
              boxShadow: "0 8px 24px rgba(0,194,184,0.4)",
            }}>
            ▶ Start Room
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}