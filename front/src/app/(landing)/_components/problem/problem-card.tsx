"use client";

import { motion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";

interface ProblemCardProps {
  icon: Icon;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
}

export function ProblemCard({
  icon: IconComponent,
  title,
  description,
  index,
  isInView,
}: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -4, borderColor: "var(--primary)" }}
      className="
        p-8 bg-surface border rounded-xl
        transition-colors duration-300
      "
    >
      <IconComponent size={48} weight="duotone" className="mb-4 text-primary" />
      <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="leading-relaxed text-text-secondary">{description}</p>
    </motion.div>
  );
}
