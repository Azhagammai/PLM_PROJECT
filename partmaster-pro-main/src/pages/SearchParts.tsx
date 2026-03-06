import { useState, useCallback } from "react";
import { Search, Filter, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParts } from "@/hooks/useApi";

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

export default function SearchParts() {
  const [inputQ,    setInputQ]    = useState("");
  const [query,     setQuery]     = useState("");
  const [status,    setStatus]    = useState("all");
  const [category,  setCategory]  = useState("all");
  const [page,      setPage]      = useState(0);

  const apiStatus   = status   === "all" ? "" : status;
  const apiCategory = category === "all" ? "" : category;

  const { data, isLoading, isError } = useSearchParts(query, apiStatus, apiCategory, page);

  const parts       = data?.content        ?? [];
  const totalPages  = data?.totalPages     ?? 0;
  const totalItems  = data?.totalElements  ?? 0;

  const handleSearch = useCallback(() => {
    setQuery(inputQ);
    setPage(0);
  }, [inputQ]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Search Parts</h2>
        <p className="text-sm text-muted-foreground mt-1">Search existing parts in the database</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={inputQ}
            onChange={(e) => setInputQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Part number, description…"
            className="pl-10 bg-input border-border"
          />
        </div>

        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(0); }}>
          <SelectTrigger className="w-40 bg-input border-border">
            <Filter className="w-3.5 h-3.5 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="ELC">Electrical</SelectItem>
            <SelectItem value="MEC">Mechanical</SelectItem>
            <SelectItem value="HYD">Hydraulic</SelectItem>
            <SelectItem value="PNU">Pneumatic</SelectItem>
            <SelectItem value="STR">Structural</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
          <SelectTrigger className="w-36 bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="RELEASED">Released</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="OBSOLETE">Obsolete</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" /> Search
        </Button>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Part Number</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Description</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Category</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Rev</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Owner</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Plant</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-sm text-destructive">
                  ⚠ Could not load parts — make sure the backend is running on port 8080.
                </TableCell>
              </TableRow>
            ) : parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm text-muted-foreground">No parts found matching your criteria</p>
                </TableCell>
              </TableRow>
            ) : (
              parts.map((part) => (
                <TableRow key={part.id} className="border-border hover:bg-muted/30 cursor-pointer transition-colors">
                  <TableCell className="font-mono text-sm font-semibold text-primary">{part.partNumber}</TableCell>
                  <TableCell className="text-sm text-foreground max-w-[200px] truncate">{part.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{part.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] font-medium ${statusColors[part.status] || ""}`}>
                      {statusLabel[part.status] ?? part.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{part.revision}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{part.owner}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{part.plant}</TableCell>
                  <TableCell>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${totalItems} part${totalItems !== 1 ? "s" : ""} found`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page + 1} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
