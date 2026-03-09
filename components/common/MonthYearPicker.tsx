"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH_IDX = new Date().getMonth();

interface MonthYearPickerProps {
    month: string;
    year: number;
    onChange: (month: string, year: number) => void;
}

export function MonthYearPicker({ month, year, onChange }: MonthYearPickerProps) {
    const [open, setOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(year);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Sync internal year when prop changes
    useEffect(() => { setPickerYear(year); }, [year]);

    const handleMonthClick = (m: string) => {
        const idx = MONTHS.indexOf(m);
        const isPast = pickerYear === CURRENT_YEAR && idx < CURRENT_MONTH_IDX;
        if (isPast) return;
        onChange(m, pickerYear);
        setOpen(false);
    };

    return (
        <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
            {/* Pill trigger */}
            <button
                onClick={() => setOpen(p => !p)}
                style={{
                    display: "flex", alignItems: "center", gap: 8,
                    border: "1.5px solid #e5e7eb", borderRadius: 999,
                    padding: "10px 16px", background: "#fff", cursor: "pointer",
                    fontSize: 14, color: "#374151", whiteSpace: "nowrap",
                    fontFamily: "inherit",
                }}
            >
                <CalendarDays size={13} color="#9ca3af" />
                {month} {year}
                <ChevronDown size={12} color="#9ca3af" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>

            {/* Dropdown */}
            {open && (
                <div style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff", borderRadius: 14, padding: "14px 16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    zIndex: 50, width: 260,
                }}>
                    {/* Year row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <button
                            onClick={() => pickerYear > CURRENT_YEAR && setPickerYear(y => y - 1)}
                            style={{
                                background: "none", border: "none", padding: 4,
                                cursor: pickerYear > CURRENT_YEAR ? "pointer" : "not-allowed",
                                opacity: pickerYear > CURRENT_YEAR ? 1 : 0.3,
                            }}
                        >
                            <ChevronLeft size={16} color="#374151" />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{pickerYear}</span>
                        <button
                            onClick={() => setPickerYear(y => y + 1)}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                        >
                            <ChevronRight size={16} color="#374151" />
                        </button>
                    </div>

                    {/* Month grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {MONTHS.map((m, idx) => {
                            const isPast = pickerYear === CURRENT_YEAR && idx < CURRENT_MONTH_IDX;
                            const isSelected = m === month && pickerYear === year;
                            return (
                                <button
                                    key={m}
                                    onClick={() => handleMonthClick(m)}
                                    style={{
                                        padding: "6px 4px", borderRadius: 8, border: "none",
                                        fontSize: 12, fontWeight: 600,
                                        cursor: isPast ? "not-allowed" : "pointer",
                                        opacity: isPast ? 0.35 : 1,
                                        background: isSelected
                                            ? "linear-gradient(90deg, var(--color-brand-yellow) 0%, var(--color-brand-orange) 50%, var(--color-brand-pink) 100%)"
                                            : "#f3f4f6",
                                        color: isSelected ? "#fff" : "#374151",
                                        transition: "all 0.15s",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
