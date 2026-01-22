"use client";

import { ChevronLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showWishlist?: boolean;
}

export function Header({ title, showBack = true, showWishlist = true }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3 max-w-[1400px] mx-auto">

        {/* Left */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-muted rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}

          <h1 className="text-sm md:text-base font-semibold text-foreground">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {showWishlist && (
            <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
          )}

          <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <Avatar className="w-7 h-7 md:w-8 md:h-8">
              <AvatarImage src="/woman-avatar-profile.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
          </button>
        </div>

      </div>
    </header>
  );
}
