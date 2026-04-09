"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/* ======================================================
   Types
====================================================== */

interface ResponsiveModalProps {
  children: React.ReactNode;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: string;
  description?: string;

  trigger?: React.ReactNode;

  footer?: React.ReactNode;

  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

  loading?: boolean;
}

/* ======================================================
   Helpers
====================================================== */

const widthMap = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
};

/* ======================================================
   Component
====================================================== */

export function ResponsiveModal({
  children,

  open,
  onOpenChange,

  title,
  description,
  trigger,

  footer,

  maxWidth = "md",

  loading = false,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  /* ======================================================
     Desktop (Dialog)
  ====================================================== */

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

        <DialogContent
          className={cn(
            "p-0 gap-0 flex flex-col max-h-[96vh] overflow-hidden rounded-2xl border border-border bg-background dark:bg-zinc-900 shadow-2xl backdrop-blur-sm",
            widthMap[maxWidth]
          )}
        >
          {/* Header */}
          {(title || description) && (
            <DialogHeader
              className="
                shrink-0
                border-b border-border
                p-6
                bg-muted/40 dark:bg-zinc-900/80
                flex flex-col gap-1.5 justify-center items-center text-center
              "
            >
              {title && (
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  {title}
                </DialogTitle>
              )}

              {description && (
                <DialogDescription className="text-sm text-muted-foreground font-medium">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}

          {/* Body */}
          <div
            className={cn(
              "flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-6 text-foreground",
              loading && "opacity-60 pointer-events-none"
            )}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div
              className="
                shrink-0
                border-t border-border
                p-4 px-6
                flex justify-end gap-3
                bg-muted/30 dark:bg-zinc-900/70
              "
            >
              {footer}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  /* ======================================================
     Mobile (Drawer)
  ====================================================== */

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent
        className="
          flex flex-col
          max-h-[96vh]
          rounded-t-[2rem]
          border-t border-border
          bg-background dark:bg-zinc-900
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Drag Handle */}
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/20" />

        {/* Header */}
        {(title || description) && (
          <DrawerHeader
            className="
              shrink-0
              border-b border-border
              bg-muted/40 dark:bg-zinc-900/80
              text-left
              px-6
              pt-4
              pb-4
            "
          >
            {title && (
              <DrawerTitle className="text-lg font-bold tracking-tight text-foreground">
                {title}
              </DrawerTitle>
            )}

            {description && (
              <DrawerDescription className="text-xs text-muted-foreground font-medium pt-1">
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
        )}

        {/* Body */}
        <div
          className={cn(
            "flex-1 overflow-y-auto px-6 py-8 space-y-6 text-foreground custom-scrollbar",
            loading && "opacity-60 pointer-events-none"
          )}
        >
          {children}
        </div>

        {/* Footer */}
        <DrawerFooter
          className="
            shrink-0
            border-t border-border
            bg-muted/30 dark:bg-zinc-900/70
            px-6
            py-6
            gap-3
          "
        >
          {footer ? (
            footer
          ) : (
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl font-bold border-border"
              >
                Dismiss Analysis
              </Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
