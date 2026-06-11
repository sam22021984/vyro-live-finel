// Flutter Migration: lib/features/rooms/widgets/room_card.dart
import { Link } from "react-router-dom";
import { Users, Radio, Lock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { ROOM_CATEGORIES } from "@/lib/constants";

export default function RoomCard({ room, host }) {
  const category = ROOM_CATEGORIES.find(c => c.value === room.category);

  const roomTypeBadge = {
    public: null,
    paid: { label: `${room.entry_price_coins} coins`, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    vip_only: { label: "VIP Only", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    private: { label: "Private", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  }[room.room_type];

  return (
    <Link to={`/rooms/${room.id}`} className="block group">
      <div className="bg-[#1A1A35] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        {/* Cover / visual area */}
        <div className="relative h-32 bg-gradient-to-br from-purple-900/60 to-pink-900/60 flex items-center justify-center">
          {room.cover_image_url ? (
            <img src={room.cover_image_url} alt={room.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl">{category?.icon || "🎵"}</div>
          )}
          {/* Live badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold">LIVE</span>
          </div>
          {/* Featured */}
          {room.is_featured && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          )}
          {/* Room type */}
          {roomTypeBadge && (
            <div className={`absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full border font-medium ${roomTypeBadge.color}`}>
              {roomTypeBadge.label}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate mb-1">{room.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {host?.avatar_url ? (
                <img src={host.avatar_url} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-purple-700 flex items-center justify-center">
                  <span className="text-white text-xs">{host?.display_name?.charAt(0) || "H"}</span>
                </div>
              )}
              <span className="text-slate-400 text-xs truncate max-w-[80px]">{host?.display_name || "Host"}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs">{formatNumber(room.current_listeners)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-slate-500 text-xs">{category?.icon} {category?.label}</span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-yellow-400 text-xs">💎 {formatNumber(room.total_diamonds_earned)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}