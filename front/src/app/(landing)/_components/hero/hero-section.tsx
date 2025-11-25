"use client";

import { FlowFieldCanvas } from "./flow-field-canvas";
import { BackedBadge } from "./backed-badge";
import { AnimatedBugIcon } from "./animated-bug-icon";
import { HeroHeadline } from "./hero-headline";
import { HeroSubtitle } from "./hero-subtitle";
import { InstallCommand } from "./install-command";
import { ScrollIndicator } from "./scroll-indicator";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <FlowFieldCanvas />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <BackedBadge />
        <AnimatedBugIcon />
        <HeroHeadline />
        <HeroSubtitle />
        <InstallCommand />
      </div>

      <ScrollIndicator />
    </section>
  );
}
