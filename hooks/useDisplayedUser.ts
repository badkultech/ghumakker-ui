"use client";

import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useUserId } from "@/hooks/useUserId";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { useGetTravelerProfileQuery } from "@/lib/services/user";

export interface DisplayedUser {
    name: string;
    email: string;
    profileImage?: string;
}

export const useDisplayedUser = (): DisplayedUser | undefined => {
    const { userData } = useSelector(selectAuthState);
    const organizationId = useOrganizationId();
    const userId = useUserId();

    const { data: focusedProfile, isFetching } = useGetTravelerProfileQuery(
        { organizationId, userPublicId: userId },
        { skip: !userId || !organizationId }
    );

    if (userId) {
        if (isFetching) {
            return {
                name: "Loading...",
                email: "",
                profileImage: undefined,
            };
        }

        if (focusedProfile) {
            return {
                name: focusedProfile.firstName
                    ? `${focusedProfile.firstName} ${focusedProfile.lastName ?? ""}`
                    : "",
                email: focusedProfile.email || "",
                profileImage: focusedProfile.profileImageUrl || undefined,
            };
        }
        // Loading state for focused user
        return {
            name: "Loading...",
            email: "",
            profileImage: undefined,
        };
    }

    // Fallback to logged-in user data
    if (userData) {
        return {
            name: userData.firstName
                ? `${userData.firstName} ${userData.lastName ?? ""}`
                : "",
            email: userData.email as string,
            profileImage: userData.profileImageUrl,
        };
    }

    return undefined;
};
