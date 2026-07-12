import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { Breadcrumb } from "./Breadcrumb";
import { ActionBar } from "./ActionBar";
import { ThemeToggle } from "./ThemeToggle";
import { DocsContent } from "./content/DocsContent";
import { BookOpen } from "lucide-react";
import "./index.css";

export function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BookOpen size={18} className="text-primary" />
            <span className="hidden sm:inline">Documentation</span>
          </div>
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <div className="flex flex-1">
          <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
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
