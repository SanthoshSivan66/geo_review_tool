"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Determine initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
      setIsLight(false);
    } else {
      document.documentElement.classList.add("light-theme");
      localStorage.setItem("theme", "light");
      setIsLight(true);
    }
  };

  if (!mounted) return <div style={{ width: 36, height: 36, marginLeft: 16 }} />;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle Light/Dark Mode"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        background: "var(--bg-2)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginLeft: "16px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--text-primary)";
        e.currentTarget.style.borderColor = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
