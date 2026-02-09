'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { SectionCard } from '@/components/create-trip/section-card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { WizardFooter } from '@/components/create-trip/wizard-footer';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';

import {
  useCreateFaqMutation,
  useGetAllFaqsQuery,
} from '@/lib/services/organizer/trip/faqs/index';
import { useGetOrganizerFaqsQuery } from '@/lib/services/organizer/trip/library/faq';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FAQ } from '@/lib/services/organizer/trip/faqs/types';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { useOrganizationId } from '@/hooks/useOrganizationId';

// Local FAQ type with UI state
type LocalFAQ = FAQ & {
  checked?: boolean;
  isMaster?: boolean;
};


export default function FAQsPage() {
  const router = useRouter();
  const { id: tripId } = useParams();
  const [faqs, setFaqs] = useState<LocalFAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChooseFromLibrary, setChooseFromLibrary] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<any>(null);
  const [draftDisabled, setDraftDisabled] = useState(false);
  const organizationId = useOrganizationId();
  const [isSaving, setIsSaving] = useState(false);
  const [createFaq] = useCreateFaqMutation();
  const shouldSkip = !organizationId || !isChooseFromLibrary;
  const { data: faqsLibraryData = [] } = useGetOrganizerFaqsQuery(
    shouldSkip ? skipToken : { organizationId }
  );
  const [errorMsg, setErrorMsg] = useState("");

  const {
    data: faqsData,
    isLoading,
    refetch,
  } = useGetAllFaqsQuery({
    organizationId,
    tripPublicId: tripId as string,
  });
  useEffect(() => {
    if (!isSaving) {
      setDraftDisabled(false);
    }
  }, [faqs, newQuestion, newAnswer]);


  useEffect(() => {
    if (faqsData?.data) {
      const masterData = faqsData.data.masterData || [];
      const details = faqsData.data.details || [];

      const selectedFaqs = details.map((f: FAQ) => f.question);

      setFaqs([
        // ⭐ MASTER DATA → read-only
        ...masterData
          .filter((f: FAQ) => !selectedFaqs.includes(f.question))
          .map((f: FAQ) => ({
            ...f,
            isMaster: true,
            isSelected: false,
          })),

        // ⭐ DETAILS → editable
        ...details.map((f: FAQ) => ({
          ...f,
          isMaster: false,
          isSelected: true,
        })),
      ]);
    }
  }, [faqsData]);


  const handleAddFromLibrary = (item: any) => {
    // Map library FAQ shape to local FAQ shape and close dialog
    setFaqs((prev) => [
      ...prev,
      {
        id: `lib-${item.id}`,
        question: item.name ?? '',
        answer: item.answer ?? '',
        isSelected: true,
      },
    ]);
    setChooseFromLibrary(false);
  };

  const updateAnswer = (question: string, answer: string | undefined) => {
    setFaqs((prev) =>
      prev.map((f) =>
        f.question === question ? { ...f, answer: answer ?? '' } : f
      )
    );
  };


  const handleRemoveFaq = (question: string) => {
    setFaqs((prev) => prev.filter((f) => f.question !== question));
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim()) return;

    setFaqs((prev) => [
      ...prev,
      {
        question: newQuestion,
        answer: newAnswer,
        isSelected: true,
      },
    ]);

    setNewQuestion('');
    setNewAnswer('');
  };

  const handleSave = async (isDraft: boolean = false) => {

    const selectedFaqs = faqs.filter((faq) => faq.isSelected);

    if (selectedFaqs.length === 0) {
      setErrorMsg("Please select at least one FAQ before saving.");
      return;
    }

    setErrorMsg("");

    if (isDraft) {
      setDraftDisabled(true);
    } else {
      setIsSaving(true);
    }

    try {
      const fd = new FormData();
      faqs
        .filter((faq) => faq.isSelected)
        .forEach((faq, index) => {
          fd.append(`details[${index}].question`, faq.question);
          fd.append(`details[${index}].answer`, faq.answer);
          fd.append(`details[${index}].category`, "DEFAULT");
        });

      await createFaq({
        organizationId: organizationId,
        tripPublicId: tripId as string,
        data: fd,
      });

      if (!isDraft) {
        router.push(`/organizer/create-trip/${tripId}/pricing`);
      }

    } catch (err) {
      console.error("Error saving FAQs:", err);
      if (isDraft) setDraftDisabled(false);
    } finally {
      if (!isDraft) setIsSaving(false);
    }
  };


  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Dialog open={isChooseFromLibrary} onOpenChange={setChooseFromLibrary}>
        <DialogContent className='sm:max-w-[40%]'>
          <div className='relative'>
            <DialogHeader>
              <DialogTitle>Add From Library</DialogTitle>
            </DialogHeader>

            <div className='mt-3 max-h-[60vh] overflow-y-auto space-y-2 pr-2'>
              {faqsLibraryData && faqsLibraryData.length > 0 ? (
                faqsLibraryData.map((faq: any) => (
                  <div
                    key={faq.id}
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelectedFaq(faq)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedFaq(faq);
                      }
                    }}
                    className={`
                flex items-start gap-3 p-3 rounded-md border bg-white
                hover:bg-primary/5 hover:shadow-sm transition cursor-pointer
                ${selectedFaq?.id === faq.id
                        ? 'border-primary bg-primary/5'
                        : ''
                      }
              `}
                  >
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-sm text-gray-900 truncate'>
                        {faq.name}
                      </div>
                      <div className='text-sm text-muted-foreground mt-1 line-clamp-3'>
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-sm text-muted-foreground p-3'>
                  No library FAQs found.
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className='flex justify-end gap-3 mt-4 pt-3 border-t'>
              <Button
                variant='outline'
                onClick={() => setChooseFromLibrary(false)}
              >
                Cancel
              </Button>

              <Button
                disabled={!selectedFaq}
                onClick={() => {
                  if (selectedFaq) handleAddFromLibrary(selectedFaq);
                  setChooseFromLibrary(false);
                }}
                className='bg-brand-gradient shadow hover:opacity-90 text-white'
              >
                Select
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex-1'>
        <AppHeader title='Create New Trip' />
        <TripStepperHeader activeStep={4} />

        <SectionCard title='Trip Preparation & FAQs'>
          <div className='space-y-6'>
            {errorMsg && (
              <div className="p-3 mb-3 text-red-600 bg-red-100 border border-red-300 rounded">
                {errorMsg}
              </div>
            )}

            {/* FAQ LIST */}
            <Accordion type='single' collapsible className='w-full space-y-2'>
              {faqs.map((faq) => {
                const isMaster = faqsData?.data?.masterData?.some(
                  (m: any) => m.question === faq.question
                );
                return (
                  <AccordionItem
                    key={faq.question}
                    value={faq.question}
                    className={`relative group rounded-lg border bg-background px-2 sm:px-4 ${faq.isSelected ? "bg-sky-50" : ""
                      }`}
                  >
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <Input
                          className="w-4 h-4"
                          type="checkbox"
                          checked={faq.isSelected}
                          onChange={(e) => {
                            const updatedFaqs = faqs.map((f) =>
                              f.question === faq.question
                                ? { ...f, isSelected: e.target.checked }
                                : f
                            );
                            setFaqs(updatedFaqs);
                            if (e.target.checked) setErrorMsg("");
                          }}
                        />

                        <span className="font-medium">{faq.question}</span>
                      </div>

                      <AccordionTrigger />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFaq(faq.question);
                      }}
                      className="absolute top-[-10px] right-[-9px] p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <AccordionContent className="pt-2 pb-4">
                      {isMaster ? (
                        <div className="border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                          <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-2">
                          <RichTextEditor
                            value={faq.answer}
                            onChange={(val) => updateAnswer(faq.question, val)}
                          />
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}

            </Accordion>

            {/* ADD NEW FAQ */}
            <div className='rounded-lg border bg-background p-3 sm:p-4'>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder='Enter your question..'
                className='mb-3'
              />

              <div className='border border-gray-200 rounded-lg p-2'>
                <RichTextEditor
                  value={newAnswer}
                  placeholder='Enter your answer..'
                  onChange={(val) => setNewAnswer(val ?? '')}
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className='flex gap-2'>
              <Button
                variant='outline'
                className='px-8 py-2 text-primary border-primary/50 hover:bg-primary/5'
                onClick={handleAddFaq}
              >
                + Add Question
              </Button>

              <Button
                onClick={() => {
                  setChooseFromLibrary(true);
                }}
                className='px-8 py-2 text-white bg-brand-gradient'
              >
                Choose from Library
              </Button>
            </div>
          </div>
        </SectionCard>

        <WizardFooter
          onPrev={() => router.push(`/organizer/create-trip/${tripId}/exclusions`)}
          onDraft={() => handleSave(true)}
          onNext={() => handleSave(false)}
          draftDisabled={draftDisabled}
          loading={isSaving}
        />

      </div>
    </div>
  );
}
