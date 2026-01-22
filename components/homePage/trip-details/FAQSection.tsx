import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface FAQItem {
  question?: string;
  answer?: string;
}

export default function FAQSection({
  faqs = [],
}: {
  faqs: FAQItem[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-4">{TRIP_DETAILS.FAQ.TITLE}</h2>

      {faqs.length === 0 && (
        <p className="text-sm text-gray-500">{TRIP_DETAILS.FAQ.EMPTY}</p>
      )}

      {faqs.map((f, i) => (
        <div key={i} className="border rounded-xl bg-[#F7F7F7] p-2 mb-2">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between p-4"
          >
            <span className="text-sm font-medium">
              {f.question || "--"}
            </span>

            {open === i ? <ChevronUp /> : <ChevronDown />}
          </button>

          {open === i && (
            <div className="px-4 pb-4 text-sm bg-white p-2 rounded-lg text-gray-600">
              {f.answer || ""}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
