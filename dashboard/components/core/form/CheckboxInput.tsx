"use client";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import type { ReactNode } from "react";
import { FormField } from "./FormField";

interface CheckboxInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  icon?: ReactNode;
}

export function CheckboxInput<T extends FieldValues>({
  name,
  label,
  description,
  icon,
}: CheckboxInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField error={error as unknown} description={description} icon={icon}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
            />

            {label && (
              <label htmlFor={name} className="text-sm font-medium">
                {label}
              </label>
            )}
          </div>
        )}
      />
    </FormField>
  );
}
