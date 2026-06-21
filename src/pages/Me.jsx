import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import MeHeader from "@/components/me/MeHeader";
import MeGlobalSearch from "@/components/me/MeGlobalSearch";
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
import MeMoreServices from "@/components/me/MeMoreServices";
import MeTopFans from "@/components/me/MeTopFans";
import MeSpecialBadges from "@/components/me/MeSpecialBadges";

const TABS = ["Profile", "Stats", "History", "Settings"];

function useLiveSocialCounts(authUserId) {
  const [counts, setCounts] = useState({ following: 0, followers: 0, friends: 0, visitors: 0 });
  useEffect(() => {
    if (!authUserId) return;
    const load = async () => {
      try {
        const profiles = await base44.entities.UserProfile.filter({ user_id: authUserId });
        const p = profiles?.[0] || {};
        setCounts({
          following: p.following_count || 0,
          followers: p.followers_count || 0,
          friends:   p.friends_count   || 0,
          visitors:  p.visitors_count  || 0,
        });
      } catch { /* ignore */ }
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [authUserId]);
  return counts;
}

export default function Me() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { isAuthenticated, isLoadingAuth, user: authUser } = useAuth();
  const socialCounts = useLiveSocialCounts(authUser?.id);
  const fmtN = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  if (!isLoadingAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{
      minHeight: "100dvh",
      width: "100%",
      maxWidth: "100vw",
      background: "linear-gradient(160deg, #fdfcff 0%, #f5f0ff 40%, #fff8f0 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: "max(100px, calc(90px + env(safe-area-inset-bottom, 0px)))",
      overflowX: "hidden",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Cover Photo */}
      <div style={{
        height: 160,
        width: "100%",
        maxWidth: "100vw",
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
        {/* Action Buttons — Search + More */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => setShowSearch(true)}
            style={{
              width: 36, height: 36, borderRadius: 18,
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}>
            <Search size={17} color="#7C3AED" />
          </motion.button>
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

      <div style={{ padding: "0 16px", marginTop: -70, width: "100%", maxWidth: 600, boxSizing: "border-box", overflowX: "hidden" }}>
        <MeHeader />

        {/* Social Stats Bar */}
        <div style={{
          display: "flex", marginTop: 14,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
          borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(124,58,237,0.10)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          width: "100%",
        }}>
          {[
            { label: "Following", count: fmtN(socialCounts.following) },
            { label: "Followers", count: fmtN(socialCounts.followers) },
            { label: "Friends",   count: fmtN(socialCounts.friends)   },
            { label: "Visitors",  count: fmtN(socialCounts.visitors)  },
          ].map((item, i, arr) => (
            <motion.button key={item.label} whileTap={{ scale: 0.94 }}
              style={{
                flex: 1, padding: "10px 4px", border: "none", cursor: "pointer",
                background: "transparent",
                borderRight: i < arr.length - 1 ? "1px solid rgba(124,58,237,0.08)" : "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#7C3AED", lineHeight: 1 }}>
                {item.count}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", lineHeight: 1 }}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)",
          borderRadius: 16, padding: 4, marginTop: 16, gap: 2,
          border: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
          {TABS.map(tab => (
            <motion.button key={tab} onClick={() => setActiveTab(tab)}
              whileTap={{ scale: 0.96 }}
              style={{
                flexShrink: 0, padding: "9px 10px", borderRadius: 12, fontSize: 11,
                fontWeight: 800, cursor: "pointer", border: "none", transition: "all 0.2s",
                whiteSpace: "nowrap",
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
                <MeTopFans />
                <MeSpecialBadges />
                <MeSocial />
                <MeExtras />
                <MeAchievements />
                <MeAbout />
                <MeMoreServices />
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

      <AnimatePresence>
        {showSearch && <MeGlobalSearch onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </div>
  );
}