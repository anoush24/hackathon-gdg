import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description }) => {
    // For now, just use a basic alert
    // You can enhance this later with a proper toast UI
    alert(`${title}\n${description}`);
  }, []);

  return { toast };
}