/**
 * MeMoreServices — Expandable 3x3 services grid + Logout card
 * Flutter: lib/features/profile/widgets/more_services_card.dart
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Grid3x3, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  { id: "finance",              title: "Finance",               icon: "💰", path: "/finance" },
  { id: "tasks_rewards",        title: "Tasks & Rewards",       icon: "🎁", path: "/tasks-rewards" },
  { id: "live_audio",           title: "Live & Audio",          icon: "🎙️", path: "/go-live" },
  { id: "social",               title: "Social",                icon: "👥", path: "/social" },
  { id: "messages_community",   title: "Messages",              icon: "💬", path: "/messages-center" },
  { id: "profile_stats",        title: "Profile & Stats",       icon: "📊", path: "/profile-stats" },
  { id: "levels_system",        title: "Level Systems",         icon: "⭐", path: "/levels" },
  { id: "account_settings",     title: "Settings",              icon: "⚙️", path: "/settings" },
  { id: "support",              title: "Support",               icon: "🛟", path: "/support" },
  { id: "app_center",           title: "Apply Center",          icon: "💼", path: "/app-center" },
  { id: "control_center",       title: "Control Center",        icon: "🎛️", path: "/control-center" },
];

export default function MeMoreServices() {
  const [expanded, setExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleService = (svc) => {
    if (svc.path) navigate(svc.path);
  };

  const handleLogout = async () => {
    localStorage.clear();
    await base44.auth.logout("/login");
  };

  return (
    <>
      {/* ── More Services Card ── */}
      <div style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid rgba(124,58,237,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        overflow: "hidden",
        marginTop: 14,
      }}>
        {/* Header row */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpanded(v => !v)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            padding: "15px 16px", background: "none", border: "none", cursor: "pointer",
            gap: 12,
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: "linear-gradient(135deg,#7C3AED,#C084FC)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Grid3x3 size={17} color="#fff" />
          </div>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: "#1a1a2e", textAlign: "left" }}>
            More Services
          </span>
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.22 }}
          >
            <ChevronRight size={18} color="#9CA3AF" />
          </motion.div>
        </motion.button>

        {/* Expandable grid */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="services-grid"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
                padding: "4px 14px 16px",
              }}>
                {SERVICES.map((svc, i) => (
                  <motion.button
                    key={svc.id}
                    whileTap={{ scale: 0.91 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleService(svc)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 7, padding: "14px 8px", borderRadius: 14, cursor: "pointer",
                      background: "linear-gradient(145deg,#faf8ff,#f5f0ff)",
                      border: "1px solid rgba(124,58,237,0.1)",
                      boxShadow: "0 2px 8px rgba(124,58,237,0.06)",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{svc.icon}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#4B5563",
                      textAlign: "center", lineHeight: 1.3,
                    }}>{svc.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Logout Card ── */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowLogoutModal(true)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          padding: "15px 16px", marginTop: 14, borderRadius: 18, cursor: "pointer",
          background: "#fff",
          border: "1px solid rgba(239,68,68,0.12)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          gap: 12,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: "linear-gradient(135deg,#EF4444,#F97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <LogOut size={17} color="#fff" />
        </div>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: "#EF4444", textAlign: "left" }}>
          Logout
        </span>
        <ChevronRight size={18} color="#EF4444" strokeWidth={2.5} />
      </motion.button>

      {/* ── Logout Confirmation Modal ── */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            key="logout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(0,0,0,0.45)",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
            }}
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: 480,
                background: "#fff", borderRadius: "24px 24px 0 0",
                padding: "24px 20px 36px",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
              }}
            >
              {/* Drag handle */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB" }} />
              </div>

              {/* Icon */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 18,
                  background: "linear-gradient(135deg,#FEE2E2,#FED7AA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26,
                }}>🚪</div>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", textAlign: "center", marginBottom: 8 }}>
                Logout Confirmation
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>
                Are you sure you want to logout from your account?
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1, padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 800,
                    background: "#F3F4F6", border: "none", cursor: "pointer", color: "#4B5563",
                  }}>
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLogout}
                  style={{
                    flex: 1, padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 800,
                    background: "linear-gradient(135deg,#EF4444,#F97316)",
                    border: "none", cursor: "pointer", color: "#fff",
                    boxShadow: "0 6px 20px rgba(239,68,68,0.35)",
                  }}>
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}