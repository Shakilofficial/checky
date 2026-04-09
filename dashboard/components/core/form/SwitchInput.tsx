/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Switch } from "@/components/ui/switch";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import type { ReactNode } from "react";
import { FormField } from "./FormField";

interface SwitchInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  icon?: ReactNode;
}

export function SwitchInput<T extends FieldValues>({
  name,
  label,
  description,
  icon,
}: SwitchInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField error={error as any} description={description} icon={icon}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium">{label}</span>}

            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </div>
        )}
      />
    </FormField>
  );
}
