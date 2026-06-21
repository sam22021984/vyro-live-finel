/**
 * FinanceWallet — Live wallet balances + transactions from Supabase
 * Tables: coin_wallets, user_wallets, coin_reward_transactions
 */
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const fmtN = n => {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `${(n/1_000).toFixed(1)}K`;
  return String(n);
};

const TXN_ICONS = { gift_sent: "🎁", gift_received: "🌹", recharge: "💰", withdrawal: "💸", reward: "🏆", transfer: "↗️" };

export default function FinanceWallet() {
  const { user: authUser } = useAuth();
  const [wallet,     setWallet]     = useState({ coins: 0, diamonds: 0, cp: 0, cash: 0, pending: 0 });
  const [txns,       setTxns]       = useState([]);
  const [loadingW,   setLoadingW]   = useState(true);
  const [loadingT,   setLoadingT]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWallet = useCallback(async () => {
    if (!authUser?.id) return;
    try {
      // coin_wallets
      const cw = await base44.functions.invoke('supabaseQuery', {
        table: 'coin_wallets', method: 'GET', select: 'balance,diamonds_balance,cp_balance',
        filters: { user_id: `eq.${authUser.id}` }, limit: 1,
      });
      const c = cw?.data?.data?.[0];

      // user_wallets (cash / withdrawal balance)
      const uw = await base44.functions.invoke('supabaseQuery', {
        table: 'user_wallets', method: 'GET', select: 'cash_balance,pending_earnings',
        filters: { user_id: `eq.${authUser.id}` }, limit: 1,
      });
      const u = uw?.data?.data?.[0];

      setWallet({
        coins:    c?.balance           || 0,
        diamonds: c?.diamonds_balance  || 0,
        cp:       c?.cp_balance        || 0,
        cash:     u?.cash_balance      || 0,
        pending:  u?.pending_earnings  || 0,
      });
    } catch { /* ignore */ }
    setLoadingW(false);
  }, [authUser?.id]);

  const loadTransactions = useCallback(async () => {
    if (!authUser?.id) return;
    try {
      const res = await base44.functions.invoke('supabaseQuery', {
        table: 'coin_reward_transactions', method: 'GET',
        select: 'txn_type,amount,currency,description,created_at',
        filters: { user_id: `eq.${authUser.id}` },
        order: 'created_at.desc', limit: 10,
      });
      setTxns(res?.data?.data || []);
    } catch { /* ignore */ }
    setLoadingT(false);
  }, [authUser?.id]);

  useEffect(() => {
    loadWallet();
    loadTransactions();
    // Poll every 20s for near-realtime balance updates
    const t = setInterval(() => { loadWallet(); loadTransactions(); }, 20000);
    return () => clearInterval(t);
  }, [loadWallet, loadTransactions]);

  const refresh = async () => {
    setRefreshing(true);
    await Promise.all([loadWallet(), loadTransactions()]);
    setRefreshing(false);
    toast.success("Wallet updated.");
  };

  const BALANCES = [
    { label: "Coins Balance",         value: loadingW ? "…" : fmtN(wallet.coins),                icon: "🪙", color: "#FFC83D" },
    { label: "Diamonds Balance",      value: loadingW ? "…" : `${fmtN(wallet.diamonds)} 💎`,     icon: "💎", color: "#60A5FA" },
    { label: "CP Balance",            value: loadingW ? "…" : `${fmtN(wallet.cp)} CP`,           icon: "🔷", color: "#8B5CF6" },
    { label: "Cash Balance",          value: loadingW ? "…" : `$${wallet.cash.toFixed(2)}`,      icon: "💵", color: "#10B981" },
    { label: "Pending Earnings",      value: loadingW ? "…" : `${fmtN(wallet.pending)} 💎`,      icon: "⏳", color: "#F59E0B" },
    { label: "Available Withdrawal",  value: loadingW ? "…" : `$${wallet.cash.toFixed(2)}`,      icon: "💸", color: "#EC4899" },
  ];

  return (
    <div style={{ padding: "14px" }}>
      {/* Balance Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {BALANCES.map((b, i) => (
          <motion.div key={b.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: "#fff", borderRadius: 16, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{b.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: b.color }}>{b.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{b.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Recharge", icon: "⚡", color: "#FFC83D", bg: "#FFFBEB" },
          { label: "Withdraw", icon: "💸", color: "#10B981", bg: "#ECFDF5" },
          { label: "Transfer", icon: "↗️", color: "#1F6BFF", bg: "#EFF6FF" },
        ].map(a => (
          <motion.button key={a.label} whileTap={{ scale: 0.93 }}
            onClick={() => toast.info(`Opening ${a.label}...`)}
            style={{ background: a.bg, borderRadius: 14, padding: "12px 6px", border: `1px solid ${a.color}33`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 22 }}>{a.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: a.color }}>{a.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E" }}>🕒 Recent Transactions</div>
          {loadingT && <span style={{ fontSize: 9, color: "#9CA3AF" }}>Loading…</span>}
        </div>
        {txns.length === 0 && !loadingT ? (
          <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 12, padding: "12px 0" }}>No transactions yet</div>
        ) : (
          txns.map((t, i) => {
            const isCredit = t.amount > 0;
            const icon = TXN_ICONS[t.txn_type] || (isCredit ? "💰" : "💸");
            const date = t.created_at ? new Date(t.created_at).toLocaleDateString("en-QA", { month: "short", day: "numeric" }) : "";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < txns.length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0D1B3E" }}>{t.description || t.txn_type}</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{date}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: isCredit ? "#10B981" : "#EF4444" }}>
                  {isCredit ? "+" : ""}{fmtN(Math.abs(t.amount))} {t.currency || "🪙"}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Refresh */}
      <motion.button whileTap={{ scale: 0.96 }} onClick={refresh}
        style={{ width: "100%", padding: "13px", borderRadius: 14, background: refreshing ? "#F0F7FF" : "#fff", border: "1px solid #BFDBFE", fontWeight: 800, cursor: "pointer", color: "#1F6BFF", fontSize: 13 }}>
        {refreshing ? "Syncing…" : "🔄 Refresh Balance"}
      </motion.button>
    </div>
  );
}