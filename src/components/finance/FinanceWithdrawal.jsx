import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const METHODS = [
  { id: "card",      label: "Credit Card",  icon: "💳" },
  { id: "debit",     label: "Debit Card",   icon: "🏧" },
  { id: "paypal",    label: "PayPal",       icon: "🅿️" },
  { id: "jazzcash",  label: "JazzCash",     icon: "📱" },
  { id: "easypaisa", label: "EasyPaisa",    icon: "🟢" },
];

const STATUS_HISTORY = [
  { id: 1, amount: "1000 💎", usd: "$10.00", method: "PayPal",  status: "Pending",  date: "Jun 13" },
  { id: 2, amount: "5000 💎", usd: "$50.00", method: "JazzCash",status: "Approved", date: "May 28" },
  { id: 3, amount: "2000 💎", usd: "$20.00", method: "EasyPaisa",status: "Paid",    date: "May 10" },
];

const STATUS_COLOR = { Pending: "#F59E0B", "Under Review": "#1F6BFF", Approved: "#8B5CF6", Rejected: "#EF4444", Paid: "#10B981" };
const STATUS_BG    = { Pending: "#FFFBEB", "Under Review": "#EFF6FF", Approved: "#F5F3FF", Rejected: "#FEF2F2", Paid: "#ECFDF5" };

export default function FinanceWithdrawal() {
  const [method, setMethod]     = useState("paypal");
  const [wallet, setWallet]     = useState("");
  const [amount, setAmount]     = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]           = useState("");
  const [step, setStep]         = useState(1); // 1=form 2=otp 3=done
  const [tab, setTab]           = useState("form");

  const submitForm = () => {
    if (!wallet.trim()) { toast.error("Please enter wallet address."); return; }
    if (!amount || isNaN(amount) || Number(amount) < 100) { toast.error("Minimum withdrawal is 100 diamonds."); return; }
    if (!password.trim()) { toast.error("Security password required."); return; }
    setStep(2);
  };

  const submitOtp = () => {
    if (otp.length < 4) { toast.error("Invalid OTP."); return; }
    setStep(3);
    toast.success("Withdrawal request submitted. Under review.");
  };

  return (
    <div style={{ padding: "14px" }}>
      {/* Earnings Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Today's Earnings",  value: "0 💎",  color: "#1F6BFF" },
          { label: "Weekly Earnings",   value: "0 💎",  color: "#8B5CF6" },
          { label: "Monthly Earnings",  value: "0 💎",  color: "#10B981" },
          { label: "Available Balance", value: "$0.00", color: "#EC4899" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Switch */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, background: "#F5F7FA", borderRadius: 12, padding: 4 }}>
        {["form", "history"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 800,
              background: tab === t ? "#fff" : "transparent", color: tab === t ? "#10B981" : "#9CA3AF",
              boxShadow: tab === t ? "0 2px 6px rgba(0,0,0,0.06)" : "none" }}>
            {t === "form" ? "Withdraw" : "History"}
          </button>
        ))}
      </div>

      {tab === "form" && (
        <>
          {step === 1 && (
            <div>
              {/* Method */}
              <div style={{ fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 8 }}>Payment Method</div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
                {METHODS.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, cursor: "pointer", border: "none",
                      background: method === m.id ? "#10B981" : "#fff", color: method === m.id ? "#fff" : "#374151",
                      boxShadow: method === m.id ? "0 4px 10px rgba(16,185,129,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <span>{m.icon}</span><span>{m.label}</span>
                  </button>
                ))}
              </div>

              {[
                { label: "Wallet Address / Account", value: wallet, set: setWallet, placeholder: "Enter wallet or account number", type: "text" },
                { label: "Amount (Diamonds)", value: amount, set: setAmount, placeholder: "Min: 100 💎", type: "number" },
                { label: "Security Password", value: password, set: setPassword, placeholder: "Enter your security password", type: "password" },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: "#374151", display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ width: "100%", background: "#F5F7FA", border: "1px solid #E5E7EB", borderRadius: 12, padding: "11px 14px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}

              {amount && !isNaN(amount) && Number(amount) > 0 && (
                <div style={{ background: "#ECFDF5", border: "1px solid #BBF7D0", borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#0D1B3E" }}>Estimated: ${(Number(amount) * 0.01).toFixed(2)} USD</div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Rate: 100 💎 = $1.00 (after platform fee)</div>
                </div>
              )}

              <motion.button whileTap={{ scale: 0.97 }} onClick={submitForm}
                style={{ width: "100%", padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#10B981,#34D399)", border: "none", fontWeight: 900, cursor: "pointer", color: "#fff", fontSize: 14 }}>
                💸 Verify & Continue
              </motion.button>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📲</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#0D1B3E", marginBottom: 6 }}>OTP Verification</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>Enter the 6-digit OTP sent to your registered email/phone</div>
              <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" maxLength={6}
                style={{ width: "100%", background: "#F5F7FA", border: "2px solid #10B981", borderRadius: 14, padding: "14px", fontSize: 20, fontWeight: 900, textAlign: "center", outline: "none", boxSizing: "border-box", letterSpacing: 8, marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#F3F4F6", border: "none", fontWeight: 800, cursor: "pointer", color: "#374151" }}>Back</button>
                <button onClick={submitOtp} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#10B981,#34D399)", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff" }}>Verify OTP</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#0D1B3E", marginBottom: 8 }}>Request Submitted!</div>
              <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>Your withdrawal is under admin review. You will be notified once it's approved.</div>
              <button onClick={() => { setStep(1); setWallet(""); setAmount(""); setPassword(""); setOtp(""); }}
                style={{ padding: "13px 28px", borderRadius: 14, background: "#10B981", border: "none", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: 13 }}>
                New Request
              </button>
            </div>
          )}
        </>
      )}

      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STATUS_HISTORY.map((h, i) => (
            <div key={h.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", border: "1px solid #F0F0F8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💸</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0D1B3E" }}>{h.amount} → {h.usd}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{h.method} · {h.date}</div>
              </div>
              <div style={{ padding: "3px 10px", borderRadius: 10, background: STATUS_BG[h.status], fontSize: 10, fontWeight: 800, color: STATUS_COLOR[h.status] }}>{h.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}