/**
 * GoLive — Enterprise Live Room Creation Screen
 * Flutter: lib/features/host/screens/go_live_screen.dart
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, HelpCircle, BookmarkPlus, Camera, Radio,
  ChevronDown, Lock, Globe, Users, Star, UserCheck, Mail, KeyRound,
  Coins, Sparkles, Info, X, Tag,
} from "lucide-react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "music",         icon: "🎵", label: "Music" },
  { value: "talk",          icon: "🎙️", label: "Talk Show" },
  { value: "podcast",       icon: "🎧", label: "Podcast" },
  { value: "entertainment", icon: "🎭", label: "Entertainment" },
  { value: "gaming",        icon: "🎮", label: "Gaming Discussion" },
  { value: "business",      icon: "💼", label: "Business" },
  { value: "education",     icon: "📚", label: "Education" },
  { value: "technology",    icon: "💻", label: "Technology" },
  { value: "lifestyle",     icon: "🌟", label: "Lifestyle" },
  { value: "sports",        icon: "⚽", label: "Sports" },
  { value: "news",          icon: "📰", label: "News" },
  { value: "community",     icon: "🤝", label: "Community" },
  { value: "religion",      icon: "🕌", label: "Religion" },
  { value: "health",        icon: "❤️", label: "Health" },
  { value: "other",         icon: "✨", label: "Other" },
];

const LANGUAGES = [
  "English","Arabic","Spanish","French","Portuguese","Turkish","Russian",
  "Hindi","Indonesian","Malay","Thai","Vietnamese","Korean","Japanese","Chinese",
];

const ACCESS_OPTIONS = [
  { value: "public",    icon: Globe,     label: "Public",           desc: "Anyone can join", color: "#00C2B8" },
  { value: "private",   icon: Lock,      label: "Private",          desc: "Invite only",     color: "#9333EA" },
  { value: "vip_only",  icon: Star,      label: "VIP Only",         desc: "VIP members only",color: "#FFD700" },
  { value: "followers", icon: Users,     label: "Followers Only",   desc: "Followers only",  color: "#3B82F6" },
  { value: "friends",   icon: UserCheck, label: "Friends Only",     desc: "Friends only",    color: "#EC4899" },
  { value: "invite",    icon: Mail,      label: "Invite Only",      desc: "By invitation",   color: "#F97316" },
  { value: "password",  icon: KeyRound,  label: "Password",         desc: "Set a password",  color: "#EF4444" },
];

const TITLE_SUGGESTIONS = [
  "Late Night Vibes 🌙", "Morning Music ☀️", "Story Time 📖",
  "Chill & Chat 💬", "Deep Talk Tonight 🎙️", "Music Session 🎵",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, padding: "16px",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ label, required, count, max }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
        {label}{required && <span style={{ color: "#EC4899", marginLeft: 3 }}>*</span>}
      </span>
      {max !== undefined && (
        <span style={{ fontSize: 10, color: count > max * 0.9 ? "#EC4899" : "rgba(255,255,255,0.3)" }}>
          {count}/{max}
        </span>
      )}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, multiline, rows = 3 }) {
  const base = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
    padding: "11px 14px", color: "#fff", fontSize: 13,
    outline: "none", fontFamily: "inherit", lineHeight: 1.6,
    boxSizing: "border-box",
  };
  if (multiline) return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      rows={rows} style={{ ...base, resize: "none" }} />
  );
  return <input value={value} onChange={onChange} placeholder={placeholder} style={base} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GoLive() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [coverPreview, setCoverPreview] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: "", description: "", welcome_message: "",
    category: "", language: "English",
    room_type: "public", password: "",
    entry_type: "free", entry_price_coins: 0,
    tags: [],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Validation
  const isValid = form.title.trim().length >= 3 && form.category;

  // Cover upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
    setCoverUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setCoverPreview(file_url);
    } finally {
      setCoverUploading(false);
    }
  };

  // Tags
  const addTag = () => {
    const t = tagInput.trim();
    if (t && form.tags.length < 5 && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
      setTagInput("");
    }
  };

  // Earnings preview
  const earningsPreview = form.entry_type === "paid" && form.entry_price_coins > 0
    ? Math.floor(form.entry_price_coins * 0.7) : null;

  // Start Live
  const startMutation = useMutation({
    mutationFn: () => base44.entities.LiveRoom.create({
      host_id: user.id,
      title: form.title,
      description: form.description,
      welcome_message: form.welcome_message,
      cover_image_url: coverPreview || "",
      category: form.category,
      language: form.language,
      room_type: form.room_type,
      entry_price_coins: form.entry_type === "paid" ? form.entry_price_coins : 0,
      tags: form.tags,
      status: "live",
      started_at: new Date().toISOString(),
      current_listeners: 0, peak_listeners: 0,
      total_diamonds_earned: 0, total_gifts_received: 0,
    }),
    onSuccess: (room) => {
      toast.success("You're live! 🎙️");
      qc.invalidateQueries(["live-rooms"]);
      navigate("/live-room", { state: { room } });
    },
    onError: () => toast.error("Failed to start stream"),
  });

  return (
    <div style={{
      minHeight: "100dvh", background: "#0B0B1A",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        background: "rgba(11,11,26,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
        flexShrink: 0,
      }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
          <ChevronLeft size={18} color="#fff" />
        </motion.button>

        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Create Live Room</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Set up your room</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => toast.success("Draft saved ✅")}
            style={{
              height: 34, padding: "0 12px", borderRadius: 20,
              background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.35)",
              display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
            }}>
            <BookmarkPlus size={13} color="#9333EA" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9333EA" }}>Draft</span>
          </motion.button>
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => setShowHelpSheet(true)}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
            <HelpCircle size={15} color="rgba(255,255,255,0.6)" />
          </motion.button>
        </div>
      </div>

      {/* ── Scrollable Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 100px" }}>

        {/* ── Cover Photo ── */}
        <SectionCard title="Room Cover Photo" icon="🖼️">
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {/* Preview */}
            <div style={{
              width: 90, height: 90, borderRadius: 18, overflow: "hidden", flexShrink: 0,
              background: "rgba(255,255,255,0.06)",
              border: coverPreview ? "2px solid #9333EA" : "2px dashed rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="cover"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {coverUploading && (
                    <div style={{
                      position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: 20, height: 20, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    </div>
                  )}
                </>
              ) : (
                <Camera size={26} color="rgba(255,255,255,0.2)" />
              )}
            </div>
            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <label style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "9px 0", borderRadius: 12, cursor: "pointer",
                background: "linear-gradient(135deg,#9333EA,#3B82F6)",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>
                <Camera size={14} />
                {coverPreview ? "Change Photo" : "Upload Cover"}
                <input type="file" accept="image/jpg,image/png,image/webp" onChange={handleCoverUpload} style={{ display: "none" }} />
              </label>
              {coverPreview && (
                <button onClick={() => setCoverPreview(null)}
                  style={{
                    padding: "8px 0", borderRadius: 12, cursor: "pointer",
                    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                    fontSize: 12, fontWeight: 700, color: "#EF4444",
                  }}>
                  Remove Photo
                </button>
              )}
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>JPG · PNG · WEBP · HD quality</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Room Information ── */}
        <SectionCard title="Room Information" icon="📝">
          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <FieldLabel label="Room Title" required count={form.title.length} max={60} />
            <div style={{ position: "relative" }}>
              <StyledInput
                value={form.title}
                onChange={e => { set("title", e.target.value.slice(0, 60)); setShowSuggestions(false); }}
                placeholder="Give your room a catchy title..."
              />
              <button onClick={() => setShowSuggestions(v => !v)}
                style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                }}>
                <Sparkles size={15} color={showSuggestions ? "#9333EA" : "rgba(255,255,255,0.3)"} />
              </button>
            </div>
            <AnimatePresence>
              {showSuggestions && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {TITLE_SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => { set("title", s); setShowSuggestions(false); }}
                      style={{
                        fontSize: 11, padding: "5px 10px", borderRadius: 20,
                        background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.3)",
                        color: "#C084FC", cursor: "pointer", fontWeight: 600,
                      }}>{s}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <FieldLabel label="Description" count={form.description.length} max={200} />
            <StyledInput
              value={form.description}
              onChange={e => set("description", e.target.value.slice(0, 200))}
              placeholder="Tell listeners what to expect..."
              multiline rows={3}
            />
          </div>

          {/* Welcome Message */}
          <div>
            <FieldLabel label="Welcome Message" count={form.welcome_message.length} max={120} />
            <StyledInput
              value={form.welcome_message}
              onChange={e => set("welcome_message", e.target.value.slice(0, 120))}
              placeholder="Welcome! 🎙️ Glad you're here..."
            />
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: "6px 0 0" }}>
              Shown to every listener when they join
            </p>
          </div>
        </SectionCard>

        {/* ── Category ── */}
        <SectionCard title="Category" icon="🎯">
          <FieldLabel label="Select a category" required />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {CATEGORIES.map(cat => {
              const active = form.category === cat.value;
              return (
                <motion.button key={cat.value} whileTap={{ scale: 0.92 }}
                  onClick={() => set("category", cat.value)}
                  style={{
                    padding: "7px 12px", borderRadius: 20, cursor: "pointer",
                    background: active ? "rgba(147,51,234,0.25)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${active ? "rgba(147,51,234,0.65)" : "rgba(255,255,255,0.08)"}`,
                    fontSize: 12, fontWeight: 700,
                    color: active ? "#C084FC" : "rgba(255,255,255,0.55)",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                  <span>{cat.icon}</span>{cat.label}
                </motion.button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Language ── */}
        <SectionCard title="Language" icon="🌐">
          <FieldLabel label="Room Language" />
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowLangDropdown(v => !v)}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: 14,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600,
              }}>
              <span>🌐 {form.language}</span>
              <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
            </button>
            <AnimatePresence>
              {showLangDropdown && (
                <>
                  <div onClick={() => setShowLangDropdown(false)} style={{ position: "fixed", inset: 0, zIndex: 80 }} />
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 81,
                      background: "#1a1a30", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14, overflow: "hidden", maxHeight: 220, overflowY: "auto",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
                    }}>
                    {LANGUAGES.map((lang, i) => (
                      <button key={lang} onClick={() => { set("language", lang); setShowLangDropdown(false); }}
                        style={{
                          width: "100%", padding: "11px 14px", background: form.language === lang ? "rgba(147,51,234,0.2)" : "none",
                          border: "none", borderBottom: i < LANGUAGES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          cursor: "pointer", textAlign: "left", color: form.language === lang ? "#C084FC" : "rgba(255,255,255,0.75)",
                          fontSize: 13, fontWeight: form.language === lang ? 700 : 500,
                        }}>{lang}</button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </SectionCard>

        {/* ── Room Access ── */}
        <SectionCard title="Room Access" icon="🔐">
          <FieldLabel label="Who can join your room?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {ACCESS_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = form.room_type === opt.value;
              return (
                <motion.button key={opt.value} whileTap={{ scale: 0.98 }}
                  onClick={() => set("room_type", opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                    borderRadius: 14, cursor: "pointer",
                    background: active ? `${opt.color}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? opt.color + "55" : "rgba(255,255,255,0.07)"}`,
                    textAlign: "left",
                  }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: active ? `${opt.color}22` : "rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={15} color={active ? opt.color : "rgba(255,255,255,0.4)"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? opt.color : "#fff" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{opt.desc}</div>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `2px solid ${active ? opt.color : "rgba(255,255,255,0.2)"}`,
                    background: active ? opt.color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {active && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
          {/* Password field */}
          <AnimatePresence>
            {form.room_type === "password" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", marginTop: 10 }}>
                <FieldLabel label="Room Password" required />
                <StyledInput
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Set a password for your room..."
                />
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>

        {/* ── Entry Settings ── */}
        <SectionCard title="Entry Settings" icon="🪙">
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[
              { id: "free", label: "Free Entry", icon: "🎁", desc: "No payment required" },
              { id: "paid", label: "Paid Entry", icon: "💰", desc: "Coins to enter" },
            ].map(opt => {
              const active = form.entry_type === opt.id;
              return (
                <motion.button key={opt.id} whileTap={{ scale: 0.96 }}
                  onClick={() => set("entry_type", opt.id)}
                  style={{
                    flex: 1, padding: "12px 8px", borderRadius: 14, cursor: "pointer",
                    background: active ? "rgba(147,51,234,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? "rgba(147,51,234,0.5)" : "rgba(255,255,255,0.08)"}`,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  }}>
                  <span style={{ fontSize: 20 }}>{opt.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? "#C084FC" : "#fff" }}>{opt.label}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{opt.desc}</span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {form.entry_type === "paid" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                <FieldLabel label="Entry Fee (Coins)" required />
                <div style={{ position: "relative" }}>
                  <input
                    type="number" min={10} max={10000}
                    value={form.entry_price_coins}
                    onChange={e => set("entry_price_coins", Math.min(10000, Math.max(0, parseInt(e.target.value) || 0)))}
                    placeholder="Min 10 coins"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                      padding: "11px 50px 11px 14px", color: "#fff", fontSize: 13,
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                  <span style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    fontSize: 11, fontWeight: 700, color: "#FFD700",
                  }}>🪙</span>
                </div>
                {earningsPreview !== null && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      marginTop: 8, padding: "10px 12px", borderRadius: 12,
                      background: "rgba(0,194,184,0.1)", border: "1px solid rgba(0,194,184,0.25)",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                    <Coins size={14} color="#00C2B8" />
                    <span style={{ fontSize: 12, color: "#00C2B8", fontWeight: 700 }}>
                      You earn ~{earningsPreview} coins per listener (70%)
                    </span>
                  </motion.div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {[50, 100, 200, 500].map(v => (
                    <button key={v} onClick={() => set("entry_price_coins", v)}
                      style={{
                        flex: 1, padding: "6px 0", borderRadius: 10, cursor: "pointer",
                        background: form.entry_price_coins === v ? "rgba(147,51,234,0.3)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${form.entry_price_coins === v ? "rgba(147,51,234,0.5)" : "rgba(255,255,255,0.08)"}`,
                        fontSize: 11, fontWeight: 700,
                        color: form.entry_price_coins === v ? "#C084FC" : "rgba(255,255,255,0.5)",
                      }}>
                      {v}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>

        {/* ── Tags ── */}
        <SectionCard title="Tags" icon="🏷️">
          <FieldLabel label={`Tags (${form.tags.length}/5)`} />
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
              placeholder="Add a tag and press Enter..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
              }}
            />
            <motion.button whileTap={{ scale: 0.88 }} onClick={addTag}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: "rgba(147,51,234,0.2)", border: "1px solid rgba(147,51,234,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
              <Tag size={15} color="#9333EA" />
            </motion.button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {form.tags.map((tag, i) => (
              <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 700,
                  background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.3)",
                  borderRadius: 20, padding: "5px 10px", color: "#C084FC",
                }}>
                #{tag}
                <button onClick={() => set("tags", form.tags.filter((_, ti) => ti !== i))}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <X size={11} color="#C084FC" />
                </button>
              </motion.span>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Sticky Go Live Button ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "12px 14px 24px",
        background: "rgba(11,11,26,0.96)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}>
        {/* Validation hint */}
        {!isValid && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 10,
            padding: "8px 12px", borderRadius: 10,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            <Info size={13} color="#EF4444" />
            <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
              {!form.title.trim() ? "Room title is required" : !form.category ? "Please select a category" : "Fill required fields"}
            </span>
          </div>
        )}
        <motion.button
          whileTap={{ scale: isValid ? 0.96 : 1 }}
          onClick={() => isValid && !startMutation.isPending && startMutation.mutate()}
          style={{
            width: "100%", padding: "15px 0", borderRadius: 18,
            background: isValid
              ? "linear-gradient(135deg,#9333EA,#3B82F6,#EC4899)"
              : "rgba(255,255,255,0.06)",
            border: "none", cursor: isValid ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: isValid ? "0 8px 32px rgba(147,51,234,0.45)" : "none",
            transition: "all 0.3s ease",
          }}>
          {startMutation.isPending ? (
            <>
              <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Starting...</span>
            </>
          ) : (
            <>
              <Radio size={20} color={isValid ? "#fff" : "rgba(255,255,255,0.3)"} />
              <span style={{ fontSize: 15, fontWeight: 900, color: isValid ? "#fff" : "rgba(255,255,255,0.3)", letterSpacing: "0.03em" }}>
                GO LIVE NOW
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* ── Help Sheet ── */}
      <AnimatePresence>
        {showHelpSheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.65)" }}
            onClick={() => setShowHelpSheet(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "#12122A", borderRadius: "22px 22px 0 0",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "0 16px 40px", maxHeight: "75vh", overflowY: "auto",
              }}>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 8px" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>📋 Room Creation Guide</span>
                <button onClick={() => setShowHelpSheet(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={18} color="rgba(255,255,255,0.5)" />
                </button>
              </div>
              {[
                { emoji: "🖼️", title: "Cover Photo", text: "Upload a high-quality image (HD or better) in JPG, PNG, or WEBP format to attract more listeners." },
                { emoji: "✏️", title: "Room Title", text: "Use a catchy, clear title that tells listeners what your stream is about. At least 3 characters required." },
                { emoji: "🎯", title: "Category", text: "Select the most relevant category. This helps users discover your room in search and recommendations." },
                { emoji: "🔐", title: "Room Access", text: "Public rooms get the most listeners. Use VIP Only or Password for exclusive events." },
                { emoji: "🪙", title: "Paid Entry", text: "You earn 70% of each entry fee. Set a fair price to attract listeners while earning more." },
                { emoji: "📜", title: "Community Guidelines", text: "No explicit content, harassment, or spam. Violations may result in room closure or account suspension." },
              ].map(item => (
                <div key={item.title} style={{
                  marginBottom: 14, padding: "12px", borderRadius: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 5 }}>
                    {item.emoji} {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}