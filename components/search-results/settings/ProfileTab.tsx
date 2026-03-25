"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { GradientButton } from "@/components/gradient-button";
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
        return "";

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Last name must be at least 2 characters";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};
    newErrors.firstName = validateField("firstName", formData.firstName);
    newErrors.lastName = validateField("lastName", formData.lastName);
    newErrors.email = validateField("email", formData.email);

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSaveProfile();
    }
  };

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-[800px]">

      <div className="bg-white border border-[#E4E4E4] rounded-xl p-8 md:p-10 w-full max-w-[703px] h-full min-h-[854px]">
        
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-500 text-[14px] mt-1 font-medium">Manage your personal information and public profile.</p>
      </div>
        {/* Profile Image Section */}
        <div className="bg-[#FFF8F7] border border-[#FFECEC] rounded-2xl px-6 flex items-center gap-6 mb-10 w-full max-w-[655px] h-[94px]">
          <Avatar className="w-20 h-20 border-2 border-white shadow-sm">
            <AvatarImage src={profileImageUrl || ""} />
            <AvatarFallback className="bg-[#FF3D3D] text-white text-2xl font-bold">
              {formData.firstName?.[0]?.toUpperCase()}
              {formData.lastName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-[#E4E4E4] rounded-full text-[14px] font-semibold hover:bg-gray-50 transition-colors w-fit shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Image
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

            <p className="text-[12px] text-gray-400 font-medium">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <InputField
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={() => handleBlur("firstName", formData.firstName)}
            label="First Name"
            placeholder="Enter first name"
            error={errors.firstName}
            required
          />

          <InputField
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={() => handleBlur("lastName", formData.lastName)}
            label="Last Name"
            placeholder="Enter last name"
            error={errors.lastName}
            required
          />

          <InputField
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email", formData.email)}
            label="Email Address"
            placeholder="Enter email address"
            error={errors.email}
            required
          />

          {/* Phone Number Section */}
          <div>
            <label className="block text-[14px] font-semibold mb-2 text-gray-900">Phone No.<span className="text-red-500 ml-1">*</span></label>
            <div className="flex gap-3">
              <div className="w-20">
                <div className="w-full h-[54px] flex items-center justify-center bg-[#F9FAFB] border border-[#E4E4E4] rounded-xl text-gray-600 font-medium">
                  {PHONE_CONFIG.DEFAULT_COUNTRY_CODE}
                </div>
              </div>
              <div className="flex-1">
                <input
                  name="phone"
                  value={extractPhoneNumber(formData.phone)}
                  onChange={handleChange}
                  placeholder="00111 22222"
                  className="w-full h-[54px] px-4 bg-[#FFFFFF] border border-[#E4E4E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[14px] font-semibold mb-2 text-gray-900">
              Gender<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-[54px] px-4 bg-[#FFFFFF] border border-[#E4E4E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-[14px] font-semibold mb-2 text-gray-900">
              Date of Birth<span className="text-red-500 ml-1">*</span>
            </label>
            <CustomDateTimePicker
              mode="date"
              placeholder="dd/mm/yyyy"
              maxDate={new Date().toISOString().split('T')[0]}
              value={(() => {
                if (!formData.dateOfBirth) return "";
                const parts = formData.dateOfBirth.split("/");
                return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : formData.dateOfBirth;
              })()}
              onChange={(val: string) => {
                if (!val) {
                  handleChange({ target: { name: "dateOfBirth", value: "" } } as any);
                  return;
                }
                const [y, m, d] = val.split("-");
                if (y && m && d) {
                  const formatted = `${d}/${m}/${y}`;
                  handleChange({ target: { name: "dateOfBirth", value: formatted } } as any);
                }
              }}
              className="h-[54px] rounded-xl border-[#E4E4E4]"
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <label className="block text-[14px] font-semibold mb-2 text-gray-900">
            Bio / About me
          </label>
          <div className="relative">
            <textarea
              name="bio"
              rows={4}
              maxLength={500}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="w-full p-4 bg-white border border-[#E4E4E4] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
            />
            <div className="absolute bottom-4 right-4 text-[12px] font-medium">
              <span className="text-red-500">{formData.bio.length}</span>
              <span className="text-gray-400">/500 Characters</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 mt-auto">
          <button 
            type="button"
            className="w-full md:min-w-[240px] py-4 bg-[#F6F6F6] text-gray-600 rounded-full font-bold text-[16px] hover:bg-gray-100 transition-colors"
            onClick={() => window.location.reload()}
          >
            Discard
          </button>
          <GradientButton 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:min-w-[240px] py-4 text-[16px] shadow-md hover:cursor-pointer"
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
  placeholder,
  readOnly = false,
  error,
  required = false,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[14px] font-semibold mb-2 text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 h-[54px] bg-[#FFFFFF] border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 ${
          error ? "border-red-500" : "border-[#E4E4E4]"
        } ${readOnly ? "bg-gray-50 cursor-not-allowed text-gray-500" : ""}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

