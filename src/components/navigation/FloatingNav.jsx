import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Sparkles, Radio, MessageCircle, User } from "lucide-react";
import useNavVisibility from "@/hooks/useNavVisibility";

const BUTTONS = [
  { id: "party",    label: "Party",    icon: Mic,           path: "/party",    side: "left"  },
  { id: "moments",  label: "Moments",  icon: Sparkles,      path: "/moments",  side: "left"  },
  { id: "golive",   label: "Go Live",  icon: Radio,         path: "/go-live",  side: "center"},
  { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages", side: "right" },
  { id: "me",       label: "Me",       icon: User,          path: "/me",       side: "right" },
];

export default function FloatingNav() {
  const visible  = useNavVisibility();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-nav"
          className="fixed bottom-6 left-1/2 z-[9999] flex items-end gap-2 px-4 pointer-events-none"
          style={{ transform: "translateX(-50%)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } }}
          exit={{    opacity: 0, y: 20, transition: { duration: 0.3, ease: [0.55, 0.06, 0.68, 0.19]  } }}
        >
          {/* Glass pill container */}
          <div
            className="flex items-end gap-2 px-4 py-3 pointer-events-auto"
            style={{
              background: "rgba(10, 8, 20, 0.45)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: 40,
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06) inset",
            }}
          >
            {BUTTONS.map((btn) => {
              const Icon     = btn.icon;
              const isCenter = btn.side === "center";
              const isActive = location.pathname === btn.path;

              if (isCenter) {
                return (
                  <motion.button
                    key={btn.id}
                    onClick={() => navigate(btn.path)}
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.06 }}
                    className="relative flex flex-col items-center gap-1 mx-2"
                    style={{ marginBottom: 8 }}
                  >
                    {/* Pulsing glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6,#EC4899)", filter: "blur(14px)", opacity: 0.5 }}
                      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.75, 0.5] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Main button */}
                    <div
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #EC4899 100%)",
                        boxShadow: "0 0 24px rgba(124,58,237,0.6), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {/* Inner highlight */}
                      <div style={{
                        position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
                        width: 34, height: 10, borderRadius: "50%",
                        background: "rgba(255,255,255,0.28)", filter: "blur(3px)",
                      }} />
                      <Icon size={26} color="#fff" strokeWidth={2.2} />
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                      background: "linear-gradient(180deg,#fff 0%,rgba(255,255,255,0.6) 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    }}>
                      {btn.label}
                    </span>
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={btn.id}
                  onClick={() => navigate(btn.path)}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.07 }}
                  className="flex flex-col items-center gap-1"
                >
                  {/* Icon circle */}
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    background: isActive
                      ? "radial-gradient(circle at 38% 30%, rgba(124,58,237,0.35), rgba(10,8,20,0.55))"
                      : "radial-gradient(circle at 38% 30%, rgba(255,255,255,0.10), rgba(10,8,20,0.40))",
                    border: isActive
                      ? "1.5px solid rgba(167,139,250,0.6)"
                      : "1.5px solid rgba(255,255,255,0.14)",
                    boxShadow: isActive
                      ? "0 0 14px rgba(124,58,237,0.4), inset 0 1px 1px rgba(255,255,255,0.18)"
                      : "inset 0 1px 1px rgba(255,255,255,0.12), 0 3px 10px rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}>
                    {/* Inner highlight */}
                    <div style={{
                      position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)",
                      width: 22, height: 7, borderRadius: "50%",
                      background: "rgba(255,255,255,0.14)", filter: "blur(2px)",
                    }} />
                    <Icon
                      size={19}
                      color={isActive ? "#a78bfa" : "rgba(255,255,255,0.78)"}
                      strokeWidth={1.9}
                    />
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                    background: isActive
                      ? "linear-gradient(180deg,#c4b5fd,#7C3AED)"
                      : "linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.42))",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    {btn.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}