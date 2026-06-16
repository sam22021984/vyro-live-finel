import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const card = { background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 12 };

export default function SocialMyInvite() {
  const inviteCode = "VYRO-X8K2-4821";
  const inviteLink = `https://vyrolive.app/join?ref=${inviteCode}`;
  const [stats] = useState({ invited: 14, joined: 9, pending: 5, earned: 4500 });

  const copy = () => { navigator.clipboard?.writeText(inviteLink); toast.success("Invite link copied!"); };
  const share = () => navigator.share?.({ title: "Join VYRO Live", url: inviteLink }).catch(() => {}) || toast.info("Share opened");

  return (
    <div style={{ padding: "14px" }}>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg,#1F6BFF,#60A5FA)",
        borderRadius: 20, padding: "22px 20px", marginBottom: 14,
        boxShadow: "0 8px 24px rgba(31,107,255,0.28)",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Invite & Earn</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 18, lineHeight: 1.6 }}>
          Invite friends and earn 500 coins per successful join!
        </div>
        {/* Code pill */}
        <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: "0.12em" }}>{inviteCode}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={copy}
            style={{ background: "rgba(255,255,255,0.28)", border: "1px solid rgba(255,255,255,0.45)", borderRadius: 10, padding: "5px 12px", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
            Copy Code
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Invites",   val: stats.invited, icon: "📨", color: "#1F6BFF" },
          { label: "Joined",          val: stats.joined,  icon: "✅", color: "#10B981" },
          { label: "Pending",         val: stats.pending, icon: "⏳", color: "#F59E0B" },
          { label: "Coins Earned",    val: `${stats.earned.toLocaleString()} 🪙`, icon: "💰", color: "#FFC83D" },
        ].map(s => (
          <div key={s.label} style={{ ...card, marginBottom: 0, display: "flex", alignItems: "center", gap: 12, padding: "14px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Link */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 10 }}>Your Referral Link</div>
        <div style={{ fontSize: 11, color: "#6B7280", background: "#F5F7FA", borderRadius: 10, padding: "10px 12px", marginBottom: 12, wordBreak: "break-all", lineHeight: 1.6 }}>
          {inviteLink}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.93 }} onClick={copy}
            style={{ flex: 1, padding: "11px", borderRadius: 12, background: "linear-gradient(135deg,#1F6BFF,#60A5FA)", border: "none", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(31,107,255,0.28)" }}>
            📋 Copy Link
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }} onClick={share}
            style={{ flex: 1, padding: "11px", borderRadius: 12, background: "#F5F7FA", border: "1px solid #E5E7EB", color: "#374151", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
            📤 Share
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }} onClick={() => toast.info("Opening rewards dashboard...")}
            style={{ flex: 1, padding: "11px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FCD34D", color: "#D97706", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
            🏆 Rewards
          </motion.button>
        </div>
      </div>

      {/* Reward Tiers */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E", marginBottom: 12 }}>🎯 Reward Tiers</div>
        {[
          { n: "1 Invite",   r: "500 Coins",                done: true  },
          { n: "5 Invites",  r: "3,000 Coins + Badge",      done: true  },
          { n: "10 Invites", r: "7,000 Coins + VIP 1 Day",  done: false },
          { n: "25 Invites", r: "VIP 7 Days + Profile Frame",done: false },
          { n: "50 Invites", r: "VIP 30 Days + Exclusive Badge",done: false },
        ].map((t, i, arr) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < arr.length - 1 ? "1px solid #F0F0F8" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{t.done ? "✅" : "🔒"}</span>
              <span style={{ fontSize: 12, color: t.done ? "#0D1B3E" : "#9CA3AF", fontWeight: 700 }}>{t.n}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: t.done ? "#FFC83D" : "#D1D5DB" }}>🏆 {t.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}