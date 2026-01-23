"use client";

import { useTheme } from "./ThemeProvider";
import { Palette, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 p-0 text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors"
            title={`Switch to ${theme === "default" ? "Organizer" : "Default"} Theme`}
        >
            {theme === "default" ? (
                <Palette className="w-5 h-5" />
            ) : (
                <Palette className="w-5 h-5 text-primary" />
            )}
        </Button>
    );
}
