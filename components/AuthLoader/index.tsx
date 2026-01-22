"use client";

import React, { useEffect, useState, useMemo, useRef, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { selectAuthState, setCredentials } from "@/lib/slices/auth";
import { getDashboardPath, PublicRoutes, isAllowedRoutes, ROUTES } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Loader } from "@/components/common/Loader";

export default function HydratedAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { getValueFromLocalStorage: getValue } = useLocalStorage();
  const authState = useSelector(selectAuthState);

  const [hydrated, setHydrated] = useState(false);
  const redirecting = useRef(false);

  const accessToken = authState?.accessToken ?? null;
  const userType = authState?.userData?.userType ?? null;

  const accessTokenExpired = useMemo(
    () => tokenExpired(accessToken),
    [accessToken]
  );

  /** STEP 1 — HYDRATE FROM LOCAL STORAGE */
  useEffect(() => {
    const lsAccess = getValue("accessToken");
    const lsRefresh = getValue("refreshToken");
    const lsFocusedOrg = getValue("focusedOrganizationId"); // ALWAYS STRING

    dispatch(
      setCredentials({
        accessToken: lsAccess ?? null,
        refreshToken: lsRefresh ?? null,
        focusedOrganizationId: lsFocusedOrg ?? null,
      })
    );

    setHydrated(true);
    // Reset redirecting flag on mount
    redirecting.current = false;
  }, [dispatch]); // Only run once on mount - getValue is stable

  /** STEP 2 — ROUTE GUARD */
  useEffect(() => {
    if (!hydrated) return;
    if (redirecting.current) return;

    const isAuthenticated = Boolean(accessToken) && !accessTokenExpired;
    const isLogin = pathname === ROUTES.COMMON.HOME || pathname.includes(ROUTES.COMMON.LOGIN);

    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthLoader] Route Guard:', {
        pathname,
        isAuthenticated,
        userType,
        accessToken: accessToken ? 'present' : 'null',
      });
    }

    // LOGIN PAGES - Allow access without authentication
    if (isLogin) {
      if (isAuthenticated && userType) {
        const redirect = getDashboardPath(userType);
        if (pathname !== redirect) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[AuthLoader] Authenticated user on login page, redirecting to dashboard');
          }
          redirecting.current = true;
          startTransition(() => {
            router.replace(redirect);
            setTimeout(() => redirecting.current = false, 100);
          });
        }
      }
      // Allow unauthenticated users to stay on login pages
      return;
    }

    // PUBLIC ROUTES - Use exact match to prevent false positives
    const isPublicRoute = PublicRoutes.some((r) => {
      // Exact match
      if (pathname === r) return true;

      // Allow /home/* patterns
      if (r === ROUTES.COMMON.HOME_NAV && pathname.startsWith(`${ROUTES.COMMON.HOME_NAV}/`)) return true;

      return false;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[AuthLoader] Public route check:', { pathname, isPublicRoute });
    }

    if (isPublicRoute) return;

    // PROTECTED
    if (!isAuthenticated || !userType) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthLoader] Redirecting unauthenticated user to /');
      }
      redirecting.current = true;
      startTransition(() => {
        router.replace(ROUTES.COMMON.HOME);
        setTimeout(() => redirecting.current = false, 100);
      });
      return;
    }

    // ROLE ACCESS
    if (!isAllowedRoutes(pathname, userType)) {
      const redirect = getDashboardPath(userType);
      redirecting.current = true;
      startTransition(() => {
        router.replace(redirect);
        setTimeout(() => redirecting.current = false, 100);
      });
    }
  }, [hydrated, pathname, accessToken, accessTokenExpired, userType, router]);

  // Don't render anything until hydrated
  if (!hydrated) return null;

  // Show loading for protected routes while checking auth
  const isAuthenticated = Boolean(accessToken) && !accessTokenExpired;
  const isLogin = pathname === ROUTES.COMMON.HOME || pathname.includes(ROUTES.COMMON.LOGIN);
  const isPublicRoute = PublicRoutes.some((r) => {
    if (pathname === r) return true;
    if (r === ROUTES.COMMON.HOME_NAV && pathname.startsWith(`${ROUTES.COMMON.HOME_NAV}/`)) return true;
    return false;
  });

  // If not authenticated and trying to access protected route, show loading during redirect
  if (!isLogin && !isPublicRoute && !isAuthenticated) {
    return <Loader message="Checking authentication..." variant="default" />;
  }

  return <>{children}</>;
}

/* Safe JWT Expiry */
function tokenExpired(token: string | null | undefined) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}
