/**
 * ApplyCenter — Job Application Center
 * Access: Profile > More Services > Apply Center
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X } from "lucide-react";

const CATEGORIES = [
  { id: "all",       label: "All",        icon: "💼" },
  { id: "host",      label: "Host",       icon: "🎙️" },
  { id: "agency",    label: "Agency",     icon: "🏢" },
  { id: "moderator", label: "Moderator",  icon: "🛡️" },
  { id: "partner",   label: "Partner",    icon: "🤝" },
  { id: "creator",   label: "Creator",    icon: "🎨" },
];

const JOBS = [
  {
    id: 1, title: "Live Host",           category: "host",      icon: "🎙️",
    company: "VYRO Official",            location: "Remote",    type: "Full-Time",
    salary: "Commission-Based",          tag: "Hot",            tagColor: "#EF4444",
    desc: "Host live audio rooms, engage with audiences, and grow your fan base on VYRO.",
    requirements: ["LV20+ User Level", "Good communication skills", "Active 4h/day minimum"],
    posted: "2 days ago",
  },
  {
    id: 2, title: "Agency Manager",      category: "agency",    icon: "🏢",
    company: "VYRO Stars Agency",        location: "Remote",    type: "Full-Time",
    salary: "Revenue Share",             tag: "New",            tagColor: "#A855F7",
    desc: "Manage and grow a team of hosts, handle recruitment, and maximize agency earnings.",
    requirements: ["Prior management experience", "Min. 10 hosts under management", "Weekly reporting"],
    posted: "1 day ago",
  },
  {
    id: 3, title: "Room Moderator",      category: "moderator", icon: "🛡️",
    company: "VYRO Official",            location: "Remote",    type: "Part-Time",
    salary: "Coin Rewards",              tag: "Open",           tagColor: "#10B981",
    desc: "Monitor live rooms, enforce community guidelines, and support hosts during live sessions.",
    requirements: ["LV30+ User Level", "Neutral and fair judgment", "Available evenings"],
    posted: "3 days ago",
  },
  {
    id: 4, title: "Brand Partner",       category: "partner",   icon: "🤝",
    company: "VYRO Partnerships",        location: "Remote",    type: "Contract",
    salary: "Negotiable",                tag: "Featured",       tagColor: "#1F6BFF",
    desc: "Collaborate with VYRO as a brand partner for campaigns, events, and promotions.",
    requirements: ["10K+ followers on any platform", "Content creation portfolio", "Brand alignment"],
    posted: "5 days ago",
  },
  {
    id: 5, title: "Content Creator",     category: "creator",   icon: "🎨",
    company: "VYRO Media",               location: "Remote",    type: "Freelance",
    salary: "Per Project",               tag: "New",            tagColor: "#A855F7",
    desc: "Create original content — graphics, audio clips, stickers — for the VYRO platform.",
    requirements: ["Design or audio production skills", "Portfolio required", "Flexible availability"],
    posted: "Today",
  },
  {
    id: 6, title: "Co-Host Talent",      category: "host",      icon: "🎤",
    company: "Phoenix Kings Agency",     location: "Remote",    type: "Part-Time",
    salary: "Commission-Based",          tag: "Open",           tagColor: "#10B981",
    desc: "Join as a co-host in premium live rooms, support the main host and entertain audiences.",
    requirements: ["LV15+ User Level", "Energetic personality", "Available 2h/day"],
    posted: "4 days ago",
  },
  {
    id: 7, title: "Community Manager",   category: "moderator", icon: "👥",
    company: "VYRO Official",            location: "Remote",    type: "Full-Time",
    salary: "Fixed + Bonuses",           tag: "Hot",            tagColor: "#EF4444",
    desc: "Lead community initiatives, manage group announcements, and grow VYRO communities.",
    requirements: ["Strong leadership skills", "Experience with online communities", "Fluent English/Arabic"],
    posted: "1 week ago",
  },
];

const TABS = [
  { id: "browse",   label: "Browse Jobs", icon: "🔍" },
  { id: "applied",  label: "Applied",     icon: "📋" },
];

/* ─── Job Card ─── */
function JobCard({ job, onApply }) {
  const [expanded, setExpanded] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "#fff", borderRadius: 18, border: "1px solid #F0F0F8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", cursor: "pointer" }} onClick={() => setExpanded(v => !v)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
            {job.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{job.title}</span>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 8, background: `${job.tagColor}12`, color: job.tagColor }}>{job.tag}</span>
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{job.company}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>📍 {job.location}</span>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>⏰ {job.type}</span>
              <span style={{ fontSize: 10, color: "#9CA3AF" }}>💰 {job.salary}</span>
            </div>
          </div>
          <div style={{ fontSize: 14, color: "#D1D5DB", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid #F5F7FA" }}>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7, paddingTop: 12 }}>{job.desc}</p>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", marginBottom: 7, letterSpacing: "0.05em" }}>REQUIREMENTS</div>
                {job.requirements.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "#1F6BFF" }}>✓</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{r}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#C4C9D4" }}>Posted {job.posted}</span>
                <motion.button whileTap={{ scale: 0.94 }}
                  onClick={() => { setApplied(true); onApply(job); }}
                  disabled={applied}
                  style={{ padding: "9px 22px", borderRadius: 12, fontSize: 12, fontWeight: 900, border: "none", cursor: applied ? "default" : "pointer", background: applied ? "#F3F4F6" : "linear-gradient(135deg,#1F6BFF,#6366F1)", color: applied ? "#9CA3AF" : "#fff", boxShadow: applied ? "none" : "0 4px 14px rgba(31,107,255,0.3)" }}>
                  {applied ? "✅ Applied" : "Apply Now"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function AppCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [appliedJobs, setAppliedJobs] = useState([]);

  const filtered = JOBS.filter(j => {
    const matchCat = cat === "all" || j.category === cat;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApply = (job) => {
    setAppliedJobs(prev => prev.find(j => j.id === job.id) ? prev : [...prev, { ...job, appliedDate: "Today" }]);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 90 }}>
      {/* Sticky Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245,247,250,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>💼 Apply Center</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Browse and apply for roles on VYRO</div>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(31,107,255,0.1)", borderRadius: 10, padding: "4px 10px" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#1F6BFF" }}>{JOBS.length} Jobs</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", padding: "0 16px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "11px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 800, color: activeTab === t.id ? "#1F6BFF" : "#9CA3AF", borderBottom: activeTab === t.id ? "2px solid #1F6BFF" : "2px solid transparent" }}>
              {t.icon} {t.label} {t.id === "applied" && appliedJobs.length > 0 ? `(${appliedJobs.length})` : ""}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── BROWSE TAB ── */}
        {activeTab === "browse" && (
          <motion.div key="browse" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Search */}
            <div style={{ background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", border: "1px solid #E9ECF0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Search size={15} color="#9CA3AF" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies…"
                style={{ border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", background: "transparent", flex: 1 }} />
              {search && <X size={13} color="#9CA3AF" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
            </div>

            {/* Categories */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
              {CATEGORIES.map(c => (
                <motion.button key={c.id} whileTap={{ scale: 0.92 }} onClick={() => setCat(c.id)}
                  style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: cat === c.id ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "#fff", color: cat === c.id ? "#fff" : "#6B7280", boxShadow: cat === c.id ? "0 4px 12px rgba(31,107,255,0.25)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                  {c.icon} {c.label}
                </motion.button>
              ))}
            </div>

            {/* Results count */}
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{filtered.length} positions available</div>

            {/* Job Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <JobCard job={job} onApply={handleApply} />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>No jobs found matching your search.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── APPLIED TAB ── */}
        {activeTab === "applied" && (
          <motion.div key="applied" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {appliedJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 48 }}>📋</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#374151" }}>No Applications Yet</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>Browse available jobs and tap "Apply Now" to submit your application.</div>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setActiveTab("browse")}
                  style={{ marginTop: 8, padding: "10px 24px", borderRadius: 12, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                  Browse Jobs
                </motion.button>
              </div>
            ) : (
              appliedJobs.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{job.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{job.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>{job.company}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
                      <span style={{ fontSize: 9, fontWeight: 800, color: "#10B981" }}>Applied · Under Review</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 9, color: "#C4C9D4" }}>{job.appliedDate}</div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}