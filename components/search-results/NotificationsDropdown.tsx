"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Bell } from "lucide-react";

interface NotificationItem {
    id: number;
    type: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
}

export function NotificationsDropdown({
    notifications,
    onUpdateNotifications,
}: {
    notifications: NotificationItem[];
    onUpdateNotifications: (list: NotificationItem[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        onUpdateNotifications(updated);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Notification bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-black/80 hover:text-black transition-colors relative"
            >
                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[350px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread notifications</p>
                        </div>

                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#ff7043] hover:text-[#ff5722] font-normal flex items-center gap-1.5 mt-0.5"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Mark all as read
                        </button>
                    </div>

                    {/* NOTIFICATION LIST  */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.map((n, index) => (
                            <div
                                key={n.id}
                                onClick={() => {
                                    const updated = notifications.map((item) =>
                                        item.id === n.id ? { ...item, read: true } : item
                                    );
                                    onUpdateNotifications(updated);
                                }}
                                className={`relative px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-all hover:bg-gray-50
                                        ${!n.read ? "bg-[#fff5f2]" : "bg-white"}
                                        ${index !== notifications.length - 1 ? "border-b border-gray-200" : ""}
                                    `}
                            >
                                {/* Bell Icon in White Box */}



                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                                        <Bell className="w-[18px] h-[18px] text-gray-800" />
                                    </div>
                                </div>
                                {/* CONTENT */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-sm font-semibold text-gray-900 leading-tight">{n.title}</p>
                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.description}</p>
                                    <p className="text-xs text-gray-400 ml-[-50px] mt-2">{n.time}</p>
                                </div>

                                {/* UNREAD DOT */}
                                {!n.read && (
                                    <div className="flex-shrink-0 mt-2">
                                        <span className="block w-2.5 h-2.5 bg-[#ff7043] rounded-full"></span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Footer */}
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-white">
                        <button className="w-full text-center text-sm text-[#ff7043] hover:text-[#ff5722] font-normal">
                            Show More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
