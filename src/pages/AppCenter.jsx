/**
 * ApplyCenter — VYRO Live Connect Role Application System
 * Access: Profile > More Services > Apply Center
 * Theme: Premium White · Blue Accents · Enterprise UI
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X, Bell } from "lucide-react";

/* ─────────────── ROLE DEFINITIONS ─────────────── */
const ROLES = [
  {
    id: "host",
    title: "Host",
    icon: "🎙️",
    color: "#A855F7",
    tag: "Open",
    tagColor: "#10B981",
    eligibility: "Any verified user",
    dept: "Content & Streaming",
    desc: "Host live audio rooms, engage audiences, and grow your personal brand on the VYRO platform.",
    reviewsAt: "Agent / Agency Dashboard",
    afterApproval: ["Host Account Activated", "Host Linked to Agency or Agent", "Host ID Auto Generated"],
    workflow: ["User", "Host Application", "Agent / Agency Dashboard"],
    formFields: [
      { key: "fullName",   label: "Full Name",              placeholder: "Your full legal name",     rows: 1 },
      { key: "vyroId",     label: "VYRO ID",                placeholder: "e.g. VYRO-12345",          rows: 1 },
      { key: "country",    label: "Country",                placeholder: "e.g. Qatar",               rows: 1 },
      { key: "whatsapp",   label: "WhatsApp Number",        placeholder: "+974 5000 0000",           rows: 1 },
      { key: "agencyId",   label: "Agency ID (Optional)",   placeholder: "Enter Agency ID or leave blank", rows: 1 },
      { key: "agentId",    label: "Agent ID (Optional)",    placeholder: "Enter Agent ID or leave blank",  rows: 1 },
    ],
    docFields: [
      { name: "Identity Document (Front)", key: "idFront", required: true },
      { name: "Identity Document (Back)",  key: "idBack",  required: true },
      { name: "Selfie with ID",            key: "selfie",  required: true },
    ],
  },
  {
    id: "agency",
    title: "Agency",
    icon: "🏢",
    color: "#1F6BFF",
    tag: "Featured",
    tagColor: "#1F6BFF",
    eligibility: "Approved Host Required",
    dept: "Agency Division",
    desc: "Establish and operate an official VYRO agency managing hosts and content creators.",
    reviewsAt: "Admin Dashboard",
    afterApproval: ["Agency Account Created", "Agency ID Auto Generated"],
    workflow: ["Host", "Agency Application", "Admin Dashboard"],
    formFields: [
      { key: "vyroId",      label: "VYRO ID",              placeholder: "e.g. VYRO-12345",          rows: 1 },
      { key: "hostId",      label: "Host ID",              placeholder: "Your approved Host ID",     rows: 1 },
      { key: "experience",  label: "Experience Details",   placeholder: "Describe your experience managing hosts or agencies…", rows: 3 },
    ],
    docFields: [
      { name: "Required Documents", key: "docs", required: true },
    ],
  },
  {
    id: "agent",
    title: "Agent",
    icon: "🤝",
    color: "#10B981",
    tag: "Open",
    tagColor: "#10B981",
    eligibility: "Approved Host Required",
    dept: "Talent Management",
    desc: "Recruit, manage, and grow a personal roster of hosts under the VYRO talent program.",
    reviewsAt: "Admin Dashboard",
    afterApproval: ["Agent Account Created", "Agent ID Auto Generated"],
    workflow: ["Host", "Agent Application", "Admin Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",             placeholder: "e.g. VYRO-12345",          rows: 1 },
      { key: "hostId",     label: "Host ID",             placeholder: "Your approved Host ID",     rows: 1 },
      { key: "experience", label: "Experience Details",  placeholder: "Describe your talent recruitment experience…", rows: 3 },
    ],
    docFields: [
      { name: "Documents", key: "docs", required: true },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    icon: "🛡️",
    color: "#EF4444",
    tag: "New",
    tagColor: "#A855F7",
    eligibility: "Approved Host + Approved Agent OR Agency",
    dept: "Platform Operations",
    desc: "Moderate platform activity, manage community reports, and ensure platform standards.",
    reviewsAt: "Super Admin Dashboard",
    afterApproval: ["Admin Access Granted"],
    workflow: ["Application", "Super Admin Dashboard"],
    formFields: [
      { key: "vyroId",      label: "VYRO ID",             placeholder: "e.g. VYRO-12345",     rows: 1 },
      { key: "hostId",      label: "Host ID",             placeholder: "Your Host ID",         rows: 1 },
      { key: "agentOrAgency", label: "Agent ID / Agency ID", placeholder: "Your Agent or Agency ID", rows: 1 },
      { key: "experience",  label: "Moderation Experience", placeholder: "Describe your experience…", rows: 3 },
    ],
    docFields: [],
  },
  {
    id: "super_admin",
    title: "Super Admin",
    icon: "⚡",
    color: "#F59E0B",
    tag: "Senior",
    tagColor: "#F59E0B",
    eligibility: "Approved Host + Agent + Agency + Admin",
    dept: "Platform Operations",
    desc: "Lead administrative operations, manage admin teams, and ensure platform integrity at scale.",
    reviewsAt: "Business Manager Dashboard",
    afterApproval: ["Super Admin Access Granted"],
    workflow: ["Application", "Business Manager Dashboard"],
    formFields: [
      { key: "vyroId",    label: "VYRO ID",      placeholder: "e.g. VYRO-12345",          rows: 1 },
      { key: "hostId",    label: "Host ID",      placeholder: "Your approved Host ID",     rows: 1 },
      { key: "agentId",   label: "Agent ID",     placeholder: "Your approved Agent ID",    rows: 1 },
      { key: "agencyId",  label: "Agency ID",    placeholder: "Your approved Agency ID",   rows: 1 },
      { key: "adminId",   label: "Admin ID",     placeholder: "Your approved Admin ID",    rows: 1 },
      { key: "experience",label: "Leadership Experience", placeholder: "Describe your platform experience…", rows: 3 },
    ],
    docFields: [],
  },
  {
    id: "biz_manager",
    title: "Business Manager",
    icon: "💼",
    color: "#0EA5E9",
    tag: "Hot",
    tagColor: "#EF4444",
    eligibility: "Apply to Owner Dashboard",
    dept: "Business",
    desc: "Manage business operations, agency relations, and revenue optimization across the platform.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["Business Manager Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",          placeholder: "e.g. VYRO-12345",    rows: 1 },
      { key: "experience", label: "Business Experience", placeholder: "Describe your business management experience…", rows: 3 },
      { key: "motivation", label: "Why This Role?",    placeholder: "Explain your motivation…", rows: 2 },
    ],
    docFields: [],
  },
  {
    id: "biz_director",
    title: "Business Director",
    icon: "📈",
    color: "#6366F1",
    tag: "Executive",
    tagColor: "#0EA5E9",
    eligibility: "Apply to Owner Dashboard",
    dept: "Business",
    desc: "Identify and develop strategic partnerships, revenue streams, and business growth opportunities.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["Business Director Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",          placeholder: "e.g. VYRO-12345",    rows: 1 },
      { key: "experience", label: "Director Experience", placeholder: "Describe your executive experience…", rows: 3 },
      { key: "motivation", label: "Vision Statement",  placeholder: "Share your strategic vision…", rows: 2 },
    ],
    docFields: [],
  },
  {
    id: "country_manager",
    title: "Country Manager",
    icon: "🌍",
    color: "#EC4899",
    tag: "Executive",
    tagColor: "#0EA5E9",
    eligibility: "Apply to Owner Dashboard",
    dept: "Regional Management",
    desc: "Lead all VYRO operations within a designated country or region.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["Country Manager Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",    label: "VYRO ID",        placeholder: "e.g. VYRO-12345",     rows: 1 },
      { key: "country",   label: "Target Country", placeholder: "Country you want to manage", rows: 1 },
      { key: "experience",label: "Management Experience", placeholder: "Describe your regional leadership experience…", rows: 3 },
    ],
    docFields: [],
  },
  {
    id: "reward_manager",
    title: "Reward Manager",
    icon: "🎁",
    color: "#F97316",
    tag: "Open",
    tagColor: "#10B981",
    eligibility: "Apply to Owner Dashboard",
    dept: "Rewards & Incentives",
    desc: "Design, manage, and optimize the platform's rewards, events, and incentive programs.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["Reward Manager Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",              placeholder: "e.g. VYRO-12345",    rows: 1 },
      { key: "experience", label: "Rewards/Gamification Experience", placeholder: "Describe your experience…", rows: 3 },
    ],
    docFields: [],
  },
  {
    id: "vip_manager",
    title: "VIP Manager",
    icon: "👑",
    color: "#FFC83D",
    tag: "Hot",
    tagColor: "#EF4444",
    eligibility: "Apply to Owner Dashboard",
    dept: "VIP Services",
    desc: "Manage VIP user relations, exclusive programs, and high-value account retention strategies.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["VIP Manager Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",         placeholder: "e.g. VYRO-12345", rows: 1 },
      { key: "experience", label: "VIP/CRM Experience", placeholder: "Describe your VIP management experience…", rows: 3 },
    ],
    docFields: [],
  },
  {
    id: "finance_manager",
    title: "Finance Manager",
    icon: "💰",
    color: "#10B981",
    tag: "New",
    tagColor: "#A855F7",
    eligibility: "Apply to Owner Dashboard",
    dept: "Finance",
    desc: "Oversee financial reporting, withdrawal processing, and financial compliance operations.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["Finance Manager Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",            placeholder: "e.g. VYRO-12345", rows: 1 },
      { key: "experience", label: "Finance Experience", placeholder: "Describe your finance/compliance experience…", rows: 3 },
    ],
    docFields: [],
  },
  {
    id: "support_manager",
    title: "Support Manager",
    icon: "🛟",
    color: "#06B6D4",
    tag: "Open",
    tagColor: "#10B981",
    eligibility: "Apply to Owner Dashboard",
    dept: "Customer Support",
    desc: "Lead the support team, handle escalated tickets, and ensure user satisfaction benchmarks.",
    reviewsAt: "Owner Dashboard",
    afterApproval: ["Support Manager Access Granted"],
    workflow: ["Application", "Owner Dashboard"],
    formFields: [
      { key: "vyroId",     label: "VYRO ID",              placeholder: "e.g. VYRO-12345", rows: 1 },
      { key: "experience", label: "Support Management Experience", placeholder: "Describe your support leadership experience…", rows: 3 },
    ],
    docFields: [],
  },
];

