"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { selectAuthState } from "@/lib/slices/auth";
import { ROLES } from "@/lib/utils";

type Theme = "orange" | "blue" | "red" | "purple";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { userData } = useSelector(selectAuthState);
    const pathname = usePathname();
    const [theme, setThemeState] = useState<Theme>("blue");
    const [hasMounted, setHasMounted] = useState(false);

    // Initial logic to determine theme
    useEffect(() => {
        setHasMounted(true);

        // Preview Priority (no localStorage side-effect)
        const currentUrl = window.location.search;
        const urlParams = new URLSearchParams(currentUrl);
        const urlLayout = urlParams.get("layout");
        if (urlLayout) {
            const suffix = urlLayout.split("_")[1]?.toUpperCase();
            const urlThemeMap: Record<string, Theme> = {
                "RED": "red", "BLUE": "blue", "PURPLE": "purple", "ORANGE": "orange"
            };
            if (suffix && urlThemeMap[suffix]) {
                setThemeState(urlThemeMap[suffix]);
                return;
            }
        }

        const savedTheme = localStorage.getItem("ui-theme") as Theme;
        if (savedTheme && ["orange", "blue", "red", "purple"].includes(savedTheme)) {
            setThemeState(savedTheme);
        } else {
            // Fallback to auto-detection if no preference saved
            const userType = userData?.userType;
            const isOrganizerRoute = pathname?.startsWith("/organizer");
            const isOrganizerUser = userType === ROLES.ORGANIZER;

            if (isOrganizerUser || isOrganizerRoute) {
                setThemeState("blue");
            } else {
                setThemeState("red"); // Default to red
            }
        }
    }, [userData, pathname]); 

    // Apply theme to DOM
    useEffect(() => {
        if (!hasMounted) return;

        const root = document.documentElement;
        root.setAttribute("data-theme", theme);

        // Don't save preview themes to localStorage!
        const isPreview = window.location.search.includes("layout=");
        if (!isPreview) {
            localStorage.setItem("ui-theme", theme);
        }
    }, [theme, hasMounted]);

    const toggleTheme = () => {
        setThemeState((prev) => {
            if (prev === "blue") return "purple";
            if (prev === "purple") return "red";
            if (prev === "red") return "orange";
            return "blue";
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
