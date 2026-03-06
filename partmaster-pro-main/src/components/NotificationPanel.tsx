import { motion } from "framer-motion";
import { X, CheckCheck, Trash2, AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

const iconMap: Record<Notification["type"], typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colorMap: Record<Notification["type"], string> = {
  success: "text-success",
  info: "text-primary",
  warning: "text-warning",
  error: "text-destructive",
};

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markAllRead, clearAll, markRead } = useNotifications();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-14 right-4 z-50 w-96 max-h-[480px] rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">{t("notifications")}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
            <CheckCheck className="w-3 h-3 mr-1" /> {t("mark_all_read")}
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive" onClick={clearAll}>
            <Trash2 className="w-3 h-3 mr-1" /> {t("clear_all")}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">{t("no_notifications")}</div>
        ) : (
          notifications.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex gap-3 p-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorMap[n.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(n.time, { addSuffix: true })}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
