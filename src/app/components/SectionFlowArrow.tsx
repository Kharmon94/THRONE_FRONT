import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";

/** Centered gold/glass down-arrow cue between public landing sections. */
export function SectionFlowArrow() {
  const reduce = useReduceAnimations();

  return (
    <div
      className="flex justify-center pt-0 pb-2 md:pb-2"
      aria-hidden="true"
    >
      <motion.div
        className="flex flex-col items-center gap-0.5"
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.28)",
            boxShadow: "0 0 18px rgba(212,175,55,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronDown size={18} style={{ color: "#D4AF37" }} strokeWidth={2.25} />
        </div>
      </motion.div>
    </div>
  );
}
