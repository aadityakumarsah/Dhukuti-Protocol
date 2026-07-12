import { Copy, ChevronDown, Check } from "lucide-react";
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
    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent transition-colors"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied!" : "Copy Markdown"}
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent transition-colors ml-auto">
        Open <ChevronDown size={14} />
      </button>
    </div>
  );
}
