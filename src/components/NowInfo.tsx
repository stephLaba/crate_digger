import { AnimatePresence, motion } from "framer-motion";
import { StaggerWords } from "./StaggerWords";

export type RecInfo = {
  idx: number;
  year: number;
  yearLabel: string;
  album: string;
  artist: string;
  era: string;
  note: string;
  cover: string;
  isPlaceholder: boolean;
};

export function NowInfo({ current, show, onOpen }: { current: RecInfo | null; show: boolean; onOpen: () => void }) {
  return (
    <AnimatePresence>
      {show && current && (
        <motion.div
          key="now"
          className="pointer-events-none fixed left-1/2 top-1/2 z-10 w-[80vw] max-w-[620px] text-center"
          initial={{ opacity: 0, x: "-50%", y: "-43%", filter: "blur(10px)" }}
          animate={{ opacity: 1, x: "-50%", y: "-50%", filter: "blur(0px)" }}
          exit={{ opacity: 0, x: "-50%", y: "-50%", filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="text-[13px] uppercase leading-[1.7] tracking-[0.03em] text-foreground">{current.yearLabel}</div>
          <h2 className="mt-3 font-display uppercase text-foreground" style={{ fontSize: "clamp(42px, 7.5vw, 92px)" }}>
            <StaggerWords text={current.album} stagger={0.06} />
          </h2>
          <div className="mt-3 text-[13px] uppercase leading-[1.7] tracking-[0.03em] text-foreground">{current.artist}</div>
          <div className="mt-3 text-[13px] uppercase leading-[1.7] tracking-[0.03em] text-foreground">{current.era}</div>
          {current.note && (
            <div className="mx-auto mt-3 max-w-[480px] text-[13px] uppercase leading-[1.7] tracking-[0.03em] text-foreground">{current.note}</div>
          )}
          {!current.isPlaceholder && (
            <button
              className="hover-underline pointer-events-auto mt-5 text-[13px] uppercase leading-[1.7] tracking-[0.03em] text-foreground"
              onClick={onOpen}
            >
              Read about the band ↗
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
