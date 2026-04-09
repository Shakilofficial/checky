/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldError, FieldErrorsImpl } from "react-hook-form";

export function getFieldError(
  error: FieldError | FieldErrorsImpl<any> | undefined,
): FieldError | undefined {
  if (!error) {
    return undefined;
  }

  // If it's a Merge type with nested errors, extract just the FieldError part
  if (typeof error === "object" && "message" in error) {
    return {
      type: error.type,
      message: error.message,
    } as FieldError;
  }

  return undefined;
}
