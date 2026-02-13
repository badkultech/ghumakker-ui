"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Calendar } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";
import { useRef, useState } from "react";
import { CustomDateTimePicker } from "@/components/ui/date-time-picker";
import { PHONE_CONFIG, extractPhoneNumber } from "@/lib/constants/phone";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "First name must be at least 2 characters";
        if (value.trim().length > 50) return "First name must not exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "First name can only contain letters";
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name must be at least 2 characters";
        if (value.trim().length > 50) return "Last name must not exceed 50 characters";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Last name can only contain letters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";

      case "dateOfBirth":
        if (!value) return ""; // Optional field

        // Check if date is valid
        const parts = value.split("/");
        if (parts.length !== 3) return "Invalid date format";

        const [day, month, year] = parts.map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        // Check if date is in the future
        if (birthDate > today) {
          return "Date of birth cannot be in the future";
        }

        return "";

      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = () => {
    // Validate all required fields
    const newErrors: { [key: string]: string } = {};

    newErrors.firstName = validateField("firstName", formData.firstName);
    newErrors.lastName = validateField("lastName", formData.lastName);
    newErrors.email = validateField("email", formData.email);
    newErrors.dateOfBirth = validateField("dateOfBirth", formData.dateOfBirth);

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    // If no errors, proceed with save
    if (Object.keys(newErrors).length === 0) {
      onSaveProfile();
    }
  };

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Profile</h2>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">

        {/* Profile Image Section */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-20 h-20 md:w-24 md:h-24">
            <AvatarImage src={profileImageUrl || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {formData.firstName?.[0]?.toUpperCase()}
              {formData.lastName?.[0]?.toUpperCase()}
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
            onBlur={() => handleBlur("firstName", formData.firstName)}
            label="First Name"
            error={errors.firstName}
            required
          />

          <InputField
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={() => handleBlur("lastName", formData.lastName)}
            label="Last Name"
            error={errors.lastName}
            required
          />

          <InputField
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email", formData.email)}
            label="Email Address"
            error={errors.email}
            required
          />


          {/* Phone Number with Country Code */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone No.</label>
            <div className="flex gap-2">
              {/* Country Code */}
              <div className="w-24">
                <input
                  value={PHONE_CONFIG.DEFAULT_COUNTRY_CODE}
                  readOnly
                  className="w-full h-[50px] px-4 py-3 bg-gray-50 border border-[#E4E4E4] rounded-lg text-center cursor-not-allowed"
                />
              </div>
              {/* Phone Number */}
              <div className="flex-1">
                <input
                  name="phone"
                  value={extractPhoneNumber(formData.phone)}
                  readOnly
                  className="w-full h-[50px] px-4 py-3 bg-gray-50 border border-[#E4E4E4] rounded-lg cursor-not-allowed"
                />
              </div>
            </div>
          </div>


          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
              <CustomDateTimePicker
                mode="date"
                placeholder="Select date of birth"
                maxDate={new Date().toISOString().split('T')[0]} // Today's date in yyyy-mm-dd format
                value={(() => {
                  if (!formData.dateOfBirth) return "";
                  const parts = formData.dateOfBirth.split("/");
                  if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`; // dd/mm/yyyy -> yyyy-mm-dd
                  }
                  return formData.dateOfBirth;
                })()}
                onChange={(val: string) => {
                  if (!val) {
                    handleChange({ target: { name: "dateOfBirth", value: "" } } as any);
                    return;
                  }
                  // yyyy-mm-dd -> dd/mm/yyyy
                  const [y, m, d] = val.split("-");
                  if (y && m && d) {
                    const formatted = `${d}/${m}/${y}`;
                    handleChange({ target: { name: "dateOfBirth", value: formatted } } as any);
                    // Validate on change
                    setTimeout(() => handleBlur("dateOfBirth", formatted), 0);
                  }
                }}
                className="h-[50px]"
              />
            </div>
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Bio / About me
          </label>

          <div className="relative ">
            <textarea
              name="bio"
              rows={4}
              maxLength={500}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[#E4E4E4] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
            onClick={handleSave}
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
  onBlur,
  label,
  readOnly = false,
  error,
  required = false,
}: {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onBlur?: () => void;
  label: string;
  readOnly?: boolean;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        className={`w-full px-4 py-3 bg-[#FFFFFF] border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${error ? "border-red-500" : "border-[#E4E4E4]"
          } ${readOnly ? "bg-gray-50 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
