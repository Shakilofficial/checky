/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FormField } from "./FormField";

interface PasswordInputProps<T extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  showStrength?: boolean;
  icon?: React.ReactNode;
}

export function PasswordInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  showStrength = false,
  className,
  id,
  icon,
  ...props
}: PasswordInputProps<T>) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  const [visible, setVisible] = useState(false);

  const value = watch(name) ?? "";

  const strength = getStrength(value);

  return (
    <FormField
      label={label}
      error={error as any}
      description={description}
      required={required}
      id={id ?? name}
      icon={icon}
    >
      <div className="relative">
        <Input
          id={id ?? name}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          {...register(name)}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setVisible(!visible)}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showStrength && value && <PasswordStrength strength={strength} />}
    </FormField>
  );
}

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function getStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(score, 5);
}

function PasswordStrength({ strength }: { strength: number }) {
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-full rounded bg-muted",
              i < strength && "bg-primary",
            )}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Strength: {labels[strength - 1] ?? "Very Weak"}
      </p>
    </div>
  );
}
