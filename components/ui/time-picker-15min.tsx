"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

export function TimePicker15Min({
    value,
    onChange,
    className,
    ...props
}: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Parse current value
    const [selectedHour, selectedMinute] = value ? value.split(":") : ["", ""];

    // Generate hours (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

    // Generate minutes in 15-minute intervals
    const minutes = ["00", "15", "30", "45"];

    // Effect to close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleHourSelect = (h: string) => {
        // If minute is not selected, default to 00
        const m = selectedMinute || "00";
        onChange(`${h}:${m}`);
        // Keep open to select minute, or close? Usually keep open for standard pickers until both selected or clicked outside
    };

    const handleMinuteSelect = (m: string) => {
        // If hour is not selected, default to current hour or 12
        const h = selectedHour || "12";
        onChange(`${h}:${m}`);
        setIsOpen(false); // Close after minute selection usually
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={() => setIsOpen(!isOpen)}
                    readOnly
                    className={`cursor-pointer pr-10 ${className || ""}`} // padding for icon
                    {...props}
                />
                <Clock
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-[200px] bg-popover border border-border rounded-md shadow-lg p-2 flex gap-2 h-60">
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {/* Hours Column */}
                    <div
                        className="flex-1 overflow-y-auto no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="text-xs font-semibold text-center mb-1 text-muted-foreground">Hr</div>
                        {hours.map((h) => (
                            <div
                                key={h}
                                onClick={() => handleHourSelect(h)}
                                className={`px-2 py-1.5 text-center text-sm cursor-pointer hover:bg-muted rounded-sm transition-colors ${h === selectedHour ? "bg-primary text-primary-foreground font-medium" : ""
                                    }`}
                            >
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="w-[1px] bg-border my-2"></div>

                    {/* Minutes Column */}
                    <div
                        className="flex-1 overflow-y-auto no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="text-xs font-semibold text-center mb-1 text-muted-foreground">Min</div>
                        {minutes.map((m) => (
                            <div
                                key={m}
                                onClick={() => handleMinuteSelect(m)}
                                className={`px-2 py-1.5 text-center text-sm cursor-pointer hover:bg-muted rounded-sm transition-colors ${m === selectedMinute ? "bg-primary text-primary-foreground font-medium" : ""
                                    }`}
                            >
                                {m}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
