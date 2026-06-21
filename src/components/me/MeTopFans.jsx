/**
 * MeTopFans — Live top gift senders from Supabase leaderboard / user_gifting_stats
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const RANK_META = [
  { color: "#F59E0B", crown: "🥇" },
  { color: "#9CA3AF", crown: "🥈" },
  { color: "#CD7F32", crown: "🥉" },
  { color: "#3B82F6", crown: "⭐" },
  { color: "#7C3AED", crown: "⭐" },
];

const fmtN = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n || 0);

export default function MeTopFans() {
  const { user: authUser } = useAuth();
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.id) return;
    const load = async () => {
      try {
        // Try leaderboard table filtered by host_id
        const res = await base44.functions.invoke('supabaseQuery', {
          table: 'leaderboard', method: 'GET',
          select: 'user_id,display_name,score,rank,gift_count',
          filters: { host_id: `eq.${authUser.id}`, category: 'eq.gifts' },
          order: 'rank.asc', limit: 5,
        });
        const rows = res?.data?.data;
        if (rows?.length) {
          setFans(rows.map((r, i) => ({
            rank: r.rank || i + 1,
            name: r.display_name || `User ${i+1}`,
            score: fmtN(r.score),
            gifts: fmtN(r.gift_count),
            ...RANK_META[i] || RANK_META[4],
          })));
        }
      } catch { /* ignore */ }

      try {
        // Fallback: user_gifting_stats where receiver_id = me
        const res2 = await base44.functions.invoke('supabaseQuery', {
          table: 'user_gifting_stats', method: 'GET',
          select: 'user_id,display_name,total_gifts_sent,total_coins_sent',
          filters: { receiver_id: `eq.${authUser.id}` },
          order: 'total_coins_sent.desc', limit: 5,
        });
        const rows2 = res2?.data?.data;
        if (rows2?.length) {
          setFans(rows2.map((r, i) => ({
            rank: i + 1,
            name: r.display_name || `Fan ${i+1}`,
            score: fmtN(r.total_coins_sent),
            gifts: fmtN(r.total_gifts_sent),
            ...RANK_META[i] || RANK_META[4],
          })));
        }
      } catch { /* ignore */ }

      setLoading(false);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [authUser?.id]);

  // Placeholder rows while loading or empty
  const display = loading
    ? Array.from({ length: 3 }, (_, i) => ({ rank: i+1, name: "...", score: "—", gifts: "—", ...RANK_META[i] }))
    : fans.length
      ? fans
      : Array.from({ length: 3 }, (_, i) => ({ rank: i+1, name: "No fans yet", score: "0", gifts: "0", ...RANK_META[i] }));

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(245,158,11,0.12)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>⭐ Top Fans</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: "#F59E0B", background: "rgba(245,158,11,0.1)", borderRadius: 12, padding: "2px 8px" }}>
          {loading ? "…" : `Top ${display.length}`}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {display.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: i === 0 ? "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.04))"
                        : i === 1 ? "rgba(156,163,175,0.07)"
                        : "rgba(0,0,0,0.025)",
              borderRadius: 16, padding: "10px 12px",
              border: i < 3 ? `1px solid ${f.color}25` : "1px solid rgba(0,0,0,0.04)",
            }}>
            <div style={{ width: 28, textAlign: "center", fontSize: 16, flexShrink: 0 }}>{f.crown}</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${f.color}40,${f.color}20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: `2px solid ${f.color}40` }}>
              👤
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF" }}>{f.gifts} gifts</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: f.color }}>{f.score}</div>
              <div style={{ fontSize: 8, color: "#9CA3AF" }}>Score</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}