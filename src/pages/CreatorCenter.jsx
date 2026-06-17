/**
 * CreatorCenter — Management Dashboards Hub
 * Access: Profile > More Services > Creator Center
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DASHBOARDS = [
  { id: "app-owner",          icon: "👑", label: "Application Owner Dashboard",    desc: "Platform-level ownership and oversight",         bg: "linear-gradient(135deg,#FFF7ED,#FEF3C7)", color: "#F59E0B" },
  { id: "country-manager",    icon: "🌍", label: "Country Manager Dashboard",      desc: "Regional operations and team management",        bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", color: "#1F6BFF" },
  { id: "biz-developer",      icon: "📈", label: "Business Developer Dashboard",   desc: "Partnerships, deals, and growth strategy",      bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", color: "#10B981" },
  { id: "biz-manager",        icon: "💼", label: "Business Manager Dashboard",     desc: "Operations, agencies, and revenue oversight",   bg: "linear-gradient(135deg,#F5F3FF,#EDE9FE)", color: "#7C3AED" },
  { id: "support-manager",    icon: "🎧", label: "Support Manager Dashboard",      desc: "Support team, tickets, and SLA management",     bg: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", color: "#059669" },
  { id: "finance-manager",    icon: "💰", label: "Finance Manager Dashboard",      desc: "Financial reports, withdrawals, compliance",    bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", color: "#D97706" },
  { id: "marketing-manager",  icon: "📣", label: "Marketing Manager Dashboard",   desc: "Campaigns, analytics, and brand growth",        bg: "linear-gradient(135deg,#FFF1F2,#FFE4E6)", color: "#E11D48" },
  { id: "vip-manager",        icon: "👑", label: "VIP Manager Dashboard",         desc: "VIP accounts, programs, and retention",         bg: "linear-gradient(135deg,#FDF4FF,#FAE8FF)", color: "#A21CAF" },
  { id: "reward-manager",     icon: "🎁", label: "Reward Manager Dashboard",      desc: "Rewards, events, and incentive programs",       bg: "linear-gradient(135deg,#FFF7ED,#FFEDD5)", color: "#EA580C" },
  { id: "pk-manager",         icon: "⚔️", label: "PK Manager Dashboard",          desc: "PK battles, competitions, and event control",   bg: "linear-gradient(135deg,#FEF2F2,#FEE2E2)", color: "#DC2626" },
  { id: "event-manager",      icon: "🎉", label: "Event Manager Dashboard",       desc: "Platform events, scheduling, and campaigns",    bg: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", color: "#4F46E5" },
  { id: "super-admin",        icon: "⚡", label: "Super Admin Dashboard",         desc: "Admin oversight, escalations, and enforcement", bg: "linear-gradient(135deg,#FFFBEB,#FEF9C3)", color: "#CA8A04" },
  { id: "admin",              icon: "🛡️", label: "Admin Dashboard",               desc: "Moderation, reports, and community standards",  bg: "linear-gradient(135deg,#F0F9FF,#E0F2FE)", color: "#0284C7" },
];

export default function CreatorCenter() {
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
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>🚀 Creator Center</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Management Dashboards · {DASHBOARDS.length} Portals</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 4, letterSpacing: "0.06em" }}>
          SELECT A MANAGEMENT PORTAL
        </div>
        {DASHBOARDS.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${item.color}18` }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{item.desc}</div>
            </div>
            <ChevronRight size={16} color="#D1D5DB" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}