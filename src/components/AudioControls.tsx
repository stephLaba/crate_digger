import { Pause, Play } from "lucide-react";
import { Slider } from "./ui/slider";

// Play/pause + volume, tucked top-right (left of the global sound toggle).
export function AudioControls({
  paused,
  volume,
  onTogglePlay,
  onVolume,
}: {
  paused: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolume: (v: number) => void;
}) {
  return (
    <div className="fixed right-[80px] top-5 z-[60] flex items-center gap-3 rounded-full border border-border bg-white/[0.04] px-3 py-1.5 opacity-60 backdrop-blur transition-opacity hover:opacity-100">
      <button onClick={onTogglePlay} className="text-foreground/85" title="Play / pause">
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
      <Slider className="w-16" value={[volume]} min={0} max={100} step={1} onValueChange={(v) => onVolume(v[0])} />
    </div>
  );
}
