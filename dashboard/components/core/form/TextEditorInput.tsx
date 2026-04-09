"use client";

import TextEditor from "@/components/core/form/TextEditor";
import React from "react";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FormField } from "./FormField";

interface TextEditorInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

export function TextEditorInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  placeholder,
  icon,
}: TextEditorInputProps<T>) {
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
      required={required}
      id={String(name)}
      icon={icon}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextEditor
            value={field.value ?? ""}
            onChange={(html) => field.onChange(html)}
            placeholder={placeholder}
            className="text-sm"
          />
        )}
      />
    </FormField>
  );
}

export default TextEditorInput;
