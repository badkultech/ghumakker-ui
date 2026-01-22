import { Ban } from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

interface ExcludedItem {
  name?: string;
  category?: string;
}

export default function ExcludedSection({
  items = [],
}: {
  items: ExcludedItem[];
}) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-4">{TRIP_DETAILS.EXCLUDED.TITLE}</h2>

      <div className="grid md:grid-cols-3 gap-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">{TRIP_DETAILS.EXCLUDED.EMPTY}</p>
        )}

        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#F7F7F7] p-2 rounded-lg"
          >
            <Ban className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-sm text-gray-500">
              {item?.name || "--"}
            </span>
          </div>

        ))}
      </div>
    </div>
  );
}
