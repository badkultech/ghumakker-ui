"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
    password: string;
    showInstructions: boolean;
}

interface PasswordRule {
    met: boolean;
    text: string;
}

function RuleIndicator({ met, text }: PasswordRule) {
    return (
        <div className="flex items-center text-sm">
            {met ? (
                <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
            ) : (
                <XCircle className="text-gray-400 mr-2" size={16} />
            )}
            <span className="text-gray-600">{text}</span>
        </div>
    );
}

export function PasswordStrengthIndicator({
    password,
    showInstructions,
}: PasswordStrengthIndicatorProps) {
    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$]/.test(password),
    };

    if (!showInstructions) return null;

    return (
        <>
            <p className="text-[#FF804C] text-sm mt-1">For a strong password, includes:</p>
            <div className="mt-4 space-y-1">
                <RuleIndicator met={rules.length} text="8+ characters" />
                <RuleIndicator met={rules.uppercase} text="1 uppercase letter" />
                <RuleIndicator met={rules.number} text="1 number" />
                <RuleIndicator met={rules.special} text="1 special symbol (!@#$)" />
            </div>
        </>
    );
}

export function getPasswordRules(password: string) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$]/.test(password),
    };
}
