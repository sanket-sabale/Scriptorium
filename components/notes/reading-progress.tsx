"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    function updateProgress() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const documentElement = document.documentElement;
        const range = documentElement.scrollHeight - documentElement.clientHeight;
        setProgress(range > 0 ? Math.min(100, Math.max(0, (window.scrollY / range) * 100)) : 0);
      });
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}