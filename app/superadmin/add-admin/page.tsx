"use client";

import { ChevronLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "@/components/superadmin/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateSuperAdminMutation,
  useGetNextAdminIdQuery,
} from "@/lib/services/superadmin/add-admin";
import { GradientButton } from "@/components/gradient-button";
import { CreateSuperAdminRequest } from "@/lib/services/superadmin/add-admin/types";
import { showApiError, showSuccess } from "@/lib/utils/toastHelpers";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import RequiredStar from "@/components/common/RequiredStar";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { ROUTES, MESSAGES } from "@/lib/utils";

export default function AddAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "SYSTEM_ADMIN",
    employeeNumber: "",
  });
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const organizationId = useOrganizationId();
  const { data: data } = useGetNextAdminIdQuery(organizationId);
  const router = useRouter();
  const [createSuperAdmin] = useCreateSuperAdminMutation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return MESSAGES.VALIDATION.EMAIL_REQUIRED;
    if (!emailRegex.test(email)) return MESSAGES.VALIDATION.EMAIL_INVALID;
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData((prev) => ({ ...prev, email }));
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert(MESSAGES.VALIDATION.REQUIRED_FIELDS);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateSuperAdminRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        roles: [formData.role],
        employeeNumber: data ?? "",
      };

      await createSuperAdmin({ organizationId, payload }).unwrap();
      await createSuperAdmin({ organizationId, payload }).unwrap();
      showSuccess(MESSAGES.SUPER_ADMIN.INVITE_SENT);
      router.push(ROUTES.SUPER_ADMIN.ADMINS);
    } catch (err) {
      showApiError(err as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <AppHeader title="Add Admins" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-sm border p-6 w-full max-w-3xl">
            {/* Back Button + Title */}
            <div className="flex items-center mb-6">
              <Link
                href={ROUTES.SUPER_ADMIN.ADMINS}
                className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back to Admins"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Admin
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Admin ID */}
                <div>
                  <Label htmlFor="adminId" className="text-sm font-medium">
                    Admin ID
                  </Label>
                  <Input
                    id="adminId"
                    value={data ?? ""}
                    readOnly
                    disabled
                    className="bg-gray-100 text-gray-500 cursor-not-allowed mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <RequiredStar />
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`mt-1 ${emailError ? "border-red-500" : ""}`}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name <RequiredStar />
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                    className="mt-1"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name <RequiredStar />
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <Label className="text-sm font-medium">Select Role Level</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM_ADMIN">
                      Super Admin (Full Control)
                    </SelectItem>
                    <SelectItem value="ORGANIZATION_ADMIN">
                      Admin (Limited Access)
                    </SelectItem>
                    <SelectItem value="MODERATOR">
                      Moderator (Content Management)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Important:</span> The new
                    admin will receive an email invitation with their pre-filled
                    email address and setup instructions.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <GradientButton
                type="submit"
                disabled={isSubmitting || !!emailError}
                className="w-full justify-center py-2 text-sm"
              >
                Send Admin Invitation
              </GradientButton>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
