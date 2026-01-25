"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onView,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="flex justify-end gap-3 text-gray-500 mt-3">
            {onEdit && (
                <button
                    className="hover:text-brand-orange"
                    onClick={onEdit}
                    title="Edit"
                >
                    <Pencil className="w-4 h-4" />
                </button>
            )}

            {onView && (
                <button
                    className="hover:text-brand-orange"
                    onClick={onView}
                    title="View"
                >
                    <Eye className="w-4 h-4" />
                </button>
            )}

            {onDelete && (
                <button
                    className="hover:text-red-500"
                    onClick={onDelete}
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
