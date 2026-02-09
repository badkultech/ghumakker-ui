import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { useEffect } from 'react';

export interface DynamicOption {
    id: string;
    name: string;
    price: string;
    discount: string;
}

export interface DynamicCategory {
    id: string;
    name: string;
    description: string;
    type: 'single' | 'multi';
    options: DynamicOption[];
}

interface DynamicCategoryCardProps {
    category: DynamicCategory;
    onChange: (updated: DynamicCategory) => void;
    onRemove: () => void;
    onValidate?: (isValid: boolean) => void;
}

export function DynamicCategoryCard({ category, onChange, onRemove, onValidate }: DynamicCategoryCardProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState<{ idx: number; option: DynamicOption } | null>(null);
    const [bulkDiscount, setBulkDiscount] = useState('');
    const [errors, setErrors] = useState<any>({});
    function validate() {
        const e: any = {};

        // category name
        if (!category.name?.trim()) {
            e.name = "Category name is required";
        }

        // must have at least 1 option
        if (!category.options.length) {
            e.options = "At least one option is required";
        }

        // SINGLE
        if (category.type === "single") {
            const opt = category.options[0];

            if (!opt.price || Number(opt.price) <= 0) {
                e.singlePrice = "Price must be greater than 0";
            }

            if (opt.discount && (Number(opt.discount) < 0 || Number(opt.discount) > 100)) {
                e.singleDiscount = "Discount must be between 0–100";
            }
        }

        // MULTI
        if (category.type === "multi") {
            category.options.forEach((o, i) => {
                if (!o.name?.trim()) {
                    e[`name-${i}`] = "Option name is required";
                }

                if (!o.price || Number(o.price) <= 0) {
                    e[`price-${i}`] = "Price must be greater than 0";
                }

                if (o.discount && (Number(o.discount) < 0 || Number(o.discount) > 100)) {
                    e[`discount-${i}`] = "Discount must be 0–100%";
                }
            });
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }


    const handleDeleteClick = (idx: number, option: DynamicOption) => {
        setOptionToDelete({ idx, option });
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (optionToDelete) {
            removeOption(optionToDelete.idx);
            setDeleteModalOpen(false);
            setOptionToDelete(null);
        }
    };

    const updateField = (field: keyof DynamicCategory, value: any) =>
        onChange({ ...category, [field]: value });

    const addOption = () => {
        const newOption: DynamicOption = {
            id: crypto.randomUUID(),
            name: '',
            price: '',
            discount: '',
        };
        onChange({ ...category, options: [...category.options, newOption] });
    };

    const updateOption = (idx: number, field: keyof DynamicOption, value: string) => {
        const newOptions = [...category.options];
        newOptions[idx] = { ...newOptions[idx], [field]: value };
        onChange({ ...category, options: newOptions });
    };

    const removeOption = (idx: number) => {
        const newOptions = category.options.filter((_, i) => i !== idx);
        onChange({ ...category, options: newOptions });
    };

    /* ⭐ IMPORTANT PATCH ⭐
       Simple (single) mode → Name "Standard" must exist for summary
       but must NOT show in UI 
    */
    if (category.type === "single" && category.options[0]) {
        const opt = category.options[0];
        if (!opt.name || opt.name.trim() === "") {
            updateOption(0, "name", "Standard");
        }
    }

    useEffect(() => {
        if (onValidate) {
            onValidate(validate());
        }
    }, [category]);

    return (
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 mb-6 relative">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Price Category</h3>

                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button className="text-gray-400 hover:text-primary transition">
                                    <Info className="w-4 h-4" />
                                </button>
                            </TooltipTrigger>

                            <TooltipContent
                                side="right"
                                align="start"
                                showArrow={false}
                                className="max-w-xs bg-white text-gray-700 shadow-xl rounded-xl p-4 border"
                            >
                                <div className="space-y-1">
                                    <p> <Info className="w-4 h-4 text-primary mt-1" /></p>
                                    <p className="text-sm leading-relaxed">
                                        Allows you to create flexible pricing options based on
                                        different categories. Each category can have multiple
                                        price options.
                                    </p>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="text-muted-foreground hover:text-destructive -mt-1 -mr-2"
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className="space-y-4">

                {/* Basic Info */}
                <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                        placeholder="e.g. Car, Hotel, Ticket"
                        value={category.name}
                        onChange={(e) => updateField('name', e.target.value)}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                        placeholder="Enter description here"
                        value={category.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className="resize-none"
                    />
                    <div className="text-right text-xs text-muted-foreground">0/500 Words</div>
                </div>

                {/* Pricing Type */}
                <div className="space-y-2">
                    <Label>Pricing Type</Label>

                    <RadioGroup
                        value={category.type}
                        onValueChange={(val) => updateField('type', val)}
                        className="grid grid-cols-2 gap-4"
                    >
                        {/* SINGLE */}
                        <Label
                            htmlFor={`single-${category.id}`}
                            className={cn(
                                "relative flex flex-col gap-2 rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 transition-all",
                                category.type === 'single'
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-gray-200 bg-white"
                            )}
                            style={{ alignItems: "flex-start" }}
                        >
                            <RadioGroupItem
                                value="single"
                                id={`single-${category.id}`}
                                className="sr-only"
                            />
                            <span className="font-bold">Single Price</span>
                            <span className="text-xs text-muted-foreground">Single price for this category</span>
                        </Label>

                        {/* MULTI */}
                        <Label
                            htmlFor={`multi-${category.id}`}
                            className={cn(
                                "relative flex flex-col gap-2 rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 transition-all",
                                category.type === 'multi'
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-gray-200 bg-white"
                            )}
                            style={{ alignItems: "flex-start" }}
                        >
                            <RadioGroupItem
                                value="multi"
                                id={`multi-${category.id}`}
                                className="sr-only"
                            />
                            <span className="font-bold">Multi-price</span>
                            <span className="text-xs text-muted-foreground">
                                Different choices with different pricing
                            </span>
                        </Label>
                    </RadioGroup>
                </div>

                {/* Bulk Action */}
                {category.type === 'multi' && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-primary font-medium text-sm">
                            <Tag className="w-4 h-4" />
                            <span>Apply Discount to All</span>
                        </div>

                        <div className="flex gap-3 items-center">
                            <div className="relative w-40">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Discount</span>
                                <Input
                                    value={bulkDiscount}
                                    onChange={(e) => setBulkDiscount(e.target.value)}
                                    className="pl-20 pr-12 h-11"
                                />
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 bg-gray-50 text-gray-500 border rounded px-2 py-1 text-xs">
                                    % ₹
                                </div>
                            </div>

                            <Button
                                className="bg-brand-gradient text-white h-11 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
                                onClick={() => {
                                    if (!bulkDiscount) return;
                                    const newOptions = category.options.map(o => ({
                                        ...o,
                                        discount: bulkDiscount
                                    }));
                                    onChange({ ...category, options: newOptions });
                                }}
                            >
                                Apply to all
                            </Button>
                        </div>
                    </div>
                )}

                {/* Options List */}
                <div className="space-y-3">
                    {category.type === 'single' ? (
                        /* Single Type Layout — No Name Shown */
                        <div className="flex gap-4 items-end">

                            {/* PRICE */}
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs text-muted-foreground">Price (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={category.options[0]?.price || ''}
                                    onChange={(e) => updateOption(0, 'price', e.target.value)}
                                    className="h-11"
                                />
                                {errors.singlePrice && (
                                    <p className="text-red-500 text-xs">{errors.singlePrice}</p>
                                )}
                            </div>

                            {/* DISCOUNT */}
                            <div className="w-1/3 space-y-1">
                                <Label className="text-xs text-muted-foreground">Discount</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="0"
                                        value={category.options[0]?.discount || ''}
                                        onChange={(e) => updateOption(0, 'discount', e.target.value)}
                                        className="h-11 pr-8"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        %
                                    </div>
                                </div>
                                {errors.singleDiscount && (
                                    <p className="text-red-500 text-xs">{errors.singleDiscount}</p>
                                )}
                            </div>
                        </div>
                    ) : (

                        /* Multi Type Layout */
                        category.options.map((option, idx) => (
                            <div key={option.id} className="flex gap-2 items-start">
                                <div className="flex-1 space-y-1">
                                    {idx === 0 && <Label className="text-xs text-muted-foreground">Option Name</Label>}
                                    <Input
                                        placeholder="e.g. Economy, Sedan"
                                        value={option.name}
                                        onChange={(e) => updateOption(idx, 'name', e.target.value)}
                                    />
                                    {errors[`name-${idx}`] && (
                                        <p className="text-red-500 text-xs">{errors[`name-${idx}`]}</p>
                                    )}
                                </div>

                                <div className="w-28 space-y-1">
                                    {idx === 0 && <Label className="text-xs text-muted-foreground">Price (₹)</Label>}
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={option.price}
                                        onChange={(e) => updateOption(idx, 'price', e.target.value)}
                                    />
                                    {errors[`price-${idx}`] && (
                                        <p className="text-red-500 text-xs">{errors[`price-${idx}`]}</p>
                                    )}
                                </div>

                                <div className="w-32 space-y-1">
                                    {idx === 0 && <Label className="text-xs text-muted-foreground">Discount</Label>}
                                    <div className="relative">
                                        <Input
                                            placeholder="0"
                                            value={option.discount}
                                            onChange={(e) => updateOption(idx, 'discount', e.target.value)}
                                            className="pr-8"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">%</div>
                                    </div>
                                    {errors[`discount-${idx}`] && (
                                        <p className="text-red-500 text-xs">{errors[`discount-${idx}`]}</p>
                                    )}
                                </div>

                                {category.options.length > 1 && (
                                    <div className={idx === 0 ? "pt-7" : ""}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteClick(idx, option)}
                                            className="h-10 w-10 text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Add Option Button */}
                {category.type === 'multi' && (
                    <Button
                        variant="outline"
                        className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-foreground hover:border-gray-400"
                        onClick={addOption}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Pricing Option
                    </Button>
                )}

            </div>

            {/* Delete Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>You are about to delete:</DialogDescription>
                    </DialogHeader>

                    {optionToDelete && (
                        <div className="border rounded-xl p-4 my-2">
                            <div className="text-sm text-gray-500 mb-1">
                                {optionToDelete.option.name || 'Untitled Option'}
                            </div>
                            <div className="text-xl font-bold">
                                ₹ {optionToDelete.option.price || '0'}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline" className="w-full sm:w-auto h-11">Cancel</Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 h-11"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
