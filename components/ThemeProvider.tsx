"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectAuthState } from "@/lib/slices/auth";
import { ROLES } from "@/lib/utils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { userData } = useSelector(selectAuthState);
    const pathname = usePathname();

    useEffect(() => {
        const root = document.documentElement;
        const userType = userData?.userType;

        // Apply Organizer theme if user is Organizer OR if they are viewing Organizer pages
        const isOrganizerRoute = pathname?.startsWith("/organizer");
        const isOrganizerUser = userType === ROLES.ORGANIZER;

        if (isOrganizerUser || isOrganizerRoute) {
            root.setAttribute("data-theme", "organizer");
        } else {
            root.removeAttribute("data-theme");
        }
    }, [userData, pathname]);

    return <>{children}</>;
}
