import { Cog, Database, TrendingUp, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import RecentActivity from "@/components/RecentActivity";
import { useAnalytics } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: analytics, isLoading, isError } = useAnalytics();

  const total    = analytics?.total    ?? 0;
  const released = analytics?.released ?? 0;
  const inReview = analytics?.inReview ?? 0;
  const byCategory: Record<string, number> = analytics?.byCategory ?? {};

  const categoryRows = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = categoryRows[0]?.[1] || 1;

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Part number generation overview and activity
        </p>
        {isError && (
          <p className="text-xs text-destructive mt-1">
            ⚠ Backend offline — start Spring Boot on port 8080 to see live data.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard icon={Cog}        title="Total Parts"   value={total.toLocaleString()}    subtitle="In database"        variant="primary" />
            <StatCard icon={TrendingUp} title="Released"      value={released.toLocaleString()} subtitle="Active parts"       variant="accent"  />
            <StatCard icon={Clock}      title="In Review"     value={inReview.toLocaleString()} subtitle="Pending approval"                     />
            <StatCard icon={Database}   title="Next Serial"   value={`#${analytics?.currentSerial ?? "—"}`} subtitle="Auto-assigned"            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Parts by Category</h3>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 rounded" />)}
              </div>
            ) : categoryRows.length === 0 ? (
              <p className="text-xs text-muted-foreground">No data yet — generate some parts first.</p>
            ) : (
              <div className="space-y-3">
                {categoryRows.map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-10 shrink-0">{cat}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{cat}</span>
                        <span className="text-[10px] text-muted-foreground">{count} parts</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div><RecentActivity /></div>
      </div>
    </div>
  );
}
