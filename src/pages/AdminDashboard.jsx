// ============================================================
// SCREEN: Admin Dashboard
// Purpose: Platform overview, KPIs, quick actions
// Flutter Migration: lib/features/admin/screens/admin_dashboard_screen.dart
// ============================================================
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Users, Radio, Wallet, Gift, TrendingUp, Shield,
  Building2, ArrowUpRight, AlertTriangle, Clock, CheckCircle
} from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatNumber, diamondsToUSD } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => base44.entities.User.list("-created_date", 200),
  });
  const { data: rooms = [] } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: () => base44.entities.LiveRoom.list("-started_at", 200),
  });
  const { data: withdrawals = [] } = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: () => base44.entities.WithdrawRequest.list("-created_date", 100),
  });
  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: () => base44.entities.Report.filter({ status: "pending" }, "-created_date", 50),
  });
  const { data: giftTxns = [] } = useQuery({
    queryKey: ["admin-gifts"],
    queryFn: () => base44.entities.GiftTransaction.list("-created_date", 500),
  });

  // KPIs
  const totalUsers = users.length;
  const activeHosts = users.filter(u => u.role === "host").length;
  const liveRooms = rooms.filter(r => r.status === "live").length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending");
  const totalDiamonds = giftTxns.reduce((s, t) => s + (t.diamonds_earned || 0), 0);
  const totalUSD = diamondsToUSD(totalDiamonds);

  // Role distribution for pie
  const roleData = ["listener", "host", "agency", "vip", "admin"].map(role => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: users.filter(u => u.role === role).length,
  })).filter(d => d.value > 0);
  const COLORS = ["#9B59B6", "#E91E63", "#27AE60", "#F39C12", "#E74C3C"];

  // 7-day signups
  const signupData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en", { weekday: "short" }),
      users: users.filter(u => new Date(u.created_date).toDateString() === d.toDateString()).length,
    };
  });

  const quickLinks = [
    { label: "Manage Users", path: "/admin/users", icon: Users, count: totalUsers, color: "from-blue-900/50 to-cyan-900/50 border-blue-700/30" },
    { label: "Live Rooms", path: "/admin/rooms", icon: Radio, count: liveRooms + " live", color: "from-red-900/50 to-rose-900/50 border-red-700/30" },
    { label: "Pending Withdrawals", path: "/admin/withdrawals", icon: Wallet, count: pendingWithdrawals.length, color: "from-yellow-900/50 to-orange-900/50 border-yellow-700/30" },
    { label: "Pending Reports", path: "/admin/reports", icon: Shield, count: reports.length, color: "from-purple-900/50 to-violet-900/50 border-purple-700/30" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Platform overview & management</p>
        </div>
        <div className="text-slate-500 text-sm">{new Date().toLocaleDateString("en", { dateStyle: "long" })}</div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={formatNumber(totalUsers)} icon={Users}
          gradient="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-700/30"
          trend="Platform growth" trendUp={true} />
        <StatCard title="Active Hosts" value={formatNumber(activeHosts)} icon={Radio}
          gradient="bg-gradient-to-br from-purple-900/50 to-violet-900/50 border border-purple-700/30" />
        <StatCard title="Platform Diamonds" value={`💎 ${formatNumber(totalDiamonds)}`} subtitle={`≈ $${totalUSD}`} icon={Gift}
          gradient="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-700/30" />
        <StatCard title="Pending Payouts" value={pendingWithdrawals.length} subtitle="Awaiting approval" icon={Wallet}
          gradient="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-700/30" />
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickLinks.map(ql => (
          <Link key={ql.path} to={ql.path}
            className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${ql.color} border flex items-start justify-between hover:scale-[1.02] transition-transform`}>
            <div>
              <div className="text-slate-400 text-xs mb-1">{ql.label}</div>
              <div className="text-white text-xl font-bold">{ql.count}</div>
            </div>
            <ql.icon className="w-5 h-5 text-slate-400" />
            <ArrowUpRight className="absolute bottom-3 right-3 w-4 h-4 text-slate-600" />
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Signups Chart */}
        <div className="lg:col-span-2 bg-[#1A1A35] border border-white/10 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">New Users (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={signupData} barSize={24}>
              <XAxis dataKey="day" stroke="#475569" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1E1E3F", border: "1px solid #7C3AED50", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="users" fill="#9B59B6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-[#1A1A35] border border-white/10 rounded-2xl p-5">
          <h2 className="text-white font-bold mb-4">User Roles</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1E1E3F", border: "1px solid #7C3AED50", borderRadius: 8, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Withdrawals */}
        <div className="bg-[#1A1A35] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Pending Withdrawals</h2>
            <Link to="/admin/withdrawals" className="text-purple-400 text-xs hover:underline">View All →</Link>
          </div>
          {pendingWithdrawals.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">No pending withdrawals</div>
          ) : (
            <div className="space-y-2">
              {pendingWithdrawals.slice(0, 5).map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <div>
                      <div className="text-white text-sm font-medium">💎 {formatNumber(w.diamonds_amount)}</div>
                      <div className="text-slate-500 text-xs capitalize">{w.payment_method?.replace("_", " ")}</div>
                    </div>
                  </div>
                  <div className="text-yellow-400 text-xs font-medium">${diamondsToUSD(w.diamonds_amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Reports */}
        <div className="bg-[#1A1A35] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold">Pending Reports</h2>
            <Link to="/admin/reports" className="text-purple-400 text-xs hover:underline">View All →</Link>
          </div>
          {reports.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-sm">No pending reports</div>
          ) : (
            <div className="space-y-2">
              {reports.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-white text-sm font-medium capitalize">{r.reason.replace("_", " ")}</div>
                      <div className="text-slate-500 text-xs">{new Date(r.created_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className="text-orange-400 text-xs px-2 py-0.5 bg-orange-500/10 rounded-full">Pending</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}