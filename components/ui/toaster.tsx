"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

type ToastType = "success" | "error" | "warning" | "info";

const toastColors: Record<ToastType, string> = {
  success: "bg-green-100 border-green-400 text-green-900",
  error: "bg-red-100 border-red-400 text-red-900",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-900",
  info: "bg-blue-100 border-blue-400 text-blue-900",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, toastType , ...props }) => (
        <Toast
          key={id}
          {...props}
          className={`border-l-4 p-4 rounded-md shadow-md flex justify-between items-start gap-4 ${toastColors[toastType ?? "info"]}`}
        >
          <div className="flex flex-col gap-1">
            {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose className="ml-4 text-gray-500 hover:text-gray-900" />
        </Toast>
      ))}
      <ToastViewport className="fixed top-5 right-5 z-50 flex flex-col gap-2" />
    </ToastProvider>
  );
}
