"use client";

export default function GradientCheckbox({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      id={id}
      onClick={onChange}
      className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-all duration-200
        ${
          checked
            ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-transparent"
            : "border-gray-300 bg-white"
        }`}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}
