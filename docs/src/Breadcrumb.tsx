import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <a href="#" className="hover:text-foreground transition-colors">
        Dhukuti Documentation
      </a>
      <ChevronRight size={14} />
      <span className="text-foreground font-medium">Protocol Reference</span>
    </nav>
  );
}
