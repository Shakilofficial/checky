/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import type { ZodSchema } from "zod";

interface FormProps<T extends FieldValues = FieldValues> {
  schema: ZodSchema;
  defaultValues?: Partial<T>;
  children: ReactNode;
  onSubmit?: (values: T) => void | Promise<void>;
  form?: UseFormReturn<T>;
  className?: string;
  submitButtonText?: string;
  submitButtonClassName?: string;
  hideSubmitButton?: boolean;
  isLoading?: boolean;
}

export function Form<T extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  children,
  onSubmit,
  form: externalForm,
  className,
  submitButtonText = "Submit",
  submitButtonClassName,
  hideSubmitButton = false,
  isLoading = false,
}: FormProps<T>) {
  // Always call useForm at the top level to avoid conditional hook calls
  const internalForm = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as any,
    mode: "onSubmit",
  });

  const methods = externalForm || internalForm;

  const handleSubmit: SubmitHandler<any> = async (values) => {
    if (onSubmit) {
      await onSubmit(values as T);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit as any)}
        className={className ?? "space-y-4"}
        noValidate
      >
        {children}

        {!hideSubmitButton && (
          <Button
            type="submit"
            disabled={isLoading}
            className={
              submitButtonClassName ??
              "w-full text-white font-medium flex items-center justify-center"
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        )}
      </form>
    </FormProvider>
  );
}
