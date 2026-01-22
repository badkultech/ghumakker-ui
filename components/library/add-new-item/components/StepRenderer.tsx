import React from "react";
import { StepHeader } from "./StepHeader";
import type { FormDataShape, Step } from "../modules/types";
import { StayModule } from "../modules/StayModule";
import { MealModule } from "../modules/MealModule";
import { ActivityModule } from "../modules/ActivityModule";
import { TransitModule } from "../modules/TransitModule";
import { EventModule } from "../modules/DayDescriptionModule";
import { TripLeaderModule } from "../modules/TripLeaderModule";
import { FAQModule } from "../modules/FAQModule";

import type {  OnSaveHandler } from "../modules/types";

interface Props {
  step: Step;
  updateId?: number | null;
  onBack: () => void;
  onClose: () => void;
  onSave: OnSaveHandler;
}

export const StepRenderer: React.FC<Props> = ({
  step,
  updateId,
  onBack,
  onClose,
  onSave,
}) => {
  const render = (key: Step, title: string, Comp: any) => (
    <>
      <StepHeader title={updateId ? `Edit ${title}` : `Add ${title}`} />
      <Comp
        updateId={updateId}
        onCancel={onBack}
        onSave={(data: any, docs?: any[]) => onSave(key, data, docs)}
      />
    </>
  );

  switch (step) {
    case "stay":
      return render("stay", "Stay", StayModule);
    case "meal":
      return render("meal", "Meal", MealModule);
    case "activity":
      return render("activity", "Activity", ActivityModule);
    case "transit":
      return render("transit", "Transit", TransitModule);
    case "day-description":
      return render("day-description", "day-description", EventModule);
    case "trip-leader":
      return render("trip-leader", "Trip Leader", TripLeaderModule);
    case "faq":
      return render("faq", "FAQ", FAQModule);
    default:
      return null;
  }
};