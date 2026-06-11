// Flutter Migration: lib/features/live_room/widgets/gift_panel.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { X, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GIFT_CATEGORIES } from "@/lib/constants";

export default function GiftPanel({ roomId, hostId, onClose }) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("basic");
  const [selectedGift, setSelectedGift] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const qc = useQueryClient();

  const { data: gifts = [] } = useQuery({
    queryKey: ["gifts", selectedCategory],
    queryFn: () => base44.entities.Gift.filter({ is_active: true, category: selectedCategory }, "sort_order"),
  });

  const sendMutation = useMutation({
    mutationFn: async (gift) => {
      const totalCost = gift.coin_cost * quantity;
      if ((user?.coin_balance || 0) < totalCost) {
        throw new Error("Insufficient coins");
      }
      await base44.entities.GiftTransaction.create({
        sender_id: user.id,
        receiver_id: hostId,
        room_id: roomId,
        gift_id: gift.id,
        gift_name: gift.name,
        gift_icon_url: gift.icon_url,
        quantity,
        coins_spent: totalCost,
        diamonds_earned: gift.diamond_value * quantity,
      });
    },
    onSuccess: () => {
      toast.success(`Gift sent! 🎁`);
      qc.invalidateQueries(["gift-txns"]);
      setSelectedGift(null);
      setQuantity(1);
    },
    onError: (e) => toast.error(e.message || "Failed to send gift"),
  });

  const catIcons = { basic: "🎁", premium: "💫", luxury: "👑", special: "⚡", seasonal: "🌸" };

  return (
    <div className="border-t border-white/10 bg-[#0D0D1A] flex flex-col max-h-80">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-white font-semibold text-sm">Send Gift</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <span>🪙</span>
            <span className="font-bold">{(user?.coin_balance || 0).toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-white/10">
        {GIFT_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-1 py-2 text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "text-purple-400 border-b-2 border-purple-500"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {catIcons[cat]}
          </button>
        ))}
      </div>

      {/* Gift Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-4 gap-2">
          {gifts.length === 0 && (
            <div className="col-span-4 text-center text-slate-600 py-4 text-xs">No gifts in this category</div>
          )}
          {gifts.map(gift => (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              className={`rounded-xl p-2 flex flex-col items-center gap-1 transition-all ${
                selectedGift?.id === gift.id
                  ? "bg-purple-600/30 border border-purple-500"
                  : "bg-white/5 border border-white/10 hover:border-purple-500/50"
              }`}
            >
              <span className="text-2xl">{gift.icon_url || "🎁"}</span>
              <span className="text-white text-xs font-medium truncate w-full text-center">{gift.name}</span>
              <div className="flex items-center gap-0.5">
                <span className="text-yellow-400" style={{ fontSize: 10 }}>🪙</span>
                <span className="text-yellow-400" style={{ fontSize: 10 }}>{gift.coin_cost}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Send Bar */}
      {selectedGift && (
        <div className="flex items-center gap-2 p-3 border-t border-white/10">
          <div className="flex items-center gap-1 bg-white/5 rounded-lg border border-white/10">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 text-white text-sm">-</button>
            <span className="text-white text-sm px-1">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(99, quantity + 1))} className="px-2 py-1 text-white text-sm">+</button>
          </div>
          <div className="flex-1 text-xs text-slate-400">
            Total: <span className="text-yellow-400 font-bold">{selectedGift.coin_cost * quantity} coins</span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            onClick={() => sendMutation.mutate(selectedGift)}
            disabled={sendMutation.isPending}
          >
            Send 🎁
          </Button>
        </div>
      )}
    </div>
  );
}