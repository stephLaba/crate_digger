// Free, no-auth sources: Wikipedia REST (bio + band photo) and iTunes Search (discography + art).

let jc = 0;
function jsonp<T = any>(url: string): Promise<T> {
  return new Promise((res, rej) => {
    const name = "itcb_d_" + jc++;
    const sc = document.createElement("script");
    (window as any)[name] = (d: T) => { res(d); delete (window as any)[name]; sc.remove(); };
    sc.onerror = () => { rej(new Error("jsonp")); delete (window as any)[name]; sc.remove(); };
    sc.src = url + (url.includes("?") ? "&" : "?") + "callback=" + name;
    document.body.appendChild(sc);
    setTimeout(() => { if ((window as any)[name]) { rej(new Error("timeout")); delete (window as any)[name]; sc.remove(); } }, 8000);
  });
}

async function wiki(title: string) {
  const r = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title));
  if (!r.ok) throw new Error("wiki");
  const j = await r.json();
  if ((j.type || "").includes("disambiguation")) throw new Error("disambig");
  return j;
}

export type Bio = { extract: string; thumb?: string; image?: string; link?: string } | null;
export async function fetchBio(artist: string): Promise<Bio> {
  const get = async (t: string) => {
    const j = await wiki(t);
    const thumb = j.thumbnail?.source as string | undefined;
    // Wikimedia thumbnail URLs are resizable — bump the width for a sharper hero image;
    // fall back to the full-res original if there's no thumbnail to upscale.
    const image =
      (thumb && /\/\d+px-/.test(thumb) ? thumb.replace(/\/\d+px-/, "/1280px-") : undefined) ||
      (j.originalimage?.source as string | undefined) ||
      thumb;
    return { extract: j.extract as string, thumb, image, link: j.content_urls?.desktop?.page as string | undefined };
  };
  try { return await get(artist); } catch { try { return await get(artist + " (band)"); } catch { return null; } }
}

export type Album = { name: string; year: string; art: string };
export async function fetchDiscography(artist: string): Promise<Album[]> {
  try {
    const d = await jsonp<{ results: any[] }>(
      "https://itunes.apple.com/search?term=" + encodeURIComponent(artist) + "&entity=album&attribute=artistTerm&limit=9"
    );
    return (d.results || []).map((it) => ({
      name: it.collectionName || "",
      year: it.releaseDate ? it.releaseDate.slice(0, 4) : "",
      art: (it.artworkUrl100 || "").replace("100x100", "600x600"),
    }));
  } catch {
    return [];
  }
}
