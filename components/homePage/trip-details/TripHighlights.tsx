import DOMPurify from "dompurify";
import { TRIP_DETAILS } from "@/lib/constants/strings";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

interface TripHighlightsProps {
  highlights?: string;
}

export default function TripHighlights({ highlights }: TripHighlightsProps) {

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-3">
        {TRIP_DETAILS.HIGHLIGHTS.TITLE}
      </h2>

      {highlights ? (
        <div
          className="text-gray-600 leading-relaxed break-words"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(highlights),
          }}
        />
      ) : (
        <p className="text-gray-600">
          {TRIP_DETAILS.HIGHLIGHTS.EMPTY}
        </p>
      )}
    </div>
  );
}
