"use client";

import { SearchTripsCard } from "./SearchTripsCardDesktop";

interface SearchTripsCardMobileProps {
    onClose?: () => void;
    defaultTab?: "destination" | "moods";
    className?: string;
}

export function SearchTripsCardMobile(props: SearchTripsCardMobileProps) {
    return <SearchTripsCard {...props} />;
}
