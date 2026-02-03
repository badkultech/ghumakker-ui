"use client"

import { Provider } from "react-redux"
import { store } from "./slices/store"
import { useSyncFocusedUser } from "@/hooks/useSyncFocusedUser"

// Component to sync focusedUserId from localStorage
function FocusedUserSync() {
  useSyncFocusedUser();
  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <FocusedUserSync />
      {children}
    </Provider>
  )
}
