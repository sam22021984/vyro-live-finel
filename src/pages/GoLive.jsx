/**
 * GoLive — Enterprise Live Room Creation Screen
 * Flutter: lib/features/host/screens/go_live_screen.dart
 */
import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, BookOpen, Radio, Camera, X, Sparkles,
  Globe, Lock, Crown, Users, UserCheck, UserPlus, KeyRound,
  Coins, Info, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";

/* ─── Constants ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: "music",         label: "Music",              icon: "🎵" },
  { value: "talk",          label: "Talk Show",          icon: "🎙️" },
  { value: "podcast",       label: "Podcast",            icon: "🎧" },
  { value: "entertainment", label: "Entertainment",      icon: "🎭" },
  { value: "gaming",        label: "Gaming Discussion",  icon: "🎮" },
  { value: "business",      label: "Business",           icon: "💼" },
  { value: "education",     label: "Education",          icon: "📚" },
  { value: "technology",    label: "Technology",         icon: "💻" },
  { value: "lifestyle",     label: "Lifestyle",          icon: "✨" },
  { value: "sports",        label: "Sports",             icon: "⚽" },
  { value: "news",          label: "News",               icon: "📰" },
  { value: "community",     label: "Community",          icon: "🌍" },
  { value: "religion",      label: "Religion",           icon: "🕊️" },
  { value: "health",        label: "Health",             icon: "💚" },
  { value: "other",         label: "Other",              icon: "💫" },
];

const LANGUAGES = ["English","Arabic","Spanish","French","Portuguese","Hindi","Indonesian","Turkish","Russian","Japanese","Korean","German","Italian","Chinese","Malay","Urdu","Bengali","Vietnamese","Thai","Polish"];

const ACCESS_OPTIONS = [
  { value: "public",    label: "Public Room",       icon: Globe,    color: "#00C2B8", desc: "Anyone can join" },
  { value: "private",   label: "Private Room",      icon: Lock,     color: "#9333EA", desc: "Invite only" },
  { value: "vip_only",  label: "VIP Only",          icon: Crown,    color: "#FFD700", desc: "VIP members only" },
  { value: "followers", label: "Followers Only",    icon: Users,    color: "#3B82F6", desc: "Your followers" },
  { value: "friends",   label: "Friends Only",      icon: UserCheck,color: "#10B981", desc: "Mutual friends" },
  { value: "invite",    label: "Invite Only",       icon: UserPlus, color: "#F59E0B", desc: "Via invitation" },
  { value: "password",  label: "Password Protected",icon: KeyRound, color: "#EC4899", desc: "Host sets password" },
];

const TITLE_SUGGESTIONS = [
  "Late Night Vibes 🌙", "Morning Motivation ☀️", "Chill Music Session 🎵",
  "Open Talk 💬", "Q&A with Me 🎙️", "Story Time 📖", "Music & Mood 🎶",
];

const WELCOME_EMOJIS = ["👋","🔥","💜","🎵","✨","🎉","💎","👑"];

/* ─── Section wrapper ────────────────────────────────────────────── */
function Section({ title, children, accent = "#9333EA" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 18, padding: "16px",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 16, borderRadius: 2, background: accent }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.02em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ─── Field wrapper ──────────────────────────────────────────────── */
function Field({ label, required, counter, max, value, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
          {label} {required && <span style={{ color: "#EC4899" }}>*</span>}
        </label>
        {counter && max && (
          <span style={{ fontSize: 10, color: value?.length > max * 0.9 ? "#EF4444" : "rgba(255,255,255,0.3)" }}>
            {value?.length || 0}/{max}
          </span>
        )}
      </div>
      {children}
      {hint && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
  padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

/* ─── Help Sheet ─────────────────────────────────────────────────── */
function HelpSheet({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "#12122A", borderRadius: "22px 22px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "20px 20px 40px", maxHeight: "80vh", overflowY: "auto",
        }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>📋 Room Creation Guide</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} color="rgba(255,255,255,0.5)" />
          </button>
        </div>
        {[
          { icon: "🖼️", title: "Cover Photo", body: "Use a clear, HD image (JPG/PNG/WEBP). Blurry or low-quality covers may be rejected." },
          { icon: "📝", title: "Room Title", body: "Keep it descriptive and unique. Max 60 characters. Avoid repeated or misleading titles." },
          { icon: "🔒", title: "Room Access", body: "Public rooms are discoverable. Private/Password rooms are unlisted. VIP rooms require active VIP membership to enter." },
          { icon: "🪙", title: "Paid Entry", body: "Set a fair entry fee between 10–10,000 coins. You earn diamonds based on coins collected." },
          { icon: "⚠️", title: "Community Guidelines", body: "No adult content, hate speech, violence, or spam. Violations result in immediate room closure and account action." },
        ].map(({ icon, title, body }) => (
          <div key={title} style={{
            display: "flex", gap: 12, marginBottom: 14,
            background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px",
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{body}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function GoLive() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "", description: "", welcome_message: "",
    category: "", language: "English",
    room_type: "public", entry_price_coins: 0,
    cover_image_url: "", password: "", tags: [],
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAccessInfo, setShowAccessInfo] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  /* Cover upload */
  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);
    setUploadingCover(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("cover_image_url", file_url);
    } catch {
      toast.error("Cover upload failed");
    }
    setUploadingCover(false);
  };

  /* AI description assist */
  const aiAssist = async () => {
    if (!form.title) { toast.error("Enter a title first"); return; }
    setAiLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a short, engaging live room description (max 120 chars) for a room titled: "${form.title}". Category: ${form.category || "general"}. Return only the description text.`,
      });
      set("description", result.slice(0, 120));
    } catch {
      toast.error("AI assist failed");
    }
    setAiLoading(false);
  };

  /* Validation */
  const titleOk = form.title.trim().length >= 3;
  const categoryOk = !!form.category;
  const paidOk = form.room_type !== "paid" || (form.entry_price_coins >= 10 && form.entry_price_coins <= 10000);
  const passwordOk = form.room_type !== "password" || form.password.trim().length >= 4;
  const canGoLive = titleOk && categoryOk && paidOk && passwordOk;

  const estimatedDiamonds = form.room_type === "paid"
    ? Math.round(form.entry_price_coins * 0.7)
    : 0;

  const startMutation = useMutation({
    mutationFn: () => base44.entities.LiveRoom.create({
      ...form,
      host_id: user.id,
      status: "live",
      started_at: new Date().toISOString(),
      current_listeners: 0,
      peak_listeners: 0,
      total_diamonds_earned: 0,
      total_gifts_received: 0,
    }),
    onSuccess: (room) => {
      toast.success("You're live! 🎙️");
      qc.invalidateQueries(["live-rooms"]);
      navigate(`/live-room`, { state: { room } });
    },
    onError: () => toast.error("Failed to start stream"),
  });

  const saveDraft = () => {
    localStorage.setItem("golive_draft", JSON.stringify(form));
    toast.success("Draft saved ✓");
  };

  /* Load draft on mount */
  useState(() => {
    const draft = localStorage.getItem("golive_draft");
    if (draft) { try { setForm(JSON.parse(draft)); } catch {} }
  });

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0D0D1A",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        background: "rgba(13,13,26,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
          <ChevronLeft size={18} color="#fff" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>Create Live Room</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Fill in all required fields to go live</div>
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={saveDraft}
          style={{
            padding: "7px 14px", borderRadius: 20,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
          Save Draft
        </motion.button>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowHelp(true)}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
          <BookOpen size={16} color="rgba(255,255,255,0.7)" />
        </motion.button>
      </div>

      {/* ── Scrollable Body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 100px" }}>

        {/* ── Cover Photo ── */}
        <Section title="Room Cover Photo" accent="#3B82F6">
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleCover} style={{ display: "none" }} />
          {coverPreview ? (
            <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 10 }}>
              <img src={coverPreview} alt="cover"
                style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              {uploadingCover && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.5)",
                }}>
                  <div style={{ width: 28, height: 28, border: "3px solid #9333EA", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
              )}
              <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 6 }}>
                <button onClick={() => fileRef.current?.click()}
                  style={{
                    background: "rgba(0,0,0,0.65)", border: "none", borderRadius: 8,
                    padding: "5px 10px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
                  }}>✏️ Change</button>
                <button onClick={() => { setCoverPreview(null); set("cover_image_url", ""); }}
                  style={{
                    background: "rgba(220,38,38,0.75)", border: "none", borderRadius: 8,
                    padding: "5px 8px", cursor: "pointer",
                  }}>
                  <X size={12} color="#fff" />
                </button>
              </div>
            </div>
          ) : (
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => fileRef.current?.click()}
              style={{
                width: "100%", height: 140, borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "2px dashed rgba(59,130,246,0.4)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 8, cursor: "pointer",
              }}>
              <Camera size={28} color="rgba(59,130,246,0.7)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
                Upload Cover Photo
              </span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>JPG · PNG · WEBP · HD recommended</span>
            </motion.button>
          )}
        </Section>

        {/* ── Room Information ── */}
        <Section title="Room Information" accent="#9333EA">
          {/* Title */}
          <Field label="Room Title" required counter max={60} value={form.title}>
            <div style={{ position: "relative" }}>
              <input
                value={form.title}
                onChange={e => { set("title", e.target.value.slice(0, 60)); setShowSuggestions(false); }}
                onFocus={() => !form.title && setShowSuggestions(true)}
                placeholder="What's your stream about?"
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              {form.title.length >= 3 && (
                <CheckCircle2 size={16} color="#00C2B8"
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} />
              )}
            </div>
            <AnimatePresence>
              {showSuggestions && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    background: "#1a1a35", border: "1px solid rgba(147,51,234,0.3)", borderRadius: 12,
                    overflow: "hidden", marginTop: 6,
                  }}>
                  <div style={{ padding: "8px 12px", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>
                    ✨ SUGGESTIONS
                  </div>
                  {TITLE_SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => { set("title", s); setShowSuggestions(false); }}
                      style={{
                        width: "100%", padding: "9px 14px", background: "none", border: "none",
                        cursor: "pointer", textAlign: "left", color: "rgba(255,255,255,0.8)",
                        fontSize: 12, fontWeight: 600, borderTop: "1px solid rgba(255,255,255,0.04)",
                      }}>{s}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Field>

          {/* Description */}
          <Field label="Description" counter max={200} value={form.description}>
            <div style={{ position: "relative" }}>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value.slice(0, 200))}
                placeholder="Tell listeners what to expect..."
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              />
              <motion.button whileTap={{ scale: 0.88 }} onClick={aiAssist}
                disabled={aiLoading}
                style={{
                  position: "absolute", bottom: 8, right: 8,
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 10px", borderRadius: 10,
                  background: "linear-gradient(135deg,#9333EA,#3B82F6)",
                  border: "none", cursor: aiLoading ? "wait" : "pointer",
                  fontSize: 10, fontWeight: 800, color: "#fff",
                }}>
                <Sparkles size={11} />
                {aiLoading ? "Writing..." : "AI Assist"}
              </motion.button>
            </div>
          </Field>

          {/* Welcome Message */}
          <Field label="Welcome Message" hint="Shown to every user when they join">
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                {WELCOME_EMOJIS.map(e => (
                  <button key={e} onClick={() => set("welcome_message", (form.welcome_message || "") + e)}
                    style={{
                      fontSize: 16, background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                      padding: "3px 7px", cursor: "pointer",
                    }}>{e}</button>
                ))}
              </div>
              <input
                value={form.welcome_message}
                onChange={e => set("welcome_message", e.target.value.slice(0, 120))}
                placeholder="Welcome to my room! 👋🔥"
                style={inputStyle}
              />
            </div>
          </Field>
        </Section>

        {/* ── Category ── */}
        <Section title="Category" accent="#F59E0B">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {CATEGORIES.map(cat => (
              <motion.button key={cat.value} whileTap={{ scale: 0.92 }}
                onClick={() => set("category", cat.value)}
                style={{
                  padding: "9px 6px", borderRadius: 12, cursor: "pointer",
                  background: form.category === cat.value ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${form.category === cat.value ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.07)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: form.category === cat.value ? "#F59E0B" : "rgba(255,255,255,0.5)",
                  textAlign: "center", lineHeight: 1.3,
                }}>{cat.label}</span>
              </motion.button>
            ))}
          </div>
          {!categoryOk && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
              <AlertCircle size={12} color="#EF4444" />
              <span style={{ fontSize: 11, color: "#EF4444" }}>Please select a category</span>
            </div>
          )}
        </Section>

        {/* ── Language ── */}
        <Section title="Language" accent="#10B981">
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowLangDropdown(v => !v)}
              style={{
                ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", padding: "11px 14px",
              }}>
              <span style={{ color: "#fff", fontSize: 13 }}>🌐 {form.language}</span>
              <ChevronDown size={16} color="rgba(255,255,255,0.4)"
                style={{ transform: showLangDropdown ? "rotate(180deg)" : "none", transition: "0.2s" }} />
            </button>
            <AnimatePresence>
              {showLangDropdown && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 100,
                    background: "#1a1a35", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14,
                    maxHeight: 200, overflowY: "auto",
                    boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
                  }}>
                  {LANGUAGES.map(lang => (
                    <button key={lang} onClick={() => { set("language", lang); setShowLangDropdown(false); }}
                      style={{
                        width: "100%", padding: "10px 14px", background: lang === form.language ? "rgba(16,185,129,0.12)" : "none",
                        border: "none", cursor: "pointer", textAlign: "left", color: lang === form.language ? "#10B981" : "rgba(255,255,255,0.75)",
                        fontSize: 13, fontWeight: lang === form.language ? 700 : 500,
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}>
                      {lang === form.language ? "✓ " : ""}{lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {["English","Arabic","Spanish","French","Hindi"].map(l => (
              <button key={l} onClick={() => set("language", l)}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: form.language === l ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${form.language === l ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: form.language === l ? "#10B981" : "rgba(255,255,255,0.5)",
                }}>{l}</button>
            ))}
          </div>
        </Section>

        {/* ── Room Access ── */}
        <Section title="Room Access" accent="#EC4899">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ACCESS_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = form.room_type === opt.value;
              return (
                <motion.button key={opt.value} whileTap={{ scale: 0.97 }}
                  onClick={() => set("room_type", opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 14, cursor: "pointer",
                    background: active ? `${opt.color}14` : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${active ? opt.color + "60" : "rgba(255,255,255,0.07)"}`,
                    textAlign: "left",
                  }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: active ? `${opt.color}22` : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} color={active ? opt.color : "rgba(255,255,255,0.4)"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.7)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{opt.desc}</div>
                  </div>
                  {active && (
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: opt.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 10, color: "#fff" }}>✓</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
          {/* Password field */}
          <AnimatePresence>
            {form.room_type === "password" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", marginTop: 10 }}>
                <Field label="Room Password" required hint="Minimum 4 characters">
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    placeholder="Enter room password"
                    style={inputStyle}
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ── Entry Settings ── */}
        <Section title="Entry Settings" accent="#FFD700">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { value: "public", label: "Free Entry", icon: "🎟️", desc: "Everyone joins free" },
              { value: "paid",   label: "Paid Entry",  icon: "🪙", desc: "Coins required" },
            ].map(opt => (
              <motion.button key={opt.value} whileTap={{ scale: 0.94 }}
                onClick={() => set("room_type", opt.value === "public" ? (form.room_type === "paid" ? "public" : form.room_type) : "paid")}
                style={{
                  padding: "14px 10px", borderRadius: 14, cursor: "pointer",
                  background: (opt.value === "paid" ? form.room_type === "paid" : form.room_type !== "paid") ? "rgba(255,215,0,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${(opt.value === "paid" ? form.room_type === "paid" : form.room_type !== "paid") ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                }}>
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{opt.label}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>{opt.desc}</span>
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {form.room_type === "paid" && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Field label="Entry Fee (Coins)" required hint="Min: 10 coins · Max: 10,000 coins">
                  <input
                    type="number" min={10} max={10000}
                    value={form.entry_price_coins || ""}
                    onChange={e => set("entry_price_coins", Math.min(10000, Math.max(0, parseInt(e.target.value) || 0)))}
                    placeholder="e.g. 50"
                    style={inputStyle}
                  />
                </Field>
                {form.entry_price_coins > 0 && (
                  <div style={{
                    background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)",
                    borderRadius: 12, padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Coins size={16} color="#FFD700" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#FFD700" }}>
                        You earn ~{estimatedDiamonds} 💎 per entry
                      </div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                        After 30% platform fee
                      </div>
                    </div>
                  </div>
                )}
                {form.entry_price_coins > 0 && (form.entry_price_coins < 10 || form.entry_price_coins > 10000) && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
                    <AlertCircle size={12} color="#EF4444" />
                    <span style={{ fontSize: 11, color: "#EF4444" }}>Fee must be between 10 and 10,000 coins</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* ── Validation Summary ── */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "12px 14px", marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
            CHECKLIST
          </div>
          {[
            { label: "Room title (min. 3 chars)", ok: titleOk },
            { label: "Category selected", ok: categoryOk },
            { label: "Entry fee valid", ok: paidOk },
            { label: "Password set (if required)", ok: passwordOk },
          ].map(({ label, ok }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              {ok
                ? <CheckCircle2 size={14} color="#00C2B8" />
                : <AlertCircle size={14} color="rgba(255,255,255,0.2)" />}
              <span style={{ fontSize: 12, color: ok ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky Go Live Button ── */}
      <div style={{
        position: "sticky", bottom: 0, padding: "12px 14px 20px",
        background: "linear-gradient(to top, #0D0D1A 80%, transparent)",
        zIndex: 40,
      }}>
        <motion.button
          whileTap={canGoLive ? { scale: 0.96 } : {}}
          onClick={() => canGoLive && !startMutation.isPending && startMutation.mutate()}
          style={{
            width: "100%", height: 54, borderRadius: 18,
            background: canGoLive
              ? "linear-gradient(135deg,#9333EA,#3B82F6,#EC4899)"
              : "rgba(255,255,255,0.07)",
            border: "none",
            cursor: canGoLive ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: canGoLive ? "0 8px 32px rgba(147,51,234,0.45)" : "none",
            transition: "all 0.3s",
          }}>
          <Radio size={20} color={canGoLive ? "#fff" : "rgba(255,255,255,0.25)"} />
          <span style={{
            fontSize: 15, fontWeight: 900,
            color: canGoLive ? "#fff" : "rgba(255,255,255,0.3)",
            letterSpacing: "0.04em",
          }}>
            {startMutation.isPending ? "Starting Stream..." : canGoLive ? "🔴 Go Live Now" : "Complete Required Fields"}
          </span>
        </motion.button>
      </div>

      {/* Help Sheet */}
      <AnimatePresence>
        {showHelp && <HelpSheet onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}