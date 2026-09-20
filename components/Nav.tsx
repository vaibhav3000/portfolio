"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/data";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Header state + reading progress
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keyboard shortcuts: 1–6 jump to sections (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const link = NAV_LINKS.find((l) => String(Number(l.n)) === e.key);
      if (link) {
        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "border-b border-line bg-ink-950/80 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="font-mono text-sm tracking-tight"
            aria-label="Back to top"
          >
            <span className="text-acc-green">vm@iisc</span>
            <span className="text-fog-low">:~$</span>
            <span className="blink ml-1 inline-block h-4 w-[7px] translate-y-[3px] bg-acc-green/80" />
          </a>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`font-mono text-xs transition-colors ${
                  active === l.id ? "text-acc-green" : "text-fog-mid hover:text-fog-hi"
                }`}
              >
                <span className={active === l.id ? "text-acc-green/70" : "text-fog-low/70"}>
                  {l.n}
                </span>{" "}
                {l.label}
              </a>
            ))}
            <span className="h-4 w-px bg-line" aria-hidden="true" />
            <a
              href={SITE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fog-mid transition-colors hover:text-fog-hi"
              aria-label="GitHub profile"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fog-mid transition-colors hover:text-fog-hi"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={SITE.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-acc-green/30 px-3 py-1.5 font-mono text-xs text-acc-green transition-all hover:bg-acc-green/10 hover:shadow-glow"
            >
              resume.pdf
            </a>
          </nav>

          <button
            type="button"
            className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-px w-6 bg-fog-hi transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute h-px w-6 bg-fog-hi transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>

        {/* Reading progress */}
        <div
          className="absolute bottom-[-1px] left-0 h-px origin-left bg-gradient-to-r from-acc-green to-acc-cyan transition-transform duration-150"
          style={{ width: "100%", transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink-950/95 pt-24 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="container-x flex flex-col" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-baseline gap-4 border-b border-line py-5 transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
            >
              <span className="font-mono text-xs text-acc-green">[{l.n}]</span>
              <span className="font-display text-3xl font-medium tracking-tight text-fog-hi">
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div
          className={`container-x mt-auto flex items-center justify-between pb-10 font-mono text-xs text-fog-low transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: open ? "360ms" : "0ms" }}
        >
          <span className="flex items-center gap-4">
            <a href={SITE.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-fog-hi">github</a>
            <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fog-hi">linkedin</a>
          </span>
          <a href={SITE.links.resume} target="_blank" rel="noopener noreferrer" className="text-acc-green">resume.pdf ↗</a>
        </div>
      </div>
    </>
  );
}
