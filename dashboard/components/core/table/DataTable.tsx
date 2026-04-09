/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnOrderState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { DataTableEmpty } from "./DataTableEmpty";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";

import type { DataTableProps } from "./types";

/* ======================================================
   Production DataTable
====================================================== */

export const DataTable = <T,>({
  columns: initialColumns,
  data: initialData,

  enableRowDrag = true,
  enableColumnDrag = true,

  rowIdAccessor,

  onRowOrderChange,
  onColumnOrderChange,

  className,
  emptyMessage = "No data",
}: DataTableProps<T>) => {
  const [data, setData] = useState(initialData);

  // Sync data with props for server-side updates
  useMemo(() => {
    setData(initialData);
  }, [initialData]);

  /* --------------------------------------------
     Row ID Resolver
  --------------------------------------------- */

  /* --------------------------------------------
     Row ID Resolver
  --------------------------------------------- */

  const getRowId = useMemo(() => {
    return (
      rowIdAccessor ??
      ((row: T) => {
        const id = (row as any).id;
        if (id === undefined) {
          throw new Error(
            "DataTable: rowIdAccessor not provided and row.id is missing",
          );
        }

        return id;
      })
    );
  }, [rowIdAccessor]);

  /* --------------------------------------------
     Normalize Columns
  --------------------------------------------- */

  const columns = useMemo(
    () =>
      initialColumns.map((col) => ({
        ...col,
        id: col.id ?? (col as any).accessorKey ?? crypto.randomUUID(),
      })),
    [initialColumns],
  );

  /* --------------------------------------------
     Column Order
  --------------------------------------------- */

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((c) => c.id!),
  );

  /* --------------------------------------------
     Table Instance
  --------------------------------------------- */

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    state: {
      columnOrder,
    },

    onColumnOrderChange: setColumnOrder,
  });

  /* --------------------------------------------
     Sensors
  --------------------------------------------- */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor),
  );

  /* --------------------------------------------
     Drag Handler
  --------------------------------------------- */

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    /* Column Drag */

    if (active.data.current?.sortable?.containerId === "columns") {
      const oldIndex = columnOrder.indexOf(String(active.id));
      const newIndex = columnOrder.indexOf(String(over.id));

      if (oldIndex === -1 || newIndex === -1) return;

      const updated = arrayMove(columnOrder, oldIndex, newIndex);

      setColumnOrder(updated);
      onColumnOrderChange?.(updated);

      return;
    }

    /* Row Drag */

    const oldIndex = data.findIndex(
      (row) => String(getRowId(row)) === String(active.id),
    );

    const newIndex = data.findIndex(
      (row) => String(getRowId(row)) === String(over.id),
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const updated = arrayMove(data, oldIndex, newIndex);

    setData(updated);
    onRowOrderChange?.(updated);
  };

  /* --------------------------------------------
     Row IDs
  --------------------------------------------- */

  const rowIds = useMemo(
    () => data.map((row) => String(getRowId(row))),
    [data, getRowId],
  );

  /* --------------------------------------------
     Render
  --------------------------------------------- */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      {/* ROOT CONTAINER */}
      <div
        className={cn(
          "relative w-full",
          "rounded-2xl bg-card shadow-sm",
          "border border-border/60",
          "overflow-hidden",
          className,
        )}
      >
        {/* SCROLL WRAPPER */}
        <div className="relative max-h-[70vh] w-full overflow-auto">
          <Table
            className={cn(
              "w-full min-w-max",
              "table-auto border-collapse",
            )}
          >
            <DataTableHeader
              table={table}
              enableRowDrag={enableRowDrag}
              enableColumnDrag={enableColumnDrag}
              columnOrder={columnOrder}
            />

            <TableBody>
              {table.getRowModel().rows.length ? (
                <SortableContext
                  items={rowIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => {
                    const rowId = getRowId(row.original);

                    return (
                      <DataTableRow
                        key={String(rowId)}
                        id={String(rowId)}
                        row={row}
                        disabled={!enableRowDrag}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "h-14 px-4 text-sm font-medium",
                              "align-middle",
                              "max-w-[280px]",
                              "truncate whitespace-nowrap",
                              "text-muted-foreground group-hover:text-foreground transition-colors",
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </DataTableRow>
                    );
                  })}
                </SortableContext>
              ) : (
                <DataTableEmpty
                  colSpan={columns.length + (enableRowDrag ? 1 : 0)}
                  message={emptyMessage}
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DndContext>
  );
};
