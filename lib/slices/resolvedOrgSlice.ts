import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface ResolvedOrgState {
  resolvedOrgId: string | null;
  resolvedHomeLayout: string | null;
}

const initialState: ResolvedOrgState = {
  resolvedOrgId: null,
  resolvedHomeLayout: null,
};

export const resolvedOrgSlice = createSlice({
  name: 'resolvedOrg',
  initialState,
  reducers: {
    setResolvedOrg: (state, action: PayloadAction<{ orgId: string | null; layout: string | null }>) => {
      state.resolvedOrgId = action.payload.orgId;
      state.resolvedHomeLayout = action.payload.layout;
    },
    clearResolvedOrg: (state) => {
      state.resolvedOrgId = null;
      state.resolvedHomeLayout = null;
    },
  },
});

export const { setResolvedOrg, clearResolvedOrg } = resolvedOrgSlice.actions;
export const selectResolvedOrg = (state: RootState) => state.resolvedOrg;
export default resolvedOrgSlice.reducer;
