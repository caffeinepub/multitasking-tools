import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, ImageIcon, TrendingDown, Upload } from "lucide-react";
import { useCallback, useState } from "react";

function fmt(b: number): string {
  return b > 1024 * 1024
    ? `${(b / 1024 / 1024).toFixed(2)} MB`
    : `${(b / 1024).toFixed(1)} KB`;
}

export function ImageCompressor() {
  const [original, setOriginal] = useState<{
    url: string;
    size: number;
    name: string;
  } | null>(null);
  const [compressed, setCompressed] = useState<{
    url: string;
    size: number;
  } | null>(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setOriginal({ url, size: file.size, name: file.name });
    setCompressed(null);
  }, []);

  const compress = useCallback(() => {
    if (!original) return;
    setLoading(true);
    const img = new Image();
    img.src = original.url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setLoading(false);
            return;
          }
          setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
          setLoading(false);
        },
        "image/jpeg",
        quality / 100,
      );
    };
  }, [original, quality]);

  const savedPct =
    compressed && original
      ? Math.round((1 - compressed.size / original.size) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <label
        className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-primary/70 bg-primary/8 shadow-glow-primary"
            : "border-border/40 hover:border-primary/50 hover:bg-primary/5"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith("image/")) handleFile(file);
        }}
        data-ocid="img-compress-drop"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            Drop image here
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            or click to browse — JPG, PNG, WebP
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label>

      {original && (
        <>
          {/* File info */}
          <div className="glass rounded-xl p-3 flex items-center gap-3 border border-border/30">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {original.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Original size:{" "}
                <span className="font-mono text-foreground/70">
                  {fmt(original.size)}
                </span>
              </p>
            </div>
          </div>

          {/* Quality slider */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-foreground/80">
                Output Quality
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold tabular-nums ${quality >= 70 ? "text-emerald-400" : quality >= 40 ? "text-accent" : "text-destructive"}`}
                >
                  {quality}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {quality >= 70 ? "High" : quality >= 40 ? "Medium" : "Low"}
                </span>
              </div>
            </div>
            <Slider
              min={10}
              max={100}
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              data-ocid="img-quality"
            />
            <div className="flex justify-between text-xs text-muted-foreground/60">
              <span>Smallest file</span>
              <span>Best quality</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={compress}
            disabled={loading}
            className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0 disabled:opacity-60"
            data-ocid="img-compress-btn"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Compressing…
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-2" /> Compress Image
              </>
            )}
          </Button>
        </>
      )}

      {compressed && original && (
        <div className="glass rounded-2xl p-4 flex flex-col gap-3 animate-scale-in border border-border/30">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Original",
                value: fmt(original.size),
                color: "text-muted-foreground",
              },
              {
                label: "Compressed",
                value: fmt(compressed.size),
                color: "text-emerald-400",
              },
              {
                label: "Saved",
                value: `${savedPct}%`,
                color: savedPct > 0 ? "text-primary" : "text-muted-foreground",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="text-center p-2 rounded-xl bg-muted/30"
              >
                <p className={`text-sm font-bold font-mono ${color}`}>
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <img
            src={compressed.url}
            alt="Compressed preview"
            className="rounded-xl max-h-36 object-contain mx-auto border border-border/20"
          />
          <a href={compressed.url} download="compressed.jpg" className="block">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-border/40 hover:border-primary/40 hover:text-primary transition-smooth"
              data-ocid="img-download"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download Compressed Image
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
