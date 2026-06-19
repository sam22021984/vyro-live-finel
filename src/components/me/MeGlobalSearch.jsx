/**
 * MeGlobalSearch — full-screen global search overlay
 * Lets users find any feature/page/dashboard/service across the app.
 * Flutter: lib/features/search/global_search_screen.dart
 */
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SEARCH_INDEX = [
  { name: "Profile", category: "Account", icon: "👤", path: "/me" },
  { name: "Wallet & Finance", category: "Finance", icon: "💰", path: "/finance" },
  { name: "VIP Membership", category: "Membership", icon: "💎", path: "/vip-membership" },
  { name: "Host Dashboard", category: "Dashboard", icon: "🎙️", path: "/host-dashboard" },
  { name: "Agency Dashboard", category: "Dashboard", icon: "🏢", path: "/agency-dashboard-page" },
  { name: "Agent Dashboard", category: "Dashboard", icon: "🤝", path: "/agent-dashboard" },
  { name: "Creator Center", category: "Tools", icon: "🚀", path: "/creator-center" },
  { name: "Control Center", category: "Tools", icon: "🎛️", path: "/control-center" },
  { name: "Apply Center", category: "Career", icon: "💼", path: "/app-center" },
  { name: "Owner Dashboard", category: "Admin", icon: "👑", path: "/owner-dashboard" },
  { name: "Super Admin Dashboard", category: "Admin", icon: "🛡️", path: "/super-admin-dashboard" },
  { name: "Admin Dashboard", category: "Admin", icon: "🛡️", path: "/admin-dashboard-page" },
  { name: "Settings", category: "Account", icon: "⚙️", path: "/settings" },
  { name: "Social", category: "Social", icon: "👥", path: "/social" },
  { name: "Friends", category: "Social", icon: "🫂", path: "/social" },
  { name: "Followers", category: "Social", icon: "❤️", path: "/social" },
  { name: "Visitors", category: "Social", icon: "👀", path: "/social" },
  { name: "Live Rooms", category: "Live", icon: "🔴", path: "/go-live" },
  { name: "Messages", category: "Communication", icon: "💬", path: "/messages-center" },
  { name: "Inbox", category: "Communication", icon: "📨", path: "/inbox" },
  { name: "Community", category: "Social", icon: "✨", path: "/community" },
  { name: "Rewards", category: "Engagement", icon: "🎁", path: "/tasks-rewards" },
  { name: "Tasks", category: "Engagement", icon: "✅", path: "/tasks-rewards" },
  { name: "Events", category: "Engagement", icon: "🎉", path: "/tasks-rewards" },
  { name: "Achievements", category: "Engagement", icon: "🏆", path: "/profile-stats" },
  { name: "Leaderboards", category: "Engagement", icon: "📊", path: "/profile-stats" },
  { name: "Profile & Stats", category: "Account", icon: "📈", path: "/profile-stats" },
  { name: "Level Systems", category: "Engagement", icon: "⭐", path: "/levels" },
  { name: "Support Center", category: "Help", icon: "🛟", path: "/support" },
  { name: "Verification", category: "Account", icon: "✔️", path: "/settings" },
  { name: "Transactions", category: "Finance", icon: "🧾", path: "/finance" },
  { name: "Earnings", category: "Finance", icon: "💵", path: "/finance" },
  { name: "Mall", category: "Shop", icon: "🏪", path: "/mall" },
  { name: "Trust & Reputation", category: "Account", icon: "🛡️", path: "/trust-reputation" },
  { name: "Lucky ID Store", category: "Shop", icon: "🍀", path: "/lucky-id-store" },
  { name: "VIP Manager Dashboard", category: "Admin", icon: "💎", path: "/vip-manager-dashboard" },
  { name: "Finance Manager Dashboard", category: "Admin", icon: "💰", path: "/finance-manager-dashboard" },
  { name: "Marketing Manager Dashboard", category: "Admin", icon: "📣", path: "/marketing-manager-dashboard" },
  { name: "Event Manager Dashboard", category: "Admin", icon: "🎉", path: "/event-manager-dashboard" },
  { name: "PK Manager Dashboard", category: "Admin", icon: "⚔️", path: "/pk-manager-dashboard" },
  { name: "Country Manager Dashboard", category: "Admin", icon: "🌍", path: "/country-manager-dashboard" },
];

const POPULAR = ["VIP Membership", "Wallet & Finance", "Live Rooms", "Rewards", "Host Dashboard"];

export default function MeGlobalSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 250);
    try {
      const stored = JSON.parse(localStorage.getItem("vyro_recent_searches") || "[]");
      setRecent(stored);
    } catch { /* ignore */ }
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const goTo = (item) => {
    try {
      const next = [item.name, ...recent.filter(r => r !== item.name)].slice(0, 6);
      localStorage.setItem("vyro_recent_searches", JSON.stringify(next));
    } catch { /* ignore */ }
    onClose();
    navigate(item.path);
  };

  const searchByName = (name) => setQuery(name);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(253,252,255,0.99)", display: "flex", flexDirection: "column" }}>

      {/* Search bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "max(14px, env(safe-area-inset-top, 14px)) 14px 12px", borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.06)", borderRadius: 14, padding: "10px 12px", border: "1px solid rgba(124,58,237,0.12)" }}>
          <Search size={17} color="#7C3AED" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anything..."
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <X size={15} color="#9CA3AF" />
            </button>
          )}
        </div>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#7C3AED" }}>
          Cancel
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 40px", maxWidth: 600, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Results */}
        {query.trim() ? (
          results.length > 0 ? (
            results.map((item, i) => (
              <motion.button key={item.name} whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                onClick={() => goTo(item)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 10px", borderRadius: 14, border: "none", background: "#fff", cursor: "pointer", marginBottom: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.04)", border: "1px solid rgba(124,58,237,0.06)" }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#faf8ff,#f5f0ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e" }}>{item.name}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF" }}>{item.category}</div>
                </div>
                <ChevronRight size={16} color="#D1D5DB" />
              </motion.button>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>No results for "{query}"</div>
            </div>
          )
        ) : (
          <>
            {/* Recent */}
            {recent.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Clock size={13} color="#9CA3AF" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.05em" }}>RECENT SEARCHES</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {recent.map(name => (
                    <button key={name} onClick={() => searchByName(name)}
                      style={{ fontSize: 12, fontWeight: 700, color: "#4B5563", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: 20, padding: "6px 13px", cursor: "pointer" }}>
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <TrendingUp size={13} color="#7C3AED" />
                <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.05em" }}>POPULAR SEARCHES</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {POPULAR.map(name => (
                  <button key={name} onClick={() => searchByName(name)}
                    style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", background: "linear-gradient(135deg,#faf8ff,#f5f0ff)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 20, padding: "6px 13px", cursor: "pointer" }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}