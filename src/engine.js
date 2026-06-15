// Crate Digger — Three.js engine, decoupled from the DOM.
// React mounts it on a <canvas>, listens via onState/onOpen, and drives it with method calls.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const NOW_YEAR = 2026;

// [year, album, artist, note, era] — real heavy-metal milestones (grounded in the Wikipedia history)
const TRACKS = [
  [1967, "Are You Experienced", "The Jimi Hendrix Experience", "Virtuosic, distorted — a root of the heavy sound.", "Roots"],
  [1968, "Vincebus Eruptum", "Blue Cheer", "Often called the first true heavy metal recording.", "Proto-metal"],
  [1969, "Led Zeppelin", "Led Zeppelin", "Distorted riffs and wailing vocals set the template.", "Proto-metal"],
  [1970, "Black Sabbath", "Black Sabbath", "Widely accepted as the first heavy metal album.", "The birth · 1970"],
  [1970, "Paranoid", "Black Sabbath", "Dark themes and monster riffs define metal's identity.", "The birth · 1970"],
  [1970, "...Very 'Eavy ...Very 'Umble", "Uriah Heep", "British hard rock turns heavier and darker.", "The birth · 1970"],
  [1972, "Machine Head", "Deep Purple", "“Smoke on the Water” — the third pillar of early metal.", "Early metal"],
  [1976, "Sad Wings of Destiny", "Judas Priest", "Twin guitars shed the blues and forge metal proper.", "Forging the sound"],
  [1976, "Rising", "Rainbow", "Blackmore + Dio: neoclassical fantasy — the seed of power metal.", "Forging the sound"],
  [1978, "Van Halen", "Van Halen", "Two-handed tapping reinvents the guitar.", "Forging the sound"],
  [1979, "Highway to Hell", "AC/DC", "Riff-driven hard rock at full throttle.", "Forging the sound"],
  [1980, "Ace of Spades", "Motörhead", "Punk speed meets metal — NWOBHM's battering ram.", "NWOBHM"],
  [1980, "British Steel", "Judas Priest", "Leaner, faster, anthemic.", "NWOBHM"],
  [1980, "Wheels of Steel", "Saxon", "NWOBHM workhorses.", "NWOBHM"],
  [1980, "Lightning to the Nations", "Diamond Head", "NWOBHM cult — Metallica's blueprint.", "NWOBHM"],
  [1982, "The Number of the Beast", "Iron Maiden", "Galloping dual guitars conquer the world.", "NWOBHM"],
  [1982, "Black Metal", "Venom", "Crude, dark, and it named a whole genre.", "NWOBHM"],
  [1983, "Metal Health", "Quiet Riot", "First glam-metal album to top the US charts.", "Glam metal"],
  [1983, "Shout at the Devil", "Mötley Crüe", "Sunset Strip glam and theatrical excess.", "Glam metal"],
  [1983, "Kill 'Em All", "Metallica", "Thrash is born — speed and aggression.", "Thrash"],
  [1984, "Rising Force", "Yngwie Malmsteen", "Neoclassical shred redefines the guitar.", "Neoclassical"],
  [1985, "Seven Churches", "Possessed", "The record that coined “death metal.”", "Extreme begins"],
  [1986, "Master of Puppets", "Metallica", "Thrash's towering, complex peak.", "Thrash"],
  [1986, "Reign in Blood", "Slayer", "Twenty-nine minutes of pure extremity.", "Thrash"],
  [1986, "Peace Sells... but Who's Buying?", "Megadeth", "Technical, political thrash.", "Thrash"],
  [1986, "Epicus Doomicus Metallicus", "Candlemass", "Epic doom metal, defined.", "Doom metal"],
  [1987, "Among the Living", "Anthrax", "New York thrash and mosh anthems.", "Thrash"],
  [1987, "Scream Bloody Gore", "Death", "Death metal's founding document.", "Death metal"],
  [1987, "Scum", "Napalm Death", "Grindcore is born — extremity distilled.", "Grindcore"],
  [1987, "Keeper of the Seven Keys, Part I", "Helloween", "European power metal takes flight.", "Power metal"],
  [1987, "Appetite for Destruction", "Guns N' Roses", "The glam era's dangerous commercial peak.", "Glam metal"],
  [1989, "Altars of Madness", "Morbid Angel", "The blueprint for death metal.", "Death metal"],
  [1990, "Cowboys from Hell", "Pantera", "Thrash tightened into pure groove.", "Groove metal"],
  [1990, "Left Hand Path", "Entombed", "The buzzsaw sound of Swedish death metal.", "Death metal"],
  [1991, "The Black Album", "Metallica", "Metal conquers the mainstream.", "Metal goes global"],
  [1992, "Tomb of the Mutilated", "Cannibal Corpse", "American death metal at its most extreme.", "Death metal"],
  [1992, "The IVth Crusade", "Bolt Thrower", "Lumbering, war-themed British death metal.", "Death metal"],
  [1992, "Psalm 69", "Ministry", "Industrial metal breaks through.", "Industrial metal"],
  [1993, "Chaos A.D.", "Sepultura", "Brazilian groove and tribal fury.", "Groove metal"],
  [1994, "De Mysteriis Dom Sathanas", "Mayhem", "Norwegian black metal's defining, infamous record.", "Black metal"],
  [1994, "Transilvanian Hunger", "Darkthrone", "Raw, lo-fi black metal.", "Black metal"],
  [1994, "Korn", "Korn", "Detuned, hip-hop-inflected — nu metal begins.", "Nu metal"],
  [1997, "Sehnsucht", "Rammstein", "Pyrotechnic Neue Deutsche Härte.", "Industrial metal"],
  [1999, "Slipknot", "Slipknot", "Masked, chaotic, a new generation.", "Nu metal"],
  [2000, "Dopethrone", "Electric Wizard", "Crushing, narcotic stoner doom.", "Doom metal"],
  [2000, "White Pony", "Deftones", "Atmospheric, genre-blurring nu metal.", "Nu metal"],
  [2001, "Toxicity", "System of a Down", "Art-damaged, political nu metal.", "Nu metal"],
  [2001, "Jane Doe", "Converge", "A mathcore landmark — chaotic, technical metalcore.", "Metalcore"],
  [2002, "Lucid Interval", "Cephalic Carnage", "Genre-melting technical deathgrind.", "Grindcore"],
  [2002, "Oceanic", "Isis", "Atmospheric, slow-building post-metal.", "Post-metal"],
  [2004, "Ashes of the Wake", "Lamb of God", "The new wave of American metal's heavy hitter.", "Metalcore"],
  [2004, "Leviathan", "Mastodon", "Progressive sludge — a Moby-Dick concept opus.", "Sludge metal"],
  [2005, "Black One", "Sunn O)))", "Glacial, monolithic drone metal.", "Drone metal"],
  [2006, "Age of Winters", "The Sword", "Riff-heavy stoner-metal revival.", "Stoner metal"],
  [2007, "Colors", "Between the Buried and Me", "Sprawling progressive metalcore.", "Progressive metal"],
  [2008, "obZen", "Meshuggah", "Polyrhythmic and crushing — the root of djent.", "Djent & beyond"],
  [2012, "L'Enfant Sauvage", "Gojira", "Modern progressive metal with global reach.", "Modern metal"],
];
const HUE = 0;

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function smoothstep(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function isPlaceholder(t) { return t[1] === "Today" || /next wave|modern |revival| era$|^berghain/i.test(t[2]); }

function makeCover(album, artist, year, hue, seed) {
  const S = 512, cv = document.createElement("canvas"); cv.width = cv.height = S;
  const ctx = cv.getContext("2d");
  let s = seed * 9301 + 49297; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const h1 = (hue + rnd() * 50 - 25 + 360) % 360, h2 = (h1 + 40 + rnd() * 40) % 360;
  const c1 = `hsl(${h1 | 0},68%,54%)`, c2 = `hsl(${h2 | 0},58%,30%)`;
  const g = ctx.createLinearGradient(0, 0, S, S); g.addColorStop(0, c1); g.addColorStop(1, c2); ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  const style = seed % 4; ctx.globalCompositeOperation = "overlay";
  if (style === 0) { for (let r = S; r > 0; r -= 26) { ctx.beginPath(); ctx.arc(S * 0.7, S * 0.3, r, 0, 7); ctx.fillStyle = r % 52 === 0 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; ctx.fill(); } }
  else if (style === 1) { for (let i = -S; i < S * 2; i += 38) { ctx.fillStyle = (i / 38) % 2 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)"; ctx.save(); ctx.translate(i, 0); ctx.rotate(0.5); ctx.fillRect(0, -S, 18, S * 3); ctx.restore(); } }
  else if (style === 2) { for (let i = 0; i < 80; i++) { const x = rnd() * S, y = rnd() * S, rr = rnd() * 40 + 4; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fillStyle = rnd() > 0.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"; ctx.fill(); } }
  else { ctx.beginPath(); ctx.moveTo(S * 0.15, S * 0.85); ctx.lineTo(S * 0.85, S * 0.85); ctx.lineTo(S * 0.5, S * 0.2); ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill(); }
  ctx.globalCompositeOperation = "source-over";
  const vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.2, S / 2, S / 2, S * 0.75); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.45)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.font = "800 30px Inter,sans-serif"; ctx.textBaseline = "top"; ctx.fillText(String(year), 40, 40);
  ctx.fillStyle = "rgba(255,255,255,0.96)"; ctx.font = "700 42px Inter,sans-serif";
  (function wrap(text, x, y, maxW, lh) { const w = text.split(" "); let line = "", yy = y; for (const word of w) { const tt = line + word + " "; if (ctx.measureText(tt).width > maxW && line) { ctx.fillText(line.trim(), x, yy); line = word + " "; yy += lh; } else line = tt; } ctx.fillText(line.trim(), x, yy); })(album.toLowerCase(), 40, S - 160, S - 80, 44);
  ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "500 22px Inter,sans-serif"; ctx.fillText(artist.toLowerCase(), 40, S - 54);
  const tex = new THREE.CanvasTexture(cv); tex.anisotropy = 8; tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, canvas: cv, url: cv.toDataURL("image/jpeg", 0.8) };
}

// draw a source (canvas or image) through a CSS blur into a new texture — used for depth blur
function blurToTexture(src, px) {
  const w = src.width || src.naturalWidth || 512, h = src.height || src.naturalHeight || 512;
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  ctx.filter = `blur(${px}px)`;
  ctx.drawImage(src, 0, 0, w, h);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; return tex;
}

function makeTextPlane(text, size, opacity) {
  const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 256; const ctx = cv.getContext("2d");
  ctx.fillStyle = `rgba(255,255,255,${opacity})`; ctx.font = "800 180px Anton, Inter, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, 512, 128);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(size, size / 4), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
}

let jc = 0;
function jsonp(url) {
  return new Promise((res, rej) => {
    const name = "itcb_" + jc++; const sc = document.createElement("script");
    window[name] = (d) => { res(d); delete window[name]; sc.remove(); };
    sc.onerror = () => { rej(); delete window[name]; sc.remove(); };
    sc.src = url + (url.includes("?") ? "&" : "?") + "callback=" + name; document.body.appendChild(sc);
    setTimeout(() => { if (window[name]) { rej(new Error("timeout")); delete window[name]; sc.remove(); } }, 8000);
  });
}

export class CrateDiggerEngine {
  constructor(canvas, { onState, onOpen } = {}) {
    this.onState = onState || (() => {});
    this.onOpen = onOpen || (() => {});
    this.active = false; this.paused = false; this.muted = false; this.masterVol = 0.65; this.panelOpen = false;
    this.minYear = 1968; this.maxYear = NOW_YEAR; this.SPACING = 14; this.FOCUS = 10;
    this.travelYear = this.minYear; this.travelTarget = this.minYear;
    this.records = []; this.snapOrder = []; this.snapIndex = 0; this.lastSnap = 0; this.lastFront = null;
    this.look = { x: 0, y: 0, tx: 0, ty: 0 };
    this._last = {};
    this.aCtx = null; this.crackleNode = null; this.audioLevel = 0; this.pulse = 0;
    this.orbItems = []; this._mx = 0; this._my = 0; this.parX = 0; this.parY = 0;

    const scene = new THREE.Scene(); scene.background = null; scene.fog = new THREE.FogExp2(0x0d0d0c, 0.012);
    const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 1200);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.06;
    this.scene = scene; this.camera = camera; this.renderer = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    this.BLOOM_BASE = 0.42;
    const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), this.BLOOM_BASE, 0.35, 0.9);
    composer.addPass(bloom); composer.addPass(new OutputPass());
    this.composer = composer; this.bloom = bloom;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    this.key = new THREE.PointLight(0xffffff, 70, 90); scene.add(this.key);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.6); rim.position.set(-1, 1, 1); scene.add(rim);

    this.sleeveGeo = new THREE.BoxGeometry(5.4, 5.4, 0.22);
    this.field = new THREE.Group(); scene.add(this.field);
    this.texLoader = new THREE.TextureLoader(); this.texLoader.setCrossOrigin("anonymous");

    this._buildOrb(); this._fetchOrbArt(); this._buildTitle();

    this.ray = new THREE.Raycaster();
    this._bind();
    this.clock = new THREE.Clock();
    this._raf = requestAnimationFrame(this._animate);
    this.emit(true);
  }

  yearToZ(y) { return -(y - this.minYear) * this.SPACING - 8; }
  clamp(v) { return Math.max(this.minYear, Math.min(this.maxYear, v)); }

  /* ---------- homepage gallery: a drifting grid of records with depth ---------- */
  _buildOrb() {
    this.orb = new THREE.Group();
    // sample a spaced-out subset for the homepage gallery so it doesn't overcrowd
    const tracks = TRACKS.filter((t) => t[1] !== "Today").filter((_, i) => i % 2 === 0);
    // place by SCREEN position so records fill the viewport evenly regardless of depth
    const cols = 6, rows = Math.ceil(tracks.length / cols);
    const tanHalf = Math.tan(((62 * Math.PI) / 180) / 2);
    const aspect = innerWidth / innerHeight;
    const geo = new THREE.PlaneGeometry(3.0, 3.0);
    tracks.forEach((t, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const zr = ((Math.sin(i * 127.1) * 43758.5) % 1 + 1) % 1; // deterministic depth
      const z = -14 - zr * 34; // -14 (front) … -48 (deep)
      // even grid across normalized screen space, pushed slightly past the edges + jitter
      const ndcX = ((col + 0.5) / cols * 2 - 1) * 1.2 + Math.sin(i * 9.3) * 0.05;
      const ndcY = -(((row + 0.5) / rows * 2 - 1) * 1.05) + Math.cos(i * 5.7) * 0.05;
      const x = ndcX * Math.abs(z) * tanHalf * aspect;
      const y = ndcY * Math.abs(z) * tanHalf;
      const blurPx = Math.max(0, zr - 0.2) * 10; // further back = more blur
      // start as a plain grey box; real album art swaps in once it loads
      const mat = new THREE.MeshBasicMaterial({ color: 0x23232a, transparent: true, opacity: 0.4 + (1 - zr) * 0.6, depthWrite: false });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.scale.setScalar(0.75 + (1 - zr) * 0.85);
      this.orb.add(m);
      this.orbItems.push({ mat, track: t, m, baseY: y, bob: i * 0.7, amp: 0.15 + zr * 0.35, blurPx });
    });
    this.orb.position.set(0, 0, 0);
    this.scene.add(this.orb);
  }
  _fetchOrbArt() {
    this.orbItems.forEach((it) => {
      const t = it.track, term = encodeURIComponent(t[2] + " " + t[1].replace(/[’']/g, ""));
      jsonp("https://itunes.apple.com/search?term=" + term + "&entity=album&limit=3")
        .then((d) => {
          const r = (d && d.results) || [], hit = r.find((x) => x.artworkUrl100) || r[0];
          if (!hit || !hit.artworkUrl100) return;
          const art = hit.artworkUrl100.replace("100x100", "400x400");
          this.texLoader.load(art, (tex) => {
            let map = tex;
            if (it.blurPx > 0.6 && tex.image) map = blurToTexture(tex.image, it.blurPx);
            else tex.colorSpace = THREE.SRGBColorSpace;
            it.mat.map = map; it.mat.color.set(0xffffff); it.mat.needsUpdate = true;
          }, undefined, () => {});
        }).catch(() => {});
    });
  }

  /* ---------- bulge title (homepage) ---------- */
  _titleDims() {
    const tanHalf = Math.tan(((62 * Math.PI) / 180) / 2);
    const vH = 2 * Math.abs(this._titleZ) * tanHalf;
    const vW = vH * (innerWidth / innerHeight);
    const planeW = vW * 0.94, planeH = planeW / 4;
    return { vH, planeW, planeH };
  }
  _drawTitle() {
    const ctx = this._titleCtx;
    ctx.clearRect(0, 0, 2048, 512);
    ctx.fillStyle = "#cdd0c7";
    ctx.font = "800 300px Anton, Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CRATE DIGGER", 1024, 262);
    this._titleTex.needsUpdate = true;
  }
  _buildTitle() {
    this._titleZ = -10;
    const cv = document.createElement("canvas"); cv.width = 2048; cv.height = 512;
    this._titleCtx = cv.getContext("2d");
    this._titleTex = new THREE.CanvasTexture(cv);
    this._titleTex.colorSpace = THREE.SRGBColorSpace; this._titleTex.minFilter = THREE.LinearFilter; this._titleTex.anisotropy = 8;
    this._drawTitle();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this._drawTitle());
    const { planeW, planeH } = this._titleDims();
    this._planeH = planeH;
    this.titleMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: {
        uTex: { value: this._titleTex },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAspect: { value: planeW / planeH },
        uStrength: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: `
        uniform sampler2D uTex; uniform vec2 uMouse; uniform float uAspect; uniform float uStrength; uniform float uOpacity;
        varying vec2 vUv;
        void main(){
          vec2 uv = vUv;
          vec2 d = uv - uMouse; d.x *= uAspect;
          float t = smoothstep(0.32, 0.0, length(d));   // 1 near cursor, 0 past radius
          uv -= (uv - uMouse) * t * uStrength;           // pull toward cursor = bulge/magnify
          vec4 c = texture2D(uTex, uv);
          gl_FragColor = vec4(c.rgb, c.a * uOpacity);
        }`,
    });
    this.title = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), this.titleMat);
    this.title.position.set(0, 0, this._titleZ);
    this.scene.add(this.title);
  }
  _resizeTitle() {
    if (!this.title) return;
    const { planeW, planeH } = this._titleDims();
    this._planeH = planeH;
    this.title.geometry.dispose();
    this.title.geometry = new THREE.PlaneGeometry(planeW, planeH);
    this.titleMat.uniforms.uAspect.value = planeW / planeH;
  }

  /* ---------- timeline (records) ---------- */
  _buildField() {
    this._stopAllAudio();
    this.field.traverse((o) => { if (o.material) { const m = Array.isArray(o.material) ? o.material : [o.material]; m.forEach((mm) => { mm.map?.dispose?.(); mm.dispose?.(); }); } });
    this.scene.remove(this.field); this.field = new THREE.Group(); this.scene.add(this.field);
    this.records = []; this.pickMeshes = [];

    for (let d = Math.ceil(this.minYear / 10) * 10; d <= 2020; d += 10) {
      const m = makeTextPlane(String(d), 34, 0.045); m.position.set(0, 8, this.yearToZ(d)); m.lookAt(0, 8, this.yearToZ(d) + 10); this.field.add(m);
    }
    const perYear = {};
    TRACKS.forEach((t, i) => {
      const [year, album, artist, note, era] = t;
      const ph = isPlaceholder(t);
      const k = perYear[year] = perYear[year] || 0; perYear[year]++;
      const sgn = i % 2 === 0 ? -1 : 1;
      // sit just off the center path (visible beside the centered text, camera passes beside them)
      const x = sgn * 4.6, y = Math.sin(i * 0.7) * 1.0, z = this.yearToZ(year) - k * 9;
      const group = new THREE.Group();
      group.position.set(x, y, z); group.lookAt(x, y, z + 10); group.rotation.y += -sgn * 0.16;
      this.field.add(group);
      let cover = null, mats = [], url = "", sleeve = null;
      if (!ph) {
        // start as a plain grey box; real album art swaps in once it loads (grey if it's missing)
        cover = new THREE.MeshStandardMaterial({ color: 0x23232a, roughness: 0.7, metalness: 0.05, transparent: true, opacity: 0 });
        const side = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.8, transparent: true, opacity: 0 });
        sleeve = new THREE.Mesh(this.sleeveGeo, [side, side, side, side, cover, side]);
        group.add(sleeve); mats = [cover, side];
      }
      const rec = { group, year, album, artist, note, era, idx: i, snapYear: this.minYear - (z + this.FOCUS) / this.SPACING, coverMat: cover, mats, curOp: 0, coverURL: url, realArt: null, previewUrl: null, audio: null, curVol: 0 };
      this.records.push(rec);
      if (sleeve) { sleeve.userData.rec = rec; this.pickMeshes.push(sleeve); }
    });
    this.snapOrder = this.records.slice().sort((a, b) => b.group.position.z - a.group.position.z);
    // a virtual "end" stop sits just past the last record (snapIndex === snapOrder.length)
    const last = this.snapOrder[this.snapOrder.length - 1];
    this.endYear = last.snapYear + (this.FOCUS + 6) / this.SPACING;
    this.maxYear = Math.max(NOW_YEAR, this.endYear);
    // start at the very beginning of the timeline (the first year), before any album is selected;
    // the first scroll brings you onto the first record.
    this.snapIndex = -1; this.travelTarget = this.minYear; this.travelYear = this.minYear;
    this.lastFront = null; this._atEnd = false;
    this._fetchMedia();
  }
  _applyCover(rec, url) {
    if (!rec.coverMat || rec.realArt) return;
    this.texLoader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      rec.coverMat.map = tex; rec.coverMat.color.set(0xffffff); rec.coverMat.needsUpdate = true; rec.realArt = url;
    }, undefined, () => { this._wikiCover(rec); });
  }
  // fall back to the album's Wikipedia page image when iTunes has no cover
  _wikiCover(rec) {
    if (rec.realArt || rec._triedWiki) return; rec._triedWiki = true;
    const titles = [`${rec.album} (${rec.artist} album)`, `${rec.album} (album)`, rec.album];
    const tryNext = (i) => {
      if (i >= titles.length || rec.realArt) return;
      fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(titles[i]))
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j) => {
          if ((j.type || "").includes("disambiguation")) return tryNext(i + 1);
          const src = j.originalimage?.source || j.thumbnail?.source;
          if (src) this.texLoader.load(src, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
            if (rec.coverMat && !rec.realArt) { rec.coverMat.map = tex; rec.coverMat.color.set(0xffffff); rec.coverMat.needsUpdate = true; rec.realArt = src; }
          }, undefined, () => tryNext(i + 1));
          else tryNext(i + 1);
        })
        .catch(() => tryNext(i + 1));
    };
    tryNext(0);
  }
  _fetchMedia() {
    this.records.forEach((rec, i) => {
      if (isPlaceholder(TRACKS[i])) return;
      const term = encodeURIComponent(rec.artist + " " + rec.album.replace(/[’']/g, ""));
      jsonp("https://itunes.apple.com/search?term=" + term + "&entity=song&limit=6")
        .then((d) => {
          const res = (d && d.results) || [], hit = res.find((x) => x.previewUrl) || res[0];
          if (hit && hit.previewUrl) { rec.previewUrl = hit.previewUrl; if (rec === this.lastFront) this.emit(true); }
          const art = hit && (hit.artworkUrl100 || "").replace("100x100", "600x600");
          if (art) this._applyCover(rec, art); else this._wikiCover(rec);
        })
        .catch(() => this._wikiCover(rec));
    });
  }

  /* ---------- audio ---------- */
  unlockAudio() { if (!this.aCtx) { try { this.aCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.aCtx && this.aCtx.state === "suspended") this.aCtx.resume(); }
  _createAudio(rec) { if (!rec.previewUrl) return; const a = new Audio(); a.src = rec.previewUrl; a.loop = true; a.preload = "auto"; a.volume = 0; rec.audio = a; rec.curVol = 0; if (!this.paused) a.play().catch(() => {}); }
  _stopAllAudio() { for (const r of this.records) { if (r.audio) { try { r.audio.pause(); } catch (e) {} r.audio.src = ""; r.audio = null; r.curVol = 0; } } }
  _updateAudio(camZ) {
    const live = this.active && !this.panelOpen && !this.paused;
    let best = Infinity, near = null;
    for (const r of this.records) { const d = Math.abs(r.group.position.z - (camZ - this.FOCUS)); if (d < best) { best = d; near = r; } }
    const target = live && near && near.previewUrl && best < 12 ? near : null;
    for (const r of this.records) {
      const want = r === target, tv = want ? 1 : 0;
      if (want && !r.audio && !this.paused) this._createAudio(r);
      if (r.audio) {
        r.curVol += (tv - r.curVol) * (want ? 0.12 : 0.2);
        r.audio.volume = this.paused ? 0 : Math.max(0, Math.min(1, r.curVol * this.masterVol * (this.muted ? 0 : 1)));
        if (this.paused) { if (!r.audio.paused) r.audio.pause(); }
        else if (want && r.audio.paused) r.audio.play().catch(() => {});
        else if (!want && r.curVol < 0.02 && !r.audio.paused) r.audio.pause();
      }
    }
    this.audioLevel = target && target.audio ? target.curVol * this.masterVol * (this.muted ? 0 : 1) : 0;
    this._playing = this.audioLevel > 0.04;
  }
  _makeCrackleBuffer() {
    const sr = this.aCtx.sampleRate, len = Math.floor(sr * 4), buf = this.aCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.012;
    let i = 0; while (i < len) { i += Math.floor(sr * (0.006 + Math.random() * 0.05)); if (i < len) { const a = 0.05 + Math.random() * 0.18, s = Math.random() > 0.5 ? 1 : -1; d[i] += a * s; if (i + 1 < len) d[i + 1] -= a * 0.4 * s; } }
    let j = 0; while (j < len) { j += Math.floor(sr * (0.12 + Math.random() * 0.4)); if (j < len) { const a = 0.32 + Math.random() * 0.3, s = Math.random() > 0.5 ? 1 : -1; d[j] += a * s; if (j + 1 < len) d[j + 1] -= a * 0.5 * s; } }
    return buf;
  }
  startCrackle() {
    this.unlockAudio(); if (!this.aCtx || this.crackleNode || this.active) return;
    const src = this.aCtx.createBufferSource(); src.buffer = this._makeCrackleBuffer(); src.loop = true;
    const hp = this.aCtx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 600;
    const lp = this.aCtx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7000;
    const g = this.aCtx.createGain(); g.gain.value = 0.0001; g.gain.setTargetAtTime(this.muted ? 0 : this.masterVol * 0.32, this.aCtx.currentTime, 0.5);
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(this.aCtx.destination); src.start(); this.crackleNode = { src, g };
  }
  stopCrackle() { if (!this.crackleNode || !this.aCtx) return; const n = this.crackleNode; this.crackleNode = null; try { n.g.gain.setTargetAtTime(0, this.aCtx.currentTime, 0.15); setTimeout(() => { try { n.src.stop(); } catch (e) {} }, 350); } catch (e) {} }
  _applyCrackleGain() { if (this.crackleNode && this.aCtx) this.crackleNode.g.gain.setTargetAtTime(this.muted ? 0 : this.masterVol * 0.32, this.aCtx.currentTime, 0.1); }

  /* ---------- public commands ---------- */
  enter() {
    this.unlockAudio(); this.stopCrackle(); this._buildField();
    this.field.visible = true;
    if (this.orb) this.orb.visible = false;
    this.active = true; this.emit(true);
  }
  goHome() {
    this.active = false; this._stopAllAudio();
    // reset the camera back to the homepage view so the orb + title are in frame again
    this.travelYear = this.minYear; this.travelTarget = this.minYear;
    this.look = { x: 0, y: 0, tx: 0, ty: 0 };
    if (this.field) this.field.visible = false; // hide timeline records on the homepage
    if (this.orb) this.orb.visible = true;
    this.startCrackle(); this.lastFront = null; this.emit(true);
  }
  restart() { this.travelYear = this.minYear; this.snapTo(0); }
  snapTo(idx) {
    if (!this.snapOrder.length) return;
    const endIdx = this.snapOrder.length; // virtual end-card stop
    this.snapIndex = Math.max(0, Math.min(endIdx, idx));
    this.travelTarget = this.snapIndex === endIdx ? this.clamp(this.endYear) : this.clamp(this.snapOrder[this.snapIndex].snapYear);
  }
  step(dir) { const now = performance.now(); if (now - this.lastSnap < 180) return; this.lastSnap = now; this.snapTo(this.snapIndex + dir); }
  setMuted(b) { this.muted = b; this._applyCrackleGain(); if (b === false && !this.active) this.startCrackle(); }
  setVolume(v) { this.masterVol = v; this.muted = false; this._applyCrackleGain(); }
  setPaused(b) { this.paused = b; }
  setPanelOpen(b) { this.panelOpen = b; }
  getTicks() { return this.snapOrder.map((r) => ({ year: r.year, label: r.year >= 2024 ? "today" : String(r.year) })); }

  /* ---------- input ---------- */
  _bind() {
    this._onWheel = (e) => { if (!this.active || this.panelOpen) return; if (Math.abs(e.deltaY) < 2) return; this.step(e.deltaY > 0 ? 1 : -1); };
    addEventListener("wheel", this._onWheel, { passive: true });
    this._touchY = null; this._touchAcc = 0;
    this._onTS = (e) => { this._touchY = e.touches[0].clientY; this._touchAcc = 0; };
    this._onTM = (e) => { if (!this.active || this.panelOpen || this._touchY == null) return; this._touchAcc += this._touchY - e.touches[0].clientY; this._touchY = e.touches[0].clientY; if (Math.abs(this._touchAcc) > 46) { this.step(this._touchAcc > 0 ? 1 : -1); this._touchAcc = 0; } };
    addEventListener("touchstart", this._onTS, { passive: true }); addEventListener("touchmove", this._onTM, { passive: true });
    this._onKey = (e) => {
      if ((e.code === "ArrowDown" || e.code === "ArrowRight") && this.active && !this.panelOpen) { this.step(1); e.preventDefault(); }
      else if ((e.code === "ArrowUp" || e.code === "ArrowLeft") && this.active && !this.panelOpen) { this.step(-1); e.preventDefault(); }
    };
    addEventListener("keydown", this._onKey);
    const cv = this.renderer.domElement;
    this._drag = false; let px = 0, py = 0, moved = 0;
    this._onMD = (e) => { if (!this.active || this.panelOpen) return; this._drag = true; px = e.clientX; py = e.clientY; moved = 0; };
    this._onMU = (e) => { if (this._drag) { this._drag = false; if (moved < 6 && this.active && !this.panelOpen) this._pick(e.clientX, e.clientY); } };
    // track movement only to distinguish a click (open record) from a drag — no look rotation
    this._onMM = (e) => { if (this._drag) { moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py); px = e.clientX; py = e.clientY; } };
    cv.addEventListener("mousedown", this._onMD); addEventListener("mouseup", this._onMU); addEventListener("mousemove", this._onMM);
    this._onResize = () => { this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(innerWidth, innerHeight); this.composer.setSize(innerWidth, innerHeight); this.bloom.resolution.set(innerWidth, innerHeight); this._resizeTitle(); };
    addEventListener("resize", this._onResize);
    this._onFirst = () => { if (!this.active && !this.muted) this.startCrackle(); };
    ["pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, this._onFirst));
    this._onPM = (e) => { this._mx = e.clientX / innerWidth - 0.5; this._my = e.clientY / innerHeight - 0.5; };
    addEventListener("pointermove", this._onPM);
  }
  _pick(cx, cy) {
    const ndc = new THREE.Vector2((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    this.ray.setFromCamera(ndc, this.camera);
    const hit = this.ray.intersectObjects(this.pickMeshes, false);
    if (hit.length) this.onOpen(this._recInfo(hit[0].object.userData.rec));
  }
  _recInfo(r) { return { idx: r.idx, year: r.year, yearLabel: r.year >= 2024 ? `${NOW_YEAR} · now` : String(r.year), album: r.album, artist: r.artist, era: r.era, note: r.note, cover: r.realArt || r.coverURL, isPlaceholder: isPlaceholder(TRACKS[r.idx]), hasPreview: !!r.previewUrl }; }

  /* ---------- state bridge ---------- */
  current() { return this.lastFront ? this._recInfo(this.lastFront) : null; }
  emit(force) {
    const cur = this.current();
    const snap = {
      active: this.active,
      atEnd: !!this._atEnd && Math.abs(this.travelTarget - this.travelYear) < 1.2,
      showInfo: this._showInfo || false,
      playing: this.active && !!this._playing,
      key: cur ? cur.album + cur.year : "",
      snapIndex: this.snapIndex,
    };
    const L = this._last;
    if (force || snap.active !== L.active || snap.atEnd !== L.atEnd || snap.showInfo !== L.showInfo || snap.playing !== L.playing || snap.key !== L.key || snap.snapIndex !== L.snapIndex) {
      this._last = snap;
      this.onState({ active: snap.active, atEnd: snap.atEnd, showInfo: snap.showInfo, playing: snap.playing, current: cur, snapIndex: snap.snapIndex });
    }
  }

  _animate = () => {
    this._raf = requestAnimationFrame(this._animate);
    const t = this.clock.getElapsedTime();
    this.travelYear += (this.travelTarget - this.travelYear) * 0.1;
    const camZ = this.yearToZ(this.travelYear) + 8;
    this.camera.position.set(0, 0, camZ);
    this.key.position.set(0, 0, camZ + 2);
    this.look.x += (this.look.tx - this.look.x) * 0.08; this.look.y += (this.look.ty - this.look.y) * 0.08;
    this.camera.rotation.order = "YXZ"; this.camera.rotation.y = -this.look.x; this.camera.rotation.x = -this.look.y;

    const bpm = 140, beats = t * bpm / 60, ph = beats - Math.floor(beats);
    const tgt = this.audioLevel > 0.02 ? Math.pow(1 - ph, 2.0) * Math.min(1, this.audioLevel * 1.5) : 0;
    this.pulse += (tgt - this.pulse) * 0.3;

    // the current record sits FOCUS units ahead (centered + visible); records fade in approaching
    // focus and fade out before the camera passes through them — so you always see the one you land on.
    const F = this.FOCUS;
    for (const r of this.records) {
      const focusDist = Math.abs(r.group.position.z - (camZ - F));
      const sc = focusDist < 9 ? 1 + (9 - focusDist) * 0.04 : 1;
      r.group.scale.setScalar(THREE.MathUtils.lerp(r.group.scale.x, sc, 0.14));
      const fd = camZ - r.group.position.z; // how far ahead (>0 ahead of camera)
      const op = smoothstep(2, 5, fd) * (1 - smoothstep(16, 30, fd));
      r.curOp += (op - r.curOp) * 0.12;
      for (const m of r.mats) m.opacity = r.curOp;
    }
    // the displayed record + title are driven by the snap index, so the title always matches what you scrolled to
    const cur = (this.snapIndex >= 0 && this.snapIndex < this.snapOrder.length) ? this.snapOrder[this.snapIndex] : null;
    this.lastFront = cur;
    this._showInfo = this.active && !!cur;
    this._atEnd = this.active && this.snapIndex === this.snapOrder.length;

    if (this.title) {
      if (this.active) {
        // never show the bulge title in the timeline
        this.titleMat.uniforms.uOpacity.value = 0;
        this.title.visible = false;
      } else {
        const vH = 2 * Math.abs(this._titleZ) * Math.tan(((62 * Math.PI) / 180) / 2);
        const u = this.titleMat.uniforms;
        u.uMouse.value.set(this._mx + 0.5, 0.5 + (-this._my * vH) / this._planeH);
        u.uStrength.value += (0.42 - u.uStrength.value) * 0.08;
        u.uOpacity.value += (1 - u.uOpacity.value) * 0.1;
        this.title.visible = true;
      }
    }
    if (this.orb && !this.active) {
      // slow drift + gentle cursor parallax (Getty "Tracing Art" feel)
      this.parX += ((this._mx || 0) - this.parX) * 0.04;
      this.parY += ((this._my || 0) - this.parY) * 0.04;
      this.orb.position.x = Math.sin(t * 0.08) * 2.2 - this.parX * 4;
      this.orb.position.y = Math.cos(t * 0.062) * 1.5 + this.parY * 3;
      this.orb.rotation.z = Math.sin(t * 0.05) * 0.015;
      for (const it of this.orbItems) it.m.position.y = it.baseY + Math.sin(t * 0.5 + it.bob) * it.amp;
    }
    this.bloom.strength = this.BLOOM_BASE + this.pulse * 0.25;
    this._updateAudio(camZ);
    this.emit(false);
    this.composer.render();
  };

  dispose() {
    cancelAnimationFrame(this._raf);
    removeEventListener("wheel", this._onWheel); removeEventListener("touchstart", this._onTS); removeEventListener("touchmove", this._onTM);
    removeEventListener("keydown", this._onKey); removeEventListener("mouseup", this._onMU); removeEventListener("mousemove", this._onMM);
    removeEventListener("resize", this._onResize);
    ["pointerdown", "keydown", "touchstart"].forEach((ev) => removeEventListener(ev, this._onFirst));
    removeEventListener("pointermove", this._onPM);
    this._stopAllAudio(); this.stopCrackle();
    this.renderer.dispose();
  }
}
