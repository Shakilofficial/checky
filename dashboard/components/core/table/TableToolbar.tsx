"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export interface FilterOption {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface FilterConfig {
    key: string;
    title: string;
    options: FilterOption[];
}

interface TableToolbarProps {
    searchPlaceholder?: string;
    searchKey?: string; // defaults to "searchTerm"
    filters?: FilterConfig[];
    children?: React.ReactNode; // For extra actions like "Add User"
}

export function TableToolbar({
    searchPlaceholder = "Search...",
    searchKey = "searchTerm",
    filters = [],
    children,
}: TableToolbarProps) {
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

    // --- Search State ---
    const initialSearch = searchParams?.get(searchKey) || "";
    const [searchValue, setSearchValue] = useState(initialSearch);

    useEffect(() => {
        setSearchValue(initialSearch);
    }, [initialSearch]);

    // --- Debounced Search ---
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== initialSearch) {
                router.push(
                    `${pathname}?${createQueryString({
                        [searchKey]: searchValue || null,
                        page: 1,
                    })}`,
                );
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [
        searchValue,
        initialSearch,
        searchKey,
        pathname,
        router,
        createQueryString,
    ]);

    // --- Filter Handlers ---
    const handleFilterChange = (key: string, value: string) => {
        router.push(
            `${pathname}?${createQueryString({
                [key]: value === "all" ? null : value,
                page: 1,
            })}`,
        );
    };

    const handleReset = () => {
        setSearchValue("");
        router.push(pathname || "");
    };

    // --- Check if filters are active ---
    const isFiltered =
        !!searchValue ||
        filters.some((filter) => {
            const val = searchParams?.get(filter.key);
            return val && val !== "all";
        });

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-background/50 backdrop-blur-md rounded-t-xl border border-border/50 border-b-0">
            {/* Left: Search & Filters */}
            <div className="flex flex-1 items-center gap-3 flex-wrap">
                {/* Search Input Container */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className={cn(
                            "h-10 pl-9 w-[200px] lg:w-[280px] transition-all duration-300",
                            "bg-muted/40 border-border/40 hover:bg-muted/60 focus:bg-background",
                            "focus:w-[240px] lg:focus:w-[340px] focus:ring-2 focus:ring-primary/20",
                            "rounded-xl",
                        )}
                    />
                    {searchValue && (
                        <button
                            onClick={() => setSearchValue("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    {filters.map((filter) => {
                        const value = searchParams?.get(filter.key) || "all";
                        const isActive = value !== "all";

                        return (
                            <Select
                                key={filter.key}
                                value={value}
                                onValueChange={(val) => handleFilterChange(filter.key, val)}
                            >
                                <SelectTrigger
                                    className={cn(
                                        "h-10 px-4 min-w-[140px] flex items-center gap-2 border-dashed transition-all rounded-xl",
                                        isActive
                                            ? "bg-primary/10 border-primary/50 text-primary font-bold shadow-sm"
                                            : "bg-muted/30 border-border/60 text-muted-foreground hover:bg-muted/50",
                                    )}
                                >
                                    <SelectValue placeholder={filter.title} />
                                </SelectTrigger>

                                <SelectContent className="bg-card/95 backdrop-blur-xl shadow-2xl rounded-xl border-border/60 min-w-[180px]">
                                    <SelectItem
                                        value="all"
                                        className="capitalize font-medium py-2.5"
                                    >
                                        All {filter.title}s
                                    </SelectItem>
                                    <div className="h-px bg-border/40 my-1 mx-1" />
                                    {filter.options.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="capitalize py-2.5 flex items-center gap-2 rounded-lg transition-colors focus:bg-primary/10 focus:text-primary"
                                        >
                                            <div className="flex items-center gap-2">
                                                {option.icon && (
                                                    <option.icon className="h-4 w-4 opacity-70" />
                                                )}
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })}
                </div>

                {/* Reset Button */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl gap-2 font-medium"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Right: Extra Actions */}
            {children && (
                <div className="flex items-center gap-2 pl-4 border-l border-border/40">
                    {children}
                </div>
            )}
        </div>
    );
}
