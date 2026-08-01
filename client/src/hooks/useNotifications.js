import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { notificationService } from "../services/notificationService.js";

export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await notificationService.list();
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const markAllRead = useCallback(async () => {
    await notificationService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return { items, unreadCount, loading, refresh, markAllRead };
}
