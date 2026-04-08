import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Check,
  Copy,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generate(len: number, opts: Record<string, boolean>): string {
  let pool = "";
  if (opts.upper) pool += CHARS.upper;
  if (opts.lower) pool += CHARS.lower;
  if (opts.numbers) pool += CHARS.numbers;
  if (opts.symbols) pool += CHARS.symbols;
  if (!pool) return "";
  return Array.from(
    { length: len },
    () => pool[Math.floor(Math.random() * pool.length)],
  ).join("");
}

interface StrengthInfo {
  label: string;
  color: string;
  bg: string;
  width: string;
  score: number;
  Icon: React.ElementType;
}

function strength(pw: string): StrengthInfo {
  const s =
    (pw.match(/[A-Z]/g) ? 1 : 0) +
    (pw.match(/[a-z]/g) ? 1 : 0) +
    (pw.match(/[0-9]/g) ? 1 : 0) +
    (pw.match(/[^A-Za-z0-9]/g) ? 1 : 0);
  const len = pw.length;
  if (len < 8 || s <= 1)
    return {
      label: "Weak",
      color: "text-destructive",
      bg: "bg-destructive",
      width: "w-1/4",
      score: 1,
      Icon: ShieldX,
    };
  if (len < 12 || s === 2)
    return {
      label: "Fair",
      color: "text-accent",
      bg: "bg-accent",
      width: "w-2/4",
      score: 2,
      Icon: ShieldAlert,
    };
  if (len < 16 || s === 3)
    return {
      label: "Good",
      color: "text-primary",
      bg: "bg-primary",
      width: "w-3/4",
      score: 3,
      Icon: Shield,
    };
  return {
    label: "Strong",
    color: "text-emerald-400",
    bg: "bg-emerald-400",
    width: "w-full",
    score: 4,
    Icon: ShieldCheck,
  };
}

const OPT_CONFIG = [
  { key: "upper", label: "Uppercase", example: "ABC" },
  { key: "lower", label: "Lowercase", example: "abc" },
  { key: "numbers", label: "Numbers", example: "123" },
  { key: "symbols", label: "Symbols", example: "!@#" },
] as const;

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState(() =>
    generate(16, { upper: true, lower: true, numbers: true, symbols: false }),
  );
  const [copied, setCopied] = useState(false);

  const regen = useCallback(
    () => setPassword(generate(length, opts)),
    [length, opts],
  );

  const copy = useCallback(() => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard!", { icon: "🔑" });
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const toggleOpt = (key: string) => {
    const next = { ...opts, [key]: !opts[key as keyof typeof opts] };
    setOpts(next);
    setPassword(generate(length, next));
  };

  const { label, color, bg, width, Icon } = strength(password);

  return (
    <div className="flex flex-col gap-5">
      {/* Password display */}
      <div className="relative group">
        <div className="glass rounded-xl p-4 pr-20 min-h-[60px] flex items-center border border-border/30 focus-within:border-primary/40 focus-within:shadow-glow-primary transition-all duration-300">
          <code className="text-sm font-mono text-foreground break-all flex-1 min-w-0 select-all leading-relaxed">
            {password || "Select options below"}
          </code>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
            onClick={regen}
            aria-label="Regenerate"
            data-ocid="pw-regen"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-smooth ${copied ? "text-emerald-400 bg-emerald-400/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
            onClick={copy}
            aria-label="Copy"
            data-ocid="pw-copy"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Strength indicator */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${color}`} />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Password Strength
            </span>
            <span className={`text-xs font-bold ${color}`}>{label}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bg} ${width}`}
            />
          </div>
        </div>
      </div>

      {/* Length slider */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-foreground/80">
            Password Length
          </span>
          <span className="text-sm font-bold text-primary tabular-nums">
            {length} chars
          </span>
        </div>
        <Slider
          min={6}
          max={64}
          value={[length]}
          onValueChange={([v]) => {
            setLength(v);
            setPassword(generate(v, opts));
          }}
          data-ocid="pw-length"
        />
        <div className="flex justify-between text-xs text-muted-foreground/60">
          <span>6</span>
          <span>64</span>
        </div>
      </div>

      {/* Character options */}
      <div>
        <span className="text-xs font-semibold text-foreground/80 block mb-2.5">
          Character Types
        </span>
        <div className="grid grid-cols-2 gap-2">
          {OPT_CONFIG.map(({ key, label: optLabel, example }) => (
            <label
              key={key}
              htmlFor={`pw-opt-${key}`}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-smooth border ${
                opts[key]
                  ? "bg-primary/8 border-primary/30 text-foreground"
                  : "bg-muted/30 border-border/30 text-muted-foreground hover:border-border/60"
              }`}
            >
              <Checkbox
                id={`pw-opt-${key}`}
                checked={opts[key]}
                onCheckedChange={() => toggleOpt(key)}
                data-ocid={`pw-opt-${key}`}
                className="flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold">{optLabel}</span>
                <span className="text-xs opacity-60 font-mono">{example}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={copy}
        className="w-full h-10 font-bold text-sm text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0"
        data-ocid="pw-copy-btn"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" /> Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" /> Copy Password
          </>
        )}
      </Button>
    </div>
  );
}
