import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";

interface HeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

export function Header({ theme, onToggleTheme, onToggleSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 md:px-6 glass-deep border-b border-border/20 shadow-glass">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Left: Hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="relative w-9 h-9 rounded-xl text-foreground hover:bg-primary/10 hover:text-primary transition-smooth border border-transparent hover:border-primary/20 hover:shadow-glow-primary"
        onClick={onToggleSidebar}
        aria-label="Open navigation menu"
        data-ocid="nav-hamburger"
      >
        <Menu className="w-4.5 h-4.5" />
      </Button>

      {/* Center: Branding */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap px-2">
        <p className="text-sm md:text-[0.9rem] font-display font-medium text-muted-foreground tracking-tight">
          Developed by{" "}
          <span className="font-bold gradient-text">Sanjay Maurya</span>{" "}
          <span className="text-foreground/40 font-normal text-xs md:text-sm">
            DU IITG
          </span>
        </p>
      </div>

      {/* Right: Theme Toggle */}
      <button
        type="button"
        className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-smooth border border-transparent hover:border-primary/20 hover:bg-primary/10 group overflow-hidden"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        data-ocid="nav-theme-toggle"
      >
        <span
          className={`absolute transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            theme === "dark"
              ? "translate-y-0 opacity-100 rotate-0"
              : "-translate-y-5 opacity-0 rotate-90"
          }`}
        >
          <Sun className="w-4.5 h-4.5 text-accent" />
        </span>
        <span
          className={`absolute transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            theme === "light"
              ? "translate-y-0 opacity-100 rotate-0"
              : "translate-y-5 opacity-0 -rotate-90"
          }`}
        >
          <Moon className="w-4.5 h-4.5 text-primary" />
        </span>
      </button>
    </header>
  );
}
