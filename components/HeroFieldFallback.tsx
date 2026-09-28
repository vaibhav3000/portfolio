/**
 * Deterministic static "latent field" rendered as dotted flow lines.
 * This is the always-present hero layer: it is what users without WebGL,
 * with reduced motion, or before hydration see, so it must stand on its own.
 */

// mulberry32: tiny deterministic PRNG so SSR and client agree
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildRows() {
  const rand = rng(20260921);
  const rows: { d: string; accent: boolean; opacity: number }[] = [];
  const ROWS = 26;
  for (let r = 0; r < ROWS; r++) {
    const baseY = 290 + r * 27;
    const amp = 7 + r * 1.15;
    const f1 = 0.0038 + rand() * 0.0016;
    const f2 = 0.009 + rand() * 0.005;
    const p1 = rand() * Math.PI * 2;
    const p2 = rand() * Math.PI * 2;
    let d = "";
    for (let x = -30; x <= 1630; x += 20) {
      const y =
        baseY +
        Math.sin(x * f1 + p1) * amp +
        Math.sin(x * f2 + p2) * amp * 0.45 +
        Math.pow((x - 800) / 800, 2) * -14;
      d += `${x === -30 ? "M" : "L"}${x} ${y.toFixed(1)} `;
    }
    const accent = r % 6 === 2;
    rows.push({
      d,
      accent,
      opacity: accent ? 0.5 : 0.18 + (r / ROWS) * 0.14,
    });
  }
  return rows;
}

function buildTrajectories() {
  const rand = rng(742);
  return [0, 1, 2].map((i) => {
    const y0 = 420 + i * 180 + rand() * 60;
    const y1 = 260 + i * 200 + rand() * 80;
    return `M -60 ${y0} C ${300 + rand() * 200} ${y0 - 140 - rand() * 80}, ${
      700 + rand() * 300
    } ${y1 + 140 + rand() * 60}, 1660 ${y1}`;
  });
}

function buildNodes() {
  const rand = rng(5124);
  return Array.from({ length: 30 }, () => ({
    cx: 700 + rand() * 940,
    cy: 120 + rand() * 780,
    r: 1 + rand() * 1.8,
    o: 0.2 + rand() * 0.3,
  }));
}

function buildPulses() {
  const rand = rng(991);
  return Array.from({ length: 9 }, () => ({
    cx: 120 + rand() * 1400,
    cy: 300 + rand() * 640,
    r: 1.6 + rand() * 1.4,
    o: 0.5 + rand() * 0.4,
  }));
}

const ROWS = buildRows();
const TRAJECTORIES = buildTrajectories();
const NODES = buildNodes();
const PULSES = buildPulses();

export default function HeroFieldFallback() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="fieldGlowA" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8BCA0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#BFD0E6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fieldGlowB" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D8CDB4" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8A94B8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="1120" cy="420" rx="620" ry="420" fill="url(#fieldGlowA)" />
      <ellipse cx="380" cy="820" rx="520" ry="360" fill="url(#fieldGlowB)" />

      {ROWS.map((row, i) => (
        <path
          key={i}
          d={row.d}
          fill="none"
          className={row.accent ? "s-acc" : "s-dot-base"}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeDasharray="0.25 5.4"
          opacity={row.opacity}
        />
      ))}
      {TRAJECTORIES.map((d, i) => (
        <path
          key={`t${i}`}
          d={d}
          fill="none"
          className="s-acc"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="2 6"
          opacity={0.45}
        />
      ))}
      {NODES.map((n, i) => (
        <circle key={`n${i}`} cx={n.cx} cy={n.cy} r={n.r} className="f-low" opacity={n.o} />
      ))}
      {PULSES.map((p, i) => (
        <circle key={`p${i}`} cx={p.cx} cy={p.cy} r={p.r} className="f-acc" opacity={p.o} />
      ))}
    </svg>
  );
}
