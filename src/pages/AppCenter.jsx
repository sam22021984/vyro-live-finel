/**
 * ApplyCenter — Enterprise Recruitment & Opportunity Management
 * Access: Profile > More Services > Apply Center
 * Theme: Premium White · Blue Accents · Enterprise UI
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X, Bell, FileText, Users, BarChart2, HelpCircle, CheckCircle } from "lucide-react";

/* ─────────────── DATA ─────────────── */
const POSITIONS = [
  {
    id: 1, title: "Live Host", dept: "Content & Streaming", icon: "🎙️", tag: "Hot", tagColor: "#EF4444",
    type: "Full-Time", location: "Remote", level: "Entry", salary: "Commission-Based",
    desc: "Host live audio rooms, engage audiences, and grow your personal brand on the VYRO platform.",
    responsibilities: ["Stream minimum 4 hours/day", "Engage with audience in real-time", "Participate in platform events", "Maintain community guidelines"],
    requirements: ["LV20+ User Level", "Good communication skills", "Stable internet connection", "Smartphone or PC"],
    benefits: ["Commission on gifts received", "Bonus coins monthly", "Performance rewards", "Official Host Badge"],
    posted: "2 days ago", applicants: 48,
  },
  {
    id: 2, title: "Agent", dept: "Talent Management", icon: "🤝", tag: "Open", tagColor: "#10B981",
    type: "Full-Time", location: "Remote", level: "Mid", salary: "Revenue Share",
    desc: "Recruit, manage, and grow a personal roster of hosts under the VYRO talent program.",
    responsibilities: ["Recruit qualified hosts", "Monitor host performance", "Submit weekly reports", "Coordinate with Agency Manager"],
    requirements: ["LV30+ User Level", "Min. 5 hosts recruited", "Strong networking skills", "Arabic or English fluency"],
    benefits: ["Revenue share from managed hosts", "Agent badge", "Monthly bonuses", "Platform recognition"],
    posted: "1 day ago", applicants: 22,
  },
  {
    id: 3, title: "Agency", dept: "Agency Division", icon: "🏢", tag: "Featured", tagColor: "#1F6BFF",
    type: "Partnership", location: "Remote", level: "Senior", salary: "Negotiable",
    desc: "Establish and operate an official VYRO agency managing hosts and content creators.",
    responsibilities: ["Manage 10+ hosts", "Ensure monthly revenue targets", "Handle contracts", "Submit agency reports"],
    requirements: ["Prior agency experience", "Min. 10 hosts under management", "Registered business entity preferred", "Platform history required"],
    benefits: ["Agency revenue share", "Official agency badge", "Dedicated support", "Featured placement"],
    posted: "3 days ago", applicants: 9,
  },
  {
    id: 4, title: "Admin", dept: "Platform Operations", icon: "🛡️", tag: "New", tagColor: "#A855F7",
    type: "Full-Time", location: "Remote", level: "Mid", salary: "Fixed + Bonuses",
    desc: "Moderate platform activity, manage community reports, and ensure platform standards.",
    responsibilities: ["Review and resolve reports", "Monitor live rooms", "Enforce community guidelines", "Support user inquiries"],
    requirements: ["LV40+ User Level", "Neutral judgment", "Availability 6h/day", "Experience in moderation"],
    benefits: ["Fixed salary + performance bonus", "Admin badge", "Priority platform access", "Career growth path"],
    posted: "5 days ago", applicants: 31,
  },
  {
    id: 5, title: "Super Admin", dept: "Platform Operations", icon: "⚡", tag: "Senior", tagColor: "#F59E0B",
    type: "Full-Time", location: "Remote", level: "Senior", salary: "Premium",
    desc: "Lead administrative operations, manage admin teams, and ensure platform integrity at scale.",
    responsibilities: ["Oversee admin team", "Handle escalated cases", "Report to Country Manager", "Policy enforcement"],
    requirements: ["3+ years moderation experience", "LV60+ User Level", "Leadership experience", "Fluent English/Arabic"],
    benefits: ["Premium salary", "Super Admin badge", "Executive-level access", "Annual performance review"],
    posted: "1 week ago", applicants: 7,
  },
  {
    id: 6, title: "Country Manager", dept: "Regional Management", icon: "🌍", tag: "Executive", tagColor: "#0EA5E9",
    type: "Full-Time", location: "Remote", level: "Executive", salary: "Executive Package",
    desc: "Lead all VYRO operations within a designated country or region.",
    responsibilities: ["Manage regional team", "Drive regional revenue", "Build local partnerships", "Monthly executive reports"],
    requirements: ["5+ years management experience", "Native/fluent in regional language", "Prior platform experience preferred", "Proven revenue track record"],
    benefits: ["Executive salary package", "Country Manager title", "Equity consideration", "Annual retreat invitation"],
    posted: "2 weeks ago", applicants: 4,
  },
  {
    id: 7, title: "Business Development Director", dept: "Business", icon: "📈", tag: "Executive", tagColor: "#0EA5E9",
    type: "Full-Time", location: "Remote", level: "Executive", salary: "Executive Package",
    desc: "Identify and develop strategic partnerships, revenue streams, and business growth opportunities.",
    responsibilities: ["Identify new partnerships", "Negotiate business deals", "Develop growth strategy", "Report to C-Suite"],
    requirements: ["7+ years BD experience", "Proven deal track record", "International business network", "Fluent English required"],
    benefits: ["Executive salary + commission", "Director title badge", "Equity options", "Global team leadership"],
    posted: "1 week ago", applicants: 3,
  },
  {
    id: 8, title: "Business Manager", dept: "Business", icon: "💼", tag: "Hot", tagColor: "#EF4444",
    type: "Full-Time", location: "Remote", level: "Senior", salary: "Competitive",
    desc: "Manage business operations, agency relations, and revenue optimization across the platform.",
    responsibilities: ["Manage agency partnerships", "Revenue analysis", "Operational reporting", "Team coordination"],
    requirements: ["4+ years business management", "Analytical skills", "Strong communication", "Excel/reporting proficiency"],
    benefits: ["Competitive salary", "Performance bonuses", "Manager badge", "Career advancement"],
    posted: "4 days ago", applicants: 14,
  },
  {
    id: 9, title: "Support Manager", dept: "Customer Support", icon: "🛟", tag: "Open", tagColor: "#10B981",
    type: "Full-Time", location: "Remote", level: "Mid-Senior", salary: "Competitive",
    desc: "Lead the support team, handle escalated tickets, and ensure user satisfaction benchmarks.",
    responsibilities: ["Manage support team", "Handle escalations", "Improve support processes", "SLA monitoring"],
    requirements: ["3+ years support management", "Strong problem-solving", "Team leadership experience", "CRM tool proficiency"],
    benefits: ["Competitive salary", "Support Manager badge", "Bonuses", "Professional development"],
    posted: "3 days ago", applicants: 19,
  },
  {
    id: 10, title: "Finance Manager", dept: "Finance", icon: "💰", tag: "New", tagColor: "#A855F7",
    type: "Full-Time", location: "Remote", level: "Senior", salary: "Premium",
    desc: "Oversee financial reporting, withdrawal processing, and financial compliance operations.",
    responsibilities: ["Manage financial reports", "Oversee withdrawal approvals", "Tax and compliance", "Budget planning"],
    requirements: ["Finance degree required", "5+ years finance experience", "Knowledge of digital finance", "Audit experience preferred"],
    benefits: ["Premium salary", "Finance Manager badge", "Performance bonus", "Annual review"],
    posted: "6 days ago", applicants: 6,
  },
  {
    id: 11, title: "Marketing Manager", dept: "Marketing", icon: "📣", tag: "Featured", tagColor: "#1F6BFF",
    type: "Full-Time", location: "Remote", level: "Senior", salary: "Competitive",
    desc: "Design and execute marketing campaigns to grow VYRO's user base and brand presence.",
    responsibilities: ["Campaign strategy", "Social media management", "Influencer partnerships", "Analytics reporting"],
    requirements: ["4+ years digital marketing", "Social media expertise", "Content creation skills", "Analytics proficiency"],
    benefits: ["Competitive salary", "Marketing Manager badge", "Campaign bonuses", "Creative freedom"],
    posted: "2 days ago", applicants: 27,
  },
  {
    id: 12, title: "VIP Manager", dept: "VIP Services", icon: "👑", tag: "Hot", tagColor: "#EF4444",
    type: "Full-Time", location: "Remote", level: "Senior", salary: "Premium",
    desc: "Manage VIP user relations, exclusive programs, and high-value account retention strategies.",
    responsibilities: ["Manage VIP accounts", "Design VIP programs", "High-value retention", "Monthly VIP reports"],
    requirements: ["3+ years VIP/CRM experience", "Luxury service mindset", "Relationship management", "Discretion required"],
    benefits: ["Premium salary + bonuses", "VIP Manager badge", "Exclusive platform access", "Executive networking"],
    posted: "1 day ago", applicants: 11,
  },
  {
    id: 13, title: "Reward Manager", dept: "Rewards & Incentives", icon: "🎁", tag: "Open", tagColor: "#10B981",
    type: "Full-Time", location: "Remote", level: "Mid-Senior", salary: "Competitive",
    desc: "Design, manage, and optimize the platform's rewards, events, and incentive programs.",
    responsibilities: ["Design reward systems", "Manage events & challenges", "Analyze reward effectiveness", "Coordinate with finance"],
    requirements: ["3+ years rewards/gamification experience", "Analytical mindset", "Creative design skills", "Platform knowledge"],
    benefits: ["Competitive salary", "Reward Manager badge", "Performance bonuses", "Creative ownership"],
    posted: "4 days ago", applicants: 15,
  },
];

