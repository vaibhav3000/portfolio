import { SITE } from "@/lib/data";

const CHANNELS = [
  {
    label: "email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    external: false,
  },
  {
    label: "linkedin",
    value: "in/vaibhav-mahore",
    href: SITE.links.linkedin,
    external: true,
  },
  {
    label: "github",
    value: "vaibhav3000",
    href: SITE.links.github,
    external: true,
  },
  {
    label: "resume",
    value: "resume.pdf",
    href: SITE.links.resume,
    external: true,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden">
      {/* closing glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-acc-green/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-x py-28 md:py-36">
        <p data-reveal className="text-center font-mono text-sm text-fog-mid">
          <span className="text-acc-green">$</span> ping vaibhav --lets-build
        </p>

        <h2
          data-reveal
          style={{ "--rd": "80ms" } as React.CSSProperties}
          className="mx-auto mt-8 max-w-3xl text-center font-display text-5xl font-semibold tracking-tight text-fog-hi md:text-7xl"
        >
          Let&apos;s build something{" "}
          <span className="text-grad">useful.</span>
        </h2>

        <p
          data-reveal
          style={{ "--rd": "160ms" } as React.CSSProperties}
          className="mx-auto mt-6 max-w-xl text-center leading-relaxed text-fog-mid"
        >
          Email, LinkedIn, or GitHub: pick a channel. Responsive to interesting
          problems.
        </p>

        <div
          data-reveal
          style={{ "--rd": "240ms" } as React.CSSProperties}
          className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4"
        >
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group bg-ink-900/80 px-5 py-7 transition-colors hover:bg-ink-800"
            >
              <p className="font-mono text-[11px] text-acc-green">
                {c.label}
                <span className="ml-2 inline-block text-fog-low transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acc-green">
                  ↗
                </span>
              </p>
              <p className="mt-2.5 break-all text-sm text-fog-mid transition-colors group-hover:text-fog-hi">
                {c.value}
              </p>
            </a>
          ))}
        </div>

        <p
          data-reveal
          style={{ "--rd": "320ms" } as React.CSSProperties}
          className="mt-6 text-center font-mono text-xs text-fog-low"
        >
          <a href={SITE.phoneHref} className="transition-colors hover:text-fog-mid">
            {SITE.phone}
          </a>
          <span className="mx-3 text-fog-low/50">·</span>
          {SITE.location}
        </p>

        {/* footer */}
        <footer className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 font-mono text-[11px] text-fog-low sm:flex-row">
          <p>© 2026 {SITE.name} · designed &amp; built from scratch</p>
          <p>
            <span className="text-acc-green">$</span> exit{" "}
            <span className="text-fog-mid">0</span>
          </p>
          <p>
            press <span className="text-fog-mid">1–6</span> to jump · bangalore, IN
          </p>
        </footer>
      </div>
    </section>
  );
}
