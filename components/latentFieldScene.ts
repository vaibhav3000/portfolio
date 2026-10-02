import * as THREE from "three";

/**
 * The hero "latent field": one GPU-displaced point plane standing in for a
 * state-space manifold, plus signal pulses riding spline trajectories.
 * CPU work per frame is a handful of uniform updates; all motion lives in
 * the vertex shader. The scene pauses when off-screen or when the tab hides.
 */

// Theme palettes: particles read as ink on ivory (light) or warm white on
// coffee-black (dark). The observer below keeps them in sync with the toggle.
const THEMES = {
  light: {
    acc: "#26241d",
    base: "#8a8578",
    hot: new THREE.Color(0.05, 0.05, 0.04),
    ok: "#26241d",
    warn: "#26241d",
  },
  dark: {
    acc: "#e9c882",
    base: "#857b66",
    hot: new THREE.Color(1.0, 0.98, 0.92),
    ok: "#8fd6b5",
    warn: "#eb9178",
  },
} as const;

function currentTheme() {
  return document.documentElement.classList.contains("dark")
    ? THEMES.dark
    : THEMES.light;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POINT_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  attribute float aRand;
  varying float vGlow;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime;

    float w = sin(p.x * 0.50 + t * 0.40) * cos(p.z * 0.42 - t * 0.28) * 0.85
            + sin(p.x * 1.28 - t * 0.52 + p.z * 0.80) * 0.28
            + sin((p.x + p.z) * 0.85 + t * 0.70) * 0.15;
    p.y += w;

    // one slow swell crossing the field
    vec2 sweep = vec2(mod(t * 0.55, 30.0) - 15.0, sin(t * 0.21) * 3.2);
    float d = distance(p.xz, sweep);
    float bump = exp(-d * d * 0.05);
    p.y += bump * 1.6;

    vGlow = clamp(w * 0.45 + 0.5, 0.0, 1.0) * 0.55 + bump * 0.95;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    gl_PointSize = (0.8 + aRand * 1.0 + vGlow * 2.2) * (uScale / dist);
    vFade = smoothstep(30.0, 10.0, dist) * smoothstep(2.0, 4.6, dist);
    gl_Position = projectionMatrix * mv;
  }
`;

const POINT_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uAcc;
  uniform vec3 uBase;
  uniform vec3 uHot;
  varying float vGlow;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.06, r);
    vec3 col = mix(uBase, uAcc, clamp(vGlow, 0.0, 1.0));
    col = mix(col, uHot, vGlow * vGlow * 0.30);
    float alpha = disc * (0.30 + 0.42 * vFade + 0.30 * clamp(vGlow - 0.5, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha);
  }
`;

const PULSE_VERT = /* glsl */ `
  uniform float uScale;
  attribute float aTrail;
  varying float vTrail;
  void main() {
    vTrail = aTrail;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = -mv.z;
    gl_PointSize = (1.0 + aTrail * 3.4) * (uScale / dist);
    gl_Position = projectionMatrix * mv;
  }
`;

const PULSE_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uAcc;
  varying float vTrail;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.04, r);
    float a = disc * pow(vTrail, 1.6) * 0.9;
    gl_FragColor = vec4(uAcc, a);
  }
