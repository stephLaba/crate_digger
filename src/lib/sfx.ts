// Synthesized piccolo-snare hit for UI clicks — bright, tight, snappy. Respects the global mute.
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
    const out = ctx.createGain();
    out.gain.value = 0.5;
    out.connect(ctx.destination);

    // shell/body — two short, high tonal partials with a quick pitch drop (tight piccolo tuning)
    [330, 185].forEach((f, i) => {
      const o = ctx!.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.07);
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(i ? 0.14 : 0.22, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + 0.14);
    });

    // snare wires — bright filtered noise burst with a fast decay (the crisp "crack")
    const len = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.4);
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1900;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 4200; bp.Q.value = 0.7;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.4, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
    noise.connect(hp); hp.connect(bp); bp.connect(ng); ng.connect(out);
    noise.start(t);
  } catch {
    /* no-op */
  }
}
