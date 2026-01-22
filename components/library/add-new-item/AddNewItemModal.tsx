"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Calendar,
  Hotel,
  Bus,
  Utensils,
  Activity,
  Users,
  HelpCircle,
} from "lucide-react";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { CategorySelectStep } from "./components/CategorySelectStep";
import { StepRenderer } from "./components/StepRenderer";
import {
  mapMealToFormData,
  mapStayToFormData,
  mapTransitToFormData,
  mapActivityToFormData,
  mapDayDescriptionToFormData,
  mapTripLeaderToFormData,
  DocumentItem,
} from "@/lib/services/organizer/trip/library/common/formDataMappers";
import { FormDataShape } from "./modules/types";

// === RTK Hooks ===
import {
  useCreateDayDescriptionMutation,
  useUpdateDayDescriptionMutation,
} from "@/lib/services/organizer/trip/library/day-description";
import {
  useCreateOrganizerTransitMutation,
  useUpdateOrganizerTransitMutation,
} from "@/lib/services/organizer/trip/library/transit";
import {
  useCreateMealMutation,
  useUpdateMealMutation,
} from "@/lib/services/organizer/trip/library/meal";
import {
  useCreateStayMutation,
  useUpdateStayMutation,
} from "@/lib/services/organizer/trip/library/stay";
import {
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from "@/lib/services/organizer/trip/library/activity";
import {
  useSaveGroupLeaderMutation,
  useUpdateGroupLeaderMutation,
} from "@/lib/services/organizer/trip/library/leader";
import {
  useCreateOrganizerFaqMutation,
  useUpdateOrganizerFaqMutation,
} from "@/lib/services/organizer/trip/library/faq";

/* ------------------------------------------------
   Small helper component: non-intrusive save bar
-------------------------------------------------- */
function SaveStatusBar({
  status,
}: {
  status: "idle" | "saving" | "success" | "error";
}) {
  if (status === "idle") return null;

  const text =
    status === "saving"
      ? "Saving..."
      : status === "success"
        ? "Saved ✓"
        : "Failed to save";

  const color =
    status === "saving"
      ? "bg-blue-50 text-blue-600 border-blue-200"
      : status === "success"
        ? "bg-green-50 text-green-600 border-green-200"
        : "bg-red-50 text-red-600 border-red-200";

  return (
    <div
      className={`text-sm text-center py-2 border-t ${color} transition-all duration-300`}
    >
      {text}
    </div>
  );
}

/* ------------------------------------------------
   Main Modal Component
-------------------------------------------------- */
type Step =
  | "select"
  | "day-description"
  | "stay"
  | "transit"
  | "meal"
  | "activity"
  | "trip-leader"
  | "faq";

export function AddNewItemModal({
  open,
  onClose,
  updateId,
  initialStep = "select",
}: {
  open: boolean;
  onClose: () => void;
  updateId?: number | null;
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const organizationId = useOrganizationId();

  // RTK mutations
  const [createDayDescription] = useCreateDayDescriptionMutation();
  const [updateDayDescription] = useUpdateDayDescriptionMutation();
  const [createTransit] = useCreateOrganizerTransitMutation();
  const [updateTransit] = useUpdateOrganizerTransitMutation();
  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();
  const [createStay] = useCreateStayMutation();
  const [updateStay] = useUpdateStayMutation();
  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [createLeader] = useSaveGroupLeaderMutation();
  const [updateLeader] = useUpdateGroupLeaderMutation();
  const [createFaq] = useCreateOrganizerFaqMutation();
  const [updateFaq] = useUpdateOrganizerFaqMutation();

  useEffect(() => {
    if (!open) return;
    setStep(initialStep);
    setSelected(null);
  }, [open, initialStep]);

  /* ------------------------------------------------
     Unified onSave logic with SaveStatusBar updates
  -------------------------------------------------- */
  async function onSave(
    stepKey: Step,
    data: FormDataShape,
    documents?: DocumentItem[]
  ) {
    const fdMappers: Record<Step, any> = {
      "day-description": mapDayDescriptionToFormData,
      stay: mapStayToFormData,
      transit: mapTransitToFormData,
      meal: mapMealToFormData,
      activity: mapActivityToFormData,
      "trip-leader": mapTripLeaderToFormData,
      faq: (data: { question: string; answer: string }) => {
        const fd = new FormData();
        fd.append("name", data.question);
        fd.append("answer", data.answer);
        return fd;
      },
      select: null,
    };

    const fd = fdMappers[stepKey]?.(data, documents);
    if (!fd) return;

    const actions: Record<Step, any> = {
      "day-description": updateId
        ? () =>
          updateDayDescription({
            organizationId,
            dayDescriptionId: String(updateId),
            data: fd,
          }).unwrap()
        : () => createDayDescription({ organizationId, data: fd }).unwrap(),
      stay: updateId
        ? () =>
          updateStay({ organizationId, stayId: updateId, data: fd }).unwrap()
        : () => createStay({ organizationId, data: fd }).unwrap(),
      transit: updateId
        ? () =>
          updateTransit({
            organizationId,
            transitId: updateId,
            data: fd,
          }).unwrap()
        : () => createTransit({ organizationId, data: fd }).unwrap(),
      meal: updateId
        ? () =>
          updateMeal({ organizationId, mealId: updateId, data: fd }).unwrap()
        : () => createMeal({ organizationId, data: fd }).unwrap(),
      activity: updateId
        ? () =>
          updateActivity({
            organizationId,
            activityId: updateId,
            data: fd,
          }).unwrap()
        : () => createActivity({ organizationId, data: fd }).unwrap(),
      "trip-leader": updateId
        ? () =>
          updateLeader({
            organizationId,
            LeaderId: updateId,
            data: fd,
          }).unwrap()
        : () => createLeader({ organizationId, data: fd }).unwrap(),
      faq: updateId
        ? () =>
          updateFaq({
            organizationId,
            faqId: updateId,
            data: fd,
          }).unwrap()
        : () =>
          createFaq({
            organizationId,
            data: fd,
          }).unwrap(),

      select: () => Promise.resolve(),
    };

    try {
      setSaveStatus("saving");
      await actions[stepKey]();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
      onClose();
    } catch (err) {
      console.error("Failed to save", stepKey, err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  }

  const handleNext = () => selected && setStep(selected.step);
  const handleBack = () => {
    if (initialStep !== "select") return onClose();
    setStep("select");
    setSelected(null);
  };

  /* ------------------------------------------------
     Render
  -------------------------------------------------- */
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setStep("select");
          setSelected(null);
          onClose();
        }
      }}
    >
      <DialogContent className="w-full lg:max-w-2xl rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">Add New Item</DialogTitle>

        <div className="max-h-[90vh] overflow-y-auto">
          {step === "select" ? (
            <CategorySelectStep
              categories={[
                { label: "Day Descriptions", icon: Calendar, step: "day-description" },
                { label: "Stays", icon: Hotel, step: "stay" },
                { label: "Transits", icon: Bus, step: "transit" },
                { label: "Meals", icon: Utensils, step: "meal" },
                { label: "Activities", icon: Activity, step: "activity" },
                { label: "Trip Leaders", icon: Users, step: "trip-leader" },
                { label: "FAQs", icon: HelpCircle, step: "faq" },
              ]}
              selected={selected}
              setSelected={setSelected}
              handleNext={handleNext}
            />
          ) : (
            <StepRenderer
              step={step}
              updateId={updateId}
              onBack={handleBack}
              onClose={onClose}
              onSave={onSave}
            />
          )}
        </div>

        {/* Inline non-intrusive feedback bar */}
        <SaveStatusBar status={saveStatus} />
      </DialogContent>
    </Dialog>
  );
}
