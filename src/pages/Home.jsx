import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0D0D1A]">
      <div className="flex flex-col items-center gap-6 text-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
          🎙️
        </div>
        <h1 className="text-white text-3xl font-bold tracking-wide">VYRO LIVE</h1>
        <p className="text-purple-400 text-sm">Audio Live Streaming Platform</p>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate("/live-room")}
          style={{
            padding: "13px 36px", borderRadius: 28,
            background: "linear-gradient(135deg,#00C2B8,#006e6a)",
            border: "none", cursor: "pointer",
            fontSize: 15, fontWeight: 800, color: "#fff",
            boxShadow: "0 8px 28px rgba(0,194,184,0.45)",
            marginTop: 8,
          }}>
          🎙️ Enter Live Room
        </motion.button>
      </div>
    </div>
  );
}