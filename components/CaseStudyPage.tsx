import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/caseStudies";
import { CASE_STUDIES } from "@/lib/caseStudies";
import LabAgent from "@/components/lab/LabAgent";
import LabAire from "@/components/lab/LabAire";
import LabMamba from "@/components/lab/LabMamba";

/* Shared case-study page. Server component; content comes from
   lib/caseStudies.ts so pages stay editable without touching the UI. */

const BP = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const LABS: Record<string, () => JSX.Element> = {
  "s4-to-mamba": LabMamba,
  aire: LabAire,
  "repo-engineer": LabAgent,
};

export function CaseLab({ slug }: { slug: string }) {
  const Lab = LABS[slug];
  return Lab ? <Lab /> : null;
}

function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <div data-reveal className="flex items-center gap-5">
      <p className="micro shrink-0">
        <span className="text-acc">{index}</span>
        <span className="mx-2 text-fog-low/70">/</span>
        {label}
      </p>
      <span className="h-px w-16 bg-line md:w-24" aria-hidden="true" />
    </div>
  );
}

function Section({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 md:mt-20">
      <SectionHead index={index} label={label} />
      <h2
        data-reveal
        className="mt-6 text-2xl font-medium tracking-[-0.02em] text-fog-hi md:text-3xl"
      >
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-reveal
      className="space-y-5 text-[15px] leading-relaxed text-fog-mid md:text-base"
    >
      {children}
    </div>
  );
}

