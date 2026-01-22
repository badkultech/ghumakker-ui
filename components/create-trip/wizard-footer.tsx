"use client"

import { Button } from "@/components/ui/button"

export function WizardFooter({
  onPrev,
  onDraft,
  onNext,
  prevLabel = "← Previous",
  nextLabel = "Save & Next",
  loading = false,
  draftDisabled = false,
}: {
  onPrev?: () => void
  onDraft?: () => void
  onNext?: () => void
  prevLabel?: string
  nextLabel?: string
  loading?: boolean
  draftDisabled?: boolean
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
      {onPrev ? (
        <div className="flex justify-center sm:justify-start">
          <Button
            variant="outline"
            className="px-8 py-2 rounded-full font-medium text-orange-500 border-orange-400 hover:bg-orange-50 transition flex items-center gap-2"
            onClick={onPrev}
          >
            {prevLabel}
          </Button>
        </div>
      ) : <div />}

      <div className="flex justify-center sm:justify-end gap-3">
        {onDraft ? (
          <Button
            variant="outline"
            className={`rounded-full bg-transparent border border-gray-300 text-gray-700 px-6 py-2
              ${draftDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            onClick={!draftDisabled ? onDraft : undefined}
            disabled={draftDisabled}
          >
            Save as Draft
          </Button>
        ) : null}
        {onNext ? (
          <Button
            className={`
             px-8 py-2 rounded-full font-medium text-white
             bg-gradient-to-r from-orange-400 to-pink-500 shadow
             flex items-center gap-2 transition
             ${loading ? "opacity-50 cursor-not-allowed" : "hover:from-orange-500 hover:to-pink-600"}
          `}
            onClick={!loading ? onNext : undefined}
            disabled={loading}
          >
            {loading ? "Saving..." : nextLabel}

            {!loading && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Button>

        ) : null}
      </div>
    </div>
  )
}
