import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { Breadcrumb } from "./Breadcrumb";
import { ActionBar } from "./ActionBar";
import { ThemeToggle } from "./ThemeToggle";
import { DocsContent } from "./content/DocsContent";
import { BookOpen, Menu } from "lucide-react";
import "./index.css";

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen size={15} className="text-primary" />
            </div>
            <span className="text-sm font-semibold hidden sm:inline">Dhukuti Protocol</span>
          </div>

          <div className="flex-1" />

          <ThemeToggle />
        </header>

        <div className="flex flex-1 relative">
          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 lg:py-10 max-w-4xl mx-auto w-full min-h-[calc(100vh-57px)]">
            <Breadcrumb />
            <ActionBar />
            <DocsContent />
          </main>

          <TableOfContents />
        </div>
      </div>
    </div>
  );
}

export default App;
