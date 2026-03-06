import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Cog, Search, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">

      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/Robot.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for Better Text Visibility */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Background grid & glow */}
      <div className="absolute inset-0 surface-grid opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="mx-auto w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-8 glow-blue"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Zap className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            {t("welcome_title")}
          </h1>

          <p className="text-lg text-primary font-semibold mb-4 font-mono tracking-wide">
            {t("welcome_subtitle")}
          </p>

          <p className="text-gray-300 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            {t("welcome_desc")}
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[
            { icon: Cog, label: "Generate" },
            { icon: Search, label: "Search" },
            { icon: Database, label: "Manage" },
            { icon: Globe, label: "Multi-language" },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-md p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
            >
              <f.icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-white">
                {f.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            size="lg"
            className="text-base px-10 py-6 glow-blue"
            onClick={() => navigate("/app")}
          >
            {t("get_started")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        <motion.p
          className="mt-6 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Powered by Siemens Teamcenter SOA v14.0
        </motion.p>
      </div>
    </div>
  );
}
