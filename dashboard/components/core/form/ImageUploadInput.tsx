/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import {
    Controller,
    useFormContext,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";

import { FormField } from "./FormField";

interface ImageUploadInputProps<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    description?: string;

    /* existing image */
    defaultImage?: string;

    /* styling */
    previewClassName?: string;
    containerClassName?: string;

    /* config */
    accept?: string;
    disabled?: boolean;

    /* optional icon */
    icon?: ReactNode;
}

export function ImageUploadInput<T extends FieldValues>({
    name,
    label,
    description,
    defaultImage,
    previewClassName = "h-32 w-32 rounded-md object-cover border",
    containerClassName = "flex flex-col items-start gap-4",
    accept = "image/*",
    disabled,
    icon,
}: ImageUploadInputProps<T>) {
    const { control, formState } = useFormContext<T>();
    const error = formState.errors[name];

    const [preview, setPreview] = useState<string | null>(defaultImage || null);

    /* cleanup blob url */
    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

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
                        {/* Preview */}
                        {preview && (
                            <Image
                                src={preview}
                                alt="Preview"
                                width={200}
                                height={200}
                                className={previewClassName}
                            />
                        )}

                        {/* File Input */}
                        <Input
                            type="file"
                            accept={accept}
                            disabled={disabled}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                field.onChange(file);

                                const url = URL.createObjectURL(file);
                                setPreview(url);
                            }}
                        />
                    </div>
                )}
            />
        </FormField>
    );
}
