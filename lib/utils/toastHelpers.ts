import { toast } from "@/hooks/use-toast";

export const showSuccess = (msg: string) =>
  toast({
    toastType: "success",
    title: "Success",
    description: msg,
  });

export const showError = (msg: string) =>
  toast({
    toastType: "error",
    title: "Error",
    description: msg,
    variant: "destructive",
  });

export const showInfo = (msg: string) =>
  toast({
    toastType: "info",
    title: "Info",
    description: msg,
  });

export const showApiError = (fetchError: any) => {
  const message =
    "status" in fetchError &&
    fetchError.data &&
    typeof fetchError.data === "object"
      ? (fetchError.data as any).message
      : "Something went wrong. Please try again.";

  showError(message);
};
