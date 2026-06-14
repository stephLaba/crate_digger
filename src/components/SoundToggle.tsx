import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

// Global music on/off — visible on every page.
export function SoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title="Music on / off"
      className={cn(
        "fixed right-6 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/[0.04] backdrop-blur transition-all hover:bg-white/[0.1]",
        muted ? "text-foreground/40" : "text-foreground/85"
      )}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
