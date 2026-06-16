/**
 * Social Module — Premium Social Network UI
 * Access: Home → More Services → Social
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const SECTIONS = [
  { id: "invite",       label: "My Invite",     icon: "🎟️", color: "#1F6BFF" },
  { id: "people",       label: "My People",     icon: "👥", color: "#8B5CF6" },
  { id: "friends",      label: "Friends",       icon: "🤝", color: "#10B981" },
  { id: "relationship", label: "Relationship",  icon: "💑", color: "#EC4899" },
  { id: "family",       label: "Family",        icon: "🏠", color: "#F59E0B" },
];

/* ── Shared styles ── */
const card = {
  background: "#fff", borderRadius: 16, padding: "14px 16px",
  border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  marginBottom: 10,
};

const btn = (bg, color, border) => ({
  padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700,
  cursor: "pointer", border: border || "none", background: bg, color,
});

const primaryBtn = {
  ...btn("linear-gradient(135deg,#1F6BFF,#60A5FA)", "#fff"),
  boxShadow: "0 4px 12px rgba(31,107,255,0.28)",
};

/* ── Mock data ── */
const MOCK_PEOPLE = [
  { id: 1, name: "Luna Ray",    avatar: "🌙", online: true,  level: 42, lastSeen: "Now",      mutual: 12 },
  { id: 2, name: "Rex Storm",   avatar: "⚡", online: true,  level: 38, lastSeen: "Now",      mutual: 7  },
  { id: 3, name: "Nova Star",   avatar: "⭐", online: false, level: 55, lastSeen: "2h ago",   mutual: 4  },
  { id: 4, name: "Kai Blaze",   avatar: "🔥", online: false, level: 29, lastSeen: "Yesterday",mutual: 9  },
  { id: 5, name: "Sky Blue",    avatar: "🌊", online: true,  level: 61, lastSeen: "Now",      mutual: 15 },
];

const MOCK_FRIENDS = [
  { id: 1, name: "Luna Ray",  avatar: "🌙", online: true,  since: "Jun 2026" },
  { id: 2, name: "Rex Storm", avatar: "⚡", online: true,  since: "May 2026" },
  { id: 3, name: "Sky Blue",  avatar: "🌊", online: false, since: "Apr 2026" },
];

