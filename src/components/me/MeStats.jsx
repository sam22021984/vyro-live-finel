/**
 * MeStats — Live profile statistics from Supabase (user_xp, user_gifting_stats, coin_wallets)
 * Falls back to UserProfile entity data if Supabase tables are empty.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const fmtN = n => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n/1_000).toFixed(1)}K`;
  return String(n);
};

const STAT_DEFS = [
  { key: "followers",      icon: "❤️",  label: "Followers",      color: "#EF4444" },
  { key: "following",      icon: "👣",  label: "Following",      color: "#7C3AED" },
  { key: "friends",        icon: "🤝",  label: "Friends",        color: "#3B82F6" },
  { key: "visitors",       icon: "👀",  label: "Visitors",       color: "#8B5CF6" },
  { key: "total_xp",       icon: "⭐",  label: "Total XP",       color: "#F59E0B" },
  { key: "gifts_received", icon: "🌹",  label: "Gifts Received", color: "#DB2777" },
  { key: "gifts_sent",     icon: "🎁",  label: "Gifts Sent",     color: "#F97316" },
  { key: "coin_balance",   icon: "🪙",  label: "Coins",          color: "#F59E0B" },
  { key: "activity_score", icon: "🔥",  label: "Activity Score", color: "#EF4444" },
];

export default function MeStats() {
  const { user: authUser } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.id) return;
    const load = async () => {
      const merged = {};
      try {
        // UserProfile (Base44) — followers/following/friends/visitors/coins
        const profiles = await base44.entities.UserProfile.filter({ user_id: authUser.id });
        const p = profiles?.[0] || {};
        merged.followers  = p.followers_count  || 0;
        merged.following  = p.following_count  || 0;
        merged.friends    = p.friends_count    || 0;
        merged.visitors   = p.visitors_count   || 0;
        merged.coin_balance = p.coins_balance  || 0;
      } catch { /* ignore */ }

      try {
        // Supabase user_xp — total_xp, activity_score
        const xpRes = await base44.functions.invoke('supabaseQuery', {
          table: 'user_xp', method: 'GET', select: 'total_xp,activity_score',
          filters: { user_id: `eq.${authUser.id}` }, limit: 1,
        });
        const xp = xpRes?.data?.data?.[0];
        if (xp) {
          merged.total_xp      = xp.total_xp      || 0;
          merged.activity_score = xp.activity_score || 0;
        }
      } catch { /* ignore */ }

      try {
        // Supabase user_gifting_stats — gifts_sent, gifts_received
        const gRes = await base44.functions.invoke('supabaseQuery', {
          table: 'user_gifting_stats', method: 'GET', select: 'gifts_sent,gifts_received',
          filters: { user_id: `eq.${authUser.id}` }, limit: 1,
        });
        const g = gRes?.data?.data?.[0];
        if (g) {
          merged.gifts_sent     = g.gifts_sent     || 0;
          merged.gifts_received = g.gifts_received || 0;
        }
      } catch { /* ignore */ }

      try {
        // Supabase coin_wallets — coin_balance override
        const wRes = await base44.functions.invoke('supabaseQuery', {
          table: 'coin_wallets', method: 'GET', select: 'balance',
          filters: { user_id: `eq.${authUser.id}` }, limit: 1,
        });
        const w = wRes?.data?.data?.[0];
        if (w?.balance != null) merged.coin_balance = w.balance;
      } catch { /* ignore */ }

      setStats(merged);
      setLoading(false);
    };
    load();
    // Poll every 30s for near-realtime updates
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [authUser?.id]);

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      width: "100%", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>📊 Statistics</span>
        {loading && <span style={{ fontSize: 9, color: "#9CA3AF" }}>Loading...</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, width: "100%" }}>
        {STAT_DEFS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: `linear-gradient(135deg,${s.color}12,${s.color}06)`,
              borderRadius: 16, padding: "12px 8px", textAlign: "center",
              border: `1px solid ${s.color}20`,
            }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: s.color, lineHeight: 1.1, marginTop: 4 }}>
              {loading ? "—" : fmtN(stats[s.key])}
            </div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}