import {
    Bell, Bookmark, MessageCircleQuestion,
    Scale, Settings
} from "lucide-react";

export const userMenuItems = [
    { icon: Bell, label: "Trip Invitations Sent", href: "/home/invitations" },
    { icon: MessageCircleQuestion, label: "My Queries", href: "/home/my-queries" },
    { icon: Bookmark, label: "Saved Trips", href: "/home/wishlist" },
    { icon: Scale, label: "Compare Trips", href: "/home/compare-trips" },
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
