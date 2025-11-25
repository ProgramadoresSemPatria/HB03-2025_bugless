"use client";

import { motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-2 text-text-muted"
      >
        <span className="text-sm">See how it works</span>
        <CaretDown weight="bold" className="size-5" />
      </motion.div>
    </motion.div>
  );
}
