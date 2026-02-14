import Link from "next/link";
import { APP_BRANDING } from "@/lib/constants/assets";
import { socialLinks } from "@/app/home/constants";

export function Footer() {
  return (
    <footer className="border-t bg-brand-gradient text-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between text-xs">
        <p>
          © {new Date().getFullYear()} {APP_BRANDING}. All rights reserved.
        </p>

        <div className="flex gap-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Icon className="w-3 h-3 text-white" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
