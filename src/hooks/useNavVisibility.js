/**
 * useNavVisibility
 *
 * Spec:
 *   default_state       : hidden
 *   on_screen_touch     : show (touchstart + mousedown)
 *   fade_in_duration_ms : 200   (controlled by FloatingNav transition)
 *   auto_hide_after_s   : 3
 *   fade_out_duration_ms: 300   (controlled by FloatingNav exit transition)
 *
 * Flutter equivalent: lib/hooks/nav_visibility_controller.dart
 *   Use a Timer + GestureDetector wrapping the Scaffold body.
 *   On tap/pan-start → show overlay, reset Timer(3s, hide).
 *   AnimatedOpacity duration: show=200ms, hide=300ms.
 */
import { useState, useEffect, useRef, useCallback } from "react";

const AUTO_HIDE_MS = 3000; // 3 seconds per spec

export default function useNavVisibility() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    // Capture phase so it fires before any stopPropagation in children
    window.addEventListener("touchstart", show, { passive: true, capture: true });
    window.addEventListener("mousedown", show, { capture: true });
    return () => {
      window.removeEventListener("touchstart", show, { capture: true });
      window.removeEventListener("mousedown", show, { capture: true });
      clearTimeout(timerRef.current);
    };
  }, [show]);

  return visible;
}