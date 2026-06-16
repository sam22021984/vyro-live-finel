import { motion } from "framer-motion";
import { Copy, MessageCircle, Heart, UserPlus, Share2, MoreHorizontal, CheckCircle, Mic, Shield, Users, Crown } from "lucide-react";
import { useState } from "react";

const BADGE = ({ label, gradient, BadgeIcon }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 3,
    background: gradient, borderRadius: 20, padding: "2px 8px",
    fontSize: 10, fontWeight: 800, color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  }}>
    {BadgeIcon && <BadgeIcon size={10} />} {label}
  </span>
);

export default function ProfileHeader() {
  const [copied, setCopied] = useState(false);
  const [followed, setFollowed] = useState(false);

  const copyId = () => {
    navigator.clipboard?.writeText("PK-920000000001");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px)",
      borderRadius: 24, padding: "0 16px 20px",
      border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: "0 8px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* Avatar + Online */}
      <div className="flex flex-col items-center" style={{ marginTop: -52 }}>
        <div style={{ position: "relative" }}>
          {/* Animated VIP ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", inset: -5, borderRadius: "50%",
              background: "conic-gradient(#F59E0B,#EC4899,#7C3AED,#3B82F6,#10B981,#F59E0B)",
              zIndex: 0,
            }}
          />
          <div style={{
            position: "absolute", inset: -3, borderRadius: "50%",
            background: "#fff", zIndex: 1,
          }} />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
            alt="SAM"
            style={{
              width: 100, height: 100, borderRadius: "50%", objectFit: "cover",
              position: "relative", zIndex: 2,
              border: "3px solid #fff",
            }}
          />
          {/* Online dot */}
          <div style={{
            position: "absolute", bottom: 4, right: 4, zIndex: 3,
            width: 14, height: 14, borderRadius: "50%",
            background: "#22C55E", border: "2px solid #fff",
            boxShadow: "0 0 8px rgba(34,197,94,0.6)",
          }} />
        </div>

        {/* Name + badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
          <span style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", letterSpacing: "0.02em" }}>
            ★ SAM ★
          </span>
          <CheckCircle size={18} color="#3B82F6" fill="#3B82F6" />
        </div>

        {/* Country + Gender + ID */}
        <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: "#6B7280" }}>
          <span>🇵🇰 Pakistan</span>
          <span>•</span>
          <span>♂ Male</span>
        </div>

        {/* ID row */}
        <div className="flex items-center gap-2 mt-1">
          <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>PK-920000000001</span>
          <button onClick={copyId} style={{
            background: copied ? "#22C55E" : "linear-gradient(135deg,#7C3AED,#3B82F6)",
            border: "none", borderRadius: 10, padding: "2px 8px",
            color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {copied ? "✓ Copied!" : <><Copy size={10} style={{ display: "inline", marginRight: 2 }} />Copy ID</>}
          </button>
        </div>

        {/* Badge row */}
        <div className="flex flex-wrap gap-1.5 justify-center mt-3">
          <BADGE label="Official Host" gradient="linear-gradient(135deg,#F59E0B,#EF4444)" BadgeIcon={Mic} />
          <BADGE label="VIP Legend" gradient="linear-gradient(135deg,#7C3AED,#EC4899)" BadgeIcon={Crown} />
          <BADGE label="Agency" gradient="linear-gradient(135deg,#0EA5E9,#6366F1)" BadgeIcon={Shield} />
          <BADGE label="Agent" gradient="linear-gradient(135deg,#10B981,#0EA5E9)" BadgeIcon={Shield} />
          <BADGE label="Family" gradient="linear-gradient(135deg,#F97316,#EF4444)" BadgeIcon={Users} />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4 w-full">
          {[
            { icon: MessageCircle, label: "Message",  gradient: "linear-gradient(135deg,#3B82F6,#6366F1)", action: () => {} },
            { icon: Heart,         label: followed ? "Following" : "Follow", gradient: followed ? "linear-gradient(135deg,#22C55E,#10B981)" : "linear-gradient(135deg,#EC4899,#EF4444)", action: () => setFollowed(f => !f) },
            { icon: UserPlus,      label: "Add Friend", gradient: "linear-gradient(135deg,#F59E0B,#F97316)", action: () => {} },
            { icon: Share2,        label: "Share",    gradient: "linear-gradient(135deg,#8B5CF6,#7C3AED)", action: () => {} },
          ].map(btn => (
            <motion.button key={btn.label} whileTap={{ scale: 0.92 }} onClick={btn.action}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                background: btn.gradient, border: "none", borderRadius: 14, padding: "8px 4px",
                color: "#fff", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>
              <btn.icon size={16} />
              <span style={{ fontSize: 9, fontWeight: 700 }}>{btn.label}</span>
            </motion.button>
          ))}
          <motion.button whileTap={{ scale: 0.92 }} style={{
            width: 44, background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.15)",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <MoreHorizontal size={18} color="#7C3AED" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}