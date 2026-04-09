/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table as TTable } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
    table: TTable<TData>;
    total?: number; // Total items from server
}

export function DataTablePagination<TData>({
    table,
    total,
}: DataTablePaginationProps<TData>) {
    // Use passed total or client-side filtered length
    const totalRows = total ?? table.getFilteredRowModel().rows.length;

    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;
    const pageCount = table.getPageCount();

    const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    return (
        <div className="flex flex-col items-center justify-between gap-6 px-4 py-6 sm:flex-row sm:gap-4 border-t border-border/50 bg-background/50 backdrop-blur-sm rounded-b-xl">
            {/* Selection & Total Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 w-full sm:w-auto">
                {totalRows > 0 && (
                    <div className="text-sm text-muted-foreground whitespace-nowrap bg-muted/30 px-3 py-1.5 rounded-full border border-border/40 font-medium">
                        <span className="flex items-center gap-1.5 transition-all">
                            Showing{" "}
                            <span className="text-foreground font-semibold font-mono">
                                {startRow}
                            </span>{" "}
                            to{" "}
                            <span className="text-foreground font-semibold font-mono">
                                {endRow}
                            </span>{" "}
                            of{" "}
                            <span className="text-foreground font-semibold font-mono">
                                {totalRows}
                            </span>{" "}
                            entries
                        </span>
                    </div>
                )}

                {/* Page Size Selector */}
                <div className="flex items-center space-x-2 bg-muted/20 px-2 py-1 rounded-lg border border-border/30">
                    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                        Rows
                    </p>

                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-7 w-[65px] bg-transparent border-none shadow-none focus:ring-0 font-bold text-sm transition-all hover:bg-muted/50 rounded-md">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>

                        <SelectContent
                            side="top"
                            align="center"
                            className="min-w-[70px] shadow-xl border-border/60"
                        >
                            {[5, 10, 20, 30, 40, 50].map((size) => (
                                <SelectItem
                                    key={size}
                                    value={`${size}`}
                                    className="justify-center font-medium"
                                >
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8 justify-center sm:justify-end w-full sm:w-auto">
                {/* Page Info */}
                <div className="flex items-center gap-2 group">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest hidden lg:block">
                        Page
                    </span>
                    <div className="flex items-center font-mono text-sm">
                        <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-l-md border border-primary/20">
                            {pageIndex + 1}
                        </span>
                        <span className="bg-muted px-2 py-0.5 rounded-r-md border border-l-0 border-border/40 text-muted-foreground font-medium">
                            {pageCount || 1}
                        </span>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center p-1 bg-muted/30 rounded-xl border border-border/40">
                    <NavButton
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        icon={ChevronsLeft}
                        tooltip="First Page"
                        className="hidden lg:flex"
                    />
                    <NavButton
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        icon={ChevronLeft}
                        tooltip="Previous Page"
                    />

                    <div className="w-px h-4 bg-border/60 mx-1" />

                    <NavButton
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        icon={ChevronRight}
                        tooltip="Next Page"
                    />
                    <NavButton
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        icon={ChevronsRight}
                        tooltip="Last Page"
                        className="hidden lg:flex"
                    />
                </div>
            </div>
        </div>
    );
}

function NavButton({
    onClick,
    disabled,
    icon: Icon,
    tooltip,
    className,
}: {
    onClick: () => void;
    disabled: boolean;
    icon: any;
    tooltip: string;
    className?: string;
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-8 w-8 rounded-lg transition-all duration-200",
                "hover:bg-primary hover:text-white disabled:opacity-30",
                "active:scale-95",
                className,
            )}
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
        >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{tooltip}</span>
        </Button>
    );
}
