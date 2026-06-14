export interface FeaturedAlbumProps {
  title: string;
  band: string;
  genre: string;
  year: string | number;
  description: string;
  linkUrl: string;
}

/**
 * Brutalist "featured album" block — flat, raw, left-aligned.
 * Tight typographic groups with big breaks between them.
 */
export function FeaturedAlbum({ title, band, genre, year, description, linkUrl }: FeaturedAlbumProps) {
  return (
    <article className="bg-[#0a0a0a] p-8 text-left font-sans text-[#e8e6e0]">
      {/* 1 — album title (largest tier) */}
      <h2 className="text-3xl font-extrabold uppercase leading-none tracking-tight">{title}</h2>

      {/* 2 — band name (sits tight above the meta line) */}
      <h3 className="mb-1 mt-3 text-xl font-bold uppercase tracking-wide">{band}</h3>

      {/* 3 — meta line: genre · year */}
      <p className="text-xs uppercase tracking-widest text-white/40">
        {genre} · {year}
      </p>

      {/* 4 — description tagline */}
      <p className="mb-7 mt-7 max-w-xs text-xs uppercase leading-relaxed tracking-wider text-white/60">
        {description}
      </p>

      {/* 5 — link */}
      <a
        href={linkUrl}
        className="inline-block border-b-2 border-[#e8e6e0] text-xs font-bold uppercase tracking-widest text-[#e8e6e0]"
      >
        Read more ↗
      </a>
    </article>
  );
}
