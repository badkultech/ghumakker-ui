"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Sidebar } from "@/components/traveler/Sidebar";

import { skipToken } from "@reduxjs/toolkit/query";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import {
  useGetTravelerProfileQuery,
  useUpdateTravelerProfileFormMutation,
} from "@/lib/services/user";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { GradientButton } from "@/components/gradient-button";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useOrganizationId } from "@/hooks/useOrganizationId";

type MoodsState = {
  mountain: boolean;
  adventure: boolean;
  beach: boolean;
  jungle: boolean;
  trekking: boolean;
};

export default function TravelerProfile() {
  const { userData, router } = useAuthActions();
  const orgId = useOrganizationId();
  const userPublicId = userData?.userPublicId || "";
  // Inside component
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const onPickAvatar = () => fileRef.current?.click();

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // optional: size/type checks
    if (!/^image\/(png|jpe?g|webp)$/.test(f.type)) {
      return showApiError("Please choose a PNG, JPG, or WEBP image");
    }
    if (f.size > 2 * 1024 * 1024) {
      return showApiError("Max file size is 2MB");
    }
    setAvatarFile(f);
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
  };

  const queryArgs = useMemo(
    () =>
      orgId && userPublicId
        ? { organizationId: orgId, userPublicId }
        : skipToken,
    [orgId, userPublicId]
  );

  const { data, isFetching, refetch } = useGetTravelerProfileQuery(
    queryArgs as any,
    {
      refetchOnMountOrArgChange: true, // ✅ forces fresh fetch on page load
    }
  );

  const [updateTravelerProfileForm, { isLoading: saving }] =
    useUpdateTravelerProfileFormMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    bio: "",
    phoneNumber: "",
    secondaryEmail: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    moods: {
      mountain: false,
      adventure: false,
      beach: false,
      jungle: false,
      trekking: false,
    } as MoodsState,
  });

  const handleChangeClick = () => {
    router.push("/traveler/profile/change-mobile"); // or "/login" depending on your route
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMoodChange = (mood: keyof MoodsState, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      moods: { ...prev.moods, [mood]: checked },
    }));
  };

  // Prefill from API
  useEffect(() => {
    if (!data) return;
    setFormData((prev) => ({
      ...prev,
      fullName: [data.firstName, data.lastName].filter(Boolean).join(" "),
      gender: data.gender ?? "",
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toLocaleDateString("en-GB")
        : "",
      bio: data.bio ?? "",
      phoneNumber: data.mobileNumber ?? "",
      secondaryEmail: data.email ?? "",
      emergencyContactName: data.emergencyContactName ?? "",
      emergencyContactPhone: data.emergencyContactNumber ?? "",
      profileImage: data.profileImageUrl ?? null,
      moods: {
        mountain: data.moodPreferences?.includes("mountain") ?? false,
        adventure: data.moodPreferences?.includes("adventure") ?? false,
        beach: data.moodPreferences?.includes("beach") ?? false,
        jungle: data.moodPreferences?.includes("jungle") ?? false,
        trekking: data.moodPreferences?.includes("trekking") ?? false,
      },
    }));
  }, [data]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleSaveProfile = async () => {
    if (!orgId || !userPublicId) return;

    const [firstName, ...rest] = (formData.fullName || "").trim().split(" ");
    const lastName = rest.join(" ").trim() || null;

    const isoDob = formData.dateOfBirth
      ? formData.dateOfBirth.split("/").reverse().join("-")
      : null;

    const moods = Object.entries(formData.moods)
      .filter(([, v]) => v)
      .map(([k]) => k);

    try {
      await updateTravelerProfileForm({
        organizationId: orgId,
        userPublicId,
        body: {
          firstName: firstName || null,
          lastName,
          gender: formData.gender || null,
          dateOfBirth: isoDob,
          bio: formData.bio || null,
          mobileNumber: formData.phoneNumber || null,
          email: formData.secondaryEmail || null,
          emergencyContactName: formData.emergencyContactName || null,
          emergencyContactNumber: formData.emergencyContactPhone || null,
          moodPreferences: moods,
          profileImage: avatarFile ?? null,
          // profileImage, documents if any (File/Blob)
        },
      }).unwrap();

      showSuccess("Profile updated successfully");
    } catch (e) {
      console.error("updateTravelerProfileForm error:", e);
      showApiError(e);
    }
  };

  const bioCharCount = formData.bio.length;
  const maxBioLength = 500;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
        <AppHeader showAvatar={true} title="Traveler Profile" />

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-[22px] md:text-2xl font-semibold text-gray-900 mb-6">
              Traveler Profile
            </h1>

            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={
                        avatarPreview || // newly selected file preview
                        data?.profileImageUrl || // URL from GET traveler profile
                        "/adventure-traveler-in-nature.jpg" // fallback asset
                      }
                      alt={formData.fullName || "Avatar"}
                    />
                    <AvatarFallback>
                      {(formData.fullName || "A")
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={onPickAvatar}
                    className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border"
                    aria-label="Change avatar"
                  >
                    <PencilIcon className="w-3 h-3 text-gray-600" />
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formData.fullName || "—"}
                  </h2>
                  <p className="text-gray-600">
                    Adventure enthusiast • 15 trips completed
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div>
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="mt-1 h-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      placeholder="DD/MM/YYYY"
                      className="h-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-gray-700"
                  >
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger className="mt-1 h-10 w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-full">
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                      <SelectItem value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1 min-h-[120px]"
                  maxLength={maxBioLength}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-orange-500">
                    {bioCharCount}/{maxBioLength} Characters
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Communication */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact & Communication
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone No.
                  </Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm h-10">
                      +91
                    </span>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      disabled
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="rounded-l-none h-10"
                    />
                    <Button
                      variant="outline"
                      className="ml-2 h-10 rounded-xl px-4 text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                      onClick={handleChangeClick}
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="secondaryEmail"
                    className="text-sm font-medium text-gray-700"
                  >
                    Secondary Email
                  </Label>
                  <div className="flex mt-1">
                    <Input
                      id="secondaryEmail"
                      value={formData.secondaryEmail}
                      onChange={(e) =>
                        handleInputChange("secondaryEmail", e.target.value)
                      }
                      type="email"
                      className="h-10"
                    />
                    <Button
                      variant="outline"
                      className="ml-2 h-10 rounded-xl px-4 text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Contact name"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      handleInputChange("emergencyContactName", e.target.value)
                    }
                    className="h-10"
                  />
                  <Input
                    placeholder="Phone no."
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      handleInputChange("emergencyContactPhone", e.target.value)
                    }
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Linked Social Accounts */}
            <div className="mt-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Linked Social Accounts
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg min-h-[64px] hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        G
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Google Account
                        </p>
                        <p className="text-sm text-gray-500">
                          alexkumar@gmail.com
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-9 rounded-xl px-4 text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                    >
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg min-h-[64px] hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        f
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Connect Facebook
                        </p>
                        <p className="text-sm text-gray-500">Not Connected</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-9 rounded-xl px-4 text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Preferences */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mood Preferences
              </h3>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Preferred Moods
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(formData.moods).map(([mood, checked]) => (
                    <div key={mood} className="flex items-center space-x-2">
                      <Checkbox
                        id={mood}
                        checked={checked}
                        onCheckedChange={(c) =>
                          handleMoodChange(
                            mood as keyof MoodsState,
                            c as boolean
                          )
                        }
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label
                        htmlFor={mood}
                        className="text-sm font-medium capitalize cursor-pointer"
                      >
                        {mood}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6 mb-2">
              <GradientButton
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-8 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Profile Changes
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </GradientButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