/* ── My Invite ── */
function MyInvite() {
  const inviteCode = "VYRO-X8K2-4821";
  const inviteLink = `https://vyrolive.app/join?ref=${inviteCode}`;

  const copy = () => {
    navigator.clipboard?.writeText(inviteLink);
    toast.success("Invite link copied!");
  };

  return (
    <div style={{ padding: "14px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1F6BFF,#60A5FA)",
        borderRadius: 20, padding: "22px 20px", marginBottom: 16,
        boxShadow: "0 8px 24px rgba(31,107,255,0.3)",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎟️</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Invite & Earn</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>
          Invite friends and earn 500 coins per successful invite!
        </div>
        {/* Invite code */}
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "0.1em" }}>{inviteCode}</span>
          <button onClick={copy}
            style={{ ...btn("rgba(255,255,255,0.25)", "#fff", "1px solid rgba(255,255,255,0.4)"), fontSize: 11 }}>
            Copy Code
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Invited", val: "14", icon: "👥" },
          { label: "Joined",  val: "9",  icon: "✅" },
          { label: "Earned",  val: "4,500 🪙", icon: "💰" },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, ...card, marginBottom: 0, textAlign: "center", padding: "12px 8px",
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#1F6BFF" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>Share Your Invite</div>
        <div style={{ fontSize: 11, color: "#9CA3AF", background: "#F5F7FA", borderRadius: 10, padding: "9px 12px", marginBottom: 12, wordBreak: "break-all" }}>
          {inviteLink}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.93 }} onClick={copy} style={{ ...primaryBtn, flex: 1, padding: "10px" }}>
            📋 Copy Link
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }}
            onClick={() => navigator.share?.({ title: "Join VYRO Live", url: inviteLink }) || toast.info("Share sheet opened")}
            style={{ ...btn("#F5F7FA", "#374151", "1px solid #E5E7EB"), flex: 1, padding: "10px" }}>
            📤 Share
          </motion.button>
        </div>
      </div>

      {/* Reward tiers */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>🏆 Reward Tiers</div>
        {[
          { n: "1st Invite",   r: "500 Coins"  },
          { n: "5 Invites",    r: "3,000 Coins + Badge" },
          { n: "10 Invites",   r: "7,000 Coins + VIP Day" },
          { n: "25 Invites",   r: "VIP 7 Days + Frame" },
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid #F0F0F8" : "none" }}>
            <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{t.n}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FFC83D" }}>🏆 {t.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── My People ── */
function MyPeople() {
  const [people, setPeople] = useState(MOCK_PEOPLE);
  const [removing, setRemoving] = useState(null);

  const remove = (id) => {
    setPeople(p => p.filter(u => u.id !== id));
    setRemoving(null);
    toast.success("User removed.");
  };

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700, marginBottom: 12 }}>
        {people.length} PEOPLE · {people.filter(u => u.online).length} ONLINE
      </div>
      {people.map((u, i) => (
        <motion.div key={u.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F0F0F8", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{u.avatar}</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: u.online ? "#10B981" : "#D1D5DB", border: "2px solid #fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{u.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>Lv.{u.level} · {u.mutual} mutual · {u.lastSeen}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info(`Opening ${u.name}'s profile`)} style={{ ...btn("#F5F7FA","#374151","1px solid #E5E7EB") }}>👤 Profile</motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info("Opening chat...")} style={{ ...primaryBtn }}>💬 Message</motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.success(`Following ${u.name}!`)} style={{ ...btn("#ECFDF5","#10B981","1px solid #D1FAE5") }}>+ Follow</motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => setRemoving(u.id)} style={{ ...btn("#FEF2F2","#EF4444","1px solid #FEE2E2") }}>Remove</motion.button>
          </div>
        </motion.div>
      ))}

      {/* Confirm remove modal */}
      <AnimatePresence>
        {removing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setRemoving(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Remove from My People?</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>This person will be removed from your list.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setRemoving(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={() => remove(removing)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#EF4444", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Friends ── */
function Friends() {
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  const [confirming, setConfirming] = useState(null);

  const unfriend = (id) => {
    setFriends(f => f.filter(u => u.id !== id));
    setConfirming(null);
    toast.success("Unfriended.");
  };

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700, marginBottom: 12 }}>
        {friends.length} FRIENDS · {friends.filter(u => u.online).length} ONLINE
      </div>
      {friends.map((u, i) => (
        <motion.div key={u.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }} style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F0F0F8", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{u.avatar}</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: u.online ? "#10B981" : "#D1D5DB", border: "2px solid #fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{u.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>Friends since {u.since} · {u.online ? "🟢 Online" : "⚫ Offline"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info("Opening chat...")} style={{ ...primaryBtn }}>💬 Chat</motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info("Opening gift panel...")} style={{ ...btn("#FFF7ED","#F59E0B","1px solid #FED7AA") }}>🎁 Gift</motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toast.info(`Opening ${u.name}'s profile`)} style={{ ...btn("#F5F7FA","#374151","1px solid #E5E7EB") }}>👤 Profile</motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => setConfirming(u.id)} style={{ ...btn("#FEF2F2","#EF4444","1px solid #FEE2E2") }}>Unfriend</motion.button>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {confirming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirming(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Unfriend this person?</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>You will no longer be friends. You can still follow each other.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirming(null)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={() => unfriend(confirming)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#EF4444", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Unfriend</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Relationship ── */
const REL_STATUS = ["Single", "Requested", "In Relationship", "Blocked"];

function Relationship() {
  const [myStatus, setMyStatus] = useState("Single");
  const [partner, setPartner] = useState(null);
  const [incoming, setIncoming] = useState({ name: "Luna Ray", avatar: "🌙" });

  const STATUS_STYLE = {
    "Single":          { bg: "#F5F7FA", color: "#6B7280",  icon: "💙" },
    "Requested":       { bg: "#FFF7ED", color: "#F59E0B",  icon: "⏳" },
    "In Relationship": { bg: "#FFF0F3", color: "#EC4899",  icon: "💑" },
    "Blocked":         { bg: "#FEF2F2", color: "#EF4444",  icon: "🚫" },
  };

  const s = STATUS_STYLE[myStatus];

  return (
    <div style={{ padding: "14px" }}>
      {/* Status card */}
      <div style={{ ...card, background: s.bg, border: `1px solid ${s.color}22`, textAlign: "center", padding: "22px 16px" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>{myStatus}</div>
        {partner && <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>with {partner.name} {partner.avatar}</div>}
      </div>

      {/* Incoming request */}
      {myStatus === "Single" && incoming && (
        <div style={{ ...card, border: "1px solid #FEE2E2" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", marginBottom: 10 }}>💌 INCOMING REQUEST</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F0F0F8", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{incoming.avatar}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{incoming.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Sent you a relationship request 💌</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => { setMyStatus("In Relationship"); setPartner(incoming); setIncoming(null); toast.success(`💑 Now in a relationship with ${incoming.name}!`); }}
              style={{ ...primaryBtn, flex: 1, padding: "10px" }}>✅ Accept</motion.button>
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => { setIncoming(null); toast.info("Request rejected."); }}
              style={{ ...btn("#F3F4F6","#6B7280","none"), flex: 1, padding: "10px" }}>❌ Reject</motion.button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>Actions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {myStatus === "Single" && (
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => { setMyStatus("Requested"); toast.info("Relationship request sent!"); }}
              style={{ padding: "12px", borderRadius: 12, ...btn("linear-gradient(135deg,#EC4899,#F472B6)","#fff"), width: "100%" }}>
              💌 Send Relationship Request
            </motion.button>
          )}
          {myStatus === "In Relationship" && (
            <>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.info("Opening couple chat...")}
                style={{ padding: "12px", borderRadius: 12, ...btn("linear-gradient(135deg,#EC4899,#F472B6)","#fff"), width: "100%" }}>
                💬 Couple Chat
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => { setMyStatus("Single"); setPartner(null); toast.info("Relationship ended."); }}
                style={{ padding: "12px", borderRadius: 12, ...btn("#FEF2F2","#EF4444","1px solid #FEE2E2"), width: "100%" }}>
                💔 Break Up
              </motion.button>
            </>
          )}
          {myStatus === "Requested" && (
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => { setMyStatus("Single"); toast.info("Request cancelled."); }}
              style={{ padding: "12px", borderRadius: 12, ...btn("#F3F4F6","#6B7280","none"), width: "100%" }}>
              ✖ Cancel Request
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Family ── */
function Family() {
  const [myFamily, setMyFamily] = useState({
    name: "Dragon Clan 🐉", rank: 4, members: 12, maxMembers: 20,
    members_list: [
      { id: 1, name: "SAM (You)", avatar: "🧑", role: "Leader",  online: true  },
      { id: 2, name: "Luna Ray",  avatar: "🌙", role: "Elder",   online: true  },
      { id: 3, name: "Rex Storm", avatar: "⚡", role: "Member",  online: false },
      { id: 4, name: "Nova Star", avatar: "⭐", role: "Member",  online: true  },
    ],
  });
  const [showCreate, setShowCreate] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");

  return (
    <div style={{ padding: "14px" }}>
      {myFamily ? (
        <>
          {/* Family banner */}
          <div style={{
            background: "linear-gradient(135deg,#F59E0B,#FCD34D)",
            borderRadius: 20, padding: "20px", marginBottom: 14,
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#0D1B3E" }}>{myFamily.name}</div>
                <div style={{ fontSize: 12, color: "rgba(13,27,62,0.65)", marginTop: 4 }}>
                  Rank #{myFamily.rank} · {myFamily.members}/{myFamily.maxMembers} members
                </div>
              </div>
              <div style={{ fontSize: 28 }}>🏆</div>
            </div>
            <div style={{ marginTop: 12, height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${(myFamily.members / myFamily.maxMembers) * 100}%`, background: "#0D1B3E", borderRadius: 3 }} />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <motion.button whileTap={{ scale: 0.93 }} onClick={() => toast.info("Opening family chat...")}
              style={{ ...primaryBtn, flex: 1, padding: "11px" }}>💬 Family Chat</motion.button>
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => { setMyFamily(null); toast.info("Left the family."); }}
              style={{ ...btn("#FEF2F2","#EF4444","1px solid #FEE2E2"), flex: 1, padding: "11px" }}>🚪 Leave</motion.button>
          </div>

          {/* Members */}
          <div style={{ ...card }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>Members</div>
            {myFamily.members_list.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10, marginBottom: i < myFamily.members_list.length - 1 ? 10 : 0, borderBottom: i < myFamily.members_list.length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F0F0F8", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.avatar}</div>
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: m.online ? "#10B981" : "#D1D5DB", border: "2px solid #fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* No family */}
          <div style={{ ...card, textAlign: "center", padding: "32px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🏠</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 6 }}>No Family Yet</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Create or join a family to connect with others!</div>
            <div style={{ display: "flex", gap: 8 }}>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowCreate(true)}
                style={{ ...primaryBtn, flex: 1, padding: "12px" }}>🏠 Create Family</motion.button>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => toast.info("Searching for families...")}
                style={{ ...btn("#F5F7FA","#374151","1px solid #E5E7EB"), flex: 1, padding: "12px" }}>🔍 Join Family</motion.button>
            </div>
          </div>
        </>
      )}

      {/* Create family modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
              transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginBottom: 16 }}>🏠 Create Family</div>
              <input value={newFamilyName} onChange={e => setNewFamilyName(e.target.value)}
                placeholder="Family name (e.g. Dragon Clan 🐉)"
                style={{ width: "100%", background: "#F5F7FA", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 14px", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 14 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button
                  disabled={!newFamilyName.trim()}
                  onClick={() => {
                    setMyFamily({ name: newFamilyName, rank: 999, members: 1, maxMembers: 20, members_list: [{ id: 1, name: "You (Leader)", avatar: "🧑", role: "Leader", online: true }] });
                    setShowCreate(false);
                    toast.success(`Family "${newFamilyName}" created!`);
                  }}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: newFamilyName.trim() ? "#1F6BFF" : "#E5E7EB", border: "none", fontWeight: 800, cursor: newFamilyName.trim() ? "pointer" : "default", color: "#fff" }}>
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Page ── */
export default function Social() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const renderSection = () => {
    switch (activeSection) {
      case "invite":       return <MyInvite />;
      case "people":       return <MyPeople />;
      case "friends":      return <Friends />;
      case "relationship": return <Relationship />;
      case "family":       return <Family />;
      default:             return null;
    }
  };

  const current = SECTIONS.find(s => s.id === activeSection);

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #F0F0F8",
        padding: "12px 16px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => activeSection ? setActiveSection(null) : navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>
              {current ? current.label : "Social"}
            </div>
            {!current && <div style={{ fontSize: 10, color: "#9CA3AF" }}>Connect with your people</div>}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activeSection ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "16px" }}>
            {/* Hero */}
            <div style={{
              background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
              borderRadius: 20, padding: "22px 20px", marginBottom: 16,
              boxShadow: "0 8px 28px rgba(31,107,255,0.28)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Your Social World</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                Manage your connections, relationships, and build your family community.
              </div>
            </div>

            {/* Section grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SECTIONS.map((s, i) => (
                <motion.button key={s.id} whileTap={{ scale: 0.94 }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    background: "#fff", borderRadius: 18, padding: "18px 14px",
                    border: "1px solid #F0F0F8", boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8,
                    cursor: "pointer",
                  }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{s.label}</div>
                  <ChevronRight size={14} color={s.color} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {renderSection()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}