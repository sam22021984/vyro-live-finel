/**
 * Lucky ID Store — Premium Application ID Marketplace
 * Access: Profile > More Services > Lucky ID Store
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Shield, Clock, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const SAMPLE_LUCKY_IDS = [
  { application_id: "QAT-974666666666666666", country_code: "QAT", price_coins: 500000, description: "Premium Lucky 6s", is_available: true },
  { application_id: "QAT-974777777777777777", country_code: "QAT", price_coins: 500000, description: "Premium Lucky 7s", is_available: true },
  { application_id: "QAT-974123123123123123", country_code: "QAT", price_coins: 250000, description: "Lucky Pattern", is_available: true },
  { application_id: "IND-911111111111111111", country_code: "IND", price_coins: 500000, description: "Diamond Ones", is_available: true },
  { application_id: "UAE-971888888888888888", country_code: "UAE", price_coins: 500000, description: "Lucky 8s — Wealth", is_available: true },
  { application_id: "SAU-966999999999999999", country_code: "SAU", price_coins: 750000, description: "Elite 9s", is_available: true },
  { application_id: "PAK-920000000000000001", country_code: "PAK", price_coins: 100000, description: "Pioneer #1", is_available: true },
  { application_id: "UAE-971000000000000001", country_code: "UAE", price_coins: 100000, description: "Pioneer #1 UAE", is_available: true },
  { application_id: "TUR-900000000000000001", country_code: "TUR", price_coins: 100000, description: "Pioneer #1 Turkey", is_available: true },
];

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return String(n);
}

export default function LuckyIDStore() {
  const navigate = useNavigate();
  const [luckyIds, setLuckyIds] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmItem, setConfirmItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      const profiles = await base44.entities.UserProfile.filter({ user_id: me.id });
      if (profiles?.length) setMyProfile(profiles[0]);

      const dbIds = await base44.entities.LuckyID.filter({ is_available: true });
      // Merge DB + samples (show samples if DB empty)
      if (dbIds.length > 0) {
        setLuckyIds(dbIds);
      } else {
        setLuckyIds(SAMPLE_LUCKY_IDS);
      }
    } catch {
      setLuckyIds(SAMPLE_LUCKY_IDS);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!confirmItem || !myProfile) return;
    setPurchasing(true);
    try {
      const me = await base44.auth.me();
      const prevId = myProfile.application_id;

      // Log ID change history
      await base44.entities.IDHistory.create({
        user_id: me.id,
        previous_id: prevId,
        new_id: confirmItem.application_id,
        change_reason: "lucky_id_purchase",
        purchase_date: new Date().toISOString(),
      });

      // Update profile — preserve all data, only change application_id
      await base44.entities.UserProfile.update(myProfile.id, {
        application_id: confirmItem.application_id,
        is_lucky_id: true,
        previous_application_ids: [...(myProfile.previous_application_ids || []), prevId],
      });

      // Mark lucky ID as purchased
      if (confirmItem.id) {
        await base44.entities.LuckyID.update(confirmItem.id, {
          is_available: false,
          purchased_by: me.id,
          purchased_at: new Date().toISOString(),
        });
      }

      toast.success(`🎉 Lucky ID activated: ${confirmItem.application_id}`);
      setConfirmItem(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  const filtered = luckyIds.filter(id =>
    id.application_id.toLowerCase().includes(search.toLowerCase()) ||
    (id.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100dvh", width: "100%", maxWidth: "100vw",
      overflowX: "hidden", boxSizing: "border-box",
      background: "linear-gradient(160deg,#0D0D1A 0%,#1A0D2E 50%,#0D1A1A 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      paddingBottom: "max(90px,calc(90px + env(safe-area-inset-bottom,0px)))",
    }}>

      {/* Header */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,200,61,0.1)" }}>
        <motion.button whileTap={{ scale: 0.88 }} onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,200,61,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={18} color="#FFC83D" />
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#FFC83D" }}>⭐ Lucky ID Store</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Premium Application IDs · Permanent Identity</div>
        </div>
        <div style={{ padding: "4px 10px", borderRadius: 20, background: "rgba(255,200,61,0.1)", border: "1px solid rgba(255,200,61,0.25)" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#FFC83D" }}>Premium</span>
        </div>
      </div>

      {/* Current ID banner */}
      {myProfile && (
        <div style={{ margin: "14px 14px 0", padding: "14px", borderRadius: 16, background: "rgba(255,200,61,0.06)", border: "1px solid rgba(255,200,61,0.2)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>YOUR CURRENT APPLICATION ID</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#FFC83D", letterSpacing: 1 }}>{myProfile.application_id}</div>
          {myProfile.is_lucky_id && <div style={{ fontSize: 10, color: "#22C55E", marginTop: 3 }}>⭐ Lucky ID Active</div>}
        </div>
      )}

      {/* Info Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "14px 14px 0" }}>
        {[
          { icon: <Star size={14} color="#FFC83D" />, label: "Premium IDs", val: `${luckyIds.length}+` },
          { icon: <Shield size={14} color="#22C55E" />, label: "Data Safe", val: "100%" },
          { icon: <Clock size={14} color="#60A5FA" />, label: "Permanent", val: "Forever" },
        ].map(c => (
          <div key={c.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{c.val}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or country..."
            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 12px 10px 34px", fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>

      {/* Lucky IDs Grid */}
      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: 40 }}>No IDs found</div>
        ) : filtered.map((item, i) => (
          <motion.div key={item.application_id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{
              background: "rgba(255,200,61,0.04)", borderRadius: 16, padding: "16px",
              border: "1px solid rgba(255,200,61,0.15)",
              boxShadow: "0 4px 20px rgba(255,200,61,0.05)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
            {/* Country badge */}
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg,rgba(255,200,61,0.2),rgba(255,200,61,0.05))",
              border: "1px solid rgba(255,200,61,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 900, color: "#FFC83D",
            }}>
              {item.country_code}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#FFC83D", letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.application_id}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{item.description || "Premium Lucky ID"}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#FFC83D", marginTop: 4 }}>🪙 {fmt(item.price_coins)} Coins</div>
            </div>

            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setConfirmItem(item)}
              style={{
                padding: "8px 14px", borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg,#FFC83D,#F59E0B)",
                border: "none", fontWeight: 900, fontSize: 11, color: "#0D1B3E",
                cursor: "pointer", boxShadow: "0 4px 12px rgba(255,200,61,0.3)",
              }}>
              Buy
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Confirm Purchase Sheet */}
      <AnimatePresence>
        {confirmItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmItem(null)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#13131F", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", width: "100%", maxWidth: 480, border: "1px solid rgba(255,200,61,0.15)" }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>⭐</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#FFC83D" }}>Confirm Lucky ID Purchase</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>This ID will permanently replace your current Application ID</div>
              </div>

              <div style={{ background: "rgba(255,200,61,0.06)", borderRadius: 14, padding: "14px", marginBottom: 16, border: "1px solid rgba(255,200,61,0.15)" }}>
                {[
                  { label: "New ID", value: confirmItem.application_id },
                  { label: "Current ID", value: myProfile?.application_id || "—" },
                  { label: "Cost", value: `🪙 ${fmt(confirmItem.price_coins)} Coins` },
                  { label: "Data Preserved", value: "✅ All data safe" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#FFC83D" }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setConfirmItem(null)}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 800, cursor: "pointer", color: "#fff" }}>
                  Cancel
                </button>
                <button onClick={handlePurchase} disabled={purchasing}
                  style={{ flex: 1, padding: "13px", borderRadius: 12, background: "linear-gradient(135deg,#FFC83D,#F59E0B)", border: "none", fontWeight: 900, cursor: "pointer", color: "#0D1B3E" }}>
                  {purchasing ? "Processing..." : "Confirm Purchase"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}