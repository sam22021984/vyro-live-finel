// ============================================================
// SCREEN: Discover / Home Feed
// Purpose: Browse live rooms, featured hosts, trending content
// Flutter Migration: lib/features/discover/screens/discover_screen.dart
// Data Model: LiveRoom, User
// ============================================================
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Radio, TrendingUp, Star, Globe, Search, SlidersHorizontal, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RoomCard from "@/components/shared/RoomCard";
import { ROOM_CATEGORIES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

export default function Discover() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("trending");

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["live-rooms", selectedCategory, selectedFilter],
    queryFn: () => base44.entities.LiveRoom.filter({ status: "live" }, "-current_listeners", 50),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users-hosts"],
    queryFn: () => base44.entities.User.filter({ role: "host" }, "-total_earned_diamonds", 20),
  });

  const userMap = {};
  users.forEach(u => { userMap[u.id] = u; });

  const filteredRooms = rooms.filter(r =>
    selectedCategory === "all" || r.category === selectedCategory
  );

  const filters = [
    { key: "trending", label: "Trending", icon: Flame },
    { key: "new", label: "New", icon: Radio },
    { key: "top", label: "Top", icon: Star },
    { key: "international", label: "International", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 p-6 lg:p-8">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #9B59B6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #E91E63 0%, transparent 50%)" }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">Live Now</span>
          </div>
          <h1 className="text-white text-2xl lg:text-3xl font-bold mb-2">Discover Live Rooms</h1>
          <p className="text-purple-300 text-sm mb-4">Join thousands of live audio streams from hosts worldwide</p>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <Radio className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-white font-semibold">{formatNumber(rooms.length)}</span>
              <span className="text-slate-300">Live Now</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span className="text-slate-300">Trending worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
          }`}
        >
          All
        </button>
        {ROOM_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.value
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Sort Filters */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedFilter === f.key
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/50"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <f.icon className="w-3 h-3" />
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-slate-500 text-xs">{filteredRooms.length} rooms</span>
      </div>

      {/* Rooms Grid */}
      {roomsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Radio className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg font-medium">No live rooms right now</p>
          <p className="text-slate-600 text-sm mt-1">Be the first to go live!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} host={userMap[room.host_id]} />
          ))}
        </div>
      )}
    </div>
  );
}