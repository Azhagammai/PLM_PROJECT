import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import AppLayout from "@/components/AppLayout";
import WelcomePage from "@/pages/WelcomePage";
import Dashboard from "@/pages/Dashboard";
import Generator from "@/pages/Generator";
import SearchParts from "@/pages/SearchParts";
import HistoryPage from "@/pages/HistoryPage";
import TranslatorPage from "@/pages/TranslatorPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/app/generate" element={<AppLayout><Generator /></AppLayout>} />
                <Route path="/app/search" element={<AppLayout><SearchParts /></AppLayout>} />
                <Route path="/app/history" element={<AppLayout><HistoryPage /></AppLayout>} />
                <Route path="/app/translator" element={<AppLayout><TranslatorPage /></AppLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
