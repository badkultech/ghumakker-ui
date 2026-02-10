"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/search-results/settings/Sidebar";
import ProfileTab from "@/components/search-results/settings/ProfileTab";
import CommunicationsTab from "@/components/search-results/settings/CommunicationsTab";
import PreferencesTab from "@/components/search-results/settings/PreferencesTab";
import SupportTab from "@/components/search-results/settings/SupportTab";
import LegalTab from "@/components/search-results/settings/LegalTab";
import SecurityTab from "@/components/search-results/settings/SecurityTab";
import { LogoutModal } from "@/components/organizer/LogoutModal";
import DeactivateModal from "@/components/search-results/settings/DeactivateModal";
import DeleteModal from "@/components/search-results/settings/DeleteModal";
import { MainHeader } from "@/components/search-results/MainHeader";
import { notificationsData, userMenuItems } from "../constants";

import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useDeactivateUserMutation, useDeleteUserMutation, useGetTravelerProfileQuery, useUpdateTravelerProfileFormMutation } from "@/lib/services/user";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/hooks/use-toast";
import { showSuccess } from "@/lib/utils/toastHelpers";
import { Overlay } from "@/components/common/Overlay";
import { SearchTripsCard } from "@/components/homePage/shared/SearchTripsCardDesktop";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useDisplayedUser } from "@/hooks/useDisplayedUser";

export default function SettingsPage() {

  const [activeTab, setActiveTab] = useState("profile");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const organizationId = useOrganizationId();
  const userPublicId = useUserId();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isLoggedIn, handleLogout, router } = useAuthActions();
  const [notifications, setNotifications] = useState(notificationsData);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
  const [searchTab, setSearchTab] =
    useState<"destination" | "moods">("destination");
  const { userData } = useSelector(selectAuthState);
  const { data, isLoading } = useGetTravelerProfileQuery({
    organizationId: organizationId,
    userPublicId: userPublicId,
  });

  const user = useDisplayedUser();

  const [updateProfile, { isLoading: isSaving }] =
    useUpdateTravelerProfileFormMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    bio: "",
  });
  // ... (rest of code)

  const formatDateForUI = (date: string | null) => {
    if (!date) return "";

    // yyyy-mm-dd → dd/mm/yyyy
    const [yyyy, mm, dd] = date.split("-");
    if (!yyyy || !mm || !dd) return "";

    return `${dd}/${mm}/${yyyy}`;
  };

  useEffect(() => {
    if (!data) return;

    setFormData({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone: data.mobileNumber ?? "",
      gender: data.gender ?? "",
      dateOfBirth: formatDateForUI(data.dateOfBirth ?? ""),
      bio: data.bio ?? "",
    });
    setProfileImageUrl(data.profileImageUrl ?? null);
  }, [data]);

  const validateProfileForm = () => {
    if (!formData.firstName.trim()) {
      return "First name is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Enter a valid email address";
    }

    if (formData.phone && formData.phone.length !== 10) {
      return "Phone number must be 10 digits";
    }

    if (formData.dateOfBirth) {
      const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dobRegex.test(formData.dateOfBirth)) {
        return "Date of birth must be in dd/mm/yyyy format";
      }
    }

    return null;
  };


  const formatDateForApi = (date: string) => {
    if (!date) return null;
    const [dd, mm, yyyy] = date.split("/");
    if (!dd || !mm || !yyyy) return null;
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSaveProfile = async () => {
    if (!organizationId || !userPublicId) return;

    const validationError = validateProfileForm();
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationError,
      });
      return;
    }

    try {
      await updateProfile({
        organizationId,
        userPublicId,
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.phone,
          gender: formData.gender || null,
          dateOfBirth: formatDateForApi(formData.dateOfBirth),
          bio: formData.bio,
          profileImage: profileImage || undefined,
        },
      }).unwrap();

      toast({
        title: "Success 🎉",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error?.data?.message || "Something went wrong while updating profile",
      });
    }
  };

  const handleDeactivateAccount = async () => {
    if (!organizationId || !userPublicId) return;

    try {
      await deactivateUser({
        organizationId,
        publicId: userPublicId,
      }).unwrap();

      toast({
        title: "Account Deactivated",
        description: "Your account has been deactivated successfully",
      });

      handleLogout(); // logout after deactivate
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed",
        description:
          error?.data?.message || "Unable to deactivate account",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!organizationId || !userPublicId) return;

    try {
      await deleteUser({
        organizationId,
        publicId: userPublicId,
      }).unwrap();

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
      });

      handleLogout(); // logout after delete
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed",
        description:
          error?.data?.message || "Unable to delete account",
      });
    }
  };





  const onLogout = () => {
    handleLogout(() => setSidebarOpen(false));
  };
  const handleConfirmLogout = () => {
    handleLogout(() => setShowLogoutModal(false));
  };

  return (
    <>
      <div className="min-h-screen bg-background w-full">

        {/* ✅ HEADER FIXED */}
        <MainHeader logoText="Settings"
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          onUpdateNotifications={setNotifications}
          onMenuOpen={() => setSidebarOpen(true)}
          onLoginClick={() => setAuthStep("PHONE")}
          variant="edge"
        />

        {/* MAIN CONTENT AREA */}
        <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">

            {/* SIDEBAR */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* TAB CONTENT */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <ProfileTab formData={formData} setFormData={setFormData}
                  profileImageUrl={profileImageUrl}
                  onImageSelect={(file) => {
                    setProfileImage(file);
                    setProfileImageUrl(URL.createObjectURL(file));
                  }}
                  onSaveProfile={handleSaveProfile} isSaving={isSaving} />
              )}

              {activeTab === "communications" && (
                <CommunicationsTab />
              )}

              {activeTab === "preferences" && <PreferencesTab />}
              {activeTab === "support" && <SupportTab />}
              {activeTab === "legal" && <LegalTab />}

              {activeTab === "security" && (
                <SecurityTab
                  setShowLogoutModal={setShowLogoutModal}
                  setShowDeactivateModal={setShowDeactivateModal}
                  setShowDeleteModal={setShowDeleteModal}
                />
              )}
            </div>
          </div>
        </main>

        {/* MODALS */}
        <LogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleConfirmLogout}
        />
        <DeactivateModal open={showDeactivateModal} onClose={() => setShowDeactivateModal(false)}
          onConfirm={handleDeactivateAccount} />
        <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount} />

      </div>
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userMenuItems={userMenuItems}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
        user={user}
      />
      <Overlay open={showSearchOverlay} onClose={() => setShowSearchOverlay(false)}>
        <SearchTripsCard defaultTab={searchTab}
          onClose={() => setShowSearchOverlay(false)} />
      </Overlay>
    </>
  );
}
