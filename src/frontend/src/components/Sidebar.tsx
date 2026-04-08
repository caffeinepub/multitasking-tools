import { Button } from "@/components/ui/button";
import { TOOLS } from "@/types/tools";
import type { ToolId } from "@/types/tools";
import { X, Zap } from "lucide-react";
import * as Icons from "lucide-react";
import { useEffect, useRef } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onSelectTool: (id: ToolId) => void;
}

export function Sidebar({ open, onClose, onSelectTool }: SidebarProps) {
  const sidebarRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-sm transition-all duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "oklch(0.05 0.02 280 / 0.6)" }}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <dialog
        ref={sidebarRef}
        aria-modal="true"
        aria-label="Tool navigation"
        open={open}
        className={`fixed left-0 top-0 bottom-0 m-0 z-50 w-72 flex flex-col border-r border-border/30 shadow-2xl transform transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] p-0 max-h-none h-full ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "oklch(var(--card) / 0.92)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
        }}
      >
        {/* Top gradient accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-[oklch(0.72_0.22_310)] to-accent flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glass relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
              <Zap className="relative w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-foreground text-sm">
              Quick Jump
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border/30 transition-smooth"
            onClick={onClose}
            aria-label="Close sidebar"
            data-ocid="sidebar-close"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Tool list */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <p className="px-3 mb-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.12em]">
            All Tools
          </p>
          <ul className="space-y-0.5">
            {TOOLS.map((tool, i) => {
              const IconComponent = Icons[
                tool.icon as keyof typeof Icons
              ] as React.ElementType;
              return (
                <li
                  key={tool.id}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${i * 30}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTool(tool.id);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-smooth hover:bg-primary/10 hover:text-primary group border border-transparent hover:border-primary/15"
                    data-ocid={`sidebar-tool-${tool.id}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center flex-shrink-0 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200 relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent" />
                      {IconComponent && (
                        <IconComponent className="relative w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground/75 group-hover:text-primary transition-colors truncate">
                      {tool.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/20">
          <p className="text-xs text-muted-foreground/50 text-center font-medium tracking-wide">
            Made by AppMedo
          </p>
        </div>
      </dialog>
    </>
  );
}
