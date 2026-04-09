/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

export interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];

  /** Optional: defaults to row.id */
  rowIdAccessor?: (row: T) => string | number;

  enableRowDrag?: boolean;
  enableColumnDrag?: boolean;

  onRowOrderChange?: (data: T[]) => void;
  onColumnOrderChange?: (order: string[]) => void;

  className?: string;
  emptyMessage?: ReactNode;
}
