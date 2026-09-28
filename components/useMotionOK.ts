"use client";

import { useEffect, useState } from "react";

/** True when looping animation is welcome (respects prefers-reduced-motion). */
export function useMotionOK(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOk(!mq.matches);
    const on = () => setOk(!mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return ok;
}
