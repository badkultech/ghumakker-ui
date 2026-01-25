interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="border-l-4 border-brand-orange pl-4 py-2">
      <p className="text-gray-600 text-sm italic mb-2">"{quote}"</p>
      <p className="text-gray-900 font-medium text-sm">
        — {author}, {role}
      </p>
    </div>
  );
}
