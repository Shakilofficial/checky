/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "./FormField";

interface NumberInputProps<T extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name"
> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export function NumberInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  id,
  icon,
  ...props
}: NumberInputProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <FormField
      label={label}
      error={error as any}
      description={description}
      required={required}
      id={id ?? name}
      icon={icon}
    >
      <Input
        type="number"
        id={id ?? name}
        className={className}
        {...register(name, {
          valueAsNumber: true,
        })}
        {...props}
      />
    </FormField>
  );
}
