import { Button } from "@/components/ui/button";
import { AIHumanizer } from "@/tools/AIHumanizer";
import { AgeCalculator } from "@/tools/AgeCalculator";
import { BMICalculator } from "@/tools/BMICalculator";
import { BarcodeGenerator } from "@/tools/BarcodeGenerator";
import { CurrencyConverter } from "@/tools/CurrencyConverter";
import { ImageCompressor } from "@/tools/ImageCompressor";
import { ImageResizer } from "@/tools/ImageResizer";
import { LoanEMI } from "@/tools/LoanEMI";
import { PasswordGenerator } from "@/tools/PasswordGenerator";
import { PdfToolkit } from "@/tools/PdfToolkit";
import { QRGenerator } from "@/tools/QRGenerator";
import { TextStyleGenerator } from "@/tools/TextStyleGenerator";
import { TOOLS } from "@/types/tools";
import type { ToolId } from "@/types/tools";
import { X } from "lucide-react";
import * as Icons from "lucide-react";
import { useEffect, useRef } from "react";

interface ToolModalProps {
  toolId: ToolId | null;
  onClose: () => void;
}

const TOOL_COMPONENTS: Record<ToolId, React.ReactNode> = {
  "currency-converter": <CurrencyConverter />,
  "password-generator": <PasswordGenerator />,
  "qr-generator": <QRGenerator />,
  "barcode-generator": <BarcodeGenerator />,
  "image-compressor": <ImageCompressor />,
  "image-resizer": <ImageResizer />,
  "pdf-toolkit": <PdfToolkit />,
  "text-style": <TextStyleGenerator />,
  "age-calculator": <AgeCalculator />,
  "loan-emi": <LoanEMI />,
  "bmi-calculator": <BMICalculator />,
  "ai-humanizer": <AIHumanizer />,
};

export function ToolModal({ toolId, onClose }: ToolModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tool = TOOLS.find((t) => t.id === toolId);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (toolId) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [toolId, onClose]);

  useEffect(() => {
    if (toolId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [toolId]);

  if (!toolId || !tool) return null;

  const IconComponent = Icons[
    tool.icon as keyof typeof Icons
  ] as React.ElementType;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 animate-fade-in"
      style={{ background: "oklch(0.05 0.02 280 / 0.72)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
      data-ocid="modal-overlay"
    >
      {/* Blurred backdrop layer */}
      <div className="absolute inset-0 backdrop-blur-md" />

      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl shadow-2xl animate-scale-in overflow-hidden border border-border/30"
        style={{
          background: "oklch(var(--card) / 0.88)",
          backdropFilter: "blur(32px) saturate(200%)",
          WebkitBackdropFilter: "blur(32px) saturate(200%)",
          boxShadow:
            "0 0 0 1px oklch(var(--primary) / 0.12), 0 25px 60px -10px oklch(0 0 0 / 0.4), 0 10px 20px -5px oklch(0 0 0 / 0.25)",
        }}
      >
        {/* Top gradient accent line */}
        <div
          className={`h-0.5 w-full bg-gradient-to-r ${tool.gradient} opacity-90 flex-shrink-0`}
        />

        {/* Modal header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/20 flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0 shadow-glass relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            {IconComponent && (
              <IconComponent className="relative w-5 h-5 text-white drop-shadow-sm" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-foreground text-sm leading-tight">
              {tool.name}
            </h2>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {tool.description}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0 transition-smooth border border-transparent hover:border-border/30"
            onClick={onClose}
            aria-label="Close modal"
            data-ocid="modal-close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
          {TOOL_COMPONENTS[toolId]}
        </div>

        {/* Bottom ESC hint */}
        <div className="flex justify-center py-2 border-t border-border/10 flex-shrink-0">
          <span className="text-xs text-muted-foreground/40">
            Press ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
