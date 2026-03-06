import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent";
}

export default function StatCard({ title, value, subtitle, icon: Icon, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 transition-all hover:scale-[1.02] ${
      variant === "primary" 
        ? "bg-primary/5 border-primary/20 glow-amber" 
        : variant === "accent"
        ? "bg-accent/5 border-accent/20 glow-blue"
        : "bg-card border-border"
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold mt-2 font-mono animate-counter ${
            variant === "primary" ? "text-primary" : variant === "accent" ? "text-accent" : "text-foreground"
          }`}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          variant === "primary" 
            ? "bg-primary/10" 
            : variant === "accent" 
            ? "bg-accent/10" 
            : "bg-muted"
        }`}>
          <Icon className={`w-5 h-5 ${
            variant === "primary" ? "text-primary" : variant === "accent" ? "text-accent" : "text-muted-foreground"
          }`} />
        </div>
      </div>
    </div>
  );
}
