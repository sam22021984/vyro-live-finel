/**
 * Mall — VYRO Virtual Mall
 * Access: Profile > More Services > Mall
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";

const CATEGORIES = [
  { id:"all",      label:"All",          icon:"🏪" },
  { id:"frames",   label:"Frames",       icon:"🖼️" },
  { id:"bubbles",  label:"Chat Bubbles", icon:"💬" },
  { id:"effects",  label:"Effects",      icon:"✨" },
  { id:"gifts",    label:"Gift Packs",   icon:"🎁" },
  { id:"avatars",  label:"Avatars",      icon:"🎭" },
  { id:"rooms",    label:"Room Decor",   icon:"🏠" },
];

const ITEMS = [
  { id:1,  name:"Royal Gold Frame",     cat:"frames",  icon:"🖼️",  price:1200, badge:"HOT",    color:"#F59E0B", gradient:"linear-gradient(135deg,#FFC83D,#F59E0B)" },
  { id:2,  name:"Neon Pulse Frame",     cat:"frames",  icon:"🔮",  price:800,  badge:"NEW",    color:"#A855F7", gradient:"linear-gradient(135deg,#C084FC,#A855F7)" },
  { id:3,  name:"Diamond Crown Frame",  cat:"frames",  icon:"💎",  price:2400, badge:"ELITE",  color:"#06B6D4", gradient:"linear-gradient(135deg,#38BDF8,#06B6D4)" },
  { id:4,  name:"Fire Dragon Bubble",   cat:"bubbles", icon:"🐉",  price:640,  badge:"HOT",    color:"#EF4444", gradient:"linear-gradient(135deg,#EF4444,#F97316)" },
  { id:5,  name:"Galaxy Bubble",        cat:"bubbles", icon:"🌌",  price:480,  badge:"",       color:"#6366F1", gradient:"linear-gradient(135deg,#818CF8,#6366F1)" },
  { id:6,  name:"VIP Gold Bubble",      cat:"bubbles", icon:"👑",  price:960,  badge:"VIP",    color:"#F59E0B", gradient:"linear-gradient(135deg,#FCD34D,#F59E0B)" },
  { id:7,  name:"Confetti Blast",       cat:"effects", icon:"🎊",  price:320,  badge:"NEW",    color:"#10B981", gradient:"linear-gradient(135deg,#34D399,#10B981)" },
  { id:8,  name:"Fireworks Show",       cat:"effects", icon:"🎆",  price:560,  badge:"",       color:"#EF4444", gradient:"linear-gradient(135deg,#EF4444,#A855F7)" },
  { id:9,  name:"Angel Wings Effect",   cat:"effects", icon:"👼",  price:1800, badge:"RARE",   color:"#E0E7FF", gradient:"linear-gradient(135deg,#C7D2FE,#818CF8)" },
  { id:10, name:"Luxury Gift Bundle",   cat:"gifts",   icon:"🎁",  price:4800, badge:"BEST",   color:"#F59E0B", gradient:"linear-gradient(135deg,#FFC83D,#EF4444)" },
  { id:11, name:"Weekend Gift Pack",    cat:"gifts",   icon:"🎀",  price:1600, badge:"SALE",   color:"#EC4899", gradient:"linear-gradient(135deg,#F472B6,#EC4899)" },
  { id:12, name:"Starter Gift Pack",    cat:"gifts",   icon:"🎈",  price:640,  badge:"",       color:"#10B981", gradient:"linear-gradient(135deg,#34D399,#10B981)" },
  { id:13, name:"Phoenix Avatar",       cat:"avatars", icon:"🔥",  price:2800, badge:"ELITE",  color:"#F97316", gradient:"linear-gradient(135deg,#FB923C,#EF4444)" },
  { id:14, name:"Crystal Avatar",       cat:"avatars", icon:"💠",  price:1400, badge:"",       color:"#06B6D4", gradient:"linear-gradient(135deg,#38BDF8,#6366F1)" },
  { id:15, name:"Royal Crown Avatar",   cat:"avatars", icon:"👑",  price:3200, badge:"VIP",    color:"#FFC83D", gradient:"linear-gradient(135deg,#FFC83D,#A855F7)" },
  { id:16, name:"Space Room Theme",     cat:"rooms",   icon:"🚀",  price:1200, badge:"NEW",    color:"#6366F1", gradient:"linear-gradient(135deg,#818CF8,#4338CA)" },
  { id:17, name:"Enchanted Forest",     cat:"rooms",   icon:"🌲",  price:960,  badge:"",       color:"#10B981", gradient:"linear-gradient(135deg,#34D399,#059669)" },
  { id:18, name:"Royal Palace Room",    cat:"rooms",   icon:"🏰",  price:2400, badge:"HOT",    color:"#F59E0B", gradient:"linear-gradient(135deg,#FCD34D,#D97706)" },
];

const BADGE_COLORS = { HOT:"#EF4444",NEW:"#10B981",ELITE:"#A855F7",RARE:"#06B6D4",VIP:"#F59E0B",BEST:"#F97316",SALE:"#EC4899" };

function ItemCard({ item, inCart, onToggleCart }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,overflow:"hidden",position:"relative" }}>
      {item.badge && (
        <div style={{ position:"absolute",top:8,right:8,zIndex:1,background:BADGE_COLORS[item.badge]||"#9CA3AF",borderRadius:8,padding:"2px 7px",fontSize:8,fontWeight:900,color:"#fff" }}>
          {item.badge}
        </div>
      )}
      {/* Icon area */}
      <div style={{ height:80,background:item.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 100%)" }}/>
        {item.icon}
      </div>
      <div style={{ padding:"10px 10px 12px" }}>
        <div style={{ fontSize:10,fontWeight:800,color:"#fff",marginBottom:4,lineHeight:1.3 }}>{item.name}</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:3 }}>
            <span style={{ fontSize:13,fontWeight:900,color:item.color }}>🪙</span>
            <span style={{ fontSize:12,fontWeight:900,color:item.color }}>{item.price.toLocaleString()}</span>
          </div>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => onToggleCart(item.id)}
            style={{ width:28,height:28,borderRadius:9,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,
              background:inCart?"linear-gradient(135deg,#10B981,#059669)":"rgba(255,255,255,0.1)",
              boxShadow:inCart?"0 4px 12px rgba(16,185,129,0.4)":"none" }}>
            {inCart ? "✓" : "+"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function Mall() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(new Set());
  const [tab, setTab] = useState("shop");

  const toggleCart = (id) => setCart(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = ITEMS.filter(item =>
    (category === "all" || item.cat === category) &&
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const cartItems = ITEMS.filter(i => cart.has(i.id));
  const cartTotal = cartItems.reduce((s,i) => s + i.price, 0);

  return (
    <div style={{ minHeight:"100dvh",background:"linear-gradient(160deg,#050A18 0%,#0D1B3E 50%,#08111E 100%)",fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:90 }}>
      {/* Header */}
      <div style={{ position:"sticky",top:0,zIndex:50,background:"rgba(5,10,24,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,200,61,0.18)" }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:12 }}>
          <motion.button whileTap={{ scale:0.88 }} onClick={() => navigate(-1)}
            style={{ width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,200,61,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }}>
            <ChevronLeft size={18} color="#FFC83D"/>
          </motion.button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:900,color:"#fff" }}>🏪 VYRO Mall</div>
            <div style={{ fontSize:10,color:"#FFC83D" }}>Frames · Bubbles · Effects · Gifts · More</div>
          </div>
          {cart.size > 0 && (
            <motion.button whileTap={{ scale:0.92 }} onClick={() => setTab("cart")}
              style={{ position:"relative",width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>
              🛒
              <div style={{ position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:"50%",background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:9,fontWeight:900,color:"#fff" }}>{cart.size}</span>
              </div>
            </motion.button>
          )}
        </div>
        {/* Tabs */}
        <div style={{ display:"flex",padding:"0 16px" }}>
          {[{id:"shop",label:"🏪 Shop"},{id:"cart",label:"🛒 Cart"},{id:"owned",label:"📦 Owned"}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1,padding:"9px",border:"none",background:"transparent",cursor:"pointer",fontSize:11,fontWeight:800,
                color:tab===t.id?"#FFC83D":"rgba(255,255,255,0.4)",
                borderBottom:tab===t.id?"2px solid #FFC83D":"2px solid transparent" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px" }}>
        <AnimatePresence mode="wait">
          {tab === "shop" && (
            <motion.div key="shop" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              {/* Search */}
              <div style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,200,61,0.18)",borderRadius:13,display:"flex",alignItems:"center",gap:8,padding:"10px 13px",marginBottom:12 }}>
                <Search size={14} color="#FFC83D"/>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search mall items…"
                  style={{ flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:12 }}/>
              </div>
              {/* Category filter */}
              <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:12 }}>
                {CATEGORIES.map(c => (
                  <motion.button key={c.id} whileTap={{ scale:0.92 }} onClick={() => setCategory(c.id)}
                    style={{ flexShrink:0,padding:"6px 12px",borderRadius:20,fontSize:9,fontWeight:800,border:"none",cursor:"pointer",
                      background:category===c.id?"linear-gradient(135deg,#FFC83D,#F59E0B)":"rgba(255,255,255,0.07)",
                      color:category===c.id?"#0D1B3E":"#FFC83D" }}>
                    {c.icon} {c.label}
                  </motion.button>
                ))}
              </div>
              {/* Items grid */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
                {filtered.map((item,i) => (
                  <motion.div key={item.id} initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.03 }}>
                    <ItemCard item={item} inCart={cart.has(item.id)} onToggleCart={toggleCart}/>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "cart" && (
            <motion.div key="cart" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign:"center",padding:"60px 20px" }}>
                  <div style={{ fontSize:48,marginBottom:12 }}>🛒</div>
                  <div style={{ fontSize:15,fontWeight:800,color:"#fff",marginBottom:6 }}>Your cart is empty</div>
                  <div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:20 }}>Browse the shop and add items to your cart</div>
                  <motion.button whileTap={{ scale:0.96 }} onClick={() => setTab("shop")}
                    style={{ padding:"11px 24px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:800,fontSize:13,color:"#0D1B3E",background:"linear-gradient(135deg,#FFC83D,#F59E0B)" }}>
                    Go Shopping
                  </motion.button>
                </div>
              ) : (
                <>
                  {cartItems.map((item,i) => (
                    <motion.div key={item.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.05 }}
                      style={{ display:"flex",gap:12,alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"12px 14px",marginBottom:10 }}>
                      <div style={{ width:44,height:44,borderRadius:13,background:item.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{item.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12,fontWeight:800,color:"#fff" }}>{item.name}</div>
                        <div style={{ fontSize:11,fontWeight:900,color:item.color }}>🪙 {item.price.toLocaleString()}</div>
                      </div>
                      <motion.button whileTap={{ scale:0.88 }} onClick={() => toggleCart(item.id)}
                        style={{ width:28,height:28,borderRadius:9,border:"none",cursor:"pointer",background:"rgba(239,68,68,0.15)",color:"#EF4444",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                  <div style={{ background:"rgba(255,200,61,0.08)",border:"1px solid rgba(255,200,61,0.2)",borderRadius:16,padding:"14px 16px",marginTop:4 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:12 }}>
                      <span style={{ fontSize:12,color:"rgba(255,255,255,0.6)" }}>Total ({cart.size} items)</span>
                      <span style={{ fontSize:16,fontWeight:900,color:"#FFC83D" }}>🪙 {cartTotal.toLocaleString()}</span>
                    </div>
                    <motion.button whileTap={{ scale:0.96 }}
                      style={{ width:"100%",padding:"13px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:900,fontSize:14,color:"#0D1B3E",background:"linear-gradient(135deg,#FFC83D,#F59E0B)",boxShadow:"0 6px 20px rgba(255,200,61,0.35)" }}>
                      💳 Checkout · 🪙 {cartTotal.toLocaleString()}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {tab === "owned" && (
            <motion.div key="owned" initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ fontSize:48,marginBottom:12 }}>📦</div>
              <div style={{ fontSize:15,fontWeight:800,color:"#fff",marginBottom:6 }}>No Items Yet</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:20 }}>Items you purchase will appear here</div>
              <motion.button whileTap={{ scale:0.96 }} onClick={() => setTab("shop")}
                style={{ padding:"11px 24px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:800,fontSize:13,color:"#0D1B3E",background:"linear-gradient(135deg,#FFC83D,#F59E0B)" }}>
                Visit Shop
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}