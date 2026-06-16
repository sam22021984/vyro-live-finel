/**
 * CommentsSheet — threaded comments with likes, reactions, edit/delete
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Send, CornerDownRight } from "lucide-react";

const AVATAR = (seed) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
const EMOJIS = ["❤️", "😂", "🔥", "👏", "😍", "💎"];

const MOCK_COMMENTS = [
  { id: "c1", user_name: "Luna ✨", user_avatar: AVATAR("luna"), content: "This is so amazing! 🔥", likes: 12, liked_by: [], reactions: ["❤️","😂"], parent_id: null, created_date: new Date(Date.now() - 1000*60*5).toISOString() },
  { id: "c2", user_name: "Rex 🎵", user_avatar: AVATAR("rex"), content: "Totally agree with you!", likes: 8, liked_by: [], reactions: [], parent_id: "c1", created_date: new Date(Date.now() - 1000*60*3).toISOString() },
  { id: "c3", user_name: "Nova 🌺", user_avatar: AVATAR("nova"), content: "Can't wait for the next stream 💜", likes: 5, liked_by: [], reactions: ["🔥"], parent_id: null, created_date: new Date(Date.now() - 1000*60*2).toISOString() },
];

function timeAgo(iso) {
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  return `${Math.floor(m/60)}h`;
}

function CommentItem({ comment, onReply, level = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [showEmoji, setShowEmoji] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      style={{ paddingLeft: level * 24, marginBottom: 12 }}>
      {level > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
          <CornerDownRight size={10} color="rgba(255,255,255,0.2)" />
        </div>
      )}
      <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
        <img src={comment.user_avatar} alt={comment.user_name}
          style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(147,51,234,0.4)", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "8px 12px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#9333EA", marginBottom: 3 }}>{comment.user_name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{comment.content}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 5, paddingLeft: 4 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{timeAgo(comment.created_date)}</span>
            <motion.button whileTap={{ scale: 0.8 }}
              onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }}
              style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer" }}>
              <Heart size={12} style={{ color: liked ? "#EC4899" : "rgba(255,255,255,0.35)", fill: liked ? "#EC4899" : "none" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>{likes}</span>
            </motion.button>
            <button onClick={() => onReply(comment)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>
              Reply
            </button>
            <button onClick={() => setShowEmoji(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>😊</button>
          </div>
          {/* Emoji reactions */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6, paddingLeft: 4 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setShowEmoji(false)}
                    style={{ fontSize: 18, background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "3px 6px", cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Reaction pills */}
          {comment.reactions?.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 4, paddingLeft: 4, flexWrap: "wrap" }}>
              {[...new Set(comment.reactions)].map(r => (
                <span key={r} style={{
                  fontSize: 11, background: "rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "2px 7px", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>{r} {comment.reactions.filter(x => x === r).length}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CommentsSheet({ post, onClose, currentUser }) {
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const send = () => {
    if (!input.trim()) return;
    setComments(prev => [...prev, {
      id: `c${Date.now()}`,
      user_name: currentUser?.full_name || "You",
      user_avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.id || "me"}`,
      content: input.trim(), likes: 0, liked_by: [], reactions: [],
      parent_id: replyTo?.id || null,
      created_date: new Date().toISOString(),
    }]);
    setInput("");
    setReplyTo(null);
  };

  const topLevel = comments.filter(c => !c.parent_id);
  const replies = (parentId) => comments.filter(c => c.parent_id === parentId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "#12122A", borderRadius: "22px 22px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          height: "78vh", display: "flex", flexDirection: "column",
        }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 12px", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Comments ({comments.length})</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 14px" }}>
          {topLevel.map(c => (
            <div key={c.id}>
              <CommentItem comment={c} onReply={setReplyTo} level={0} />
              {replies(c.id).map(r => <CommentItem key={r.id} comment={r} onReply={setReplyTo} level={1} />)}
            </div>
          ))}
        </div>
        {replyTo && (
          <div style={{ padding: "6px 14px 0", background: "rgba(147,51,234,0.1)", margin: "0 14px", borderRadius: 10 }}>
            <span style={{ fontSize: 11, color: "#9333EA" }}>↩ Replying to <strong>{replyTo.user_name}</strong></span>
            <button onClick={() => setReplyTo(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer" }}>
              <X size={12} color="#9333EA" />
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, padding: "10px 14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder={replyTo ? `Reply to ${replyTo.user_name}...` : "Add a comment..."}
            style={{
              flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
            }} />
          <motion.button whileTap={{ scale: 0.86 }} onClick={send}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg,#9333EA,#3B82F6)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <Send size={15} color="#fff" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}