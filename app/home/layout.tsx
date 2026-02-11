"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useDisplayedUser } from "@/hooks/useDisplayedUser";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn } = useAuthActions();
    const router = useRouter();
    const pathname = usePathname();
    const user = useDisplayedUser();

    useEffect(() => {
        // If logged in, and user object exists (means profile loaded)
        // If name is explicitly empty string (indicating missing first name)
        // And we are NOT already on the settings page
        if (
            isLoggedIn &&
            user &&
            user.name.trim() === "" &&
            !pathname.includes("/settings")
        ) {
            router.push("/home/settings?setup=true");
        }
    }, [isLoggedIn, user, router, pathname]);

    return <>{children}</>;
}
