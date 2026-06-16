import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CATEGORIES = ["All", "Daily", "Monthly", "VIP", "Top Supporter", "Top Host", "Event Winner"];

const MEDALS = [
  { id: 1, name: "Daily Star",        category: "Daily",         icon: "🌟", rank: "#1",   reward: "500 XP",   earnedDate: "2026-06-15", equipped: true  },
  { id: 2, name: "Monthly Champion",  category: "Monthly",       icon: "🏆", rank: "Top 10", reward: "2000 XP", earnedDate: "2026-05-31", equipped: false },
  { id: 3, name: "VIP Gold",          category: "VIP",           icon: "👑", rank: "VIP5",  reward: "VIP Badge", earnedDate: "2026-04-10", equipped: false },
  { id: 4, name: "Top Gifter",        category: "Top Supporter", icon: "🎁", rank: "#3",   reward: "1000 coins", earnedDate: "2026-03-20", equipped: false },
  { id: 5, name: "Host Legend",       category: "Top Host",      icon: "🎙️", rank: "#5",   reward: "Frame",    earnedDate: "2026-02-28", equipped: false },
  { id: 6, name: "Event King",        category: "Event Winner",  icon: "⚡", rank: "#1",   reward: "Special ID", earnedDate: "2026-01-15", equipped: false },
];

export default function ProfileMyMedals() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [equipped, setEquipped] = useState([1]);

  const filtered = cat === "All" ? MEDALS : MEDALS.filter(m => m.category === cat);

  const toggleEquip = (id) => {
    if (equipped.includes(id)) {
      setEquipped(e => e.filter(x => x !== id));
      toast.info("Medal removed.");
    } else if (equipped.length >= 3) {
      toast.error("Max 3 medals can be equipped at once.");
    } else {
      setEquipped(e => [...e, id]);
      toast.success("Medal equipped!");
    }
    setSelected(null);
  };

  return (
    <div style={{ padding: "14px" }}>
      {/* Equip Counter */}
      <div style={{ background: "linear-gradient(135deg,#FFC83D,#FDE68A)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>Medals Equipped</div>
          <div style={{ fontSize: 11, color: "rgba(13,27,62,0.6)", marginTop: 2 }}>Max 3 medals can be displayed</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#0D1B3E" }}>{equipped.length}/3</div>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
              background: cat === c ? "#FFC83D" : "#fff",
              color: cat === c ? "#0D1B3E" : "#6B7280",
              boxShadow: cat === c ? "0 4px 12px rgba(255,200,61,0.4)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Medal List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((m, i) => {
          const isEquipped = equipped.includes(m.id);
          return (
            <motion.button key={m.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(m)}
              style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${isEquipped ? "#FFC83D" : "#F0F0F8"}`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: isEquipped ? "#FFFBEB" : "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{m.name}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{m.category} · Rank {m.rank}</div>
                <div style={{ fontSize: 10, color: "#FFC83D", fontWeight: 800, marginTop: 2 }}>🎁 {m.reward}</div>
              </div>
              {isEquipped && <div style={{ padding: "3px 10px", borderRadius: 10, background: "#FFFBEB", border: "1px solid #FCD34D", fontSize: 10, fontWeight: 800, color: "#D97706" }}>Equipped</div>}
            </motion.button>
          );
        })}
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>{selected.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0D1B3E" }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{selected.category} · Rank {selected.rank}</div>
                <div style={{ fontSize: 12, color: "#FFC83D", fontWeight: 800, marginTop: 4 }}>Reward: {selected.reward}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>Earned: {selected.earnedDate}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleEquip(selected.id)}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", fontWeight: 800, cursor: "pointer", fontSize: 12,
                    background: equipped.includes(selected.id) ? "#FEF2F2" : "linear-gradient(135deg,#FFC83D,#FDE68A)",
                    color: equipped.includes(selected.id) ? "#EF4444" : "#0D1B3E" }}>
                  {equipped.includes(selected.id) ? "✕ Remove Medal" : "🥇 Equip Medal"}
                </button>
                <button onClick={() => { toast.success("Medal shared!"); setSelected(null); }}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", fontWeight: 800, cursor: "pointer", color: "#10B981", fontSize: 12 }}>
                  🔗 Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}