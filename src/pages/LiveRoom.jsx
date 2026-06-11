// ============================================================
// SCREEN: Live Room (Listener View)
// Purpose: Join and interact with a live audio stream
// Flutter Migration: lib/features/live_room/screens/live_room_screen.dart
// Data: LiveRoom, GiftTransaction, Gift, User
// ============================================================
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import {
  Mic, MicOff, Gift, Users, Heart, Share2, Flag,
  ArrowLeft, Send, Crown, Star, Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserAvatar from "@/components/shared/UserAvatar";
import LevelBadge from "@/components/shared/LevelBadge";
import GiftPanel from "@/components/liveroom/GiftPanel";
import ChatPanel from "@/components/liveroom/ChatPanel";
import TopContributors from "@/components/liveroom/TopContributors";
import { formatNumber } from "@/lib/utils";
import { VIP_TIERS } from "@/lib/constants";

export default function LiveRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const [showGifts, setShowGifts] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const qc = useQueryClient();

  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: () => base44.entities.LiveRoom.filter({ id }),
    select: d => d[0],
  });

  const { data: host } = useQuery({
    queryKey: ["host", room?.host_id],
    queryFn: () => base44.entities.User.filter({ id: room?.host_id }),
    enabled: !!room?.host_id,
    select: d => d[0],
  });

  const { data: giftTxns = [] } = useQuery({
    queryKey: ["gift-txns", id],
    queryFn: () => base44.entities.GiftTransaction.filter({ room_id: id }, "-created_date", 20),
  });

  const { data: follows = [] } = useQuery({
    queryKey: ["follow", user?.id, room?.host_id],
    queryFn: () => base44.entities.Follow.filter({ follower_id: user?.id, following_id: room?.host_id }),
    enabled: !!user?.id && !!room?.host_id,
  });

  useEffect(() => {
    if (follows.length > 0) setIsFollowing(true);
  }, [follows]);

  // Simulate chat messages
  useEffect(() => {
    const demo = [
      { id: 1, user: "Star_Fan", message: "Amazing voice! 🎵", vip: "vip2", level: 5 },
      { id: 2, user: "Music_Lover", message: "Send gifts everyone!", vip: "none", level: 3 },
      { id: 3, user: "TrueListener", message: "You're the best host 🔥", vip: "vip1", level: 7 },
    ];
    setChatMessages(demo);
  }, []);

  const toggleFollow = async () => {
    if (isFollowing) {
      const existing = follows[0];
      if (existing) await base44.entities.Follow.delete(existing.id);
    } else {
      await base44.entities.Follow.create({ follower_id: user?.id, following_id: room?.host_id });
    }
    setIsFollowing(!isFollowing);
    qc.invalidateQueries(["follow"]);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: user?.display_name || user?.full_name || "You",
      message: chatInput,
      vip: user?.vip_tier || "none",
      level: user?.level || 1,
      isMe: true
    }]);
    setChatInput("");
  };

  if (roomLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0D0D1A]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0D0D1A] text-center">
        <p className="text-white text-xl mb-4">Room not found</p>
        <Link to="/" className="text-purple-400 hover:underline">← Back to Discover</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col lg:flex-row">
      {/* Main Room Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-[#0D0D1A] to-[#0D0D1A]" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4">
            <Link to="/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-600/80 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 rounded-full px-3 py-1">
                <Users className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-white text-xs font-bold">{formatNumber(room.current_listeners || 0)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Host Info */}
          <div className="flex items-center gap-4 px-4 mb-4">
            <div className="relative">
              <UserAvatar user={host} size="xl" showVIP />
              {/* Mic indicator */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center border-2 border-[#0D0D1A]">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg">{host?.display_name || host?.full_name || "Host"}</h2>
                {host?.is_verified && <span className="text-blue-400">✓</span>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <LevelBadge type="host" diamonds={host?.total_earned_diamonds} />
                <span className="text-slate-400 text-xs">{formatNumber(host?.followers_count || 0)} followers</span>
              </div>
              <p className="text-slate-400 text-sm mt-1 line-clamp-1">{room.title}</p>
            </div>
            <Button
              onClick={toggleFollow}
              size="sm"
              className={isFollowing
                ? "bg-white/10 text-white border border-white/20"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              }
            >
              {isFollowing ? "Following" : "+ Follow"}
            </Button>
          </div>

          {/* Top Contributors */}
          <TopContributors transactions={giftTxns} />

          {/* Audio Visualizer Placeholder */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="flex items-end gap-1.5 mb-4">
              {Array(20).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full"
                  style={{
                    height: `${20 + Math.random() * 60}px`,
                    animation: `pulse ${0.5 + Math.random() * 1}s ease-in-out infinite alternate`
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 text-sm">Live Audio Stream</span>
            </div>
          </div>

          {/* Room Stats */}
          <div className="flex items-center justify-center gap-6 px-4 mb-4">
            <div className="text-center">
              <div className="text-yellow-400 font-bold">💎 {formatNumber(room.total_diamonds_earned)}</div>
              <div className="text-slate-500 text-xs">Diamonds</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 font-bold">🎁 {formatNumber(room.total_gifts_received)}</div>
              <div className="text-slate-500 text-xs">Gifts</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">⭐ {formatNumber(room.peak_listeners)}</div>
              <div className="text-slate-500 text-xs">Peak</div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-3 p-4 border-t border-white/10">
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Say something..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-600 focus:outline-none"
              />
              <button onClick={sendChat} className="text-purple-400">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <button className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-400">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowGifts(!showGifts)}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white"
            >
              <Gift className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Chat + Gifts */}
      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col bg-[#12122A]">
        <ChatPanel messages={chatMessages} />
        {showGifts && <GiftPanel roomId={id} hostId={room.host_id} onClose={() => setShowGifts(false)} />}
      </div>
    </div>
  );
}