function Figure({ src, caption, priority }: { src: string; caption: string; priority?: boolean }) {
  return (
    <figure data-reveal className="mt-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <Image
          src={BP + src}
          alt={caption}
          width={1100}
          height={620}
          priority={priority}
          sizes="(max-width: 767px) 100vw, 780px"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-fog-low">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const idx = CASE_STUDIES.findIndex((c) => c.slug === study.slug);
  const prev = CASE_STUDIES[(idx + CASE_STUDIES.length - 1) % CASE_STUDIES.length];
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];
  const Lab = LABS[study.slug];

  return (
    <main className="relative">
      {/* page header */}
      <header className="container-x pt-32 md:pt-40">
        <div data-reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={BP + "/#projects"}
              className="link-quiet text-[13px] text-fog-mid"
            >
              <span aria-hidden="true">←</span> All projects
            </Link>
            <nav aria-label="Projects" className="flex items-center gap-1.5">
              {CASE_STUDIES.map((c) =>
                c.slug === study.slug ? (
                  <span
                    key={c.slug}
                    aria-current="page"
                    className="inline-flex items-baseline gap-2 rounded-full border border-acc/50 bg-acc/10 px-3.5 py-1.5 text-xs text-fog-hi"
                  >
                    <span className="font-mono text-[10px] text-acc">{c.num}</span>
                    {c.short}
                  </span>
                ) : (
                  <Link
                    key={c.slug}
                    href={`/projects/${c.slug}/`}
                    className="inline-flex items-baseline gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-fog-mid transition-colors duration-200 hover:border-fog-mid/40 hover:text-fog-hi"
                  >
                    <span className="font-mono text-[10px] text-fog-low">{c.num}</span>
                    {c.short}
                  </Link>
                )
              )}
            </nav>
          </div>
          <p className="micro mt-10">
            <span className="text-acc">{study.num}</span>
            <span className="mx-2 text-fog-low/70">/ 03</span>
            Case study
          </p>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-light leading-[1.05] tracking-[-0.03em] text-fog-hi md:text-[3.4rem]">
            {study.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog-mid md:text-lg">
            {study.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2.5 text-[13px] text-fog-mid">
            <span>{study.period}</span>
            <span>{study.role}</span>
            <a
              href={study.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              GitHub repository
              <span aria-hidden="true" className="text-[11px]">↗</span>
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <li key={s} className="chip">{s}</li>
            ))}
          </ul>
        </div>
        <span className="mt-14 block h-px w-full bg-line" aria-hidden="true" />
      </header>

      {/* interactive lab: the matching explainer on every case page */}
      <div className="container-x pb-4">
        <div className="mx-auto max-w-[820px]">
          <section aria-label="Interactive lab">
            <div data-reveal className="flex items-center gap-5">
              <p className="micro shrink-0">
                <span className="text-acc">Lab</span>
                <span className="mx-2 text-fog-low/70">/</span>
                See it run
              </p>
              <span className="h-px w-16 bg-line md:w-24" aria-hidden="true" />
            </div>
            <div data-reveal className="mt-6">
              {Lab ? <Lab /> : null}
            </div>
          </section>
        </div>
      </div>

      <div className="container-x pb-28 md:pb-36">
        <div className="mx-auto max-w-[820px]">
          <Section index="01" label="Overview" title="What this is.">
            <Prose>
              {study.overview.map((p, i) => <p key={i}>{p}</p>)}
            </Prose>
          </Section>

          <Section index="02" label="Problem" title="What motivated it.">
            <Prose>
              {study.problem.map((p, i) => <p key={i}>{p}</p>)}
            </Prose>
          </Section>

          <Section index="03" label="System" title="How it is built.">
            <dl className="space-y-5">
              {study.architecture.map((a) => (
                <div
                  key={a.name}
                  data-reveal
                  className="grid gap-1.5 border-l border-line pl-5 md:grid-cols-[220px_1fr] md:gap-6"
                >
                  <dt className="font-mono text-[12.5px] leading-relaxed text-fog-hi">
                    {a.name}
                  </dt>
                  <dd className="text-sm leading-relaxed text-fog-mid">{a.what}</dd>
                </div>
              ))}
            </dl>
            {study.archFigure && (
              <Figure src={study.archFigure.src} caption={study.archFigure.caption} />
            )}
          </Section>

          <Section index="04" label="Approach" title="The mechanisms that matter.">
            <ul className="space-y-7">
              {study.approach.map((a) => (
                <li key={a.title} data-reveal className="grid gap-2 md:grid-cols-[260px_1fr] md:gap-8">
                  <h3 className="text-[15px] font-medium text-fog-hi">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-fog-mid">{a.body}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section index="05" label="Evaluation" title="Setup and workloads.">
            <Prose>
              <ul className="space-y-3">
                {study.evaluation.map((e, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-acc/70" aria-hidden="true" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </Prose>
          </Section>

          <Section index="06" label="Results" title="Measured outcomes.">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
              {study.metrics.map((m) => (
                <div key={m.label} data-reveal>
                  <dd className="text-2xl font-light tracking-tight text-fog-hi tabular-nums md:text-3xl">
                    {m.value}
                  </dd>
                  <dt className="mt-1.5 text-[11px] leading-snug text-fog-low">{m.label}</dt>
                </div>
              ))}
            </dl>

            {study.figures.map((f, i) => (
              <Figure key={f.src} src={f.src} caption={f.caption} priority={i === 0} />
            ))}

            {study.results.rows.length > 0 && (
              <div data-reveal className="mt-10 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      {study.results.columns.map((c) => (
                        <th key={c} scope="col" className="micro py-3 pr-6 font-normal">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {study.results.rows.map((r) => (
                      <tr key={r.label} className="border-b border-line">
                        <th scope="row" className="py-3.5 pr-6 text-[13.5px] font-normal text-fog-hi">
                          {r.label}
                        </th>
                        {r.values.map((v, i) => (
                          <td key={i} className="py-3.5 pr-6 text-[13.5px] text-fog-mid tabular-nums">
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {study.results.note && (
                  <p className="mt-4 text-xs leading-relaxed text-fog-low">{study.results.note}</p>
                )}
              </div>
            )}
          </Section>

          <Section index="07" label="Findings" title="What the results say.">
            <ol className="space-y-5">
              {study.findings.map((f, i) => (
                <li key={i} data-reveal className="flex gap-5">
                  <span className="micro shrink-0 pt-1 text-acc">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-fog-mid">{f}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section index="08" label="Decisions" title="Why it was built this way.">
            <ul className="space-y-7">
              {study.decisions.map((d) => (
                <li key={d.title} data-reveal className="grid gap-2 md:grid-cols-[260px_1fr] md:gap-8">
                  <h3 className="text-[15px] font-medium text-fog-hi">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-fog-mid">{d.body}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section index="09" label="Validation" title="How the claims are checked.">
            <Prose>
              <ul className="space-y-3">
                {study.validation.map((v, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-acc/70" aria-hidden="true" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </Prose>
          </Section>

          <Section index="10" label="Limitations" title="Stated plainly.">
            <Prose>
              <ul className="space-y-3">
                {study.limitations.map((l, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fog-low/60" aria-hidden="true" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </Prose>
          </Section>

          {/* Interview TL;DR */}
          <section className="mt-16 md:mt-20">
            <SectionHead index="11" label="Interview TL;DR" />
            <div
              data-reveal
              className="mt-6 rounded-2xl border border-line bg-ink-900/40 p-6 md:p-9"
            >
              <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                {[
                  ["Built", study.interview.built],
                  ["Why", study.interview.why],
                  ["How it works", study.interview.how],
                  ["Key decision", study.interview.decision],
                  ["Strongest result", study.interview.strongest],
                  ["Main limitation", study.interview.limitation],
                  ["Next", study.interview.next],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="micro">{k}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-fog-mid">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 border-t border-line pt-7">
                <p className="micro">Likely questions</p>
                <ol className="mt-5 space-y-6">
                  {study.interview.questions.map((qa, i) => (
                    <li key={i}>
                      <p className="text-[14.5px] font-medium leading-relaxed text-fog-hi">
                        <span className="mr-2.5 font-mono text-xs text-acc">
                          Q{String(i + 1).padStart(2, "0")}
                        </span>
                        {qa.q}
                      </p>
                      <p className="mt-2 pl-8 text-sm leading-relaxed text-fog-mid">{qa.a}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* prev / next */}
          <nav
            aria-label="More projects"
            className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2"
          >
            {[
              { p: prev, dir: "Previous", arrow: "←" },
              { p: next, dir: "Next", arrow: "→" },
            ].map(({ p, dir, arrow }) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}/`}
                className={`group flex flex-col gap-2 bg-ink-950 p-6 transition-colors duration-200 hover:bg-ink-900 md:p-8 ${
                  dir === "Next" ? "md:items-end md:text-right" : ""
                }`}
              >
                <span className="micro">
                  {arrow} {dir} project
                </span>
                <span className="text-lg font-light text-fog-hi transition-colors group-hover:text-acc md:text-xl">
                  {p.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
