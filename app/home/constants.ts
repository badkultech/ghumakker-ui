import {
    Bell, Bookmark, MessageCircleQuestion,
    Scale, Settings, Facebook, Instagram, Youtube, Linkedin, LayoutDashboard, Ticket
} from "lucide-react";

export const userMenuItems = [
    { icon: LayoutDashboard, label: "My Dashboard", href: "#" },
    { icon: Ticket, label: "My Orders", href: "/home/my-orders" },
    { icon: Bell, label: "Trip Invitations Sent", href: "/home/invitations" },
    { icon: MessageCircleQuestion, label: "My Queries", href: "/home/my-queries" },
    { icon: Bookmark, label: "Saved Trips", href: "/home/wishlist" },
    { icon: Scale, label: "Compare Trips", href: "/home/compare-trips" },
    { icon: Settings, label: "Settings", href: "/home/settings" },
] as const;

export const footerLinks = {
    main: [
        { label: "Home", href: "/home" },
        { label: "About us", href: "https://badkultechnology.com/about" },
        { label: "Trips", href: "/home/search-result-with-filter" },
    ],
    support: [
        { label: "Contact us", href: "https://badkultechnology.com/contact" },
        { label: "Terms and Conditions", href: "/policies?tab=terms" },
        { label: "Privacy Policy", href: "/policies?tab=privacy" },
    ],
};

export const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/ghumakkerofficial/", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/badkul-technology/", label: "LinkedIn" },
];
