import { useState } from "react";
import { toast } from "sonner"; // ✅ if you have toast lib; else use alert()

export function useSaveHandler(onClose: () => void) {
  const [saving, setSaving] = useState(false);

  const handleSave = async (
    stepKey: string,
    action: () => Promise<any>
  ): Promise<void> => {
    try {
      setSaving(true);
      await action();
      toast.success(`${stepKey} saved successfully`);
      onClose();
    } catch (err) {
      console.error("Failed to save", stepKey, err);
      toast.error(`Failed to save ${stepKey}. Check console for details.`);
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSave };
}
