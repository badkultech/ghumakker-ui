"use client";

import { Eye, Pencil } from "lucide-react";

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onView,
    onEdit,
}) => {
    return (
        <div className="flex justify-end gap-3 text-gray-500 mt-3">
            {onEdit && (
                <button
                    className="hover:text-primary"
                    onClick={onEdit}
                    title="Edit"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            )}

            {onView && (
                <button
                    className="hover:text-primary"
                    onClick={onView}
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
