import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Radio, MessageCircle, User, PartyPopper } from "lucide-react";
import useNavVisibility from "@/hooks/useNavVisibility";

const BUTTONS = [
  { id: "party",     label: "Party",     icon: PartyPopper,    path: "/rooms",    highlighted: false },
  { id: "community", label: "Community", icon: Users,          path: "/",         highlighted: false },
  { id: "live",      label: "Live",      icon: Radio,          path: "/host/go-live", highlighted: true, large: true },
  { id: "messages",  label: "Message",   icon: MessageCircle,  path: "/wallet",   highlighted: false },
  { id: "profile",   label: "Profile",   icon: User,           path: "/profile",  highlighted: false },
];

const GOLD = "#D4AF37";
const TEAL = "#0F766E";

export default function FloatingNav() {
  const visible = useNavVisibility(3);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-nav"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ bottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
          className="fixed left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 pointer-events-none"
        >
          {BUTTONS.map((btn) => {
            const Icon = btn.icon;
            const isActive = location.pathname === btn.path;
            const isLive = btn.large;

            return (
              <motion.button
                key={btn.id}
                onClick={() => navigate(btn.path)}
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.08 }}
                className="pointer-events-auto flex flex-col items-center gap-1 focus:outline-none"
                style={{ marginBottom: isLive ? 8 : 0 }}
              >
                {/* Circle button */}
                <div
                  style={{
                    width: isLive ? 62 : 48,
                    height: isLive ? 62 : 48,
                    background: isLive
                      ? `radial-gradient(circle at 35% 30%, #1a1a1a, #000)`
                      : "rgba(0,0,0,0.55)",
                    border: isLive
                      ? `2px solid ${GOLD}`
                      : `1.5px solid rgba(255,255,255,0.13)`,
                    boxShadow: isLive
                      ? `0 0 18px 4px ${GOLD}55, inset 0 1px 1px rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.7)`
                      : `inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.6)`,
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "box-shadow 0.2s",
                  }}
                >
                  {/* Inner highlight disc */}
                  <div
                    style={{
                      position: "absolute",
                      top: 5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: isLive ? 38 : 28,
                      height: isLive ? 12 : 9,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.10)",
                      filter: "blur(2px)",
                      pointerEvents: "none",
                    }}
                  />
                  <Icon
                    size={isLive ? 26 : 20}
                    color={isLive ? GOLD : isActive ? GOLD : "rgba(255,255,255,0.75)"}
                    strokeWidth={isLive ? 2.2 : 1.8}
                  />
                </div>

                {/* Premium 3D label */}
                <span
                  style={{
                    fontSize: isLive ? 11 : 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    background: isActive || isLive
                      ? `linear-gradient(180deg, #F5D97A 0%, ${GOLD} 60%, #A07800 100%)`
                      : "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: isActive || isLive
                      ? `drop-shadow(0 1px 3px ${GOLD}88)`
                      : "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                    textShadow: "none",
                  }}
                >
                  {btn.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}