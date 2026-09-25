"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("scriptorium-theme", nextTheme);
  }

  return (
    <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label="Toggle color theme" title="Toggle color theme">
      <span aria-hidden="true">◐</span>
      <span className="sr-only">Toggle color theme</span>
    </button>
  );
}