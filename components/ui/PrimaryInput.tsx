import * as React from "react";
import { cn } from "@/lib/utils";

export interface PrimaryInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
    icon?: React.ReactNode;
}

const PrimaryInput = React.forwardRef<HTMLInputElement, PrimaryInputProps>(
    ({ className, type, label, error, containerClassName, icon, ...props }, ref) => {
        return (
            <div className={cn("w-full", containerClassName)}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            "input-primary",
                            error && "ring-2 ring-red-500 bg-red-50",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {icon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {icon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-brand-orange text-xs mt-2 transition-all duration-300">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
PrimaryInput.displayName = "PrimaryInput";

export { PrimaryInput };
