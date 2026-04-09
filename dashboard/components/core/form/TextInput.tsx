"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "./FormField";

import type React from "react";
import type { ReactNode } from "react";

interface TextInputProps<
  T extends FieldValues,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  variant?: "default" | "ghost" | "outline";
  icon?: ReactNode;
}

export function TextInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  variant = "default",
  className,
  id,
  icon,
  ...props
}: TextInputProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  const variants = {
    default: "",
    ghost:
      "border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring",
    outline: "border-2 focus-visible:ring-0 focus-visible:border-primary",
  };

  return (
    <FormField
      label={label}
      error={error as unknown}
      description={description}
      required={required}
      id={id ?? name}
      icon={icon}
    >
      <Input
        id={id ?? name}
        className={cn(variants[variant], className)}
        {...register(name)}
        {...props}
      />
    </FormField>
  );
}
