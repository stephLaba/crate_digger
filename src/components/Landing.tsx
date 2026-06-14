import { motion } from "framer-motion";
import { Button } from "./ui/button";

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-[6vw] text-center"
      style={{ background: "radial-gradient(75% 75% at 50% 50%, rgba(13,13,12,0.12) 0%, rgba(13,13,12,0.62) 74%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <span className="text-[13px] uppercase tracking-[0.34em] text-foreground">Heavy Metal</span>
        <span className="my-6 block h-[70px] w-0.5 bg-foreground/60" />
      </motion.div>

      {/* the bulge title (WebGL, cursor-reactive) renders behind, in this reserved space */}
      <div aria-hidden style={{ height: "clamp(120px, 26vh, 260px)" }} />

      <motion.p
        className="max-w-[560px] text-[13px] uppercase leading-[1.7] tracking-[0.03em] text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        Dig through the records that forged the heaviest sound on earth — from Blue Cheer in 1968 to today.
        Scroll through time, hear each era, and open any record.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
        <Button className="mt-11" onClick={onEnter}>
          Enter the timeline
        </Button>
      </motion.div>
    </motion.div>
  );
}
