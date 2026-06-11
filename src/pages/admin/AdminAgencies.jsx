// Flutter Migration: lib/features/admin/screens/admin_agencies.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, CheckCircle, XCircle, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatNumber, diamondsToUSD } from "@/lib/utils";

export default function AdminAgencies() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ["admin-agencies-all"],
    queryFn: () => base44.entities.Agency.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Agency.update(id, data),
    onSuccess: () => { toast.success("Agency updated"); qc.invalidateQueries(["admin-agencies-all"]); },
  });

  const filtered = agencies.filter(a => statusFilter === "all" || a.status === statusFilter);

  const tierColor = { bronze: "text-amber-600", silver: "text-slate-300", gold: "text-yellow-400", platinum: "text-cyan-300" };
  const statusColor = { pending: "bg-yellow-500/20 text-yellow-400", active: "bg-green-500/20 text-green-400", suspended: "bg-red-500/20 text-red-400" };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">Agency Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {["pending", "active", "suspended"].map(s => (
          <div key={s} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-slate-400 text-xs uppercase mb-1">{s}</div>
            <div className="text-white text-xl font-bold">{agencies.filter(a => a.status === s).length}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-[#1a1a35] border-white/10">
            {["all", "pending", "active", "suspended"].map(s => (
              <SelectItem key={s} value={s} className="text-white capitalize">{s === "all" ? "All" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map(agency => (
          <div key={agency.id} className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                {agency.logo_url ? <img src={agency.logo_url} className="w-10 h-10 rounded-lg object-cover" /> : <Building2 className="w-6 h-6 text-slate-400" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{agency.name}</h3>
                  <Badge className={statusColor[agency.status]}>{agency.status}</Badge>
                  <span className={`text-sm font-medium capitalize ${tierColor[agency.tier]}`}>
                    {agency.tier} tier
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">{agency.description || "No description"}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{agency.total_hosts} hosts</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />💎 {formatNumber(agency.total_earnings_diamonds)}</span>
                  <span>{agency.commission_rate}% commission</span>
                  {agency.contact_email && <span>{agency.contact_email}</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {agency.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => updateMutation.mutate({ id: agency.id, data: { status: "active" } })} className="bg-green-600 hover:bg-green-700 text-white gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: agency.id, data: { status: "suspended" } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-1">
                      <XCircle className="w-3.5 h-3.5" />Reject
                    </Button>
                  </>
                )}
                {agency.status === "active" && (
                  <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: agency.id, data: { status: "suspended" } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                    Suspend
                  </Button>
                )}
                {agency.status === "suspended" && (
                  <Button size="sm" onClick={() => updateMutation.mutate({ id: agency.id, data: { status: "active" } })} className="bg-green-600 text-white">
                    Reinstate
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No agencies found</p>
          </div>
        )}
      </div>
    </div>
  );
}