import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/types/tools";
import type { ToolId } from "@/types/tools";
import { Zap } from "lucide-react";

interface DashboardProps {
  onOpenTool: (id: ToolId) => void;
}

export function Dashboard({ onOpenTool }: DashboardProps) {
  return (
    <main className="min-h-screen pt-16 pb-16">
      {/* ── Hero ─────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 overflow-hidden">
        {/* Animated orb background */}
        <div className="orb orb-primary w-[500px] h-[500px] top-[-180px] left-1/2 -translate-x-1/2" />
        <div className="orb orb-accent w-[320px] h-[320px] top-[60px] right-[-80px]" />
        <div className="orb orb-violet w-[280px] h-[280px] bottom-[-60px] left-[-60px]" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo badge */}
        <div className="relative mb-6 animate-slide-up">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-primary via-[oklch(0.65_0.28_290)] to-accent flex items-center justify-center shadow-glow-primary animate-pulse-soft">
            <Zap
              className="w-9 h-9 text-white drop-shadow-sm"
              strokeWidth={2.5}
            />
          </div>
          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ animation: "pulseRing 2s ease-out infinite" }}
          />
        </div>

        {/* Headline */}
        <h1
          className="relative font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-3 animate-slide-up leading-none"
          style={{ animationDelay: "60ms" }}
        >
          <span className="gradient-text animate-gradient bg-gradient-to-r from-primary via-[oklch(0.72_0.22_310)] to-accent">
            Multitasking
          </span>
        </h1>

        <p
          className="relative text-base md:text-lg text-muted-foreground max-w-sm mb-6 leading-relaxed animate-slide-up font-body"
          style={{ animationDelay: "120ms" }}
        >
          Your all-in-one productivity toolkit with{" "}
          <span className="text-foreground font-semibold">
            12 powerful tools
          </span>
        </p>

        {/* Status badge */}
        <div
          className="relative flex items-center gap-2.5 px-5 py-2 rounded-full glass border-border/40 text-xs font-semibold animate-slide-up tracking-wide"
          style={{ animationDelay: "200ms" }}
        >
          {/* Pulsing green dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-foreground/70 uppercase tracking-widest">
            All tools ready
          </span>
        </div>

        {/* Scroll hint */}
        <p
          className="relative mt-4 text-xs text-muted-foreground/50 animate-slide-up"
          style={{ animationDelay: "280ms" }}
        >
          Tap any card to launch
        </p>
      </section>

      {/* ── Tool Grid ────────────────────────── */}
      <section className="px-4 md:px-8 max-w-6xl mx-auto pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {TOOLS.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={index}
              onOpen={() => onOpenTool(tool.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
