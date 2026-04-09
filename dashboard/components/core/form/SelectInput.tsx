/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import type { ReactNode } from "react";
import { FormField } from "./FormField";

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  icon?: ReactNode;
}

export function SelectInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  options,
  placeholder,
  icon,
}: SelectInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField
      label={label}
      error={error as any}
      description={description}
      required={required}
      id={name}
      icon={icon}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className="rounded-lg bg-card/90 backdrop-blur-md">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}
