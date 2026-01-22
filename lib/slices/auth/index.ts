// lib/features/authSlice.ts
import { AuthTokenPayload } from '@/hooks/useDecodedToken';
import { RootState } from '@/lib/slices/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userData?: AuthTokenPayload | null | undefined;
  isTokenExpired?: boolean;
  focusedOrganizationId?: string | null;
  focusedUserId?: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userData: null,
  isTokenExpired: false,
  focusedOrganizationId: null,
  focusedUserId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.accessToken) {
        const decodedData = jwtDecode<AuthTokenPayload>(
          action.payload.accessToken,
        );

        // Check if token is expired
        if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
          // Token is expired - reset to initial state
          if (process.env.NODE_ENV === 'development') {
            console.warn('Token has expired - logging out');
          }
          return initialState;
        }

        state.userData = decodedData;
        state.focusedOrganizationId =
          action.payload.focusedOrganizationId ??
          decodedData.organizationPublicId;
        state.focusedUserId = action.payload.focusedUserId ?? decodedData.userPublicId;
        state.isTokenExpired = false;
      }
    },
    logout: (state) => {
      // Clear all auth state
      state.accessToken = null;
      state.refreshToken = null;
      state.userData = null;
      state.isTokenExpired = false;
      state.focusedOrganizationId = null;
      state.focusedUserId = null;
    },

    setFocusedOrganizationId: (state, action: PayloadAction<string>) => {
      state.focusedOrganizationId = action.payload;
    },
    setFocusedUserId: (state, action: PayloadAction<string>) => {
      state.focusedUserId = action.payload;
    },
  },
});

export const { setCredentials, logout, setFocusedOrganizationId, setFocusedUserId } =
  authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;
export default authSlice;
