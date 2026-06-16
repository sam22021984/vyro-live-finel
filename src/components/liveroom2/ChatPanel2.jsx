/**
 * ChatPanel2 — tabs: All Chat / Gift Feed / System Feed
 * Features: emoji, reply, reactions, delete, copy
 * Flutter: TabBar + ListView.builder
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, X } from "lucide-react";

const MOCK_MESSAGES = [
  { id: 1, type: "system", text: "Sajid Alam (SAM) joined the room." },
  { id: 2, type: "announcement", text: "⚠️ Warning: Pornography, vulgarity, violence, minors and other related situations are strictly prohibited during the live broadcast. The AI system will check 24 hours a day, and any violations will be severely punished!" },
  { id: 3, type: "chat", user: "Luna✨", vip: "vip3", text: "omg this room is 🔥🔥", color: "#FFD700" },
  { id: 4, type: "gift", user: "Rex", gift: "🚀 Rocket", coins: 500 },
  { id: 5, type: "chat", user: "Nova", text: "hi everyone!! 👋", color: "#00C2B8" },
  { id: 6, type: "system", text: "Sajid Alam (SAM) took seat 1." },
  { id: 7, type: "chat", user: "Kai", text: "lets gooo 🎉", color: "#C084FC" },
];

const TABS = ["All", "Gifts", "System"];

export default function ChatPanel2({ compact, onClose }) {
  const [activeTab, setActiveTab] = useState("All");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);

  const EMOJIS = ["😂", "🔥", "💯", "❤️", "🎉", "👏", "🙏", "😍", "🚀", "💎", "👑", "✨"];

  useEffect(() => {
    if (!compact) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = messages.filter(m => {
    if (activeTab === "All") return true;
    if (activeTab === "Gifts") return m.type === "gift";
    if (activeTab === "System") return m.type === "system" || m.type === "announcement";
    return true;
  });

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), type: "chat", user: "You", text: input.trim(), color: "#00C2B8",
    }]);
    setInput("");
  };

  if (compact) {
    return (
      <div style={{ padding: "4px 0" }}>
        {messages.slice(-3).map(m => (
          <div key={m.id} style={{ marginBottom: 4, display: "flex", gap: 6, alignItems: "flex-start" }}>
            {m.type === "chat" && (
              <>
                <span style={{ fontSize: 11, fontWeight: 800, color: m.color || "#00C2B8", flexShrink: 0 }}>
                  {m.user}:
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{m.text}</span>
              </>
            )}
            {m.type === "system" && (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{m.text}</span>
            )}
            {m.type === "gift" && (
              <span style={{ fontSize: 11, color: "#FFD700" }}>🎁 {m.user} sent {m.gift}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#111",
    }}>
      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, padding: "8px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {TABS.map(t => (
          <motion.button key={t} whileTap={{ scale: 0.94 }}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "6px 14px", borderRadius: 16, fontSize: 12, fontWeight: 700,
              border: "none", cursor: "pointer",
              background: activeTab === t ? "#00C2B8" : "rgba(255,255,255,0.06)",
              color: activeTab === t ? "#000" : "rgba(255,255,255,0.5)",
            }}>{t}</motion.button>
        ))}
        {onClose && (
          <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
            style={{
              marginLeft: "auto", width: 30, height: 30, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <X size={14} color="rgba(255,255,255,0.6)" />
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence initial={false}>
          {filtered.map(m => (
            <motion.div key={m.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              {m.type === "announcement" && (
                <div style={{
                  background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.25)",
                  borderRadius: 10, padding: "8px 12px",
                  fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              )}
              {m.type === "system" && (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontStyle: "italic", padding: "2px 0" }}>
                  {m.text}
                </div>
              )}
              {m.type === "chat" && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: m.color || "#00C2B8", marginRight: 4 }}>
                    {m.vip ? `[${m.vip.toUpperCase()}] ` : ""}{m.user}:
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{m.text}</span>
                </div>
              )}
              {m.type === "gift" && (
                <div style={{
                  background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)",
                  borderRadius: 10, padding: "6px 10px",
                  fontSize: 11, color: "#FFD700",
                }}>
                  🎁 <strong>{m.user}</strong> sent <strong>{m.gift}</strong> ({m.coins} coins)
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Emoji quick row */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 14px" }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setInput(v => v + e)}
                  style={{
                    fontSize: 20, background: "none", border: "none", cursor: "pointer",
                    padding: 4, borderRadius: 8,
                  }}>{e}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 14px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        alignItems: "center",
      }}>
        <button onClick={() => setShowEmoji(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <Smile size={20} color={showEmoji ? "#00C2B8" : "rgba(255,255,255,0.4)"} />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Say something..."
          style={{
            flex: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "8px 14px",
            color: "#fff", fontSize: 13, outline: "none",
          }}
        />
        <motion.button whileTap={{ scale: 0.88 }} onClick={send}
          style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg,#00C2B8,#006e6a)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
          <Send size={15} color="#fff" />
        </motion.button>
      </div>
    </div>
  );
}