/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "./FormField";

import type React from "react";

interface TextareaInputProps<
  T extends FieldValues,
> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  showCharCount?: boolean;
  icon?: React.ReactNode;
}

export function TextareaInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  showCharCount,
  maxLength,
  className,
  id,
  icon,
  ...props
}: TextareaInputProps<T>) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  const value = watch(name);
  const length = value?.toString().length ?? 0;

  return (
    <FormField
      label={label}
      error={error as any}
      description={description}
      required={required}
      id={id ?? name}
      icon={icon}
    >
      <Textarea
        id={id ?? name}
        className={cn(
          "resize-none",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        maxLength={maxLength}
        {...register(name)}
        {...props}
      />

      {showCharCount && maxLength && (
        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs text-muted-foreground",
              length > maxLength * 0.9 && "text-orange-500",
              length === maxLength && "text-destructive",
            )}
          >
            {length}/{maxLength}
          </span>
        </div>
      )}
    </FormField>
  );
}
