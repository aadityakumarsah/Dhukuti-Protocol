import { Copy, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export function ActionBar() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = document.querySelector("main")?.textContent || "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 mb-8 pb-5 border-b border-border/50">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-border/60 hover:bg-accent hover:border-border transition-all duration-150 text-muted-foreground hover:text-foreground"
      >
        {copied ? (
          <>
            <Check size={13} className="text-emerald-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy size={13} />
            Copy page
          </>
        )}
      </button>
      <span className="text-[11px] text-muted-foreground/40 ml-auto">v0.1.0</span>
    </div>
  );
}
