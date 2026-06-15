/**
 * useNavVisibility
 * Triggers: touch, mousedown, scroll
 * Auto-hides after 4 seconds of inactivity
 */
import { useState, useEffect, useRef, useCallback } from "react";

const AUTO_HIDE_MS = 4000;

export default function useNavVisibility() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    window.addEventListener("touchstart", show, { passive: true, capture: true });
    window.addEventListener("mousedown",  show, { capture: true });
    window.addEventListener("scroll",     show, { passive: true, capture: true });
    return () => {
      window.removeEventListener("touchstart", show, { capture: true });
      window.removeEventListener("mousedown",  show, { capture: true });
      window.removeEventListener("scroll",     show, { capture: true });
      clearTimeout(timerRef.current);
    };
  }, [show]);

  return visible;
}