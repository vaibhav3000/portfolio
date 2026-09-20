"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "State-space lattice": the site's one signature visual.
 *
 * A slowly rotating helix of sequence states (a nod to SSMs) drawn on a
 * single 2D canvas: consecutive nodes form the sequence chain, bright
 * pulses travel along it like hidden-state updates, and the whole scene
 * tilts subtly toward the pointer. Zero dependencies, DPR-capped, paused
 * whenever off-screen or the tab is hidden, and rendered as a single
 * static frame under prefers-reduced-motion. An inline SVG helix is the
 * no-JS fallback.
 */
export default function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapEl || !canvasEl) return;
    const wrap: HTMLDivElement = wrapEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctxOrNull = canvas.getContext("2d");
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;
    setActive(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const N = 64;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let t = 14; // start partway through the loop so the first frame is composed
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    // Pre-rendered glow sprites (cheap alternative to shadowBlur)
    function makeGlow(r: number, g: number, b: number) {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g2 = c.getContext("2d")!;
      const grad = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
      grad.addColorStop(0.35, `rgba(${r},${g},${b},0.18)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      g2.fillStyle = grad;
      g2.fillRect(0, 0, 64, 64);
      return c;
    }
    const glowGreen = makeGlow(69, 224, 160);
    const glowCyan = makeGlow(103, 232, 249);

    function resize() {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    }

    /** Project node i at time t → screen coords + depth factor k */
    function project(i: number, time: number) {
      const theta = (i / N) * Math.PI * 4;
      const y0 = (i / (N - 1)) * 2 - 1;
      const rad = 0.74 * (1 + 0.09 * Math.sin(theta * 1.5));
      const x0 = rad * Math.cos(theta);
      const z0 = rad * Math.sin(theta);

      const a = time * 0.1 + mouse.x * 0.4;
      const x1 = x0 * Math.cos(a) + z0 * Math.sin(a);
      const z1 = -x0 * Math.sin(a) + z0 * Math.cos(a);

      const rx = -0.42 + mouse.y * 0.16;
      const y1 = y0 * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = y0 * Math.sin(rx) + z1 * Math.cos(rx);

      const k = 3.4 / (3.4 - z2);
      const R = Math.min(w, h) * 0.38;
      return { x: w / 2 + x1 * k * R, y: h / 2 + y1 * k * R, k };
    }

    function render() {
      ctx.clearRect(0, 0, w, h);
      const pts = [];
      for (let i = 0; i < N; i++) pts.push(project(i, t));

      // faint cross-links (lattice feel)
      ctx.lineWidth = 1;
      for (let i = 0; i < N - 8; i += 6) {
        const a = pts[i];
        const b = pts[i + 8];
        const alpha = 0.05 * Math.min(a.k, b.k);
        ctx.strokeStyle = `rgba(148, 180, 205, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // sequence chain
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const alpha = 0.16 * ((a.k + b.k) / 2 - 0.6) * 1.6;
        ctx.strokeStyle = `rgba(148, 180, 205, ${Math.min(alpha, 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // nodes
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const accent = i % 8 === 4;
        const r = 1 + (p.k - 0.7) * 2.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = accent
          ? `rgba(103, 232, 249, ${Math.min(0.25 + (p.k - 0.7), 0.95).toFixed(3)})`
          : `rgba(196, 212, 226, ${Math.min(0.12 + (p.k - 0.7) * 0.75, 0.8).toFixed(3)})`;
        ctx.fill();
      }

      // pulses travelling along the chain (hidden-state updates)
      const M = 5;
      for (let p = 0; p < M; p++) {
        const speed = 0.05 + p * 0.011;
        const f = (t * speed + p / M) % 1;
        const idx = f * (N - 1);
        const i0 = Math.floor(idx);
        const i1 = Math.min(i0 + 1, N - 1);
        const fr = idx - i0;
        const a = pts[i0];
        const b = pts[i1];
        const x = a.x + (b.x - a.x) * fr;
        const y = a.y + (b.y - a.y) * fr;
        const k = a.k + (b.k - a.k) * fr;
        const size = 22 + (k - 0.7) * 30;
        ctx.drawImage(glowGreen, x - size / 2, y - size / 2, size, size);
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220, 255, 240, 0.95)";
        ctx.fill();
      }

      // one cyan slow orbiter for balance
      const fc = ((t * 0.023) % 1) * (N - 1);
      const i0 = Math.floor(fc);
      const i1 = Math.min(i0 + 1, N - 1);
      const fr = fc - i0;
      const a = pts[i0];
      const b = pts[i1];
      const cxp = a.x + (b.x - a.x) * fr;
      const cyp = a.y + (b.y - a.y) * fr;
      const ck = a.k + (b.k - a.k) * fr;
      const csize = 30 + (ck - 0.7) * 34;
      ctx.drawImage(glowCyan, cxp - csize / 2, cyp - csize / 2, csize, csize);
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      render();
      raf = requestAnimationFrame(loop);
    }
    let last = 0;

    function start() {
      if (running || reduced.matches || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouse.tx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
      mouse.ty = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onReduced = () => {
      if (reduced.matches) {
        stop();
        render();
      } else {
        start();
      }
    };
    reduced.addEventListener?.("change", onReduced);

    resize();
    if (reduced.matches) render();
    else start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      reduced.removeEventListener?.("change", onReduced);
    };
  }, []);

  // Deterministic static helix for the no-JS / pre-hydration fallback
  const fallbackPoints = Array.from({ length: 44 }, (_, i) => {
    const f = i / 43;
    const theta = f * Math.PI * 4;
    const rad = 34 * (1 + 0.09 * Math.sin(theta * 1.5));
    const x = 50 + rad * Math.cos(theta);
    const y = 6 + 88 * f;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[540px]"
      aria-hidden="true"
    >
      {/* decorative orbit rings (CSS depth layer) */}
      <div className="absolute inset-[6%] rounded-full border border-line" />
      <div className="absolute inset-[18%] rounded-full border border-line/70" />
      <div className="absolute inset-[30%] rounded-full border border-line/50" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acc-green/5 blur-3xl" />

      {!active && (
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <polyline
            points={fallbackPoints}
            fill="none"
            stroke="rgba(148,180,205,0.4)"
            strokeWidth="0.4"
          />
        </svg>
      )}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
