// Flutter Migration: lib/features/profile/screens/profile_screen.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Camera, Save, Globe, MapPin, Bell, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/shared/UserAvatar";
import LevelBadge from "@/components/shared/LevelBadge";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";
import { getUserLevelFromCoins } from "@/lib/constants";

export default function UserProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    display_name: user?.display_name || user?.full_name || "",
    bio: user?.bio || "",
    country: user?.country || "",
    website: user?.website || "",
  });

  const { data: giftsSent = [] } = useQuery({
    queryKey: ["profile-gifts-sent", user?.id],
    queryFn: () => base44.entities.GiftTransaction.filter({ sender_id: user?.id }),
  });

  const { data: follows = [] } = useQuery({
    queryKey: ["profile-follows", user?.id],
    queryFn: () => base44.entities.Follow.filter({ follower_id: user?.id }),
  });

  const { data: followers = [] } = useQuery({
    queryKey: ["profile-followers", user?.id],
    queryFn: () => base44.entities.Follow.filter({ following_id: user?.id }),
  });

  const { data: vipSubs = [] } = useQuery({
    queryKey: ["profile-vip", user?.id],
    queryFn: () => base44.entities.VIPSubscription.filter({ user_id: user?.id, status: "active" }),
  });

  const saveMutation = useMutation({
    mutationFn: () => base44.auth.updateMe(form),
    onSuccess: () => { toast.success("Profile updated!"); setEditing(false); qc.invalidateQueries(); },
    onError: () => toast.error("Failed to update profile"),
  });

  const totalCoinsSpent = giftsSent.reduce((s, t) => s + (t.coins_spent || 0), 0);
  const level = getUserLevelFromCoins(user?.coin_balance || 0);
  const activeVIP = vipSubs[0];

  const vipInfo = {
    vip1: { name: "VIP Bronze", icon: "🥉", color: "#CD7F32" },
    vip2: { name: "VIP Silver", icon: "🥈", color: "#C0C0C0" },
    vip3: { name: "VIP Gold", icon: "🥇", color: "#FFD700" },
    vip4: { name: "VIP Platinum", icon: "💎", color: "#E5E4E2" },
    vip5: { name: "VIP Diamond", icon: "👑", color: "#B9F2FF" },
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/40 rounded-2xl border border-white/10 p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <UserAvatar user={user} size="xl" showVIP />
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple-600 border-2 border-[#0D0D1A] flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            {!editing ? (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-white text-xl font-bold">{user?.display_name || user?.full_name}</h1>
                  {user?.is_verified && <span className="text-blue-400 text-sm">✓</span>}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <LevelBadge type="user" coins={user?.coin_balance || 0} />
                  {activeVIP && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: vipInfo[activeVIP.tier]?.color + "20", color: vipInfo[activeVIP.tier]?.color }}>
                      {vipInfo[activeVIP.tier]?.icon} {vipInfo[activeVIP.tier]?.name}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-2">{user?.bio || "No bio yet"}</p>
                {user?.country && <p className="text-slate-500 text-xs mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{user.country}</p>}
                <Button size="sm" onClick={() => setEditing(true)} className="mt-3 bg-white/10 text-white hover:bg-white/20">Edit Profile</Button>
              </>
            ) : (
              <div className="space-y-3 w-full">
                <Input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} placeholder="Display name" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
                <Textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell people about yourself..." className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 resize-none h-16" />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Country" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
                  <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="Website" className="bg-white/5 border-white/10 text-white placeholder:text-slate-600" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white gap-1">
                    <Save className="w-3.5 h-3.5" />{saveMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-slate-400">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Following", value: follows.length },
          { label: "Followers", value: followers.length },
          { label: "Gifts Sent", value: giftsSent.length },
        ].map(s => (
          <div key={s.label} className="bg-[#12122A] rounded-2xl border border-white/10 p-4 text-center">
            <div className="text-white text-xl font-bold">{formatNumber(s.value)}</div>
            <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">Level Progress</span>
          </div>
          <LevelBadge type="user" coins={user?.coin_balance || 0} size="md" />
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
            style={{ width: `${level.progress || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatNumber(user?.xp || 0)} XP</span>
          <span>{level.progress?.toFixed(0) || 0}% to next level</span>
        </div>
      </div>

      {/* Coin Activity */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Coin Activity</h2>
        <div className="flex justify-between">
          <div>
            <div className="text-slate-400 text-xs">Current Balance</div>
            <div className="text-yellow-400 text-xl font-bold">🪙 {formatNumber(user?.coin_balance || 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-xs">Total Spent on Gifts</div>
            <div className="text-pink-400 text-xl font-bold">🪙 {formatNumber(totalCoinsSpent)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}