'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { IndianRupee, Percent } from 'lucide-react';

export type UnitType = 'percent' | 'flat';

interface Props {
    value: string;
    onChange: (val: string) => void;
    unit: UnitType;
    onUnitChange: (unit: UnitType) => void;
    placeholder?: string;
    className?: string; // Wrapper className
    type?: string;
}

export function InputWithUnitToggle({
    value,
    onChange,
    unit,
    onUnitChange,
    placeholder,
    className,
    type,
}: Props) {
    return (
        <div
            className={cn(
                'flex items-center border rounded-md px-3 h-10 bg-white w-full focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all',
                className
            )}
        >
            <input
                className="outline-none border-0 text-sm flex-1 bg-transparent placeholder:text-gray-400"
                placeholder={placeholder}
                value={value}
                type={type}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 ml-2 border border-gray-200">
                <button
                    type="button"
                    onClick={() => onUnitChange('percent')}
                    className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-medium transition-all flex items-center justify-center',
                        unit === 'percent'
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <Percent className="w-3 h-3" />
                </button>
                <button
                    type="button"
                    onClick={() => onUnitChange('flat')}
                    className={cn(
                        'px-2 py-0.5 rounded-md text-xs font-medium transition-all flex items-center justify-center',
                        unit === 'flat'
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    <IndianRupee className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
