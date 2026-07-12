import { useEffect, useState } from "react";
import { ExternalLink, Code2 } from "lucide-react";

type Heading = { id: string; text: string; level: number };

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll("h2, h3");
    const items: Heading[] = [];
    elements.forEach((el) => {
      if (el.id) {
        items.push({ id: el.id, text: el.textContent || "", level: Number(el.tagName[1]) });
      }
    });
    setHeadings(items);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 overflow-y-auto p-4 pt-20 hidden xl:block">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-4">
        On this page
      </h3>
      <nav className="space-y-0.5">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`toc-link relative block text-sm py-1 pr-3 transition-all duration-200 ${
              h.level === 3 ? "pl-5" : "pl-3"
            } ${
              activeId === h.id
                ? "active text-primary font-medium"
                : "text-muted-foreground/60 hover:text-foreground/80"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
      <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
        <a
          href={`https://github.com/aadityakumarsah/Dhukuti-Protocol/blob/main/docs/src/content/DocsContent.tsx`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <ExternalLink size={12} />
          Edit this page
        </a>
        <a
          href="https://github.com/aadityakumarsah/Dhukuti-Protocol"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <Code2 size={12} />
          Source code
        </a>
      </div>
    </aside>
  );
}
