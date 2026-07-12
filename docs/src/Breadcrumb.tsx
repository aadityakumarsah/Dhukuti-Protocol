import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-8">
      <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home size={13} />
      </a>
      <ChevronRight size={12} />
      <a href="#" className="hover:text-foreground transition-colors">
        Documentation
      </a>
      <ChevronRight size={12} />
      <span className="text-foreground/80 font-medium">Protocol Reference</span>
    </nav>
  );
}
