import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StyleDef {
  name: string;
  category: string;
  transform: (s: string) => string;
}

const BOLD_MAP: Record<string, string> = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((c, i) => [c, String.fromCodePoint(0x1d41a + i)])
    .concat(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .map((c, i) => [c, String.fromCodePoint(0x1d400 + i)]),
    ),
);
const ITALIC_MAP: Record<string, string> = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map((c, i) => [c, String.fromCodePoint(0x1d44e + i)])
    .concat(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .map((c, i) => [c, String.fromCodePoint(0x1d434 + i)]),
    ),
);

const mapChars = (s: string, m: Record<string, string>) =>
  s
    .split("")
    .map((c) => m[c] ?? c)
    .join("");

const STYLES: StyleDef[] = [
  { name: "Bold", category: "weight", transform: (s) => mapChars(s, BOLD_MAP) },
  {
    name: "Italic",
    category: "style",
    transform: (s) => mapChars(s, ITALIC_MAP),
  },
  { name: "UPPERCASE", category: "case", transform: (s) => s.toUpperCase() },
  { name: "lowercase", category: "case", transform: (s) => s.toLowerCase() },
  {
    name: "Title Case",
    category: "case",
    transform: (s) => s.replace(/\b\w/g, (c) => c.toUpperCase()),
  },
  {
    name: "Strikethrough",
    category: "decoration",
    transform: (s) =>
      s
        .split("")
        .map((c) => `${c}\u0336`)
        .join(""),
  },
  {
    name: "Underline",
    category: "decoration",
    transform: (s) =>
      s
        .split("")
        .map((c) => `${c}\u0332`)
        .join(""),
  },
  {
    name: "W  i  d  e",
    category: "spacing",
    transform: (s) => s.split("").join("  "),
  },
  {
    name: "Mirror",
    category: "fun",
    transform: (s) => s.split("").reverse().join(""),
  },
  {
    name: "Ⓑⓤⓑⓑⓛⓔ",
    category: "fun",
    transform: (s) =>
      s
        .toUpperCase()
        .split("")
        .map((c) => {
          const cp = c.codePointAt(0)!;
          return cp >= 65 && cp <= 90
            ? String.fromCodePoint(0x24b6 + cp - 65)
            : c;
        })
        .join(""),
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  weight: "bg-primary/15 text-primary border-primary/20",
  style: "bg-accent/15 text-accent border-accent/20",
  case: "bg-secondary/60 text-secondary-foreground border-border/30",
  decoration: "bg-destructive/10 text-destructive border-destructive/20",
  spacing: "bg-muted text-muted-foreground border-border/30",
  fun: "bg-chart-4/20 text-foreground border-border/30",
};

export function TextStyleGenerator() {
  const [input, setInput] = useState("Hello World");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopied(name);
    toast.success(`${name} style copied!`, { icon: "✨" });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="text-style-input-field"
          className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"
        >
          <Type className="w-3.5 h-3.5" />
          Your Text
        </label>
        <Textarea
          id="text-style-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your text here…"
          className="bg-background/60 border-border/40 focus:border-primary/50 min-h-[72px] resize-none font-body text-sm transition-all"
          data-ocid="text-style-input"
        />
        <p className="text-xs text-muted-foreground/60">
          {input.length} characters
        </p>
      </div>

      {/* Style list */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-foreground/80 mb-1">
          Style Variations
        </span>
        {STYLES.map(({ name, category, transform }) => {
          const result = transform(input);
          const isCopied = copied === name;
          return (
            <div
              key={name}
              className="group glass rounded-xl px-3 py-2.5 flex items-center gap-3 border border-border/20 hover:border-primary/25 hover:bg-primary/4 transition-smooth"
            >
              <Badge
                variant="outline"
                className={`text-[10px] px-2 py-0.5 w-24 justify-center flex-shrink-0 font-bold border ${CATEGORY_COLORS[category]}`}
              >
                {name}
              </Badge>
              <span className="text-sm text-foreground flex-1 min-w-0 truncate font-body">
                {result || (
                  <span className="text-muted-foreground/40 italic">empty</span>
                )}
              </span>
              <button
                type="button"
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-smooth ${
                  isCopied
                    ? "bg-emerald-400/15 text-emerald-400"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100"
                }`}
                onClick={() => copy(result, name)}
                aria-label={`Copy ${name}`}
                data-ocid={`text-style-copy-${name}`}
              >
                {isCopied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={() => {
          const all = STYLES.map(
            ({ name, transform }) => `${name}:\n${transform(input)}`,
          ).join("\n\n");
          navigator.clipboard.writeText(all);
          toast.success("All styles copied!", { icon: "📋" });
        }}
        variant="outline"
        className="border-border/40 hover:border-primary/40 hover:text-primary text-xs transition-smooth"
        data-ocid="text-style-copy-all"
      >
        Copy All Styles
      </Button>
    </div>
  );
}
