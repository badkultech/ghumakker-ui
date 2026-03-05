"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useDisplayedUser } from "@/hooks/useDisplayedUser";
import { Footer } from "@/components/homePage/sections/footer";
import { MainHeader } from "@/components/search-results/MainHeader";
import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { AuthModals } from "@/components/auth/auth/AuthModals";
import { userMenuItems } from "./constants";
import { HomeLayoutContext } from "./HomeLayoutContext";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, handleLogout } = useAuthActions();
    const router = useRouter();
    const pathname = usePathname();
    const user = useDisplayedUser();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [authStep, setAuthStep] = useState<"PHONE" | "OTP" | "REGISTER" | null>(null);
    const [hideHeader, setHideHeader] = useState(false);
    const [hideFooter, setHideFooter] = useState(false);
    const [showLoginRegister, setShowLoginRegister] = useState(false);

    const onLogout = () => handleLogout(() => setIsMenuOpen(false));
    const openLoginModal = () => setAuthStep("PHONE");

    // Route → page title mapping (logo की जगह text)
    const pageTitleMap: Record<string, string> = {
        "/home/invitations": "Trip Invitations",
        "/home/my-queries": "My Queries",
        "/home/wishlist": "Saved",
        "/home/settings": "Settings",
        "/home/compare-trips": "Compare Trips",
        "/home/leaders": "Trip Leaders",
    };

    // Current page ka title (prefix match के लिए)
    const logoText = Object.entries(pageTitleMap).find(([route]) =>
        pathname === route || pathname.startsWith(route + "/")
    )?.[1] ?? "";

    // Redirect to settings if profile incomplete
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
        <HomeLayoutContext.Provider value={{ openLoginModal, hideHeader, setHideHeader, hideFooter, setHideFooter, showLoginRegister, setShowLoginRegister, onMenuOpen: () => setIsMenuOpen(true) }}>
            <div className="flex flex-col min-h-screen">
                {/* Centralized Header — hidden when layout B/C active */}
                {!hideHeader && (
                    <MainHeader
                        isLoggedIn={isLoggedIn}
                        onLoginClick={openLoginModal}
                        onMenuOpen={() => setIsMenuOpen(true)}
                        variant="edge"
                        logoText={logoText}
                        showLoginRegister={showLoginRegister}
                    />
                )}

                {/* Page Content */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Footer — hidden when layout C active (has own footer) */}
                {!hideFooter && <Footer />}

                {/* Centralized Sidebar */}
                <SidebarMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    userMenuItems={userMenuItems}
                    onLogout={onLogout}
                    isLoggedIn={isLoggedIn}
                    user={user}
                />

                {/* Centralized Auth Modals */}
                <AuthModals authStep={authStep} setAuthStep={setAuthStep} />
            </div>
        </HomeLayoutContext.Provider>
    );
}
