"use client";

import { motion } from "framer-motion";
import { Check, X } from "@phosphor-icons/react";
import { useSectionReveal } from "@/app/(landing)/_hooks/use-section-reveal";
import { Container } from "../shared/container";

interface Feature {
  name: string;
  coderabbit: string | boolean;
  pragent: string | boolean;
  bugless: string | boolean;
}

const features: Feature[] = [
  {
    name: "Language focus",
    coderabbit: "50+ langs",
    pragent: "Multi",
    bugless: "TypeScript only",
  },
  {
    name: "False positives",
    coderabbit: "~50%",
    pragent: "~30%",
    bugless: "<10%",
  },
  {
    name: "Pre-commit",
    coderabbit: "Limited",
    pragent: false,
    bugless: true,
  },
  {
    name: "CLI experience",
    coderabbit: "Basic",
    pragent: false,
    bugless: "Primary",
  },
  {
    name: "Auto-fix",
    coderabbit: "Partial",
    pragent: false,
    bugless: "1-click",
  },
];

function renderCell(value: string | boolean, isBugless = false) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        weight="bold"
        className={`size-5 ${isBugless ? "text-primary" : "text-success"}`}
      />
    ) : (
      <X weight="bold" className="size-5 text-text-muted" />
    );
  }
  return (
    <span className={isBugless ? "text-primary font-medium" : ""}>{value}</span>
  );
}

export function ComparisonSection() {
  const { ref, isInView } = useSectionReveal();

  return (
    <section ref={ref} className="py-32 bg-surface">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-4xl md:text-5xl text-foreground"
        >
          How we compare
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left font-medium text-text-secondary">
                  Feature
                </th>
                <th className="px-6 py-4 text-left font-medium text-text-secondary">
                  CodeRabbit
                </th>
                <th className="px-6 py-4 text-left font-medium text-text-secondary">
                  PR-Agent
                </th>
                <th className="border-l-2 border-primary px-6 py-4 text-left font-medium text-primary">
                  BugLess
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <motion.tr
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="border-b transition-colors hover:bg-primary/5"
                >
                  <td className="px-6 py-4 text-foreground">{feature.name}</td>
                  <td className="px-6 py-4 text-text-secondary">
                    {renderCell(feature.coderabbit)}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {renderCell(feature.pragent)}
                  </td>
                  <td className="border-l-2 border-primary px-6 py-4 text-foreground font-medium">
                    {renderCell(feature.bugless, true)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </section>
  );
}
