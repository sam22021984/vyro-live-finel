// Flutter Migration: lib/features/admin/screens/admin_withdrawals.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Wallet, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatNumber, diamondsToUSD } from "@/lib/utils";

export default function AdminWithdrawals() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [noteInput, setNoteInput] = useState({});

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["admin-withdrawals-all"],
    queryFn: () => base44.entities.WithdrawRequest.list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WithdrawRequest.update(id, data),
    onSuccess: () => { toast.success("Withdrawal updated"); qc.invalidateQueries(["admin-withdrawals-all"]); },
  });

  const filtered = withdrawals.filter(w => statusFilter === "all" || w.status === statusFilter);
  const totalPending = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + (w.usd_equivalent || 0), 0);
  const totalPaid = withdrawals.filter(w => w.status === "paid").reduce((s, w) => s + (w.usd_equivalent || 0), 0);

  const statusColor = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-blue-500/20 text-blue-400",
    paid: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  const approve = (w) => updateMutation.mutate({ id: w.id, data: { status: "approved", processed_at: new Date().toISOString(), admin_note: noteInput[w.id] || "" } });
  const pay = (w) => updateMutation.mutate({ id: w.id, data: { status: "paid", processed_at: new Date().toISOString() } });
  const reject = (w) => updateMutation.mutate({ id: w.id, data: { status: "rejected", processed_at: new Date().toISOString(), admin_note: noteInput[w.id] || "" } });

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">Withdrawal Requests</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", value: withdrawals.filter(w => w.status === "pending").length, amount: totalPending, color: "border-yellow-500/20 bg-yellow-500/5" },
          { label: "Approved", value: withdrawals.filter(w => w.status === "approved").length, amount: 0, color: "border-blue-500/20 bg-blue-500/5" },
          { label: "Paid Out", value: withdrawals.filter(w => w.status === "paid").length, amount: totalPaid, color: "border-green-500/20 bg-green-500/5" },
          { label: "Rejected", value: withdrawals.filter(w => w.status === "rejected").length, amount: 0, color: "border-red-500/20 bg-red-500/5" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <div className="text-slate-400 text-xs uppercase mb-1">{s.label}</div>
            <div className="text-white text-xl font-bold">{s.value}</div>
            {s.amount > 0 && <div className="text-slate-400 text-xs">${s.amount.toFixed(2)} USD</div>}
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a35] border-white/10">
            {["all", "pending", "approved", "paid", "rejected"].map(s => (
              <SelectItem key={s} value={s} className="text-white capitalize">{s === "all" ? "All Status" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-slate-500 text-sm">{filtered.length} requests</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading && Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
        ))}
        {filtered.map(w => (
          <div key={w.id} className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">💎 {formatNumber(w.diamonds_amount)} · ${w.usd_equivalent?.toFixed(2)}</div>
                    <div className="text-slate-500 text-xs">{w.payment_method?.replace(/_/g, " ")} · {new Date(w.created_date).toLocaleString()}</div>
                  </div>
                  <Badge className={statusColor[w.status]}>{w.status}</Badge>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 text-slate-300 text-xs font-mono">{w.payment_details || "No payment details"}</div>
                {w.admin_note && <div className="mt-2 text-slate-400 text-xs">Note: {w.admin_note}</div>}
                <div className="mt-3">
                  <Input
                    placeholder="Admin note..."
                    value={noteInput[w.id] || ""}
                    onChange={e => setNoteInput(n => ({ ...n, [w.id]: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 text-xs h-8"
                  />
                </div>
              </div>
              <div className="flex md:flex-col gap-2 flex-shrink-0">
                {w.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => approve(w)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => reject(w)} className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-1">
                      <XCircle className="w-3.5 h-3.5" />Reject
                    </Button>
                  </>
                )}
                {w.status === "approved" && (
                  <Button size="sm" onClick={() => pay(w)} className="bg-green-600 hover:bg-green-700 text-white gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />Mark Paid
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No {statusFilter === "all" ? "" : statusFilter} withdrawals</p>
          </div>
        )}
      </div>
    </div>
  );
}