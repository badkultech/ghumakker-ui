"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/gradient-button";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import RichTextEditor from "../editor/RichTextEditor";

type AddFAQFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: { question: string; answer: string }) => void;
  updateId?: number | null;
  initialData?: any;
};

export function AddFAQForm({
  mode = "trip",
  onCancel,
  onSave,
  updateId,
  initialData,
}: AddFAQFormProps) {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!question.trim()) newErrors.question = "Question is required";
    if (!answer.trim()) newErrors.answer = "Answer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave({ question, answer });
  };

  const handleLibrarySelect = (item: any) => {
    setQuestion(item.title || "");
    setAnswer(item.answer || "");
  };

  const isTripMode = mode === "trip";

  return (
    <div className="flex flex-col gap-6 font-poppins">
      {isTripMode ? (
        <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
      ) : (
        <div className="mt-2" />
      )}

      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Question *
        </label>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
          maxLength={200}
        />
        {errors.question && (
          <p className="text-xs text-red-500 mt-1">{errors.question}</p>
        )}
        <p className="text-xs text-right text-primary mt-1">
          {question.length}/200 Characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Answer *
        </label>
        <RichTextEditor
          placeholder="Enter answer"
          value={answer}
          onChange={setAnswer}
        />
        {errors.answer && (
          <p className="text-xs text-red-500 mt-1">{errors.answer}</p>
        )}
      </div>

      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <GradientButton
          onClick={handleSubmit}
        >
          {updateId ? "Update" : "Save"}
        </GradientButton>
      </div>

      {mode === "trip" && (
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="faqs"
        />
      )}
    </div>
  );
}
