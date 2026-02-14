import { Calendar, MapPin, Clock, Utensils, Hotel, Footprints, Bus, Activity as ActivityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

// Activity components just for icon rendering
import { Star, Camera, Armchair } from "lucide-react";

interface Activity {
  time?: string;
  name?: string;
  description?: string;
  tags?: string[];
  image?: string;
}

interface Props {
  dayTabs: string[];
  activeDay: number;
  setActiveDay: (i: number) => void;
  activities: Activity[];
  onImageClick?: (index: number) => void;
  dayTitle?: string;
  dayDescription?: string;
  itineraryPdfUrl?: string;
}

// Helper function to format time to 12-hour AM/PM format without seconds
const formatTime = (timeStr?: string): string => {
  if (!timeStr || timeStr === "--") return "--";

  try {
    // Handle array format [hours, minutes, seconds]
    if (Array.isArray(timeStr)) {
      const hours = parseInt(timeStr[0]);
      const minutes = parseInt(timeStr[1]);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    // Handle string format "HH:MM:SS" or "HH:MM"
    const timeParts = timeStr.split(':');
    if (timeParts.length >= 2) {
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);

      if (isNaN(hours) || isNaN(minutes)) return timeStr;

      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    return timeStr;
  } catch (error) {
    return timeStr || "--";
  }
};

export default function DayWiseItinerary({
  dayTabs,
  activeDay,
  setActiveDay,
  activities,
  onImageClick,
  dayTitle,
  dayDescription,
  itineraryPdfUrl
}: Props) {

  const getIconForActivity = (name: string = "") => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("breakfast") || lowerName.includes("dinner") || lowerName.includes("lunch") || lowerName.includes("meal")) {
      return Utensils;
    }
    if (lowerName.includes("hotel") || lowerName.includes("stay") || lowerName.includes("check-in")) {
      return Hotel;
    }
    if (lowerName.includes("bus") || lowerName.includes("transfer") || lowerName.includes("drive") || lowerName.includes("flight")) {
      return Bus;
    }
    if (lowerName.includes("walk") || lowerName.includes("hike") || lowerName.includes("trek") || lowerName.includes("exploration")) {
      return Footprints;
    }
    return ActivityIcon;
  };

  const renderIcon = (itemIcon: any) => {
    const Icon = itemIcon;
    return Icon ? <Icon className="w-4 h-4 text-gray-400" /> : null;
  };

  return (
    <div className="bg-white rounded-2xl border p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Day Wise Itinerary</h2>
        {itineraryPdfUrl && (
          <button
            onClick={() => window.open(itineraryPdfUrl, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
          >
            <Calendar className="w-4 h-4" />
            View Full Itinerary
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {dayTabs.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer",
              activeDay === i
                ? "bg-brand-gradient text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Day Content */}
      <div className="space-y-6">

        {/* Day Title */}
        <h3 className="text-lg font-bold text-gray-900">{dayTitle || `Day ${activeDay + 1}`}</h3>

        {/* Gradient Description Box */}
        {dayDescription && (
          <div
            className="p-6 rounded-xl bg-gradient-to-r from-[#9C27B0] to-[#E53935] text-white text-sm leading-relaxed shadow-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(dayDescription) }}
          />
        )}

        {/* Timeline Items */}
        <div className="space-y-4">
          {activities.length === 0 && !dayDescription && (
            <p className="text-sm text-gray-500 italic">No activities listed for this day.</p>
          )}

          {activities.map((activity, i) => {
            const MainIcon = getIconForActivity(activity.name);
            return (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                {/* Icon Box */}
                <div className="shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                  <MainIcon className="w-6 h-6 text-gray-700" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-gray-900">{activity.name}</h4>

                  {activity.description && (
                    <div
                      className="text-sm text-gray-500 leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(activity.description) }}
                    />
                  )}

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    {/* Time */}
                    {activity.time && activity.time !== "--" && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatTime(activity.time)}</span>
                      </div>
                    )}

                    {/* Image indicator or other tags can go here */}
                    {activity.tags?.map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <ActivityIcon className="w-4 h-4 text-gray-400" />
                        <span>{tag}</span>
                      </div>
                    ))}

                    {/* View Image Button if image exists */}
                    {activity.image && (
                      <button
                        onClick={() => onImageClick?.(i)}
                        className="flex items-center gap-1.5 text-xs text-orange-600 font-medium hover:underline"
                      >
                        <Camera className="w-4 h-4" />
                        View Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
