/**
 * GiftLeaderboard — Real-time gift leaderboard panel (gifters + receivers)
 * Categories: Top Gifters, Top Receivers. Tabs: Daily / Weekly / Monthly.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const MOCK_DATA = {
  gifters: {
    daily:   [{ id:1,name:"Zara",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=zara",coins:12400,vip:"vip3" },{ id:2,name:"Kai",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=kai",coins:8800,vip:"vip2" },{ id:3,name:"Mia",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=mia",coins:5200,vip:"vip1" },{ id:4,name:"Jay",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=jay",coins:3100 },{ id:5,name:"Aria",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=aria",coins:1900 }],
    weekly:  [{ id:1,name:"Aria",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=aria",coins:52000,vip:"vip3" },{ id:2,name:"Zara",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=zara",coins:41000,vip:"vip2" },{ id:3,name:"Mia",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=mia",coins:38000,vip:"vip1" }],
    monthly: [{ id:1,name:"Kai",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=kai",coins:180000,vip:"vip3" },{ id:2,name:"Jay",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=jay",coins:155000,vip:"vip2" }],
  },
  receivers: {
    daily:   [{ id:1,name:"SAM",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=seat0",coins:9800,vip:"vip3" },{ id:2,name:"Luna",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=seat1",coins:7200,vip:"vip2" },{ id:3,name:"Rex",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=seat2",coins:4100 },{ id:4,name:"Nova",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=seat7",coins:2200 }],
    weekly:  [{ id:1,name:"SAM",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=seat0",coins:48000,vip:"vip3" }],
    monthly: [{ id:1,name:"Luna",avatar:"https://api.dicebear.com/7.x/adventurer/svg?seed=seat1",coins:200000,vip:"vip3" }],
  },
};

const VIP_COLORS = { vip1:"#CD7F32", vip2:"#A8A8A8", vip3:"#FFD700", vip4:"#00C2B8", vip5:"#C084FC" };
const RANK_ICONS = ["🥇","🥈","🥉"];
const fmt = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n;

export default function GiftLeaderboard({ onClose }) {
  const [tab, setTab] = useState("gifters");
  const [period, setPeriod] = useState("daily");

  const data = MOCK_DATA[tab][period] || [];

  return (
    <div style={{
      background: "linear-gradient(180deg, #0f2a27 0%, #0a1f1d 100%)",
      height: "100%", display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px" }}>
        <span style={{ fontSize: 15, fontWeight: 900, color: "#FFD700" }}>🏆 Gift Leaderboard</span>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={14} color="rgba(255,255,255,0.6)" />
        </motion.button>
      </div>

      {/* Type tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px 10px" }}>
        {[{ id:"gifters", label:"Top Gifters 💸" },{ id:"receivers", label:"Top Receivers 💎" }].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.92 }}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: "8px 4px", borderRadius: 12, cursor: "pointer",
              background: tab === t.id ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${tab === t.id ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.08)"}`,
              color: tab === t.id ? "#FFD700" : "rgba(255,255,255,0.5)",
              fontSize: 11, fontWeight: 800,
            }}>{t.label}</motion.button>
        ))}
      </div>

      {/* Period tabs */}
      <div style={{ display: "flex", gap: 4, padding: "0 16px 12px" }}>
        {["daily","weekly","monthly"].map(p => (
          <motion.button key={p} whileTap={{ scale: 0.92 }}
            onClick={() => setPeriod(p)}
            style={{
              padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              background: period === p ? "rgba(0,194,184,0.2)" : "transparent",
              border: `1px solid ${period === p ? "rgba(0,194,184,0.5)" : "rgba(255,255,255,0.1)"}`,
              color: period === p ? "#00C2B8" : "rgba(255,255,255,0.4)",
              fontSize: 10, fontWeight: 800, textTransform: "capitalize",
            }}>{p}</motion.button>
        ))}
      </div>

      {/* Rankings */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 20px" }}>
        {data.map((u, i) => (
          <motion.div key={u.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 14, marginBottom: 8,
              background: i === 0 ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${i === 0 ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div style={{ fontSize: i < 3 ? 20 : 14, minWidth: 28, textAlign: "center", fontWeight: 900, color: "rgba(255,255,255,0.4)" }}>
              {i < 3 ? RANK_ICONS[i] : `#${i+1}`}
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", overflow: "hidden",
              border: `2px solid ${u.vip ? VIP_COLORS[u.vip] : "rgba(0,194,184,0.3)"}`,
              flexShrink: 0,
            }}>
              <img src={u.avatar} alt={u.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{u.name}</div>
              {u.vip && <div style={{ fontSize: 9, color: VIP_COLORS[u.vip], fontWeight: 700 }}>👑 {u.vip.toUpperCase()}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? "#FFD700" : "#00C2B8" }}>
                {fmt(u.coins)} 🪙
              </div>
            </div>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 40 }}>
            No data yet
          </div>
        )}
      </div>
    </div>
  );
}