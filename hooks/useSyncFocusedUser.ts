"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFocusedUserId } from "@/lib/slices/auth";
import { selectAuthState } from "@/lib/slices/auth";
import { useLocalStorage } from "./useLocalStorage";

export const useSyncFocusedUser = () => {
    const dispatch = useDispatch();
    const { focusedUserId } = useSelector(selectAuthState);
    const { getValueFromLocalStorage } = useLocalStorage();

    useEffect(() => {
        if (!focusedUserId) {
            const storedUserId = getValueFromLocalStorage("focusedUserId") as string | null;

            if (storedUserId) {
                console.log("Syncing focusedUserId from localStorage:", storedUserId);
                dispatch(setFocusedUserId(storedUserId));
            }
        }
    }, []); 

    return null;
};
