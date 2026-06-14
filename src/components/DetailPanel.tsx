import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { fetchBio, fetchDiscography, type Album, type Bio } from "@/lib/api";
import type { RecInfo } from "./NowInfo";

// simple grey box used while album art loads or when it's missing
const GREY = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%2323232a'/%3E%3C/svg%3E";
const greyOnError = (e: { currentTarget: HTMLImageElement }) => { e.currentTarget.src = GREY; };

export function DetailPanel({ rec, onClose }: { rec: RecInfo; onClose: () => void }) {
  const [bio, setBio] = useState<Bio | "loading">("loading");
  const [hero, setHero] = useState(rec.cover);
  const [disco, setDisco] = useState<Album[] | "loading">("loading");

  useEffect(() => {
    let alive = true;
    setBio("loading"); setDisco("loading"); setHero(rec.cover);
    fetchBio(rec.artist).then((b) => { if (!alive) return; setBio(b); if (b?.thumb) setHero(b.thumb); });
    fetchDiscography(rec.artist).then((d) => { if (alive) setDisco(d); });
    return () => { alive = false; };
  }, [rec.artist, rec.cover]);

  return (
    <motion.div className="fixed inset-0 z-[70] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside
        className="relative h-full w-[min(480px,94vw)] overflow-y-auto border-l border-border bg-[#0c0c0b] text-[#e8e6e0]"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 30, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="glass-dark absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.55))" }}
        >
          <X size={18} />
        </button>

        {/* hero: band photo as background, info overlaid bottom-left, gradient + blur fading into the content */}
        <header className="relative h-[56%] min-h-[340px] w-full overflow-hidden">
          <img src={hero || GREY} onError={greyOnError} alt="" className="absolute inset-0 h-full w-full bg-[#23232a] object-cover grayscale" />
          {/* black gradient fading to the panel bg */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(12,12,11,0.15) 0%, rgba(12,12,11,0) 30%, rgba(12,12,11,0.55) 66%, #0c0c0b 100%)" }}
          />
          {/* gradient blur — strongest at the bottom, fades up */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{
              backdropFilter: "blur(7px)",
              WebkitBackdropFilter: "blur(7px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 75%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, #000 75%)",
            }}
          />
          {/* album info, bottom-left */}
          <div className="absolute bottom-0 left-0 p-7">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--accent))" }}>{rec.yearLabel}</div>
            <h3 className="mt-1 font-display text-4xl uppercase leading-none">{rec.album}</h3>
            <div className="mt-2 text-sm uppercase tracking-wide text-white/75">{rec.artist}</div>
            {rec.note && <div className="mt-2 max-w-xs text-[11px] uppercase italic leading-relaxed tracking-wider text-white/55">{rec.note}</div>}
          </div>
        </header>

        {/* content */}
        <div className="px-7 pb-14 pt-2">
          <h4 className="mb-2 text-[12px] uppercase tracking-[0.2em] text-white/40">About</h4>
          <div className="text-[14px] leading-relaxed text-white/85">
            {bio === "loading" ? (
              <span className="text-white/40">Loading…</span>
            ) : bio ? (
              <>
                {bio.extract}{" "}
                {bio.link && (<a href={bio.link} target="_blank" rel="noopener" className="underline" style={{ color: "hsl(var(--accent))" }}>Wikipedia ↗</a>)}
              </>
            ) : (
              <span className="text-white/40">No bio found — enjoy the music.</span>
            )}
          </div>

          <h4 className="mb-3 mt-8 text-[12px] uppercase tracking-[0.2em] text-white/40">Discography</h4>
          {disco === "loading" ? (
            <span className="text-[13px] text-white/40">Loading…</span>
          ) : disco.length ? (
            <div className="grid grid-cols-3 gap-[10px]">
              {disco.map((a, i) => (
                <div key={i} className="text-[10px] uppercase tracking-wide text-white/55">
                  <img src={a.art || GREY} onError={greyOnError} alt="" loading="lazy" className="mb-1 aspect-square w-full bg-[#23232a] object-cover" />
                  <span className="line-clamp-2 block leading-tight">{a.name}</span>
                  {a.year && <span className="text-white/35">{a.year}</span>}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[13px] text-white/40">No releases found.</span>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}
