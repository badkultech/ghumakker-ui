import {
    Bell, Bookmark, Gift, Heart, MapPin, MessageCircleQuestion,
    Scale, Search, Settings, Users
} from "lucide-react";

export const menuItems = [
    {
        icon: Search,
        label: "Search by Mood",
        action: "OPEN_SEARCH",
        tab: "moods"
    },
    {
        icon: MapPin,
        label: "Search by Destinations",
        action: "OPEN_SEARCH",
        tab: "destination"
    },
    { icon: Users, label: "About us", href: "/home/about" },
    { icon: Heart, label: "Popular Trips", href: "/home/popular-trips" },
    { icon: Gift, label: "Biggest Discounts", href: "/home/discounts" },
    { icon: Scale, label: "Compare Trips", href: "/home/compare-trips" },
    { icon: Bookmark, label: "Wishlist", href: "/home//wishlist" },
] as const;

export const userMenuItems = [
    { icon: Bell, label: "Trip Invitations Sent", href: "/home/invitations" },
    { icon: MessageCircleQuestion, label: "My Queries", href: "/home/my-queries" },
    { icon: Bookmark, label: "Saved Trips", href: "/saved" },
    { icon: Settings, label: "Settings", href: "/home/settings" },
] as const;

export const notificationsData = [
    {
        id: 1,
        type: "booking",
        title: "Booking Confirmed!",
        description: "Your booking for Ladakh Skygaze has been confirmed",
        time: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        type: "message",
        title: "New Message",
        description: "Trip organizer replied to your query",
        time: "2 hours ago",
        read: false,
    },
];
