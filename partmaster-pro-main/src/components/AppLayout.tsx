import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Cog, Search, History, ChevronRight, Zap, ChevronLeft,
  Bell, Sun, Moon, Languages, Globe, MessageSquare, PanelLeftClose, PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useNotifications } from "@/contexts/NotificationContext";
import NotificationPanel from "@/components/NotificationPanel";
import ChatWidget from "@/components/ChatWidget";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { to: "/app", icon: LayoutDashboard, labelKey: "dashboard" },
  { to: "/app/generate", icon: Cog, labelKey: "generator" },
  { to: "/app/search", icon: Search, labelKey: "search" },
  { to: "/app/history", icon: History, labelKey: "history" },
  { to: "/app/translator", icon: Globe, labelKey: "translator" },
];

const langLabels: Record<Language, string> = { en: "English", ta: "தமிழ்", hi: "हिन्दी" };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const { lang, setLang, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.aside
        className="border-r border-border bg-sidebar flex flex-col shrink-0 relative"
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-2.5 min-h-[64px]">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                <h1 className="text-sm font-bold text-foreground tracking-tight whitespace-nowrap">{t("partgen")}</h1>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest whitespace-nowrap">{t("teamcenter")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to === "/app" && location.pathname === "/app");
            const exactActive = item.to === "/app" ? location.pathname === "/app" : location.pathname.startsWith(item.to);
            return (
              <Tooltip key={item.to} delayDuration={collapsed ? 100 : 1000}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    end={item.to === "/app"}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      exactActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${exactActive ? "text-primary" : ""}`} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {t(item.labelKey)}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {exactActive && !collapsed && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-border space-y-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <Languages className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-xs">{langLabels[lang]}</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
              {(["en", "ta", "hi"] as Language[]).map((l) => (
                <DropdownMenuItem key={l} onClick={() => setLang(l)} className={lang === l ? "bg-primary/10 text-primary" : ""}>
                  {langLabels[l]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Connection status */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">{t("connected")}</p>
                  <p className="text-xs text-foreground font-medium">Teamcenter SOA</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">{t("active")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
        >
          {collapsed ? <PanelLeft className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-end px-6 gap-2 shrink-0">
          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === "dark" ? t("light") : t("dark")}</TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("notifications")}</TooltipContent>
          </Tooltip>
        </header>

        {/* Notification panel dropdown */}
        <AnimatePresence>
          {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
        </AnimatePresence>

        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>

      {/* Floating chat widget */}
      <ChatWidget />
    </div>
  );
}
