"use client";

import { useEffect, useRef } from "react";

function CountUp({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // SSR text (final value) stays

    let raf = 0;
    let started = false;
    const fmt = (v: number) => v.toFixed(decimals) + suffix;

    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries[0].isIntersecting) return;
        started = true;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(value * e);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        el.textContent = fmt(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, suffix]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const METRICS = [
  {
    value: 10.7,
    decimals: 1,
    suffix: "×",
    label: "lower latency",
    sub: "WiMamba vs Transformer: 30ms vs 327ms",
  },
  {
    value: 42.6,
    decimals: 1,
    suffix: "×",
    label: "less GPU memory",
    sub: "113MB vs 4.8GB @ 4×4 patch size",
  },
  {
    value: 0.9626,
    decimals: 4,
    suffix: "",
    label: "OOD composite score",
    sub: "Florida → San Diego · +16.6% over baseline",
  },
  {
    value: 98.5,
    decimals: 1,
    suffix: "%",
    label: "performance retained",
    sub: "with 75% of parameters frozen (PEFT)",
  },
];

export default function Metrics() {
  return (
    <section aria-label="Key engineering benchmarks" className="relative">
      <div className="border-y border-line bg-ink-900/40">
        <div className="container-x">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                data-reveal
                style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}
                className={`px-5 py-10 sm:px-8 ${
                  i > 0 ? "border-l border-line" : ""
                } ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${
                  i === 2 ? "border-l-0 lg:border-l" : ""
                }`}
              >
                <dd className="font-mono text-3xl text-fog-hi sm:text-4xl">
                  <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
                </dd>
                <dt className="mt-3 text-sm text-fog-mid">{m.label}</dt>
                <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-fog-low">
                  {m.sub}
                </p>
              </div>
            ))}
          </dl>
          <p
            data-reveal
            className="border-t border-line px-5 py-3 font-mono text-[11px] text-fog-low sm:px-8"
          >
            <span className="text-fog-low/70">//</span> benchmarks from the Ericsson
            research internship · full context in{" "}
            <a href="#experience" className="text-acc-green/80 underline-offset-4 hover:underline">
              experience/01
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
