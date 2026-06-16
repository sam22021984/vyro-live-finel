/**
 * VYRO Floating Bottom Navigation
 * Layout: Party | Moments | [GO LIVE] | Messages | Me
 * Visibility: hidden by default, shows on touch/scroll/mousemove, hides after 4s
 */
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mic2, Sparkles, Radio, MessageCircle, UserCircle2 } from "lucide-react";
import useNavVisibility from "@/hooks/useNavVisibility";

const NAV_ITEMS = [
  { id: "party",    label: "Party",    icon: Mic2,          path: "/party"    },
  { id: "moments",  label: "Moments",  icon: Sparkles,      path: "/moments"  },
  { id: "golive",   label: "Go Live",  icon: Radio,         path: "/go-live",  center: true },
  { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages", badge: 3 },
  { id: "me",       label: "Me",       icon: UserCircle2,   path: "/me"       },
];

// Haptic feedback (mobile)
function haptic() {
  if (navigator.vibrate) navigator.vibrate(8);
}

export default function FloatingNav() {
  const visible  = useNavVisibility();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="vyro-nav"
          className="fixed z-[99999] pointer-events-none"
          style={{
            bottom: "max(24px, env(safe-area-inset-bottom, 24px))",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingLeft: 16,
            paddingRight: 16,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Pill container */}
          <div
            className="pointer-events-auto flex items-end gap-1 px-5 py-3"
            style={{
              borderRadius: 56,
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              boxShadow: [
                "0 8px 48px rgba(0,0,0,0.28)",
                "0 2px 8px rgba(0,0,0,0.18)",
                "inset 0 1px 0 rgba(255,255,255,0.35)",
                "inset 0 -1px 0 rgba(0,0,0,0.08)",
              ].join(", "),
            }}
          >
            {NAV_ITEMS.map((item) => {
              const Icon     = item.icon;
              const isActive = pathname === item.path;

              if (item.center) {
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => { haptic(); navigate(item.path); }}
                    whileTap={{ scale: 0.86 }}
                    className="relative flex flex-col items-center gap-1.5 mx-3"
                    style={{ marginBottom: 10 }}
                  >
                    {/* Pulsing ambient glow */}
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#7C3AED,#3B82F6,#EC4899)",
                        filter: "blur(18px)",
                        opacity: 0.55,
                        zIndex: 0,
                      }}
                      animate={{ scale: [1, 1.22, 1], opacity: [0.55, 0.80, 0.55] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Button disc */}
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "linear-gradient(145deg, #9333EA 0%, #3B82F6 50%, #EC4899 100%)",
                        boxShadow: [
                          "0 0 28px rgba(147,51,234,0.65)",
                          "0 4px 24px rgba(0,0,0,0.45)",
                          "inset 0 2px 2px rgba(255,255,255,0.40)",
                          "inset 0 -2px 3px rgba(0,0,0,0.25)",
                        ].join(", "),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid rgba(255,255,255,0.30)",
                      }}
                    >
                      {/* Gloss highlight */}
                      <div style={{
                        position: "absolute", top: 8, left: "50%",
                        transform: "translateX(-50%)",
                        width: 36, height: 11, borderRadius: "50%",
                        background: "rgba(255,255,255,0.35)", filter: "blur(3px)",
                      }} />
                      <Icon size={28} color="#fff" strokeWidth={2.1} style={{ position: "relative" }} />
                    </div>

                    <span style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
                      background: "linear-gradient(135deg,#9333EA,#3B82F6,#EC4899)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
                    }}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              }

              // Standard button
              return (
                <motion.button
                  key={item.id}
                  onClick={() => { haptic(); navigate(item.path); }}
                  whileTap={{ scale: 0.86 }}
                  whileHover={{ scale: 1.08 }}
                  className="relative flex flex-col items-center gap-1.5 px-1"
                >
                  {/* Icon disc */}
                  <div style={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: isActive
                      ? "radial-gradient(circle at 38% 30%, rgba(147,51,234,0.28), rgba(0,0,0,0.18))"
                      : "radial-gradient(circle at 38% 30%, rgba(255,255,255,0.20), rgba(255,255,255,0.05))",
                    border: isActive
                      ? "1.5px solid rgba(147,51,234,0.55)"
                      : "1.5px solid rgba(255,255,255,0.22)",
                    boxShadow: isActive
                      ? "0 0 16px rgba(147,51,234,0.35), inset 0 1px 1px rgba(255,255,255,0.30)"
                      : "inset 0 1.5px 1px rgba(255,255,255,0.30), 0 2px 8px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {/* Gloss highlight */}
                    <div style={{
                      position: "absolute", top: 5, left: "50%",
                      transform: "translateX(-50%)",
                      width: 22, height: 7, borderRadius: "50%",
                      background: "rgba(255,255,255,0.28)", filter: "blur(2px)",
                    }} />
                    <Icon
                      size={21}
                      strokeWidth={1.85}
                      style={{
                        position: "relative",
                        color: isActive ? "#9333EA" : "rgba(30,30,40,0.82)",
                        filter: isActive ? "drop-shadow(0 0 6px rgba(147,51,234,0.6))" : "none",
                      }}
                    />

                    {/* Unread badge */}
                    {item.badge && (
                      <div style={{
                        position: "absolute", top: 4, right: 4,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "linear-gradient(135deg,#EF4444,#F97316)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1.5px solid rgba(255,255,255,0.9)",
                        fontSize: 9, fontWeight: 800, color: "#fff",
                        boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
                      }}>
                        {item.badge > 9 ? "9+" : item.badge}
                      </div>
                    )}
                  </div>

                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                    color: isActive ? "#9333EA" : "rgba(20,20,30,0.72)",
                    filter: isActive ? "drop-shadow(0 0 4px rgba(147,51,234,0.4))" : "none",
                  }}>
                    {item.label}
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