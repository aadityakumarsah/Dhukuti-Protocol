import {
  ChevronDown,
  FileText,
  Box,
  BookOpen,
  Compass,
  Users,
  Code,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "./Logo";

type NavItem = {
  label: string;
  href?: string;
  icon?: typeof FileText;
  children?: NavItem[];
};

const navTree: NavItem[] = [
  {
    label: "Getting Started",
    icon: Compass,
    children: [
      { label: "Installation", href: "#installation" },
      { label: "Quick Start", href: "#quick-start" },
    ],
  },
  {
    label: "Core Concepts",
    icon: BookOpen,
    children: [
      { label: "What is Dhukuti?", href: "#what-is-dhukuti-protocol" },
      { label: "The Problem", href: "#the-problem" },
      { label: "The Solution", href: "#the-solution" },
      { label: "When It Fails", href: "#when-it-fails" },
    ],
  },
  {
    label: "Dhukuti Protocol",
    icon: Box,
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
    icon: Users,
    children: [
      { label: "How the App Works", href: "#how-the-app-works-user-flow" },
      { label: "Step-by-Step Guide", href: "#step-by-step-user-guide" },
      { label: "Troubleshooting", href: "#troubleshooting" },
      { label: "For a 5 Year Old", href: "#how-to-use-it-for-a-5-year-old" },
      { label: "Privacy & Policy", href: "#privacy--policy" },
      { label: "Safety", href: "#safety" },
    ],
  },
  {
    label: "Technical Reference",
    icon: Code,
    children: [
      { label: "Smart Contract Flow", href: "#how-it-works-technical-flow" },
      { label: "Accounts", href: "#smart-contract-accounts" },
      { label: "Features", href: "#current-features" },
      { label: "Limitations", href: "#mvp-limitations" },
    ],
  },
];

function flattenNav(items: NavItem[]): { label: string; href: string }[] {
  const result: { label: string; href: string }[] = [];
  for (const item of items) {
    if (item.href) result.push({ label: item.label, href: item.href });
    if (item.children) result.push(...flattenNav(item.children));
  }
  return result;
}

function NavTreeItem({
  item,
  depth = 0,
  activeHref,
  onNavigate,
}: {
  item: NavItem;
  depth?: number;
  activeHref: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = !!item.children?.length;

  const isActive = item.href === activeHref;
  const isParentOfActive = item.children?.some(
    (c) => c.href === activeHref || c.children?.some((cc) => cc.href === activeHref)
  );

  useEffect(() => {
    if (isParentOfActive || isActive) setOpen(true);
  }, [isParentOfActive, isActive]);

  if (!hasChildren) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <FileText size={14} className="shrink-0 opacity-60" />
        <span>{item.label}</span>
        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
      </a>
    );
  }

  const Icon = item.icon || FileText;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
          isParentOfActive
            ? "text-sidebar-foreground"
            : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        <Icon size={15} className="shrink-0 opacity-70" />
        <span>{item.label}</span>
        <div className="ml-auto flex items-center gap-1">
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-0.5">
          {item.children?.map((child, i) => (
            <NavTreeItem
              key={i}
              item={child}
              depth={depth + 1}
              activeHref={activeHref}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [activeHref, setActiveHref] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onHash = () => setActiveHref(window.location.hash || "#what-is-dhukuti-protocol");
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const allItems = useMemo(() => flattenNav(navTree), []);

  const filtered = search
    ? allItems.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : [];

  const sidebarContent = (
    <>
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="text-primary">
              <Logo size={22} />
            </div>
            <div>
              <a href="#" className="text-base font-bold tracking-tight">
                Dhukuti Docs
              </a>
              <p className="text-[11px] text-sidebar-foreground/50 mt-0.5">
                Protocol documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="relative mt-3">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sidebar-foreground/40"
          />
          <input
            type="text"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-sidebar-border bg-sidebar-accent/30 text-sidebar-foreground placeholder:text-sidebar-foreground/30 focus:outline-none focus:ring-1 focus:ring-sidebar-ring transition-all"
          />
        </div>
      </div>
      <nav className="px-3 pb-4 space-y-0.5 overflow-y-auto flex-1">
        {search ? (
          filtered.length > 0 ? (
            <div className="space-y-0.5">
              <p className="text-[11px] text-sidebar-foreground/40 px-3 py-1.5">
                Search results ({filtered.length})
              </p>
              {filtered.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all"
                >
                  <FileText size={13} className="shrink-0 opacity-50" />
                  {item.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-sidebar-foreground/40 px-3 py-4 text-center">
              No results found
            </p>
          )
        ) : (
          navTree.map((item, i) => (
            <NavTreeItem key={i} item={item} activeHref={activeHref} onNavigate={onClose} />
          ))
        )}
      </nav>
      <div className="p-4 pt-2 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[11px] text-sidebar-foreground/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Devnet
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-border bg-sidebar text-sidebar-foreground flex flex-col hidden lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl animate-in slide-in-from-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
