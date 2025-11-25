"use client";

import { motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  index: number;
  isInView: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular,
  index,
  isInView,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-8",
        popular
          ? "border-primary bg-surface shadow-[0_0_40px_rgba(255,107,53,0.15)]"
          : "border-border bg-surface"
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {period && <span className="text-text-muted">/{period}</span>}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check weight="bold" className="mt-0.5 size-5 shrink-0 text-primary" />
            <span className="text-sm text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "w-full rounded-lg py-3 font-medium transition-colors",
          popular
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "border border-border bg-transparent text-foreground hover:bg-surface-hover"
        )}
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}
