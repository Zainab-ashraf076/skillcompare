// components/courses/course-search.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  rating: number;
  imageUrl?: string | null;
  platform: { name: string };
  category: { name: string };
}

interface CourseSearchProps {
  defaultValue?: string;
}

export function CourseSearch({ defaultValue = "" }: CourseSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced typeahead search
  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/courses/search?q=${encodeURIComponent(value)}&limit=6`
        );
        const data: { results: SearchResult[] } = await res.json();
        setResults(data.results);
        setOpen(true);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (value.trim()) {
      router.push(`${pathname}?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push(pathname);
    }
  };

  const handleClear = () => {
    setValue("");
    setResults([]);
    setOpen(false);
    router.push(pathname);
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search courses, skills, instructors..."
          className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
        {!loading && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/courses/${result.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              {result.imageUrl ? (
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="w-10 h-8 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-8 rounded-lg bg-primary/10 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                <p className="text-xs text-muted-foreground">
                  {result.platform.name} · {result.price === 0 ? "Free" : `$${result.price}`}
                </p>
              </div>
            </Link>
          ))}
          <div className="px-4 py-2 border-t border-border">
            <button
              onMouseDown={() => {
                setOpen(false);
                router.push(`/courses?q=${encodeURIComponent(value)}`);
              }}
              className="text-xs text-primary hover:underline"
            >
              See all results for &quot;{value}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
