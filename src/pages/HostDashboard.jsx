// ============================================================
// SCREEN: Host Dashboard
// Flutter Migration: lib/features/host/screens/host_dashboard.dart
// ============================================================
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Radio, Wallet, Users, TrendingUp, Gift, Star, Clock, ArrowUpRight } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatNumber, formatDuration, diamondsToUSD } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HostDashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("7d");

  const { data: rooms = [] } = useQuery({
    queryKey: ["host-rooms", user?.id],
    queryFn: () => base44.entities.LiveRoom.filter({ host_id: user?.id }, "-started_at", 10),
  });

  const { data: giftTxns = [] } = useQuery({
    queryKey: ["host-gifts", user?.id],
    queryFn: () => base44.entities.GiftTransaction.filter({ receiver_id: user?.id }, "-created_date", 50),
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ["host-withdrawals", user?.id],
    queryFn: () => base44.entities.WithdrawRequest.filter({ user_id: user?.id }, "-created_date", 5),
  });

  const { data: follows = [] } = useQuery({
    queryKey: ["host-followers", user?.id],
    queryFn: () => base44.entities.Follow.filter({ following_id: user?.id }),
  });

  const totalDiamonds = giftTxns.reduce((s, t) => s + (t.diamonds_earned || 0), 0);
  const totalGifts = giftTxns.length;
  const totalStreams = rooms.length;
  const totalMinutes = rooms.reduce((s, r) => s + (r.duration_minutes || 0), 0);

  // Chart data from last 7 sessions
  const chartData = rooms.slice(0, 7).reverse().map((r, i) => ({
    name: `S${i + 1}`,
    diamonds: r.total_diamonds_earned || 0,
    listeners: r.peak_listeners || 0,
  }));

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-blue-500/20 text-blue-400",
    paid: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Host Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user?.display_name || user?.full_name}</p>
        </div>
        <Link to="/host/go-live">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white gap-2">
            <Radio className="w-4 h-4" />
            Go Live
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Diamonds"
          value={`💎 ${formatNumber(totalDiamonds)}`}
          subtitle={`≈ $${diamondsToUSD(totalDiamonds).toFixed(2)}`}
          icon={Star}
          gradient="bg-gradient-to-br from-yellow-600/30 to-orange-600/20 border border-yellow-500/20"
          trend="+12% this week"
          trendUp
        />
        <StatCard
          title="Total Streams"
          value={totalStreams}
          subtitle={formatDuration(totalMinutes)}
          icon={Radio}
          gradient="bg-gradient-to-br from-purple-600/30 to-purple-900/20 border border-purple-500/20"
        />
        <StatCard
          title="Followers"
          value={formatNumber(follows.length)}
          subtitle="Active followers"
          icon={Users}
          gradient="bg-gradient-to-br from-pink-600/30 to-pink-900/20 border border-pink-500/20"
        />
        <StatCard
          title="Gifts Received"
          value={formatNumber(totalGifts)}
          subtitle="All time"
          icon={Gift}
          gradient="bg-gradient-to-br from-blue-600/30 to-blue-900/20 border border-blue-500/20"
        />
      </div>

      {/* Chart */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Earnings per Stream</h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Diamonds</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500 inline-block" /> Listeners</span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="dGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="diamonds" stroke="#9333ea" fill="url(#dGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="listeners" stroke="#ec4899" fill="url(#lGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-600">No stream data yet</div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Streams */}
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Streams</h2>
            <Link to="/host/streams" className="text-purple-400 text-xs flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {rooms.slice(0, 4).map(room => (
              <div key={room.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${room.status === "live" ? "bg-green-400 animate-pulse" : "bg-slate-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{room.title}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{room.duration_minutes || 0}m</span>
                    <span>💎 {formatNumber(room.total_diamonds_earned || 0)}</span>
                    <span>👥 {formatNumber(room.peak_listeners || 0)}</span>
                  </div>
                </div>
                <Badge className={room.status === "live" ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"}>
                  {room.status}
                </Badge>
              </div>
            ))}
            {rooms.length === 0 && (
              <div className="text-center py-8 text-slate-600">
                <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No streams yet. Go live!</p>
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Withdrawals</h2>
            <Link to="/host/earnings" className="text-purple-400 text-xs flex items-center gap-1">
              Withdraw <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {withdrawals.map(w => (
              <div key={w.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Wallet className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">💎 {formatNumber(w.diamonds_amount)}</div>
                  <div className="text-slate-500 text-xs">${w.usd_equivalent?.toFixed(2)} · {w.payment_method}</div>
                </div>
                <Badge className={statusColors[w.status] || "bg-slate-700 text-slate-400"}>
                  {w.status}
                </Badge>
              </div>
            ))}
            {withdrawals.length === 0 && (
              <div className="text-center py-8 text-slate-600">
                <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No withdrawals yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}