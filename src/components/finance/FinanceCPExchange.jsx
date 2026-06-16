import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";

const CURRENCIES = ["Coins", "Diamonds", "CP"];
const RATES = {
  "Coins→CP":      0.01,
  "CP→Coins":      100,
  "Diamonds→CP":   10,
  "CP→Diamonds":   0.1,
  "Coins→Diamonds":0.001,
  "Diamonds→Coins":1000,
};

const HISTORY = [
  { from: "1000 Coins", to: "10 CP",       date: "Jun 15", status: "Success" },
  { from: "500 CP",     to: "50,000 Coins", date: "Jun 10", status: "Success" },
  { from: "100 Diamonds",to: "1000 CP",    date: "Jun 03", status: "Success" },
];

export default function FinanceCPExchange() {
  const [from, setFrom]   = useState("Coins");
  const [to, setTo]       = useState("CP");
  const [amount, setAmount] = useState("");
  const [tab, setTab]     = useState("exchange");

  const rateKey = `${from}→${to}`;
  const rate    = RATES[rateKey] || 0;
  const result  = amount && !isNaN(amount) ? (Number(amount) * rate).toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—";

  const swap = () => { setFrom(to); setTo(from); setAmount(""); };

  const doExchange = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) { toast.error("Please enter a valid amount."); return; }
    if (from === to) { toast.error("Cannot exchange the same currency."); return; }
    toast.success(`Exchanged ${amount} ${from} → ${result} ${to}`);
    setAmount("");
  };

  return (
    <div style={{ padding: "14px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["exchange", "rates", "history"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 800, textTransform: "capitalize",
              background: tab === t ? "#fff" : "transparent", color: tab === t ? "#8B5CF6" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "exchange" ? "Exchange" : t === "rates" ? "Rates" : "History"}
          </button>
        ))}
      </div>

      {tab === "exchange" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          {/* From */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#374151", display: "block", marginBottom: 6 }}>From</label>
            <div style={{ display: "flex", gap: 6 }}>
              {CURRENCIES.map(c => (
                <button key={c} onClick={() => { setFrom(c); setAmount(""); }}
                  style={{ flex: 1, padding: "9px", borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
                    background: from === c ? "#8B5CF6" : "#F5F7FA", color: from === c ? "#fff" : "#374151" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <motion.button whileTap={{ scale: 0.85, rotate: 180 }} onClick={swap}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#A78BFA)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <ArrowLeftRight size={16} color="#fff" />
            </motion.button>
          </div>

          {/* To */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#374151", display: "block", marginBottom: 6 }}>To</label>
            <div style={{ display: "flex", gap: 6 }}>
              {CURRENCIES.map(c => (
                <button key={c} onClick={() => { setTo(c); setAmount(""); }}
                  style={{ flex: 1, padding: "9px", borderRadius: 12, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
                    background: to === c ? "#EC4899" : "#F5F7FA", color: to === c ? "#fff" : "#374151" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#374151", display: "block", marginBottom: 6 }}>Amount ({from})</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount"
              style={{ width: "100%", background: "#F5F7FA", border: "1px solid #E5E7EB", borderRadius: 12, padding: "11px 14px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* Result */}
          <div style={{ background: "linear-gradient(135deg,#8B5CF605,#EC489905)", border: "1px solid #8B5CF620", borderRadius: 12, padding: "12px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>You receive</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#8B5CF6" }}>{result} {to}</span>
          </div>

          {rate > 0 && <div style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center", marginBottom: 14 }}>Rate: 1 {from} = {rate} {to}</div>}

          <motion.button whileTap={{ scale: 0.97 }} onClick={doExchange}
            style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#8B5CF6,#A78BFA)", border: "none", fontWeight: 900, cursor: "pointer", color: "#fff", fontSize: 14 }}>
            🔄 Exchange Now
          </motion.button>
        </div>
      )}

      {tab === "rates" && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px", border: "1px solid #F0F0F8" }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#0D1B3E", marginBottom: 12 }}>📊 Current Rates</div>
          {Object.entries(RATES).map(([key, rate], i) => {
            const [f, t] = key.split("→");
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < Object.entries(RATES).length - 1 ? "1px solid #F0F0F8" : "none" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{f} → {t}</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#8B5CF6" }}>1 : {rate}</div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {HISTORY.map((h, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>{h.from} → {h.to}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{h.date}</div>
              </div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: "#ECFDF5", fontSize: 10, fontWeight: 800, color: "#10B981" }}>{h.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}