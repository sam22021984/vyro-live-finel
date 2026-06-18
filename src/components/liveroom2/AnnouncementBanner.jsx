/**
 * AnnouncementBanner — always visible, owner can edit
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AnnouncementBanner({ text, onEdit }) {
  const [showEdit, setShowEdit] = useState(false);
  const [draft, setDraft] = useState(text);

  const save = () => {
    onEdit?.(draft);
    setShowEdit(false);
  };

  return (
    <>
      <motion.div
        style={{
          margin: "8px 0 4px",
          background: "rgba(255,82,82,0.08)",
          border: "1px solid rgba(255,82,82,0.2)",
          borderRadius: 10,
          padding: "8px 10px",
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          cursor: "pointer",
        }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setShowEdit(true)}
      >
        <span style={{ fontSize: 12, flexShrink: 0 }}>📢</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, flex: 1 }}>
          {text}
        </span>
        <span style={{ fontSize: 9, color: "rgba(255,82,82,0.6)", fontWeight: 700, flexShrink: 0 }}>✏️</span>
      </motion.div>

      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            onClick={() => setShowEdit(false)}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#162420", borderRadius: "22px 22px 0 0", padding: "20px 20px 40px", width: "100%", maxWidth: 480, border: "1px solid rgba(255,82,82,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>📢 Edit Announcement</span>
                <button onClick={() => setShowEdit(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={18} color="rgba(255,255,255,0.5)" />
                </button>
              </div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={4}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, padding: "12px", color: "#fff", fontSize: 13, resize: "none", outline: "none",
                  fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => setShowEdit(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={save}
                  style={{ flex: 1, padding: 12, borderRadius: 12, background: "linear-gradient(135deg,#00C2B8,#006e6a)", border: "none", color: "#fff", fontWeight: 900, cursor: "pointer" }}>
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}