import { useEffect, useRef } from "react";

// Line equalizer driven by the engine's live audio level + beat pulse.
// Bars rest near-flat when nothing's playing and dance when audio is loud.
export function Visualizer({ engineRef, n = 18 }: { engineRef: { current: any }; n?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const bars = Array.from(el.children) as HTMLElement[];
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const eng = engineRef.current;
      const lvl = eng ? eng.audioLevel || 0 : 0;
      const pulse = eng ? eng.pulse || 0 : 0;
      const amp = Math.min(1, lvl * 1.7 + pulse * 0.4);
      for (let i = 0; i < bars.length; i++) {
        const osc = 0.35 + 0.65 * Math.abs(Math.sin(t * (3 + (i % 5) * 0.7) + i * 1.3));
        const h = 0.1 + amp * osc;
        bars[i].style.transform = `scaleY(${Math.max(0.08, Math.min(1, h)).toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engineRef]);

  return (
    <div ref={wrap} className="flex h-5 items-center justify-center gap-[3px]">
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="block h-full w-[2px] origin-center rounded-full"
          style={{ background: "hsl(var(--accent))", transform: "scaleY(0.1)" }}
        />
      ))}
    </div>
  );
}
