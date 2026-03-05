"use client";

import { createContext, useContext } from "react";

interface HomeLayoutContextType {
    openLoginModal: () => void;
    hideHeader: boolean;
    setHideHeader: (hide: boolean) => void;
    hideFooter: boolean;
    setHideFooter: (hide: boolean) => void;
    showLoginRegister: boolean;
    setShowLoginRegister: (show: boolean) => void;
    onMenuOpen: () => void;
}

export const HomeLayoutContext = createContext<HomeLayoutContextType>({
    openLoginModal: () => { },
    hideHeader: false,
    setHideHeader: () => { },
    hideFooter: false,
    setHideFooter: () => { },
    showLoginRegister: false,
    setShowLoginRegister: () => { },
    onMenuOpen: () => { },
});

export const useHomeLayout = () => useContext(HomeLayoutContext);
