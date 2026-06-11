// Flutter Migration: lib/features/agency/screens/agency_dashboard.dart
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Users, TrendingUp, Wallet, Star, Building2, Radio, Plus } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatNumber, diamondsToUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AgencyDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: agencies = [] } = useQuery({
    queryKey: ["my-agency", user?.id],
    queryFn: () => base44.entities.Agency.filter({ owner_id: user?.id }),
  });

  const agency = agencies[0];

  const { data: hostUsers = [] } = useQuery({
    queryKey: ["agency-hosts"],
    queryFn: () => base44.entities.User.filter({ agency_id: agency?.id }),
    enabled: !!agency?.id,
  });

  const { data: hostRooms = [] } = useQuery({
    queryKey: ["agency-rooms"],
    queryFn: () => base44.entities.LiveRoom.filter({}, "-started_at", 50),
    enabled: !!agency?.id,
  });

  const applyMutation = useMutation({
    mutationFn: () => base44.entities.Agency.create({
      owner_id: user.id,
      name: `${user.full_name}'s Agency`,
      status: "pending",
    }),
    onSuccess: () => { toast.success("Agency application submitted!"); qc.invalidateQueries(["my-agency"]); },
  });

  if (!agency) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center p-6">
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-8 max-w-md text-center">
          <Building2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Start Your Agency</h2>
          <p className="text-slate-400 text-sm mb-6">Manage a roster of hosts, track their earnings, and grow together as a team.</p>
          <Button onClick={() => applyMutation.mutate()} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white gap-2">
            <Plus className="w-4 h-4" />Apply to Create Agency
          </Button>
        </div>
      </div>
    );
  }

  const totalDiamonds = agency.total_earnings_diamonds || 0;
  const agencyShare = totalDiamonds * ((agency.commission_rate || 30) / 100);

  // Earnings per host chart
  const hostChart = hostUsers.slice(0, 6).map(h => ({
    name: h.display_name || h.full_name?.split(" ")[0] || "Host",
    diamonds: h.total_earned_diamonds || 0,
  }));

  const tierColor = { bronze: "text-amber-600", silver: "text-slate-300", gold: "text-yellow-400", platinum: "text-cyan-300" };
  const statusColor = { pending: "bg-yellow-500/20 text-yellow-400", active: "bg-green-500/20 text-green-400", suspended: "bg-red-500/20 text-red-400" };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      {/* Agency Header */}
      <div className="flex items-start gap-4 bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-white text-xl font-bold">{agency.name}</h1>
            <Badge className={statusColor[agency.status]}>{agency.status}</Badge>
            <span className={`text-sm font-medium capitalize ${tierColor[agency.tier] || "text-slate-400"}`}>{agency.tier} tier</span>
          </div>
          <p className="text-slate-400 text-sm">{agency.description || "No description yet"}</p>
          <div className="flex gap-4 text-xs text-slate-400 mt-2">
            <span>{agency.commission_rate}% agency commission</span>
            {agency.contact_email && <span>{agency.contact_email}</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Hosts" value={hostUsers.length} icon={Users} gradient="bg-gradient-to-br from-purple-600/30 to-purple-900/20 border border-purple-500/20" />
        <StatCard title="Total Earnings" value={`💎 ${formatNumber(totalDiamonds)}`} subtitle={`≈ $${diamondsToUSD(totalDiamonds).toFixed(0)}`} icon={Star} gradient="bg-gradient-to-br from-yellow-600/30 to-orange-600/20 border border-yellow-500/20" />
        <StatCard title="Agency Share" value={`💎 ${formatNumber(Math.floor(agencyShare))}`} subtitle={`${agency.commission_rate}% cut`} icon={Wallet} gradient="bg-gradient-to-br from-green-600/30 to-green-900/20 border border-green-500/20" />
        <StatCard title="Live Now" value={hostRooms.filter(r => r.status === "live").length} icon={Radio} gradient="bg-gradient-to-br from-pink-600/30 to-pink-900/20 border border-pink-500/20" />
      </div>

      {/* Host Earnings Chart */}
      {hostChart.length > 0 && (
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
          <h2 className="text-white font-semibold mb-4">Host Earnings Comparison</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hostChart}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Bar dataKey="diamonds" fill="#9333ea" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Host Roster */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Host Roster</h2>
          <span className="text-slate-500 text-sm">{hostUsers.length} hosts</span>
        </div>
        <div className="space-y-3">
          {hostUsers.map(host => {
            const liveRoom = hostRooms.find(r => r.host_id === host.id && r.status === "live");
            return (
              <div key={host.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={host.avatar_url} />
                  <AvatarFallback className="bg-purple-700 text-white text-sm">{host.full_name?.charAt(0) || "H"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{host.display_name || host.full_name}</span>
                    {liveRoom && (
                      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                    <span>💎 {formatNumber(host.total_earned_diamonds || 0)}</span>
                    <span>Lv.{host.level || 1}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-xs">Agency share</div>
                  <div className="text-green-400 text-sm font-medium">
                    💎 {formatNumber(Math.floor((host.total_earned_diamonds || 0) * (agency.commission_rate / 100)))}
                  </div>
                </div>
              </div>
            );
          })}
          {hostUsers.length === 0 && (
            <div className="text-center py-8 text-slate-600">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No hosts yet. Recruit hosts to your agency!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}