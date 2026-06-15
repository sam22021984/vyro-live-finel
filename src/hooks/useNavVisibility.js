import { useState, useEffect, useRef, useCallback } from "react";

export default function useNavVisibility(autoHideSeconds = 3) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const show = useCallback(() => {
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), autoHideSeconds * 1000);
  }, [autoHideSeconds]);

  useEffect(() => {
    const handle = () => show();
    window.addEventListener("touchstart", handle, { passive: true });
    window.addEventListener("mousedown", handle);
    return () => {
      window.removeEventListener("touchstart", handle);
      window.removeEventListener("mousedown", handle);
      clearTimeout(timerRef.current);
    };
  }, [show]);

  return visible;
}