import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CompareItem {
    id: string;
    image: string;
}

interface CompareState {
    items: CompareItem[];
}

const initialState: CompareState = {
    items:
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("compareTrips") || "[]")
            : [],
};

const compareSlice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        addToCompare: (state, action: PayloadAction<CompareItem>) => {
            if (state.items.find(i => i.id === action.payload.id)) return;
            if (state.items.length >= 3) return;

            state.items.push(action.payload);
            localStorage.setItem("compareTrips", JSON.stringify(state.items));
        },

        removeFromCompare: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.id !== action.payload);
            localStorage.setItem("compareTrips", JSON.stringify(state.items));
        },

        clearCompare: (state) => {
            state.items = [];
            localStorage.removeItem("compareTrips");
        },
    },
});

export const { addToCompare, removeFromCompare, clearCompare } =
    compareSlice.actions;

export default compareSlice.reducer;
