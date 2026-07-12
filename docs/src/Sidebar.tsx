import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const navTree: NavItem[] = [
  {
    label: "Getting Started",
    children: [
      { label: "Installation", href: "#installation" },
      { label: "Quick Start", href: "#quick-start" },
    ],
  },
  {
    label: "Core Concepts",
    children: [
      { label: "What is Dhukuti?", href: "#what-is-dhukuti-protocol" },
      { label: "The Problem", href: "#the-problem" },
      { label: "The Solution", href: "#the-solution" },
      { label: "When It Fails", href: "#when-it-fails" },
    ],
  },
  {
    label: "Dhukuti Protocol",
    children: [
      { label: "Benefits", href: "#benefits" },
      { label: "Why Use It", href: "#why-use-dhukuti-protocol" },
      { label: "When to Use", href: "#when-to-use" },
      { label: "Who Can Use It", href: "#who-can-use-it" },
      { label: "Which Countries", href: "#which-countries" },
    ],
  },
  {
    label: "User Guide",
    children: [
      { label: "How the App Works", href: "#how-the-app-works-user-flow" },
      { label: "For a 5 Year Old", href: "#how-to-use-it-for-a-5-year-old" },
      { label: "Privacy & Policy", href: "#privacy--policy" },
      { label: "Safety", href: "#safety" },
    ],
  },
  {
    label: "Technical Reference",
    children: [
      { label: "Smart Contract Flow", href: "#how-it-works-technical-flow" },
      { label: "Accounts", href: "#smart-contract-accounts" },
      { label: "Features", href: "#current-features" },
      { label: "Limitations", href: "#mvp-limitations" },
    ],
  },
];

function NavTreeItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <a
        href={item.href}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <FileText size={14} className="shrink-0" />
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {open ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
        <span>{item.label}</span>
      </button>
      {open && item.children?.map((child, i) => (
        <NavTreeItem key={i} item={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-border bg-sidebar text-sidebar-foreground p-4 hidden lg:block">
      <div className="mb-6 px-3">
        <a href="#" className="text-lg font-bold tracking-tight">
          Dhukuti Docs
        </a>
        <p className="text-xs text-sidebar-foreground/60 mt-0.5">Protocol documentation</p>
      </div>
      <nav className="space-y-1">
        {navTree.map((item, i) => (
          <NavTreeItem key={i} item={item} />
        ))}
      </nav>
    </aside>
  );
}
