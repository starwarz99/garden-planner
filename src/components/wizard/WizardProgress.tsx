"use client";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const stepLabels = [
  "Size",
  "Zone",
  "Soil",
  "Sun",
  "Style",
  "Veggies",
  "Herbs",
  "Flowers",
  "Goals",
  "Review",
];

export function WizardProgress({ currentStep, totalSteps, onStepClick }: WizardProgressProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-sage/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isClickable = step < currentStep && onStepClick;

          return (
            <div key={step} className="flex flex-col items-center gap-1">
              <button
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-200
                  ${isCurrent
                    ? "bg-primary text-white shadow-lg scale-110 ring-2 ring-primary/30"
                    : isCompleted
                    ? "bg-accent text-white cursor-pointer hover:bg-primary"
                    : "bg-sage/20 text-sage/60 cursor-default"
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <span className="text-[10px]">🌱</span>
                ) : (
                  step
                )}
              </button>
              <span className={`text-[9px] font-medium hidden sm:block ${
                isCurrent ? "text-primary" : isCompleted ? "text-accent" : "text-gray-400"
              }`}>
                {stepLabels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current step info */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps} — <span className="font-medium text-primary">{stepLabels[currentStep - 1]}</span>
        </span>
      </div>
    </div>
  );
}
