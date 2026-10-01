"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/data";
import { AireViz, AgentViz, MambaViz } from "@/components/projectViz";

const VIZ = { mamba: MambaViz, aire: AireViz, agent: AgentViz } as const;

export default function ProjectScene({
  project,
  alt,
}: {
  project: Project;
  alt: boolean;
}) {
  const [detail, setDetail] = useState(false);
  const Viz = VIZ[project.visual];

  return (
    <article
      id={`project-${project.num}`}
      className="grid items-center gap-12 scroll-mt-24 border-t border-line py-20 first:border-t-0 md:py-24 lg:grid-cols-12 lg:gap-16"
    >
      <div className={`lg:col-span-5 ${alt ? "lg:order-2" : ""}`}>
        <p className="micro" data-reveal>
          <span className="text-acc">{project.num}</span>
          <span className="mx-2 text-fog-low/70">/ 03</span>
          {project.domain}
        </p>
        <h3
          className="mt-7 text-3xl font-light leading-[1.08] tracking-[-0.02em] text-fog-hi md:text-[2.5rem]"
          data-reveal
          style={{ "--rd": "80ms" } as React.CSSProperties}
        >
          {project.name}
        </h3>
        <p
          className="mt-6 text-[15px] leading-relaxed text-fog-mid md:text-base"
          data-reveal
          style={{ "--rd": "140ms" } as React.CSSProperties}
        >
          {project.tagline}
        </p>

        <ul className="mt-8 space-y-4" data-reveal style={{ "--rd": "200ms" } as React.CSSProperties}>
          {project.points.map((pt, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-acc/70" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-fog-mid">{pt}</p>
            </li>
          ))}
        </ul>

        <dl
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-7 sm:grid-cols-4"
          data-reveal
          style={{ "--rd": "260ms" } as React.CSSProperties}
        >
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dd className="text-xl font-light tracking-tight text-fog-hi tabular-nums md:text-2xl">
                {m.value}
              </dd>
              <dt className="mt-1.5 text-[11px] leading-snug text-fog-mid/75">
                {m.label}
              </dt>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-[13px] leading-relaxed text-fog-mid" data-reveal>
          {project.stack.join(" · ")}
        </p>

        <div
          className="mt-8 flex flex-wrap items-center gap-6"
          data-reveal
          style={{ "--rd": "320ms" } as React.CSSProperties}
        >
          <Link href={`/projects/${project.id}/`} className="link-quiet">
            Read the case study
            <span aria-hidden="true" className="text-[11px]">→</span>
          </Link>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            Live demo
            <span aria-hidden="true" className="text-[11px]">
              ↗
            </span>
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            Repository
            <span aria-hidden="true" className="text-[11px]">
              ↗
            </span>
          </a>
          <a
            href={project.report}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            Technical report
            <span aria-hidden="true" className="text-[11px]">
              ↗
            </span>
          </a>
          <button
            type="button"
            data-magnetictype="button"
            onClick={() => setDetail((v) => !v)}
            aria-expanded={detail}
            aria-controls={`viz-${project.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-fog-mid transition-colors duration-200 hover:border-acc/50 hover:text-fog-hi"
          >
            {detail ? "Hide structure" : "Show structure"}
            <span aria-hidden="true" className="text-[10px]">
              {detail ? "−" : "+"}
            </span>
          </button>
        </div>
      </div>

      <div
        id={`viz-${project.id}`}
        className={`scene-viz lg:col-span-7 ${alt ? "lg:order-1" : ""}`}
        data-reveal
      >
        <div className="rounded-2xl border border-line bg-ink-900/40 p-4 md:p-7">
          <Viz detail={detail} />
        </div>
      </div>
    </article>
  );
}
