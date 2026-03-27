"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDocumentsManager } from "@/hooks/useDocumentsManager";
import { useCreateUserTicketMutation } from "@/lib/services/user-tickets";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { TAGS } from "@/lib/services/tags";
import { userTicketAPI } from "@/lib/services/user-tickets";
import { Upload, X, ArrowRight } from "lucide-react";
import { GradientButton } from "@/components/gradient-button";

// ✅ Validation Schema
const ticketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  category: z.string().nonempty("Category is required"),
  priority: z.string().nonempty("Priority is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface AddNewTicketModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: string;
  userId: string;
}

export function AddNewTicketModal({
  open,
  onClose,
  organizationId,
  userId,
}: AddNewTicketModalProps) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const docsManager = useDocumentsManager([], 6);
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
    defaultValues: {
        priority: "MEDIUM"
    }
  });

  const subjectValue = watch("subject") || "";
  const descriptionValue = watch("description") || "";

  const onSubmit = async (data: TicketFormData) => {
    try {
      await createTicket({
        organizationId,
        userId,
        data: {
          title: data.subject,
          description: data.description,
          category: data.category,
          priority: data.priority as any,
          status: "OPEN",
        },
      }).unwrap();

      toast({
        title: "Success",
        description: "Ticket created successfully!",
      });
      reset();
      docsManager.setDocuments([]);
      onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] !rounded-[32px] p-8 border-none shadow-2xl overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-[24px] font-bold text-gray-900">
            Create New Ticket
          </DialogTitle>
          <p className="text-gray-400 text-[14px] font-medium">Our support team responds within 24 hours.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-900">Subject *</label>
            <div className="relative">
              <Input
                {...register("subject")}
                placeholder="Brief description of your issue"
                maxLength={101}
                className="h-[54px] px-4 rounded-xl border-[#E4E4E4] focus:ring-primary/20"
              />
              <div className="absolute right-0 -bottom-5 text-[11px] font-bold">
                <span className="text-red-500">{subjectValue.length}</span>
                <span className="text-gray-400">/100 Characters</span>
              </div>
            </div>
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-gray-900">Category *</label>
              <Select onValueChange={(val) => setValue("category", val, { shouldValidate: true })}>
                <SelectTrigger className="w-full h-[54px] rounded-xl border-[#E4E4E4]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISSUE">Issue</SelectItem>
                  <SelectItem value="ENQUIRY">Enquiry</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="COMPLAINT">Complaint</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
                <label className="text-[14px] font-bold text-gray-900">Priority *</label>
                <Select defaultValue="MEDIUM" onValueChange={(val) => setValue("priority", val, { shouldValidate: true })}>
                    <SelectTrigger className="w-full h-[54px] rounded-xl border-[#E4E4E4]">
                        <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[14px] font-bold text-gray-900">Description*</label>
            <div className="relative">
              <Textarea
                {...register("description")}
                placeholder="Describe your issue in detail.."
                className="min-h-[120px] p-4 rounded-xl border-[#E4E4E4] resize-none focus:ring-primary/20"
                maxLength={501}
              />
              <div className="absolute right-0 -bottom-5 text-[11px] font-bold">
                <span className="text-red-500">{descriptionValue.length}</span>
                <span className="text-gray-400">/500 Characters</span>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-3 pt-2">
            <label className="text-[14px] font-bold text-gray-900">Attachments (Max 6 images)</label>
            
            {/* Custom Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-[140px] border-2 border-dashed border-[#E4E4E4] rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5 text-white" />
                </div>
                <span className="text-[14px] font-bold text-gray-900">Click to Upload</span>
                <span className="text-[11px] font-medium text-gray-400 mt-1">
                    image/png, image/jpeg up to 10MB - {docsManager.documents.filter(d => d.file || d.id).length}/6 used
                </span>
                <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files) docsManager.handleAddFiles(files);
                    }}
                />
            </label>

            {/* Previews - Only show actual items */}
            {docsManager.documents.some(d => d.file || d.id) && (
                <div className="flex flex-wrap gap-3 mt-4">
                    {docsManager.documents.filter(d => d.file || d.id).map((doc, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E4E4E4]">
                            <img src={doc.url || ""} className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => docsManager.handleMarkForDeletion(null, idx)}
                                className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 shadow-sm hover:bg-white"
                            >
                                <X size={12} className="text-gray-900" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[54px] bg-[#F6F6F6] text-gray-500 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <GradientButton
              type="submit"
              disabled={isLoading || !isValid}
              className="flex-1 h-[54px] flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating..." : "Submit Ticket"}
              <ArrowRight size={18} />
            </GradientButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

