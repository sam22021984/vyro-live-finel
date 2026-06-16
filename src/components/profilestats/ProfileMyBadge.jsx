import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CATEGORIES = ["All", "VIP", "Host", "Agency", "Achievement", "Event", "Special"];

const BADGES = [
  { id: 1, name: "VIP Star",        category: "VIP",         icon: "⭐", level: 3, status: "Active",    desc: "Awarded to VIP level 3 members",      unlockDate: "2026-01-10" },
  { id: 2, name: "Top Host",        category: "Host",        icon: "🎙️", level: 5, status: "Unlocked",  desc: "Ranked top 100 hosts this month",      unlockDate: "2026-02-14" },
  { id: 3, name: "Gift Master",     category: "Achievement", icon: "🎁", level: 2, status: "Unlocked",  desc: "Sent 500+ gifts total",                unlockDate: "2026-03-01" },
  { id: 4, name: "Agency Pro",      category: "Agency",      icon: "🏢", level: 1, status: "Locked",    desc: "Join or lead a verified agency",       unlockDate: null },
  { id: 5, name: "Event Champion",  category: "Event",       icon: "🏆", level: 4, status: "Unlocked",  desc: "Won a platform-wide event",            unlockDate: "2026-04-20" },
  { id: 6, name: "Diamond Guard",   category: "Special",     icon: "💎", level: 7, status: "Locked",    desc: "Exclusive special badge",              unlockDate: null },
  { id: 7, name: "Daily Hero",      category: "Achievement", icon: "🦸", level: 1, status: "Expired",   desc: "30-day daily login streak",            unlockDate: "2025-12-01" },
  { id: 8, name: "VIP Crown",       category: "VIP",         icon: "👑", level: 5, status: "Locked",    desc: "Requires VIP level 5",                 unlockDate: null },
];

const STATUS_COLOR = { Active: "#10B981", Unlocked: "#1F6BFF", Locked: "#9CA3AF", Expired: "#EF4444" };
const STATUS_BG    = { Active: "#ECFDF5", Unlocked: "#EFF6FF", Locked: "#F5F7FA", Expired: "#FEF2F2" };

export default function ProfileMyBadge() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = cat === "All" ? BADGES : BADGES.filter(b => b.category === cat);

  return (
    <div style={{ padding: "14px" }}>
      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
              background: cat === c ? "#1F6BFF" : "#fff",
              color: cat === c ? "#fff" : "#6B7280",
              boxShadow: cat === c ? "0 4px 12px rgba(31,107,255,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {filtered.map((b, i) => (
          <motion.button key={b.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(b)}
            style={{ background: "#fff", borderRadius: 16, padding: "16px 12px", border: `1px solid ${STATUS_COLOR[b.status]}22`, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", cursor: "pointer", textAlign: "center", position: "relative" }}>
            {/* Status pill */}
            <div style={{ position: "absolute", top: 8, right: 8, padding: "2px 8px", borderRadius: 10, fontSize: 9, fontWeight: 800, background: STATUS_BG[b.status], color: STATUS_COLOR[b.status] }}>
              {b.status}
            </div>
            <div style={{ fontSize: 36, marginBottom: 8, filter: b.status === "Locked" ? "grayscale(1) opacity(0.4)" : "none" }}>{b.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{b.name}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 6 }}>Lv.{b.level} · {b.category}</div>
            {b.status !== "Locked" && (
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {b.status === "Active"
                  ? <span style={{ fontSize: 9, fontWeight: 800, color: "#10B981" }}>✓ Equipped</span>
                  : <span style={{ fontSize: 9, fontWeight: 700, color: "#1F6BFF" }}>Tap to equip</span>}
              </div>
            )}
          </motion.button>
        ))}
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
                <div style={{ fontSize: 56, marginBottom: 8, filter: selected.status === "Locked" ? "grayscale(1) opacity(0.4)" : "none" }}>{selected.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0D1B3E" }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Level {selected.level} · {selected.category}</div>
                <div style={{ display: "inline-block", marginTop: 8, padding: "4px 14px", borderRadius: 10, fontSize: 11, fontWeight: 800, background: STATUS_BG[selected.status], color: STATUS_COLOR[selected.status] }}>{selected.status}</div>
              </div>
              <div style={{ background: "#F5F7FA", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{selected.desc}</div>
              {selected.unlockDate && <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginBottom: 16 }}>Earned: {selected.unlockDate}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {selected.status === "Unlocked" && (
                  <button onClick={() => { toast.success(`${selected.name} equipped!`); setSelected(null); }}
                    style={{ padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#1F6BFF,#60A5FA)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: 12 }}>
                    🏅 Equip Badge
                  </button>
                )}
                {selected.status === "Active" && (
                  <button onClick={() => { toast.info("Badge removed."); setSelected(null); }}
                    style={{ padding: "12px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FEE2E2", fontWeight: 800, cursor: "pointer", color: "#EF4444", fontSize: 12 }}>
                    ✕ Remove
                  </button>
                )}
                <button onClick={() => { toast.success("Shared to feed!"); setSelected(null); }}
                  style={{ padding: "12px", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", fontWeight: 800, cursor: "pointer", color: "#10B981", fontSize: 12 }}>
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