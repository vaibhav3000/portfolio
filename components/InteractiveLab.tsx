"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { PROJECTS } from "@/lib/data";
import LabAgent from "@/components/lab/LabAgent";
import LabAire from "@/components/lab/LabAire";
import LabMamba from "@/components/lab/LabMamba";

/**
 * Project Deep Dive / Interactive Project Lab: an editorial selector over
 * the three case studies. The right panel is a playable explainer for the
 * selected system (play/step/reset, schematic vs measured labels); the left
 * column carries the summary, headline metric, and the case-study CTA.
 * Tabs follow the WAI-ARIA tabs pattern (roving tabindex, arrow keys).
 */

const LABS = { mamba: LabMamba, aire: LabAire, agent: LabAgent } as const;

export default function InteractiveLab() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const study = CASE_STUDIES[active];
  const project = PROJECTS.find((p) => p.id === study.slug) ?? PROJECTS[0];
  const Explainer = LABS[project.visual];
  const metric = study.metrics[0];

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (active + 1) % CASE_STUDIES.length
        : (active + CASE_STUDIES.length - 1) % CASE_STUDIES.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="mx-auto w-full max-w-[980px] rounded-2xl border border-line bg-ink-900/40 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="micro">
          <span className="text-acc">Interactive lab</span>
          <span className="mx-2 text-fog-low/60">·</span>
          play, step, and reset each system
        </p>
        <p className="micro hidden md:block">space play · ← → step · R reset</p>
      </div>

      {/* selector */}
      <div
        role="tablist"
        aria-label="Project deep dive"
        onKeyDown={onKey}
        className="-mx-5 mt-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0"
      >
        {CASE_STUDIES.map((c, i) => (
          <button
            key={c.slug}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`dd-tab-${c.slug}`}
            aria-selected={i === active}
            aria-controls={`dd-panel-${c.slug}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`group shrink-0 snap-start rounded-full border px-4 py-2.5 text-left transition-colors duration-200 ${
              i === active
                ? "border-acc/60 bg-acc/10 text-fog-hi"
                : "border-line text-fog-mid hover:border-fog-mid/40 hover:text-fog-hi"
            }`}
          >
            <span
              className={`mr-2.5 font-mono text-[10px] tracking-[0.14em] ${
                i === active ? "text-acc" : "text-fog-low"
              }`}
            >
              {c.num}
            </span>
            <span className="text-[13.5px]">{c.short}</span>
          </button>
        ))}
      </div>

      {/* panel */}
      <div
        key={study.slug}
        role="tabpanel"
        id={`dd-panel-${study.slug}`}
        aria-labelledby={`dd-tab-${study.slug}`}
        className="dd-fade mt-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-line pb-6">
          <div className="max-w-2xl">
            <p className="micro">
              <span className="text-acc">{study.num}</span>
              <span className="mx-2 text-fog-low/70">/ 03</span>
              {project.domain}
            </p>
            <h3 className="mt-4 text-balance text-2xl font-light leading-[1.1] tracking-[-0.02em] text-fog-hi md:text-[2rem]">
              {study.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fog-mid md:text-[15px]">
              {study.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <div>
              <p className="text-3xl font-extralight tracking-tight text-fog-hi tabular-nums md:text-4xl">
                {metric.value}
              </p>
              <p className="mt-1 max-w-[220px] text-[11px] leading-snug text-fog-low">
                {metric.label}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Link href={`/projects/${study.slug}/`} className="btn-ghost" data-magnetic>
                Explore full case study
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href={study.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet text-[13px] text-fog-mid"
              >
                GitHub
                <span aria-hidden="true" className="text-[11px]">↗</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Explainer />
        </div>
      </div>
    </div>
  );
}
