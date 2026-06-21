/**
 * MeSocial — Live social stats from Base44 UserProfile + Supabase social_friends
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function MeSocial() {
  const { user: authUser } = useAuth();
  const [counts, setCounts] = useState({ followers: 0, following: 0, friends: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.id) return;
    const load = async () => {
      try {
        const profiles = await base44.entities.UserProfile.filter({ user_id: authUser.id });
        const p = profiles?.[0] || {};
        setCounts({
          followers: p.followers_count || 0,
          following: p.following_count || 0,
          friends:   p.friends_count   || 0,
        });
      } catch { /* ignore */ }

      try {
        // Supabase social_friends for confirmed friend count
        const fr = await base44.functions.invoke('supabaseQuery', {
          table: 'social_friends', method: 'GET', select: 'id',
          filters: { user_id: `eq.${authUser.id}`, status: 'eq.accepted' },
        });
        const friendCount = fr?.data?.data?.length;
        if (friendCount != null) setCounts(c => ({ ...c, friends: friendCount }));
      } catch { /* ignore */ }

      setLoading(false);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [authUser?.id]);

  const fmtN = n => n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);

  const ITEMS = [
    { icon: "❤️", label: "Followers",       count: counts.followers, color: "#EF4444" },
    { icon: "👣", label: "Following",        count: counts.following, color: "#7C3AED" },
    { icon: "🤝", label: "Friends",          count: counts.friends,   color: "#3B82F6" },
    { icon: "💞", label: "Relationship",     count: "—",              color: "#EC4899" },
    { icon: "🌐", label: "Social Activity",  count: "—",              color: "#10B981" },
  ];

  return (
    <div style={{
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: 16, marginTop: 12,
      border: "1px solid rgba(124,58,237,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>🌐 Social</span>
        {loading && <span style={{ fontSize: 9, color: "#9CA3AF" }}>Loading...</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, width: "100%" }}>
        {ITEMS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: `linear-gradient(135deg,${s.color}14,${s.color}06)`,
              border: `1px solid ${s.color}25`,
              borderRadius: 18, padding: "14px 8px", textAlign: "center",
            }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: s.color, marginTop: 4 }}>
              {loading && typeof s.count === "number" ? "—" : typeof s.count === "number" ? fmtN(s.count) : s.count}
            </div>
            <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700, marginTop: 2 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}