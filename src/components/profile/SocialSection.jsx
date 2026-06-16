import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SOCIAL = [
  { icon: "👨‍👩‍👧‍👦", label: "Family",    count: "1",      color: "#F97316", path: "/me/family"    },
  { icon: "👀",        label: "Visitors",  count: "48.2K",  color: "#3B82F6", path: "/me/visitors"  },
  { icon: "🤝",        label: "Friends",   count: "2,840",  color: "#10B981", path: "/me/friends"   },
  { icon: "❤️",        label: "Followers", count: "124K",   color: "#EC4899", path: "/me/followers" },
];

export default function SocialSection() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
      {SOCIAL.map(s => (
        <motion.button key={s.label} whileTap={{ scale: 0.92 }}
          onClick={() => navigate(s.path)}
          style={{
            background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
            borderRadius: 16, padding: "14px 6px", textAlign: "center",
            border: `1px solid ${s.color}22`,
            boxShadow: `0 4px 16px ${s.color}12`,
            cursor: "pointer",
          }}>
          <div style={{ fontSize: 22 }}>{s.icon}</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: s.color, marginTop: 2 }}>{s.count}</div>
          <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>{s.label}</div>
        </motion.button>
      ))}
    </div>
  );
}