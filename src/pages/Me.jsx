import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import VIPCollection from "@/components/profile/VIPCollection";
import LevelCards from "@/components/profile/LevelCards";
import StatsSection from "@/components/profile/StatsSection";
import SocialSection from "@/components/profile/SocialSection";
import HistorySection from "@/components/profile/HistorySection";
import AchievementsSection from "@/components/profile/AchievementsSection";
import AboutSection from "@/components/profile/AboutSection";
import DailyActivity from "@/components/profile/DailyActivity";
import PrivacySettings from "@/components/profile/PrivacySettings";
import ProfileThemes from "@/components/profile/ProfileThemes";

export default function Me() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile",  label: "Profile"  },
    { id: "stats",    label: "Stats"    },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen pb-32" style={{ background: "linear-gradient(160deg,#fdf6ff 0%,#f0f4ff 50%,#fff9f0 100%)" }}>
      {/* Top gradient banner */}
      <div style={{
        height: 180,
        background: "linear-gradient(135deg,#7C3AED 0%,#3B82F6 50%,#EC4899 100%)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80') center/cover",
          opacity: 0.18,
        }} />
        {/* Edit cover button */}
        <button style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(255,255,255,0.22)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.35)", borderRadius: 20,
          color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px",
        }}>
          Edit Cover
        </button>
      </div>

      <div className="px-4" style={{ marginTop: -72 }}>
        <ProfileHeader />

        {/* Tab Bar */}
        <div className="flex gap-2 mt-5 mb-4" style={{
          background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)",
          borderRadius: 40, padding: 4,
          border: "1px solid rgba(124,58,237,0.12)",
          boxShadow: "0 2px 16px rgba(124,58,237,0.08)",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 36, fontSize: 13, fontWeight: 700,
                transition: "all 0.2s",
                background: activeTab === t.id
                  ? "linear-gradient(135deg,#7C3AED,#3B82F6)"
                  : "transparent",
                color: activeTab === t.id ? "#fff" : "#9CA3AF",
                border: "none", cursor: "pointer",
                boxShadow: activeTab === t.id ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <>
            <VIPCollection />
            <LevelCards />
            <SocialSection />
            <AchievementsSection />
            <AboutSection />
            <DailyActivity />
          </>
        )}

        {activeTab === "stats" && (
          <>
            <StatsSection />
            <HistorySection />
          </>
        )}

        {activeTab === "settings" && (
          <>
            <PrivacySettings />
            <ProfileThemes />
          </>
        )}
      </div>
    </div>
  );
}