"use client";
import { Label } from "@/components/ui/label";
import { getFieldError } from "@/lib/form-utils";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  description?: string;
  required?: boolean;
  id?: string;
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  description,
  required,
  id,
  className,
  icon,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={id}
          className="text-sm font-medium flex items-center gap-2"
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </span>
        </Label>
      )}

      {children}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {error && getFieldError(error) && (
        <p className="text-xs text-destructive" role="alert">
          {getFieldError(error)?.message}
        </p>
      )}
    </div>
  );
}
