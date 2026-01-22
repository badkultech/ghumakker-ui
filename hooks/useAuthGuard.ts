// useAuthGuard.ts
import { useRouter, usePathname } from "next/navigation";
import { useAuthGuardContext } from "@/context/AuthGuardContext";

export function useAuthGuard(isLoggedIn: boolean) {
    const router = useRouter();
    const pathname = usePathname();
    const { setPendingAction } = useAuthGuardContext();

    const requireAuth = (action: () => void) => {
        if (!isLoggedIn) {
            setPendingAction(action);

            // 🔥 STORE WHERE USER SHOULD RETURN
            sessionStorage.setItem("postLoginRedirect", pathname);

            router.push("/login");
            return;
        }
        action();
    };

    return { requireAuth };
}
