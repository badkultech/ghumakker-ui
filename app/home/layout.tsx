"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useDisplayedUser } from "@/hooks/useDisplayedUser";
import { Footer } from "@/components/homePage/sections/footer";

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
        if (
            isLoggedIn &&
            user &&
            user.name.trim() === "" &&
            !pathname.includes("/settings")
        ) {
            router.push("/home/settings?setup=true");
        }
    }, [isLoggedIn, user, router, pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    );
}
