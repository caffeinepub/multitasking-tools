import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ToolModal } from "@/components/ToolModal";
import { useTheme } from "@/hooks/useTheme";
import type { ToolId } from "@/types/tools";
import { useState } from "react";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Fixed dark gradient overlay for dark mode depth */}
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-br from-background via-background to-primary/5"
        aria-hidden="true"
      />

      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setSidebarOpen(true)}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectTool={(id) => setActiveTool(id)}
      />

      <div className="relative">
        <Dashboard onOpenTool={(id) => setActiveTool(id)} />
      </div>

      <footer className="relative border-t border-border/20 py-4 px-6 bg-card/60 backdrop-blur-sm">
        <p className="text-center text-xs text-muted-foreground">
          Made by{" "}
          <span className="font-semibold text-foreground/70">AppMedo</span>
        </p>
      </footer>

      <ToolModal toolId={activeTool} onClose={() => setActiveTool(null)} />
    </div>
  );
}
