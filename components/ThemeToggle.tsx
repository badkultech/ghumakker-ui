"use client";

import { useTheme } from "./ThemeProvider";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const themes = [
    { id: "red", color: "#FF002B", label: "Red" },
    { id: "blue", color: "#4361EE", label: "Blue" },
    { id: "purple", color: "#9333EA", label: "Purple" },
    { id: "orange", color: "#FEA901", label: "Orange" },
] as const;

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0 text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
                    title={`Change Theme (Current: ${theme})`}
                >
                    <Palette className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-3 rounded-[32px] border-none shadow-[0_10px_40px_rgba(0,0,0,0.1)] bg-white"
                sideOffset={10}
                align="center"
            >
                <div className="flex items-center gap-3 px-1">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id as any)}
                            className={cn(
                                "relative w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95",
                                theme === t.id && "scale-110"
                            )}
                            style={{
                                backgroundColor: t.color,
                                border: theme === t.id ? `2.5px solid white` : 'none',
                                boxShadow: theme === t.id ? `0 0 0 1.5px ${t.color}` : 'none'
                            }}
                            title={t.label}
                        />
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
