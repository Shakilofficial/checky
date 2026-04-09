"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "@/components/ui/label";

import type { ReactNode } from "react";
import { FormField } from "./FormField";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  options: RadioOption[];
  description?: string;
  icon?: ReactNode;
}

export function RadioGroupInput<T extends FieldValues>({
  name,
  label,
  options,
  description,
  icon,
}: RadioGroupInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField
      label={label}
      error={error as unknown}
      description={description}
      icon={icon}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={opt.value} />

                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </FormField>
  );
}
