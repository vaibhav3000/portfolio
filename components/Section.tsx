import type { CSSProperties, ReactNode } from "react";

/**
 * Shared section chrome: micro-label + short tick, display title, optional
 * lede. String titles get a word-rise reveal (masked spans); JSX titles keep
 * the block reveal. `tight` compresses vertical rhythm for compact sections.
 */
export default function Section({
  id,
  index,
  label,
  title,
  lede,
  children,
  className = "",
  tight = false,
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section id={id} className={`relative scroll-mt-20 ${className}`}>
      <div className={`container-x ${tight ? "py-18 md:py-24" : "py-24 md:py-32"}`}>
        <div>
          <div data-reveal className="flex items-center gap-5">
            <p className="micro shrink-0">
              <span className="text-acc">{index}</span>
              <span className="mx-2 text-fog-low/70">/</span>
              {label}
            </p>
            <span className="h-px w-16 bg-line md:w-24" aria-hidden="true" />
          </div>
          {typeof title === "string" ? (
            <h2
              data-reveal
              className="reveal-mask mt-10 max-w-3xl text-balance text-4xl font-medium tracking-[-0.03em] text-fog-hi md:text-[3rem] md:leading-[1.08]"
            >
              {title.split(" ").map((w, i, arr) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]"
                >
                  <span
                    className="word-in"
                    style={{ "--rd": `${i * 45}ms` } as CSSProperties}
                  >
                    {w}
                  </span>
                  {i < arr.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h2>
          ) : (
            <h2
              data-reveal
              className="mt-10 max-w-3xl text-balance text-4xl font-medium tracking-[-0.03em] text-fog-hi md:text-[3.4rem] md:leading-[1.05]"
            >
              {title}
            </h2>
          )}
          {lede && (
            <p
              data-reveal
              style={{ "--rd": "200ms" } as CSSProperties}
              className="mt-6 max-w-2xl text-base leading-relaxed text-fog-mid md:text-lg"
            >
              {lede}
            </p>
          )}
        </div>
        <div className="mt-16 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
