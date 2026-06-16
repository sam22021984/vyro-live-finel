/**
 * CreatePostSheet — bottom sheet to compose text/image/poll posts
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, BarChart2, Type } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TYPES = [
  { id: "text", icon: Type, label: "Text" },
  { id: "image", icon: Image, label: "Image" },
  { id: "poll", icon: BarChart2, label: "Poll" },
];

export default function CreatePostSheet({ onClose, onPost, currentUser }) {
  const [type, setType] = useState("text");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
    setUploading(false);
  };

  const submit = () => {
    if (!content.trim()) return;
    onPost({
      user_id: currentUser?.id || "me",
      user_name: currentUser?.full_name || "You",
      user_avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.id || "me"}`,
      type,
      content,
      image_url: type === "image" ? imageUrl : undefined,
      poll_options: type === "poll" ? pollOptions.filter(o => o.trim()) : undefined,
      poll_votes: type === "poll" ? Object.fromEntries(pollOptions.filter(o => o.trim()).map(o => [o, 0])) : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "#12122A", borderRadius: "22px 22px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "0 0 32px",
          maxHeight: "85vh", overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 14px" }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Create Post</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {/* Type selector */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px 14px" }}>
          {TYPES.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setType(id)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 12,
                background: type === id ? "rgba(147,51,234,0.25)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${type === id ? "rgba(147,51,234,0.6)" : "rgba(255,255,255,0.08)"}`,
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
              <Icon size={16} color={type === id ? "#9333EA" : "rgba(255,255,255,0.5)"} />
              <span style={{ fontSize: 10, fontWeight: 700, color: type === id ? "#9333EA" : "rgba(255,255,255,0.5)" }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Text area */}
        <div style={{ padding: "0 16px" }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind? 💭"
            rows={4}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
              padding: "12px 14px", color: "#fff", fontSize: 13, resize: "none",
              outline: "none", fontFamily: "inherit", lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Image upload */}
        {type === "image" && (
          <div style={{ padding: "10px 16px 0" }}>
            {imageUrl ? (
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
                <img src={imageUrl} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
                <button onClick={() => setImageUrl("")}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  <X size={14} color="#fff" />
                </button>
              </div>
            ) : (
              <label style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.12)",
                borderRadius: 14, padding: "28px 0", cursor: "pointer",
                color: "rgba(255,255,255,0.4)", fontSize: 13,
              }}>
                <Image size={18} />
                {uploading ? "Uploading..." : "Tap to upload image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
            )}
          </div>
        )}

        {/* Poll options */}
        {type === "poll" && (
          <div style={{ padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {pollOptions.map((opt, i) => (
              <input key={i} value={opt} onChange={e => {
                const next = [...pollOptions];
                next[i] = e.target.value;
                setPollOptions(next);
              }}
                placeholder={`Option ${i + 1}`}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
                }}
              />
            ))}
            {pollOptions.length < 4 && (
              <button onClick={() => setPollOptions(p => [...p, ""])}
                style={{
                  background: "none", border: "1px dashed rgba(147,51,234,0.4)", borderRadius: 10,
                  padding: "10px", color: "#9333EA", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>
                + Add Option
              </button>
            )}
          </div>
        )}

        {/* Submit */}
        <div style={{ padding: "16px 16px 0" }}>
          <motion.button whileTap={{ scale: 0.96 }} onClick={submit}
            disabled={!content.trim()}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 16,
              background: content.trim() ? "linear-gradient(135deg,#9333EA,#3B82F6)" : "rgba(255,255,255,0.08)",
              border: "none", cursor: content.trim() ? "pointer" : "not-allowed",
              color: "#fff", fontSize: 14, fontWeight: 800,
            }}>
            Post to Community
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}