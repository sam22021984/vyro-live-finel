/**
 * AppCenter — Application Center
 * Access: Profile > More Services > App Center
 * Theme: Premium White · Blue Accents · Modern Cards
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X, Star, Download, ChevronRight } from "lucide-react";

/* ─── Data ─── */
const CATEGORIES = [
  { id: "all",        label: "All",         icon: "🧩" },
  { id: "tools",      label: "Tools",       icon: "🔧" },
  { id: "games",      label: "Games",       icon: "🎮" },
  { id: "social",     label: "Social",      icon: "👥" },
  { id: "finance",    label: "Finance",     icon: "💰" },
  { id: "media",      label: "Media",       icon: "🎵" },
  { id: "utilities",  label: "Utilities",   icon: "⚙️" },
];

const FEATURED = [
  { id: 1, name: "VYRO Store",       icon: "🛍️", desc: "Shop exclusive VYRO merchandise and digital items", category: "tools",    rating: 4.9, installs: "120K", tag: "Official", tagColor: "#1F6BFF", installed: true  },
  { id: 2, name: "VYRO Games Hub",   icon: "🎮", desc: "Play mini-games, earn coins and compete with friends", category: "games",   rating: 4.8, installs: "98K",  tag: "Popular",  tagColor: "#EC4899", installed: false },
  { id: 3, name: "Coin Calculator",  icon: "🪙", desc: "Track coins, diamonds and calculate exchange rates",  category: "finance", rating: 4.7, installs: "74K",  tag: "Free",     tagColor: "#10B981", installed: true  },
];

const APPS = [
  { id: 10, name: "Sticker Studio",    icon: "😄", desc: "Create custom stickers for your chats",        category: "tools",     rating: 4.6, installs: "55K",  tag: "New",      tagColor: "#A855F7", installed: false },
  { id: 11, name: "Music Mixer",       icon: "🎵", desc: "Mix beats and share audio clips in rooms",      category: "media",     rating: 4.5, installs: "43K",  tag: "Popular",  tagColor: "#EC4899", installed: false },
  { id: 12, name: "Gift Tracker",      icon: "🎁", desc: "Track all your sent and received gifts",        category: "tools",     rating: 4.4, installs: "38K",  tag: "Free",     tagColor: "#10B981", installed: true  },
  { id: 13, name: "Room Analytics",    icon: "📊", desc: "Deep analytics for your live room stats",       category: "utilities", rating: 4.7, installs: "29K",  tag: "Pro",      tagColor: "#F59E0B", installed: false },
  { id: 14, name: "VIP Manager",       icon: "👑", desc: "Manage your VIP subscriptions and benefits",    category: "finance",   rating: 4.8, installs: "61K",  tag: "Official", tagColor: "#1F6BFF", installed: true  },
  { id: 15, name: "Social Booster",    icon: "🚀", desc: "Grow your followers and engagement faster",     category: "social",    rating: 4.3, installs: "47K",  tag: "New",      tagColor: "#A855F7", installed: false },
  { id: 16, name: "Puzzle Quest",      icon: "🧩", desc: "Daily puzzles to earn bonus coins and XP",      category: "games",     rating: 4.6, installs: "82K",  tag: "Popular",  tagColor: "#EC4899", installed: false },
  { id: 17, name: "Language Buddy",    icon: "🌍", desc: "Learn languages while chatting with users",     category: "social",    rating: 4.5, installs: "33K",  tag: "Free",     tagColor: "#10B981", installed: false },
  { id: 18, name: "Widget Maker",      icon: "🖼️", desc: "Create profile widgets and banners",           category: "utilities", rating: 4.4, installs: "22K",  tag: "New",      tagColor: "#A855F7", installed: false },
];

const MY_APPS = APPS.filter(a => a.installed).concat(FEATURED.filter(a => a.installed));

/* ─── Sub-views ─── */
const VIEWS = [
  { id: "discover", label: "Discover", icon: "🔍" },
  { id: "my_apps",  label: "My Apps",  icon: "📱" },
  { id: "updates",  label: "Updates",  icon: "🔄" },
];

/* ─── Components ─── */
function Stars({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Star size={10} fill="#F59E0B" color="#F59E0B" />
      <span style={{ fontSize: 10, fontWeight: 800, color: "#F59E0B" }}>{rating}</span>
    </div>
  );
}

function AppCard({ app, featured }) {
  const [installed, setInstalled] = useState(app.installed);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "#fff", borderRadius: featured ? 20 : 16, padding: featured ? 16 : "13px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: featured ? 56 : 48, height: featured ? 56 : 48, borderRadius: featured ? 16 : 13, background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: featured ? 28 : 24, flexShrink: 0, border: "1px solid #E8E4FF" }}>
        {app.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: featured ? 14 : 13, fontWeight: 900, color: "#0D1B3E" }}>{app.name}</span>
          <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 6, background: `${app.tagColor}12`, color: app.tagColor }}>{app.tag}</span>
        </div>
        <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 5, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Stars rating={app.rating} />
          <span style={{ fontSize: 9, color: "#9CA3AF" }}>
            <Download size={9} style={{ display: "inline", marginRight: 2 }} />{app.installs}
          </span>
        </div>
      </div>
      <motion.button whileTap={{ scale: 0.92 }} onClick={() => setInstalled(v => !v)}
        style={{ padding: "7px 14px", borderRadius: 12, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", flexShrink: 0, background: installed ? "#F3F4F6" : "linear-gradient(135deg,#1F6BFF,#6366F1)", color: installed ? "#6B7280" : "#fff" }}>
        {installed ? "Open" : "Get"}
      </motion.button>
    </motion.div>
  );
}

