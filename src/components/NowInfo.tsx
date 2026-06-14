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

// Brutalist FeaturedAlbum styling — left-aligned, tight groups, big breaks.
export function NowInfo({ current, show, onOpen }: { current: RecInfo | null; show: boolean; onOpen: () => void }) {
  return (
    <AnimatePresence>
      {show && current && (
        <motion.article
          key="now"
          className="pointer-events-none fixed left-1/2 top-1/2 z-10 w-[min(90vw,520px)] text-left text-[#e8e6e0]"
          initial={{ opacity: 0, x: "-50%", y: "-46%", filter: "blur(10px)" }}
          animate={{ opacity: 1, x: "-50%", y: "-50%", filter: "blur(0px)" }}
          exit={{ opacity: 0, x: "-50%", y: "-50%", filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {/* 1 — album title (largest tier) */}
          <h2 className="text-3xl font-extrabold uppercase leading-none tracking-tight">
            <StaggerWords text={current.album} stagger={0.06} />
          </h2>

          {/* 2 — band name */}
          <h3 className="mb-1 mt-3 text-xl font-bold uppercase tracking-wide">{current.artist}</h3>

          {/* 3 — meta line: genre · year */}
          <p className="text-xs uppercase tracking-widest text-white/40">
            {current.era} · {current.year >= 2024 ? "NOW" : current.year}
          </p>

          {/* 4 — description */}
          {current.note && (
            <p className="mt-7 max-w-xs text-xs uppercase leading-relaxed tracking-wider text-white/60">{current.note}</p>
          )}

          {/* 5 — link */}
          {!current.isPlaceholder && (
            <button
              onClick={onOpen}
              className="hover-underline pointer-events-auto mt-7 inline-block text-xs font-bold uppercase tracking-widest text-[#e8e6e0]"
            >
              Read about the band ↗
            </button>
          )}
        </motion.article>
      )}
    </AnimatePresence>
  );
}
