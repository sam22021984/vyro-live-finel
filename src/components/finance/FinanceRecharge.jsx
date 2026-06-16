import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const PACKAGES = [
  { price: "$1",    coins: 20000,     bonus: 0,        total: 20000,      featured: false },
  { price: "$2",    coins: 40000,     bonus: 4000,     total: 44000,      featured: false },
  { price: "$3",    coins: 60000,     bonus: 5000,     total: 65000,      featured: false },
  { price: "$5",    coins: 100000,    bonus: 20000,    total: 120000,     featured: false },
  { price: "$10",   coins: 200000,    bonus: 50000,    total: 250000,     featured: true  },
  { price: "$20",   coins: 400000,    bonus: 100000,   total: 500000,     featured: false },
  { price: "$50",   coins: 1000000,   bonus: 300000,   total: 1300000,    featured: true  },
  { price: "$100",  coins: 2000000,   bonus: 700000,   total: 2700000,    featured: false },
  { price: "$200",  coins: 4000000,   bonus: 1600000,  total: 5600000,    featured: false },
  { price: "$500",  coins: 10000000,  bonus: 5000000,  total: 15000000,   featured: true  },
  { price: "$1000", coins: 20000000,  bonus: 12000000, total: 32000000,   featured: false },
  { price: "$2000", coins: 40000000,  bonus: 28000000, total: 68000000,   featured: false },
  { price: "$3000", coins: 60000000,  bonus: 45000000, total: 105000000,  featured: false },
  { price: "$4000", coins: 80000000,  bonus: 65000000, total: 145000000,  featured: false },
  { price: "$5000", coins: 100000000, bonus: 100000000,total: 200000000,  featured: true  },
];

const PAYMENT_METHODS = [
  { id: "card",      label: "Credit Card",  icon: "💳" },
  { id: "debit",     label: "Debit Card",   icon: "🏧" },
  { id: "paypal",    label: "PayPal",       icon: "🅿️" },
  { id: "jazzcash",  label: "JazzCash",     icon: "📱" },
  { id: "easypaisa", label: "EasyPaisa",    icon: "🟢" },
];

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000)    return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

export default function FinanceRecharge() {
  const [selected, setSelected]       = useState(null);
  const [payMethod, setPayMethod]     = useState("card");
  const [promo, setPromo]             = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const applyPromo = () => {
    if (promo.toLowerCase() === "vyro10") { setPromoApplied(true); toast.success("Promo code applied! 10% bonus."); }
    else toast.error("Invalid promo code.");
  };

  const buy = () => {
    setShowConfirm(false);
    toast.success(`Recharge of ${selected.price} completed! +${fmt(selected.total)} coins credited.`);
    setSelected(null);
  };

  return (
    <div style={{ padding: "14px" }}>
      {/* Packages */}
      <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 10 }}>⚡ Choose Package</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {PACKAGES.map((p, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(p)}
            style={{ background: selected === p ? "#EFF6FF" : "#fff", borderRadius: 16, padding: "14px 10px",
              border: `2px solid ${selected === p ? "#1F6BFF" : p.featured ? "#FFC83D44" : "#F0F0F8"}`,
              boxShadow: selected === p ? "0 4px 16px rgba(31,107,255,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
              cursor: "pointer", position: "relative", textAlign: "center" }}>
            {p.featured && (
              <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", padding: "2px 10px", borderRadius: 10, background: "linear-gradient(135deg,#FFC83D,#FDE68A)", fontSize: 9, fontWeight: 900, color: "#0D1B3E", whiteSpace: "nowrap" }}>⭐ POPULAR</div>
            )}
            {p.bonus > 0 && (
              <div style={{ position: "absolute", top: 6, right: 6, padding: "2px 6px", borderRadius: 8, background: "#ECFDF5", fontSize: 8, fontWeight: 900, color: "#10B981" }}>+{fmt(p.bonus)}</div>
            )}
            <div style={{ fontSize: 18, fontWeight: 900, color: "#1F6BFF", marginBottom: 2 }}>{p.price}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>🪙 {fmt(p.total)}</div>
            {p.bonus > 0 && <div style={{ fontSize: 9, color: "#10B981", marginTop: 2 }}>Includes bonus!</div>}
          </motion.button>
        ))}
      </div>

      {/* Payment Method */}
      <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 10 }}>💳 Payment Method</div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {PAYMENT_METHODS.map(m => (
          <button key={m.id} onClick={() => setPayMethod(m.id)}
            style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: "pointer", border: "none",
              background: payMethod === m.id ? "#1F6BFF" : "#fff",
              color: payMethod === m.id ? "#fff" : "#374151",
              boxShadow: payMethod === m.id ? "0 4px 12px rgba(31,107,255,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
            <span>{m.icon}</span><span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Promo Code */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", marginBottom: 14, display: "flex", gap: 8 }}>
        <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Enter promo code (try: VYRO10)"
          style={{ flex: 1, background: "#F5F7FA", border: "1px solid #E5E7EB", borderRadius: 10, padding: "9px 12px", fontSize: 12, outline: "none" }} />
        <button onClick={applyPromo}
          style={{ padding: "9px 16px", borderRadius: 10, background: promoApplied ? "#ECFDF5" : "#1F6BFF", border: "none", fontWeight: 800, cursor: "pointer", color: promoApplied ? "#10B981" : "#fff", fontSize: 12 }}>
          {promoApplied ? "✓ Applied" : "Apply"}
        </button>
      </div>

      {/* Buy Button */}
      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => selected ? setShowConfirm(true) : toast.error("Please select a package.")}
        style={{ width: "100%", padding: "15px", borderRadius: 16, background: selected ? "linear-gradient(135deg,#1F6BFF,#60A5FA)" : "#E5E7EB", border: "none", fontWeight: 900, cursor: selected ? "pointer" : "default", color: selected ? "#fff" : "#9CA3AF", fontSize: 14, boxShadow: selected ? "0 6px 20px rgba(31,107,255,0.35)" : "none" }}>
        {selected ? `⚡ Buy ${selected.price} — 🪙 ${fmt(selected.total)} Coins` : "Select a package to continue"}
      </motion.button>

      {/* Confirm Sheet */}
      <AnimatePresence>
        {showConfirm && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>⚡</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#0D1B3E" }}>Confirm Recharge</div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>You are about to purchase</div>
              </div>
              <div style={{ background: "#F5F7FA", borderRadius: 14, padding: "14px", marginBottom: 16 }}>
                {[
                  { label: "Package",        value: selected.price },
                  { label: "Coins",          value: `🪙 ${fmt(selected.coins)}` },
                  { label: "Bonus Coins",    value: `+🪙 ${fmt(selected.bonus)}` },
                  { label: "Total Coins",    value: `🪙 ${fmt(selected.total)}` },
                  { label: "Payment Method", value: PAYMENT_METHODS.find(m => m.id === payMethod)?.label },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Cancel</button>
                <button onClick={buy} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#1F6BFF,#60A5FA)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Confirm Payment</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}