const STATUS_TYPES = ["Pending Review", "Under Verification", "Approved", "Rejected", "Delayed", "Resubmission Required"];
const STATUS_COLORS = {
  "Pending Review": "#F59E0B",
  "Under Verification": "#1F6BFF",
  "Approved": "#10B981",
  "Rejected": "#EF4444",
  "Delayed": "#9CA3AF",
  "Resubmission Required": "#A855F7",
};

const MY_APPLICATIONS = [
  { id: "APP-2841", roleId: "host", title: "Host", icon: "🎙️", dept: "Content & Streaming", status: "Under Verification", submittedDate: "Jun 14, 2026", updatedDate: "Jun 16, 2026", reviewingAuthority: "Agent Dashboard", appId: "APP-2841", notes: "Documents under review.", remarks: "" },
  { id: "APP-1924", roleId: "agency", title: "Agency", icon: "🏢", dept: "Agency Division", status: "Pending Review", submittedDate: "Jun 10, 2026", updatedDate: "Jun 13, 2026", reviewingAuthority: "Admin Dashboard", appId: "APP-1924", notes: "", remarks: "" },
  { id: "APP-0482", roleId: "admin", title: "Admin", icon: "🛡️", dept: "Platform Operations", status: "Rejected", submittedDate: "May 28, 2026", updatedDate: "Jun 5, 2026", reviewingAuthority: "Super Admin Dashboard", appId: "APP-0482", notes: "Missing Agent ID.", remarks: "Please resubmit with your approved Agent ID." },
];

