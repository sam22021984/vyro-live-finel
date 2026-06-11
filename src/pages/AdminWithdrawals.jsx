// ============================================================
// SCREEN: Admin — Withdrawal Management
// Flutter Migration: lib/features/admin/screens/admin_withdrawals_screen.dart
// ============================================================
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatNumber, diamondsToUSD, timeAgo } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminWithdrawals() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [txRef, setTxRef] = useState("");

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ["admin-withdrawals-list", statusFilter],
    queryFn: () => statusFilter === "all"
      ? base44.entities.WithdrawRequest.list("-created_date", 100)
      : base44.entities.WithdrawRequest.filter({ status: statusFilter }, "-created_date", 100),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => base44.entities.User.list(),
  });
  const userMap = {};
  users.forEach(u => { userMap[u.id] = u; });

  const approveMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.WithdrawRequest.update(id, {
      status,
      admin_note: adminNote,
      transaction_ref: txRef,
      processed_at: new Date().toISOString(),
    }),
    onSuccess: () => {
      toast.success("Withdrawal updated");
      qc.invalidateQueries(["admin-withdrawals-list"]);
      setSelected(null); setAdminNote(""); setTxRef("");
    },
  });

  const statusConfig = {
    pending: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
    approved: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: CheckCircle },
    paid: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle },
    rejected: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
  };

  const totalPending = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + (w.diamonds_amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Withdrawal Requests</h1>
          <p className="text-slate-400 text-sm">💎 {formatNumber(totalPending)} diamonds pending ≈ ${diamondsToUSD(totalPending)}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-5 border-b border-white/10 pb-4">
        {["pending", "approved", "paid", "rejected", "all"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              statusFilter === s ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[#1A1A35] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["User", "Amount", "Method", "Details", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-slate-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? Array(6).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 bg-white/5 rounded animate-pulse" /></td></tr>
              )) : withdrawals.map(w => {
                const sc = statusConfig[w.status] || statusConfig.pending;
                const Icon = sc.icon;
                const u = userMap[w.user_id];
                return (
                  <tr key={w.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-medium">{u?.full_name || u?.email || "Unknown"}</div>
                      <div className="text-slate-500 text-xs">{u?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-yellow-400 font-bold">💎 {formatNumber(w.diamonds_amount)}</div>
                      <div className="text-slate-500 text-xs">${diamondsToUSD(w.diamonds_amount)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-300 text-sm capitalize">{w.payment_method?.replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[140px]">
                      <span className="text-slate-400 text-xs truncate block">{w.payment_details}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-500 text-xs">{timeAgo(w.created_date)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${sc.bg}`}>
                        <Icon className={`w-3 h-3 ${sc.color}`} />
                        <span className={sc.color + " capitalize"}>{w.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="text-purple-400"
                        onClick={() => { setSelected(w); setAdminNote(w.admin_note || ""); setTxRef(w.transaction_ref || ""); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {withdrawals.length === 0 && !isLoading && (
          <div className="text-center py-10 text-slate-500 text-sm">No withdrawal requests</div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-[#1A1A35] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Process Withdrawal</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between"><span className="text-slate-400 text-sm">Amount</span><span className="text-yellow-400 font-bold">💎 {formatNumber(selected.diamonds_amount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 text-sm">USD</span><span className="text-white">${diamondsToUSD(selected.diamonds_amount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 text-sm">Method</span><span className="text-white capitalize">{selected.payment_method?.replace("_", " ")}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 text-sm">Details</span><span className="text-white text-xs">{selected.payment_details}</span></div>
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1">Transaction Reference</label>
                <Input value={txRef} onChange={e => setTxRef(e.target.value)} placeholder="TX-123456..." className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1">Admin Note</label>
                <Input value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Optional note..." className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => approveMutation.mutate({ id: selected.id, status: "paid" })}>
                  ✓ Mark as Paid
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => approveMutation.mutate({ id: selected.id, status: "approved" })}>
                  Approve
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => approveMutation.mutate({ id: selected.id, status: "rejected" })}>
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}