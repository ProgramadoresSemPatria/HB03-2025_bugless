"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

const INSTALL_COMMAND = "npm install -g bugless";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = INSTALL_COMMAND;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mx-auto max-w-md"
    >
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2">
        <div className="flex flex-1 items-center gap-3 px-4 py-2">
          <span className="text-text-muted">$</span>
          <code className="font-mono text-sm text-foreground sm:text-base">
            {INSTALL_COMMAND}
          </code>
        </div>

        <motion.button
          onClick={copyToClipboard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium
            transition-colors whitespace-nowrap
            ${
              copied
                ? "bg-success/20 text-success"
                : "bg-primary text-primary-foreground hover:bg-primary-hover"
            }
          `}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Check weight="bold" className="size-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Copy weight="bold" className="size-4" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

    </motion.div>
  );
}
