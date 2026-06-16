import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MeHeader from "@/components/me/MeHeader";
import MeVIPSection from "@/components/me/MeVIPSection";
import MeLevelCards from "@/components/me/MeLevelCards";
import MeStats from "@/components/me/MeStats";
import MeSocial from "@/components/me/MeSocial";
import MeHistory from "@/components/me/MeHistory";
import MeAchievements from "@/components/me/MeAchievements";
import MeAbout from "@/components/me/MeAbout";
import MeDailyActivity from "@/components/me/MeDailyActivity";
import MePrivacy from "@/components/me/MePrivacy";
import MeCustomization from "@/components/me/MeCustomization";
import MeThemes from "@/components/me/MeThemes";
import MeExtras from "@/components/me/MeExtras";
import MeMoreMenu from "@/components/me/MeMoreMenu";

const TABS = ["Profile", "Stats", "History", "Settings"];

export default function Me() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fdfcff 0%, #f5f0ff 40%, #fff8f0 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: 100,
      overflowX: "hidden",
    }}>
      {/* Cover Photo */}
      <div style={{
        height: 160,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80') center/cover",
          opacity: 0.3,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 30%, rgba(253,252,255,0.95) 100%)",
        }} />
        {/* Action Buttons */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
          {["💬", "🤝", "🔗"].map((icon, i) => (
            <motion.button key={i} whileTap={{ scale: 0.88 }}
              style={{
                width: 36, height: 36, borderRadius: 18,
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.6)",
                fontSize: 16, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>{icon}</motion.button>
          ))}
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setShowMoreMenu(true)}
            style={{
              width: 36, height: 36, borderRadius: 18,
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              fontSize: 16, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>⋮</motion.button>
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -70 }}>
        <MeHeader />

        {/* Follow & Message Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <motion.button whileTap={{ scale: 0.96 }} style={{
            flex: 1, padding: "10px 0", borderRadius: 24,
            background: "linear-gradient(135deg, #7C3AED, #C084FC)",
            color: "#fff", fontWeight: 800, fontSize: 13,
            border: "none", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
          }}>❤️ Follow</motion.button>
          <motion.button whileTap={{ scale: 0.96 }} style={{
            flex: 1, padding: "10px 0", borderRadius: 24,
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
            color: "#7C3AED", fontWeight: 800, fontSize: 13,
            border: "1.5px solid rgba(124,58,237,0.25)", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}>💬 Message</motion.button>
          <motion.button whileTap={{ scale: 0.96 }} style={{
            width: 44, height: 44, borderRadius: 22,
            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
            color: "#7C3AED", fontWeight: 800, fontSize: 18,
            border: "1.5px solid rgba(124,58,237,0.25)", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          }}>+</motion.button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)",
          borderRadius: 16, padding: 4, marginTop: 16, gap: 2,
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          {TABS.map(tab => (
            <motion.button key={tab} onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.96 }}
              style={{
                flex: 1, padding: "9px 4px", borderRadius: 12, fontSize: 11,
                fontWeight: 800, cursor: "pointer", border: "none", transition: "all 0.2s",
                background: activeTab === tab
                  ? "linear-gradient(135deg,#7C3AED,#C084FC)"
                  : "transparent",
                color: activeTab === tab ? "#fff" : "#9CA3AF",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
              }}>{tab}</motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {activeTab === "Profile" && (
              <>
                <MeVIPSection />
                <MeLevelCards />
                <MeStats />
                <MeSocial />
                <MeExtras />
                <MeAbout />
                <MeAchievements />
              </>
            )}
            {activeTab === "Stats" && (
              <>
                <MeDailyActivity />
                <MeHistory />
              </>
            )}
            {activeTab === "Settings" && (
              <>
                <MeCustomization />
                <MeThemes />
                <MePrivacy />
              </>
            )}
            {activeTab === "History" && <MeHistory />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMoreMenu && <MeMoreMenu onClose={() => setShowMoreMenu(false)} />}
      </AnimatePresence>
    </div>
  );
}