`;

export function mountField(canvas: HTMLCanvasElement): () => void {
  const width = window.innerWidth;
  const mobile = width < 768;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.8);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 80);
  const group = new THREE.Group();
  scene.add(group);

  // ---- Point plane ------------------------------------------------------
  const cols = mobile ? 88 : width > 1400 ? 168 : 132;
  const rows = mobile ? 48 : width > 1400 ? 96 : 74;
  const SPREAD_X = mobile ? 13 : 19.5;
  const SPREAD_Z = 9.5;

  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const seeded = mulberry32(1204);
  let k = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      positions[k * 3] = (i / (cols - 1) - 0.5) * SPREAD_X;
      positions[k * 3 + 1] = 0;
      positions[k * 3 + 2] = (j / (rows - 1) - 0.5) * SPREAD_Z;
      rand[k] = seeded();
      k++;
    }
  }
  const fieldGeo = new THREE.BufferGeometry();
  fieldGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  fieldGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

  const fieldMat = new THREE.ShaderMaterial({
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uAcc: { value: new THREE.Color(currentTheme().acc) },
      uBase: { value: new THREE.Color(currentTheme().base) },
      uHot: { value: currentTheme().hot.clone() },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  const points = new THREE.Points(fieldGeo, fieldMat);
  group.add(points);

  // ---- Trajectories + pulses -------------------------------------------
  const curveRng = mulberry32(7420);
  const PULSES = 6;
  const TRAIL = 22;
  const LOOKUP = 512;
  const curves: THREE.CatmullRomCurve3[] = [];
  const lineMats: THREE.LineBasicMaterial[] = [];
  const lineBaseOpacity: number[] = [];
  const pulseGeos: THREE.BufferGeometry[] = [];
  const pulseMats: THREE.ShaderMaterial[] = [];
  const lookups: THREE.Vector3[][] = [];
  const speeds: number[] = [];
  const phases: number[] = [];

  for (let c = 0; c < PULSES; c++) {
    const pts: THREE.Vector3[] = [];
    const y0 = -0.4 + curveRng() * 2.2;
    for (let s = 0; s < 5; s++) {
      pts.push(
        new THREE.Vector3(
          -9 + (18 * s) / 4 + (curveRng() - 0.5) * 4,
          y0 + (curveRng() - 0.5) * 2.6,
          -4.5 + curveRng() * 9
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    curves.push(curve);
    lookups.push(curve.getSpacedPoints(LOOKUP));

    const lineGeo = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(140)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(currentTheme().acc),
      transparent: true,
      opacity: c % 2 === 0 ? 0.22 : 0.12,
    });
    lineBaseOpacity.push(lineMat.opacity);
    lineMats.push(lineMat);
    group.add(new THREE.Line(lineGeo, lineMat));

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3)
    );
    const trail = new Float32Array(TRAIL);
    for (let i = 0; i < TRAIL; i++) trail[i] = 1 - i / (TRAIL - 1);
    pGeo.setAttribute("aTrail", new THREE.BufferAttribute(trail, 1));
    const pMat = new THREE.ShaderMaterial({
      vertexShader: PULSE_VERT,
      fragmentShader: PULSE_FRAG,
      uniforms: {
        uScale: { value: 1 },
        uAcc: { value: new THREE.Color(currentTheme().acc) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    pulseGeos.push(pGeo);
    pulseMats.push(pMat);
    group.add(new THREE.Points(pGeo, pMat));

    speeds.push(0.010 + curveRng() * 0.018);
    phases.push(curveRng());
  }

  // ---- Layout -----------------------------------------------------------
  group.position.x = mobile ? 0 : 1.2;
  group.position.y = mobile ? 1.4 : 0.2;
  if (mobile) group.scale.setScalar(0.9);

  // ---- Theme sync --------------------------------------------------------
  const applyTheme = () => {
    const t = currentTheme();
    const dark = t === THEMES.dark;
    (fieldMat.uniforms.uAcc.value as THREE.Color).set(t.acc);
    (fieldMat.uniforms.uBase.value as THREE.Color).set(t.base);
    (fieldMat.uniforms.uHot.value as THREE.Color).copy(t.hot);
    const pulseColors = [t.acc, t.acc, (t as any).ok, t.acc, (t as any).warn, t.acc];
    pulseMats.forEach((m, i) => (m.uniforms.uAcc.value as THREE.Color).set(pulseColors[i % pulseColors.length]));
    lineMats.forEach((m, i) => {
      m.color.set(t.acc);
      m.opacity = lineBaseOpacity[i] * (dark ? 1.3 : 1);
    });
  };
  applyTheme();
  const themeMO = new MutationObserver(applyTheme);
  themeMO.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const baseCam = new THREE.Vector3(mobile ? 0 : -0.4, mobile ? 4.6 : 3.1, mobile ? 11.5 : 9.4);
  const lookAt = new THREE.Vector3(mobile ? 0 : 1.3, mobile ? 0.4 : 0.1, 0);
  camera.position.copy(baseCam);

  // ---- Interaction + lifecycle ------------------------------------------
  let mx = 0;
  let my = 0;
  const onPointer = (e: PointerEvent) => {
    if (coarse) return;
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let inView = true;
  let pageVisible = !document.hidden;
  const io = new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0 }
  );
  io.observe(canvas);

  const onVis = () => {
    pageVisible = !document.hidden;
  };
  document.addEventListener("visibilitychange", onVis);

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // world-to-pixel factor so point sizes stay stable across resolutions
    const pxScale = h * dpr / (2 * Math.tan((camera.fov * Math.PI) / 360));
    fieldMat.uniforms.uScale.value = pxScale * 0.009;
    for (const m of pulseMats) m.uniforms.uScale.value = pxScale * 0.011;
  };
  resize();
  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let raf = 0;
  const head = new THREE.Vector3();
  const posArrs = pulseGeos.map((g) => g.getAttribute("position") as THREE.BufferAttribute);

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!inView || !pageVisible) return;
    const t = clock.getElapsedTime();

    fieldMat.uniforms.uTime.value = t;

    for (let c = 0; c < PULSES; c++) {
      const arr = posArrs[c];
      const table = lookups[c];
      const headT = (t * speeds[c] + phases[c]) % 1;
      for (let i = 0; i < TRAIL; i++) {
        let tt = headT - i * 0.0042;
        if (tt < 0) tt = 0;
        const p = table[Math.round(tt * LOOKUP)];
        arr.setXYZ(i, p.x, p.y, p.z);
      }
      arr.needsUpdate = true;
    }

    // scroll-linked pull-back + parallax + slow drift
    const sp = Math.min(
      Math.max(window.scrollY / (window.innerHeight * 0.9), 0),
      1
    );
    group.rotation.x = -sp * 0.14;
    const driftX = Math.sin(t * 0.07) * 0.25;
    camera.position.x += (baseCam.x + mx * 1.1 + driftX - camera.position.x) * 0.045;
    camera.position.y +=
      (baseCam.y - my * 0.7 + sp * 1.7 - camera.position.y) * 0.045;
    camera.position.z += (baseCam.z + sp * 3.8 - camera.position.z) * 0.05;
    camera.lookAt(lookAt);

    renderer.render(scene, camera);
    if (canvas.dataset.ready !== "true") canvas.dataset.ready = "true";
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    themeMO.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", resize);
    fieldGeo.dispose();
    fieldMat.dispose();
    for (const g of pulseGeos) g.dispose();
    for (const m of pulseMats) m.dispose();
    for (const m of lineMats) m.dispose();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Line) obj.geometry.dispose();
    });
    renderer.dispose();
  };
}
