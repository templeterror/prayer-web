"use client";

import { useEffect } from "react";

/**
 * Adds `.js-ready` to <html> on mount, then reveals every `.reveal` element as it
 * scrolls into view via IntersectionObserver. A 2.5s safety net reveals everything
 * if the observer stalls, so content is never stuck hidden. Mirrors the vanilla-JS
 * behavior from the original static page.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-ready");

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const revealAll = () => els.forEach((el) => el.classList.add("in"));

    let timer: number | undefined;
    let io: IntersectionObserver | undefined;

    if (!("IntersectionObserver" in window)) {
      revealAll();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => io?.observe(el));
      timer = window.setTimeout(revealAll, 2500);
    }

    return () => {
      io?.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
