// Flutter Migration: lib/features/admin/screens/admin_dashboard.dart
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, Radio, Wallet, Gift, TrendingUp, AlertTriangle, Building2, Star } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatNumber, diamondsToUSD } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: users = [] } = useQuery({ queryKey: ["admin-users"], queryFn: () => base44.entities.User.list() });
  const { data: rooms = [] } = useQuery({ queryKey: ["admin-rooms"], queryFn: () => base44.entities.LiveRoom.list("-started_at", 50) });
  const { data: withdrawals = [] } = useQuery({ queryKey: ["admin-withdrawals"], queryFn: () => base44.entities.WithdrawRequest.filter({ status: "pending" }) });
  const { data: reports = [] } = useQuery({ queryKey: ["admin-reports"], queryFn: () => base44.entities.Report.filter({ status: "pending" }) });
  const { data: giftTxns = [] } = useQuery({ queryKey: ["admin-gifts"], queryFn: () => base44.entities.GiftTransaction.list("-created_date", 100) });
  const { data: agencies = [] } = useQuery({ queryKey: ["admin-agencies"], queryFn: () => base44.entities.Agency.list() });

  const liveRooms = rooms.filter(r => r.status === "live");
  const totalDiamonds = giftTxns.reduce((s, t) => s + (t.diamonds_earned || 0), 0);
  const roleBreakdown = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
  const pieData = Object.entries(roleBreakdown).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

  // Category activity
  const catActivity = rooms.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + (r.total_diamonds_earned || 0); return acc; }, {});
  const catChart = Object.entries(catActivity).map(([name, diamonds]) => ({ name, diamonds })).sort((a, b) => b.diamonds - a.diamonds).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Platform overview & controls</p>
      </div>

      {/* Alert banners */}
      <div className="flex flex-wrap gap-3">
        {withdrawals.length > 0 && (
          <Link to="/admin/withdrawals">
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2">
              <Wallet className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">{withdrawals.length} pending withdrawals</span>
            </div>
          </Link>
        )}
        {reports.length > 0 && (
          <Link to="/admin/reports">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">{reports.length} open reports</span>
            </div>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={formatNumber(users.length)} subtitle={`${liveRooms.length} rooms live`} icon={Users} gradient="bg-gradient-to-br from-purple-600/30 to-purple-900/20 border border-purple-500/20" trend="+8% this week" trendUp />
        <StatCard title="Total Rooms" value={formatNumber(rooms.length)} subtitle={`${liveRooms.length} currently live`} icon={Radio} gradient="bg-gradient-to-br from-pink-600/30 to-pink-900/20 border border-pink-500/20" />
        <StatCard title="Total Diamonds" value={`💎 ${formatNumber(totalDiamonds)}`} subtitle={`$${diamondsToUSD(totalDiamonds).toFixed(0)} value`} icon={Star} gradient="bg-gradient-to-br from-yellow-600/30 to-orange-600/20 border border-yellow-500/20" trend="+15%" trendUp />
        <StatCard title="Agencies" value={agencies.length} subtitle={`${agencies.filter(a => a.status === "active").length} active`} icon={Building2} gradient="bg-gradient-to-br from-blue-600/30 to-blue-900/20 border border-blue-500/20" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Chart */}
        <div className="lg:col-span-2 bg-[#12122A] rounded-2xl border border-white/10 p-5">
          <h2 className="text-white font-semibold mb-4">Diamonds by Category</h2>
          {catChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catChart}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="diamonds" fill="#9333ea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          )}
        </div>

        {/* User Breakdown */}
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
          <h2 className="text-white font-semibold mb-4">User Roles</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e1b4b", border: "none", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                      <span className="text-slate-300 capitalize">{d.name}</span>
                    </div>
                    <span className="text-white font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No users yet</div>
          )}
        </div>
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Pending Withdrawals</h2>
          <Link to="/admin/withdrawals" className="text-purple-400 text-xs">View all →</Link>
        </div>
        <div className="space-y-2">
          {withdrawals.slice(0, 5).map(w => (
            <div key={w.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <Wallet className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <span className="text-white">💎 {formatNumber(w.diamonds_amount)}</span>
                <span className="text-slate-400 ml-2">· ${w.usd_equivalent?.toFixed(2)}</span>
                <span className="text-slate-500 ml-2 text-xs">{w.payment_method?.replace("_", " ")}</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400">pending</Badge>
            </div>
          ))}
          {withdrawals.length === 0 && (
            <div className="text-center py-6 text-slate-600 text-sm">No pending withdrawals</div>
          )}
        </div>
      </div>
    </div>
  );
}