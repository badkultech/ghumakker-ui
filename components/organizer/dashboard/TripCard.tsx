import { useState } from "react";
import { MapPin, MessageSquare, Users } from "lucide-react";
import { formatTag } from "@/lib/utils/tagFormatter";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

type TripCardProps = {
    image: string;
    name: string;
    tags?: string[]; // destinationTags array
    description?: string;
    leads?: number;
    queries?: number;
    tripPublicId: string;
};


export function TripCard({
    image,
    name,
    tags = [],
    description,
    leads = 0,
    queries = 0,
    tripPublicId,
}: TripCardProps) {
    const router = useRouter();
    const [showAllTags, setShowAllTags] = useState(false);

    const formattedTags = tags.map(formatTag);
    const visibleTags = formattedTags.slice(0, 2);
    const remainingCount = formattedTags.length - 2;

    const handleCardClick = () => {
        router.push(
            `/home/search-result-with-filter/trip-details/${tripPublicId}`
        );
    };

    return (
        <Card
            onClick={handleCardClick}
            className="overflow-hidden rounded-xl hover:shadow-md transition relative cursor-pointer"
        >
            {/* Image */}
            <div className="h-44 w-full overflow-hidden">
                <img src={image} alt={name} className="h-full w-full object-cover" />
            </div>

            <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-base">{name}</h3>

                {/* Tags */}
                <div className="relative text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 h-5 overflow-hidden">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />

                        {visibleTags.join(", ")}

                        {remainingCount > 0 && (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllTags((v) => !v);
                                }}
                                className="ml-1 text-orange-500 cursor-pointer whitespace-nowrap"
                            >
                                +{remainingCount} more
                            </span>
                        )}
                    </div>

                    {showAllTags && (
                        <div
                            className="absolute left-5 top-full mt-1 z-20 bg-white shadow-md rounded-md px-2 py-1 text-sm max-w-[90%]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {formattedTags.join(", ")}
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="flex items-center gap-3 text-sm">
                    {/* Leads */}
                    <Link
                        href={`/organizer/leads/trip/${tripPublicId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1"
                    >
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border hover:bg-gray-100 transition">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-800">Leads</span>
                            <span className="ml-auto font-semibold text-orange-500">
                                {leads}
                            </span>
                        </div>
                    </Link>

                    {/* Queries */}
                    <Link
                        href={`/organizer/queries/trip/${tripPublicId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1"
                    >
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border hover:bg-gray-100 transition">
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-800">Queries</span>
                            <span className="ml-auto font-semibold text-orange-500">
                                {queries}
                            </span>
                        </div>
                    </Link>
                </div>

                {description && (
                    <div
                        className="text-sm text-gray-600 line-clamp-2 break-words"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(description),
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}
