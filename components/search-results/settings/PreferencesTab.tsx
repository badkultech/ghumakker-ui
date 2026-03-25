"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";
import { useGetUserPreferenceQuery, useCreateUserPreferenceMutation, useUpdateUserPreferenceMutation } from "@/lib/services/user-preference";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";

type OpenMenu = "language" | "timezone" | "currency" | null;

export default function PreferencesTab() {
  const organizationId = useOrganizationId();
  const userPublicId = useUserId();

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  // API hooks
  const { data: preferences, isLoading } = useGetUserPreferenceQuery(
    { organizationId, userPublicId },
    { skip: !organizationId || !userPublicId }
  );

  const [createPreference] = useCreateUserPreferenceMutation();
  const [updatePreference] = useUpdateUserPreferenceMutation();

  // Local state
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("IST (GMT+5:30)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences from API
  useEffect(() => {
    if (preferences) {
      setLanguage(preferences.language || "English");
      setTimezone(preferences.timezone || "IST (GMT+5:30)");
      setCurrency(preferences.currency || "INR (₹)");
      setHasChanges(false); // Reset changes when data loads
    }
  }, [preferences]);

  // Save preferences to API
  const savePreferences = async () => {
    setIsSaving(true);
    const payload = {
      language,
      timezone,
      currency,
      dateFormat: preferences?.dateFormat || "DD/MM/YYYY",
    };

    try {
      if (preferences) {
        // Update existing
        await updatePreference({
          organizationId,
          userPublicId,
          body: payload,
        }).unwrap();
      } else {
        // Create new
        await createPreference({
          organizationId,
          userPublicId,
          body: payload,
        }).unwrap();
      }

      toast({
        title: "Preferences Updated ✅",
        description: "Your preferences have been saved successfully.",
      });
      setHasChanges(false); // Reset changes after successful save
    } catch (error) {
      toast({
        title: "Failed to Update ❌",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const Menu = ({
    title,
    value,
    options,
    onSelect,
    menuKey,
  }: {
    title: string;
    value: string;
    options: string[];
    onSelect: (val: string) => void;
    menuKey: OpenMenu;
  }) => (
    <div className="space-y-2">
      <label className="text-[14px] font-bold text-gray-900 ml-1">{title}</label>

      {/* HEADER */}
      <div className="relative">
        <button
          onClick={() =>
            setOpenMenu(openMenu === menuKey ? null : menuKey)
          }
          className="w-full flex items-center justify-between px-4 h-[54px] bg-white border border-[#E4E4E4] rounded-xl hover:bg-gray-50 transition"
        >
          <span className="text-[14px] font-medium text-gray-500">{value}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition ${openMenu === menuKey ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* OPTIONS */}
        {openMenu === menuKey && (
          <div className="absolute top-full left-0 w-full mt-2 z-50 border border-[#E4E4E4] rounded-xl shadow-lg bg-white overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setOpenMenu(null);
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-sm text-gray-700"
              >
                {opt}
                {opt === value && (
                  <Check className="w-4 h-4 text-[#FF3D3D]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 min-h-[70vh] flex items-center justify-center">
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px]">
      {/* Header */}
      

      <div className="bg-white border border-[#E4E4E4] rounded-xl p-8 md:p-10 w-full max-w-[703px] h-full min-h-[854px] flex flex-col">
        <div className="mb-8 border-b border-[#E4E4E4] pb-4">
        <h2 className="text-2xl font-bold text-gray-900">App Preferences</h2>
        <p className="text-gray-500 text-[14px] mt-1 font-medium">Set your language, timezone and currency for the best experience.</p>
      </div>
        <div className="space-y-8">
          <Menu
            title="Language"
            value={language}
            menuKey="language"
            options={["English", "Hindi"]}
            onSelect={(val) => {
              setLanguage(val);
              setHasChanges(true);
            }}
          />

          <Menu
            title="Timezone"
            value={timezone}
            menuKey="timezone"
            options={[
              "IST (GMT+5:30)",
              "UTC",
              "PST (GMT-8:00)",
            ]}
            onSelect={(val) => {
              setTimezone(val);
              setHasChanges(true);
            }}
          />

          <Menu
            title="Currency"
            value={currency}
            menuKey="currency"
            options={["INR (₹)", "USD ($)", "EUR (€)"]}
            onSelect={(val) => {
              setCurrency(val);
              setHasChanges(true);
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-16 mt-auto">
          <button 
            type="button"
            className="w-full md:min-w-[240px] py-4 bg-[#F6F6F6] text-gray-600 rounded-full font-bold text-[16px] hover:bg-gray-100 transition-colors"
            onClick={() => window.location.reload()}
          >
            Discard
          </button>
          <GradientButton 
            onClick={savePreferences}
            disabled={!hasChanges || isSaving}
            className="w-full md:min-w-[240px] py-4 text-[16px] shadow-md hover:cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
