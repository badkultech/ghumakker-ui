import { FileText } from "lucide-react";

interface CertificationItemProps {
  title: string;
  date: string;
}

export function CertificationItem({ title, date }: CertificationItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-orange-500" />
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-gray-500 text-xs">Uploaded on {date}</p>
      </div>
    </div>
  );
}
