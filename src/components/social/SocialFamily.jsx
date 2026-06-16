import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const card = { background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 12 };

const LEADERBOARD = [
  { rank: 1, name: "Phoenix Clan 🦅", points: 98420, members: 18 },
  { rank: 2, name: "Dragon Clan 🐉",  points: 87300, members: 12 },
  { rank: 3, name: "Storm Squad ⚡",  points: 74100, members: 15 },
  { rank: 4, name: "Moon Tribe 🌙",   points: 61200, members: 10 },
  { rank: 5, name: "Solar Kings ☀️",  points: 52800, members: 8  },
];

const MISSIONS = [
  { label: "Send 10 gifts today",       reward: "500 pts", done: true  },
  { label: "Host 1 live room",          reward: "800 pts", done: false },
  { label: "5 members stream together", reward: "1200 pts",done: false },
  { label: "Reach 90K weekly points",   reward: "2000 pts",done: false },
];

export default function SocialFamily() {
  const [myFamily, setMyFamily] = useState({
    name: "Dragon Clan 🐉", rank: 2, points: 87300,
    members: 12, maxMembers: 20,
    privacy: "Public",
    description: "We rise together 🔥",
    members_list: [
      { id: 1, name: "You (Leader)", avatar: "🧑", role: "Leader",  online: true  },
      { id: 2, name: "Luna Ray",     avatar: "🌙", role: "Elder",   online: true  },
      { id: 3, name: "Rex Storm",    avatar: "⚡", role: "Elder",   online: false },
      { id: 4, name: "Nova Star",    avatar: "⭐", role: "Member",  online: true  },
      { id: 5, name: "Sky Blue",     avatar: "🌊", role: "Member",  online: false },
    ],
  });
  const [tab, setTab] = useState("home");
  const [showCreate, setShowCreate] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [newFamily, setNewFamily] = useState({ name: "", description: "", privacy: "Public" });

  const TABS = [
    { id: "home",     label: "Home"     },
    { id: "members",  label: "Members"  },
    { id: "missions", label: "Missions" },
    { id: "ranking",  label: "Ranking"  },
  ];

  if (!myFamily) return (
    <div style={{ padding: "14px" }}>
      <div style={{ ...card, textAlign: "center", padding: "36px 20px" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🏠</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E", marginBottom: 6 }}>No Family Yet</div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 24, lineHeight: 1.7 }}>Create or join a family to connect with others and compete on the leaderboard!</div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowCreate(true)}
            style={{ flex: 1, padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#F59E0B,#FCD34D)", border: "none", fontWeight: 800, cursor: "pointer", color: "#0D1B3E", fontSize: 13 }}>
            🏠 Create Family
          </motion.button>
          <motion.button whileTap={{ scale: 0.94 }} onClick={() => toast.info("Searching families...")}
            style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F5F7FA", border: "1px solid #E5E7EB", fontWeight: 800, cursor: "pointer", color: "#374151", fontSize: 13 }}>
            🔍 Join Family
          </motion.button>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 16 }}>🏠 Create Family</div>
              {["name", "description"].map(field => (
                <input key={field} value={newFamily[field]}
                  onChange={e => setNewFamily(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={field === "name" ? "Family Name (e.g. Dragon Clan 🐉)" : "Family Description"}
                  style={{ width: "100%", background: "#F5F7FA", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 14px", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
              ))}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["Public", "Private"].map(p => (
                  <button key={p} onClick={() => setNewFamily(f => ({ ...f, privacy: p }))}
                    style={{ flex: 1, padding: "10px", borderRadius: 12, cursor: "pointer", fontWeight: 800, fontSize: 12, border: newFamily.privacy === p ? "2px solid #F59E0B" : "1px solid #E5E7EB", background: newFamily.privacy === p ? "#FFFBEB" : "#F5F7FA", color: newFamily.privacy === p ? "#D97706" : "#6B7280" }}>
                    {p === "Public" ? "🌐 Public" : "🔒 Private"}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button disabled={!newFamily.name.trim()}
                  onClick={() => { setMyFamily({ name: newFamily.name, rank: 999, points: 0, members: 1, maxMembers: 20, privacy: newFamily.privacy, description: newFamily.description, members_list: [{ id: 1, name: "You (Leader)", avatar: "🧑", role: "Leader", online: true }] }); setShowCreate(false); toast.success(`Family "${newFamily.name}" created!`); }}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: newFamily.name.trim() ? "linear-gradient(135deg,#F59E0B,#FCD34D)" : "#E5E7EB", border: "none", fontWeight: 800, cursor: newFamily.name.trim() ? "pointer" : "default", color: newFamily.name.trim() ? "#0D1B3E" : "#9CA3AF" }}>
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div style={{ padding: "14px" }}>
      {/* Family Banner */}
      <div style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", borderRadius: 20, padding: "20px", marginBottom: 14, boxShadow: "0 8px 24px rgba(245,158,11,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0D1B3E" }}>{myFamily.name}</div>
            <div style={{ fontSize: 11, color: "rgba(13,27,62,0.6)", marginTop: 3 }}>{myFamily.description}</div>
            <div style={{ fontSize: 11, color: "rgba(13,27,62,0.6)", marginTop: 3 }}>🏆 Rank #{myFamily.rank} · {myFamily.points.toLocaleString()} pts</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28 }}>🏠</div>
            <div style={{ fontSize: 10, color: "rgba(13,27,62,0.5)", marginTop: 2 }}>{myFamily.members}/{myFamily.maxMembers} members</div>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${(myFamily.members / myFamily.maxMembers) * 100}%`, background: "#0D1B3E", borderRadius: 3 }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 14, padding: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800,
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#1F6BFF" : "#9CA3AF",
              boxShadow: tab === t.id ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Home */}
      {tab === "home" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.info("Opening family chat...")}
            style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#1F6BFF,#60A5FA)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            💬 Family Chat
          </motion.button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => setTab("ranking")}
              style={{ padding: "13px", borderRadius: 12, background: "#FFF7ED", border: "1px solid #FED7AA", fontWeight: 800, cursor: "pointer", color: "#D97706", fontSize: 12 }}>
              🏆 View Ranking
            </motion.button>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => setTab("members")}
              style={{ padding: "13px", borderRadius: 12, background: "#F0F7FF", border: "1px solid #BFDBFE", fontWeight: 800, cursor: "pointer", color: "#1F6BFF", fontSize: 12 }}>
              👥 Members
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowLeave(true)}
            style={{ padding: "13px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FEE2E2", fontWeight: 800, cursor: "pointer", color: "#EF4444", fontSize: 13 }}>
            🚪 Leave Family
          </motion.button>
        </div>
      )}

      {/* Tab: Members */}
      {tab === "members" && (
        <div style={card}>
          {myFamily.members_list.map((m, i) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, marginBottom: i < myFamily.members_list.length - 1 ? 10 : 0, borderBottom: i < myFamily.members_list.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0F0F8", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.avatar}</div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: m.online ? "#10B981" : "#D1D5DB", border: "2px solid #fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{m.name}</div>
                <div style={{ fontSize: 10, color: m.role === "Leader" ? "#F59E0B" : m.role === "Elder" ? "#8B5CF6" : "#9CA3AF" }}>
                  {m.role === "Leader" ? "👑 " : m.role === "Elder" ? "⭐ " : "• "}{m.role}
                </div>
              </div>
              {m.role !== "Leader" && (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => toast.info(`Managing ${m.name}...`)}
                  style={{ padding: "5px 10px", borderRadius: 10, background: "#F5F7FA", border: "1px solid #E5E7EB", fontSize: 10, fontWeight: 700, cursor: "pointer", color: "#374151" }}>
                  Manage
                </motion.button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Missions */}
      {tab === "missions" && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>🎯 Family Missions</div>
          {MISSIONS.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < MISSIONS.length - 1 ? "1px solid #F0F0F8" : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: m.done ? "#ECFDF5" : "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {m.done ? "✅" : "🎯"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: m.done ? "#6B7280" : "#0D1B3E", textDecoration: m.done ? "line-through" : "none" }}>{m.label}</div>
                <div style={{ fontSize: 10, color: "#FFC83D", fontWeight: 800 }}>+{m.reward}</div>
              </div>
              {!m.done && <div style={{ fontSize: 10, color: "#1F6BFF", fontWeight: 700 }}>In Progress</div>}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Ranking */}
      {tab === "ranking" && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>🏆 Weekly Family Ranking</div>
          {LEADERBOARD.map((f, i) => {
            const isMe = f.name === myFamily.name;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, marginBottom: 6, background: isMe ? "#FFFBEB" : "#F5F7FA", border: isMe ? "1.5px solid #FCD34D" : "1px solid transparent" }}>
                <div style={{ fontSize: 18, width: 28, textAlign: "center" }}>{f.rank === 1 ? "🥇" : f.rank === 2 ? "🥈" : f.rank === 3 ? "🥉" : `#${f.rank}`}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{f.name} {isMe && "👈"}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{f.members} members</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#F59E0B" }}>{f.points.toLocaleString()} pts</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave confirmation */}
      <AnimatePresence>
        {showLeave && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLeave(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 40 }}>🚪</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginTop: 8 }}>Leave Family?</div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>You will lose access to family chat and ranking. This cannot be undone.</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowLeave(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={() => { setMyFamily(null); setShowLeave(false); toast.info("You left the family."); }}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#EF4444", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}