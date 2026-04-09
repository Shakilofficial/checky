/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import {
    Controller,
    useFormContext,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { FormField } from "./FormField";

interface MultiImageUploadInputProps<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    description?: string;

    /* existing images */
    defaultImages?: string[];

    /* styling */
    previewClassName?: string;
    containerClassName?: string;

    /* config */
    accept?: string;
    disabled?: boolean;
    maxFiles?: number;

    /* optional icon */
    icon?: ReactNode;
}

export function MultiImageUploadInput<T extends FieldValues>({
    name,
    label,
    description,
    defaultImages = [],
    previewClassName = "h-24 w-24 rounded-lg object-cover border",
    containerClassName = "space-y-4",
    accept = "image/*",
    disabled,
    maxFiles = 10,
    icon,
}: MultiImageUploadInputProps<T>) {
    const { control, formState } = useFormContext<T>();
    const error = formState.errors[name];

    // Track both existing URLs and new file preview URLs
    const [previews, setPreviews] = useState<{ url: string; isNew: boolean }[]>(
        defaultImages.map(url => ({ url, isNew: false }))
    );

    /* cleanup blob urls */
    useEffect(() => {
        return () => {
            previews.forEach(p => {
                if (p.isNew && p.url.startsWith("blob:")) URL.revokeObjectURL(p.url);
            });
        };
    }, [previews]);

    return (
        <FormField
            label={label}
            description={description}
            error={error as any}
            icon={icon}
        >
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className={containerClassName}>
                        {/* File Input */}
                        <div className="relative">
                            <Input
                                type="file"
                                accept={accept}
                                multiple
                                disabled={disabled || (previews.length >= maxFiles)}
                                className="h-10 px-3 py-2 cursor-pointer"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length === 0) return;

                                    const currentFiles = Array.isArray(field.value) ? field.value : [];

                                    // Calculate how many new files we can still add
                                    const availableSlots = maxFiles - previews.length;
                                    const allowedFiles = files.slice(0, availableSlots);

                                    const newFiles = [...currentFiles, ...allowedFiles];
                                    field.onChange(newFiles);

                                    const newItems = allowedFiles.map(file => ({
                                        url: URL.createObjectURL(file),
                                        isNew: true
                                    }));

                                    setPreviews(prev => [...prev, ...newItems]);
                                }}
                            />
                            {previews.length >= maxFiles && (
                                <p className="text-[10px] text-amber-600 font-bold mt-1">Maximum {maxFiles} files reached.</p>
                            )}
                        </div>

                        {/* Previews Grid */}
                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {previews.map((item, index) => (
                                    <div key={item.url} className="relative group">
                                        <Image
                                            src={item.url}
                                            alt={`Preview ${index}`}
                                            width={100}
                                            height={100}
                                            className={cn(previewClassName, "shadow-sm border-border/40 transition-all group-hover:border-primary/40")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPreviews = previews.filter((_, i) => i !== index);
                                                setPreviews(newPreviews);

                                                if (item.isNew) {
                                                    // Find index in field.value (which only contains Files)
                                                    const fileIndex = previews.slice(0, index).filter(p => p.isNew).length;
                                                    const currentFiles = Array.isArray(field.value) ? field.value : [];
                                                    const newFiles = currentFiles.filter((_: any, i: number) => i !== fileIndex);
                                                    field.onChange(newFiles);
                                                    if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
                                                }
                                            }}
                                            className="absolute -top-1.5 -right-1.5 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        {!item.isNew && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 backdrop-blur-sm py-0.5 text-[8px] text-white text-center font-black uppercase tracking-tighter">
                                                Saved
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            />
        </FormField>
    );
}
