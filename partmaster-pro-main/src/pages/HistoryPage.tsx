import { useState } from "react";
import { History, Cog, Download, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useParts, useDeletePart, useUpdatePartStatus } from "@/hooks/useApi";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  RELEASED:  "bg-success/10 text-success border-success/20",
  IN_REVIEW: "bg-warning/10 text-warning border-warning/20",
  OBSOLETE:  "bg-muted text-muted-foreground border-border",
};

const statusLabel: Record<string, string> = {
  RELEASED:  "Released",
  IN_REVIEW: "In Review",
  OBSOLETE:  "Obsolete",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  } catch { return iso; }
}

export default function HistoryPage() {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 15;

  const { data, isLoading, isError } = useParts(page, PAGE_SIZE);
  const { mutate: deletePart } = useDeletePart();
  const { mutate: updateStatus } = useUpdatePartStatus();

  const parts      = data?.content       ?? [];
  const totalPages = data?.totalPages    ?? 0;
  const totalItems = data?.totalElements ?? 0;

  const handleDelete = (id: number, partNumber: string) => {
    if (!confirm(`Delete part ${partNumber}?`)) return;
    deletePart(id, {
      onSuccess: () => toast.success(`${partNumber} deleted`),
      onError:   (e: Error) => toast.error(e.message),
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatus({ id, status: newStatus }, {
      onSuccess: (p) => toast.success(`Status updated to ${p.status}`),
      onError:   (e: Error) => toast.error(e.message),
    });
  };

  const handleExport = () => {
    if (!parts.length) return;
    const headers = ["Part Number","Description","Category","Subcategory","Material","Plant","Revision","Status","Owner","Created"];
    const rows = parts.map(p => [
      p.partNumber, p.description, p.category, p.subcategory,
      p.material, p.plant, p.revision, p.status, p.owner,
      formatDate(p.createdAt),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "parts-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parts History</h2>
          <p className="text-sm text-muted-foreground mt-1">All generated parts — newest first</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={parts.length === 0}>
          <Download className="w-3.5 h-3.5 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Part Number</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Description</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Category</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Plant</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-6 w-full" /></TableCell></TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-sm text-destructive">
                  ⚠ Cannot reach backend — start Spring Boot on port 8080.
                </TableCell>
              </TableRow>
            ) : parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <History className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground">No parts yet — generate your first one!</p>
                </TableCell>
              </TableRow>
            ) : (
              parts.map((part) => (
                <TableRow key={part.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm font-semibold text-primary">{part.partNumber}</TableCell>
                  <TableCell className="text-sm text-foreground max-w-[180px] truncate">{part.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{part.category}</TableCell>
                  <TableCell>
                    <Select value={part.status} onValueChange={(v) => handleStatusChange(part.id, v)}>
                      <SelectTrigger className="h-7 text-[10px] w-28 border-0 bg-transparent p-0 focus:ring-0">
                        <Badge variant="outline" className={`text-[10px] font-medium ${statusColors[part.status] || ""}`}>
                          {statusLabel[part.status] ?? part.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN_REVIEW">In Review</SelectItem>
                        <SelectItem value="RELEASED">Released</SelectItem>
                        <SelectItem value="OBSOLETE">Obsolete</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{part.plant}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{formatDate(part.createdAt)}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDelete(part.id, part.partNumber)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${totalItems} total part${totalItems !== 1 ? "s" : ""}`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground">Page {page + 1} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
