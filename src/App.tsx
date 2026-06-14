import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CrateDiggerEngine } from "./engine";
import { Logo } from "./components/Logo";
import { Landing } from "./components/Landing";
import { SoundToggle } from "./components/SoundToggle";
import { Timeline } from "./components/Timeline";
import { NowInfo, type RecInfo } from "./components/NowInfo";
import { DetailPanel } from "./components/DetailPanel";
import { EndCard } from "./components/EndCard";
import { AudioControls } from "./components/AudioControls";

type EngineState = { active: boolean; atEnd: boolean; showInfo: boolean; current: RecInfo | null; snapIndex: number };

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CrateDiggerEngine | null>(null);
  const [state, setState] = useState<EngineState>({ active: false, atEnd: false, showInfo: false, current: null, snapIndex: 0 });
  const [ticks, setTicks] = useState<{ year: number; label: string }[]>([]);
  const [detail, setDetail] = useState<RecInfo | null>(null);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(65);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const eng = new CrateDiggerEngine(canvasRef.current!, {
      onState: (s: EngineState) => setState(s),
      onOpen: (rec: RecInfo) => { eng.setPanelOpen(true); setDetail(rec); },
    });
    engineRef.current = eng;
    return () => eng.dispose();
  }, []);

  const fadeThen = useCallback((fn: () => void) => {
    setFading(true);
    setTimeout(() => { fn(); setTimeout(() => setFading(false), 80); }, 430);
  }, []);

  const enter = () => { engineRef.current?.unlockAudio(); fadeThen(() => { engineRef.current?.enter(); setTicks(engineRef.current?.getTicks() ?? []); }); };
  const closeDetail = () => { setDetail(null); engineRef.current?.setPanelOpen(false); };
  const goHome = () => fadeThen(() => { closeDetail(); engineRef.current?.goHome(); });
  const restart = () => fadeThen(() => engineRef.current?.restart());
  const openDetail = () => { if (state.current) { engineRef.current?.setPanelOpen(true); setDetail(state.current); } };

  const toggleMute = () => setMuted((m) => { const v = !m; engineRef.current?.setMuted(v); return v; });
  const togglePlay = () => setPaused((p) => { const v = !p; engineRef.current?.setPaused(v); return v; });
  const onVolume = (v: number) => { setVolume(v); setMuted(false); engineRef.current?.setVolume(v / 100); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Escape") { if (detail) closeDetail(); else if (state.active) goHome(); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [detail, state.active]);

  return (
    <>
      <div className="grid-bg fixed inset-0 z-0" />
      <canvas ref={canvasRef} className="fixed inset-0 z-[1]" />
      <div className="vignette pointer-events-none fixed inset-0 z-[5]" />

      <SoundToggle muted={muted} onToggle={toggleMute} />

      <AnimatePresence>{!state.active && <Landing key="landing" onEnter={enter} />}</AnimatePresence>

      {state.active && (
        <>
          <div className="fixed left-8 top-6 z-10 flex items-center gap-3">
            <Logo width={38} />
            <span className="text-[12px] uppercase tracking-[0.18em] text-foreground/55">
              <b className="font-semibold text-foreground">Crate Digger</b> · Heavy Metal
            </span>
            <button onClick={goHome} className="ml-2 rounded-full border border-border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground">
              ↩ home
            </button>
          </div>

          <AudioControls paused={paused} volume={volume} onTogglePlay={togglePlay} onVolume={onVolume} />
          <NowInfo current={state.current} show={state.showInfo} onOpen={openDetail} />
          <Timeline ticks={ticks} activeIndex={state.snapIndex} onSelect={(i) => engineRef.current?.snapTo(i)} />
          <EndCard show={state.atEnd} onRestart={restart} onHome={goHome} />

          <div className="pointer-events-none fixed bottom-6 left-8 z-10 text-[12px] leading-relaxed text-muted">
            scroll / arrows — next record · drag — look · space — auto
          </div>
        </>
      )}

      <AnimatePresence>{detail && <DetailPanel key="detail" rec={detail} onClose={closeDetail} />}</AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[200] bg-background"
        animate={{ opacity: fading ? 1 : 0 }}
        transition={{ duration: 0.42 }}
        style={{ pointerEvents: fading ? "auto" : "none" }}
      />
    </>
  );
}
