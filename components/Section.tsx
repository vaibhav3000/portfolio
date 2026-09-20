import type { ReactNode } from "react";

export default function Section({
  id,
  index,
  cmd,
  title,
  note,
  children,
  className = "",
}: {
  id: string;
  index: string;
  cmd: string;
  title: ReactNode;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative scroll-mt-16 ${className}`}>
      <div className="container-x py-24 md:py-32">
        <div data-reveal>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
            <p className="font-mono text-sm text-fog-mid">
              <span className="text-acc-green">$</span> {cmd}
            </p>
            <p className="font-mono text-xs text-fog-low">/{index}</p>
          </div>
          <h2 className="mt-10 font-display text-4xl font-semibold tracking-tight text-fog-hi md:text-5xl">
            {title}
          </h2>
          {note && <p className="mt-4 max-w-2xl leading-relaxed text-fog-mid">{note}</p>}
        </div>
        <div className="mt-14 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
