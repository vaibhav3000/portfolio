import Section from "@/components/Section";
import { METRICS } from "@/lib/data";

/** Splits "10.7×" into magnitude + accent-colored unit. */
function BigValue({ value }: { value: string }) {
  const suffix = value.endsWith("×") || value.endsWith("%") ? value.slice(-1) : "";
  const main = suffix ? value.slice(0, -1) : value;
  return (
    <p className="text-[clamp(3.4rem,8vw,7.5rem)] font-extralight leading-[0.95] tracking-[-0.02em] text-fog-hi tabular-nums">
      {main}
      {suffix && <span className="text-fog-mid">{suffix}</span>}
    </p>
  );
}

function VizLatency() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-fog-mid/85">
          <span>Transformer</span>
          <span>327 ms</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700/60">
          <div
            className="m-bar h-full rounded-full bg-fog-low/80"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-fog-mid/85">
          <span className="text-fog-hi">WiMamba</span>
          <span className="text-fog-hi">30 ms</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-700/60">
          <div
            className="m-bar h-full rounded-full bg-black"
            style={{ width: "9.2%", transitionDelay: "0.45s" }}
          />
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog-mid/85">
        O(T) linear scaling · 1K–32K tokens
      </p>
    </div>
  );
}

function VizMemory() {
  const cells = Array.from({ length: 80 });
  return (
    <div>
      <svg viewBox="0 0 520 190" className="w-full" role="img" aria-label="Dense memory footprint versus an expanded one">
        {cells.map((_, i) => {
          const x = 8 + (i % 16) * 13;
          const y = 18 + Math.floor(i / 16) * 13;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="8"
              height="8"
              rx="1.5"
              fill="none"
              stroke="rgba(26,25,19,0.34)"
              strokeWidth="1"
            />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect
            key={`c${i}`}
            x={430 + (i % 3) * 13}
            y={30 + Math.floor(i / 3) * 13}
            width="8"
            height="8"
            rx="1.5"
            fill="#1A1913"
            opacity="0.9"
          />
        ))}
        <text x="430" y="105" className="fill-[#1A1913]" fontSize="11" fontFamily="var(--font-mono)">
          113 MB
        </text>
        <text x="8" y="120" fill="rgba(26,25,19,0.7)" fontSize="11" fontFamily="var(--font-mono)">
          4.8 GB
        </text>
        <line x1="8" y1="140" x2="205" y2="140" stroke="rgba(26,25,19,0.32)" strokeDasharray="1 5" />
        <line x1="430" y1="140" x2="470" y2="140" stroke="rgba(26,25,19,0.5)" strokeDasharray="1 5" />
        <text x="8" y="162" fill="rgba(26,25,19,0.65)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
          EXPANDED STATE
        </text>
        <text x="430" y="162" fill="rgba(26,25,19,0.8)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
          COMPACT
        </text>
      </svg>
    </div>
  );
}

function VizScore() {
  const C = 2 * Math.PI * 78;
  return (
    <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label="Radial gauge at 96.26 percent against a baseline tick">
      <circle cx="180" cy="110" r="78" fill="none" stroke="rgba(26,25,19,0.16)" strokeWidth="6" />
      <circle
        cx="180"
        cy="110"
        r="78"
        fill="none"
        stroke="#1A1913"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray="96.26 100"
        className="m-arc"
        transform="rotate(-90 180 110)"
      />
      {/* baseline tick at 79.66% */}
      <line
        x1="180"
        y1="110"
        x2="253.4"
        y2="54.2"
        stroke="rgba(26,25,19,0.5)"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      <text x="268" y="58" fill="rgba(26,25,19,0.75)" fontSize="10" fontFamily="var(--font-mono)">
        BASELINE
      </text>
      <text x="180" y="106" textAnchor="middle" fill="#1A1913" fontSize="26" fontFamily="var(--font-sans)" fontWeight="300">
        +16.6%
      </text>
      <text x="180" y="128" textAnchor="middle" fill="rgba(26,25,19,0.7)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
        OVER BASELINE
      </text>
      <text x="330" y="80" fill="rgba(26,25,19,0.7)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
        5 TRANSFER TASKS
      </text>
      <text x="330" y="104" fill="rgba(26,25,19,0.7)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
        FLORIDA → SAN DIEGO
      </text>
      <text x="330" y="128" fill="rgba(26,25,19,0.7)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
        NMSE 7.4–7.7 dB LOWER
      </text>
    </svg>
  );
}

function VizParams() {
  const total = 100;
  return (
    <div>
      <svg viewBox="0 0 520 150" className="w-full" role="img" aria-label="Parameter grid: 75 percent frozen, 98.5 percent of performance retained">
        {Array.from({ length: total }).map((_, i) => {
          const x = 8 + (i % 25) * 20.4;
          const y = 20 + Math.floor(i / 25) * 20;
          const tuned = i >= 75;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="12"
              height="12"
              rx="2"
              fill={tuned ? "rgba(26,25,19,0.85)" : "none"}
              stroke={tuned ? "none" : "rgba(26,25,19,0.22)"}
              strokeWidth="1"
            />
          );
        })}
        <line x1="8" y1="110" x2="514" y2="110" stroke="rgba(26,25,19,0.45)" strokeDasharray="3 4" />
        <text x="8" y="132" fill="rgba(26,25,19,0.7)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
          75% FROZEN
        </text>
        <text x="514" y="132" textAnchor="end" fill="rgba(26,25,19,0.7)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="2">
          98.5% RETAINED
        </text>
      </svg>
    </div>
  );
}

const VIZ = [VizLatency, VizMemory, VizScore, VizParams];

export default function Metrics() {
  return (
    <Section
      id="metrics"
      index="02"
      label="Technical proof"
      title="Measured, not claimed."
      lede="Four numbers from real benchmark runs. Each one shaped a decision: which architecture to deploy, and what to trust about it."
    >
      <div>
        {METRICS.map((m, i) => {
          const Viz = VIZ[i];
          return (
            <article
              key={m.label}
              data-reveal
              className="grid items-center gap-10 border-t border-line py-14 last:border-b md:py-16 lg:grid-cols-12"
            >
              <div className="lg:col-span-7">
                <p className="micro">
                  M.{String(i + 1).padStart(2, "0")}
                </p>
                <div className="mt-7">
                  <BigValue value={m.value} />
                </div>
                <p className="mt-4 text-lg text-fog-hi/90">{m.label}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-fog-mid">
                  {m.context}
                </p>
              </div>
              <div className="lg:col-span-5">
                <Viz />
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-8 font-mono text-[11px] leading-relaxed text-fog-low">
        Source: Ericsson India benchmark work, May - Jul 2026 (AWS A10G GPUs) ·
        project benchmarks on a 6 GB RTX 4050
      </p>
    </Section>
  );
}
