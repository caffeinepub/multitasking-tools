import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Link, Maximize2, Unlink, Upload } from "lucide-react";
import { useCallback, useState } from "react";

export function ImageResizer() {
  const [original, setOriginal] = useState<{
    url: string;
    w: number;
    h: number;
    name: string;
  } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [resized, setResized] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginal({
        url,
        w: img.naturalWidth,
        h: img.naturalHeight,
        name: file.name,
      });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      setResized(null);
    };
  }, []);

  const handleWidthChange = (v: string) => {
    setWidth(v);
    if (keepRatio && original && v) {
      setHeight(
        String(Math.round((Number.parseInt(v, 10) / original.w) * original.h)),
      );
    }
  };

  const handleHeightChange = (v: string) => {
    setHeight(v);
    if (keepRatio && original && v) {
      setWidth(
        String(Math.round((Number.parseInt(v, 10) / original.h) * original.w)),
      );
    }
  };

  const resize = () => {
    if (!original || !width || !height) return;
    const img = new Image();
    img.src = original.url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = Number.parseInt(width, 10);
      const h = Number.parseInt(height, 10);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      setResized(canvas.toDataURL("image/png"));
    };
  };

  const scalePresets = original
    ? [
        {
          label: "25%",
          w: Math.round(original.w * 0.25),
          h: Math.round(original.h * 0.25),
        },
        {
          label: "50%",
          w: Math.round(original.w * 0.5),
          h: Math.round(original.h * 0.5),
        },
        {
          label: "75%",
          w: Math.round(original.w * 0.75),
          h: Math.round(original.h * 0.75),
        },
        {
          label: "HD",
          w: 1280,
          h: Math.round((1280 / original.w) * original.h),
        },
      ]
    : [];

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
        data-ocid="img-resize-drop"
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
          {/* Original info */}
          <div className="glass rounded-xl p-3 flex items-center gap-3 border border-border/30">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Maximize2 className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {original.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {original.w} × {original.h} px
              </p>
            </div>
          </div>

          {/* Scale presets */}
          <div>
            <Label className="text-xs font-semibold text-foreground/80 block mb-2">
              Quick Presets
            </Label>
            <div className="flex gap-2 flex-wrap">
              {scalePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setWidth(String(preset.w));
                    setHeight(String(preset.h));
                    setResized(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-border/30 hover:border-primary/40 hover:text-primary hover:bg-primary/8 transition-smooth"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Width/height inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="img-width"
                className="text-xs font-semibold text-foreground/80"
              >
                Width (px)
              </Label>
              <Input
                id="img-width"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                type="number"
                className="bg-background/60 border-border/40 focus:border-primary/50 transition-all font-mono text-sm text-foreground"
                data-ocid="img-width"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="img-height"
                className="text-xs font-semibold text-foreground/80"
              >
                Height (px)
              </Label>
              <Input
                id="img-height"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                type="number"
                className="bg-background/60 border-border/40 focus:border-primary/50 transition-all font-mono text-sm text-foreground"
                data-ocid="img-height"
              />
            </div>
          </div>

          {/* Aspect ratio toggle */}
          <button
            type="button"
            onClick={() => setKeepRatio(!keepRatio)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-smooth border w-fit ${
              keepRatio
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/30 border-border/30 text-muted-foreground hover:border-border/60"
            }`}
            data-ocid="img-ratio"
          >
            {keepRatio ? (
              <Link className="w-3.5 h-3.5" />
            ) : (
              <Unlink className="w-3.5 h-3.5" />
            )}
            {keepRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
          </button>

          <Button
            type="button"
            onClick={resize}
            className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0"
            data-ocid="img-resize-btn"
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Resize Image
          </Button>
        </>
      )}

      {resized && (
        <div className="flex flex-col gap-3 animate-scale-in">
          <div className="glass rounded-xl p-3 flex items-center gap-2 border border-border/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-xs text-foreground font-semibold">
              Resized to {width} × {height} px
            </span>
          </div>
          <img
            src={resized}
            alt="Resized preview"
            className="rounded-xl max-h-36 object-contain mx-auto border border-border/20"
          />
          <a href={resized} download="resized.png" className="block">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-border/40 hover:border-primary/40 hover:text-primary transition-smooth"
              data-ocid="img-resize-download"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PNG
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
