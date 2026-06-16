import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, Phone } from "lucide-react";

function formatDuration(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

export default function AudioCallScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const chat = state?.chat || {};
  const isOutgoing = state?.outgoing ?? true;

  const [callStatus, setCallStatus] = useState(isOutgoing ? "calling" : "incoming");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [coinsSpent, setCoinsSpent] = useState(0);
  const [signalBars, setSignalBars] = useState(4);
  const timerRef = useRef(null);

  // Auto-connect outgoing after 3s (simulation)
  useEffect(() => {
    if (isOutgoing) {
      const t = setTimeout(() => setCallStatus("active"), 3000);
      return () => clearTimeout(t);
    }
  }, [isOutgoing]);

  // Duration & coin counter when active
  useEffect(() => {
    if (callStatus === "active") {
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
        setCoinsSpent(c => c + 2); // 2 coins/sec
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  const endCall = () => {
    clearInterval(timerRef.current);
    navigate(-1);
  };

  const acceptCall = () => setCallStatus("active");

  return (
    <div style={{
      height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between",
      background:"linear-gradient(160deg,#0f0c29 0%,#302b63 50%,#24243e 100%)",
      padding:"60px 24px 48px", overflow:"hidden", position:"relative",
    }}>
      {/* Background aura */}
      <motion.div animate={{ scale:[1,1.15,1], opacity:[0.3,0.5,0.3] }} transition={{ duration:3, repeat:Infinity }}
        style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.4),transparent)", top:"20%", left:"50%", transform:"translateX(-50%)" }} />

      {/* Top Info */}
      <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.6)", marginBottom:8 }}>
          {callStatus==="calling" ? "📞 Calling..." : callStatus==="incoming" ? "📲 Incoming Call" : "🔊 Audio Call"}
        </div>

        {/* Avatar */}
        <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
          {/* Pulse rings */}
          {callStatus !== "active" && [0,1,2].map(i => (
            <motion.div key={i} style={{ position:"absolute", inset: -(i+1)*20, borderRadius:"50%", border:"2px solid rgba(124,58,237,0.4)" }}
              animate={{ scale:[1,1.3,1.6], opacity:[0.6,0.3,0] }} transition={{ duration:2, repeat:Infinity, delay:i*0.5 }} />
          ))}
          <motion.div animate={callStatus==="active" ? { scale:[1,1.02,1] } : {}} transition={{ duration:1, repeat:Infinity }}
            style={{ position:"absolute", inset:-6, borderRadius:"50%", background:"conic-gradient(from 0deg,#7C3AED,#EC4899,#3B82F6,#7C3AED)", zIndex:0 }} />
          <div style={{ position:"absolute", inset:-2, borderRadius:"50%", background:"#1a1a2e", zIndex:1 }} />
          <img src={chat.other_user_avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"}
            alt="" style={{ width:120, height:120, borderRadius:"50%", objectFit:"cover", position:"relative", zIndex:2, display:"block" }} />
        </div>

        <div style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:4 }}>{chat.other_user_name || "User"}</div>
        {chat.other_user_vip && (
          <span style={{ background:"linear-gradient(135deg,#F59E0B,#D97706)", color:"#fff", borderRadius:12, padding:"3px 12px", fontSize:11, fontWeight:800 }}>{chat.other_user_vip.toUpperCase()}</span>
        )}

        {/* Status */}
        <div style={{ marginTop:16, fontSize:14, color:"rgba(255,255,255,0.8)", fontWeight:700 }}>
          {callStatus==="calling" && <span style={{ color:"#C084FC" }}>Ringing...</span>}
          {callStatus==="incoming" && <span style={{ color:"#22C55E" }}>Wants to call you</span>}
          {callStatus==="active" && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <span style={{ color:"#22C55E", fontSize:22, fontWeight:900 }}>{formatDuration(duration)}</span>
              <div style={{ display:"flex", gap:16 }}>
                <span style={{ color:"#F59E0B", fontSize:12 }}>🪙 {coinsSpent} coins</span>
                <span style={{ color:"#3B82F6", fontSize:12 }}>
                  📶 {"▌".repeat(signalBars)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ position:"relative", zIndex:1, width:"100%" }}>
        {callStatus === "active" && (
          <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:32 }}>
            <motion.button whileTap={{ scale:0.88 }} onClick={() => setIsMuted(!isMuted)}
              style={{ width:56, height:56, borderRadius:"50%", background: isMuted ? "#EF4444" : "rgba(255,255,255,0.15)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              {isMuted ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
            </motion.button>
            <motion.button whileTap={{ scale:0.88 }} onClick={() => setIsSpeaker(!isSpeaker)}
              style={{ width:56, height:56, borderRadius:"50%", background: isSpeaker ? "rgba(255,255,255,0.15)" : "#6B7280", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              {isSpeaker ? <Volume2 size={22} color="#fff" /> : <VolumeX size={22} color="#fff" />}
            </motion.button>
          </div>
        )}

        {/* Main call buttons */}
        {callStatus === "incoming" ? (
          <div style={{ display:"flex", justifyContent:"center", gap:48 }}>
            <div style={{ textAlign:"center" }}>
              <motion.button whileTap={{ scale:0.88 }} onClick={endCall}
                style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#EF4444,#DC2626)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 8px 24px rgba(239,68,68,0.5)", margin:"0 auto 8px" }}>
                <PhoneOff size={28} color="#fff" />
              </motion.button>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:700 }}>Reject</span>
            </div>
            <div style={{ textAlign:"center" }}>
              <motion.button whileTap={{ scale:0.88 }} onClick={acceptCall}
                style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#22C55E,#16A34A)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 8px 24px rgba(34,197,94,0.5)", margin:"0 auto 8px" }}>
                <Phone size={28} color="#fff" />
              </motion.button>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:700 }}>Accept</span>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ textAlign:"center" }}>
              <motion.button whileTap={{ scale:0.88 }} onClick={endCall}
                style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#EF4444,#DC2626)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 8px 24px rgba(239,68,68,0.5)", margin:"0 auto 8px" }}>
                <PhoneOff size={28} color="#fff" />
              </motion.button>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:700 }}>End Call</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}