const MY_APPLICATIONS = [
  { id: 1, positionId: 1, title: "Live Host", dept: "Content & Streaming", icon: "🎙️", status: "Interview Scheduled", statusColor: "#1F6BFF", appliedDate: "Jun 14, 2026", lastUpdate: "Jun 16, 2026" },
  { id: 2, positionId: 11, title: "Marketing Manager", dept: "Marketing", icon: "📣", status: "Under Review", statusColor: "#F59E0B", appliedDate: "Jun 10, 2026", lastUpdate: "Jun 13, 2026" },
  { id: 3, positionId: 4, title: "Admin", dept: "Platform Operations", icon: "🛡️", status: "Rejected", statusColor: "#EF4444", appliedDate: "May 28, 2026", lastUpdate: "Jun 5, 2026" },
];

const NOTIFICATIONS = [
  { id: 1, icon: "📅", title: "Interview Scheduled", body: "Your interview for Live Host is scheduled for Jun 18 at 3:00 PM GST.", time: "2h ago", read: false },
  { id: 2, icon: "✅", title: "Application Submitted", body: "Your application for Marketing Manager has been successfully submitted.", time: "6d ago", read: false },
  { id: 3, icon: "❌", title: "Application Rejected", body: "Unfortunately your application for Admin did not proceed.", time: "12d ago", read: true },
  { id: 4, icon: "📋", title: "Document Required", body: "Please upload your Resume/CV to complete your Live Host application.", time: "8d ago", read: true },
];

