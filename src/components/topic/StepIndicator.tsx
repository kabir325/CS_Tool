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
            className={`rounded-md border px-4 py-3 text-left transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive || isComplete
                    ? "bg-white text-slate-900"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {index + 1}
              </span>
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-slate-800"}`}>
                {step.title}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
