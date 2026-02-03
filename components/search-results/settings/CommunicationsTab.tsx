"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { GradientButton } from "@/components/gradient-button";
import {
  useGetUserNotificationPreferenceQuery,
  useCreateUserNotificationPreferenceMutation
} from "@/lib/services/user-notification-preference";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CHANNELS } from "@/lib/services/user-notification-preference/types";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";

interface CommunicationPreferences {
  whatsappUpdates: boolean;
  emailNotifications: boolean;
  smsUpdates: boolean;
  marketingWhatsapp: boolean;
  marketingEmails: boolean;
  marketingSms: boolean;
}

export default function CommunicationsTab() {
  const organizationId = useOrganizationId();
  const userId = useUserId();

  // Local state
  const [communications, setCommunications] = useState<CommunicationPreferences>({
    whatsappUpdates: false,
    emailNotifications: false,
    smsUpdates: false,
    marketingWhatsapp: false,
    marketingEmails: false,
    marketingSms: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all 6 preferences separately
  const { data: tripWhatsapp } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
      channel: NOTIFICATION_CHANNELS.WHATSAPP
    },
    { skip: !organizationId || !userId }
  );

  const { data: tripEmail } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
      channel: NOTIFICATION_CHANNELS.EMAIL
    },
    { skip: !organizationId || !userId }
  );

  const { data: tripSms } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
      channel: NOTIFICATION_CHANNELS.SMS
    },
    { skip: !organizationId || !userId }
  );

  const { data: marketingWhatsapp } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.MARKETING.id,
      channel: NOTIFICATION_CHANNELS.WHATSAPP
    },
    { skip: !organizationId || !userId }
  );

  const { data: marketingEmail } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.MARKETING.id,
      channel: NOTIFICATION_CHANNELS.EMAIL
    },
    { skip: !organizationId || !userId }
  );

  const { data: marketingSms } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.MARKETING.id,
      channel: NOTIFICATION_CHANNELS.SMS
    },
    { skip: !organizationId || !userId }
  );

  const [createPreference] = useCreateUserNotificationPreferenceMutation();

  // Load fetched preferences into state
  useEffect(() => {
    setCommunications({
      whatsappUpdates: tripWhatsapp?.enabled ?? false,
      emailNotifications: tripEmail?.enabled ?? false,
      smsUpdates: tripSms?.enabled ?? false,
      marketingWhatsapp: marketingWhatsapp?.enabled ?? false,
      marketingEmails: marketingEmail?.enabled ?? false,
      marketingSms: marketingSms?.enabled ?? false,
    });
  }, [tripWhatsapp, tripEmail, tripSms, marketingWhatsapp, marketingEmail, marketingSms]);

  const handleToggle = (key: keyof CommunicationPreferences, checked: boolean) => {
    setCommunications((prev) => ({ ...prev, [key]: checked }));
    setHasChanges(true);
  };

  // Save all preferences
  const savePreferences = async () => {
    if (!organizationId || !userId) {
      toast({
        title: "Error ❌",
        description: "User information not available. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Create array of all preference updates
      const preferenceUpdates = [
        // Trip Updates
        {
          categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
          categoryCode: NOTIFICATION_CATEGORIES.TRIP_UPDATES.code,
          categoryName: NOTIFICATION_CATEGORIES.TRIP_UPDATES.name,
          channel: NOTIFICATION_CHANNELS.WHATSAPP,
          enabled: communications.whatsappUpdates,
        },
        {
          categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
          categoryCode: NOTIFICATION_CATEGORIES.TRIP_UPDATES.code,
          categoryName: NOTIFICATION_CATEGORIES.TRIP_UPDATES.name,
          channel: NOTIFICATION_CHANNELS.EMAIL,
          enabled: communications.emailNotifications,
        },
        {
          categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
          categoryCode: NOTIFICATION_CATEGORIES.TRIP_UPDATES.code,
          categoryName: NOTIFICATION_CATEGORIES.TRIP_UPDATES.name,
          channel: NOTIFICATION_CHANNELS.SMS,
          enabled: communications.smsUpdates,
        },
        // Marketing Communications
        {
          categoryId: NOTIFICATION_CATEGORIES.MARKETING.id,
          categoryCode: NOTIFICATION_CATEGORIES.MARKETING.code,
          categoryName: NOTIFICATION_CATEGORIES.MARKETING.name,
          channel: NOTIFICATION_CHANNELS.WHATSAPP,
          enabled: communications.marketingWhatsapp,
        },
        {
          categoryId: NOTIFICATION_CATEGORIES.MARKETING.id,
          categoryCode: NOTIFICATION_CATEGORIES.MARKETING.code,
          categoryName: NOTIFICATION_CATEGORIES.MARKETING.name,
          channel: NOTIFICATION_CHANNELS.EMAIL,
          enabled: communications.marketingEmails,
        },
        {
          categoryId: NOTIFICATION_CATEGORIES.MARKETING.id,
          categoryCode: NOTIFICATION_CATEGORIES.MARKETING.code,
          categoryName: NOTIFICATION_CATEGORIES.MARKETING.name,
          channel: NOTIFICATION_CHANNELS.SMS,
          enabled: communications.marketingSms,
        },
      ];

      // Send updates one by one (backend doesn't support batch/array)
      for (const pref of preferenceUpdates) {
        await createPreference({
          organizationId,
          userId,
          body: pref,
        }).unwrap();
      }

      toast({
        title: "Preferences Updated ✅",
        description: "Your communication preferences have been saved successfully.",
      });
      setHasChanges(false);
    } catch (error: any) {
      toast({
        title: "Failed to Update ❌",
        description: error?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-foreground md:hidden">Communications</h2>
      <div className="bg-white border border-[#E4E4E4] rounded-2xl p-6">
        <div className="max-w-xl space-y-8">
          <div>
            <p className="text-sm text-[#6B6B6B] mb-2">Booking Communication Preference</p>

            <button className="w-full flex items-center justify-between px-4 py-3 border border-[#E4E4E4] rounded-xl bg-white">
              <span className="text-sm font-medium text-[#1A1A1A]">Call</span>
              <span className="text-xl text-[#7A7A7A]">›</span>
            </button>
          </div>

          {/* Trip Updates */}
          <div>
            <h3 className="text-base font-semibold mb-3">Trip Updates</h3>

            {[
              ["WhatsApp Updates", "whatsappUpdates"],
              ["Email Notifications", "emailNotifications"],
              ["SMS Updates", "smsUpdates"],
            ].map(([label, key]) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-4 bg-white border border-[#E4E4E4] rounded-xl shadow-sm mb-3"
              >
                <span className="text-sm font-medium">{label}</span>

                <Switch
                  className="data-[state=checked]:bg-primary"
                  checked={communications[key as keyof CommunicationPreferences]}
                  onCheckedChange={(checked) => handleToggle(key as keyof CommunicationPreferences, checked)}
                />
              </div>
            ))}
          </div>

          {/* Marketing Communications */}
          <div>
            <h3 className="text-base font-semibold mb-3">Marketing Communications</h3>

            {[
              ["WhatsApp Updates", "marketingWhatsapp"],
              ["Marketing Emails", "marketingEmails"],
              ["SMS Updates", "marketingSms"],
            ].map(([label, key]) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-4 bg-white border border-[#E4E4E4] rounded-xl shadow-sm mb-3"
              >
                <span className="text-sm font-medium">{label}</span>

                <Switch
                  className="data-[state=checked]:bg-primary"
                  checked={communications[key as keyof CommunicationPreferences]}
                  onCheckedChange={(checked) => handleToggle(key as keyof CommunicationPreferences, checked)}
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <GradientButton
            onClick={savePreferences}
            disabled={!hasChanges || isSaving}
            className={`w-full mt-6 ${!hasChanges && !isSaving ? "bg-gray-200 text-gray-400 opacity-100" : ""}`}
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
