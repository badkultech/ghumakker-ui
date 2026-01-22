import Image from "next/image";
import { cn } from "@/lib/utils";

interface PartnerLogoProps {
  name?: string;
  logo: string;
  className?: string;
}

export function PartnerLogo({ name, logo, className }: PartnerLogoProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center min-w-[150px] h-20 px-6 hover:grayscale-1 transition-all",
        className
      )}
    >
      <Image
        src={logo || "/placeholder.svg"}
        alt={name ? name : "Partner-logo"}
        width={120}
        height={60}
        className="object-contain"
      />
    </div>
  );
}
