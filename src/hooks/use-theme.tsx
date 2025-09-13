import { useState } from "react";

// Simple theme hook for light/dark mode
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return { theme, setTheme, toggleTheme };
}
