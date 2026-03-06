import { useState } from "react";
import { Cog, RotateCcw, Save, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PartNumberPreview from "@/components/PartNumberPreview";
import { toast } from "sonner";
import { useGeneratePart } from "@/hooks/useApi";
import { Part } from "@/lib/api";

const categories = [
  { value: "ELC", label: "Electrical" },
  { value: "MEC", label: "Mechanical" },
  { value: "HYD", label: "Hydraulic" },
  { value: "PNU", label: "Pneumatic" },
  { value: "STR", label: "Structural" },
];

const subcategories: Record<string, { value: string; label: string }[]> = {
  ELC: [
    { value: "RES", label: "Resistor" },
    { value: "CAP", label: "Capacitor" },
    { value: "IND", label: "Inductor" },
    { value: "CON", label: "Connector" },
    { value: "PCB", label: "Circuit Board" },
  ],
  MEC: [
    { value: "GER", label: "Gear" },
    { value: "BRG", label: "Bearing" },
    { value: "SHF", label: "Shaft" },
    { value: "HSG", label: "Housing" },
    { value: "BKT", label: "Bracket" },
  ],
  HYD: [
    { value: "VLV", label: "Valve" },
    { value: "PMP", label: "Pump" },
    { value: "CYL", label: "Cylinder" },
    { value: "FTG", label: "Fitting" },
  ],
  PNU: [
    { value: "ACT", label: "Actuator" },
    { value: "VLV", label: "Valve" },
    { value: "REG", label: "Regulator" },
  ],
  STR: [
    { value: "BEM", label: "Beam" },
    { value: "PLT", label: "Plate" },
    { value: "FRM", label: "Frame" },
  ],
};

const materials = [
  { value: "STL", label: "Steel" },
  { value: "ALU", label: "Aluminum" },
  { value: "CER", label: "Ceramic" },
  { value: "BRS", label: "Brass" },
  { value: "COP", label: "Copper" },
  { value: "TAN", label: "Tantalum" },
  { value: "TIT", label: "Titanium" },
  { value: "PLY", label: "Polymer" },
];

const plants = [
  { value: "PLT1", label: "Plant 1 - Chennai" },
  { value: "PLT2", label: "Plant 2 - Pune" },
  { value: "PLT3", label: "Plant 3 - Bangalore" },
  { value: "PLT4", label: "Plant 4 - Hyderabad" },
];

export default function Generator() {
  const [category,    setCategory]    = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [material,    setMaterial]    = useState("");
  const [plant,       setPlant]       = useState("");
  const [revision,    setRevision]    = useState("A");
  const [description, setDescription] = useState("");
  const [lastGenerated, setLastGenerated] = useState<Part | null>(null);

  const { mutate: generate, isPending } = useGeneratePart();

  const segments = [
    { label: "Category",    value: category    },
    { label: "Type",        value: subcategory },
    { label: "Material",    value: material    },
    { label: "Plant",       value: plant       },
  ];

  const handleReset = () => {
    setCategory(""); setSubcategory(""); setMaterial(""); setPlant("");
    setRevision("A"); setDescription(""); setLastGenerated(null);
  };

  const handleGenerate = () => {
    if (!category || !subcategory || !material || !plant || !description.trim()) {
      toast.error("Please fill all required fields including Description and Plant.");
      return;
    }

    generate(
      { category, subcategory, material, plant, revision, description },
      {
        onSuccess: (part) => {
          setLastGenerated(part);
          toast.success(`Part ${part.partNumber} generated and saved!`);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to generate part — is the backend running?");
        },
      }
    );
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Part Number Generator</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure parameters to generate a new part number</p>
      </div>

      <PartNumberPreview segments={segments} />

      {/* Success banner */}
      {lastGenerated && (
        <div className="rounded-xl border border-success/30 bg-success/10 p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success shrink-0" />
          <div>
            <p className="text-sm font-semibold text-success font-mono">{lastGenerated.partNumber}</p>
            <p className="text-xs text-muted-foreground">{lastGenerated.description} · Status: {lastGenerated.status}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Cog className="w-4 h-4 text-primary" />
              Classification
            </h3>

            <div className="space-y-3">
              {/* Category */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Category *</Label>
                <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); }}>
                  <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="font-mono text-xs mr-2 text-primary">{c.value}</span> {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Subcategory *</Label>
                <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                  <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {(subcategories[category] || []).map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <span className="font-mono text-xs mr-2 text-primary">{s.value}</span> {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Material */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Material *</Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Select material" /></SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <span className="font-mono text-xs mr-2 text-primary">{m.value}</span> {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plant (required by backend) */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Plant *</Label>
                <Select value={plant} onValueChange={setPlant}>
                  <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Select plant" /></SelectTrigger>
                  <SelectContent>
                    {plants.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="font-mono text-xs mr-2 text-primary">{p.value}</span> {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Revision */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Revision</Label>
                <Input
                  value={revision}
                  onChange={(e) => setRevision(e.target.value.toUpperCase())}
                  className="bg-input border-border font-mono"
                  placeholder="A"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Part Details</h3>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border min-h-[100px]"
                placeholder="Enter part description..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button className="flex-1" onClick={handleGenerate} disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Saving…" : "Generate & Save"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
