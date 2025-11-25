"use client";

import { useInView, type UseInViewOptions } from "framer-motion";
import { useRef } from "react";

interface UseSectionRevealOptions {
  once?: boolean;
  amount?: number;
  margin?: UseInViewOptions["margin"];
}

export function useSectionReveal(options: UseSectionRevealOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    amount: options.amount ?? 0.3,
    margin: options.margin,
  });

  return { ref, isInView };
}
