"use client";

import { useState } from "react";
import Section from "@/components/Section";
import { EXPERIENCE } from "@/lib/data";

export default function Experience() {
  const [openId, setOpenId] = useState<string | null>("ericsson");

  return (
    <Section
      id="experience"
      index="02"
      cmd="cat experience.log --timeline"
      title="Where I've built."
      note="Research and engineering roles, from benchmarking state-space models on cloud GPUs to training data for frontier LLMs."
    >
      <div>
        {EXPERIENCE.map((item, i) => {
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              data-reveal
              style={{ "--rd": `${i * 80}ms` } as React.CSSProperties}
              className="border-b border-line first:border-t"
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`exp-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-x-4 py-7 text-left sm:gap-x-8"
              >
                <span className="font-mono text-xs text-acc-green">
                  [{item.index}]
                </span>
                <span>
                  <span className="block font-display text-xl font-medium tracking-tight text-fog-hi transition-colors group-hover:text-acc-cyan sm:text-2xl">
                    {item.role}
                  </span>
                  <span className="mt-1.5 block font-mono text-xs text-fog-mid">
                    {item.company} · {item.location}
                  </span>
                </span>
                <span className="flex items-center gap-5">
                  <span className="hidden font-mono text-xs text-fog-low md:block">
                    {item.period}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`font-mono text-lg text-fog-low transition-transform duration-300 ${
                      open ? "rotate-45 text-acc-green" : ""
                    }`}
                  >
                    +
                  </span>
                </span>
              </button>

              <div
                id={`exp-${item.id}`}
                role="region"
                aria-label={`${item.role} details`}
                className="grid transition-[grid-template-rows] duration-500 ease-out"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="pb-8 pl-0 sm:pl-12">
                    <div className="mb-5 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-3">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex gap-3 leading-relaxed text-fog-mid">
                          <span className="mt-[3px] font-mono text-xs text-acc-green">
                            ▸
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 font-mono text-[11px] text-fog-low md:hidden">
                      {item.period}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
