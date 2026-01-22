import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthState } from "@/lib/slices/auth";
import { useRouter } from "next/navigation";

export const useAuthActions = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { accessToken, userData } = useSelector(selectAuthState);
    const isLoggedIn = Boolean(accessToken && userData);

    const handleLogout = (onBeforeLogout?: () => void, redirectPath: string = "/home") => {
        localStorage.clear();
        dispatch(logout());
        if (onBeforeLogout) onBeforeLogout();
        router.push(redirectPath);
    };

    return {
        isLoggedIn,
        accessToken,
        userData,
        handleLogout,
        dispatch,
        router,
    };
};
