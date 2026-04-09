"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { FormField } from "./FormField";

import type { ReactNode } from "react";

interface DateTimePickerInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  icon?: ReactNode;
}

export function DateTimePickerInput<T extends FieldValues>({
  name,
  label,
  description,
  required,
  placeholder = "Select date & time",
  icon,
}: DateTimePickerInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];
  const [time, setTime] = useState({ hours: "00", minutes: "00" });

  return (
    <FormField
      label={label}
      error={error as unknown}
      description={description}
      required={required}
      icon={icon}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleDateSelect = (date?: Date) => {
            if (!date) return;
            const updated = new Date(date);
            updated.setHours(Number(time.hours));
            updated.setMinutes(Number(time.minutes));
            field.onChange(updated);
          };

          const handleTimeChange = (
            type: "hours" | "minutes",
            value: string
          ) => {
            const updatedTime = { ...time, [type]: value };
            setTime(updatedTime);

            if (field.value) {
              const updated = new Date(field.value);
              updated.setHours(Number(updatedTime.hours));
              updated.setMinutes(Number(updatedTime.minutes));
              field.onChange(updated);
            }
          };

          return (
            <Popover>
              {/* FIX: asChild prevents nested button hydration error */}
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-border bg-background dark:bg-card dark:border-border dark:text-foreground",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value
                    ? format(field.value as Date, "PPP p")
                    : placeholder}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="
                  w-auto p-4
                  bg-card dark:bg-card/90
                  text-foreground dark:text-foreground
                  border border-border
                  shadow-lg
                  backdrop-blur-md
                  [&_select]:bg-card [&_select]:dark:bg-card/90
                  [&_select]:text-foreground [&_select]:dark:text-foreground
                "
              >
                {/* Calendar */}
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleDateSelect}
                  captionLayout="dropdown"
                  fromYear={1950}
                  toYear={2100}
                  className="rounded-md text-foreground dark:text-foreground"
                />

                {/* Time Picker */}
                <div className="flex items-center gap-2 mt-4">
                  <select
                    value={time.hours}
                    onChange={(e) => handleTimeChange("hours", e.target.value)}
                    className="
                      px-2 py-1 rounded-md
                      border border-border
                      bg-card dark:bg-card/90
                      text-foreground dark:text-foreground
                      focus:outline-none focus:ring-2 focus:ring-ring
                    "
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <span className="text-muted-foreground dark:text-muted-foreground">
                    :
                  </span>

                  <select
                    value={time.minutes}
                    onChange={(e) =>
                      handleTimeChange("minutes", e.target.value)
                    }
                    className="
                      px-2 py-1 rounded-md
                      border border-border
                      bg-card dark:bg-card/90
                      text-foreground dark:text-foreground
                      focus:outline-none focus:ring-2 focus:ring-ring
                    "
                  >
                    {Array.from({ length: 60 }).map((_, i) => (
                      <option key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </FormField>
  );
}
