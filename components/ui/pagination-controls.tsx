// components/ui/pagination-controls.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  total: number;
  page: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}

export function PaginationControls({ total, page, pageSize, searchParams }: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(searchParams).filter(([, v]) => v != null)) as Record<string, string>
    );
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={buildHref(page - 1)}
        aria-disabled={page === 1}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
          page === 1
            ? "text-muted-foreground/40 cursor-not-allowed pointer-events-none"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {pageNumbers.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-xl text-sm transition-colors",
            p === page
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(page + 1)}
        aria-disabled={page === totalPages}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-xl transition-colors",
          page === totalPages
            ? "text-muted-foreground/40 cursor-not-allowed pointer-events-none"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
