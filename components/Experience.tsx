"use client";

import { useEffect } from "react";
import Section from "@/components/Section";
import { EXPERIENCE } from "@/lib/data";

/**
 * Experience as chapters: the chapter nearest the viewport center is full
 * strength, the rest recede to 0.68 (never below, and hover/focus restores).
 */
export default function Experience() {
  useEffect(() => {
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter]")
    );
    if (chapters.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.setAttribute(
            "data-active",
            e.isIntersecting ? "true" : "false"
          );
        }
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 }
    );
    chapters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const [ericsson, alignerr, micro1] = EXPERIENCE;

  return (
    <Section
      id="experience"
      index="03"
      label="Experience"
      title="Three roles, one practice: make the claim measurable."
    >
      <div className="grid gap-14 lg:grid-cols-12">
        {/* sticky mini-index */}
        <div className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <p className="micro">Index</p>
            <ul className="mt-6 space-y-4 border-l border-line pl-5">
              {EXPERIENCE.map((x) => (
                <li key={x.id}>
                    <a
                      href={`#xp-${x.id}`}
                      className="group block text-sm text-fog-mid transition-colors hover:text-fog-hi"
                    >
                      <span className="block font-mono text-[10px] tracking-[0.14em] text-fog-mid">
                        {x.period.toUpperCase()}
                      </span>
                    <span className="mt-1 block">{x.company}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-20 lg:col-span-9">
          {/* ---------- Ericsson: featured chapter ---------- */}
          <article
            id={`xp-${ericsson.id}`}
            data-chapter
            data-active="true"
            className="xp-chapter scroll-mt-28"
          >
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
              <p className="micro">
                <span className="text-acc">01</span>
                <span className="mx-2 text-fog-low/70">/</span>
                Research
              </p>
              <p className="micro">{ericsson.period}</p>
            </div>
            <h3 className="mt-8 text-3xl font-light tracking-[-0.02em] text-fog-hi md:text-[2.75rem] md:leading-[1.05]">
              {ericsson.role}
            </h3>
            <p className="mt-3 text-base text-fog-mid md:text-lg">
              {ericsson.company} · {ericsson.location}
            </p>
            <ul className="mt-9 max-w-3xl space-y-6">
              {ericsson.bullets.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-acc/70"
                    aria-hidden="true"
                  />
                  <p className="text-[15px] leading-relaxed text-fog-mid">{b}</p>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-2">
              {ericsson.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </article>

          {/* ---------- Alignerr ---------- */}
          <article
            id={`xp-${alignerr.id}`}
            data-chapter
            className="xp-chapter scroll-mt-28"
          >
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
              <p className="micro">
                <span className="text-acc">02</span>
                <span className="mx-2 text-fog-low/70">/</span>
                Industry
              </p>
              <p className="micro">{alignerr.period}</p>
            </div>
            <h3 className="mt-8 text-2xl font-light tracking-[-0.02em] text-fog-hi md:text-3xl">
              {alignerr.role}
            </h3>
            <p className="mt-3 text-base text-fog-mid">
              {alignerr.company} · {alignerr.location}
            </p>
            <ul className="mt-7 max-w-3xl space-y-4">
              {alignerr.bullets.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="mt-[9px] h-px w-6 shrink-0 bg-line"
                    aria-hidden="true"
                  />
                  <p className="text-[15px] leading-relaxed text-fog-mid">{b}</p>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-2">
              {alignerr.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </article>

          {/* ---------- micro1 ---------- */}
          <article
            id={`xp-${micro1.id}`}
            data-chapter
            className="xp-chapter scroll-mt-28"
          >
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
              <p className="micro">
                <span className="text-acc">03</span>
                <span className="mx-2 text-fog-low/70">/</span>
                Industry
              </p>
              <p className="micro">{micro1.period}</p>
            </div>
            <h3 className="mt-8 text-2xl font-light tracking-[-0.02em] text-fog-hi md:text-3xl">
              {micro1.role}
            </h3>
            <p className="mt-3 text-base text-fog-mid">
              {micro1.company} · {micro1.location}
            </p>
            <ul className="mt-7 max-w-3xl space-y-4">
              {micro1.bullets.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="mt-[9px] h-px w-6 shrink-0 bg-line"
                    aria-hidden="true"
                  />
                  <p className="text-[15px] leading-relaxed text-fog-mid">{b}</p>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-2">
              {micro1.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}
