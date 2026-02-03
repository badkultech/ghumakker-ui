"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RequiredStar from "@/components/common/RequiredStar";
import { MultiUploader } from "@/components/common/UploadFieldShortcuts";
import { useDocumentsManager } from "@/hooks/useDocumentsManager";
import { useCreateUserTicketMutation } from "@/lib/services/user-tickets";
import { toast } from "sonner";

// ✅ Validation Schema
const ticketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(70, "Subject must be under 70 characters"),
  category: z.string().nonempty("Category is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(800, "Description cannot exceed 800 words"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface AddNewTicketModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  userId: string;
}

export function AddNewTicketModal({ open, onClose, organizationId, userId }: AddNewTicketModalProps) {
  const docsManager = useDocumentsManager();
  const [createTicket, { isLoading }] = useCreateUserTicketMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    mode: "onChange",
  });

  const subject = watch("subject") || "";
  const description = watch("description") || "";

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket({
        organizationId,
        userId,
        data: {
          title: data.subject,
          description: data.description,
          category: data.category,
          priority: "Medium",
          status: "Open",
        },
      }).unwrap();

      toast.success("Ticket created successfully!");
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error("Failed to create ticket. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
    max-w-md
    !rounded-2xl
    p-0   /* remove padding from container */
    border border-gray-200
    shadow-lg
  "
      >
        <div
          className="
      p-6
      max-h-[80vh]
      overflow-y-auto
      space-y-4
      scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
    "
        >
          {/* your form goes here */}


          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Create New Ticket
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Subject <RequiredStar />
              </label>
              <div className="relative">
                <Input
                  {...register("subject")}
                  placeholder="Brief description of your issue"
                  maxLength={70}
                  className="mt-1"
                />
                <span className="absolute right-2 bottom-2 text-xs text-primary">
                  {subject.length}/70 Characters
                </span>
              </div>
              {errors.subject && (
                <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category <RequiredStar />
              </label>
              <Select
                onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISSUE">Issue</SelectItem>
                  <SelectItem value="ENQUIRY">Enquiry</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="COMPLAINT">Complaint</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Description <RequiredStar />
              </label>
              <div className="relative">
                <Textarea
                  {...register("description")}
                  placeholder="Please provide detailed description of your issue"
                  className="mt-1 min-h-[100px]"
                />
                <span className="absolute right-2 bottom-2 text-xs text-primary">
                  {description.split(" ").filter(Boolean).length}/800 Words
                </span>
              </div>
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700">Attachments</label>
              <div>
                <MultiUploader documentsManager={docsManager} label="Images" />
                {docsManager.error && (
                  <p className="text-xs text-red-500 mt-2">{docsManager.error}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-full"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isLoading}
                className={`rounded-full text-white ${isValid && !isLoading
                  ? "bg-brand-gradient hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {isLoading ? "Creating..." : "Submit Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
