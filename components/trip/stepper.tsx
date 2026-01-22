"use client";

import { usePathname } from "next/navigation";
import { tripSteps } from "@/lib/common/stepperConfig";
export function Stepper() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between mb-8">
      {tripSteps.map((step, index) => {
        const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
        const isActive = pathname === step.path;
        const isCompleted = currentIndex > index;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive
                    ? "bg-orange-500 text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"}
                `}
              >
                {step.id}
              </div>
              <span className="text-sm text-gray-600 mt-2">{step.label}</span>
            </div>
            {index < tripSteps.length - 1 && (
              <div
                className={`w-16 h-px mx-4 mt-[-20px] ${
                  isCompleted ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
