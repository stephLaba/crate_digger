import { useEffect, useRef } from "react";

// Custom dot cursor that follows the pointer and grows over interactive elements.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.style.opacity = "1";
      const interactive = (e.target as HTMLElement)?.closest("button, a, input, canvas, .hover-underline");
      el.classList.toggle("cursor-dot--big", !!interactive);
    };
    const leave = () => { el.style.opacity = "0"; };
    addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => { removeEventListener("mousemove", move); document.removeEventListener("mouseleave", leave); };
  }, []);
  return <div ref={ref} className="cursor-dot" />;
}
