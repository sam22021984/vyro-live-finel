/**
 * FloatingNav — Floating Bottom Navigation
 *
 * Spec: bottom_navigation.type = "floating_buttons_navigation"
 * Theme: dark_premium | primary=#000000 | accent=#D4AF37 | secondary=#0F766E
 *
 * ─── FLUTTER MIGRATION MAP ──────────────────────────────────────────────────
 * File: lib/features/navigation/widgets/floating_nav.dart
 *
 * Widget tree:
 *   Positioned (bottom: 24 + MediaQuery.padding.bottom) inside a Stack
 *     AnimatedOpacity (show: 200ms, hide: 300ms) driven by NavVisibilityController
 *       Row(mainAxisSize: min, spacing: 12)
 *         × 5 FloatingNavButton widgets (see below)
 *
 * FloatingNavButton:
 *   GestureDetector(onTap: router.go(path))
 *     AnimatedScale (whileTap → scale 0.88, 80ms)
 *     Column(icon + label)
 *       Container(
 *         width: large ? 62 : 48,  height: large ? 62 : 48
 *         decoration: BoxDecoration(
 *           shape: BoxShape.circle,
 *           gradient: RadialGradient(center: (0.35,0.3), #1a1a1a→#000) [live only]
 *           color: Colors.black.withOpacity(0.55) [others]
 *           border: Border.all(color: GOLD, width: 2) [live] | white13 [others]
 *           boxShadow: glow + inset via CustomPainter
 *           backgroundBlendMode: BlendMode.srcOver
 *         )
 *         child: Stack [ inner-highlight Positioned + Icon ]
 *       )
 *       ShaderMask(
 *         shaderCallback: LinearGradient([#F5D97A, #D4AF37, #A07800]).createShader
 *         child: Text(label, style: bold, 10–11px, letterSpacing: 0.04em)
 *       )
 *
 * Route mapping (React path → Flutter GoRouter name):
 *   "party"     /rooms          → GoRoute(name:'rooms',     path:'/rooms')
 *   "community" /               → GoRoute(name:'discover',  path:'/')
 *   "live"      /host/go-live   → GoRoute(name:'go-live',   path:'/host/go-live')
 *   "messages"  /wallet         → GoRoute(name:'wallet',    path:'/wallet')
 *   "profile"   /profile        → GoRoute(name:'profile',   path:'/profile')
 *
 * Visibility behavior (Flutter):
 *   Wrap Scaffold body in GestureDetector(behavior: HitTestBehavior.translucent)
 *   onTapDown / onPanStart → navController.show() → Timer(3s, hide)
 *   AnimatedOpacity: show duration=200ms, hide duration=300ms
 * ────────────────────────────────────────────────────────────────────────────
 */

import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Radio, MessageCircle, User, PartyPopper } from "lucide-react";
import useNavVisibility from "@/hooks/useNavVisibility";

// ─── Route Config ────────────────────────────────────────────────────────────
const BUTTONS = [
  // position: left_1
  { id: "party",     label: "Party",     icon: PartyPopper,   path: "/rooms",        large: false },
  // position: left_2
  { id: "community", label: "Community", icon: Users,         path: "/",             large: false },
  // position: center — highlighted, larger
  { id: "live",      label: "Live",      icon: Radio,         path: "/host/go-live", large: true  },
  // position: right_2
  { id: "messages",  label: "Message",   icon: MessageCircle, path: "/wallet",       large: false },
  // position: right_1
  { id: "profile",   label: "Profile",   icon: User,          path: "/profile",      large: false },
];

// ─── Theme Tokens ─────────────────────────────────────────────────────────────
const GOLD   = "#D4AF37";
const BLACK  = "#000000";

// ─── Animation Timings (per spec) ────────────────────────────────────────────
// fade_in_duration_ms: 200  → show transition below
// fade_out_duration_ms: 300 → exit transition below
const FADE_IN  = 0.2;  // seconds
const FADE_OUT = 0.3;  // seconds

