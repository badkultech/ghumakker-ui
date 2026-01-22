export function TripStepperHeader({ activeStep = 1 }) {
  const steps = [
    { label: "Trip Overview" },
    { label: "Itinerary" },
    { label: "Exclusions" },
    { label: "FAQs" },
    { label: "Pricing" },
    { label: "Review" },
  ];

  return (
    <div className="flex items-center w-full justify-center py-5 pl-11 bg-white">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isCompleted = stepNumber < activeStep;
        const isActive = stepNumber === activeStep;

        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg
                  ${
                    isActive
                      ? "bg-orange-500 text-white border-4 border-orange-200"
                      : isCompleted
                      ? "bg-orange-200 text-orange-700"
                      : "bg-gray-200 text-gray-400"
                  }`}
              >
                {`0${stepNumber}`}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  isActive
                    ? "text-black"
                    : isCompleted
                    ? "text-black"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx !== steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 ${
                  isCompleted ? "bg-orange-200" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
