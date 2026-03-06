import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  time: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markAllRead: () => void;
  clearAll: () => void;
  markRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllRead: () => {},
  clearAll: () => {},
  markRead: () => {},
});

const initialNotifications: Notification[] = [
  { id: "1", title: "Part Generated", message: "ELC-RES-CER-0042 created successfully", type: "success", time: new Date(Date.now() - 300000), read: false },
  { id: "2", title: "Search Complete", message: "Found 12 matching parts for MEC-BRG-*", type: "info", time: new Date(Date.now() - 900000), read: false },
  { id: "3", title: "Duplicate Detected", message: "PNU-ACT-STL-0012 already exists in Teamcenter", type: "warning", time: new Date(Date.now() - 3600000), read: false },
  { id: "4", title: "System Update", message: "Teamcenter SOA connection refreshed", type: "info", time: new Date(Date.now() - 7200000), read: true },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = useCallback((n: Omit<Notification, "id" | "time" | "read">) => {
    setNotifications((prev) => [
      { ...n, id: crypto.randomUUID(), time: new Date(), read: false },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
