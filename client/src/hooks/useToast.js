import { useState, useCallback, useRef } from "react";

// Simple ephemeral toast message hook - shared across the app via a single
// instance created in App.jsx and passed down (or re-created per component
// if only local feedback is needed).
export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  return { toast, showToast };
}
