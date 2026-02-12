"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Upload, CheckCircle2, XCircle } from "lucide-react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { useChangePasswordMutation } from "@/lib/services/login";
import { showApiError, showSuccess, showError } from "@/lib/utils/toastHelpers";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetTravelerProfileQuery, useUpdateTravelerProfileFormMutation } from "@/lib/services/user";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCreateOrganizationPreferenceMutation, useGetOrganizationPreferenceQuery, useUpdateOrganizationPreferenceMutation } from "@/lib/services/organizer/organizationPreference";
import { useGetOrganizationNotificationPreferencesQuery, useSaveOrganizationNotificationPreferenceMutation } from "@/lib/services/superadmin/notification";
import { PHONE_CONFIG, extractPhoneNumber, formatPhoneWithCountryCode } from "@/lib/constants/phone";

export default function SettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    type NotificationPreference = {
        categoryCode: "NEW_BOOKING" | "NEW_QUERY" | "NEW_LEAD";
        title: string;
        description: string;
        channel: "IN_APP";
        enabled: boolean;
    };
    type OrganizationPreference = {
        language: string;
        currency: string;
        timezone: string;
        dateFormat: string;
    };

    const [organizationPreferences, setOrganizationPreferences] = useState<OrganizationPreference>({
        language: "English",
        currency: "INR",
        timezone: "IST",
        dateFormat: "DD/MM/YYYY",
    });
    const [preferences, setPreferences] = useState<NotificationPreference[]>([
        {
            categoryCode: "NEW_LEAD",
            title: "New Lead Alerts",
            description: "Get notified when someone creates a lead",
            channel: "IN_APP",
            enabled: true,
        },
        {
            categoryCode: "NEW_BOOKING",
            title: "New Booking Alerts",
            description: "Get notified when someone books a trip",
            channel: "IN_APP",
            enabled: true,
        },
        {
            categoryCode: "NEW_QUERY",
            title: "Query Notifications",
            description: "Receive alerts for new user queries",
            channel: "IN_APP",
            enabled: true,
        },
    ]);


    // password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const { userData } = useSelector(selectAuthState);
    const organizationId = useOrganizationId();
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    const {
        data: travelerProfile,
        isLoading: travelerProfileLoading,
    } = useGetTravelerProfileQuery(
        organizationId && userData?.userPublicId
            ? {
                organizationId,
                userPublicId: userData.userPublicId,
            }
            : skipToken
    );
    const [updateTravelerProfile, { isLoading: isUpdating }] =
        useUpdateTravelerProfileFormMutation();

    const {
        data: orgPreference,
        isLoading: orgPrefLoading,
    } = useGetOrganizationPreferenceQuery(
        organizationId ? { organizationId } : skipToken
    );
    const [createOrgPreference, { isLoading: creatingPref }] =
        useCreateOrganizationPreferenceMutation();

    const [updateOrgPreference, { isLoading: updatingPref }] =
        useUpdateOrganizationPreferenceMutation();
    const {
        data: orgNotificationPreferences,
        isLoading: orgNotificationPrefLoading,
    } = useGetOrganizationNotificationPreferencesQuery(
        organizationId ? { organizationId } : skipToken
    );

    const [
        saveOrgNotificationPreference,
        { isLoading: savingNotificationPref },
    ] = useSaveOrganizationNotificationPreferenceMutation();


    const CATEGORY_ID_MAP: Record<
        "NEW_LEAD" | "NEW_BOOKING" | "NEW_QUERY",
        number
    > = {
        NEW_LEAD: 1,
        NEW_BOOKING: 2,
        NEW_QUERY: 3,
    };


    useEffect(() => {
        if (!orgPreference) return;

        setOrganizationPreferences({
            language: orgPreference.language,
            currency: orgPreference.currency,
            timezone: orgPreference.timezone,
            dateFormat: orgPreference.dateFormat,
        });
    }, [orgPreference]);


    useEffect(() => {
        if (!travelerProfile) return;

        setName(
            `${travelerProfile.firstName ?? ""} ${travelerProfile.lastName ?? ""}`.trim()
        );
        setTagline(travelerProfile.tagline ?? "");
        setEmail(travelerProfile.email ?? "");
        setMobileNumber(extractPhoneNumber(travelerProfile.mobileNumber ?? ""));
        setProfileImageUrl(travelerProfile.profileImageUrl ?? null);


    }, [travelerProfile]);
    useEffect(() => {
        if (!orgNotificationPreferences?.length) return;

        setPreferences((prev) =>
            prev.map((p) => {
                const apiPref = orgNotificationPreferences.find(
                    (x) =>
                        x.categoryCode === p.categoryCode &&
                        x.channel === p.channel
                );

                return apiPref ? { ...p, enabled: apiPref.enabled } : p;
            })
        );
    }, [orgNotificationPreferences]);


    const handleUpdateProfile = async () => {
        try {
            if (!organizationId || !userData?.userPublicId) return;

            const [firstName, ...rest] = name.trim().split(" ");
            const lastName = rest.join(" ");

            await updateTravelerProfile({
                organizationId,
                userPublicId: userData.userPublicId,
                body: {
                    firstName: firstName || null,
                    lastName: lastName || null,
                    tagline: tagline || null,
                    email: email || null,
                    mobileNumber: mobileNumber ? formatPhoneWithCountryCode(mobileNumber) : null,
                    profileImage: profileImageFile ?? null,
                },
            }).unwrap();

            showSuccess("Profile updated successfully");
        } catch (error) {
            showApiError(error);
        }
    };

    const handleSaveOrganizationPreference = async () => {
        if (!organizationId) return;

        try {
            if (orgPreference?.id) {
                // ✅ UPDATE (PUT)
                await updateOrgPreference({
                    organizationId,
                    body: {
                        id: orgPreference.id,
                        ...organizationPreferences,
                    },
                }).unwrap();

                showSuccess("Organization preferences updated");
            } else {
                // ✅ CREATE (POST)
                await createOrgPreference({
                    organizationId,
                    body: organizationPreferences,
                }).unwrap();

                showSuccess("Organization preferences saved");
            }
        } catch (error) {
            showApiError(error);
        }
    };

    const handleSaveNotificationPreferences = async () => {
        if (!organizationId) return;

        try {
            await Promise.all(
                preferences.map((pref) =>
                    saveOrgNotificationPreference({
                        organizationId,
                        body: {
                            organizationId: Number(organizationId),
                            categoryId: CATEGORY_ID_MAP[pref.categoryCode],
                            categoryCode: pref.categoryCode,
                            categoryName: pref.title,
                            channel: pref.channel,
                            enabled: pref.enabled,
                        },
                    }).unwrap()
                )
            );

            showSuccess("Notification preferences updated");
        } catch (error) {
            showApiError(error);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProfileImageFile(file);

        const previewUrl = URL.createObjectURL(file);
        setProfileImageUrl(previewUrl);
    };



    const [changePassword, { isLoading }] = useChangePasswordMutation();
    // 🧠 password rule checks
    // ✅ Password strength & validation rules
    const rules = useMemo(() => {
        return {
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        };
    }, [newPassword]);

    // ✅ Determine if all rules pass
    const allValid =
        currentPassword.trim() &&
        newPassword.trim() &&
        confirmPassword.trim() &&
        newPassword === confirmPassword &&
        Object.values(rules).every(Boolean);

    const handlePasswordUpdate = async () => {
        if (!allValid) return; // should never happen if button disabled

        try {
            await changePassword({
                currentPassword,
                newPassword,
                email
            }).unwrap();

            showSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            if (error?.data?.message) {
                showError(error.data.message);
            } else {
                showApiError(error);
            }
        }
    };


    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <OrganizerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader title="Settings" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">Settings</h1>

                    </div>

                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Image Upload */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img
                                    src={profileImageUrl || "/images/profile.png"}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                />

                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                        asChild
                                    >
                                        <label htmlFor="profileImage">
                                            <Upload className="w-4 h-4" />
                                            Upload New Image
                                        </label>
                                    </Button>

                                    <input
                                        id="profileImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />

                                    <p className="text-xs text-gray-500">
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>

                            </div>


                            {/* Input Fields */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input placeholder="Organizer Name" value={name} onChange={(e) => setName(e.target.value)} />
                                <Input placeholder="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                                <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                                {/* Mobile Number with Country Code */}
                                <div className="flex gap-2">
                                    <Input
                                        value={PHONE_CONFIG.DEFAULT_COUNTRY_CODE}
                                        readOnly
                                        className="w-20 text-center bg-gray-50 cursor-not-allowed"
                                    />
                                    <Input
                                        placeholder={PHONE_CONFIG.PLACEHOLDER}
                                        value={extractPhoneNumber(mobileNumber)}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, "");
                                            setMobileNumber(v.slice(0, PHONE_CONFIG.PHONE_NUMBER_LENGTH));
                                        }}
                                        maxLength={PHONE_CONFIG.PHONE_NUMBER_LENGTH}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={isUpdating}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>

                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {preferences.map((pref) => (
                                <div
                                    key={`${pref.categoryCode}-${pref.channel}`}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{pref.title}</p>
                                        <p className="text-sm text-gray-500">{pref.description}</p>
                                    </div>

                                    <Switch
                                        checked={pref.enabled}
                                        onCheckedChange={(checked) =>
                                            setPreferences((prev) =>
                                                prev.map((p) =>
                                                    p.categoryCode === pref.categoryCode &&
                                                        p.channel === pref.channel
                                                        ? { ...p, enabled: checked }
                                                        : p
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ))}

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSaveNotificationPreferences}
                                    disabled={savingNotificationPref}
                                >
                                    {savingNotificationPref ? "Saving..." : "Save Preferences"}
                                </Button>

                            </div>
                        </CardContent>
                    </Card>


                    {/* Account Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Preferences</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Language */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Language</p>
                                    <Select
                                        value={organizationPreferences.language}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, language: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Hindi">Hindi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Time Zone */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Time Zone</p>
                                    <Select
                                        value={organizationPreferences.timezone}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, timezone: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Time Zone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IST">IST (GMT +5:30)</SelectItem>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="PST">PST (GMT -8:00)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Currency */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Currency</p>
                                    <Select
                                        value={organizationPreferences.currency}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, currency: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Format */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Date Format</p>
                                    <Select
                                        value={organizationPreferences.dateFormat}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, dateFormat: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Date Format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button onClick={handleSaveOrganizationPreference} disabled={creatingPref || updatingPref} > {creatingPref || updatingPref ? "Saving..." : "Save Preferences"} </Button>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Current Password</p>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="**************"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* New Password */}
                                <div className="relative">
                                    <p className="text-sm font-medium mb-1">New Password</p>
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="**************"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        maxLength={50}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-9 text-gray-500"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Password Strength */}
                                    {newPassword && (
                                        <div className="mt-4 space-y-1">
                                            <div className="flex items-center text-sm">
                                                {rules.length ? (
                                                    <CheckCircle2 className="text-primary mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">8+ characters</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {rules.uppercase ? (
                                                    <CheckCircle2 className="text-primary mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">1 uppercase letter</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {rules.number ? (
                                                    <CheckCircle2 className="text-primary mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">1 number</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {rules.special ? (
                                                    <CheckCircle2 className="text-primary mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">
                                                    1 special symbol (!@#$)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div className="relative">
                                    <p className="text-sm font-medium mb-1">Confirm New Password</p>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="**************"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-9 text-gray-500"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Inline error message */}
                                    {confirmPassword &&
                                        newPassword &&
                                        confirmPassword !== newPassword && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Passwords do not match
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <Button
                                    variant="outline"
                                    className="text-sm text-gray-700 border-gray-300"
                                >
                                    Forgot Password?
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handlePasswordUpdate}
                                    disabled={!allValid || isLoading}
                                    className={`${allValid
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {isLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </main>
            </div>
        </div>
    );
}