const NOTIFICATIONS_DATA = [
  { id: 1, icon: "✅", title: "Application Submitted", body: "Your Host application APP-2841 was successfully submitted.", time: "2d ago", read: false },
  { id: 2, icon: "🔍", title: "Under Verification", body: "Your Host application is currently being verified by the Agent team.", time: "1d ago", read: false },
  { id: 3, icon: "❌", title: "Application Rejected", body: "Your Admin application APP-0482 was rejected. Please resubmit with correct details.", time: "12d ago", read: true },
  { id: 4, icon: "📋", title: "Document Required", body: "Please upload your Identity Document to complete your Host application.", time: "3d ago", read: true },
];

const MAIN_TABS = [
  { id: "browse",       label: "Apply",          icon: "💼" },
  { id: "applications", label: "My Applications", icon: "📋" },
  { id: "documents",    label: "Documents",       icon: "📁" },
  { id: "notifications",label: "Alerts",          icon: "🔔" },
  { id: "support",      label: "Support",         icon: "🛟" },
];

/* ─────────────── SHARED ─────────────── */
function SLabel({ label }) {
  return <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", marginBottom: 10, letterSpacing: "0.06em" }}>{label}</div>;
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || "#9CA3AF";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 8, background: `${color}12`, border: `1px solid ${color}30` }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 9, fontWeight: 800, color }}>{status}</span>
    </div>
  );
}

