/**
 * ControlCenter — Platform Control Center
 * Access: Profile > More Services > Control Center
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export default function ControlCenter() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>🎛️ Control Center</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Platform management portal</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { path: "/agent-dashboard",  icon: "🤝", label: "Agent Dashboard",  desc: "Recruitment, hosts, targets, earnings & compliance", bg: "linear-gradient(135deg,#FFF7ED,#FEF3C7)" },
          { path: "/host-dashboard",      icon: "🎙️", label: "Host Dashboard",    desc: "Streaming, audience, earnings, ranking & content",   bg: "linear-gradient(135deg,#F5F3FF,#EDE9FE)" },
          { path: "/agency-dashboard-page", icon: "🏢", label: "Agency Dashboard", desc: "Hosts, recruitment, revenue, analytics & compliance", bg: "linear-gradient(135deg,#ECFDF5,#D1FAE5)" },
        ].map(item => (
          <motion.div key={item.path} whileTap={{ scale: 0.97 }} onClick={() => navigate(item.path)}
            style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", border: "1px solid #F0F0F8", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.desc}</div>
            </div>
            <span style={{ fontSize: 20, color: "#D1D5DB" }}>›</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}