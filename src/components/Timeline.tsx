import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tick = { year: number; label: string };

// Notion-style vertical timeline on the right. Active tick is longer + brighter.
export function Timeline({ ticks, activeIndex, onSelect }: { ticks: Tick[]; activeIndex: number; onSelect: (i: number) => void }) {
  return (
    <motion.div
      className="fixed right-7 top-1/2 z-[9] flex -translate-y-1/2 flex-col items-end gap-[9px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {ticks.map((t, i) => {
        const active = i === activeIndex;
        return (
          <button key={i} onClick={() => onSelect(i)} className="group flex items-center justify-end gap-[10px]">
            <span
              className={cn(
                "font-sans text-[11px] tracking-[0.05em] transition-all duration-200",
                active ? "text-foreground opacity-100" : "translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )}
            >
              {t.label}
            </span>
            <span
              className={cn(
                "block h-[2px] rounded-full transition-all duration-200",
                active ? "h-[3px] w-[34px] bg-foreground" : "w-[18px] bg-foreground/25 group-hover:w-7 group-hover:bg-foreground/60"
              )}
            />
          </button>
        );
      })}
    </motion.div>
  );
}
