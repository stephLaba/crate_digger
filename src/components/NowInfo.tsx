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
          className="pointer-events-none fixed left-1/2 top-1/2 z-10 w-[min(90vw,620px)] text-center text-[#e8e6e0]"
          initial={{ opacity: 0, x: "-50%", y: "-46%", filter: "blur(10px)" }}
          animate={{ opacity: 1, x: "-50%", y: "-50%", filter: "blur(0px)" }}
          exit={{ opacity: 0, x: "-50%", y: "-50%", filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {/* meta line: genre · year (above the album name) */}
          <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
            {current.era} · {current.year >= 2024 ? "NOW" : current.year}
          </p>

          {/* album title (big display face) */}
          <h2 className="font-display uppercase" style={{ fontSize: "clamp(42px, 7.5vw, 92px)" }}>
            <StaggerWords text={current.album} stagger={0.06} />
          </h2>

          {/* band name */}
          <h3 className="mt-3 text-xl font-bold uppercase tracking-wide">{current.artist}</h3>

          {/* 4 — description */}
          {current.note && (
            <p className="mx-auto mt-7 max-w-xs text-xs uppercase leading-relaxed tracking-wider text-white/60">{current.note}</p>
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
