"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectAuthState } from "@/lib/slices/auth";
import { ROLES } from "@/lib/utils";

type Theme = "traveler" | "organizer" | "ragir" | "purple";

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
        const savedTheme = localStorage.getItem("ui-theme") as Theme;

        if (savedTheme && ["traveler", "organizer", "ragir", "purple"].includes(savedTheme)) {
            setThemeState(savedTheme);
        } else {
            // Fallback to auto-detection if no preference saved
            const userType = userData?.userType;
            const isOrganizerRoute = pathname?.startsWith("/organizer");
            const isOrganizerUser = userType === ROLES.ORGANIZER;

            if (isOrganizerUser || isOrganizerRoute) {
                setThemeState("organizer");
            } else {
                setThemeState("ragir"); // Default to ragir for home/traveler based on user's new request
            }
        }
    }, [userData, pathname]); // Re-run if user/path changes AND no saved preference (handled inside)

    // Apply theme to DOM
    useEffect(() => {
        if (!hasMounted) return;

        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        localStorage.setItem("ui-theme", theme);
    }, [theme, hasMounted]);

    const toggleTheme = () => {
        setThemeState((prev) => {
            if (prev === "organizer") return "purple";
            if (prev === "purple") return "ragir";
            if (prev === "ragir") return "traveler";
            return "organizer";
        });
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

