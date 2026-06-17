/**
 * Finance Module — Premium Fintech Dashboard
 * Access: More Services → Finance
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Bell, HelpCircle } from "lucide-react";
import FinanceWallet       from "@/components/finance/FinanceWallet";
import FinanceRecharge     from "@/components/finance/FinanceRecharge";
import FinanceWithdrawal   from "@/components/finance/FinanceWithdrawal";
import FinanceCPExchange   from "@/components/finance/FinanceCPExchange";
import FinanceEarnings     from "@/components/finance/FinanceEarnings";

const SECTIONS = [
  { id: "wallet",    label: "Wallet",           icon: "💳", color: "#1F6BFF", desc: "Coins, Diamonds, CP & Cash" },
  { id: "recharge",  label: "Recharge",         icon: "⚡", color: "#FFC83D", desc: "Buy coins packages" },
  { id: "withdraw",  label: "Withdrawal Center", icon: "💸", color: "#10B981", desc: "Withdraw your earnings" },
  { id: "exchange",  label: "CP Exchange",       icon: "🔄", color: "#8B5CF6", desc: "Convert between currencies" },
  { id: "earnings",  label: "Earnings Center",   icon: "📈", color: "#EC4899", desc: "Analytics & reports" },
];

const SECTION_COMPONENTS = {
  wallet:   <FinanceWallet />,
  recharge: <FinanceRecharge />,
  withdraw: <FinanceWithdrawal />,
  exchange: <FinanceCPExchange />,
  earnings: <FinanceEarnings />,
};

export default function Finance() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const current = SECTIONS.find(s => s.id === active);

  return (
    <div style={{ minHeight: "100dvh", width: "100%", maxWidth: "100vw", overflowX: "hidden", boxSizing: "border-box", background: "#F5F7FA", fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: "max(90px,calc(90px + env(safe-area-inset-bottom,0px)))" }}>

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #F0F0F8",
        padding: "12px 16px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button whileTap={{ scale: 0.88 }}
            onClick={() => active ? setActive(null) : navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#374151" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0D1B3E" }}>
              {current ? `${current.icon} ${current.label}` : "Finance"}
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>
              {current ? current.desc : "Wallet · Recharge · Withdraw · Exchange · Earnings"}
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.88 }}
            style={{ width: 34, height: 34, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={16} color="#374151" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.88 }}
            style={{ width: 34, height: 34, borderRadius: "50%", background: "#F5F7FA", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <HelpCircle size={16} color="#374151" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: "16px" }}>

            {/* Hero Balance Card */}
            <div style={{
              background: "linear-gradient(135deg,#0D1B3E,#1F6BFF)",
              borderRadius: 20, padding: "20px", marginBottom: 16,
              boxShadow: "0 8px 28px rgba(31,107,255,0.28)",
            }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>TOTAL BALANCE</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginBottom: 4 }}>0 <span style={{ fontSize: 16, fontWeight: 600 }}>Coins</span></div>
              <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                {[
                  { label: "Diamonds", value: "0 💎" },
                  { label: "CP",       value: "0 CP" },
                  { label: "Cash",     value: "$0.00" },
                ].map(b => (
                  <div key={b.label} style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 10px" }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{b.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16, width: "100%" }}>
              {[
                { id: "recharge", label: "Recharge", icon: "⚡", color: "#FFC83D" },
                { id: "withdraw", label: "Withdraw", icon: "💸", color: "#10B981" },
                { id: "exchange", label: "Exchange", icon: "🔄", color: "#8B5CF6" },
                { id: "earnings", label: "Earnings", icon: "📈", color: "#EC4899" },
              ].map(a => (
                <motion.button key={a.id} whileTap={{ scale: 0.92 }} onClick={() => setActive(a.id)}
                  style={{ background: "#fff", borderRadius: 14, padding: "12px 4px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.icon}</div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#374151" }}>{a.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Section Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SECTIONS.map((s, i) => (
                <motion.button key={s.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActive(s.id)}
                  style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{s.icon}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0D1B3E" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <ChevronRight size={16} color={s.color} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key={active}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {SECTION_COMPONENTS[active]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}