const STATUS_STEPS = ["Draft", "Submitted", "Under Review", "Verification", "Interview", "Evaluation", "Decision", "Hired"];

const DEPT_FILTERS = [
  { id: "all",       label: "All",        icon: "💼" },
  { id: "Content & Streaming",  label: "Hosting",  icon: "🎙️" },
  { id: "Agency Division",      label: "Agency",   icon: "🏢" },
  { id: "Platform Operations",  label: "Ops",      icon: "🛡️" },
  { id: "Business",             label: "Business", icon: "📈" },
  { id: "Marketing",            label: "Marketing",icon: "📣" },
  { id: "Finance",              label: "Finance",  icon: "💰" },
  { id: "VIP Services",         label: "VIP",      icon: "👑" },
  { id: "Rewards & Incentives", label: "Rewards",  icon: "🎁" },
  { id: "Customer Support",     label: "Support",  icon: "🛟" },
  { id: "Regional Management",  label: "Regional", icon: "🌍" },
];

const MAIN_TABS = [
  { id: "browse",      label: "Opportunities", icon: "🔍" },
  { id: "applications",label: "My Applications",icon: "📋" },
  { id: "interviews",  label: "Interviews",     icon: "🎤" },
  { id: "documents",   label: "Documents",      icon: "📁" },
  { id: "notifications",label: "Alerts",        icon: "🔔" },
  { id: "support",     label: "Support",        icon: "🛟" },
];

