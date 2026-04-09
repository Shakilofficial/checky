/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { DataTable } from "@/components/core/table/DataTable";
import { DataTablePagination } from "@/components/core/table/DataTablePagination";
import { TableToolbar } from "@/components/core/table/TableToolbar";
import { Button } from "@/components/ui/button";
import { IAuthUser, UserRole, UserStatus } from "@/types/auth";
import { IMeta } from "@/types/common";
import {
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { columns } from "./columns";
import { CreateUserModal } from "./CreateUserModal";

interface ManageUsersProps {
  data: IAuthUser[];
  meta: IMeta;
}

export default function ManageUsers({ data, meta }: ManageUsersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // --- Filter Config ---
  const filters = [
    {
      key: "role",
      title: "Role",
      options: Object.values(UserRole).map((role) => ({
        label: role.replace("_", " "),
        value: role,
      })),
    },
    {
      key: "status",
      title: "Status",
      options: Object.values(UserStatus).map((status) => ({
        label: status,
        value: status,
      })),
    },
  ];

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

  // --- Modal Success Handler ---
  const handleUserCreated = () => {
    // Optionally refetch or refresh data here
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <TableToolbar searchPlaceholder="Search users..." filters={filters}>
        <Button
          size="sm"
          className="h-9 gap-1 shadow-sm text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </TableToolbar>

      {/* Table */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={data}
          rowIdAccessor={(row: IAuthUser) => row.id}
          enableRowDrag={true}
          enableColumnDrag={true}
          emptyMessage="No users found"
        />

        <DataTablePagination table={table} total={meta?.total || 0} />
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleUserCreated}
      />
    </div>
  );
}
