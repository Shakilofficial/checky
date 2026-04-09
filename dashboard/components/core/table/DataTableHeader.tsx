"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { flexRender, type Header, type Table } from "@tanstack/react-table";

/* ---------------------------------------------
   Header Cell
--------------------------------------------- */

interface HeaderCellProps<T> {
  header: Header<T, unknown>;
  sortable: boolean;
}

const HeaderCell = <T,>({ header, sortable }: HeaderCellProps<T>) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.column.id,
    disabled: !sortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "h-12 px-4 font-bold text-left",
        "bg-muted/50 text-muted-foreground/80 lowercase tracking-wider text-[11px]",
        "sticky top-0 z-30 whitespace-nowrap",
        "border-b border-border/40",
        isDragging && "bg-muted/80 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 w-full uppercase">
        {sortable && (
          <button
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:bg-muted p-1 rounded transition-colors"
          >
            <GripVertical className="h-3 w-3 opacity-40 hover:opacity-100 transition-opacity" />
          </button>
        )}

        <span className="truncate">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
      </div>
    </TableHead>
  );
};

/* ---------------------------------------------
   Main Header
--------------------------------------------- */

interface Props<T> {
  table: Table<T>;
  enableRowDrag: boolean;
  enableColumnDrag: boolean;
  columnOrder: string[];
}

export const DataTableHeader = <T,>({
  table,
  enableRowDrag,
  enableColumnDrag,
  columnOrder,
}: Props<T>) => {
  return (
    <TableHeader
      className={cn("sticky top-0 z-20 w-full bg-muted/50 backdrop-blur-md", "border-b-0")}
    >
      <SortableContext
        id="columns"
        items={columnOrder}
        strategy={horizontalListSortingStrategy}
      >
        <TableRow className="w-full bg-transparent border-0 border-b-0 hover:bg-transparent">
          {enableRowDrag && (
            <TableHead className="w-10 px-0 border-0 border-b-0 bg-muted/50" />
          )}

          {table
            .getHeaderGroups()
            .map((group) =>
              group.headers.map((header) => (
                <HeaderCell
                  key={header.id}
                  header={header}
                  sortable={enableColumnDrag}
                />
              )),
            )}
        </TableRow>
      </SortableContext>
    </TableHeader>
  );
};
