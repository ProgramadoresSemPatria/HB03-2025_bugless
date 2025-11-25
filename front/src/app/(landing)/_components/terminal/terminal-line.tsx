"use client";

import { motion } from "framer-motion";

type LineType =
  | "command"
  | "prompt"
  | "option"
  | "scanning"
  | "critical"
  | "warning"
  | "description"
  | "fix"
  | "divider"
  | "summary"
  | "actions"
  | "output";

interface TerminalLineProps {
  type: LineType;
  content: string;
}

const styles: Record<LineType, string> = {
  command: "text-text-muted",
  prompt: "text-foreground",
  option: "text-text-secondary",
  scanning: "text-primary",
  critical: "text-error",
  warning: "text-warning",
  description: "text-text-secondary",
  fix: "text-primary-light",
  divider: "text-border",
  summary: "text-foreground font-medium",
  actions: "text-text-muted",
  output: "",
};

export function TerminalLine({ type, content }: TerminalLineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`${styles[type]} leading-relaxed whitespace-pre`}
    >
      {content || "\u00A0"}
    </motion.div>
  );
}
