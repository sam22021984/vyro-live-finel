/**
 * ProfileLeaderboard — Live leaderboard from Supabase leaderboard + reward_leaderboards
 * Falls back to empty state when tables are empty.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["Top Users", "Top Gifters", "Top Hosts", "Top Agencies", "Top VIP", "Top Families", "Top Countries"];
const PERIODS    = ["Daily", "Weekly", "Monthly", "Yearly", "All Time"];
const MEDAL_ICON = { 1: "🥇", 2: "🥈", 3: "🥉" };

const CATEGORY_MAP = {
  "Top Users":     "users",
  "Top Gifters":   "gifters",
  "Top Hosts":     "hosts",
  "Top Agencies":  "agencies",
  "Top VIP":       "vip",
  "Top Families":  "families",
  "Top Countries": "countries",
};

export default function ProfileLeaderboard() {
  const [cat,     setCat]     = useState("Top Users");
  const [period,  setPeriod]  = useState("Weekly");
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const category = CATEGORY_MAP[cat] || "users";
        const res = await base44.functions.invoke('supabaseQuery', {
          table: 'leaderboard', method: 'GET',
          select: 'rank,display_name,score,country_code,vip_tier,avatar_url,category,period',
          filters: { category: `eq.${category}`, period: `eq.${period.toLowerCase()}` },
          order: 'rank.asc', limit: 20,
        });
        const rows = res?.data?.data || [];
        setData(rows.map(r => ({
          rank:    r.rank,
          name:    r.display_name || "—",
          avatar:  r.avatar_url   || "👤",
          points:  r.score != null ? r.score.toLocaleString() : "—",
          country: r.country_code || "",
          vip:     r.vip_tier     || "—",
        })));
      } catch { setData([]); }
      setLoading(false);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [cat, period]);

  return (
    <div style={{ padding: "14px" }}>
      {/* Period Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ flex: 1, padding: "7px 2px", borderRadius: 20, fontSize: 9, fontWeight: 800, cursor: "pointer", border: "none",
              background: period === p ? "#EC4899" : "#fff",
              color: period === p ? "#fff" : "#6B7280",
              boxShadow: period === p ? "0 4px 10px rgba(236,72,153,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {p}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14, scrollbarWidth: "none" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
              background: cat === c ? "#EC4899" : "#fff",
              color: cat === c ? "#fff" : "#6B7280",
              boxShadow: cat === c ? "0 4px 12px rgba(236,72,153,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: 32 }}>Loading leaderboard...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#374151" }}>No data yet</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>Be the first to top the {cat} leaderboard!</div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {data.length >= 3 && (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {[data[1], data[0], data[2]].map((u, i) => {
                const heights = [100, 120, 90];
                const isFirst = i === 1;
                return (
                  <motion.div key={u.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 30 }}>{typeof u.avatar === "string" && u.avatar.startsWith("http") ? "👤" : u.avatar}</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: "#0D1B3E", textAlign: "center" }}>{u.name}</div>
                    <div style={{ fontSize: 9, color: "#9CA3AF", textAlign: "center" }}>{u.points}</div>
                    <div style={{
                      width: "100%", height: heights[i], borderRadius: "12px 12px 0 0",
                      background: isFirst ? "linear-gradient(180deg,#FFD700,#FFC83D)" : i === 0 ? "linear-gradient(180deg,#C0C0C0,#E5E7EB)" : "linear-gradient(180deg,#CD7F32,#D97706)",
                      display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8, fontSize: 18,
                    }}>{MEDAL_ICON[u.rank]}</div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Full List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.map((u, i) => (
              <motion.div key={u.rank}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, fontSize: 16, textAlign: "center", flexShrink: 0 }}>
                  {MEDAL_ICON[u.rank] || <span style={{ fontSize: 12, fontWeight: 900, color: "#9CA3AF" }}>#{u.rank}</span>}
                </div>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {typeof u.avatar === "string" && u.avatar.startsWith("http") ? <img src={u.avatar} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} /> : "👤"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{u.name} {u.country}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{u.vip}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#EC4899" }}>{u.points}</div>
                  <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 4 }}>
                    <button onClick={() => toast.success(`Following ${u.name}`)}
                      style={{ padding: "3px 8px", borderRadius: 8, background: "#F0F7FF", border: "none", fontSize: 9, fontWeight: 800, cursor: "pointer", color: "#1F6BFF" }}>Follow</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}