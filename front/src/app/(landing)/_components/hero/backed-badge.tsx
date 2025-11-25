"use client";

import { motion } from "framer-motion";

export function BackedBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-surface/30 px-4 py-2 backdrop-blur-sm">
        <div className="flex size-5 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
          B
        </div>
        <span className="text-sm text-text-secondary">
          Backed by{" "}
          <span className="font-semibold text-foreground">Borderless</span>
        </span>
      </div>
    </motion.div>
  );
}
