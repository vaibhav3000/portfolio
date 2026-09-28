import { SITE } from "@/lib/data";

/** Closing scene: the visual resolves to calm; type and links carry it. */
export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="relative overflow-hidden scroll-mt-20"
        aria-label="Contact"
      >
        {/* calm field: one soft glow rising from below, nothing moving */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60rem_34rem_at_50%_115%,rgba(170,155,120,0.12),transparent_65%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />
        </div>

        <div className="container-x relative z-10 flex min-h-[92svh] flex-col justify-center py-32">
          <p className="micro" data-reveal>
            <span className="text-acc">08</span>
            <span className="mx-2 text-fog-low/70">/</span>
            Next
          </p>

          <h2
            className="mt-9 max-w-4xl text-balance text-[clamp(2.6rem,6.5vw,5.5rem)] font-light leading-[1.02] tracking-[-0.03em] text-fog-hi"
            data-reveal
            style={{ "--rd": "100ms" } as React.CSSProperties}
          >
            Let&apos;s build something intelligent.
          </h2>

          <a
            href={`mailto:${SITE.email}`}
            className="link-quiet mt-10 w-fit text-xl text-fog-hi md:text-2xl"
            data-reveal
            style={{ "--rd": "200ms" } as React.CSSProperties}
          >
            {SITE.email}
            <span aria-hidden="true" className="text-base">
              ↗
            </span>
          </a>

          <div
            className="mt-14 flex flex-wrap items-center gap-x-9 gap-y-4 border-t border-line pt-9"
            data-reveal
            style={{ "--rd": "300ms" } as React.CSSProperties}
          >
            <a
              href={SITE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              GitHub
              <span aria-hidden="true" className="text-[11px]">
                ↗
              </span>
            </a>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              LinkedIn
              <span aria-hidden="true" className="text-[11px]">
                ↗
              </span>
            </a>
            <a
              href={SITE.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet"
            >
              Resume
              <span aria-hidden="true" className="text-[11px]">
                ↗
              </span>
            </a>
            <a href={SITE.phoneHref} className="link-quiet">
              {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="container-x flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fog-mid">
            <span className="text-fog-hi">Vaibhav Mahore</span>
            <span className="mx-2.5 text-fog-low/60" aria-hidden="true">
              ·
            </span>
            AI/ML Engineer
            <span className="mx-2.5 text-fog-low/60" aria-hidden="true">
              ·
            </span>
            Bangalore, India
          </p>
          <div className="flex items-center gap-7 text-sm">
            <a
              href={SITE.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fog-low transition-colors hover:text-fog-hi"
            >
              GitHub
            </a>
            <a
              href={SITE.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fog-low transition-colors hover:text-fog-hi"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="text-fog-low transition-colors hover:text-fog-hi"
            >
              Email
            </a>
            <span className="micro">&copy; 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}
