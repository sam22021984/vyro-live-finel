/**
 * CommunityFeed — scrollable post feed with create post, likes, comments, share
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Flag, Copy, Quote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CreatePostSheet from "@/components/community/CreatePostSheet";
import CommentsSheet from "@/components/community/CommentsSheet";

const AVATAR = (seed) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

const MOCK_POSTS = [
  {
    id: "p1", user_id: "u1", user_name: "Luna ✨", user_avatar: AVATAR("luna"),
    type: "text", content: "Good morning VYRO fam! 🌟 Who's going live today?",
    likes: 142, comments_count: 24, shares: 8,
    liked_by: [], created_date: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "p2", user_id: "u2", user_name: "Rex 🎵", user_avatar: AVATAR("rex"),
    type: "image", content: "Late night vibes 🎶 Just wrapped a 3hr session!",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    likes: 389, comments_count: 56, shares: 21,
    liked_by: [], created_date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "p3", user_id: "u3", user_name: "Nova 🌺", user_avatar: AVATAR("nova"),
    type: "poll", content: "What type of stream do you prefer? 🎙️",
    poll_options: ["Music", "Talk Show", "Storytelling", "Meditation"],
    poll_votes: { "Music": 234, "Talk Show": 189, "Storytelling": 67, "Meditation": 43 },
    likes: 201, comments_count: 38, shares: 12,
    liked_by: [], created_date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "p4", user_id: "u4", user_name: "Kai 🔥", user_avatar: AVATAR("kai"),
    type: "text", content: "Just hit Level 50! 🏆 Thanks to everyone who joined my streams this week. You all are amazing! 💎",
    likes: 512, comments_count: 94, shares: 33,
    liked_by: [], created_date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PostCard({ post, currentUserId, onComment }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [saved, setSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const totalPollVotes = post.poll_votes
    ? Object.values(post.poll_votes).reduce((a, b) => a + b, 0)
    : 0;

  const toggleLike = () => {
    setLiked(v => !v);
    setLikes(v => liked ? v - 1 : v + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18,
        padding: "14px 14px 10px",
        marginBottom: 10,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <img src={post.user_avatar} alt={post.user_name}
          style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid rgba(147,51,234,0.5)", objectFit: "cover" }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{post.user_name}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{timeAgo(post.created_date)}</div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowMenu(v => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <MoreHorizontal size={16} color="rgba(255,255,255,0.4)" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <>
                <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    position: "absolute", top: 28, right: 0, zIndex: 51,
                    background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, overflow: "hidden", minWidth: 150,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  }}>
                  {[
                    { icon: Bookmark, label: saved ? "Unsave" : "Save", action: () => { setSaved(v => !v); setShowMenu(false); } },
                    { icon: Copy, label: "Copy Link", action: () => setShowMenu(false) },
                    { icon: Flag, label: "Report", color: "#FF5252", action: () => setShowMenu(false) },
                  ].map(({ icon: Icon, label, color, action }) => (
                    <button key={label} onClick={action}
                      style={{
                        width: "100%", padding: "10px 14px",
                        display: "flex", alignItems: "center", gap: 8,
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600,
                        color: color || "rgba(255,255,255,0.8)",
                        borderBottom: label !== "Report" ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}>
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: 10 }}>
        {post.content}
      </p>

      {/* Image */}
      {post.type === "image" && post.image_url && (
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
          <img src={post.image_url} alt="post"
            style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Poll */}
      {post.type === "poll" && post.poll_options && (
        <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {post.poll_options.map(opt => {
            const votes = post.poll_votes?.[opt] || 0;
            const pct = totalPollVotes > 0 ? Math.round((votes / totalPollVotes) * 100) : 0;
            return (
              <div key={opt} style={{ position: "relative", borderRadius: 10, overflow: "hidden",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(147,51,234,0.3)",
                padding: "8px 12px", cursor: "pointer" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`,
                  background: "rgba(147,51,234,0.2)", borderRadius: 10,
                }} />
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{opt}</span>
                  <span style={{ fontSize: 11, color: "#9333EA", fontWeight: 700 }}>{pct}%</span>
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
            {totalPollVotes} votes
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 8,
        borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.button whileTap={{ scale: 0.82 }} onClick={toggleLike}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" }}>
          <Heart size={16}
            style={{ color: liked ? "#EC4899" : "rgba(255,255,255,0.4)",
              fill: liked ? "#EC4899" : "none", transition: "all 0.2s" }} />
          <span style={{ fontSize: 12, color: liked ? "#EC4899" : "rgba(255,255,255,0.45)", fontWeight: 700 }}>{likes}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.82 }} onClick={() => onComment(post)}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" }}>
          <MessageCircle size={16} color="rgba(255,255,255,0.4)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>{post.comments_count}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.82 }}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer" }}>
          <Share2 size={16} color="rgba(255,255,255,0.4)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>{post.shares}</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.82 }} onClick={() => setSaved(v => !v)}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}>
          <Bookmark size={16} style={{ color: saved ? "#FFD700" : "rgba(255,255,255,0.4)",
            fill: saved ? "#FFD700" : "none", transition: "all 0.2s" }} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function CommunityFeed({ currentUser }) {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [showCreate, setShowCreate] = useState(false);
  const [commentPost, setCommentPost] = useState(null);

  const handleNewPost = (post) => {
    setPosts(prev => [{ ...post, id: `p${Date.now()}`, created_date: new Date().toISOString(), likes: 0, comments_count: 0, shares: 0, liked_by: [] }, ...prev]);
    setShowCreate(false);
  };

  return (
    <div style={{ position: "relative", minHeight: "100%" }}>
      <div style={{ paddingBottom: 80 }}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} currentUserId={currentUser?.id} onComment={setCommentPost} />
        ))}
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed", bottom: 90, right: 20, zIndex: 100,
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg,#9333EA,#3B82F6)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 24px rgba(147,51,234,0.55)",
          fontSize: 24,
        }}>
        ✏️
      </motion.button>

      <AnimatePresence>
        {showCreate && <CreatePostSheet onClose={() => setShowCreate(false)} onPost={handleNewPost} currentUser={currentUser} />}
        {commentPost && <CommentsSheet post={commentPost} onClose={() => setCommentPost(null)} currentUser={currentUser} />}
      </AnimatePresence>
    </div>
  );
}