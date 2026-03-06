import { useState } from "react";
import { ArrowRightLeft, Copy, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const GOOGLE_API_KEY = "AIzaSyBvKURFRywAg5aHKmqpZHSjf15uMIvMJfg";

const languages = [
  { value: "en", label: "English" },
  { value: "ta", label: "Tamil (தமிழ்)" },
  { value: "hi", label: "Hindi (हिन्दी)" },
];

export default function TranslatorPage() {
  const { t } = useLanguage();
  const [sourceText, setSourceText] = useState("");
  const [translated, setTranslated] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("ta");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);
    try {
      const fromLabel = languages.find((l) => l.value === fromLang)?.label || fromLang;
      const toLabel = languages.find((l) => l.value === toLang)?.label || toLang;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Translate the following text from ${fromLabel} to ${toLabel}. Only return the translated text, nothing else:\n\n${sourceText}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (!res.ok) throw new Error("Translation failed");
      const data = await res.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "Translation failed.";
      setTranslated(result);
    } catch {
      toast.error("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setSourceText(translated);
    setTranslated(sourceText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translated);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t("translate_text")}</h2>
        <p className="text-sm text-muted-foreground mt-1">Translate between English, Tamil & Hindi</p>
      </div>

      {/* Language selectors */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">{t("from")}</label>
          <Select value={fromLang} onValueChange={setFromLang}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" size="icon" className="mt-5" onClick={swapLanguages}>
          <ArrowRightLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">{t("to")}</label>
          <Select value={toLang} onValueChange={setToLang}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Text areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">{t("from")}: {languages.find((l) => l.value === fromLang)?.label}</span>
          </div>
          <Textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t("enter_text")}
            className="bg-input border-border min-h-[200px] resize-none"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-foreground">{t("to")}: {languages.find((l) => l.value === toLang)?.label}</span>
            </div>
            {translated && (
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={copyToClipboard}>
                <Copy className="w-3 h-3 mr-1" /> Copy
              </Button>
            )}
          </div>
          <div className="bg-input border border-border rounded-md p-3 min-h-[200px] text-sm text-foreground whitespace-pre-wrap">
            {translated || <span className="text-muted-foreground">Translation will appear here...</span>}
          </div>
        </div>
      </div>

      <Button onClick={handleTranslate} disabled={loading || !sourceText.trim()} className="glow-blue">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRightLeft className="w-4 h-4 mr-2" />}
        {t("translate")}
      </Button>
    </div>
  );
}
