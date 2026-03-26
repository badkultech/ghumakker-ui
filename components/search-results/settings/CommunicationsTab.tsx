"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { GradientButton } from "@/components/gradient-button";
import { Phone, Mail, MessageSquare, MessageCircle, Info } from "lucide-react";
import {
  useGetUserNotificationPreferenceQuery,
  useCreateUserNotificationPreferenceMutation
} from "@/lib/services/user-notification-preference";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CHANNELS } from "@/lib/services/user-notification-preference/types";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.47 14.38a2 2 0 0 1-2.03-.97c-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5a.5.5 0 0 0-.03-.52c-.07-.15-.67-1.61-.91-2.2-.24-.59-.49-.51-.67-.52-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
    <path d="M12 24a11.8 11.8 0 0 1-5.94-1.6L0 24l1.6-6.06A11.8 11.8 0 1 1 12 24z" />
  </svg>
);

interface CommunicationPreferences {
  whatsappUpdates: boolean;
  emailNotifications: boolean;
  smsUpdates: boolean;
  callUpdates: boolean;
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
    callUpdates: false,
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

  const { data: tripCall } = useGetUserNotificationPreferenceQuery(
    {
      organizationId: organizationId!,
      userId: userId!,
      categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
      channel: NOTIFICATION_CHANNELS.CALL
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
      callUpdates: tripCall?.enabled ?? false,
      marketingWhatsapp: marketingWhatsapp?.enabled ?? false,
      marketingEmails: marketingEmail?.enabled ?? false,
      marketingSms: marketingSms?.enabled ?? false,
    });
  }, [tripWhatsapp, tripEmail, tripSms, tripCall, marketingWhatsapp, marketingEmail, marketingSms]);

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
        {
          categoryId: NOTIFICATION_CATEGORIES.TRIP_UPDATES.id,
          categoryCode: NOTIFICATION_CATEGORIES.TRIP_UPDATES.code,
          categoryName: NOTIFICATION_CATEGORIES.TRIP_UPDATES.name,
          channel: NOTIFICATION_CHANNELS.CALL,
          enabled: communications.callUpdates,
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
    <div className="max-w-[800px]">

      <div className="bg-white border border-[#E4E4E4] rounded-xl p-8 md:p-10 w-full max-w-[703px] h-full min-h-[854px]">
        {/* Header */}
        <div className="mb-8 border-b border-[#E4E4E4] pb-4">
          <h2 className="text-2xl font-bold font-manrope">Communication Preferences</h2>
          <p className="text-gray-500 text-[14px] mt-1 font-medium">Control how and when Ghumakker contacts you.</p>
        </div>

        <div className="space-y-10">
          {/* Booking Communication */}
          <div>
            <h3 className="text-[12px] font-bold tracking-wider mb-4 uppercase">Booking Communication</h3>
            <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#F6F6F6] rounded-xl">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-[14px] font-bold text-gray-900">Call</span>
              </div>
              <Switch
                className="data-[state=checked]:bg-primary cursor-pointer"
                checked={communications.callUpdates}
                onCheckedChange={(checked) => handleToggle("callUpdates", checked)}
              />
            </div>
          </div>

          {/* Trip Updates */}
          <div>
            <h3 className="text-[12px] font-bold tracking-wider mb-4 uppercase">Trip Updates</h3>
            <div className="space-y-3">
              {[
                { label: "WhatsApp Updates", key: "whatsappUpdates", icon: WhatsAppIcon },
                { label: "Email Notifications", key: "emailNotifications", icon: Mail },
                { label: "SMS Updates", key: "smsUpdates", icon: MessageSquare },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#F6F6F6] rounded-xl">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-[14px] font-bold text-gray-900">{item.label}</span>
                  </div>
                  <Switch
                    className="data-[state=checked]:bg-primary cursor-pointer"
                    checked={communications[item.key as keyof CommunicationPreferences]}
                    onCheckedChange={(checked) => handleToggle(item.key as keyof CommunicationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Communications */}
          <div>
            <h3 className="text-[12px] font-bold tracking-wider mb-4 uppercase">Marketing CommunicationS</h3>
            <div className="space-y-3">
              {[
                { label: "WhatsApp Updates", key: "marketingWhatsapp", icon: WhatsAppIcon },
                { label: "Marketing Emails", key: "marketingEmails", icon: Mail },
                { label: "SMS Updates", key: "marketingSms", icon: MessageSquare },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#F6F6F6] rounded-xl">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-[14px] font-bold text-gray-900">{item.label}</span>
                  </div>
                  <Switch
                    className="data-[state=checked]:bg-primary cursor-pointer"
                    checked={communications[item.key as keyof CommunicationPreferences]}
                    onCheckedChange={(checked) => handleToggle(item.key as keyof CommunicationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-16">
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
