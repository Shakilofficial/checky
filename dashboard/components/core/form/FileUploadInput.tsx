/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { useState } from "react";

import type { ReactNode } from "react";
import { FormField } from "./FormField";

interface FileUploadInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  accept?: string;
  preview?: boolean;
  icon?: ReactNode;
}

export function FileUploadInput<T extends FieldValues>({
  name,
  label,
  description,
  accept = "image/*",
  preview = true,
  icon,
}: FileUploadInputProps<T>) {
  const { control, formState } = useFormContext<T>();

  const error = formState.errors[name];

  const [image, setImage] = useState<string | null>(null);

  return (
    <FormField
      label={label}
      error={error as any}
      description={description}
      icon={icon}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <Input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                field.onChange(file);

                if (preview) {
                  const url = URL.createObjectURL(file);

                  setImage(url);
                }
              }}
            />

            {preview && image && (
              <Image
                src={image}
                alt="Preview"
                width={128}
                height={128}
                className="h-32 w-32 rounded-md object-cover border"
              />
            )}
          </div>
        )}
      />
    </FormField>
  );
}
