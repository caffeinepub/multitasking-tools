import type { Tool } from "@/types/tools";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  index: number;
  onOpen: () => void;
}

export function ToolCard({ tool, index, onOpen }: ToolCardProps) {
  const IconComponent = Icons[
    tool.icon as keyof typeof Icons
  ] as React.ElementType;

  return (
    <button
      type="button"
      className="group relative glass glass-hover shimmer rounded-2xl p-4 md:p-5 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-glass-hover hover:-translate-y-1 animate-slide-up text-left overflow-hidden"
      style={{ animationDelay: `${index * 55}ms`, animationFillMode: "both" }}
      onClick={onOpen}
      aria-label={`Open ${tool.name}`}
      data-ocid={`tool-card-${tool.id}`}
    >
      {/* Gradient border on hover — pseudo element via box-shadow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--primary) / 0.06) 0%, transparent 60%, oklch(var(--accent) / 0.04) 100%)",
        }}
      />

      {/* Top-right corner accent */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
      </div>

      {/* Icon container with deep gradient + glow */}
      <div
        className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300`}
      >
        {/* Inner shine */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
        {IconComponent && (
          <IconComponent className="relative w-5.5 h-5.5 text-white drop-shadow-sm" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
          {tool.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* CTA Button */}
      <div
        className="relative w-full overflow-hidden rounded-lg h-8 flex items-center justify-center text-xs font-bold text-white tracking-wide transition-all duration-300 group-hover:shadow-glow-primary"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--primary)) 0%, oklch(0.7 0.24 310) 50%, oklch(var(--accent)) 100%)",
          backgroundSize: "200% 100%",
        }}
      >
        <span className="relative z-10">Tap to open</span>
        {/* Shine sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
      </div>
    </button>
  );
}
