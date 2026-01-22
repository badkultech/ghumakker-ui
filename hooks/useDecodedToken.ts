// hooks/useDecodedToken.ts
import { useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export type AuthTokenPayload = {
  sub: string; // usually the user ID
  email: string;
  role: 'admin' | 'user' | 'moderator';
  iat?: number; // issued at
  exp?: number; // expiration
  userType: 'SYSTEM_ADMIN' | 'USER' | 'ORGANIZATION_ADMIN'; // custom user type
  [key: string]: any; // catch-all for other claims
};

export function useDecodedToken(token?: string | null) {
  const decoded = useMemo<AuthTokenPayload | null>(() => {
    if (!token) return null;

    try {
      const payload = jwtDecode<AuthTokenPayload>(token);

      // Optional: Check expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Token has expired');
        }
        return null;
      }

      return payload;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid token', error);
      }
      return null;
    }
  }, [token]);

  return decoded;
}
