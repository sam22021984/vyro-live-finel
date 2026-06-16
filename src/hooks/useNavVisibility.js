/**
 * useNavVisibility — show on touch/scroll, hide after 60s inactivity
 * Returns { visible, show } so consumers can manually trigger show
 */
import { useState, useEffect, useRef, useCallback } from "react";

const AUTO_HIDE_MS = 60000;

export default function useNavVisibility() {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    // Start timer on mount
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    const opts = { passive: true, capture: true };
    window.addEventListener("touchstart", show, opts);
    window.addEventListener("mousedown",  show, { capture: true });
    window.addEventListener("scroll",     show, opts);
    window.addEventListener("mousemove",  show, opts);
    return () => {
      window.removeEventListener("touchstart", show, { capture: true });
      window.removeEventListener("mousedown",  show, { capture: true });
      window.removeEventListener("scroll",     show, { capture: true });
      window.removeEventListener("mousemove",  show, { capture: true });
      clearTimeout(timerRef.current);
    };
  }, [show]);

  return { visible, show };
}