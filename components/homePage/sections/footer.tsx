import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { APP_BRANDING } from "@/lib/constants/assets";

export function Footer() {
  return (
    <footer className="border-t bg-brand-gradient text-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between text-xs">
        <p>
          © {new Date().getFullYear()} {APP_BRANDING}. All rights reserved.
        </p>

        <div className="flex gap-3">
          <Link href="#"><Facebook className="w-4 h-4" /></Link>
          <Link href="#"><Instagram className="w-4 h-4" /></Link>
          <Link href="#"><Youtube className="w-4 h-4" /></Link>
        </div>
      </div>
    </footer>
  );
}
