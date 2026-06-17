/**
 * CreatorCenter — Enterprise Management Dashboards Hub
 * Access: Profile > More Services > Creator Center
 * Theme: Premium White · Enterprise International Standard
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const DASHBOARDS = [
  {
    id: "app-owner",
    icon: "🚀",
    label: "Application Owner",
    subtitle: "Enterprise Owner Control",
    gradient: "linear-gradient(145deg,#1F6BFF,#0D1B3E)",
    glow: "rgba(31,107,255,0.3)",
    featured: true,
  },
  {
    id: "country-manager",
    icon: "🌍",
    label: "Country Manager",
    subtitle: "Country Operations Control",
    gradient: "linear-gradient(145deg,#0EA5E9,#0369A1)",
    glow: "rgba(14,165,233,0.25)",
  },
  {
    id: "biz-developer",
    icon: "📈",
    label: "Business Developer",
    subtitle: "Growth & Expansion Control",
    gradient: "linear-gradient(145deg,#10B981,#059669)",
    glow: "rgba(16,185,129,0.25)",
  },
  {
    id: "biz-manager",
    icon: "🏢",
    label: "Business Manager",
    subtitle: "Business Operations",
    gradient: "linear-gradient(145deg,#7C3AED,#5B21B6)",
    glow: "rgba(124,58,237,0.25)",
  },
  {
    id: "support-manager",
    icon: "🎧",
    label: "Support Manager",
    subtitle: "Customer Support Center",
    gradient: "linear-gradient(145deg,#06B6D4,#0E7490)",
    glow: "rgba(6,182,212,0.25)",
  },
  {
    id: "finance-manager",
    icon: "💰",
    label: "Finance Manager",
    subtitle: "Revenue & Financial Control",
    gradient: "linear-gradient(145deg,#F59E0B,#D97706)",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    id: "marketing-manager",
    icon: "📢",
    label: "Marketing Manager",
    subtitle: "Marketing & Campaigns",
    gradient: "linear-gradient(145deg,#EC4899,#BE185D)",
    glow: "rgba(236,72,153,0.25)",
  },
  {
    id: "vip-manager",
    icon: "👑",
    label: "VIP Manager",
    subtitle: "VIP User Management",
    gradient: "linear-gradient(145deg,#FFC83D,#F59E0B)",
    glow: "rgba(255,200,61,0.3)",
  },
  {
    id: "reward-manager",
    icon: "🎁",
    label: "Reward Manager",
    subtitle: "Rewards & Loyalty System",
    gradient: "linear-gradient(145deg,#F97316,#EA580C)",
    glow: "rgba(249,115,22,0.25)",
  },
  {
    id: "pk-manager",
    icon: "⚔️",
    label: "PK Manager",
    subtitle: "PK Battle Management",
    gradient: "linear-gradient(145deg,#EF4444,#B91C1C)",
    glow: "rgba(239,68,68,0.25)",
  },
  {
    id: "event-manager",
    icon: "🎉",
    label: "Event Manager",
    subtitle: "Event Operations Center",
    gradient: "linear-gradient(145deg,#A855F7,#7E22CE)",
    glow: "rgba(168,85,247,0.25)",
  },
  {
    id: "super-admin",
    icon: "🛡️",
    label: "Super Admin",
    subtitle: "Full Platform Control",
    gradient: "linear-gradient(145deg,#1F6BFF,#7C3AED)",
    glow: "rgba(31,107,255,0.28)",
  },
  {
    id: "admin",
    icon: "⚙️",
    label: "Admin",
    subtitle: "System Administration",
    gradient: "linear-gradient(145deg,#374151,#111827)",
    glow: "rgba(55,65,81,0.25)",
  },
];

export default function CreatorCenter() {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.id === "app-owner") navigate("/owner-dashboard");
    if (item.id === "country-manager") navigate("/country-manager-dashboard");
    if (item.id === "biz-developer") navigate("/business-developer-dashboard");
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#FFFFFF",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: 90,
    }}>
      {/* ── Sticky Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(31,107,255,0.08)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "#F5F7FA", border: "1.5px solid rgba(31,107,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(31,107,255,0.1)",
            }}>
            <ChevronLeft size={18} color="#1F6BFF" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#0D1B3E" }}>🚀 Creator Center</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Enterprise Management Portals · {DASHBOARDS.length} Dashboards</div>
          </div>
          <div style={{
            padding: "4px 10px", borderRadius: 20,
            background: "linear-gradient(135deg,#1F6BFF15,#7C3AED15)",
            border: "1px solid rgba(31,107,255,0.2)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#1F6BFF" }}>Enterprise</span>
          </div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg,#0D1B3E 0%,#1F6BFF 60%,#7C3AED 100%)",
        padding: "22px 20px 28px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background decorative circles */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,200,61,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

        <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: "0.08em" }}>
          VYRO LIVE · ENTERPRISE CONTROL CENTER
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
          Management Dashboards
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
          Select a portal to access its full enterprise dashboard
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[{ v: "13", l: "Dashboards" },{ v: "100%", l: "Enterprise" },{ v: "Pro", l: "Access Level" }].map(s => (
            <div key={s.l} style={{
              flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 8px", textAlign: "center",
              border: "1px solid rgba(255,255,255,0.14)",
            }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dashboard Grid ── */}
      <div style={{ padding: "18px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 14, letterSpacing: "0.07em" }}>
          SELECT A MANAGEMENT PORTAL
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}>
          {DASHBOARDS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleClick(item)}
              style={{ cursor: "pointer" }}
            >
              {/* Card */}
              <div style={{
                borderRadius: 20,
                background: "#F5F7FA",
                border: "1.5px solid rgba(31,107,255,0.1)",
                boxShadow: `0 4px 20px ${item.glow}, 0 1px 4px rgba(0,0,0,0.06)`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 8px 14px",
                position: "relative",
              }}>
                {/* Gold accent top bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: item.featured
                    ? "linear-gradient(90deg,#FFC83D,#1F6BFF)"
                    : item.gradient,
                  borderRadius: "20px 20px 0 0",
                }} />

                {/* 3D Icon disc */}
                <div style={{
                  width: 54, height: 54, borderRadius: 16, marginBottom: 10,
                  background: item.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26,
                  boxShadow: `0 6px 18px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.15)`,
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Shine overlay */}
                  <div style={{
                    position: "absolute", top: 0, left: "15%", right: 0, height: "45%",
                    background: "linear-gradient(180deg,rgba(255,255,255,0.28) 0%,transparent 100%)",
                    borderRadius: "0 0 50% 50%",
                  }} />
                  {item.icon}
                </div>

                {/* Label */}
                <div style={{
                  fontSize: 10, fontWeight: 900, color: "#0D1B3E",
                  textAlign: "center", lineHeight: 1.3, marginBottom: 4,
                }}>
                  {item.label}
                </div>

                {/* Subtitle */}
                <div style={{
                  fontSize: 8, fontWeight: 600, color: "#9CA3AF",
                  textAlign: "center", lineHeight: 1.3,
                }}>
                  {item.subtitle}
                </div>

                {/* Gold dot indicator for featured */}
                {item.featured && (
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#FFC83D",
                    boxShadow: "0 0 6px rgba(255,200,61,0.7)",
                  }} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}