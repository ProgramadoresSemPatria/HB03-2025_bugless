"use client";

import { motion } from "framer-motion";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: Icon;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
  className?: string;
}

export function FeatureCard({
  icon: IconComponent,
  title,
  description,
  index,
  isInView,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.21, 1.02, 0.73, 1],
      }}
      className={cn(
        "group flex flex-col rounded-2xl p-6",
        "bg-surface border border-border/50",
        "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      <IconComponent
        size={36}
        weight="duotone"
        className="mb-4 text-primary"
      />
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </motion.div>
  );
}
