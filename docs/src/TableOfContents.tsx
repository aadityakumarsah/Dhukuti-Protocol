import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

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
    <aside className="w-56 shrink-0 h-screen sticky top-0 overflow-y-auto p-4 hidden xl:block">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        On this page
      </h3>
      <nav className="space-y-1">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`block text-sm py-1 transition-colors ${
              h.level === 3 ? "pl-4" : ""
            } ${
              activeId === h.id
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
      <div className="mt-6 pt-4 border-t border-border">
        <a
          href="https://github.com/aadityakumarsah/Dhukuti-Protocol"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink size={12} />
          Edit on GitHub
        </a>
      </div>
    </aside>
  );
}
