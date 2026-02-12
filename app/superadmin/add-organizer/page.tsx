"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import {
  useGetNextOrganizatioNumberQuery,
  useCreateOrganizationMutation,
} from "@/lib/services/superadmin/add-organizer";
import { showError, showSuccess } from "@/lib/utils/toastHelpers";
import {
  BusinessType,
  RegisterOrganizerRequest,
} from "@/lib/services/superadmin/add-organizer/type";
import { AppHeader } from "@/components/app-header";
import RequiredStar from "@/components/common/RequiredStar";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { ROUTES } from "@/lib/utils";
import { PHONE_CONFIG, formatPhoneWithCountryCode, isValidPhoneLength } from "@/lib/constants/phone";

type FormFields = {
  organizerId: string;
  name: string;
  email: string;
  phone: string;
  businessType: BusinessType["code"];
};

export default function RegisterOrganizer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FormFields>({
    organizerId: "",
    name: "",
    email: "",
    phone: "",
    businessType: "OTHER",
  });

  const router = useRouter();
  const organizationId = useOrganizationId();

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data } = useGetNextOrganizatioNumberQuery(organizationId);
  const [createOrganization] = useCreateOrganizationMutation();

  const validate = () => {
    const next: typeof errors = {};
    if (!formData.name.trim()) {
      next.name = "Organizer name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      next.name = "Name can only contain letters and spaces";
    } else if (formData.name.trim().length < 3) {
      next.name = "Name must be at least 3 characters long";
    } else if (formData.name.trim().length > 70) {
      next.name = "Name cannot exceed 70 characters";
    }
    if (
      !formData.email.trim() ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)
    )
      next.email = "Enter a valid email";

    if (!isValidPhoneLength(formData.phone))
      next.phone = PHONE_CONFIG.ERRORS.INVALID_LENGTH;

    if (!formData.businessType) next.businessType = "Select business type";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((f) => ({ ...f, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: RegisterOrganizerRequest = {
        entityName: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        businessType: formData.businessType,
        organizationNumber: data ?? "",
        primaryPhone: formatPhoneWithCountryCode(formData.phone.trim()),
      };

      await createOrganization({ payload }).unwrap();
      router.push(ROUTES.SUPER_ADMIN.ORGANIZERS);
      showSuccess("Organizer registered successfully!");
    } catch (error) {
      console.error("Error registering organizer:", error);
      showError("Failed to register organizer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <AppHeader
          title="Register New Organizer"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex flex-1 items-start justify-start p-2 w-full overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm border p-4 w-full">
            <form
              onSubmit={onSubmit}
              className="space-y-6 flex flex-col items-left"
            >
              {/* Header */}
              <div className="flex items-center mb-2 w-3/4">
                <Link
                  href={ROUTES.SUPER_ADMIN.ORGANIZERS}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Back to Organizers"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  Register New Organizer
                </h1>
              </div>

              {/* Organizer ID */}
              <div className="w-3/4">
                <Label htmlFor="organizerId" className="text-sm font-medium">
                  Organizer ID
                </Label>
                <Input
                  id="organizerId"
                  value={data ?? ""}
                  readOnly
                  disabled
                  className="bg-gray-100 text-gray-500 cursor-not-allowed  w-full"
                />
              </div>

              {/* Organizer Name */}
              <div className="w-3/4">
                <Label htmlFor="name" className="text-sm font-medium">
                  Organizer Name <RequiredStar />
                </Label>
                <Input
                  id="name"
                  placeholder="Enter organizer name"
                  value={formData.name}
                  onChange={onChange}
                  maxLength={70}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs ">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="w-3/4">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <RequiredStar />
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={onChange}
                  className={` w-full ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs ">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="w-3/4">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone No. <RequiredStar />
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center justify-center px-3 h-10 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm">
                    {PHONE_CONFIG.DEFAULT_COUNTRY_CODE}
                  </span>
                  <Input
                    id="phone"
                    inputMode="numeric"
                    placeholder={PHONE_CONFIG.PLACEHOLDER}
                    value={formData.phone}
                    onChange={(e) => {
                      let digits = e.target.value.replace(/\D/g, "");
                      if (digits.length > PHONE_CONFIG.PHONE_NUMBER_LENGTH)
                        digits = digits.slice(0, PHONE_CONFIG.PHONE_NUMBER_LENGTH);
                      setFormData((f) => ({ ...f, phone: digits }));
                    }}
                    maxLength={PHONE_CONFIG.PHONE_NUMBER_LENGTH}
                    className={`h-10 px-3 text-sm rounded-l-none w-full ${errors.phone ? "border-red-500" : ""
                      }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs ">{errors.phone}</p>
                )}
              </div>

              {/* Business Type */}
              <div className="w-3/4">
                <Label className="text-sm font-medium">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(v) =>
                    setFormData((f) => ({
                      ...f,
                      businessType: v as BusinessType["code"],
                    }))
                  }
                >
                  <SelectTrigger
                    className={` h-10 text-sm w-full ${errors.businessType ? "border-red-500" : ""
                      }`}
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOUR_OPERATOR">Tour Operator</SelectItem>
                    <SelectItem value="TRAVEL_AGENCY">Travel Agency</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="text-red-500 text-xs ">
                    {errors.businessType}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2 w-3/4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 text-sm font-medium text-white rounded-full shadow hover:shadow-md transition disabled:opacity-60 bg-brand-gradient"
                >
                  Register Organizer
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
