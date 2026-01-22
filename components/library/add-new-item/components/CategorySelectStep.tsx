import React from "react";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

type CategoryItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  step: string;
};

interface Props {
  categories: CategoryItem[];
  selected: CategoryItem | null;
  setSelected: (item: CategoryItem) => void;
  handleNext: () => void;
}

export const CategorySelectStep: React.FC<Props> = ({
  categories,
  selected,
  setSelected,
  handleNext,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {categories.slice(0, 6).map(({ label, icon: Icon, step }) => (
          <button
            key={label}
            onClick={() => setSelected({ label, icon: Icon, step })}
            className={`flex flex-col justify-center items-center p-6 h-24 rounded-xl border transition ${
              selected?.label === label
                ? "border-orange-500 shadow-md"
                : "border-gray-200 hover:border-orange-400"
            }`}
          >
            <Icon className="h-6 w-6 text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() =>
            setSelected({
              label: "FAQs",
              icon: HelpCircle,
              step: "faq",
            })
          }
          className={`flex flex-col justify-center items-center w-full p-6 h-20 rounded-xl border transition ${
            selected?.label === "FAQs"
              ? "border-orange-500 shadow-md"
              : "border-gray-200 hover:border-orange-400"
          }`}
        >
          <HelpCircle className="h-6 w-6 text-gray-600 mb-2" />
          <span className="text-sm font-medium text-gray-700">FAQs</span>
        </button>
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline" className="rounded-full px-6">
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={handleNext}
          disabled={!selected}
          className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
        >
          Next
        </Button>
      </DialogFooter>
    </>
  );
};
