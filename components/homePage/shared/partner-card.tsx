import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PartnerCardProps {
  id: string;
  name: string;
  logo: string;
}

export function PartnerCard({ id, name, logo }: PartnerCardProps) {
  return (
    <Link
      href={`/home/partners/${id}`}
      className="flex items-start flex-col justify-between gap-y-8 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          <Image
            src={logo || "/placeholder.svg"}
            alt={name}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-orange-500 text-sm">View Full Profile</span>
        <ChevronRight className="w-4 h-4 text-orange-500" />
      </div>
    </Link>
  );
}
