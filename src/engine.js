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
  [1968, "Vincebus Eruptum", "Blue Cheer", "Often called the first true heavy metal recording.", "Proto-metal"],
  [1969, "Led Zeppelin", "Led Zeppelin", "Distorted riffs and wailing vocals set the template.", "Proto-metal"],
  [1970, "Black Sabbath", "Black Sabbath", "Widely accepted as the first heavy metal album.", "The birth · 1970"],
  [1970, "Paranoid", "Black Sabbath", "Dark themes and monster riffs define metal's identity.", "The birth · 1970"],
  [1972, "Machine Head", "Deep Purple", "“Smoke on the Water” — the third pillar of early metal.", "The birth · 1970"],
  [1976, "Sad Wings of Destiny", "Judas Priest", "Twin guitars shed the blues and forge metal proper.", "Forging the sound"],
  [1980, "Ace of Spades", "Motörhead", "Punk speed meets metal — NWOBHM's battering ram.", "NWOBHM"],
  [1980, "British Steel", "Judas Priest", "Leaner, faster, anthemic.", "NWOBHM"],
  [1982, "The Number of the Beast", "Iron Maiden", "Galloping dual guitars conquer the world.", "NWOBHM"],
  [1983, "Metal Health", "Quiet Riot", "First glam-metal album to top the US charts.", "Glam metal"],
  [1983, "Shout at the Devil", "Mötley Crüe", "Sunset Strip glam and theatrical excess.", "Glam metal"],
  [1984, "Rising Force", "Yngwie Malmsteen", "Neoclassical shred redefines the guitar.", "Neoclassical"],
  [1983, "Kill 'Em All", "Metallica", "Thrash is born — speed and aggression.", "Thrash"],
  [1986, "Master of Puppets", "Metallica", "Thrash's towering, complex peak.", "Thrash"],
  [1986, "Reign in Blood", "Slayer", "Twenty-nine minutes of pure extremity.", "Thrash"],
  [1986, "Peace Sells... but Who's Buying?", "Megadeth", "Technical, political thrash.", "Thrash"],
  [1989, "Altars of Madness", "Morbid Angel", "The blueprint for death metal.", "Death metal"],
  [1990, "Cowboys from Hell", "Pantera", "Thrash tightened into pure groove.", "Groove metal"],
  [1991, "The Black Album", "Metallica", "Metal conquers the mainstream.", "Metal goes global"],
  [1994, "De Mysteriis Dom Sathanas", "Mayhem", "Norwegian black metal's defining, infamous record.", "Black metal"],
  [1994, "Korn", "Korn", "Detuned, hip-hop-inflected — nu metal begins.", "Nu metal"],
  [2000, "Hybrid Theory", "Linkin Park", "Nu metal at its commercial summit.", "Nu metal"],
  [2004, "The End of Heartache", "Killswitch Engage", "Metalcore breaks through.", "Metalcore"],
  [2009, "Animals as Leaders", "Animals as Leaders", "Djent — polyrhythmic and futuristic.", "Djent & beyond"],
  [2024, "Today", "The next wave", "Blackgaze, deathcore, endless evolution.", "Today"],
];
const HUE = 0;

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
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
  return { tex, url: cv.toDataURL("image/jpeg", 0.8) };
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
    this.minYear = 1968; this.maxYear = NOW_YEAR; this.SPACING = 9.5;
    this.travelYear = this.minYear; this.travelTarget = this.minYear;
    this.records = []; this.snapOrder = []; this.snapIndex = 0; this.lastSnap = 0; this.lastFront = null;
    this.look = { x: 0, y: 0, tx: 0, ty: 0 };
    this._last = {};
    this.aCtx = null; this.crackleNode = null; this.audioLevel = 0; this.pulse = 0;
    this.orbItems = [];

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

    this._buildOrb(); this._fetchOrbArt();

    this.ray = new THREE.Raycaster();
    this._bind();
    this.clock = new THREE.Clock();
    this._raf = requestAnimationFrame(this._animate);
    this.emit(true);
  }

  yearToZ(y) { return -(y - this.minYear) * this.SPACING - 8; }
  clamp(v) { return Math.max(this.minYear, Math.min(this.maxYear, v)); }

  /* ---------- orb (homepage) ---------- */
  _buildOrb() {
    this.orb = new THREE.Group();
    const tracks = TRACKS.filter((t) => t[1] !== "Today");
    const N = tracks.length, R = 8.2, geo = new THREE.PlaneGeometry(2.4, 2.4);
    tracks.forEach((t, i) => {
      const { tex } = makeCover(t[1], t[2], t[0], HUE, hash(t[1] + t[2]) + i + 1);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      const m = new THREE.Mesh(geo, mat);
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), phi = i * 2.399963;
      m.position.set(Math.cos(phi) * r * R, y * R, Math.sin(phi) * r * R); m.lookAt(0, 0, 0);
      this.orb.add(m); this.orbItems.push({ mat, track: t });
    });
    this.orb.position.set(0, 0, -20); this.scene.add(this.orb);
  }
  _fetchOrbArt() {
    this.orbItems.forEach((it) => {
      const t = it.track, term = encodeURIComponent(t[2] + " " + t[1].replace(/[’']/g, ""));
      jsonp("https://itunes.apple.com/search?term=" + term + "&entity=album&limit=3")
        .then((d) => {
          const r = (d && d.results) || [], hit = r.find((x) => x.artworkUrl100) || r[0];
          if (!hit || !hit.artworkUrl100) return;
          const art = hit.artworkUrl100.replace("100x100", "400x400");
          this.texLoader.load(art, (tex) => { tex.colorSpace = THREE.SRGBColorSpace; it.mat.map?.dispose?.(); it.mat.map = tex; it.mat.needsUpdate = true; }, undefined, () => {});
        }).catch(() => {});
    });
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
      const { tex, url } = makeCover(album, artist, year, HUE, hash(album + artist) + i + 1);
      const group = new THREE.Group();
      const cover = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.1 });
      const side = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.8 });
      const sleeve = new THREE.Mesh(this.sleeveGeo, [side, side, side, side, cover, side]); group.add(sleeve);
      const k = perYear[year] = perYear[year] || 0; perYear[year]++;
      const sgn = i % 2 === 0 ? -1 : 1;
      const x = sgn * (6.6 + k * 3.0), y = Math.sin(i * 0.7) * 1.2, z = this.yearToZ(year) - k * 6.5;
      group.position.set(x, y, z); group.lookAt(x, y, z + 10); group.rotation.y += -sgn * 0.22;
      this.field.add(group);
      const rec = { group, year, album, artist, note, era, idx: i, snapYear: this.minYear - (z + 3) / this.SPACING, coverMat: cover, coverURL: url, realArt: null, previewUrl: null, audio: null, curVol: 0 };
      this.records.push(rec); sleeve.userData.rec = rec; this.pickMeshes.push(sleeve);
    });
    this.snapOrder = this.records.slice().sort((a, b) => b.group.position.z - a.group.position.z);
    this.maxYear = Math.max(NOW_YEAR, this.snapOrder[this.snapOrder.length - 1].snapYear);
    this.snapIndex = 0; this.travelYear = this.minYear; this.travelTarget = this.snapOrder[0].snapYear;
    this.lastFront = null;
    this._fetchMedia();
  }
  _fetchMedia() {
    this.records.forEach((rec, i) => {
      if (isPlaceholder(TRACKS[i])) return;
      const term = encodeURIComponent(rec.artist + " " + rec.album.replace(/[’']/g, ""));
      jsonp("https://itunes.apple.com/search?term=" + term + "&entity=song&limit=6")
        .then((d) => {
          if (!this.active) return;
          const res = (d && d.results) || [], hit = res.find((x) => x.previewUrl) || res[0];
          if (!hit) return;
          if (hit.previewUrl) rec.previewUrl = hit.previewUrl;
          const art = (hit.artworkUrl100 || "").replace("100x100", "600x600");
          if (art && rec.coverMat) this.texLoader.load(art, (tex) => { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; rec.coverMat.map?.dispose?.(); rec.coverMat.map = tex; rec.coverMat.needsUpdate = true; rec.realArt = art; }, undefined, () => {});
        }).catch(() => {});
    });
  }

  /* ---------- audio ---------- */
  unlockAudio() { if (!this.aCtx) { try { this.aCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.aCtx && this.aCtx.state === "suspended") this.aCtx.resume(); }
  _createAudio(rec) { if (!rec.previewUrl) return; const a = new Audio(); a.src = rec.previewUrl; a.loop = true; a.preload = "auto"; a.volume = 0; rec.audio = a; rec.curVol = 0; if (!this.paused) a.play().catch(() => {}); }
  _stopAllAudio() { for (const r of this.records) { if (r.audio) { try { r.audio.pause(); } catch (e) {} r.audio.src = ""; r.audio = null; r.curVol = 0; } } }
  _updateAudio(camZ) {
    const live = this.active && !this.panelOpen && !this.paused;
    let best = Infinity, near = null;
    for (const r of this.records) { const d = Math.abs(r.group.position.z - (camZ - 3)); if (d < best) { best = d; near = r; } }
    const target = live && near && near.previewUrl && best < 14 ? near : null;
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
  enter() { this.unlockAudio(); this.stopCrackle(); this._buildField(); if (this.orb) this.orb.visible = false; this.active = true; this.emit(true); }
  goHome() { this.active = false; this._stopAllAudio(); if (this.orb) this.orb.visible = true; this.startCrackle(); this.lastFront = null; this.emit(true); }
  restart() { this.travelYear = this.minYear; this.snapTo(0); }
  snapTo(idx) { if (!this.snapOrder.length) return; this.snapIndex = Math.max(0, Math.min(this.snapOrder.length - 1, idx)); this.travelTarget = this.clamp(this.snapOrder[this.snapIndex].snapYear); }
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
      if (e.code === "Space" && this.active && !this.panelOpen) { this.paused = !this.paused; e.preventDefault(); }
      else if ((e.code === "ArrowDown" || e.code === "ArrowRight") && this.active && !this.panelOpen) { this.step(1); e.preventDefault(); }
      else if ((e.code === "ArrowUp" || e.code === "ArrowLeft") && this.active && !this.panelOpen) { this.step(-1); e.preventDefault(); }
    };
    addEventListener("keydown", this._onKey);
    const cv = this.renderer.domElement;
    this._drag = false; let px = 0, py = 0, moved = 0;
    this._onMD = (e) => { if (!this.active || this.panelOpen) return; this._drag = true; px = e.clientX; py = e.clientY; moved = 0; };
    this._onMU = (e) => { if (this._drag) { this._drag = false; if (moved < 6 && this.active && !this.panelOpen) this._pick(e.clientX, e.clientY); } };
    this._onMM = (e) => { if (this._drag) { moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py); this.look.tx += (e.clientX - px) * 0.0016; this.look.ty = Math.max(-0.5, Math.min(0.5, this.look.ty + (e.clientY - py) * 0.0016)); px = e.clientX; py = e.clientY; } };
    cv.addEventListener("mousedown", this._onMD); addEventListener("mouseup", this._onMU); addEventListener("mousemove", this._onMM);
    this._onResize = () => { this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(innerWidth, innerHeight); this.composer.setSize(innerWidth, innerHeight); this.bloom.resolution.set(innerWidth, innerHeight); };
    addEventListener("resize", this._onResize);
    this._onFirst = () => { if (!this.active && !this.muted) this.startCrackle(); };
    ["pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, this._onFirst));
  }
  _pick(cx, cy) {
    const ndc = new THREE.Vector2((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    this.ray.setFromCamera(ndc, this.camera);
    const hit = this.ray.intersectObjects(this.pickMeshes, false);
    if (hit.length) this.onOpen(this._recInfo(hit[0].object.userData.rec));
  }
  _recInfo(r) { return { idx: r.idx, year: r.year, yearLabel: r.year >= 2024 ? `${NOW_YEAR} · now` : String(r.year), album: r.album, artist: r.artist, era: r.era, note: r.note, cover: r.realArt || r.coverURL, isPlaceholder: isPlaceholder(TRACKS[r.idx]) }; }

  /* ---------- state bridge ---------- */
  current() { return this.lastFront ? this._recInfo(this.lastFront) : null; }
  emit(force) {
    const cur = this.current();
    const snap = {
      active: this.active,
      atEnd: this.active && (this.travelYear - this.minYear) / (this.maxYear - this.minYear) > 0.985,
      showInfo: this._showInfo || false,
      key: cur ? cur.album + cur.year : "",
      snapIndex: this.snapIndex,
    };
    const L = this._last;
    if (force || snap.active !== L.active || snap.atEnd !== L.atEnd || snap.showInfo !== L.showInfo || snap.key !== L.key || snap.snapIndex !== L.snapIndex) {
      this._last = snap;
      this.onState({ active: snap.active, atEnd: snap.atEnd, showInfo: snap.showInfo, current: cur, snapIndex: snap.snapIndex });
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

    let best = Infinity, front = null;
    for (const r of this.records) { const dist = Math.abs(r.group.position.z - (camZ - 3)); const sc = dist < 6 ? 1 + (6 - dist) * 0.03 : 1; r.group.scale.setScalar(THREE.MathUtils.lerp(r.group.scale.x, sc, 0.12)); if (dist < best) { best = dist; front = r; } }

    if (front !== this.lastFront) this.lastFront = front;
    this._showInfo = this.active && front && best < 11;

    if (this.orb && !this.active) { this.orb.rotation.y = t * 0.12; this.orb.rotation.x = Math.sin(t * 0.18) * 0.15; }
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
    this._stopAllAudio(); this.stopCrackle();
    this.renderer.dispose();
  }
}
