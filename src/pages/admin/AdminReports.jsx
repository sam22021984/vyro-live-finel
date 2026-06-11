// Flutter Migration: lib/features/admin/screens/admin_reports.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, CheckCircle, XCircle, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminReports() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [noteInput, setNoteInput] = useState({});

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports-all"],
    queryFn: () => base44.entities.Report.list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Report.update(id, data),
    onSuccess: () => { toast.success("Report updated"); qc.invalidateQueries(["admin-reports-all"]); },
  });

  const filtered = reports.filter(r => statusFilter === "all" || r.status === statusFilter);

  const statusColor = {
    pending: "bg-yellow-500/20 text-yellow-400",
    reviewed: "bg-blue-500/20 text-blue-400",
    resolved: "bg-green-500/20 text-green-400",
    dismissed: "bg-slate-500/20 text-slate-400",
  };

  const reasonColor = {
    spam: "bg-orange-500/20 text-orange-400",
    harassment: "bg-red-500/20 text-red-400",
    inappropriate_content: "bg-red-600/20 text-red-500",
    fake_account: "bg-yellow-500/20 text-yellow-400",
    underage: "bg-purple-500/20 text-purple-400",
    scam: "bg-red-500/20 text-red-400",
    other: "bg-slate-500/20 text-slate-400",
  };

  const resolve = (r, action) => updateMutation.mutate({
    id: r.id,
    data: { status: "resolved", action_taken: action, admin_note: noteInput[r.id] || "" }
  });

  const dismiss = (r) => updateMutation.mutate({
    id: r.id,
    data: { status: "dismissed", action_taken: "none", admin_note: noteInput[r.id] || "" }
  });

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">User Reports</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["pending", "reviewed", "resolved", "dismissed"].map(s => {
          const count = reports.filter(r => r.status === s).length;
          return (
            <div key={s} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-slate-400 text-xs uppercase mb-1">{s}</div>
              <div className="text-white text-xl font-bold">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a35] border-white/10">
            {["all", "pending", "reviewed", "resolved", "dismissed"].map(s => (
              <SelectItem key={s} value={s} className="text-white capitalize">{s === "all" ? "All" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-slate-500 text-sm self-center">{filtered.length} reports</span>
      </div>

      {/* Reports */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={reasonColor[r.reason]}>{r.reason?.replace(/_/g, " ")}</Badge>
                  <Badge className={statusColor[r.status]}>{r.status}</Badge>
                  {r.action_taken && r.action_taken !== "none" && (
                    <Badge className="bg-red-600/20 text-red-300">{r.action_taken?.replace(/_/g, " ")}</Badge>
                  )}
                </div>
                <div className="text-slate-300 text-sm mb-1">{r.description || "No description provided"}</div>
                <div className="text-slate-500 text-xs">Reported user: <span className="text-slate-300">{r.reported_user_id}</span> · {new Date(r.created_date).toLocaleString()}</div>
                {r.admin_note && <div className="text-slate-400 text-xs mt-1">Admin note: {r.admin_note}</div>}
                <Input
                  placeholder="Admin note..."
                  value={noteInput[r.id] || ""}
                  onChange={e => setNoteInput(n => ({ ...n, [r.id]: e.target.value }))}
                  className="mt-3 bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-xs h-8"
                />
              </div>
              {r.status === "pending" && (
                <div className="flex md:flex-col gap-2 flex-shrink-0">
                  <Button size="sm" onClick={() => resolve(r, "warning")} className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />Warn
                  </Button>
                  <Button size="sm" onClick={() => resolve(r, "ban_temp")} className="bg-orange-600 hover:bg-orange-700 text-white text-xs gap-1">
                    <Shield className="w-3.5 h-3.5" />Temp Ban
                  </Button>
                  <Button size="sm" onClick={() => resolve(r, "ban_permanent")} className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1">
                    <XCircle className="w-3.5 h-3.5" />Perm Ban
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => dismiss(r)} className="text-slate-400 hover:bg-white/5 text-xs gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />Dismiss
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Flag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No {statusFilter === "all" ? "" : statusFilter} reports</p>
          </div>
        )}
      </div>
    </div>
  );
}