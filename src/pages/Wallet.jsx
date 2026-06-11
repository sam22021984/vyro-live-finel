// Flutter Migration: lib/features/wallet/screens/wallet_screen.dart
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Coins, Gift, Crown, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatNumber, coinsToUSD } from "@/lib/utils";
import { VIP_TIERS } from "@/lib/constants";

export default function Wallet() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedVIP, setSelectedVIP] = useState(null);

  const { data: packages = [] } = useQuery({
    queryKey: ["coin-packages"],
    queryFn: () => base44.entities.CoinPackage.filter({ is_active: true }, "sort_order"),
  });

  const { data: giftTxns = [] } = useQuery({
    queryKey: ["wallet-gifts", user?.id],
    queryFn: () => base44.entities.GiftTransaction.filter({ sender_id: user?.id }, "-created_date", 20),
  });

  const { data: vipSubs = [] } = useQuery({
    queryKey: ["vip-subs", user?.id],
    queryFn: () => base44.entities.VIPSubscription.filter({ user_id: user?.id, status: "active" }),
  });

  const activeVIP = vipSubs[0];

  const handleBuyCoins = (pkg) => {
    toast.info("Redirecting to payment... 💳 (Payment integration required)");
  };

  const handleBuyVIP = (tier) => {
    toast.info("VIP subscription checkout... (Payment integration required)");
  };

  const vipDetails = {
    vip1: { name: "VIP Bronze", icon: "🥉", price_coins: 500, color: "#CD7F32", perks: ["Custom badge", "Priority chat", "5% gift bonus"] },
    vip2: { name: "VIP Silver", icon: "🥈", price_coins: 1500, color: "#C0C0C0", perks: ["Silver frame", "10% gift bonus", "Access premium rooms"] },
    vip3: { name: "VIP Gold", icon: "🥇", price_coins: 3000, color: "#FFD700", perks: ["Gold crown", "15% gift bonus", "VIP-only rooms"] },
    vip4: { name: "VIP Platinum", icon: "💎", price_coins: 6000, color: "#E5E4E2", perks: ["Platinum aura", "20% gift bonus", "Co-host privileges"] },
    vip5: { name: "VIP Diamond", icon: "👑", price_coins: 12000, color: "#B9F2FF", perks: ["Diamond status", "25% gift bonus", "All platform perks"] },
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] p-4 lg:p-6 space-y-6">
      <h1 className="text-white text-2xl font-bold">My Wallet</h1>

      {/* Balance */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #E91E63 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <p className="text-purple-300 text-sm mb-2">Coin Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">🪙 {formatNumber(user?.coin_balance || 0)}</span>
          </div>
          <p className="text-purple-300 text-sm mt-1">≈ ${coinsToUSD(user?.coin_balance || 0).toFixed(2)} USD</p>
          {activeVIP && (
            <div className="flex items-center gap-2 mt-3">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">{vipDetails[activeVIP.tier]?.name}</span>
              <span className="text-slate-400 text-xs">· Expires {new Date(activeVIP.expires_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Buy Coins */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Buy Coins</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {packages.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => handleBuyCoins(pkg)}
              className={`relative rounded-xl border p-4 text-left transition-all hover:border-purple-500/60 ${
                pkg.is_featured
                  ? "border-purple-500 bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {pkg.is_featured && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {pkg.badge_label || "Best Value"}
                </div>
              )}
              {pkg.icon_url ? (
                <div className="text-2xl mb-2">{pkg.icon_url}</div>
              ) : (
                <Coins className="w-6 h-6 text-yellow-400 mb-2" />
              )}
              <div className="text-white font-bold">🪙 {formatNumber(pkg.coins_amount)}</div>
              {pkg.bonus_coins > 0 && (
                <div className="text-green-400 text-xs">+{pkg.bonus_coins} bonus</div>
              )}
              <div className="text-slate-300 text-sm font-semibold mt-1">${pkg.price_usd}</div>
            </button>
          ))}
          {packages.length === 0 && (
            <div className="col-span-3 text-center py-8 text-slate-600">
              <Coins className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No packages available</p>
            </div>
          )}
        </div>
      </div>

      {/* VIP Subscriptions */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-1">VIP Status</h2>
        <p className="text-slate-400 text-sm mb-4">Unlock exclusive perks and premium features</p>
        <div className="space-y-3">
          {Object.entries(vipDetails).map(([key, vip]) => {
            const isActive = activeVIP?.tier === key;
            return (
              <div
                key={key}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isActive
                    ? "border-yellow-500/50 bg-yellow-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="text-3xl">{vip.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{vip.name}</span>
                    {isActive && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Active</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {vip.perks.map((p, i) => (
                      <span key={i} className="text-xs text-slate-400 bg-white/5 rounded-full px-2 py-0.5">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-white text-sm font-bold">🪙 {formatNumber(vip.price_coins)}</div>
                  <div className="text-slate-500 text-xs">/ month</div>
                  {!isActive && (
                    <Button size="sm" className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs h-7" onClick={() => handleBuyVIP(key)}>
                      Subscribe
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spend History */}
      <div className="bg-[#12122A] rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-semibold mb-4">Spending History</h2>
        <div className="space-y-2">
          {giftTxns.slice(0, 10).map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <span className="text-xl">{t.gift_icon_url || "🎁"}</span>
              <div className="flex-1">
                <div className="text-white text-sm">{t.gift_name} × {t.quantity}</div>
                <div className="text-slate-500 text-xs">{new Date(t.created_date).toLocaleDateString()}</div>
              </div>
              <span className="text-red-400 text-sm font-medium">-🪙 {t.coins_spent}</span>
            </div>
          ))}
          {giftTxns.length === 0 && (
            <div className="text-center py-6 text-slate-600 text-sm">No purchases yet</div>
          )}
        </div>
      </div>
    </div>
  );
}