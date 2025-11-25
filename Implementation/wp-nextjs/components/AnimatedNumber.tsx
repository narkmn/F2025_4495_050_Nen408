"use client";

import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  target: number;
  duration?: number; // total animation time in ms
};

export default function AnimatedNumber({
  target,
  duration = 1200,
}: AnimatedNumberProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frameId: number;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1); // 0 → 1
      const current = Math.round(progress * target);

      setValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return <>{value}</>;
}
