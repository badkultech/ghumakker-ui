import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function StepHeader({ title }: { title: string }) {
  return (
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
  );
}
