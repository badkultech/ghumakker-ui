// context/AuthGuardContext.tsx
"use client";

import { createContext, useContext, useRef } from "react";

type GuardedAction = () => void;

type AuthGuardContextType = {
    setPendingAction: (action: GuardedAction) => void;
    resumePendingAction: () => void;
    clearPendingAction: () => void;
};

const AuthGuardContext = createContext<AuthGuardContextType | null>(null);

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
    const pendingActionRef = useRef<GuardedAction | null>(null);

    const setPendingAction = (action: GuardedAction) => {
        pendingActionRef.current = action;
    };

    const resumePendingAction = () => {
        pendingActionRef.current?.();
        pendingActionRef.current = null;
    };

    const clearPendingAction = () => {
        pendingActionRef.current = null;
    };

    return (
        <AuthGuardContext.Provider
            value={{ setPendingAction, resumePendingAction, clearPendingAction }}
        >
            {children}
        </AuthGuardContext.Provider>
    );
}

export function useAuthGuardContext() {
    const ctx = useContext(AuthGuardContext);
    if (!ctx) {
        throw new Error("useAuthGuardContext must be used inside AuthGuardProvider");
    }
    return ctx;
}
