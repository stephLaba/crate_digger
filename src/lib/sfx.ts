// Tiny synthesized UI click — a short blip + filtered tick. Respects the global mute.
let ctx: AudioContext | null = null;
let muted = false;

export function setSfxMuted(m: boolean) {
  muted = m;
}

export function playClick() {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;

    // pitch blip
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.setValueAtTime(440, t);
    o.frequency.exponentialRampToValueAtTime(190, t + 0.045);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.1);

    // high tick
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2200;
    const ng = ctx.createGain(); ng.gain.value = 0.07;
    s.connect(hp); hp.connect(ng); ng.connect(ctx.destination);
    s.start(t);
  } catch {
    /* no-op */
  }
}
