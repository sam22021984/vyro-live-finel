/**
 * Social Module — Premium Enterprise Social Network
 * Access: Home Screen → More Services → Social (4th grid item)
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SocialMyInvite    from "@/components/social/SocialMyInvite";
import SocialMyPeople    from "@/components/social/SocialMyPeople";
import SocialFriends     from "@/components/social/SocialFriends";
import SocialRelationship from "@/components/social/SocialRelationship";
import SocialFamily      from "@/components/social/SocialFamily";

const SECTIONS = [
  { id: "invite",       label: "My Invite",    icon: "🎟️", color: "#1F6BFF", desc: "Invite friends & earn rewards" },
  { id: "people",       label: "My People",    icon: "👥", color: "#8B5CF6", desc: "All your connected users" },
  { id: "friends",      label: "Friends",      icon: "🤝", color: "#10B981", desc: "Mutual friendship system" },
  { id: "relationship", label: "Relationship", icon: "💑", color: "#EC4899", desc: "Couple & romantic system" },
  { id: "family",       label: "Family",       icon: "🏠", color: "#F59E0B", desc: "Group family community" },
];

const SECTION_COMPONENTS = {
  invite:       <SocialMyInvite />,
  people:       <SocialMyPeople />,
  friends:      <SocialFriends />,
  relationship: <SocialRelationship />,
  family:       <SocialFamily />,
};

export default function Social() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const current = SECTIONS.find(s => s.id === active);

  return (
    <div style={{ minHeight: "100dvh", width: "100%", maxWidth: "100vw", overflowX: "hidden", boxSizing: "border-box", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: "max(90px,calc(90px + env(safe-area-inset-bottom,0px)))" }}>

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #F0F0F8",
        padding: "12px 16px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => active ? setActive(null) : navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>
              {current ? `${current.icon} ${current.label}` : "Social"}
            </div>
            {!current && <div style={{ fontSize: 10, color: "#9CA3AF" }}>Connect · Friends · Family · Relationship</div>}
            {current && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{current.desc}</div>}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "16px" }}>

            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
              borderRadius: 20, padding: "24px 20px", marginBottom: 16,
              boxShadow: "0 8px 28px rgba(31,107,255,0.28)",
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Your Social World</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                Invite friends · Manage people · Connect with friends · Build relationships · Create your family
              </div>
            </div>

            {/* Section Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SECTIONS.map((s, i) => (
                <motion.button key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActive(s.id)}
                  style={{
                    background: "#fff", borderRadius: 16, padding: "16px",
                    border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                  }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <ChevronRight size={16} color={s.color} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={active}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {SECTION_COMPONENTS[active]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}