/**
 * ControlCenter — Enterprise Platform Control Center
 * Access: Profile > More Services > Control Center
 * Theme: VYRO Enterprise Dark · Glassmorphism
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const DASHBOARDS = [
  {
    id: "agent",
    path: "/agent-dashboard",
    icon: "🤝",
    label: "Agent Dashboard",
    subtitle: "Agent Management",
    gradient: "linear-gradient(145deg,#1F6BFF,#0D4DB8)",
    glow: "rgba(31,107,255,0.35)",
  },
  {
    id: "agency",
    path: "/agency-dashboard-page",
    icon: "🏛️",
    label: "Agency Dashboard",
    subtitle: "Agency Management",
    gradient: "linear-gradient(145deg,#0EA5E9,#0369A1)",
    glow: "rgba(14,165,233,0.3)",
  },
  {
    id: "host",
    path: "/host-dashboard",
    icon: "🎙️",
    label: "Host Dashboard",
    subtitle: "Host Management",
    gradient: "linear-gradient(145deg,#7C3AED,#4C1D95)",
    glow: "rgba(124,58,237,0.35)",
  },
  {
    id: "user",
    path: null,
    icon: "👤",
    label: "User Dashboard",
    subtitle: "User Management",
    gradient: "linear-gradient(145deg,#10B981,#065F46)",
    glow: "rgba(16,185,129,0.3)",
  },
];

export default function ControlCenter() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg,#0B1020 0%,#0D1B3E 50%,#091428 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: 90,
    }}>
      {/* ── Sticky Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,16,32,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(31,107,255,0.18)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
      }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(31,107,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
            <ChevronLeft size={18} color="#60A5FA" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#FFFFFF" }}>🎛️ Control Center</div>
            <div style={{ fontSize: 10, color: "#60A5FA" }}>Enterprise Platform Management</div>
          </div>
          <div style={{
            padding: "4px 10px", borderRadius: 20,
            background: "rgba(255,200,61,0.12)",
            border: "1px solid rgba(255,200,61,0.3)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D" }}>Enterprise</span>
          </div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{ padding: "24px 20px 20px", position: "relative", overflow: "hidden" }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(31,107,255,0.2),transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.18),transparent 70%)", pointerEvents: "none" }} />

        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(31,107,255,0.2)",
          borderRadius: 20,
          padding: "20px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", marginBottom: 6, letterSpacing: "0.1em" }}>
            VYRO LIVE · ENTERPRISE CONTROL
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
            Platform Management Hub
          </div>
          <div style={{ fontSize: 11, color: "#DCE3F0", lineHeight: 1.6, marginBottom: 16 }}>
            Access and manage all platform operations from a single enterprise control center.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[{ v: "4", l: "Dashboards" },{ v: "Pro", l: "Access" },{ v: "Live", l: "Status" }].map(s => (
              <div key={s.l} style={{
                background: "rgba(31,107,255,0.12)", borderRadius: 12, padding: "10px 8px", textAlign: "center",
                border: "1px solid rgba(31,107,255,0.2)",
              }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#FFC83D" }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "#60A5FA" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dashboard Grid ── */}
      <div style={{ padding: "0 14px 16px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", marginBottom: 14, letterSpacing: "0.08em" }}>
          SELECT A MANAGEMENT PORTAL
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {DASHBOARDS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.28 }}
              whileTap={{ scale: 0.91 }}
              onClick={() => item.path && navigate(item.path)}
              style={{ cursor: item.path ? "pointer" : "default" }}
            >
              <div style={{
                borderRadius: 20,
                background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(31,107,255,0.2)",
                backdropFilter: "blur(12px)",
                boxShadow: `0 8px 24px ${item.glow}, 0 1px 0 rgba(255,255,255,0.06) inset`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "18px 8px 14px",
                position: "relative",
              }}>
                {/* Gold top accent bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg,#FFC83D55,${item.gradient.match(/#[A-Fa-f0-9]{6}/)?.[0] ?? "#1F6BFF"},#FFC83D55)`,
                  borderRadius: "20px 20px 0 0",
                }} />

                {/* 3D Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: 16, marginBottom: 10,
                  background: item.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26,
                  boxShadow: `0 8px 20px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 5px rgba(0,0,0,0.2)`,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: "15%", right: 0, height: "42%",
                    background: "linear-gradient(180deg,rgba(255,255,255,0.3) 0%,transparent 100%)",
                    borderRadius: "0 0 50% 50%",
                  }} />
                  {item.icon}
                </div>

                {/* Label */}
                <div style={{
                  fontSize: 10, fontWeight: 900, color: "#FFFFFF",
                  textAlign: "center", lineHeight: 1.3, marginBottom: 4,
                }}>
                  {item.label}
                </div>

                {/* Subtitle */}
                <div style={{
                  fontSize: 8, fontWeight: 600, color: "#60A5FA",
                  textAlign: "center", lineHeight: 1.3,
                }}>
                  {item.subtitle}
                </div>

                {/* Coming soon badge for unbuilt items */}
                {!item.path && (
                  <div style={{
                    position: "absolute", bottom: 8,
                    background: "rgba(255,200,61,0.15)",
                    border: "1px solid rgba(255,200,61,0.3)",
                    borderRadius: 6, padding: "1px 6px",
                  }}>
                    <span style={{ fontSize: 7, fontWeight: 800, color: "#FFC83D" }}>SOON</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}