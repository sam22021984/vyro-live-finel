/**
 * ControlCenter — Platform Control Center
 * Access: Profile > More Services > Control Center
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "Account Control",
    icon: "👤",
    color: "#1F6BFF",
    items: [
      { icon: "🔐", label: "Account Security",     desc: "Password, 2FA, login sessions"        },
      { icon: "🪪", label: "Identity Verification", desc: "Verify your identity for full access" },
      { icon: "🔗", label: "Linked Accounts",       desc: "Connected social and platform accounts"},
      { icon: "🗑️", label: "Delete Account",        desc: "Permanently remove your account",  danger: true },
    ],
  },
  {
    title: "Privacy Control",
    icon: "🔒",
    color: "#A855F7",
    items: [
      { icon: "👁️", label: "Profile Visibility",   desc: "Control who sees your profile"       },
      { icon: "📍", label: "Location Privacy",      desc: "Manage location data sharing"        },
      { icon: "📊", label: "Data & Analytics",      desc: "Your data usage and analytics opt-in"},
      { icon: "🚫", label: "Blocked Users",         desc: "View and manage blocked accounts"    },
    ],
  },
  {
    title: "Content Control",
    icon: "📡",
    color: "#10B981",
    items: [
      { icon: "🎙️", label: "Stream Settings",      desc: "Default room settings and quality"   },
      { icon: "💬", label: "Chat Filters",          desc: "Keyword filters and auto-moderation" },
      { icon: "🎁", label: "Gift Settings",         desc: "Gift visibility and notifications"   },
      { icon: "🔔", label: "Notification Control",  desc: "Manage all notification types"       },
    ],
  },
  {
    title: "Financial Control",
    icon: "💰",
    color: "#F59E0B",
    items: [
      { icon: "💳", label: "Payment Methods",       desc: "Manage cards and payment options"    },
      { icon: "🏦", label: "Withdrawal Settings",   desc: "Bank accounts and payout methods"    },
      { icon: "📈", label: "Spending Limits",       desc: "Set daily and monthly coin limits"   },
      { icon: "🧾", label: "Transaction History",   desc: "Full history of all transactions"    },
    ],
  },
  {
    title: "Platform Control",
    icon: "⚙️",
    color: "#0EA5E9",
    items: [
      { icon: "🌍", label: "Language & Region",     desc: "App language and regional settings"  },
      { icon: "🎨", label: "Display Settings",      desc: "Theme, font size, and appearance"    },
      { icon: "📱", label: "Device Management",     desc: "Manage logged-in devices"            },
      { icon: "🗂️", label: "Storage & Cache",       desc: "Clear cache and manage local data"   },
    ],
  },
  {
    title: "Safety Control",
    icon: "🛡️",
    color: "#EF4444",
    items: [
      { icon: "🚩", label: "Report Center",         desc: "View and manage your reports"        },
      { icon: "⛔", label: "Restriction Log",        desc: "View any active account restrictions"},
      { icon: "📜", label: "Community Guidelines",   desc: "Platform rules and policies"         },
      { icon: "⚖️", label: "Appeal a Decision",     desc: "Contest a moderation decision"       },
    ],
  },
];

function ControlRow({ item, color }) {
  return (
    <motion.div whileTap={{ scale: 0.98 }}
      style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #F5F7FA" }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: item.danger ? "#FEF2F2" : `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>
        {item.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: item.danger ? "#EF4444" : "#0D1B3E" }}>{item.label}</div>
        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{item.desc}</div>
      </div>
      <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
    </motion.div>
  );
}

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
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Manage all your platform settings</div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)", margin: 16, borderRadius: 18, padding: "18px 20px", boxShadow: "0 6px 24px rgba(31,107,255,0.25)" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎛️</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Your Control Center</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Full control over your account, privacy, content, finances, and platform settings — all in one place.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
          {[{ l: "Sections", v: SECTIONS.length }, { l: "Controls", v: SECTIONS.reduce((s, sec) => s + sec.items.length, 0) }, { l: "Status", v: "Active" }].map(s => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {SECTIONS.map((sec, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            {/* Section Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid #F5F7FA" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: `${sec.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{sec.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{sec.title}</div>
              <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: `${sec.color}12`, color: sec.color }}>{sec.items.length} controls</span>
            </div>
            {/* Rows */}
            {sec.items.map((item, j) => (
              <div key={j} style={{ borderBottom: j < sec.items.length - 1 ? "none" : "none" }}>
                <ControlRow item={item} color={sec.color} />
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}