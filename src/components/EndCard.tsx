import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Home } from "lucide-react";
import { Button } from "./ui/button";

export function EndCard({ show, onRestart, onHome }: { show: boolean; onRestart: () => void; onHome: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="end"
          className="fixed bottom-[13%] left-1/2 z-20 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="text-[13px] uppercase tracking-[0.3em] text-foreground/55">You've reached today</div>
          <div className="mt-1.5 text-[13px] text-muted">1968 → now — the whole story of heavy metal.</div>
          <div className="mt-5 flex justify-center gap-3">
            <Button size="sm" onClick={onRestart}><RotateCcw size={14} /> Restart</Button>
            <Button size="sm" variant="outline" onClick={onHome}><Home size={14} /> Back home</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
