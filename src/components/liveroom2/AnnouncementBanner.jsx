/**
 * AnnouncementBanner — always-visible scrolling marquee announcement
 * Flutter: MarqueeWidget in a colored container
 */
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

export default function AnnouncementBanner({ text }) {
  if (!text) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "6px 14px",
      background: "rgba(0,194,184,0.08)",
      borderBottom: "1px solid rgba(0,194,184,0.12)",
      overflow: "hidden",
    }}>
      <Megaphone size={12} color="#00C2B8" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <motion.p
          animate={{ x: [0, -300] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          style={{
            whiteSpace: "nowrap", fontSize: 11, color: "rgba(255,255,255,0.65)",
            fontWeight: 600, margin: 0,
          }}>
          {text} &nbsp;&nbsp;&nbsp; {text}
        </motion.p>
      </div>
    </div>
  );
}