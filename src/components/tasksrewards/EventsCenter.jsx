import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const EVENT_SECTIONS = ["Active", "Upcoming", "Completed"];

const EVENTS = {
  Active: [
    { id: 1, title: "Recharge Festival",  type: "Recharge Event", icon: "🪙", banner: "#1F6BFF", participants: 1240, endsIn: "2d 4h", reward: "5000 Coins + Badge", joined: false, desc: "Recharge 500 coins during the event period to win exclusive rewards." },
    { id: 2, title: "Gift Storm",          type: "Gift Event",     icon: "🎁", banner: "#EC4899", participants: 860,  endsIn: "1d 12h",reward: "10 Diamonds",       joined: true,  desc: "Send the most gifts to climb the leaderboard and win premium prizes." },
    { id: 3, title: "PK Tournament",       type: "PK Event",       icon: "⚔️", banner: "#9333EA", participants: 430,  endsIn: "3d",     reward: "VIP 30 Days",      joined: false, desc: "Win 5 PK battles to qualify for the grand finale and massive rewards." },
    { id: 4, title: "Lucky Draw June",     type: "Lucky Draw",     icon: "🎰", banner: "#FFC83D", participants: 3200, endsIn: "4d",     reward: "Mystery Box",      joined: true,  desc: "Join the lucky draw for a chance to win rare gifts and special IDs." },
  ],
  Upcoming: [
    { id: 5, title: "Agency Championships", type: "Agency Event",  icon: "🏢", banner: "#10B981", participants: 0, startsIn: "2d",   reward: "Agency Trophy",    joined: false, desc: "Top agencies compete for the championship title and exclusive rewards." },
    { id: 6, title: "Eid Festival Event",   type: "Festival Event",icon: "🌙", banner: "#F59E0B", participants: 0, startsIn: "5d",   reward: "Eid Bundle",       joined: false, desc: "Celebrate with special Eid rewards and limited-edition decorations." },
  ],
  Completed: [
    { id: 7, title: "Top Host May",  type: "Host Event",    icon: "🎙️", banner: "#6B7280", participants: 280, endedOn: "Jun 1",  reward: "Host Crown",       joined: true  },
    { id: 8, title: "Gift Week",     type: "Gift Event",    icon: "🎀", banner: "#6B7280", participants: 920, endedOn: "Jun 7",  reward: "500 Diamonds",     joined: false },
  ],
};

export default function EventsCenter() {
  const [section, setSection] = useState("Active");
  const [joinedEvents, setJoinedEvents] = useState({ 2: true, 4: true, 7: true });

  const handleJoin = (id, title) => {
    setJoinedEvents(j => ({ ...j, [id]: true }));
    toast.success(`🎉 Joined "${title}"!`);
  };

  return (
    <div style={{ padding: "14px 14px 0" }}>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {EVENT_SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)}
            style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
              background: section === s ? "#1F6BFF" : "#fff",
              color: section === s ? "#fff" : "#9CA3AF",
              border: section === s ? "none" : "1px solid #E5E7EB",
            }}>{s}</button>
        ))}
      </div>

      {EVENTS[section].map((ev, i) => (
        <motion.div key={ev.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          style={{
            background: "#fff", borderRadius: 18, marginBottom: 12, overflow: "hidden",
            border: "1px solid #F0F0F8", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
          {/* Banner */}
          <div style={{
            background: `linear-gradient(135deg, ${ev.banner}CC, ${ev.banner}88)`,
            padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 28 }}>{ev.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{ev.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>{ev.type}</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "4px 10px",
              fontSize: 10, color: "#fff", fontWeight: 700,
            }}>
              {ev.endsIn ? `⏰ ${ev.endsIn}` : ev.startsIn ? `🔜 ${ev.startsIn}` : `✅ Ended ${ev.endedOn}`}
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            {ev.desc && <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 10, lineHeight: 1.6 }}>{ev.desc}</div>}
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>👥 {ev.participants.toLocaleString()} joined</div>
              <div style={{ fontSize: 11, color: "#FFC83D", fontWeight: 700 }}>🏆 {ev.reward}</div>
            </div>
            {section !== "Completed" && (
              <div style={{ display: "flex", gap: 8 }}>
                <motion.button whileTap={{ scale: 0.93 }}
                  style={{
                    padding: "8px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: "#F5F7FA", border: "1px solid #E5E7EB", color: "#6B7280", cursor: "pointer",
                  }}>📋 Rules</motion.button>
                <motion.button whileTap={{ scale: 0.93 }}
                  style={{
                    padding: "8px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: "#F5F7FA", border: "1px solid #E5E7EB", color: "#6B7280", cursor: "pointer",
                  }}>🏆 Ranking</motion.button>
                {joinedEvents[ev.id]
                  ? <div style={{ marginLeft: "auto", fontSize: 11, color: "#10B981", fontWeight: 800, display: "flex", alignItems: "center" }}>✓ Joined</div>
                  : (
                    <motion.button whileTap={{ scale: 0.93 }} onClick={() => handleJoin(ev.id, ev.title)}
                      style={{
                        marginLeft: "auto", padding: "8px 18px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                        background: "linear-gradient(135deg,#1F6BFF,#60A5FA)",
                        color: "#fff", border: "none", cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(31,107,255,0.3)",
                      }}>Join Event</motion.button>
                  )
                }
              </div>
            )}
            {section === "Completed" && joinedEvents[ev.id] && (
              <motion.button whileTap={{ scale: 0.93 }}
                style={{
                  padding: "8px 18px", borderRadius: 20, fontSize: 11, fontWeight: 800,
                  background: "linear-gradient(135deg,#10B981,#059669)",
                  color: "#fff", border: "none", cursor: "pointer",
                }}
                onClick={() => toast.success("Reward claimed!")}>
                🎁 Claim Reward
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}