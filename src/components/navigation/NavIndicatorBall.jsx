/**
 * NavIndicatorBall — tiny floating ball shown when nav is hidden.
 * Tap it to reveal the nav again.
 */
import { motion, AnimatePresence } from "framer-motion";

function haptic() {
  if (navigator.vibrate) navigator.vibrate(8);
}

export default function NavIndicatorBall({ visible, onTap }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="nav-ball"
          aria-label="Show navigation"
          onClick={() => { haptic(); onTap(); }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          whileTap={{ scale: 0.8 }}
          style={{
            position: "fixed",
            bottom: "max(20px, env(safe-area-inset-bottom, 20px))",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99998,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: [
              "0 0 14px rgba(147,51,234,0.45)",
              "0 4px 16px rgba(0,0,0,0.22)",
              "inset 0 1px 0 rgba(255,255,255,0.4)",
            ].join(", "),
          }}
        >
          {/* Gradient inner dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #9333EA, #3B82F6, #EC4899)",
              boxShadow: "0 0 8px rgba(147,51,234,0.8)",
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}