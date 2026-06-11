// Flutter Migration: lib/features/host/screens/earnings_screen.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Wallet, ArrowDownToLine, Clock, CheckCircle, XCircle, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatNumber, diamondsToUSD } from "@/lib/utils";
import { MIN_WITHDRAW_DIAMONDS, DIAMOND_TO_USD } from "@/lib/constants";

export default function HostEarnings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [form, setForm] = useState({ diamonds_amount: "", payment_method: "bank_transfer", payment_details: "" });

  const { data: giftTxns = [] } = useQuery({
    queryKey: ["host-gifts-all", user?.id],
    queryFn: () => base44.entities.GiftTransaction.filter({ receiver_id: user?.id }, "-created_date", 100),
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ["host-withdrawals-all", user?.id],
    queryFn: () => base44.entities.WithdrawRequest.filter({ user_id: user?.id }, "-created_date", 20),
  });

  const totalDiamonds = giftTxns.reduce((s, t) => s + (t.diamonds_earned || 0), 0);
  const withdrawnDiamonds = withdrawals.filter(w => w.status === "paid").reduce((s, w) => s + (w.diamonds_amount || 0), 0);
  const pendingDiamonds = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + (w.diamonds_amount || 0), 0);
  const availableDiamonds = Math.max(0, totalDiamonds - withdrawnDiamonds - pendingDiamonds);

  const withdrawMutation = useMutation({
    mutationFn: () => {
      const amount = parseInt(form.diamonds_amount);
      if (amount < MIN_WITHDRAW_DIAMONDS) throw new Error(`Minimum withdrawal is ${MIN_WITHDRAW_DIAMONDS} diamonds`);
      if (amount > availableDiamonds) throw new Error("Insufficient diamonds");
      return base44.entities.WithdrawRequest.create({
        user_id: user.id,
        diamonds_amount: amount,
        usd_equivalent: diamondsToUSD(amount),
        payment_method: form.payment_method,
        payment_details: form.payment_details,
        exchange_rate: DIAMOND_TO_USD,
      });
    },
    onSuccess: () => {
      toast.success("Withdrawal request submitted!");
      setShowWithdraw(false);
      setForm({ diamonds_amount: "", payment_method: "bank_transfer", payment_details: "" });
      qc.invalidateQueries(["host-withdrawals-all"]);
    },
    onError: e => toast.error(e.message),
  });

  const statusIcon = { pending: Clock, approved: CheckCircle, paid: CheckCircle, rejected: XCircle };
  const statusColor = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-blue-500/20 text-blue-400",
    paid: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">Earnings & Withdrawals</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Earned", value: totalDiamonds, usd: diamondsToUSD(totalDiamonds), color: "from-yellow-600/30 to-orange-600/20 border-yellow-500/20" },
          { label: "Available", value: availableDiamonds, usd: diamondsToUSD(availableDiamonds), color: "from-green-600/30 to-green-900/20 border-green-500/20" },
          { label: "Pending", value: pendingDiamonds, usd: diamondsToUSD(pendingDiamonds), color: "from-blue-600/30 to-blue-900/20 border-blue-500/20" },
          { label: "Withdrawn", value: withdrawnDiamonds, usd: diamondsToUSD(withdrawnDiamonds), color: "from-purple-600/30 to-purple-900/20 border-purple-500/20" },
        ].map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl border p-4`}>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{card.label}</p>
            <p className="text-white text-xl font-bold">💎 {formatNumber(card.value)}</p>
            <p className="text-slate-400 text-xs mt-1">${card.usd.toFixed(2)} USD</p>
          </div>
        ))}
      </div>

      {/* Withdraw Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowWithdraw(!showWithdraw)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white gap-2"
          disabled={availableDiamonds < MIN_WITHDRAW_DIAMONDS}
        >
          <ArrowDownToLine className="w-4 h-4" />
          Request Withdrawal
        </Button>
      </div>

      {/* Withdraw Form */}
      {showWithdraw && (
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-white font-semibold">New Withdrawal Request</h2>
          <p className="text-slate-400 text-sm">Available: 💎 {formatNumber(availableDiamonds)} · Min: 💎 {MIN_WITHDRAW_DIAMONDS}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Diamonds Amount</label>
              <Input
                type="number"
                placeholder={`Min ${MIN_WITHDRAW_DIAMONDS}`}
                value={form.diamonds_amount}
                onChange={e => setForm(f => ({ ...f, diamonds_amount: e.target.value }))}
                className="bg-white/5 border-white/10 text-white"
              />
              {form.diamonds_amount && (
                <p className="text-green-400 text-xs mt-1">≈ ${diamondsToUSD(parseInt(form.diamonds_amount) || 0).toFixed(2)}</p>
              )}
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Payment Method</label>
              <Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a35] border-white/10">
                  {["bank_transfer", "paypal", "wise", "crypto", "other"].map(m => (
                    <SelectItem key={m} value={m} className="text-white capitalize">{m.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Payment Details</label>
              <Input
                placeholder="Account / address..."
                value={form.payment_details}
                onChange={e => setForm(f => ({ ...f, payment_details: e.target.value }))}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => withdrawMutation.mutate()} disabled={withdrawMutation.isPending} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {withdrawMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
            <Button variant="ghost" onClick={() => setShowWithdraw(false)} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Withdrawal History</h2>
        <div className="space-y-3">
          {withdrawals.map(w => {
            const Icon = statusIcon[w.status] || Clock;
            return (
              <div key={w.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${statusColor[w.status]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">💎 {formatNumber(w.diamonds_amount)} · ${w.usd_equivalent?.toFixed(2)}</div>
                  <div className="text-slate-500 text-xs">{w.payment_method?.replace("_", " ")} · {new Date(w.created_date).toLocaleDateString()}</div>
                </div>
                <Badge className={statusColor[w.status]}>{w.status}</Badge>
              </div>
            );
          })}
          {withdrawals.length === 0 && (
            <div className="text-center py-8 text-slate-600">
              <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No withdrawal requests yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Gifts */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Recent Gifts</h2>
        <div className="space-y-2">
          {giftTxns.slice(0, 10).map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <span className="text-2xl">{t.gift_icon_url || "🎁"}</span>
              <div className="flex-1">
                <div className="text-white text-sm">{t.gift_name} × {t.quantity}</div>
                <div className="text-slate-500 text-xs">🪙 {t.coins_spent} spent · 💎 {t.diamonds_earned} earned</div>
              </div>
              <span className="text-slate-500 text-xs">{new Date(t.created_date).toLocaleDateString()}</span>
            </div>
          ))}
          {giftTxns.length === 0 && (
            <div className="text-center py-8 text-slate-600 text-sm">No gifts received yet</div>
          )}
        </div>
      </div>
    </div>
  );
}