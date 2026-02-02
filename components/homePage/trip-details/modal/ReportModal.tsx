import { useState } from "react"
import { X } from "lucide-react"
import { TRIP_DETAILS } from "@/lib/constants/strings"
import { useReportTripMutation } from "@/lib/services/trip-report"
import { toast } from "@/hooks/use-toast"

const options = [
  "Spam or irrelevant content",
  "Inappropriate or offensive language",
  "Misleading or false information",
  "Invalid contact information",
  "Other (please specify below)",
]

export default function ReportModal({ onClose, tripPublicId }: { onClose: () => void, tripPublicId: string }) {
  const [selected, setSelected] = useState<string[]>([])
  const [details, setDetails] = useState("")
  const [reportTrip, { isLoading }] = useReportTripMutation();


  const handleSelect = (opt: string) => {
    setSelected([opt]);   // always single
  };


  const mapToEnum = (text: string) => {
    switch (text) {
      case "Spam or irrelevant content":
        return "SPAM_OR_IRRELEVANT_CONTENT";
      case "Inappropriate or offensive language":
        return "INAPPROPRIATE_OR_OFFENSIVE_LANGUAGE";
      case "Misleading or false information":
        return "MISLEADING_OR_FALSE_INFORMATION";
      case "Invalid contact information":
        return "INVALID_CONTACT_INFORMATION";
      default:
        return "OTHER";
    }
  };

  const handleSubmit = async () => {
    try {
      await reportTrip({
        tripPublicId,
        reportType: mapToEnum(selected[0]),
        comments: details,
      }).unwrap();

      toast({
        toastType: "success",
        title: "Report submitted successfully!",
        description: "Thank you for your report. We will review it as soon as possible.",
      })
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        toastType: "error",
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl
                  max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold">{TRIP_DETAILS.REPORT_MODAL.TITLE}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY (scrollable) */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          <p className="text-sm text-gray-600 mb-4">
            {TRIP_DETAILS.REPORT_MODAL.DESC}
          </p>

          <div className="space-y-3 mb-2">
            {options.map((opt) => {
              const isSelected = selected.includes(opt);

              return (
                <label
                  key={opt}
                  onClick={() => setSelected([opt])}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition
        border ${isSelected ? "border-orange-400 " : "border-gray-200"}`}
                >
                  {/* CUSTOM CHECKBOX */}
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200
            ${isSelected
                        ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-transparent"
                        : "border-gray-300 bg-white"
                      }`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="text-sm">{opt}</span>
                </label>
              );
            })}
          </div>


          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Additional details (optional)"
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {/* FOOTER BUTTONS */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 border py-3 rounded-full text-sm"
            >
              {TRIP_DETAILS.REPORT_MODAL.CANCEL}
            </button>

            <button
              onClick={handleSubmit}
              disabled={!selected.length}
              className="flex-1 bg-orange-500 text-white py-3 rounded-full text-sm disabled:opacity-50 cursor-pointer"
            >
              {TRIP_DETAILS.REPORT_MODAL.SUBMIT}
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}
