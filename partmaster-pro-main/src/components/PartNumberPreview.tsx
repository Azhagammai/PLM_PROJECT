import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface PartNumberPreviewProps {
  segments: { label: string; value: string; color?: string }[];
  separator?: string;
}

export default function PartNumberPreview({ segments, separator = "-" }: PartNumberPreviewProps) {
  const [copied, setCopied] = useState(false);
  const partNumber = segments.map((s) => s.value).join(separator);

  const handleCopy = () => {
    navigator.clipboard.writeText(partNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 glow-amber">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Generated Part Number</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-2xl font-mono font-bold text-primary tracking-wider">{partNumber || "---"}</p>
      <div className="flex gap-2 mt-4 flex-wrap">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-primary/60" />
            <span className="text-[10px] text-muted-foreground">
              {seg.label}: <span className="text-foreground font-medium font-mono">{seg.value || "—"}</span>
            </span>
            {i < segments.length - 1 && <span className="text-border mx-1">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
