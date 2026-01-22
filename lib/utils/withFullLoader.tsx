import React from "react";
import { createRoot } from "react-dom/client";
import LoadingScreen from "@/components/common/LoadingScreen";

export const withFullLoader = async (promise: Promise<any>) => {
  // Create a container div dynamically
  const loaderDiv = document.createElement("div");
  loaderDiv.id = "global-loader";
  document.body.appendChild(loaderDiv);

  const root = createRoot(loaderDiv);
  root.render(<LoadingScreen message="Please wait..." />);

  try {
    const result = await promise;
    return result;
  } finally {
    root.unmount();
    loaderDiv.remove();
  }
};
