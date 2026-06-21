/**
 * MeLevelCards — Live level data from Supabase user_xp + stream_levels
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const DEFS = [
  { key: "user",      icon: "📈", label: "User Level",      color: "#F59E0B", bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)", bar: "linear-gradient(90deg,#F59E0B,#D97706)" },
  { key: "host",      icon: "🎙️", label: "Host Level",      color: "#7C3AED", bg: "linear-gradient(135deg,#EDE9FE,#DDD6FE)", bar: "linear-gradient(90deg,#7C3AED,#A78BFA)" },
  { key: "gifting",   icon: "🎁", label: "Gifting Level",   color: "#EC4899", bg: "linear-gradient(135deg,#FCE7F3,#FBCFE8)", bar: "linear-gradient(90deg,#EC4899,#F9A8D4)" },
  { key: "streaming", icon: "📡", label: "Streaming Level", color: "#3B82F6", bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)", bar: "linear-gradient(90deg,#3B82F6,#60A5FA)" },
];

const fmtK = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n;
const pct  = (xp, next) => next > 0 ? Math.min(100, Math.round((xp / next) * 100)) : 0;

// Estimated XP needed for next level (simplified formula)
const nextLevelXP = lv => (lv + 1) * 5000;

export default function MeLevelCards() {
  const { user: authUser } = useAuth();
  const [levels, setLevels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.id) return;
    const load = async () => {
      try {
        const res = await base44.functions.invoke('supabaseQuery', {
          table: 'user_xp', method: 'GET', select: '*',
          filters: { user_id: `eq.${authUser.id}` }, limit: 1,
        });
        const xp = res?.data?.data?.[0];
        if (xp) {
          setLevels({
            user:      { level: xp.user_level      || 1, xp: xp.user_xp      || 0 },
            host:      { level: xp.host_level      || 1, xp: xp.host_xp      || 0 },
            gifting:   { level: xp.gifting_level   || 1, xp: xp.gifting_xp   || 0 },
            streaming: { level: xp.streaming_level || 1, xp: xp.streaming_xp || 0 },
          });
        }
      } catch { /* ignore */ }

      try {
        // stream_levels for streaming-specific data
        const sl = await base44.functions.invoke('supabaseQuery', {
          table: 'stream_levels', method: 'GET', select: 'level,total_minutes',
          filters: { user_id: `eq.${authUser.id}` }, limit: 1,
        });
        const s = sl?.data?.data?.[0];
        if (s) setLevels(prev => ({ ...prev, streaming: { level: s.level || 1, xp: s.total_minutes || 0 } }));
      } catch { /* ignore */ }

      setLoading(false);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [authUser?.id]);

  return (
    <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", boxSizing: "border-box" }}>
      {DEFS.map((d, i) => {
        const lv   = levels[d.key];
        const lvNum = lv?.level || (loading ? 0 : 1);
        const xpVal = lv?.xp   || 0;
        const nextXP = nextLevelXP(lvNum);
        return (
          <motion.div key={d.label}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
              borderRadius: 20, padding: 14,
              border: `1px solid ${d.color}25`,
              boxShadow: `0 4px 20px ${d.color}15`,
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{d.icon}</span>
              <div style={{ background: d.bg, borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 900, color: d.color }}>
                {loading ? "—" : `Lv.${lvNum}`}
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#374151", marginTop: 6 }}>{d.label}</div>
            <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 6, marginTop: 8, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: loading ? "0%" : `${pct(xpVal, nextXP)}%` }}
                transition={{ delay: i * 0.07 + 0.3, duration: 0.8 }}
                style={{ height: "100%", background: d.bar, borderRadius: 6 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{fmtK(xpVal)} XP</span>
              <span style={{ fontSize: 9, color: d.color, fontWeight: 700 }}>{pct(xpVal, nextXP)}%</span>
              <span style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700 }}>{fmtK(nextXP)} XP</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}