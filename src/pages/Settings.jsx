/**
 * Settings — Full App Settings Module
 * Access: Profile → More Services → Settings
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

/* ─── Toggle ─── */
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer", flexShrink: 0,
        background: value ? "#1F6BFF" : "#D1D5DB",
        position: "relative", transition: "background 0.2s",
      }}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}

/* ─── Selection Modal ─── */
function SelectionModal({ title, options, selected, onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "70vh", overflowY: "auto", padding: "20px 0 32px" }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "0 auto 16px" }} />
        <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", padding: "0 20px 14px", borderBottom: "1px solid #F0F0F8" }}>
          {title}
        </div>
        {options.map(opt => (
          <div key={opt} onClick={() => { onSelect(opt); onClose(); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #F5F7FA", cursor: "pointer" }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{opt}</span>
            {selected === opt && <Check size={16} color="#1F6BFF" />}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Settings Row ─── */
function SettingRow({ item, value, onChange }) {
  const [showModal, setShowModal] = useState(false);

  const LANGUAGES = ["English", "Urdu", "Arabic", "Hindi", "Turkish", "Bengali", "Indonesian", "Auto Detect"];
  const THEME_OPTIONS = ["Light", "Dark", "System Default"];
  const FONT_OPTIONS = ["Small", "Medium", "Large"];

  const getOptions = () => {
    if (item.options) return item.options;
    if (item.title === "Preferred Translation Language") return LANGUAGES;
    return [];
  };

  const isRed = item.type === "danger_action";
  const isAction = item.type === "action" || item.type === "danger_action" || item.type === "page";
  const isInfo = item.type === "info";

  const INFO_VALUES = {
    "App Version": "v2.4.1",
    "Build Number": "#20240616",
    "Storage Usage": "128 MB",
    "Device Information": "Web Browser",
  };

  return (
    <>
      <div
        onClick={() => {
          if (item.type === "selection") setShowModal(true);
          else if (item.title === "Logout") base44.auth.logout("/login");
          else if (item.title === "Logout All Devices") base44.auth.logout("/login");
        }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px", cursor: isInfo ? "default" : "pointer",
          borderBottom: "1px solid #F5F7FA",
        }}
      >
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: isRed ? "#EF4444" : "#374151",
          flex: 1,
        }}>{item.title}</span>

        {item.type === "toggle" && (
          <Toggle value={value ?? false} onChange={onChange} />
        )}
        {item.type === "selection" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>{value ?? getOptions()[0]}</span>
            <ChevronRight size={14} color="#9CA3AF" />
          </div>
        )}
        {isInfo && (
          <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>
            {INFO_VALUES[item.title] ?? "—"}
          </span>
        )}
        {(isAction || item.type === "list") && !isInfo && (
          <ChevronRight size={14} color={isRed ? "#EF4444" : "#9CA3AF"} />
        )}
        {item.type === "time_range" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>22:00 – 08:00</span>
            <ChevronRight size={14} color="#9CA3AF" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && item.type === "selection" && (
          <SelectionModal
            title={item.title}
            options={getOptions()}
            selected={value ?? getOptions()[0]}
            onSelect={onChange}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Settings Card ─── */
function SettingsCard({ card, settings, onToggle, onSelect }) {
  const ICONS = {
    language_settings:    "🌐",
    notification_settings:"🔔",
    security_settings:    "🔒",
    device_settings:      "📱",
    storage_data_settings:"💾",
    legal_policies:       "📄",
    app_settings:         "🎨",
    about_application:    "ℹ️",
    account_actions:      "👤",
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 18, marginBottom: 14,
      border: "1px solid #F0F0F8", overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    }}>
      {/* Card Header */}
      <div style={{
        padding: "14px 16px 12px", borderBottom: "1px solid #F0F0F8",
        display: "flex", alignItems: "center", gap: 10,
        background: "#FAFBFF",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "#EEF2FF",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>{ICONS[card.id] ?? "⚙️"}</div>
        <span style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{card.title}</span>
      </div>

      {/* Items */}
      {card.items.map((item, i) => (
        <SettingRow
          key={item.title}
          item={item}
          value={settings[`${card.id}_${item.title}`]}
          onChange={(val) => {
            if (item.type === "toggle") onToggle(card.id, item.title, val);
            else if (item.type === "selection") onSelect(card.id, item.title, val);
          }}
        />
      ))}
    </div>
  );
}

/* ─── SETTINGS DATA ─── */
const CARDS = [
  {
    id: "language_settings", title: "Language Settings",
    items: [
      { title: "App Language", type: "selection", options: ["English","Urdu","Arabic","Hindi","Turkish","Bengali","Indonesian","Auto Detect"] },
      { title: "Chat Translation", type: "toggle" },
      { title: "Auto Translate Messages", type: "toggle" },
      { title: "Preferred Translation Language", type: "selection" },
    ],
  },
  {
    id: "notification_settings", title: "Notification Settings",
    items: [
      { title: "Push Notifications", type: "toggle" },
      { title: "Message Notifications", type: "toggle" },
      { title: "Follower Notifications", type: "toggle" },
      { title: "Gift Notifications", type: "toggle" },
      { title: "Live Stream Notifications", type: "toggle" },
      { title: "Event Notifications", type: "toggle" },
      { title: "Notification Sound", type: "toggle" },
      { title: "Vibration", type: "toggle" },
      { title: "Quiet Hours", type: "time_range" },
    ],
  },
  {
    id: "security_settings", title: "Security Settings",
    items: [
      { title: "Change Password", type: "action" },
      { title: "Reset Password", type: "action" },
      { title: "Two Factor Authentication", type: "toggle" },
      { title: "Email Verification", type: "action" },
      { title: "Mobile Verification", type: "action" },
      { title: "Active Sessions", type: "list" },
      { title: "Login History", type: "list" },
      { title: "Logout Other Devices", type: "action" },
      { title: "Fingerprint Login", type: "toggle" },
      { title: "Face ID Login", type: "toggle" },
      { title: "PIN Lock", type: "action" },
    ],
  },
  {
    id: "device_settings", title: "Device Settings",
    items: [
      { title: "Device Information", type: "info" },
      { title: "Microphone Permission", type: "toggle" },
      { title: "Camera Permission", type: "toggle" },
      { title: "Notification Permission", type: "toggle" },
      { title: "Storage Permission", type: "toggle" },
      { title: "Auto Start", type: "toggle" },
      { title: "Battery Optimization", type: "toggle" },
      { title: "Restart Application", type: "action" },
    ],
  },
  {
    id: "storage_data_settings", title: "Storage & Data",
    items: [
      { title: "Storage Usage", type: "info" },
      { title: "Clear Cache", type: "action" },
      { title: "Clear Downloaded Data", type: "action" },
      { title: "Data Saver Mode", type: "toggle" },
      { title: "Auto Download Media", type: "toggle" },
      { title: "WiFi Only Downloads", type: "toggle" },
    ],
  },
  {
    id: "legal_policies", title: "Legal & Policies",
    items: [
      { title: "Terms & Conditions", type: "page" },
      { title: "Privacy Policy", type: "page" },
      { title: "Community Guidelines", type: "page" },
      { title: "Copyright Policy", type: "page" },
      { title: "Refund Policy", type: "page" },
      { title: "Content Moderation Policy", type: "page" },
      { title: "Safety Policy", type: "page" },
    ],
  },
  {
    id: "app_settings", title: "App Settings",
    items: [
      { title: "Theme Mode", type: "selection", options: ["Light", "Dark", "System Default"] },
      { title: "Font Size", type: "selection", options: ["Small", "Medium", "Large"] },
      { title: "UI Animations", type: "toggle" },
      { title: "Quick Language Switch", type: "action" },
    ],
  },
  {
    id: "about_application", title: "About Application",
    items: [
      { title: "App Version", type: "info" },
      { title: "Build Number", type: "info" },
      { title: "Check For Updates", type: "action" },
      { title: "What's New", type: "page" },
      { title: "Open Source Licenses", type: "page" },
    ],
  },
  {
    id: "account_actions", title: "Account Actions",
    items: [
      { title: "Logout", type: "action" },
      { title: "Logout All Devices", type: "action" },
      { title: "Delete Account", type: "danger_action" },
    ],
  },
];

/* ─── MAIN ─── */
export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    "notification_settings_Push Notifications": true,
    "notification_settings_Message Notifications": true,
    "notification_settings_Notification Sound": true,
    "notification_settings_Vibration": true,
    "language_settings_App Language": "English",
    "app_settings_Theme Mode": "Light",
    "app_settings_Font Size": "Medium",
    "app_settings_UI Animations": true,
    "device_settings_Microphone Permission": true,
  });

  const handleToggle = (cardId, title, val) =>
    setSettings(s => ({ ...s, [`${cardId}_${title}`]: val }));

  const handleSelect = (cardId, title, val) =>
    setSettings(s => ({ ...s, [`${cardId}_${title}`]: val }));

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>

      {/* Sticky Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "#fff", border: "1px solid #E5E7EB",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
          <ChevronLeft size={18} color="#374151" />
        </motion.button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>⚙️ Settings</div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>App preferences & configuration</div>
        </div>
      </div>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0D1B3E 0%, #1F6BFF 100%)",
        padding: "20px 16px 24px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, border: "1px solid rgba(255,255,255,0.2)",
        }}>⚙️</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>App Settings</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
            {CARDS.length} sections · Manage your preferences
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ padding: "14px" }}>
        {CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <SettingsCard
              card={card}
              settings={settings}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}