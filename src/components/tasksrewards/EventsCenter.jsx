/**
 * EventsCenter — Active / Upcoming / Completed events
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, ChevronRight } from "lucide-react";

const EVENT_TABS = ["Active", "Upcoming", "Completed"];

const EVENTS = {
  Active: [
    {
      id: 1, type: "Recharge Event", title: "Recharge & Win Big!",
      banner: "🪙", color: "#FFC83D", bgColor: "#FFFBEB",
      desc: "Recharge any amount and win exclusive gifts",
      reward: "Up to 10,000 Coins", participants: 1284, timeLeft: "2d 14h",
      rules: ["Minimum recharge: 100 coins", "Top 3 rechargiers win VIP", "All participants get bonus"],
    },
    {
      id: 2, type: "Gift Event", title: "Gift King Competition",
      banner: "🎁", color: "#F472B6", bgColor: "#FDF2F8",
      desc: "Send the most gifts to win top gifter crown",
      reward: "VIP Frame + 5,000 Coins", participants: 892, timeLeft: "1d 6h",
      rules: ["Send gifts in any live room", "Daily rankings reset at midnight", "Top 10 win rewards"],
    },
    {
      id: 3, type: "PK Event", title: "Weekly PK Battle",
      banner: "⚔️", color: "#EF4444", bgColor: "#FEF2F2",
      desc: "Host vs Host — who earns the most gifts?",
      reward: "2,000 Diamonds + Medal", participants: 346, timeLeft: "3d 8h",
      rules: ["Hosts only", "Minimum 2h stream required", "PK must be 1v1"],
    },
  ],
  Upcoming: [
    {
      id: 4, type: "Festival Event", title: "Eid Special Celebration",
      banner: "🌙", color: "#A78BFA", bgColor: "#F5F3FF",
      desc: "Special event with doubled rewards",
      reward: "Exclusive Badge + VIP", participants: 0, startsIn: "3 days",
    },
    {
      id: 5, type: "Lucky Draw", title: "Monthly Lucky Draw",
      banner: "🎰", color: "#34D399", bgColor: "#ECFDF5",
      desc: "Random draw from all active users",
      reward: "iPhone + 50,000 Coins", participants: 0, startsIn: "7 days",
    },
  ],
  Completed: [
    {
      id: 6, type: "Agency Event", title: "Agency Championship",
      banner: "🏆", color: "#9CA3AF", bgColor: "#F3F4F6",
      desc: "Top agencies competed for diamonds",
      reward: "Completed", participants: 42, ended: "3 days ago",
    },
  ],
};

function EventCard({ event, tab }) {
  const [showRules, setShowRules] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: event.bgColor || "#fff", borderRadius: 18, overflow: "hidden",
        border: `1px solid ${event.color}33`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        marginBottom: 12,
      }}>
      {/* Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${event.color}22, ${event.color}44)`,
        padding: "16px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14, flexShrink: 0,
          background: `${event.color}22`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 26, border: `2px solid ${event.color}33`,
        }}>{event.banner}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: event.color, marginBottom: 2, textTransform: "uppercase" }}>
            {event.type}
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{event.title}</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{event.desc}</div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          {event.timeLeft && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} color={event.color} />
              <span style={{ fontSize: 11, fontWeight: 700, color: event.color }}>{event.timeLeft} left</span>
            </div>
          )}
          {event.startsIn && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} color={event.color} />
              <span style={{ fontSize: 11, fontWeight: 700, color: event.color }}>Starts in {event.startsIn}</span>
            </div>
          )}
          {event.ended && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={12} color="#9CA3AF" />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Ended {event.ended}</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Users size={12} color="#9CA3AF" />
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{event.participants.toLocaleString()} joined</span>
          </div>
        </div>

        <div style={{
          background: "#fff", borderRadius: 10, padding: "8px 12px",
          marginBottom: 12, border: "1px solid #F0F0F5",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 11, color: "#6B7280" }}>Reward</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#FFC83D" }}>🏆 {event.reward}</span>
        </div>

        {tab === "Active" && (
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button whileTap={{ scale: 0.94 }}
              style={{
                flex: 1, padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 800,
                background: `linear-gradient(135deg,${event.color},${event.color}cc)`,
                color: "#fff", border: "none", cursor: "pointer",
                boxShadow: `0 4px 12px ${event.color}44`,
              }}>Join Event</motion.button>
            {event.rules && (
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={() => setShowRules(v => !v)}
                style={{
                  padding: "10px 14px", borderRadius: 12, fontSize: 12, fontWeight: 800,
                  background: "#fff", color: "#6B7280",
                  border: "1px solid #E5E7EB", cursor: "pointer",
                }}>Rules</motion.button>
            )}
          </div>
        )}
        {tab === "Upcoming" && (
          <motion.button whileTap={{ scale: 0.94 }}
            style={{
              width: "100%", padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 800,
              background: "#F5F7FA", color: "#6B7280",
              border: "1px solid #E5E7EB", cursor: "pointer",
            }}>Set Reminder 🔔</motion.button>
        )}

        <AnimatePresence>
          {showRules && event.rules && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", marginTop: 10 }}>
              {event.rules.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: event.color, fontWeight: 800, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{r}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function EventsCenter() {
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <div style={{ padding: "16px 14px 0" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {EVENT_TABS.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.94 }}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "7px 20px", borderRadius: 20, fontSize: 12, fontWeight: 800,
              border: "none", cursor: "pointer",
              background: activeTab === t ? "#1F6BFF" : "#fff",
              color: activeTab === t ? "#fff" : "#9CA3AF",
              boxShadow: activeTab === t ? "0 4px 12px rgba(31,107,255,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}>{t} {activeTab === t && `(${EVENTS[t].length})`}</motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {(EVENTS[activeTab] || []).map(event => (
            <EventCard key={event.id} event={event} tab={activeTab} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}