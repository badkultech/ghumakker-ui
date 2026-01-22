// lib/slices/uiSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  globalLoading: boolean;
}

const initialState: UIState = {
  globalLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.globalLoading = true;
    },
    hideLoader: (state) => {
      state.globalLoading = false;
    },
  },
});

export const { showLoader, hideLoader } = uiSlice.actions;
export default uiSlice.reducer;
