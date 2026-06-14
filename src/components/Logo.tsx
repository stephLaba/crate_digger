import { useEffect, useRef } from "react";

// The "Crate Digger" peeking-mascot — eyes follow the cursor.
export function Logo({ width = 172 }: { width?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const svg = ref.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      svg.querySelectorAll<SVGCircleElement>(".pupil").forEach((p) => {
        const cx = +p.dataset.cx!, cy = +p.dataset.cy!;
        const ex = r.left + (cx / 260) * r.width, ey = r.top + (cy / 162) * r.height;
        const a = Math.atan2(e.clientY - ey, e.clientX - ex), d = 6;
        p.setAttribute("cx", String(cx + Math.cos(a) * d));
        p.setAttribute("cy", String(cy + Math.sin(a) * d));
      });
    };
    addEventListener("mousemove", onMove);
    return () => removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 260 162" width={width} height={(width * 162) / 260} fill="none" style={{ color: "#c8cbc1" }}>
      <path d="M8 104 H252" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M38 104 q5 -14 9 0 q5 -14 9 0 q5 -14 9 0" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M195 104 q5 -14 9 0 q5 -14 9 0 q5 -14 9 0" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 104 C75 46 97 24 130 24 C163 24 187 47 184 104" stroke="currentColor" strokeWidth="4.5" fill="#0d0d0c" />
      <path d="M117 86 C110 118 117 156 130 156 C143 156 150 118 143 86" stroke="currentColor" strokeWidth="4.5" fill="#0d0d0c" />
      <path d="M66 54 C80 16 180 16 194 54" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <rect x="55" y="54" width="17" height="30" rx="8" fill="currentColor" />
      <rect x="188" y="54" width="17" height="30" rx="8" fill="currentColor" />
      <path d="M168 30 l11 -17 l6 10" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="109" cy="74" rx="13.5" ry="16.5" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="153" cy="74" rx="13.5" ry="16.5" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <circle className="pupil" data-cx="109" data-cy="76" cx="109" cy="76" r="5.6" fill="#141414" />
      <circle className="pupil" data-cx="153" data-cy="76" cx="153" cy="76" r="5.6" fill="#141414" />
    </svg>
  );
}
