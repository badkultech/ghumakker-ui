'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH_INDEX = new Date().getMonth(); // 0–11

interface MonthYearSelectorProps {
    year: number;
    month: string; // e.g. 'Jan'
    onChange: (value: { year: number; month: string }) => void;

    minYear?: number; // default: current year
    maxYear?: number;
    className?: string;
}

export function MonthYearSelector({
    year,
    month,
    onChange,
    minYear = CURRENT_YEAR,
    maxYear,
    className = '',
}: MonthYearSelectorProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // ---- Year change ----
    const handleYearChange = useCallback(
        (direction: 'prev' | 'next') => {
            let newYear = year;
            if (direction === 'prev') newYear = year - 1;
            if (direction === 'next') newYear = year + 1;

            if (newYear < minYear) return;
            if (maxYear !== undefined && newYear > maxYear) return;

            // When switching to current year, ensure month is not in the past
            if (newYear === CURRENT_YEAR) {
                const selectedIndex = MONTHS.indexOf(month);
                if (selectedIndex < CURRENT_MONTH_INDEX) {
                    onChange({ year: newYear, month: MONTHS[CURRENT_MONTH_INDEX] });
                    return;
                }
            }

            onChange({ year: newYear, month });
        },
        [year, month, onChange, minYear, maxYear]
    );

    const handleMonthClick = (m: string) => {
        const monthIndex = MONTHS.indexOf(m);
        // Block selecting past month in current year
        if (year === CURRENT_YEAR && monthIndex < CURRENT_MONTH_INDEX) return;
        onChange({ year, month: m });
    };

    const isPrevDisabled = year <= minYear || year <= CURRENT_YEAR;
    const isNextDisabled = maxYear !== undefined && year >= maxYear;

    // ---- Drag scroll: mouse ----
    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const onMouseUpOrLeave = () => setIsDragging(false);

    // ---- Drag scroll: touch ----
    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setStartX(touch.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;
        const touch = e.touches[0];
        const x = touch.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const onTouchEnd = () => setIsDragging(false);

    // ---- Auto-scroll to current/selected month ----
    useEffect(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const index = MONTHS.indexOf(month);
        if (index === -1) return;

        const pillApproxWidth = 80; // px – adjust if needed
        const target =
            index * pillApproxWidth - container.clientWidth / 2 + pillApproxWidth / 2;

        container.scrollTo({
            left: Math.max(target, 0),
            behavior: 'smooth',
        });
    }, [month, year]);

    return (
        <Card className={`border-0 shadow-none bg-transparent p-0 ${className}`}>
            <CardContent className="p-0">
                <p className="text-sm text-muted-foreground mb-3">When do you want to go?</p>

                {/* Year selector – arrows on far ends */}
                <div className="flex items-center justify-between mb-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isPrevDisabled}
                        onClick={() => handleYearChange('prev')}
                        className="rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <span className="text-sm font-semibold text-foreground tracking-wide">
                        {year}
                    </span>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={isNextDisabled}
                        onClick={() => handleYearChange('next')}
                        className="rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Month drag-scroll row */}
                <div
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar pb-1 cursor-grab active:cursor-grabbing"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUpOrLeave}
                    onMouseLeave={onMouseUpOrLeave}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {MONTHS.map((m, index) => {
                        const isSelected = month === m;
                        const isPast = year === CURRENT_YEAR && index < CURRENT_MONTH_INDEX;

                        return (
                            <Button
                                key={m}
                                type="button"
                                variant="outline"
                                disabled={isPast}
                                onClick={() => handleMonthClick(m)}
                                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border
                  transition-all duration-200
                  ${isSelected
                                        ? 'bg-gradient-to-r from-[#FF804C] to-[#FF4B88] text-white border-transparent shadow-md scale-[1.03]'
                                        : 'bg-white text-[#6b6b6b] border-[#e0e0e0] hover:bg-[#fafafa] hover:border-[#c0c0c0]'
                                    }
                  ${isPast ? 'opacity-40 cursor-not-allowed hover:bg-white hover:border-[#e0e0e0]' : ''}
                `}
                            >
                                {m}
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
