import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const card = { background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 12 };

const STATUS_META = {
  "Single":          { icon: "💙", color: "#6B7280", bg: "#F5F7FA", label: "You are Single" },
  "Requested":       { icon: "⏳", color: "#F59E0B", bg: "#FFF7ED", label: "Request Sent" },
  "In Relationship": { icon: "💑", color: "#EC4899", bg: "#FFF0F3", label: "In a Relationship" },
  "Blocked":         { icon: "🚫", color: "#EF4444", bg: "#FEF2F2", label: "Blocked" },
};

const LEVEL_BADGES = ["💛 Sweet", "💙 Close", "💜 Deep", "❤️ Devoted", "💎 Soulmates"];

export default function SocialRelationship() {
  const [status, setStatus] = useState("Single");
  const [partner, setPartner] = useState(null);
  const [incoming, setIncoming] = useState({ name: "Luna Ray", avatar: "🌙" });
  const [lovePoints] = useState(1240);
  const [breakUpConfirm, setBreakUpConfirm] = useState(false);
  const relLevel = Math.min(4, Math.floor(lovePoints / 400));
  const anniversary = "Jun 5, 2026";
  const meta = STATUS_META[status];

  return (
    <div style={{ padding: "14px" }}>

      {/* Status Card */}
      <div style={{ ...card, background: meta.bg, border: `1px solid ${meta.color}22`, textAlign: "center", padding: "24px 20px" }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>{meta.icon}</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>{meta.label}</div>
        {partner && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F0F0F8", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{partner.avatar}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{partner.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>Since {anniversary}</div>
            </div>
          </div>
        )}
      </div>

      {/* In Relationship — couple details */}
      {status === "In Relationship" && partner && (
        <>
          {/* Love Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { label: "Love Points", val: lovePoints.toLocaleString(), icon: "💝" },
              { label: "Rel. Level",  val: `Lv.${relLevel + 1}`,        icon: "⭐" },
              { label: "Days",        val: "11",                         icon: "📅" },
            ].map(s => (
              <div key={s.label} style={{ ...card, marginBottom: 0, textAlign: "center", padding: "12px 6px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#EC4899" }}>{s.val}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Level badge */}
          <div style={{ ...card, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>{LEVEL_BADGES[relLevel]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>Relationship Level {relLevel + 1}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 6 }}>{lovePoints % 400} / 400 pts to next level</div>
              <div style={{ height: 6, background: "#F0F0F8", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${((lovePoints % 400) / 400) * 100}%`, background: "linear-gradient(90deg,#EC4899,#F472B6)", borderRadius: 3 }} />
              </div>
            </div>
          </div>

          {/* Couple Actions */}
          <div style={{ ...card }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>Couple Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.info("Opening couple chat...")}
                style={{ padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#EC4899,#F472B6)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: 13 }}>
                💬 Couple Chat
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => toast.info("Opening couple gift panel...")}
                style={{ padding: "13px", borderRadius: 12, background: "#FFF7ED", border: "1px solid #FED7AA", fontWeight: 800, cursor: "pointer", color: "#F59E0B", fontSize: 13 }}>
                🎁 Send Gift
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setBreakUpConfirm(true)}
                style={{ padding: "13px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FEE2E2", fontWeight: 800, cursor: "pointer", color: "#EF4444", fontSize: 13 }}>
                💔 Break Up
              </motion.button>
            </div>
          </div>
        </>
      )}

      {/* Incoming Request */}
      {status === "Single" && incoming && (
        <div style={{ ...card, border: "1px solid #FCE7F3" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#EC4899", marginBottom: 10 }}>💌 INCOMING REQUEST</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F0F0F8", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{incoming.avatar}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{incoming.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Sent you a relationship request 💌</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => { setStatus("In Relationship"); setPartner(incoming); setIncoming(null); toast.success(`💑 Now in a relationship with ${incoming.name}!`); }}
              style={{ flex: 1, padding: "11px", borderRadius: 12, background: "linear-gradient(135deg,#EC4899,#F472B6)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>
              ✅ Accept
            </motion.button>
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => { setIncoming(null); toast.info("Request rejected."); }}
              style={{ flex: 1, padding: "11px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#6B7280" }}>
              ❌ Reject
            </motion.button>
          </div>
        </div>
      )}

      {/* Single actions */}
      {status === "Single" && !incoming && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>Find a Partner</div>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { setStatus("Requested"); toast.info("Relationship request sent!"); }}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#EC4899,#F472B6)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: 13 }}>
            💌 Send Relationship Request
          </motion.button>
        </div>
      )}

      {/* Requested state */}
      {status === "Requested" && (
        <div style={card}>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12, textAlign: "center" }}>⏳ Waiting for response...</div>
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { setStatus("Single"); toast.info("Request cancelled."); }}
            style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#6B7280" }}>
            ✖ Cancel Request
          </motion.button>
        </div>
      )}

      {/* Break up confirmation */}
      <AnimatePresence>
        {breakUpConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setBreakUpConfirm(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 40 }}>💔</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E", marginTop: 8 }}>End Relationship?</div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>This will end your relationship with {partner?.name}. This cannot be undone.</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setBreakUpConfirm(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={() => { setStatus("Single"); setPartner(null); setBreakUpConfirm(false); toast.info("Relationship ended."); }}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#EF4444", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Break Up</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}