/* ─── Views ─── */
function DiscoverView() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const allApps = [...FEATURED, ...APPS];
  const filtered = allApps.filter(a => {
    const matchCat = cat === "all" || a.category === cat;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Search */}
      <div style={{ background: "#F5F7FA", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", border: "1px solid #E9ECF0" }}>
        <Search size={15} color="#9CA3AF" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps…"
          style={{ border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", background: "transparent", flex: 1 }} />
        {search && <X size={13} color="#9CA3AF" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
      </div>

      {/* Categories */}
      {!search && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {CATEGORIES.map(c => (
            <motion.button key={c.id} whileTap={{ scale: 0.92 }} onClick={() => setCat(c.id)}
              style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: cat === c.id ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "#F5F7FA", color: cat === c.id ? "#fff" : "#6B7280" }}>
              {c.icon} {c.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Featured Banner */}
      {!search && cat === "all" && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.05em" }}>⭐ FEATURED APPS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FEATURED.map(app => <AppCard key={app.id} app={app} featured />)}
          </div>
        </div>
      )}

      {/* All Apps */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.05em" }}>
          {search ? `🔍 RESULTS (${filtered.length})` : cat === "all" ? "🧩 ALL APPS" : `${CATEGORIES.find(c => c.id === cat)?.icon} ${cat.toUpperCase()} APPS`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(search || cat !== "all" ? filtered : APPS).map(app => <AppCard key={app.id} app={app} />)}
        </div>
      </div>
    </div>
  );
}

function MyAppsView() {
  return (
    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", borderRadius: 16, padding: 14, border: "1px solid #E8E4FF", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 28 }}>📱</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{MY_APPS.length} Installed Apps</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Manage your installed applications</div>
        </div>
      </div>
      {MY_APPS.length === 0
        ? <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>No apps installed yet. Discover apps to get started.</div>
        : MY_APPS.map(app => (
          <div key={app.id} style={{ background: "#fff", borderRadius: 16, padding: "13px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{app.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{app.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{app.category} · v1.0.0</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <motion.button whileTap={{ scale: 0.92 }} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 11, fontWeight: 800, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", cursor: "pointer" }}>Open</motion.button>
              <motion.button whileTap={{ scale: 0.92 }} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 11, fontWeight: 800, background: "#FEF2F2", color: "#EF4444", border: "1px solid #FEE2E2", cursor: "pointer" }}>Remove</motion.button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

function UpdatesView() {
  const updates = [
    { id: 1, name: "Coin Calculator",  icon: "🪙", version: "2.1.0", change: "Performance improvements & bug fixes",  date: "Today"       },
    { id: 2, name: "VIP Manager",      icon: "👑", version: "1.5.2", change: "New VIP tier support & UI refresh",      date: "Yesterday"   },
    { id: 3, name: "Gift Tracker",     icon: "🎁", version: "3.0.0", change: "Major redesign with new analytics view", date: "2 days ago"  },
  ];
  return (
    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#9CA3AF", marginBottom: 2, letterSpacing: "0.05em" }}>🔄 AVAILABLE UPDATES ({updates.length})</div>
      <motion.button whileTap={{ scale: 0.97 }}
        style={{ padding: "11px", borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(31,107,255,0.25)" }}>
        ⬇️ Update All ({updates.length})
      </motion.button>
      {updates.map((u, i) => (
        <motion.div key={u.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          style={{ background: "#fff", borderRadius: 16, padding: "13px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg,#EEF2FF,#F5F3FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{u.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{u.name} <span style={{ fontSize: 10, fontWeight: 700, color: "#1F6BFF" }}>v{u.version}</span></div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>{u.change}</div>
            <div style={{ fontSize: 9, color: "#C4C9D4" }}>{u.date}</div>
          </div>
          <motion.button whileTap={{ scale: 0.92 }}
            style={{ padding: "7px 12px", borderRadius: 10, fontSize: 11, fontWeight: 800, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0 }}>
            Update
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function AppCenter() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("discover");

  const CONTENT = { discover: <DiscoverView />, my_apps: <MyAppsView />, updates: <UpdatesView /> };

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>🧩 App Center</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Discover & manage your applications</div>
          </div>
        </div>

        {/* View tabs */}
        <div style={{ display: "flex", padding: "0 16px" }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              style={{ flex: 1, padding: "11px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 800, color: activeView === v.id ? "#1F6BFF" : "#9CA3AF", borderBottom: activeView === v.id ? "2px solid #1F6BFF" : "2px solid transparent" }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeView} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          style={{ paddingTop: 16 }}>
          {CONTENT[activeView]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}