/* ─────────────── SHARED COMPONENTS ─────────────── */
function SLabel({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>;
}

function StatusBadge({ status, color }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 8, background: `${color}12`, border: `1px solid ${color}30` }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 9, fontWeight: 800, color }}>{status}</span>
    </div>
  );
}

function ActionBtn({ label, color, small, onClick, disabled }) {
  return (
    <motion.button whileTap={!disabled ? { scale: 0.93 } : {}} onClick={!disabled ? onClick : undefined}
      style={{ padding: small ? "6px 14px" : "9px 18px", borderRadius: 11, fontSize: small ? 10 : 12, fontWeight: 800, border: "none", cursor: disabled ? "default" : "pointer", background: disabled ? "#F3F4F6" : color, color: disabled ? "#9CA3AF" : "#fff", flexShrink: 0 }}>
      {label}
    </motion.button>
  );
}

/* ─────────────── POSITION DETAIL MODAL ─────────────── */
function PositionDetail({ pos, onClose, onApply, applied }) {
  const [tab, setTab] = useState("overview");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#F5F7FA", borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "88vh", overflowY: "auto", paddingBottom: 32 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "12px auto 0" }} />

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)", padding: "20px 20px 0", borderRadius: "22px 22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{pos.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{pos.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>{pos.dept} · {pos.type} · {pos.location}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: `${pos.tagColor}25`, color: pos.tagColor }}>{pos.tag}</span>
                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}>{pos.level}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {["overview", "responsibilities", "requirements", "benefits"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flexShrink: 0, padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "capitalize", color: tab === t ? "#fff" : "rgba(255,255,255,0.45)", borderBottom: tab === t ? "2px solid #fff" : "2px solid transparent" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: "16px 20px" }}>
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="📋 POSITION OVERVIEW" />
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.8 }}>{pos.desc}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ l: "Compensation", v: pos.salary, icon: "💰" }, { l: "Level", v: pos.level, icon: "📊" }, { l: "Type", v: pos.type, icon: "⏰" }, { l: "Applicants", v: pos.applicants, icon: "👥" }].map(s => (
                  <div key={s.l} style={{ background: "#fff", borderRadius: 12, padding: "11px 13px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#0D1B3E" }}>{s.v}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "responsibilities" && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
              <SLabel label="📌 KEY RESPONSIBILITIES" />
              {pos.responsibilities.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < pos.responsibilities.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                  <span style={{ fontSize: 12, color: "#1F6BFF", flexShrink: 0, marginTop: 1 }}>▸</span>
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{r}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "requirements" && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
              <SLabel label="✅ REQUIREMENTS & QUALIFICATIONS" />
              {pos.requirements.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < pos.requirements.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                  <span style={{ fontSize: 12, color: "#10B981", flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{r}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "benefits" && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
              <SLabel label="🎁 BENEFITS PACKAGE" />
              {pos.benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < pos.benefits.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>⭐</span>
                  <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{b}</span>
                </div>
              ))}
            </div>
          )}

          {/* Workflow Steps */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8", marginTop: 14 }}>
            <SLabel label="🔄 APPLICATION WORKFLOW" />
            <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
              {STATUS_STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "#1F6BFF" : "#EEF2FF", border: `2px solid ${i === 0 ? "#1F6BFF" : "#C7D2FE"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: i === 0 ? "#fff" : "#6366F1" }}>{i + 1}</div>
                    <div style={{ fontSize: 8, color: "#9CA3AF", marginTop: 3, maxWidth: 40, lineHeight: 1.2 }}>{step}</div>
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div style={{ width: 20, height: 2, background: "#E5E7EB", flexShrink: 0, marginBottom: 18 }} />}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <ActionBtn label="View Requirements" color="#F5F7FA" onClick={() => setTab("requirements")} style={{ color: "#374151" }} />
            <ActionBtn label={applied ? "✅ Applied" : "Apply Now"} color="linear-gradient(135deg,#1F6BFF,#6366F1)" onClick={onApply} disabled={applied} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── APPLICATION FORM MODAL ─────────────── */
function ApplicationForm({ pos, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", country: "", experience: "", skills: "", languages: "", availability: "", motivation: "" });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fields1 = [
    { key: "fullName", label: "Full Name", placeholder: "Your full name" },
    { key: "email", label: "Email Address", placeholder: "your@email.com" },
    { key: "phone", label: "Phone Number", placeholder: "+1 234 567 8901" },
    { key: "country", label: "Country", placeholder: "e.g. Qatar" },
  ];
  const fields2 = [
    { key: "experience", label: "Relevant Experience", placeholder: "Describe your experience…" },
    { key: "skills", label: "Key Skills", placeholder: "e.g. Communication, Leadership…" },
    { key: "languages", label: "Languages Spoken", placeholder: "e.g. Arabic, English" },
    { key: "availability", label: "Availability", placeholder: "e.g. Full-time from July 2026" },
    { key: "motivation", label: "Why This Role?", placeholder: "Tell us why you want to apply…" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#F5F7FA", borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "90vh", overflowY: "auto", paddingBottom: 32 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "12px auto 0" }} />
        <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>📝 Apply: {pos.title}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>Step {step} of 2 · {pos.dept}</div>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 13, color: "#6B7280" }}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 6, padding: "10px 20px" }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? "#1F6BFF" : "#E5E7EB", transition: "background 0.3s" }} />
          ))}
        </div>

        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {(step === 1 ? fields1 : fields2).map(f => (
            <div key={f.key}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 5 }}>{f.label}</div>
              <textarea rows={f.key === "motivation" || f.key === "experience" ? 3 : 1}
                value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder}
                style={{ width: "100%", padding: "10px 13px", borderRadius: 11, background: "#fff", border: "1px solid #E9ECF0", color: "#0D1B3E", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {step === 2 && <ActionBtn label="← Back" color="#E5E7EB" onClick={() => setStep(1)} />}
            {step === 1
              ? <ActionBtn label="Next →" color="linear-gradient(135deg,#1F6BFF,#6366F1)" onClick={() => setStep(2)} />
              : <ActionBtn label="Submit Application" color="linear-gradient(135deg,#10B981,#059669)" onClick={() => { onSubmit(); onClose(); }} />
            }
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 11, color: "#9CA3AF", cursor: "pointer" }}>Save as Draft</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── BROWSE TAB ─────────────── */
function BrowseTab({ applied, onApply }) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [selectedPos, setSelectedPos] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = POSITIONS.filter(p => {
    const matchDept = dept === "all" || p.dept === dept;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.dept.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ l: "Openings", v: POSITIONS.length, icon: "💼", color: "#1F6BFF" }, { l: "Applied", v: applied.size, icon: "📋", color: "#10B981" }, { l: "Departments", v: 9, icon: "🏢", color: "#A855F7" }].map(s => (
          <div key={s.l} style={{ background: "#fff", borderRadius: 14, padding: "12px 10px", textAlign: "center", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{s.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.v}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ background: "#fff", borderRadius: 13, display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", border: "1px solid #E9ECF0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <Search size={14} color="#9CA3AF" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search positions or departments…"
          style={{ border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", background: "transparent", flex: 1 }} />
        {search && <X size={13} color="#9CA3AF" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
      </div>

      {/* Dept filters */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {DEPT_FILTERS.map(d => (
          <motion.button key={d.id} whileTap={{ scale: 0.92 }} onClick={() => setDept(d.id)}
            style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 18, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", background: dept === d.id ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "#fff", color: dept === d.id ? "#fff" : "#6B7280", boxShadow: dept === d.id ? "0 4px 12px rgba(31,107,255,0.25)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            {d.icon} {d.label}
          </motion.button>
        ))}
      </div>

      <SLabel label={`💼 ${filtered.length} POSITIONS AVAILABLE`} />

      {/* Position cards */}
      {filtered.map((pos, i) => (
        <motion.div key={pos.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
          style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{pos.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{pos.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${pos.tagColor}12`, color: pos.tagColor }}>{pos.tag}</span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 5 }}>{pos.dept}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>📍 {pos.location}</span>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>⏰ {pos.type}</span>
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>💰 {pos.salary}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "10px 0", lineHeight: 1.6 }}>{pos.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#C4C9D4" }}>Posted {pos.posted} · {pos.applicants} applicants</span>
              <div style={{ display: "flex", gap: 8 }}>
                <ActionBtn label="View Details" color="#EEF2FF" onClick={() => setSelectedPos(pos)} small />
                <ActionBtn label={applied.has(pos.id) ? "✅ Applied" : "Apply"} color="linear-gradient(135deg,#1F6BFF,#6366F1)" onClick={() => { setSelectedPos(pos); setShowForm(true); }} disabled={applied.has(pos.id)} small />
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedPos && !showForm && (
          <PositionDetail pos={selectedPos} onClose={() => setSelectedPos(null)}
            onApply={() => setShowForm(true)} applied={applied.has(selectedPos.id)} />
        )}
        {showForm && selectedPos && (
          <ApplicationForm pos={selectedPos} onClose={() => { setShowForm(false); setSelectedPos(null); }}
            onSubmit={() => onApply(selectedPos.id)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── APPLICATIONS TAB ─────────────── */
function ApplicationsTab() {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "Under Review", "Interview Scheduled", "Rejected"];
  const visible = filter === "all" ? MY_APPLICATIONS : MY_APPLICATIONS.filter(a => a.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
        {filters.map(f => (
          <motion.button key={f} whileTap={{ scale: 0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink: 0, padding: "6px 13px", borderRadius: 16, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", textTransform: "capitalize", background: filter === f ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "#fff", color: filter === f ? "#fff" : "#6B7280", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {f === "all" ? "All" : f}
          </motion.button>
        ))}
      </div>

      {visible.map((app, i) => (
        <motion.div key={app.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{app.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 2 }}>{app.title}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 6 }}>{app.dept}</div>
                <StatusBadge status={app.status} color={app.statusColor} />
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {STATUS_STEPS.slice(0, 5).map((s, si) => {
                  const activeIdx = app.status === "Under Review" ? 2 : app.status === "Interview Scheduled" ? 4 : app.status === "Rejected" ? 1 : 1;
                  return <div key={si} style={{ flex: 1, height: 4, borderRadius: 2, background: si <= activeIdx ? app.statusColor : "#E5E7EB", transition: "background 0.3s" }} />;
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ fontSize: 9, color: "#C4C9D4" }}>Applied: {app.appliedDate}</span>
                <span style={{ fontSize: 9, color: "#C4C9D4" }}>Updated: {app.lastUpdate}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <ActionBtn label="View Details" color="#EEF2FF" small />
              {app.status !== "Rejected" && <ActionBtn label="Contact HR" color="rgba(31,107,255,0.15)" small />}
              {app.status === "Interview Scheduled" && <ActionBtn label="🎤 Join Interview" color="linear-gradient(135deg,#10B981,#059669)" small />}
            </div>
          </div>
        </motion.div>
      ))}

      {visible.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>No applications in this category.</div>
      )}
    </div>
  );
}

/* ─────────────── INTERVIEWS TAB ─────────────── */
function InterviewsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)", borderRadius: 16, padding: 16, boxShadow: "0 6px 20px rgba(31,107,255,0.25)" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", marginBottom: 10, letterSpacing: "0.06em" }}>📅 UPCOMING INTERVIEW</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🎙️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 2 }}>Live Host Interview</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>Content & Streaming Dept.</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#F59E0B" }}>📅 Jun 18, 2026 · 3:00 PM GST</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <motion.button whileTap={{ scale: 0.94 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "#fff", color: "#1F6BFF", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>✅ Confirm</motion.button>
          <motion.button whileTap={{ scale: 0.94 }} style={{ flex: 1, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>🎤 Join Online</motion.button>
        </div>
      </div>

      {[
        { icon: "📋", label: "Interview Instructions", desc: "Review preparation guidelines", color: "#1F6BFF" },
        { icon: "🔄", label: "Reschedule Interview", desc: "Request a different time slot", color: "#F59E0B" },
        { icon: "💬", label: "Contact Interviewer", desc: "Send a message to the HR team", color: "#10B981" },
        { icon: "📝", label: "Interview Feedback", desc: "View feedback after completion", color: "#A855F7" },
      ].map((item, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 16px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{item.label}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{item.desc}</div>
          </div>
          <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────── DOCUMENTS TAB ─────────────── */
function DocumentsTab() {
  const docs = [
    { name: "Profile Photo",            icon: "🖼️", status: "uploaded", color: "#10B981" },
    { name: "National ID",              icon: "🪪", status: "uploaded", color: "#10B981" },
    { name: "Passport",                 icon: "📘", status: "missing",  color: "#EF4444" },
    { name: "Resume / CV",              icon: "📄", status: "uploaded", color: "#10B981" },
    { name: "Educational Certificates", icon: "🎓", status: "missing",  color: "#EF4444" },
    { name: "Experience Certificates",  icon: "📋", status: "missing",  color: "#F59E0B" },
    { name: "Supporting Documents",     icon: "📎", status: "optional", color: "#9CA3AF" },
  ];
  const uploaded = docs.filter(d => d.status === "uploaded").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>Document Completion</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#1F6BFF" }}>{uploaded}/{docs.length}</span>
        </div>
        <div style={{ height: 7, borderRadius: 4, background: "#F0F0F8", overflow: "hidden" }}>
          <div style={{ width: `${(uploaded / docs.length) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#1F6BFF,#10B981)", transition: "width 0.5s" }} />
        </div>
      </div>

      {docs.map((doc, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 16px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${doc.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{doc.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 3 }}>{doc.name}</div>
            <StatusBadge status={doc.status === "uploaded" ? "✅ Uploaded" : doc.status === "optional" ? "Optional" : "⚠️ Required"} color={doc.color} />
          </div>
          <motion.button whileTap={{ scale: 0.92 }}
            style={{ padding: "7px 12px", borderRadius: 10, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", background: doc.status === "uploaded" ? "#F5F7FA" : "linear-gradient(135deg,#1F6BFF,#6366F1)", color: doc.status === "uploaded" ? "#6B7280" : "#fff" }}>
            {doc.status === "uploaded" ? "Replace" : "Upload"}
          </motion.button>
        </div>
      ))}
    </div>
  );
}

/* ─────────────── NOTIFICATIONS TAB ─────────────── */
function NotificationsTab() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SLabel label={`🔔 ${notifs.filter(n => !n.read).length} UNREAD NOTIFICATIONS`} />
        <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))} style={{ background: "none", border: "none", fontSize: 11, color: "#1F6BFF", fontWeight: 700, cursor: "pointer" }}>Mark all read</button>
      </div>
      {notifs.map((n, i) => (
        <motion.div key={n.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          onClick={() => markRead(n.id)}
          style={{ background: n.read ? "#fff" : "#EFF6FF", borderRadius: 14, padding: "13px 16px", border: `1px solid ${n.read ? "#F0F0F8" : "#BFDBFE"}`, cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#0D1B3E", marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontSize: 9, color: "#C4C9D4", marginTop: 4 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1F6BFF", flexShrink: 0, marginTop: 4 }} />}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────── SUPPORT TAB ─────────────── */
function SupportTab() {
  const items = [
    { icon: "📝", label: "Recruitment Support",   desc: "Questions about the recruitment process",  color: "#1F6BFF" },
    { icon: "📋", label: "Application Support",   desc: "Help with submitting your application",    color: "#A855F7" },
    { icon: "🎤", label: "Interview Support",      desc: "Interview preparation and scheduling",     color: "#10B981" },
    { icon: "📁", label: "Document Support",       desc: "Help uploading required documents",        color: "#F59E0B" },
    { icon: "🤝", label: "Hiring Support",         desc: "Hiring decisions and onboarding queries",  color: "#0EA5E9" },
    { icon: "📞", label: "Contact HR Team",        desc: "Direct line to the HR department",         color: "#EF4444" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 16, padding: 14, border: "1px solid #C7D2FE", marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 4 }}>🛟 Recruitment Support Center</div>
        <p style={{ fontSize: 11, color: "#4B5563", lineHeight: 1.7 }}>Our HR team is available to assist you through every step of the application and hiring process. Select a topic below to get started.</p>
      </div>
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "13px 16px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{item.label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{item.desc}</div>
            </div>
            <span style={{ fontSize: 16, color: "#D1D5DB" }}>›</span>
          </div>
        </motion.div>
      ))}
      <motion.button whileTap={{ scale: 0.96 }}
        style={{ width: "100%", padding: "13px", borderRadius: 14, background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer", marginTop: 4, boxShadow: "0 4px 14px rgba(31,107,255,0.25)" }}>
        📝 Create Support Ticket
      </motion.button>
    </div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function AppCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("browse");
  const [applied, setApplied] = useState(new Set());
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const handleApply = (posId) => setApplied(prev => new Set([...prev, posId]));

  const CONTENT = {
    browse:        <BrowseTab applied={applied} onApply={handleApply} />,
    applications:  <ApplicationsTab />,
    interviews:    <InterviewsTab />,
    documents:     <DocumentsTab />,
    notifications: <NotificationsTab />,
    support:       <SupportTab />,
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
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E" }}>💼 Apply Center</div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>VYRO Recruitment & Opportunity Portal</div>
          </div>
          {unread > 0 && (
            <div style={{ position: "relative" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={16} color="#1F6BFF" />
              </div>
              <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "#fff", fontWeight: 900 }}>{unread}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", overflowX: "auto", padding: "0 16px" }}>
          {MAIN_TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flexShrink: 0, padding: "11px 10px", border: "none", background: "transparent", cursor: "pointer", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap", color: activeTab === t.id ? "#1F6BFF" : "#9CA3AF", borderBottom: activeTab === t.id ? "2px solid #1F6BFF" : "2px solid transparent" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          style={{ padding: 16 }}>
          {CONTENT[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}