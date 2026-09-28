import type { ReactNode } from "react";

/**
 * Shared section chrome: micro-label + hairline, display title, optional lede.
 * No prompts, no terminal voice; the label reads like an exhibition caption.
 */
export default function Section({
  id,
  index,
  label,
  title,
  lede,
  children,
  className = "",
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-20 ${className}`}>
      <div className="container-x py-28 md:py-40">
        <div data-reveal>
          <div className="flex items-center gap-5">
            <p className="micro shrink-0">
              <span className="text-acc">{index}</span>
              <span className="mx-2 text-fog-low/70">/</span>
              {label}
            </p>
            <span className="h-px w-16 bg-line md:w-24" aria-hidden="true" />
          </div>
          <h2 className="mt-10 max-w-3xl text-balance text-4xl font-medium tracking-[-0.03em] text-fog-hi md:text-[3.4rem] md:leading-[1.05]">
            {title}
          </h2>
          {lede && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fog-mid md:text-lg">
              {lede}
            </p>
          )}
        </div>
        <div className="mt-16 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
