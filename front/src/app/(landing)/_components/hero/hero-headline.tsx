"use client";

import { motion } from "framer-motion";

export function HeroHeadline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl text-foreground"
    >
      Catch bugs, not feelings.
    </motion.h1>
  );
}
