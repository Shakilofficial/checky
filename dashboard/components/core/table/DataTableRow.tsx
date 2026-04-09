/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Row } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";

interface Props<T> {
  row: Row<T>;
  id: string | number;
  disabled?: boolean;
  children: React.ReactNode;
}

export const DataTableRow = <T,>({ row, id, disabled, children }: Props<T>) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group transition-colors",
        "hover:bg-muted/80",
        "border-b border-border/30 border-b-1",
        "last:border-b-0",
        isDragging && "bg-accent/30 shadow-2xl z-50 scale-[1.01] opacity-80",
      )}
    >
      {/* Drag Handle */}
      {!disabled && (
        <TableCell className="w-10 px-0">
          <Button
            variant="ghost"
            size="icon"
            {...listeners}
            className={cn(
              "h-12 w-full",
              "opacity-40 group-hover:opacity-100",
              "cursor-grab active:cursor-grabbing transition-opacity",
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </TableCell>
      )}

      {children}
    </TableRow>
  );
};
