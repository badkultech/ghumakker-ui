"use client";

import { createContext, useContext } from "react";

interface HomeLayoutContextType {
    openLoginModal: () => void;
}

export const HomeLayoutContext = createContext<HomeLayoutContextType>({
    openLoginModal: () => { },
});

export const useHomeLayout = () => useContext(HomeLayoutContext);
