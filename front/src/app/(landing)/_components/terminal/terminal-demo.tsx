"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

type Phase =
  | "typing-command"
  | "show-prompt"
  | "show-options"
  | "navigating-options"
  | "selected-option"
  | "scanning"
  | "show-results"
  | "show-actions"
  | "typing-action"
  | "applying-fixes"
  | "done";

const reviewOptions = [
  "1. Review against a base branch (PR style)",
  "2. Review uncommitted changes",
  "3. Review a commit",
  "4. Custom review instructions",
];

const TYPING_SPEED = 50;
const PHASE_DELAY = 500;
const NAV_SPEED = 250;
const LOOP_DELAY = 4000;

interface TerminalDemoProps {
  isInView?: boolean;
}

export function TerminalDemo({ isInView = true }: TerminalDemoProps) {
  const [phase, setPhase] = useState<Phase>("typing-command");
  const [hasStarted, setHasStarted] = useState(false);
  const [typedCommand, setTypedCommand] = useState("");
  const [selectedOption, setSelectedOption] = useState(-1);
  const [scanProgress, setScanProgress] = useState(0);
  const [typedAction, setTypedAction] = useState("");
  const [fixProgress, setFixProgress] = useState(0);

  const command = "bugless";
  const targetOption = 1; // Will select option 2 (index 1)

  const reset = useCallback(() => {
    setPhase("typing-command");
    setTypedCommand("");
    setSelectedOption(-1);
    setScanProgress(0);
    setTypedAction("");
    setFixProgress(0);
  }, []);

  // Start animation only when in view for the first time
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  // Typing effect for command
  useEffect(() => {
    if (!hasStarted) return;
    if (phase !== "typing-command") return;

    if (typedCommand.length < command.length) {
      const timer = setTimeout(() => {
        setTypedCommand(command.slice(0, typedCommand.length + 1));
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("show-prompt"), PHASE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [phase, typedCommand, hasStarted]);

  // Phase transitions
  useEffect(() => {
    if (!hasStarted) return;
    if (phase === "show-prompt") {
      const timer = setTimeout(() => setPhase("show-options"), PHASE_DELAY);
      return () => clearTimeout(timer);
    }
    if (phase === "show-options") {
      const timer = setTimeout(() => {
        setSelectedOption(0);
        setPhase("navigating-options");
      }, PHASE_DELAY);
      return () => clearTimeout(timer);
    }
    if (phase === "selected-option") {
      const timer = setTimeout(() => setPhase("scanning"), PHASE_DELAY);
      return () => clearTimeout(timer);
    }
    if (phase === "show-results") {
      const timer = setTimeout(() => setPhase("show-actions"), 800);
      return () => clearTimeout(timer);
    }
    if (phase === "show-actions") {
      const timer = setTimeout(() => setPhase("typing-action"), 600);
      return () => clearTimeout(timer);
    }
    if (phase === "done") {
      const timer = setTimeout(reset, LOOP_DELAY);
      return () => clearTimeout(timer);
    }
  }, [phase, reset, hasStarted]);

  // Navigation through options
  useEffect(() => {
    if (!hasStarted) return;
    if (phase !== "navigating-options") return;

    if (selectedOption < targetOption) {
      const timer = setTimeout(() => {
        setSelectedOption((prev) => prev + 1);
      }, NAV_SPEED);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("selected-option"), PHASE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [phase, selectedOption, hasStarted]);

  // Scanning animation
  useEffect(() => {
    if (!hasStarted) return;
    if (phase !== "scanning") return;

    if (scanProgress < 3) {
      const timer = setTimeout(() => {
        setScanProgress((p) => p + 1);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("show-results"), 400);
      return () => clearTimeout(timer);
    }
  }, [phase, scanProgress, hasStarted]);

  // Typing action "a"
  useEffect(() => {
    if (!hasStarted) return;
    if (phase !== "typing-action") return;

    if (typedAction.length < 1) {
      const timer = setTimeout(() => {
        setTypedAction("a");
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("applying-fixes"), 400);
      return () => clearTimeout(timer);
    }
  }, [phase, typedAction, hasStarted]);

  // Applying fixes animation
  useEffect(() => {
    if (!hasStarted) return;
    if (phase !== "applying-fixes") return;

    if (fixProgress < 2) {
      const timer = setTimeout(() => {
        setFixProgress((p) => p + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("done"), 600);
      return () => clearTimeout(timer);
    }
  }, [phase, fixProgress, hasStarted]);

  // Visibility helpers
  const showPrompt = !["typing-command"].includes(phase);
  const showOptions = [
    "show-options",
    "navigating-options",
    "selected-option",
  ].includes(phase);
  const showScanning = [
    "scanning",
    "show-results",
    "show-actions",
    "typing-action",
    "applying-fixes",
    "done",
  ].includes(phase);
  const showResults = [
    "show-results",
    "show-actions",
    "typing-action",
    "applying-fixes",
    "done",
  ].includes(phase);
  const showActions = [
    "show-actions",
    "typing-action",
    "applying-fixes",
    "done",
  ].includes(phase);
  const showApplying = ["applying-fixes", "done"].includes(phase);

  return (
    <div className="overflow-hidden rounded-xl border-2 bg-background">
      <div className="flex items-center gap-2 border-b bg-surface-elevated px-4 py-3">
        <div className="size-3 rounded-full bg-error" />
        <div className="size-3 rounded-full bg-warning" />
        <div className="size-3 rounded-full bg-success" />
        <span className="ml-2 font-mono text-xs text-text-muted">
          bugless review
        </span>
      </div>

      <div className="h-[520px] overflow-hidden p-5 font-mono text-sm">
        <div className="flex items-center text-text-muted">
          <span>$ </span>
          <span className="text-foreground">{typedCommand}</span>
          {phase === "typing-command" && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="ml-px inline-block h-4 w-2 bg-primary"
            />
          )}
          {phase !== "typing-command" &&
            typedCommand.length === command.length && (
              <span className="ml-2 text-text-muted/50 text-xs">↵</span>
            )}
        </div>

        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-foreground"
            >
              ? What would you like to review?
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 space-y-0.5"
            >
              {reviewOptions.map((option, i) => (
                <div
                  key={i}
                  className={`flex items-center transition-colors duration-100 ${
                    i === selectedOption
                      ? "text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  <span className="w-4 text-primary">
                    {i === selectedOption ? "›" : " "}
                  </span>
                  <span>{option}</span>
                  {i === selectedOption && phase === "selected-option" && (
                    <span className="ml-2 text-text-muted/50 text-xs">↵</span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3"
            >
              <div className="text-primary flex items-center gap-2">
                <span>\×/</span>
                <span>
                  BugLess • Analyzing{" "}
                  {scanProgress < 3 ? `${scanProgress + 1}/3` : "3"} files
                  {scanProgress < 3 && (
                    <motion.span
                      animate={{ opacity: [1, 0.3] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  )}
                  {scanProgress >= 3 && (
                    <span className="text-success ml-1">✓</span>
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 space-y-2"
            >
              <div className="space-y-0.5">
                <div className="text-error">
                  ✖ CRITICAL src/api/users.ts:42
                </div>
                <div className="pl-4 text-text-secondary text-xs">
                  SQL injection vulnerability in query builder
                </div>
                <div className="pl-4 text-primary/80 text-xs">
                  💡 Use parameterized queries instead
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-warning">
                  ⚠ WARNING src/utils/parser.ts:18
                </div>
                <div className="pl-4 text-text-secondary text-xs">
                  Unhandled promise rejection possible
                </div>
                <div className="pl-4 text-primary/80 text-xs">
                  💡 Add try/catch or .catch() handler
                </div>
              </div>

              <div className="border-t/30 pt-2 mt-2">
                <div className="text-foreground">
                  \×/ Found: 1 critical, 1 warning, 0 info
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3"
            >
              <div className="flex items-center gap-4 text-xs">
                <span
                  className={`px-2 py-0.5 rounded ${typedAction === "a" ? "bg-primary text-primary-foreground" : "text-text-muted border/50"}`}
                >
                  [A] Apply all
                </span>
                <span className="text-text-muted border/50 px-2 py-0.5 rounded">
                  [F] Apply one
                </span>
                <span className="text-text-muted border/50 px-2 py-0.5 rounded">
                  [S] Skip
                </span>
              </div>

              {phase === "typing-action" && !typedAction && (
                <div className="mt-2 flex items-center">
                  <span className="text-text-muted">› </span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block h-4 w-2 bg-primary"
                  />
                </div>
              )}
              {typedAction && (
                <div className="mt-2 text-text-muted">
                  › <span className="text-foreground">{typedAction}</span>
                  <span className="ml-2 text-text-muted/50 text-xs">↵</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showApplying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 space-y-1"
            >
              {fixProgress >= 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-success flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>Fixed: src/api/users.ts:42</span>
                </motion.div>
              )}
              {fixProgress >= 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-success flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>Fixed: src/utils/parser.ts:18</span>
                </motion.div>
              )}
              {fixProgress >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 pt-2 border-t/30 text-foreground font-medium"
                >
                  \×/ All fixes applied successfully!
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
