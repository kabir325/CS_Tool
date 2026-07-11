"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TopicStep } from "@/types/topic";

type ExplanationPanelProps = {
  step: TopicStep;
  currentStep: number;
  totalSteps: number;
};

export function ExplanationPanel({
  step,
  currentStep,
  totalSteps,
}: ExplanationPanelProps) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Step {currentStep + 1} of {totalSteps}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-4 space-y-3"
        >
          <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
          <p className="text-sm leading-7 text-slate-600">{step.description}</p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
