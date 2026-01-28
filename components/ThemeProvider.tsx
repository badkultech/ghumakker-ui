"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectAuthState } from "@/lib/slices/auth";
import { ROLES } from "@/lib/utils";

type Theme = "traveler" | "organizer";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { userData } = useSelector(selectAuthState);
    const pathname = usePathname();
    const [theme, setThemeState] = useState<Theme>("organizer");
    const [hasMounted, setHasMounted] = useState(false);

    // Initial logic to determine theme
    useEffect(() => {
        setHasMounted(true);
        const savedTheme = localStorage.getItem("ui-theme");

        if (savedTheme === "traveler") {
            setThemeState("traveler");
        } else if (savedTheme === "organizer") {
            setThemeState("organizer");
        } else {
            // Fallback to auto-detection if no preference saved
            const userType = userData?.userType;
            const isOrganizerRoute = pathname?.startsWith("/organizer");
            const isOrganizerUser = userType === ROLES.ORGANIZER;

            if (isOrganizerUser || isOrganizerRoute) {
                setThemeState("organizer");
            } else {
                // Default to organizer (Blue) as requested "filhal"
                setThemeState("organizer");
            }
        }
    }, [userData, pathname]); // Re-run if user/path changes AND no saved preference (handled inside)

    // Apply theme to DOM
    useEffect(() => {
        if (!hasMounted) return;

        const root = document.documentElement;
        if (theme === "traveler") {
            root.setAttribute("data-theme", "traveler");
        } else {
            // Organizer is Blue, which matches :root now, or explicit organizer theme
            root.setAttribute("data-theme", "organizer");
        }
        localStorage.setItem("ui-theme", theme);
    }, [theme, hasMounted]);

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "organizer" ? "traveler" : "organizer"));
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

