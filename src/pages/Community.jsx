/**
 * Community — VYRO Community System
 * Tabs: Feed | Groups | Announcements
 * WhatsApp community + channel integration
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Users, Rss, Megaphone, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import CommunityFeed from "@/components/community/CommunityFeed";
import CommunityGroups from "@/components/community/CommunityGroups";
import CommunityAnnouncements from "@/components/community/CommunityAnnouncements";

const WA_COMMUNITY = "https://chat.whatsapp.com/J6woqKB3Zv48QC347grVLS";
const WA_CHANNEL = "https://whatsapp.com/channel/0029VbCVeNT9MF94PB4JXN3B";

const TABS = [
  { id: "feed", label: "Feed", icon: Rss },
  { id: "groups", label: "Groups", icon: Users },
  { id: "announcements", label: "Updates", icon: Megaphone },
];

export default function Community() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{
      minHeight: "100dvh",
      width: "100%",
      maxWidth: "100vw",
      overflowX: "hidden",
      boxSizing: "border-box",
      background: "#0D0D1A",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px 0",
        background: "rgba(13,13,26,0.95)",
        backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
              Community
            </h1>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "2px 0 0" }}>
              Connect · Share · Engage
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowSearch(v => !v)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
              <Search size={16} color="rgba(255,255,255,0.7)" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.88 }}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                position: "relative",
              }}>
              <Bell size={16} color="rgba(255,255,255,0.7)" />
              <div style={{
                position: "absolute", top: 6, right: 6, width: 8, height: 8,
                borderRadius: "50%", background: "#EC4899",
                border: "2px solid #0D0D1A",
              }} />
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", marginBottom: 10 }}>
              <input
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search posts, groups..."
                autoFocus
                style={{
                  width: "100%", background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                  padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <a href={WA_COMMUNITY} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "9px 0", borderRadius: 14, textDecoration: "none",
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              color: "#fff", fontSize: 12, fontWeight: 800,
            }}>
            <span style={{ fontSize: 15 }}>💬</span>
            Join Community
          </a>
          <a href={WA_CHANNEL} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "9px 0", borderRadius: 14, textDecoration: "none",
              background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)",
              color: "#25D366", fontSize: 12, fontWeight: 800,
            }}>
            <span style={{ fontSize: 15 }}>📢</span>
            Follow Channel
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button key={tab.id} whileTap={{ scale: 0.94 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  padding: "10px 0", background: "none", border: "none", cursor: "pointer",
                  borderBottom: `2px solid ${active ? "#9333EA" : "transparent"}`,
                  marginBottom: -1,
                }}>
                <Icon size={14} color={active ? "#9333EA" : "rgba(255,255,255,0.4)"} />
                <span style={{ fontSize: 12, fontWeight: 700, color: active ? "#9333EA" : "rgba(255,255,255,0.4)" }}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}>
            {activeTab === "feed" && <CommunityFeed currentUser={user} />}
            {activeTab === "groups" && <CommunityGroups currentUser={user} />}
            {activeTab === "announcements" && <CommunityAnnouncements currentUser={user} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}