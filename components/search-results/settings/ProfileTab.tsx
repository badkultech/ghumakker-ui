"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Calendar } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";
import { useRef } from "react";

interface ProfileTabProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    bio: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      gender: string;
      dateOfBirth: string;
      bio: string;
    }>
  >;
  onSaveProfile: () => void;
  isSaving: boolean;
  profileImageUrl: string | null;
  onImageSelect: (image: File) => void;
}

export default function ProfileTab({ formData, setFormData, profileImageUrl, onSaveProfile, isSaving, onImageSelect }: ProfileTabProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Profile</h2>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">

        {/* Profile Image Section */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-20 h-20 md:w-24 md:h-24">
            <AvatarImage src={profileImageUrl || "/man-profile.png"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              RS
            </AvatarFallback>
          </Avatar>

          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload New Image
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageSelect(file);
              }}
            />

            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <InputField
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            label="First Name"
          />

          <InputField
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            label="Last Name"
          />

          <InputField
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email Address"
          />

          <InputField
            name="phone"
            readOnly
            value={formData.phone}
            onChange={handleChange}
            label="Phone No."
          />

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Gender (Optional)
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>

          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="dd/mm/yyyy"
                className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Bio / About me (Optional)
          </label>

          <div className="relative ">
            <textarea
              name="bio"
              rows={4}
              maxLength={500}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[#E4E4E4] rounded-lg resize-none"
            />

            <span className="absolute bottom-3 right-3 text-xs text-primary">
              {formData.bio.length}/500 Characters
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <GradientButton
            className="inline-flex items-center gap-2"
            onClick={onSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </GradientButton>

        </div>

      </div>
    </div>
  );
}

function InputField({
  name,
  value,
  onChange,
  label,
  readOnly= false,
}: {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  label: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg"
      />
    </div>
  );
}
