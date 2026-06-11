// Flutter Migration: lib/features/host/screens/go_live_screen.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Radio, Image, Lock, DollarSign, Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ROOM_CATEGORIES } from "@/lib/constants";

export default function GoLive() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "music",
    room_type: "public",
    entry_price_coins: 0,
    welcome_message: "",
    level_restriction: 0,
    language: "English",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

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
      navigate(`/rooms/${room.id}`);
    },
    onError: () => toast.error("Failed to start stream"),
  });

  const addTag = () => {
    if (tagInput.trim() && form.tags.length < 5) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-8 flex items-start justify-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Start Your Live Stream</h1>
          <p className="text-slate-400 text-sm mt-1">Set up your room and connect with your audience</p>
        </div>

        {/* Form */}
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block">Room Title *</label>
            <Input
              placeholder="What's your stream about?"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block">Description</label>
            <Textarea
              placeholder="Tell listeners what to expect..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none h-20"
            />
          </div>

          {/* Category + Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">Category</label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a35] border-white/10">
                  {ROOM_CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value} className="text-white">
                      {c.icon} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">Language</label>
              <Input
                placeholder="English"
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Room Access</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "public", label: "Public", icon: "🌐", desc: "Anyone can join" },
                { value: "paid", label: "Paid Entry", icon: "🪙", desc: "Pay coins to enter" },
                { value: "vip_only", label: "VIP Only", icon: "👑", desc: "VIP members only" },
                { value: "private", label: "Private", icon: "🔒", desc: "Invite only" },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setForm(f => ({ ...f, room_type: opt.value }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.room_type === opt.value
                      ? "border-purple-500 bg-purple-600/20"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-lg mb-1">{opt.icon}</div>
                  <div className="text-white text-xs font-medium">{opt.label}</div>
                  <div className="text-slate-500 text-xs">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Entry Price (if paid) */}
          {form.room_type === "paid" && (
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">Entry Price (Coins)</label>
              <Input
                type="number"
                min={1}
                placeholder="50"
                value={form.entry_price_coins}
                onChange={e => setForm(f => ({ ...f, entry_price_coins: parseInt(e.target.value) || 0 }))}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          )}

          {/* Welcome Message */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block">Welcome Message</label>
            <Input
              placeholder="Welcome to my stream! 🎵"
              value={form.welcome_message}
              onChange={e => setForm(f => ({ ...f, welcome_message: e.target.value }))}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-1.5 block">Tags (up to 5)</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag()}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
              />
              <Button variant="outline" size="sm" onClick={addTag} className="border-white/10 text-slate-300">
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, ti) => ti !== i) }))}
                  className="text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full px-3 py-1 hover:bg-red-600/20 hover:text-red-300 hover:border-red-500/30 transition-all"
                >
                  #{tag} ✕
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Go Live Button */}
        <Button
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold gap-3 rounded-2xl hover:opacity-90"
          onClick={() => startMutation.mutate()}
          disabled={!form.title || startMutation.isPending}
        >
          <Radio className="w-6 h-6" />
          {startMutation.isPending ? "Starting..." : "Go Live Now"}
        </Button>
      </div>
    </div>
  );
}