/* ─────────────── WORKFLOW VISUAL ─────────────── */
function WorkflowSteps({ steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "#1F6BFF" : i === steps.length - 1 ? "#10B981" : "#EEF2FF", border: `2px solid ${i === 0 ? "#1F6BFF" : i === steps.length - 1 ? "#10B981" : "#C7D2FE"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: i === 0 || i === steps.length - 1 ? "#fff" : "#6366F1" }}>{i + 1}</div>
            <div style={{ fontSize: 7.5, color: "#9CA3AF", marginTop: 3, maxWidth: 52, lineHeight: 1.2, textAlign: "center" }}>{step}</div>
          </div>
          {i < steps.length - 1 && <div style={{ width: 22, height: 2, background: "#C7D2FE", flexShrink: 0, marginBottom: 18 }} />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────── APPLICATION FORM MODAL ─────────────── */
function ApplicationForm({ role, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const totalSteps = role.docFields.length > 0 ? 3 : 2;
  const [form, setForm] = useState({});
  const [agencySearch, setAgencySearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const mockAgencies = ["StarPro Agency (AGC-001)", "EliteMedia Agency (AGC-002)", "GlobalSound (AGC-003)"];
  const mockAgents = ["Ali Hassan Agent (AGT-001)", "Sara Al-Mana (AGT-002)", "Mohamed Taha (AGT-003)"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#F5F7FA", borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "92vh", overflowY: "auto", paddingBottom: 36 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "12px auto 0" }} />

        {/* Modal Header */}
        <div style={{ background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)", padding: "16px 20px 14px", borderRadius: "22px 22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{role.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>Apply for {role.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Step {step} of {totalSteps} · {role.dept}</div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 13, color: "#fff" }}>✕</button>
          </div>
          {/* Steps bar */}
          <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: step > i ? "#fff" : "rgba(255,255,255,0.25)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Step 1: Form Fields */}
          {step === 1 && (
            <>
              <SLabel label="📝 PERSONAL INFORMATION" />
              {role.formFields.map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 5 }}>{f.label}</div>
                  <textarea rows={f.rows}
                    value={form[f.key] || ""} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 13px", borderRadius: 11, background: "#fff", border: "1px solid #E9ECF0", color: "#0D1B3E", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              ))}

              {/* Agency/Agent Searchable Selector for Host only */}
              {role.id === "host" && (
                <>
                  <div style={{ background: "#EEF2FF", borderRadius: 12, padding: "12px 14px", border: "1px solid #C7D2FE" }}>
                    <SLabel label="🏢 SELECT AGENCY (Optional)" />
                    <input value={agencySearch} onChange={e => setAgencySearch(e.target.value)} placeholder="Search approved agencies…"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 10, background: "#fff", border: "1px solid #E9ECF0", color: "#0D1B3E", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                    {agencySearch && (
                      <div style={{ marginTop: 8, background: "#fff", borderRadius: 10, border: "1px solid #E9ECF0", overflow: "hidden" }}>
                        {mockAgencies.filter(a => a.toLowerCase().includes(agencySearch.toLowerCase())).map(a => (
                          <div key={a} onClick={() => { update("agencyId", a); setAgencySearch(""); }}
                            style={{ padding: "9px 13px", fontSize: 12, color: "#0D1B3E", cursor: "pointer", borderBottom: "1px solid #F5F7FA" }}>
                            {a}
                          </div>
                        ))}
                      </div>
                    )}
                    {form.agencyId && <div style={{ marginTop: 6, fontSize: 11, color: "#1F6BFF", fontWeight: 700 }}>Selected: {form.agencyId}</div>}
                  </div>

                  <div style={{ background: "#EEF2FF", borderRadius: 12, padding: "12px 14px", border: "1px solid #C7D2FE" }}>
                    <SLabel label="🤝 SELECT AGENT (Optional)" />
                    <input value={agentSearch} onChange={e => setAgentSearch(e.target.value)} placeholder="Search approved agents…"
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 10, background: "#fff", border: "1px solid #E9ECF0", color: "#0D1B3E", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                    {agentSearch && (
                      <div style={{ marginTop: 8, background: "#fff", borderRadius: 10, border: "1px solid #E9ECF0", overflow: "hidden" }}>
                        {mockAgents.filter(a => a.toLowerCase().includes(agentSearch.toLowerCase())).map(a => (
                          <div key={a} onClick={() => { update("agentId", a); setAgentSearch(""); }}
                            style={{ padding: "9px 13px", fontSize: 12, color: "#0D1B3E", cursor: "pointer", borderBottom: "1px solid #F5F7FA" }}>
                            {a}
                          </div>
                        ))}
                      </div>
                    )}
                    {form.agentId && <div style={{ marginTop: 6, fontSize: 11, color: "#1F6BFF", fontWeight: 700 }}>Selected: {form.agentId}</div>}
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 2: Workflow & Eligibility Review */}
          {step === 2 && (
            <>
              <div style={{ background: "#fff", borderRadius: 14, padding: "13px", border: "1px solid #F0F0F8" }}>
                <SLabel label="✅ ELIGIBILITY" />
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{role.eligibility}</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "13px", border: "1px solid #F0F0F8" }}>
                <SLabel label="🔄 APPLICATION WORKFLOW" />
                <WorkflowSteps steps={role.workflow} />
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "13px", border: "1px solid #F0F0F8" }}>
                <SLabel label="🏢 REVIEWING AUTHORITY" />
                <div style={{ fontSize: 12, fontWeight: 800, color: "#1F6BFF" }}>{role.reviewsAt}</div>
              </div>
              <div style={{ background: "#EFF6FF", borderRadius: 14, padding: "13px", border: "1px solid #BFDBFE" }}>
                <SLabel label="🎉 AFTER APPROVAL" />
                {role.afterApproval.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
                    <span style={{ color: "#10B981", fontWeight: 800, fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "13px", border: "1px solid #F0F0F8" }}>
                <SLabel label="📊 APPLICATION STATUS TYPES" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {STATUS_TYPES.map(s => (
                    <div key={s} style={{ padding: "3px 8px", borderRadius: 7, background: `${STATUS_COLORS[s]}12`, border: `1px solid ${STATUS_COLORS[s]}30` }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: STATUS_COLORS[s] }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3: Documents (if role has doc fields) */}
          {step === 3 && role.docFields.length > 0 && (
            <>
              <SLabel label="📁 REQUIRED DOCUMENTS" />
              {role.docFields.map(doc => (
                <div key={doc.key} style={{ background: "#fff", borderRadius: 14, padding: "13px 16px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 2 }}>{doc.name}</div>
                    <div style={{ fontSize: 9, color: doc.required ? "#EF4444" : "#9CA3AF" }}>{doc.required ? "Required" : "Optional"}</div>
                  </div>
                  <motion.button whileTap={{ scale: 0.92 }}
                    style={{ padding: "7px 12px", borderRadius: 10, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#1F6BFF,#6366F1)", color: "#fff" }}>
                    Upload
                  </motion.button>
                </div>
              ))}
            </>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {step > 1 && (
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: "12px", borderRadius: 13, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, background: "#F3F4F6", color: "#374151" }}>
                ← Back
              </motion.button>
            )}
            {step < totalSteps ? (
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => setStep(s => s + 1)}
                style={{ flex: 1, padding: "12px", borderRadius: 13, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#1F6BFF,#6366F1)", boxShadow: "0 4px 14px rgba(31,107,255,0.3)" }}>
                Next →
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => { onSubmit(); onClose(); }}
                style={{ flex: 1, padding: "12px", borderRadius: 13, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}>
                ✅ Submit Application
              </motion.button>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 11, color: "#9CA3AF", cursor: "pointer" }}>Save as Draft</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── ROLE DETAIL SHEET ─────────────── */
function RoleDetailSheet({ role, onClose, onApply, applied }) {
  const [tab, setTab] = useState("overview");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#F5F7FA", borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "86vh", overflowY: "auto", paddingBottom: 32 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "12px auto 0" }} />
        <div style={{ background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)", padding: "18px 20px 0", borderRadius: "22px 22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{role.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{role.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>{role.dept}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: `${role.tagColor}30`, color: role.tagColor }}>{role.tag}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", overflowX: "auto" }}>
            {["overview", "workflow", "requirements"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flexShrink: 0, padding: "9px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "capitalize", color: tab === t ? "#fff" : "rgba(255,255,255,0.45)", borderBottom: tab === t ? "2px solid #fff" : "2px solid transparent" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="📋 ROLE OVERVIEW" />
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.8 }}>{role.desc}</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="✅ ELIGIBILITY" />
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{role.eligibility}</div>
              </div>
              <div style={{ background: "#EFF6FF", borderRadius: 14, padding: 14, border: "1px solid #BFDBFE" }}>
                <SLabel label="🎉 AFTER APPROVAL" />
                {role.afterApproval?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
                    <span style={{ color: "#10B981", fontWeight: 800 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "workflow" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="🔄 APPLICATION WORKFLOW" />
                <WorkflowSteps steps={role.workflow} />
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="🏢 REVIEWING AUTHORITY" />
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1F6BFF" }}>{role.reviewsAt}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>Your application will be reviewed and processed by the above authority.</div>
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="⚡ ACTIONS AVAILABLE" />
                {["Approve", "Reject", "Delay"].map(a => (
                  <div key={a} style={{ display: "flex", gap: 8, padding: "4px 0" }}>
                    <span style={{ fontSize: 10, color: a === "Approve" ? "#10B981" : a === "Reject" ? "#EF4444" : "#F59E0B" }}>●</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "requirements" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                <SLabel label="📝 FORM FIELDS REQUIRED" />
                {role.formFields.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < role.formFields.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                    <span style={{ color: "#1F6BFF", fontSize: 12 }}>▸</span>
                    <span style={{ fontSize: 12, color: "#374151" }}>{f.label}</span>
                  </div>
                ))}
              </div>
              {role.docFields.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
                  <SLabel label="📁 DOCUMENTS REQUIRED" />
                  {role.docFields.map((d, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < role.docFields.length - 1 ? "1px solid #F5F7FA" : "none" }}>
                      <span style={{ color: d.required ? "#EF4444" : "#9CA3AF", fontSize: 12 }}>●</span>
                      <span style={{ fontSize: 12, color: "#374151" }}>{d.name}</span>
                      <span style={{ fontSize: 9, color: d.required ? "#EF4444" : "#9CA3AF", marginLeft: "auto" }}>{d.required ? "Required" : "Optional"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <motion.button whileTap={{ scale: 0.94 }} onClick={onClose}
              style={{ flex: 1, padding: "12px", borderRadius: 13, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 13, background: "#F3F4F6", color: "#374151" }}>
              Close
            </motion.button>
            <motion.button whileTap={{ scale: 0.94 }} onClick={onApply} disabled={applied}
              style={{ flex: 2, padding: "12px", borderRadius: 13, border: "none", cursor: applied ? "default" : "pointer", fontWeight: 800, fontSize: 13, color: "#fff", background: applied ? "#D1D5DB" : "linear-gradient(135deg,#1F6BFF,#6366F1)", boxShadow: applied ? "none" : "0 4px 14px rgba(31,107,255,0.3)" }}>
              {applied ? "✅ Applied" : "Apply Now"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── BROWSE / APPLY TAB ─────────────── */
function BrowseTab({ applied, onApply }) {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = ROLES.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { l: "Open Roles",   v: ROLES.length,  icon: "💼", color: "#1F6BFF" },
          { l: "Applied",      v: applied.size,  icon: "📋", color: "#10B981" },
          { l: "Departments",  v: 9,             icon: "🏢", color: "#A855F7" },
        ].map(s => (
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles…"
          style={{ border: "none", outline: "none", fontSize: 13, color: "#0D1B3E", background: "transparent", flex: 1 }} />
        {search && <X size={13} color="#9CA3AF" onClick={() => setSearch("")} style={{ cursor: "pointer" }} />}
      </div>

      {/* System Features Banner */}
      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 16, padding: "13px 16px", border: "1px solid #C7D2FE" }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: "#1F6BFF", marginBottom: 4 }}>🤖 Smart Application System</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {["Auto ID Generation", "Smart Routing", "Role Assignment", "Application Tracking", "Audit Logs"].map(f => (
            <span key={f} style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 7, background: "rgba(31,107,255,0.1)", color: "#1F6BFF" }}>{f}</span>
          ))}
        </div>
      </div>

      <SLabel label={`💼 ${filtered.length} ROLES AVAILABLE`} />

      {/* Role Cards */}
      {filtered.map((role, i) => (
        <motion.div key={role.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
          style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ height: 3, background: `linear-gradient(90deg,${role.color},${role.color}44)` }} />
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${role.color}15`, border: `1px solid ${role.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{role.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{role.title}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 7, background: `${role.tagColor}12`, color: role.tagColor }}>{role.tag}</span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 3 }}>{role.dept}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>Eligibility: {role.eligibility}</div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "10px 0 8px", lineHeight: 1.6 }}>{role.desc}</p>

            {/* Workflow mini */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, overflowX: "auto" }}>
              {role.workflow.map((w, wi) => (
                <div key={wi} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <div style={{ padding: "3px 8px", borderRadius: 8, background: wi === role.workflow.length - 1 ? "#EFF6FF" : "#F5F7FA", border: `1px solid ${wi === role.workflow.length - 1 ? "#BFDBFE" : "#E9ECF0"}` }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: wi === role.workflow.length - 1 ? "#1F6BFF" : "#6B7280" }}>{w}</span>
                  </div>
                  {wi < role.workflow.length - 1 && <span style={{ fontSize: 10, color: "#C4C9D4" }}>→</span>}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setSelectedRole(role)}
                style={{ flex: 1, padding: "8px", borderRadius: 11, fontSize: 11, fontWeight: 800, border: "1px solid #E9ECF0", background: "#F5F7FA", color: "#374151", cursor: "pointer" }}>
                View Details
              </motion.button>
              <motion.button whileTap={{ scale: 0.92 }}
                onClick={() => { if (!applied.has(role.id)) { setSelectedRole(role); setShowForm(true); } }}
                disabled={applied.has(role.id)}
                style={{ flex: 2, padding: "8px", borderRadius: 11, fontSize: 11, fontWeight: 800, border: "none", cursor: applied.has(role.id) ? "default" : "pointer", background: applied.has(role.id) ? "#D1D5DB" : "linear-gradient(135deg,#1F6BFF,#6366F1)", color: applied.has(role.id) ? "#9CA3AF" : "#fff", boxShadow: applied.has(role.id) ? "none" : "0 3px 10px rgba(31,107,255,0.25)" }}>
                {applied.has(role.id) ? "✅ Applied" : "Apply Now"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedRole && !showForm && (
          <RoleDetailSheet role={selectedRole} onClose={() => setSelectedRole(null)}
            onApply={() => setShowForm(true)} applied={applied.has(selectedRole.id)} />
        )}
        {showForm && selectedRole && (
          <ApplicationForm role={selectedRole}
            onClose={() => { setShowForm(false); setSelectedRole(null); }}
            onSubmit={() => onApply(selectedRole.id)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── APPLICATION DETAIL SHEET ─────────────── */
function ApplicationDetailSheet({ app, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "#F5F7FA", borderRadius: "22px 22px 0 0", width: "100%", maxHeight: "80vh", overflowY: "auto", paddingBottom: 32 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E5E7EB", margin: "12px auto 0" }} />
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{app.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>{app.title} Application</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{app.appId}</div>
            </div>
            <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer" }}>✕</button>
          </div>

          {[
            { l: "Application ID",       v: app.appId },
            { l: "Submission Date",      v: app.submittedDate },
            { l: "Last Updated",         v: app.updatedDate },
            { l: "Reviewing Authority",  v: app.reviewingAuthority },
            { l: "Current Status",       v: null, badge: app.status },
          ].map(row => (
            <div key={row.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F0F0F8" }}>
              <span style={{ fontSize: 11, color: "#6B7280" }}>{row.l}</span>
              {row.badge ? <StatusBadge status={row.badge} /> : <span style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{row.v}</span>}
            </div>
          ))}

          {app.notes && (
            <div style={{ marginTop: 12, background: "#EFF6FF", borderRadius: 12, padding: "11px 13px", border: "1px solid #BFDBFE" }}>
              <SLabel label="📝 NOTES" />
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{app.notes}</div>
            </div>
          )}
          {app.remarks && (
            <div style={{ marginTop: 10, background: "#FEF2F2", borderRadius: 12, padding: "11px 13px", border: "1px solid #FECACA" }}>
              <SLabel label="⚠️ REMARKS" />
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{app.remarks}</div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── MY APPLICATIONS TAB ─────────────── */
function ApplicationsTab() {
  const [filter, setFilter] = useState("all");
  const [detailApp, setDetailApp] = useState(null);
  const filters = ["all", ...STATUS_TYPES];
  const visible = filter === "all" ? MY_APPLICATIONS : MY_APPLICATIONS.filter(a => a.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4 }}>
        {["all", "Pending Review", "Under Verification", "Approved", "Rejected", "Delayed"].map(f => (
          <motion.button key={f} whileTap={{ scale: 0.92 }} onClick={() => setFilter(f)}
            style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 16, fontSize: 9, fontWeight: 800, border: "none", cursor: "pointer", background: filter === f ? "linear-gradient(135deg,#1F6BFF,#6366F1)" : "#fff", color: filter === f ? "#fff" : "#6B7280", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {f === "all" ? "All" : f}
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
        {[
          { l: "Total", v: MY_APPLICATIONS.length, color: "#1F6BFF" },
          { l: "Approved", v: MY_APPLICATIONS.filter(a => a.status === "Approved").length, color: "#10B981" },
          { l: "Pending", v: MY_APPLICATIONS.filter(a => ["Pending Review", "Under Verification"].includes(a.status)).length, color: "#F59E0B" },
        ].map(s => (
          <div key={s.l} style={{ background: "#fff", borderRadius: 13, padding: "10px", textAlign: "center", border: "1px solid #F0F0F8" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: s.color }}>{s.v}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {visible.map((app, i) => (
        <motion.div key={app.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{app.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>{app.title}</div>
                  <span style={{ fontSize: 9, color: "#C4C9D4" }}>{app.appId}</span>
                </div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 5 }}>{app.dept} · {app.reviewingAuthority}</div>
                <StatusBadge status={app.status} />
              </div>
            </div>
            {/* Approval history bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {["Submitted", "Pending Review", "Under Verification", "Decision"].map((s, si) => {
                  const idx = app.status === "Under Verification" ? 2 : app.status === "Approved" ? 3 : app.status === "Rejected" ? 2 : 1;
                  const color = STATUS_COLORS[app.status] || "#1F6BFF";
                  return <div key={si} style={{ flex: 1, height: 4, borderRadius: 2, background: si <= idx ? color : "#E5E7EB", transition: "background 0.3s" }} />;
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                <span style={{ fontSize: 9, color: "#C4C9D4" }}>Submitted: {app.submittedDate}</span>
                <span style={{ fontSize: 9, color: "#C4C9D4" }}>Updated: {app.updatedDate}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setDetailApp(app)}
                style={{ flex: 1, padding: "8px", borderRadius: 10, fontSize: 10, fontWeight: 800, border: "1px solid #E9ECF0", background: "#F5F7FA", color: "#374151", cursor: "pointer" }}>
                View Details
              </motion.button>
              {app.status === "Resubmission Required" && (
                <motion.button whileTap={{ scale: 0.92 }}
                  style={{ flex: 2, padding: "8px", borderRadius: 10, fontSize: 10, fontWeight: 800, border: "none", background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", cursor: "pointer" }}>
                  🔄 Resubmit
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {visible.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 13 }}>No applications in this category.</div>
      )}

      <AnimatePresence>
        {detailApp && <ApplicationDetailSheet app={detailApp} onClose={() => setDetailApp(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── DOCUMENTS TAB ─────────────── */
function DocumentsTab() {
  const docs = [
    { name: "Profile Photo",            icon: "🖼️", status: "uploaded", color: "#10B981" },
    { name: "National ID (Front)",      icon: "🪪", status: "uploaded", color: "#10B981" },
    { name: "National ID (Back)",       icon: "🪪", status: "missing",  color: "#EF4444" },
    { name: "Selfie with ID",           icon: "🤳", status: "missing",  color: "#EF4444" },
    { name: "Experience Documents",     icon: "📋", status: "optional", color: "#9CA3AF" },
    { name: "Supporting Documents",     icon: "📎", status: "optional", color: "#9CA3AF" },
  ];
  const uploaded = docs.filter(d => d.status === "uploaded").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid #F0F0F8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>Document Completion</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: "#1F6BFF" }}>{uploaded}/{docs.filter(d => d.status !== "optional").length}</span>
        </div>
        <div style={{ height: 7, borderRadius: 4, background: "#F0F0F8", overflow: "hidden" }}>
          <div style={{ width: `${(uploaded / docs.filter(d => d.status !== "optional").length) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#1F6BFF,#10B981)", transition: "width 0.5s" }} />
        </div>
      </div>
      {docs.map((doc, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "13px 16px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${doc.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{doc.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E", marginBottom: 3 }}>{doc.name}</div>
            <StatusBadge status={doc.status === "uploaded" ? "✅ Uploaded" : doc.status === "optional" ? "Optional" : "⚠️ Required"} />
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
  const [notifs, setNotifs] = useState(NOTIFICATIONS_DATA);
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SLabel label={`🔔 ${notifs.filter(n => !n.read).length} UNREAD`} />
        <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))} style={{ background: "none", border: "none", fontSize: 11, color: "#1F6BFF", fontWeight: 700, cursor: "pointer" }}>Mark all read</button>
      </div>
      {notifs.map((n, i) => (
        <motion.div key={n.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          onClick={() => markRead(n.id)}
          style={{ background: n.read ? "#fff" : "#EFF6FF", borderRadius: 14, padding: "13px 16px", border: `1px solid ${n.read ? "#F0F0F8" : "#BFDBFE"}`, cursor: "pointer" }}>
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
    { icon: "📝", label: "Application Support",   desc: "Help with submitting your application",     color: "#1F6BFF" },
    { icon: "🪪", label: "Document Verification", desc: "Questions about document requirements",     color: "#A855F7" },
    { icon: "🔄", label: "Application Status",    desc: "Check the status of your application",      color: "#10B981" },
    { icon: "⚠️", label: "Rejection Appeal",      desc: "Appeal a rejected application",             color: "#EF4444" },
    { icon: "🔒", label: "Role Access Issues",    desc: "Trouble accessing your approved role",      color: "#F59E0B" },
    { icon: "📞", label: "Contact HR Team",       desc: "Direct line to the HR department",          color: "#0EA5E9" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "linear-gradient(135deg,#EEF2FF,#E0E7FF)", borderRadius: 16, padding: 14, border: "1px solid #C7D2FE", marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 4 }}>🛟 Application Support Center</div>
        <p style={{ fontSize: 11, color: "#4B5563", lineHeight: 1.7 }}>Our team is available to assist you throughout every step of the application, verification, and role activation process.</p>
      </div>
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "13px 16px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
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
  const unread = NOTIFICATIONS_DATA.filter(n => !n.read).length;
  const handleApply = (roleId) => setApplied(prev => new Set([...prev, roleId]));

  const CONTENT = {
    browse:        <BrowseTab applied={applied} onApply={handleApply} />,
    applications:  <ApplicationsTab />,
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
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>VYRO Role Application Portal</div>
          </div>
          {unread > 0 && (
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setActiveTab("notifications")}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={16} color="#1F6BFF" />
              </div>
              <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "#fff", fontWeight: 900 }}>{unread}</span>
              </div>
            </div>
          )}
        </div>
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