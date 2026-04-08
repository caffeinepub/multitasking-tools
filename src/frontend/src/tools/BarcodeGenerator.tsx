import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Barcode, Download } from "lucide-react";
import { useRef, useState } from "react";

interface JsBarcodeOptions {
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  background: string;
  lineColor: string;
  margin: number;
  fontSize: number;
}
type JsBarcodeFunction = (
  el: HTMLCanvasElement,
  text: string,
  opts: JsBarcodeOptions,
) => void;

const FORMATS = [
  { value: "CODE128", label: "CODE128 — Universal" },
  { value: "EAN13", label: "EAN-13 — Products" },
  { value: "UPC", label: "UPC — Retail" },
  { value: "CODE39", label: "CODE39 — Alphanumeric" },
];

function loadJsBarcode(): Promise<JsBarcodeFunction> {
  return new Promise((resolve, reject) => {
    const w = window as Window & { JsBarcode?: JsBarcodeFunction };
    if (w.JsBarcode) {
      resolve(w.JsBarcode);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";
    script.onload = () => {
      const fn = (window as Window & { JsBarcode?: JsBarcodeFunction })
        .JsBarcode;
      if (fn) resolve(fn);
      else reject(new Error("Load failed"));
    };
    script.onerror = () => reject(new Error("Script load failed"));
    document.body.appendChild(script);
  });
}

export function BarcodeGenerator() {
  const [text, setText] = useState("1234567890");
  const [format, setFormat] = useState("CODE128");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!canvasRef.current || !text.trim()) return;
    setError("");
    setLoading(true);
    try {
      const JsBarcode = await loadJsBarcode();
      JsBarcode(canvasRef.current, text, {
        format,
        width: 2.5,
        height: 90,
        displayValue: true,
        background: "#ffffff",
        lineColor: "#1a1a2e",
        margin: 12,
        fontSize: 14,
      });
      setGenerated(true);
    } catch {
      setError(
        "Invalid value for selected barcode format. Try a different format or value.",
      );
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "barcode.png";
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Format */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/80">
          Barcode Format
        </Label>
        <Select
          value={format}
          onValueChange={(v) => {
            setFormat(v);
            setError("");
          }}
        >
          <SelectTrigger
            className="bg-background/60 border-border/40 focus:border-primary/50 transition-all"
            data-ocid="bc-format"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMATS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Format hints */}
      <div className="glass rounded-xl p-3 text-xs text-muted-foreground leading-relaxed">
        {format === "EAN13" && (
          <span>
            <span className="text-foreground font-semibold">EAN-13:</span>{" "}
            Exactly 12 digits (check digit auto-added)
          </span>
        )}
        {format === "UPC" && (
          <span>
            <span className="text-foreground font-semibold">UPC:</span> Exactly
            11 digits (check digit auto-added)
          </span>
        )}
        {format === "CODE39" && (
          <span>
            <span className="text-foreground font-semibold">CODE39:</span>{" "}
            Uppercase letters, digits, and -. $ / + %
          </span>
        )}
        {format === "CODE128" && (
          <span>
            <span className="text-foreground font-semibold">CODE128:</span> Any
            ASCII characters supported
          </span>
        )}
      </div>

      {/* Value input */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/80">
          Barcode Value
        </Label>
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          placeholder="Enter barcode value"
          className="bg-background/60 border-border/40 focus:border-primary/50 transition-all font-mono text-sm"
          data-ocid="bc-input"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="button"
        onClick={generate}
        disabled={loading || !text.trim()}
        className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0"
        data-ocid="bc-generate"
      >
        <Barcode className="w-4 h-4 mr-2" />
        {loading ? "Generating…" : "Generate Barcode"}
      </Button>

      {/* Canvas output */}
      <div
        className={`flex flex-col items-center gap-3 ${generated ? "animate-scale-in" : ""}`}
      >
        <div
          className={`p-4 rounded-2xl border border-border/30 glass overflow-x-auto w-full flex justify-center shadow-glass ${!generated ? "hidden" : ""}`}
        >
          <canvas ref={canvasRef} />
        </div>
        {generated && (
          <Button
            type="button"
            variant="outline"
            onClick={download}
            size="sm"
            className="border-border/40 hover:border-primary/40 hover:text-primary transition-smooth"
            data-ocid="bc-download"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download PNG
          </Button>
        )}
      </div>
    </div>
  );
}
