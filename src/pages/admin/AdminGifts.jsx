// Flutter Migration: lib/features/admin/screens/admin_gifts.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GIFT_CATEGORIES } from "@/lib/constants";

const EMPTY_GIFT = { name: "", icon_url: "🎁", coin_cost: 10, diamond_value: 5, category: "basic", is_active: true, sort_order: 0 };

export default function AdminGifts() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_GIFT);

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ["admin-gifts-list"],
    queryFn: () => base44.entities.Gift.list("sort_order"),
  });

  const saveMutation = useMutation({
    mutationFn: () => editing ? base44.entities.Gift.update(editing.id, form) : base44.entities.Gift.create(form),
    onSuccess: () => { toast.success(editing ? "Gift updated" : "Gift created"); qc.invalidateQueries(["admin-gifts-list"]); setShowForm(false); setEditing(null); setForm(EMPTY_GIFT); },
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.Gift.delete(id),
    onSuccess: () => { toast.success("Gift deleted"); qc.invalidateQueries(["admin-gifts-list"]); },
  });

  const openEdit = (gift) => { setEditing(gift); setForm({ ...gift }); setShowForm(true); };

  const catColor = { basic: "bg-slate-500/20 text-slate-400", premium: "bg-blue-500/20 text-blue-400", luxury: "bg-yellow-500/20 text-yellow-400", special: "bg-purple-500/20 text-purple-400", seasonal: "bg-green-500/20 text-green-400" };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Gift Management</h1>
        <Button onClick={() => { setEditing(null); setForm(EMPTY_GIFT); setShowForm(true); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white gap-2">
          <Plus className="w-4 h-4" />Add Gift
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#12122A] rounded-2xl border border-white/10 p-6">
          <h2 className="text-white font-semibold mb-4">{editing ? "Edit Gift" : "New Gift"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="text-slate-400 text-xs mb-1.5 block">Name</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-white/5 border-white/10 text-white" placeholder="Gift name" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Icon (emoji)</label>
              <Input value={form.icon_url} onChange={e => setForm(f => ({ ...f, icon_url: e.target.value }))} className="bg-white/5 border-white/10 text-white text-xl text-center" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Category</label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#1a1a35] border-white/10">
                  {GIFT_CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-white capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Coin Cost</label>
              <Input type="number" value={form.coin_cost} onChange={e => setForm(f => ({ ...f, coin_cost: parseInt(e.target.value) || 0 }))} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Diamond Value</label>
              <Input type="number" value={form.diamond_value} onChange={e => setForm(f => ({ ...f, diamond_value: parseInt(e.target.value) || 0 }))} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Sort Order</label>
              <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.name} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {saveMutation.isPending ? "Saving..." : "Save Gift"}
            </Button>
            <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); }} className="text-slate-400">Cancel</Button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {gifts.map(gift => (
          <div key={gift.id} className={`bg-[#12122A] rounded-2xl border p-4 flex flex-col items-center gap-2 relative ${gift.is_active ? "border-white/10" : "border-white/5 opacity-50"}`}>
            <span className="text-4xl">{gift.icon_url || "🎁"}</span>
            <div className="text-white text-sm font-medium text-center">{gift.name}</div>
            <Badge className={catColor[gift.category]}>{gift.category}</Badge>
            <div className="flex gap-2 text-xs">
              <span className="text-yellow-400">🪙{gift.coin_cost}</span>
              <span className="text-slate-500">→</span>
              <span className="text-blue-400">💎{gift.diamond_value}</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => openEdit(gift)} className="w-7 h-7 p-0 text-slate-400 hover:text-white">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(gift.id)} className="w-7 h-7 p-0 text-slate-500 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && gifts.length === 0 && (
          <div className="col-span-6 text-center py-16 text-slate-600">
            <Gift className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No gifts yet. Add some!</p>
          </div>
        )}
      </div>
    </div>
  );
}