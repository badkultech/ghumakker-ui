"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { SectionCard } from "@/components/create-trip/section-card";
import { PillCheckboxGroup } from "@/components/create-trip/pill-checkbox-group";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

import {
  useCreateExclusionMutation,
  useGetAllExclusionsQuery,
} from "@/lib/services/organizer/trip/exclusion";
import { useOrganizationId } from "@/hooks/useOrganizationId";

const DEFAULT_OPTIONS = [
  "Personal Expenses",
  "Travel Insurance",
  "Tips and Gratuities",
  "Visa and Passport Fees",
  "Meals Not Listed",
];

export default function ExclusionsPage() {
  const router = useRouter();
  const organizationId = useOrganizationId();
  const { id: tripId } = useParams();

  const { data: apiExclusions } = useGetAllExclusionsQuery({
    organizationId,
    tripPublicId: tripId as string,
  });

  const [createExclusion] = useCreateExclusionMutation();
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [customOptions, setCustomOptions] = useState<Array<string>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mergedOptions = Array.from(new Set([...options, ...customOptions]));
  const [isSaving, setIsSaving] = useState(false);
  const [draftDisabled, setDraftDisabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setDraftDisabled(false);
  }, [selected, customOptions, options, custom]);

  useEffect(() => {
    if (apiExclusions?.masterData) {
      setOptions(apiExclusions.masterData.map((x) => x.name));
    }
    if (apiExclusions?.details) {
      const names = apiExclusions.details
        .map((x) => x.name ?? "") // SAFE
        .filter((x) => x.trim() !== ""); // remove empty names

      setOptions((prev) => Array.from(new Set([...prev, ...names])));
      setSelected(names);
    }
  }, [apiExclusions]);

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;
    if (!customOptions.includes(trimmed) && !options.includes(trimmed))
      setCustomOptions((prev) => [...prev, trimmed]);
    if (!selected.includes(trimmed)) setSelected((prev) => [...prev, trimmed]);
    setCustom("");
  };

  const handleSave = async (isDraft: boolean = false) => {
    if (selected.length === 0) {
      setErrorMsg("Please select at least one exclusion before saving.");
      return;
    }

    setErrorMsg("");
    if (isDraft) setDraftDisabled(true);
    setIsSaving(true);

    const fd = new FormData();
    selected.forEach((value, index) => {
      fd.append(`details[${index}].name`, value);
      fd.append(`details[${index}].category`, "DEFAULT");
    });

    try {
      await createExclusion({
        organizationId,
        tripPublicId: tripId as string,
        data: fd,
      }).unwrap();

      if (!isDraft) {
        router.push(`/organizer/create-trip/${tripId}/faqs`);
      }

    } catch (err) {
      console.error("Error saving exclusions:", err);
    } finally {
      setIsSaving(false);
    }
  };


  const handlePrev = async () => {
    try {
      const orgId = organizationId;

      if (!orgId || !tripId) return;
      // Now navigate back
      router.push(`/organizer/create-trip/${tripId}/Itinerary`);
    } catch (error) {
      console.error("❌ Failed fetching itinerary:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 w-full min-h-screen flex flex-col">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={3} />

        <div className="p-8 bg-white min-h-screen">
          <div className={isSaving ? "pointer-events-none opacity-50" : ""}>
            <SectionCard title="Exclusions">
              <div className="space-y-6">
                {errorMsg && (
                  <p className="text-red-500 text-sm mb-3">{errorMsg}</p>
                )}

                <PillCheckboxGroup
                  options={mergedOptions}
                  value={selected ?? []}
                  onChange={(val) => {
                    setSelected(val);
                    if (val.length > 0) {
                      setErrorMsg("");
                    }
                  }}
                />

                <div className="space-y-2">
                  <Label htmlFor="custom-exclusion">Custom Exclusion</Label>

                  <div className="flex items-center gap-2">
                    <Input
                      id="custom-exclusion"
                      placeholder="Enter custom exclusion"
                      value={custom ?? ""}
                      onChange={(e) => setCustom(e.target.value)}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className="px-8 py-2 rounded-full font-medium text-orange-500 border-orange-400 hover:bg-orange-50 transition"
                      onClick={addCustom}
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
          <WizardFooter
            onPrev={handlePrev}
            onDraft={() => handleSave(true)}
            onNext={() => handleSave(false)}
            draftDisabled={draftDisabled}
            loading={isSaving}
          />

        </div>
      </div>
    </div>
  );
}
