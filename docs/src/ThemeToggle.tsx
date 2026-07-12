import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <Sun
          size={16}
          className={`absolute inset-0 transition-all duration-300 ${
            dark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          size={16}
          className={`absolute inset-0 transition-all duration-300 ${
            dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
}
