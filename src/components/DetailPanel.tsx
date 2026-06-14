import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { fetchBio, fetchDiscography, type Album, type Bio } from "@/lib/api";
import type { RecInfo } from "./NowInfo";

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
    <motion.div className="fixed inset-0 z-30 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <motion.aside
        className="relative h-full w-[min(460px,92vw)] overflow-y-auto border-l border-border bg-[#0c0c0b]/95 px-8 pb-14 pt-8"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 30, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <button onClick={onClose} className="absolute right-6 top-5 text-foreground/60 hover:text-foreground"><X size={20} /></button>

        <div className="text-[12px] font-bold uppercase tracking-[0.22em]" style={{ color: "hsl(var(--accent))" }}>{rec.yearLabel}</div>
        <h3 className="mt-1 font-display text-4xl uppercase leading-[0.95] text-foreground">{rec.album}</h3>
        <div className="mt-1 text-[15px] text-foreground/70">{rec.artist}</div>
        {rec.note && <div className="mt-3 text-[13px] italic text-muted">{rec.note}</div>}

        <img src={hero} alt="" className="mt-5 aspect-[16/10] w-full rounded-xl bg-white/5 object-cover" />

        <h4 className="mb-2 mt-7 text-[12px] uppercase tracking-[0.2em] text-muted">About</h4>
        <div className="text-[14px] leading-relaxed text-foreground/85">
          {bio === "loading" ? (
            <span className="text-muted">Loading…</span>
          ) : bio ? (
            <>
              {bio.extract}{" "}
              {bio.link && (<a href={bio.link} target="_blank" rel="noopener" className="underline" style={{ color: "hsl(var(--accent))" }}>Wikipedia ↗</a>)}
            </>
          ) : (
            <span className="text-muted">No bio found — enjoy the music.</span>
          )}
        </div>

        <h4 className="mb-3 mt-7 text-[12px] uppercase tracking-[0.2em] text-muted">Discography</h4>
        {disco === "loading" ? (
          <span className="text-[13px] text-muted">Loading…</span>
        ) : disco.length ? (
          <div className="grid grid-cols-3 gap-[10px]">
            {disco.map((a, i) => (
              <div key={i} className="text-[10px] text-foreground/60">
                <img src={a.art} alt="" loading="lazy" className="mb-1 aspect-square w-full rounded-lg bg-white/5 object-cover" />
                <span className="line-clamp-2 block leading-tight">{a.name}</span>
                {a.year && <span>{a.year}</span>}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-[13px] text-muted">No releases found.</span>
        )}
      </motion.aside>
    </motion.div>
  );
}
