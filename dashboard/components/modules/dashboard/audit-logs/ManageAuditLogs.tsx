/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { DataTable } from "@/components/core/table/DataTable";
import { DataTablePagination } from "@/components/core/table/DataTablePagination";
import { TableToolbar } from "@/components/core/table/TableToolbar";
import { IMeta } from "@/types/common";
import { IAuditLog } from "@/types/audit-log";
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { columns } from "./columns";

interface ManageAuditLogsProps {
  data: IAuditLog[];
  meta: IMeta;
}

export default function ManageAuditLogs({ data, meta }: ManageAuditLogsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- URL Helpers ---
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // --- Pagination & Sorting State ---
  const pageIndex = (meta?.page || 1) - 1;
  const pageSize = meta?.limit || 10;

  const pagination = useMemo<PaginationState>(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const sortParam = searchParams?.get("sort");
  const sorting = useMemo<SortingState>(() => {
    if (!sortParam) return [];
    const desc = sortParam.startsWith("-");
    const id = desc ? sortParam.substring(1) : sortParam;
    return [{ id, desc }];
  }, [sortParam]);

  // --- Handlers ---
  const handlePaginationChange = (updaterOrValue: any) => {
    const nextState =
      typeof updaterOrValue === "function"
        ? updaterOrValue(pagination)
        : updaterOrValue;

    router.push(
      `${pathname}?${createQueryString({
        page: nextState.pageIndex + 1,
        limit: nextState.pageSize,
      })}`,
    );
  };

  const handleSortingChange = (updaterOrValue: any) => {
    const nextState =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting)
        : updaterOrValue;

    if (nextState.length === 0) {
      router.push(`${pathname}?${createQueryString({ sort: null })}`);
      return;
    }

    const { id, desc } = nextState[0];
    const sortValue = desc ? `-${id}` : id;
    router.push(`${pathname}?${createQueryString({ sort: sortValue })}`);
  };

  // --- Table Instance ---
  const table = useReactTable({
    data,
    columns,
    state: { pagination, sorting },
    pageCount: meta?.totalPage || -1,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <TableToolbar searchPlaceholder="Search logs..." filters={[]}>
        {/* No additional buttons for logs usually */}
      </TableToolbar>

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          rowIdAccessor={(row: IAuditLog) => row.id}
          enableRowDrag={true}
          enableColumnDrag={true}
          emptyMessage="No audit logs found"
        />

        <DataTablePagination table={table} total={meta?.total || 0} />
      </div>
    </div>
  );
}
