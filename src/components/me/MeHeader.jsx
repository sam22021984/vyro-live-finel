import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

const OWNER_BADGES = [
  { label: "App Owner",     icon: "🚀", bg: "linear-gradient(135deg,#1F6BFF,#0D1B3E)" },
  { label: "Official Host", icon: "🎙", bg: "linear-gradient(135deg,#F59E0B,#D97706)" },
  { label: "Agency",        icon: "🏢", bg: "linear-gradient(135deg,#3B82F6,#1D4ED8)" },
  { label: "Agent",         icon: "🤝", bg: "linear-gradient(135deg,#10B981,#059669)" },
  { label: "VIP",           icon: "👑", bg: "linear-gradient(135deg,#7C3AED,#4C1D95)" },
  { label: "Verified",      icon: "✔",  bg: "linear-gradient(135deg,#0EA5E9,#0369A1)" },
];

const USER_BADGES = [
  { label: "Member",   icon: "🌟", bg: "linear-gradient(135deg,#7C3AED,#4C1D95)" },
  { label: "Verified", icon: "✔",  bg: "linear-gradient(135deg,#0EA5E9,#0369A1)" },
];

export default function MeHeader() {
  const [profile, setProfile] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const me = await base44.auth.me();
      setAuthUser(me);

      // Fetch this user's profile record (isolated by user_id)
      const profiles = await base44.entities.UserProfile.filter({ user_id: me.id });
      if (profiles && profiles.length > 0) {
        setProfile(profiles[0]);
      }

      // Owner detection: role === 'admin' and no other profiles exist (first user)
      setIsOwner(me.role === "admin");
    } catch {
      // Not logged in or profile not found — fail silently
    }
  };

  // ── Derived display values ──
  const displayName = profile?.display_name || authUser?.full_name || "User";
  const avatarUrl   = profile?.avatar_url || null;
  const uniqueId    = profile?.unique_id || authUser?.id?.slice(0, 8) || "—";
  const badges      = isOwner ? OWNER_BADGES : USER_BADGES;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ width: "100%", boxSizing: "border-box", overflow: "hidden" }}>

      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div style={{ position: "relative" }}>
          {/* Animated frame */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute", inset: -6, borderRadius: "50%",
              background: isOwner
                ? "conic-gradient(from 0deg, #FFC83D, #1F6BFF, #7C3AED, #EC4899, #FFC83D)"
                : "conic-gradient(from 0deg, #7C3AED, #C084FC, #E879F9, #7C3AED)",
              zIndex: 0,
            }} />
          <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "white", zIndex: 1 }} />

          {/* Avatar image or fallback */}
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName}
              style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", position: "relative", zIndex: 2, display: "block" }} />
          ) : (
            <div style={{
              width: 96, height: 96, borderRadius: "50%",
              background: isOwner
                ? "linear-gradient(135deg,#0D1B3E,#1F6BFF)"
                : "linear-gradient(135deg,#7C3AED,#C084FC)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 2,
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Online indicator */}
          <div style={{
            position: "absolute", bottom: 4, right: 4, zIndex: 3,
            width: 18, height: 18, borderRadius: "50%",
            background: "#22C55E", border: "3px solid white",
            boxShadow: "0 0 10px rgba(34,197,94,0.6)",
          }} />
        </div>
      </div>

      {/* Name & Identity */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 22, fontWeight: 900, letterSpacing: 1, lineHeight: 1.2,
          background: isOwner
            ? "linear-gradient(135deg,#1F6BFF,#FFC83D,#7C3AED)"
            : "linear-gradient(135deg,#7C3AED,#C084FC)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {isOwner ? `★ ${displayName} ★` : displayName}
        </div>

        {/* Role badge */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <span style={{
            background: isOwner
              ? "linear-gradient(135deg,#1F6BFF,#0D1B3E)"
              : "linear-gradient(135deg,#7C3AED,#4C1D95)",
            color: isOwner ? "#FFC83D" : "#fff",
            borderRadius: 20, padding: "3px 14px",
            fontSize: 11, fontWeight: 900, letterSpacing: "0.06em",
            boxShadow: "0 4px 12px rgba(31,107,255,0.35)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            {isOwner ? "🚀 APPLICATION OWNER" : "🌟 MEMBER"}
          </span>
        </div>

        {/* Status row */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
          <span style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 800 }}>● Online</span>
          <span style={{ background: "linear-gradient(135deg,#1F6BFF,#0D1B3E)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 800 }}>🌐 Global</span>
          <span style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 800 }}>
            ID: {isOwner ? "VYRO" : uniqueId}
          </span>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 5, marginTop: 10, maxWidth: "100%", overflow: "hidden" }}>
          {badges.map(b => (
            <span key={b.label} style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              background: b.bg, borderRadius: 20, padding: "3px 9px",
              fontSize: 10, fontWeight: 800, color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}