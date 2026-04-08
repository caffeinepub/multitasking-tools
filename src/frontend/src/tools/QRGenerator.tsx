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
import { Download, Palette, QrCode } from "lucide-react";
import { useRef, useState } from "react";

interface QRCodeOptions {
  text: string;
  width: number;
  height: number;
  colorDark: string;
  colorLight: string;
}
type QRCodeConstructor = new (el: HTMLElement, opts: QRCodeOptions) => unknown;

const QR_TYPES = [
  { value: "URL", label: "Website URL", placeholder: "https://example.com" },
  { value: "Text", label: "Plain Text", placeholder: "Enter your text here" },
  { value: "Email", label: "Email Address", placeholder: "user@example.com" },
  { value: "Phone", label: "Phone Number", placeholder: "+91 9876543210" },
];

const QR_THEMES = [
  { label: "Classic", dark: "#000000", light: "#ffffff" },
  { label: "Purple", dark: "#6b21a8", light: "#faf5ff" },
  { label: "Blue", dark: "#1e40af", light: "#eff6ff" },
  { label: "Dark", dark: "#1a1a2e", light: "#e8e8f0" },
];

export function QRGenerator() {
  const [input, setInput] = useState("https://example.com");
  const [type, setType] = useState("URL");
  const [size, setSize] = useState("200");
  const [themeIdx, setThemeIdx] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedType = QR_TYPES.find((t) => t.value === type) ?? QR_TYPES[0];

  const generate = () => {
    if (!canvasRef.current || !input.trim()) return;
    setLoading(true);
    const theme = QR_THEMES[themeIdx];
    const doGen = (QRCodeCtor: QRCodeConstructor) => {
      if (!canvasRef.current) return;
      canvasRef.current.innerHTML = "";
      new QRCodeCtor(canvasRef.current, {
        text: input,
        width: Number.parseInt(size, 10),
        height: Number.parseInt(size, 10),
        colorDark: theme.dark,
        colorLight: theme.light,
      });
      setGenerated(true);
      setLoading(false);
    };
    const w = window as Window & { QRCode?: QRCodeConstructor };
    if (w.QRCode) {
      doGen(w.QRCode);
    } else {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.onload = () => {
        const w2 = window as Window & { QRCode?: QRCodeConstructor };
        if (w2.QRCode) doGen(w2.QRCode);
      };
      document.body.appendChild(script);
    }
  };

  const download = () => {
    const img = canvasRef.current?.querySelector(
      "img",
    ) as HTMLImageElement | null;
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type selector */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/80">
          QR Code Type
        </Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger
            className="bg-background/60 border-border/40 focus:border-primary/50 focus:shadow-glow-primary transition-all"
            data-ocid="qr-type"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QR_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content input */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/80">
          Content
        </Label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedType.placeholder}
          className="bg-background/60 border-border/40 focus:border-primary/50 focus:shadow-glow-primary transition-all font-mono text-sm"
          data-ocid="qr-input"
        />
      </div>

      {/* Size + Theme row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/80">
            Size
          </Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger
              className="bg-background/60 border-border/40"
              data-ocid="qr-size"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">128 × 128</SelectItem>
              <SelectItem value="200">200 × 200</SelectItem>
              <SelectItem value="256">256 × 256</SelectItem>
              <SelectItem value="512">512 × 512</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <Palette className="w-3 h-3" /> Theme
          </Label>
          <div className="flex gap-1.5 h-9 items-center">
            {QR_THEMES.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setThemeIdx(i)}
                className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 flex-shrink-0 ${themeIdx === i ? "border-primary scale-110 shadow-glow-primary" : "border-border/30 hover:border-border/60"}`}
                style={{ background: t.dark }}
                title={t.label}
              />
            ))}
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={generate}
        disabled={loading || !input.trim()}
        className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0"
        data-ocid="qr-generate"
      >
        <QrCode className="w-4 h-4 mr-2" />
        {loading ? "Generating…" : "Generate QR Code"}
      </Button>

      {generated && (
        <div className="flex flex-col items-center gap-3 animate-scale-in">
          <div className="p-4 rounded-2xl border border-border/30 glass flex justify-center shadow-glass">
            <div ref={canvasRef} />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={download}
            size="sm"
            className="border-border/40 hover:border-primary/40 hover:text-primary transition-smooth"
            data-ocid="qr-download"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download PNG
          </Button>
        </div>
      )}

      {!generated && <div ref={canvasRef} className="hidden" />}
    </div>
  );
}
