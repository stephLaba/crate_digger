import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

export function EndCard({ show, onRestart, onHome }: { show: boolean; onRestart: () => void; onHome: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="end"
          className="fixed left-1/2 top-1/2 z-20 w-[min(90vw,580px)] text-center text-[#e8e6e0]"
          initial={{ opacity: 0, x: "-50%", y: "-44%", filter: "blur(10px)" }}
          animate={{ opacity: 1, x: "-50%", y: "-50%", filter: "blur(0px)" }}
          exit={{ opacity: 0, x: "-50%", y: "-50%", filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--accent))" }}>1968 → Now</div>
          <h2 className="mt-3 font-display uppercase leading-none" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
            You've reached today
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-xs uppercase leading-relaxed tracking-wider text-white/60">
            The whole story of heavy metal — from Sabbath to djent.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="sm" onClick={onRestart}><RotateCcw size={14} /> Restart</Button>
            <Button size="sm" variant="outline" onClick={onHome}><Home size={14} /> Back home</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
