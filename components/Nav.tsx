"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/data";
import { CASE_STUDIES } from "@/lib/caseStudies";
import ThemeToggle from "@/components/ThemeToggle";

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
  const [projOpen, setProjOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const projRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Compact bar state
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 32);
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

  // Projects dropdown: close on outside click or Escape
  useEffect(() => {
    if (!projOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (projRef.current && !projRef.current.contains(e.target as Node))
        setProjOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProjOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [projOpen]);

  // Mobile menu: scroll lock, Escape, focus in/out
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      closeRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled && !open
            ? "border-b border-line bg-ink-950/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`container-x flex items-center justify-between gap-6 transition-all duration-300 ${
            scrolled ? "h-14" : "h-20"
          }`}
        >
          <a
            href="/"
            className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap text-sm font-medium tracking-tight text-fog-hi"
            aria-label="Vaibhav Mahore, back to top"
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-acc transition-transform duration-300 group-hover:scale-125"
              aria-hidden="true"
            />
            Vaibhav Mahore
          </a>

          <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((l) =>
              l.id === "projects" ? (
                <div key={l.id} ref={projRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={projOpen}
                    aria-haspopup="true"
                    onClick={() => setProjOpen((v) => !v)}
                    className={`relative flex items-center gap-1.5 text-[13.5px] transition-colors duration-200 ${
                      projOpen ? "text-fog-hi" : "text-fog-mid hover:text-fog-hi"
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`text-[9px] transition-transform duration-200 ${projOpen ? "rotate-180" : ""}`}
                    >
                      ▾
                    </span>
                  </button>
                  {projOpen && (
                    <div className="absolute right-0 top-full z-50 mt-4 w-[360px] rounded-2xl border border-line bg-ink-900/90 p-2 shadow-float backdrop-blur-xl">
                      <p className="micro px-3 pb-1 pt-2">Projects</p>
                      {CASE_STUDIES.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/projects/${c.slug}/`}
                          onClick={() => setProjOpen(false)}
                          className="group flex items-baseline gap-3.5 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-ink-850"
                        >
                          <span className="micro pt-0.5 text-acc">{c.num}</span>
                          <span>
                            <span className="block text-sm text-fog-hi">{c.short}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-fog-low">
                              {c.slug === "s4-to-mamba"
                                ? "From S4 to Mamba-3, implemented and benchmarked"
                                : c.slug === "aire"
                                  ? "AI Reliability & Evaluation Engine"
                                  : "Verified tool-using coding agent"}
                            </span>
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/#projects"
                        onClick={() => setProjOpen(false)}
                        className="link-quiet mx-3 my-2 inline-flex text-xs text-fog-mid"
                      >
                        All projects
                        <span aria-hidden="true" className="text-[10px]">↓</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={l.id}
                  href={`/#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`relative text-[13.5px] transition-colors duration-200 ${
                    active === l.id
                      ? "text-fog-hi"
                      : "text-fog-mid hover:text-fog-hi"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-acc transition-opacity duration-200 ${
                      active === l.id ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={SITE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-fog-mid transition-colors hover:text-fog-hi sm:flex"
              aria-label="GitHub profile"
            >
              <GitHubIcon className="h-[17px] w-[17px]" />
            </a>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-fog-mid transition-colors hover:text-fog-hi sm:flex"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="h-[17px] w-[17px]" />
            </a>
            <a
              href={SITE.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="ml-1 hidden rounded-full border border-white/20 px-4 py-2 text-[13px] text-fog-hi transition-all duration-200 hover:border-acc/60 hover:text-white sm:inline-flex"
            >
              Resume
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="relative flex h-10 w-10 items-center justify-center lg:hidden"
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
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink-950/95 pt-24 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav className="container-x flex flex-col" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-baseline gap-4 border-b border-line py-5 transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
            >
              <span className="micro">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-3xl font-light tracking-tight text-fog-hi">
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div
          className={`container-x mt-8 transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: open ? "320ms" : "0ms" }}
        >
          <p className="micro">Projects</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CASE_STUDIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/projects/${c.slug}/`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-baseline gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-fog-hi"
                >
                  <span className="font-mono text-[10px] text-acc">{c.num}</span>
                  {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`container-x mt-auto flex items-center justify-between pb-10 transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: open ? "360ms" : "0ms" }}
        >
          <span className="flex items-center gap-5 text-sm">
            <a href={SITE.links.github} target="_blank" rel="noopener noreferrer" className="text-fog-mid hover:text-fog-hi">
              GitHub
            </a>
            <a href={SITE.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-fog-mid hover:text-fog-hi">
              LinkedIn
            </a>
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-line px-4 py-2 text-sm text-fog-hi"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
