import { Cog, Clock } from "lucide-react";
import { useRecentParts } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return "just now";
}

export default function RecentActivity() {
  const { data: parts, isLoading } = useRecentParts();

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="divide-y divide-border">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-md shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2.5 w-48" />
              </div>
            </div>
          ))
        ) : !parts || parts.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">
            No activity yet — generate your first part!
          </div>
        ) : (
          parts.map((part) => (
            <div key={part.id} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-primary/10">
                <Cog className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-semibold text-foreground truncate">{part.partNumber}</p>
                <p className="text-[10px] text-muted-foreground truncate">{part.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(part.createdAt)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
