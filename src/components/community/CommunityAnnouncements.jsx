/**
 * CommunityAnnouncements — admin-only broadcast announcements with read tracking
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Pin, Megaphone, CheckCheck } from "lucide-react";

const MOCK_ANNOUNCEMENTS = [
  {
    id: "a1", title: "🎉 Community Feature Launch!",
    content: "We're excited to announce the launch of VYRO Community — your new hub for posts, groups, and real-time discussions. Connect, share, and engage with the VYRO family like never before! 💜",
    is_pinned: true, is_broadcast: true,
    created_date: new Date(Date.now() - 1000*60*60*2).toISOString(),
    read_by: [],
  },
  {
    id: "a2", title: "⚠️ Community Guidelines Update",
    content: "Please review our updated community guidelines. Key changes: No video uploads, no private messaging through Community. All interactions should respect other members. Violations may result in account restrictions.",
    is_pinned: false, is_broadcast: true,
    created_date: new Date(Date.now() - 1000*60*60*24).toISOString(),
    read_by: [],
  },
  {
    id: "a3", title: "🏆 Top Host Rankings — June 2026",
    content: "Congratulations to our top hosts this month! 🥇 Luna ✨ (12,400 diamonds) 🥈 Rex 🎵 (9,800 diamonds) 🥉 Nova 🌺 (7,200 diamonds). Keep streaming and climbing the ranks!",
    is_pinned: false, is_broadcast: true,
    created_date: new Date(Date.now() - 1000*60*60*48).toISOString(),
    read_by: ["u1", "u2"],
  },
];

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / (1000*60*60*24));
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

export default function CommunityAnnouncements({ currentUser }) {
  const [readIds, setReadIds] = useState(new Set());

  const markRead = (id) => setReadIds(prev => new Set([...prev, id]));

  return (
    <div style={{ paddingBottom: 80 }}>
      {MOCK_ANNOUNCEMENTS.map((ann, i) => {
        const isRead = readIds.has(ann.id) || ann.read_by?.includes(currentUser?.id);
        return (
          <motion.div key={ann.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => markRead(ann.id)}
            style={{
              marginBottom: 12, borderRadius: 18, cursor: "pointer",
              background: ann.is_pinned ? "rgba(147,51,234,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${ann.is_pinned ? "rgba(147,51,234,0.3)" : "rgba(255,255,255,0.07)"}`,
              padding: "14px",
              opacity: isRead ? 0.7 : 1,
            }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: ann.is_pinned ? "rgba(147,51,234,0.2)" : "rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {ann.is_pinned
                  ? <Pin size={16} color="#9333EA" />
                  : <Megaphone size={16} color="rgba(255,255,255,0.5)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{ann.title}</span>
                  {ann.is_pinned && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, color: "#9333EA",
                      background: "rgba(147,51,234,0.15)", borderRadius: 6, padding: "2px 6px",
                    }}>PINNED</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                  VYRO Official · {timeAgo(ann.created_date)}
                </div>
              </div>
              {isRead && <CheckCheck size={14} color="#00C2B8" style={{ flexShrink: 0, marginTop: 2 }} />}
            </div>

            {/* Content */}
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: 0 }}>
              {ann.content}
            </p>

            {!isRead && (
              <div style={{ marginTop: 10 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "#9333EA",
                  background: "rgba(147,51,234,0.1)", borderRadius: 8, padding: "4px 10px",
                }}>
                  Tap to mark as read
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}