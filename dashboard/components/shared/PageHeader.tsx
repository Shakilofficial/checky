"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  breadcrumb?: ReactNode;
  hideBreadcrumb?: boolean;
}

const PageHeader = ({
  title,
  subtitle,
  actions,
  className,
  breadcrumb,
  hideBreadcrumb = false,
}: PageHeaderProps) => {
  const pathname = usePathname();
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];

  const autoBreadcrumb = (
    <nav className="flex flex-wrap items-center gap-1 justify-center text-sm">
      {/* Home */}
      <Link href="/dashboard" className="transition hover:opacity-80">
        <Badge
          variant="default"
          className="flex items-center gap-1 px-2 py-1 text-sm bg-card dark:bg-card/90 border border-border dark:border-border"
        >
          <Home className="w-4 h-4 font-bold" />
          Home
        </Badge>
      </Link>

      {segments.map((segment, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        const isLast = idx === segments.length - 1;
        const label = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div key={path} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {isLast ? (
              <Badge
                variant="ghost"
                className="px-3 py-1 text-sm bg-card dark:bg-card/90 border border-border dark:border-border text-foreground dark:text-foreground"
              >
                {label}
              </Badge>
            ) : (
              <Link href={path} className="transition hover:opacity-80">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-card dark:bg-card/90 border border-border dark:border-border text-foreground dark:text-foreground"
                >
                  {label}
                </Badge>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center gap-3 sm:gap-4 mb-6",
        className
      )}
    >
      {/* Breadcrumb */}
      {!hideBreadcrumb && (breadcrumb || autoBreadcrumb)}

      {/* Title + Subtitle */}
      <div className="flex flex-col items-center gap-1 text-center">
        {title && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary dark:text-primary/90 tracking-tight">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground dark:text-muted-foreground/80">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2 mt-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
