"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
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
      <label className="text-sm text-muted-foreground">{title}</label>

      {/* HEADER */}
      <button
        onClick={() =>
          setOpenMenu(openMenu === menuKey ? null : menuKey)
        }
        className="w-full flex items-center justify-between px-4 py-4 bg-white border border-border rounded-xl hover:bg-muted transition"
      >
        <span className="text-sm font-medium">{value}</span>
        <ChevronDown
          className={`w-4 h-4 transition ${openMenu === menuKey ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* OPTIONS */}
      {openMenu === menuKey && (
        <div className="border border-border rounded-xl overflow-hidden bg-white">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpenMenu(null);
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted text-sm"
            >
              {opt}
              {opt === value && (
                <Check className="w-4 h-4 text-orange-500" />
              )}
            </button>
          ))}
        </div>
      )}
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
    <div className="w-full">
      <div className="bg-card border border-border rounded-2xl p-6 md:p-10 min-h-[70vh]">
        <h2 className="text-lg font-semibold md:hidden mb-6">
          Preferences
        </h2>

        <div className="space-y-8 max-w-xl">
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

          {/* Save Button */}
          <button
            onClick={savePreferences}
            disabled={!hasChanges || isSaving}
            className={`w-full mt-6 px-6 py-3 rounded-xl font-medium transition-all ${hasChanges && !isSaving
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
