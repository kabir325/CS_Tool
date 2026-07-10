"use client";

type StepIndicatorProps = {
  steps: { title: string }[];
  currentStep: number;
  onStepSelect: (step: number) => void;
};

export function StepIndicator({
  steps,
  currentStep,
  onStepSelect,
}: StepIndicatorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <button
            key={step.title}
            type="button"
            onClick={() => onStepSelect(index)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-cyan-300/60 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.12)]"
                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive || isComplete
                    ? "bg-cyan-300 text-slate-950"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium text-slate-100">{step.title}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