// ─── Component ───────────────────────────────────────────────────────────────
export default function FloatingNav() {
  const visible = useNavVisibility();           // auto-hides after 3s per spec
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-nav"
          // positioning: bottom_center, bottom_spacing: 24, safe_area_enabled: true
          style={{ bottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
          className="fixed left-1/2 -translate-x-1/2 z-50 flex items-end gap-3 pointer-events-none select-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: FADE_IN, ease: [0.25, 0.46, 0.45, 0.94] } }}
          exit={{ opacity: 0, y: 16, transition: { duration: FADE_OUT, ease: [0.55, 0.055, 0.675, 0.19] } }}
        >
          {BUTTONS.map((btn) => {
            const Icon    = btn.icon;
            const isLive  = btn.large;
            const isActive = location.pathname === btn.path ||
              (!isLive && btn.path !== "/" && location.pathname.startsWith(btn.path));

            const btnSize = isLive ? 64 : 50;

            return (
              <motion.button
                key={btn.id}
                onClick={() => navigate(btn.path)}
                // button_press_scale: true
                whileTap={{ scale: 0.88, transition: { duration: 0.08 } }}
                // button_hover_glow: true (desktop)
                whileHover={{ scale: 1.07, transition: { duration: 0.15 } }}
                className="pointer-events-auto flex flex-col items-center gap-1 focus:outline-none"
                style={{ marginBottom: isLive ? 10 : 0 }}
              >
                {/* ── Circle Button ── */}
                <div
                  style={{
                    width: btnSize,
                    height: btnSize,
                    borderRadius: "50%",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // glassmorphism
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    // 3d_effect background
                    background: isLive
                      ? `radial-gradient(circle at 35% 28%, #222, ${BLACK})`
                      : `radial-gradient(circle at 40% 30%, rgba(255,255,255,0.07), rgba(0,0,0,0.60))`,
                    // border
                    border: isLive
                      ? `2px solid ${GOLD}`
                      : isActive
                        ? `1.5px solid ${GOLD}88`
                        : `1.5px solid rgba(255,255,255,0.14)`,
                    // glow_effect + shadow
                    boxShadow: isLive
                      ? `0 0 22px 5px ${GOLD}44, 0 0 8px 2px ${GOLD}22, inset 0 1.5px 1.5px rgba(255,255,255,0.22), 0 6px 20px rgba(0,0,0,0.75)`
                      : isActive
                        ? `0 0 12px 3px ${GOLD}30, inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.65)`
                        : `inset 0 1px 1px rgba(255,255,255,0.13), 0 4px 12px rgba(0,0,0,0.60)`,
                    transition: "box-shadow 0.2s, border 0.2s",
                  }}
                >
                  {/* Inner specular highlight — 3D top-disc */}
                  <div
                    style={{
                      position: "absolute",
                      top: isLive ? 7 : 5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: isLive ? 36 : 26,
                      height: isLive ? 11 : 8,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.11)",
                      filter: "blur(3px)",
                      pointerEvents: "none",
                    }}
                  />

                  <Icon
                    size={isLive ? 27 : 20}
                    color={isLive ? GOLD : isActive ? GOLD : "rgba(255,255,255,0.72)"}
                    strokeWidth={isLive ? 2.2 : 1.8}
                  />
                </div>

                {/* ── Premium 3D Label ── */}
                <span
                  style={{
                    fontSize: isLive ? 11 : 10,
                    fontWeight: 700,
                    letterSpacing: "0.045em",
                    lineHeight: 1,
                    // gradient text = "premium_3d_text"
                    background: isActive || isLive
                      ? `linear-gradient(180deg, #FAE68A 0%, ${GOLD} 55%, #8B6914 100%)`
                      : `linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.42) 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: isActive || isLive
                      ? `drop-shadow(0 1px 4px ${GOLD}99)`
                      : `drop-shadow(0 1px 3px rgba(0,0,0,0.90))`,
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