"use client";

import { X, Globe, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function OrganizerProfileModal({
    organizer,
    onClose,
}: {
    organizer: any;
    onClose: () => void;
}) {
    if (!organizer) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto no-scrollbar relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 bg-white/80 rounded-full p-1"
                >
                    <X />
                </button>

                {organizer.bannerImage?.url && (
                    <div className="relative h-36 w-full">
                        <Image
                            src={organizer.bannerImage.url}
                            alt="Organizer banner"
                            fill
                            className="object-cover rounded-t-2xl"
                        />
                        <div className="absolute inset-0 bg-black/30 rounded-t-2xl" />
                    </div>
                )}

                <div className="p-6 space-y-4">

                    <div className="flex flex-col items-center text-center -mt-14">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                            <AvatarImage
                                src={organizer.displayPicture?.url}
                                alt={organizer.organizerName}
                            />
                            <AvatarFallback className="bg-orange-500 text-white text-2xl">
                                {organizer.organizerName?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <h4 className="text-lg font-bold mt-3">
                            {organizer.organizerName}
                        </h4>

                        {organizer.tagline && (
                            <p className="text-sm text-gray-500 mt-1">
                                {organizer.tagline}
                            </p>
                        )}
                    </div>

                    {organizer.description && (
                        <p className="text-sm text-gray-700 text-center">
                            {organizer.description}
                        </p>
                    )}

                    {(organizer.websiteUrl ||
                        organizer.instagramHandle ||
                        organizer.youtubeChannel) && (
                            <div className="flex justify-center gap-5 pt-2">
                                {organizer.websiteUrl && (
                                    <a
                                        href={organizer.websiteUrl}
                                        target="_blank"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <Globe />
                                    </a>
                                )}

                                {organizer.instagramHandle && (
                                    <a
                                        href={`https://instagram.com/${organizer.instagramHandle.replace(
                                            "@",
                                            ""
                                        )}`}
                                        target="_blank"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <Instagram />
                                    </a>
                                )}

                                {organizer.youtubeChannel && (
                                    <a
                                        href={organizer.youtubeChannel}
                                        target="_blank"
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <Youtube />
                                    </a>
                                )}
                            </div>
                        )}

                    <div className="border-t pt-4">
                        <p className="font-semibold mb-2 text-sm">
                            Certifications
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {Array.isArray(organizer.certifications) &&
                                organizer.certifications.length > 0
                                ? organizer.certifications.slice(0, 2).map((c: any, i: number) => (
                                    <div
                                        key={i}
                                        className="h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500"
                                    >
                                        Certificate {i + 1}
                                    </div>
                                ))
                                : (
                                    <>
                                        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                            Certificate
                                        </div>
                                        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                            Certificate
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
