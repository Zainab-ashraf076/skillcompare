// components/home/featured-categories.tsx
import Link from "next/link";
import type { Category } from "@prisma/client";

type CategoryWithCount = Category & { _count: { courses: number } };

export function FeaturedCategories({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">Browse by Category</h2>
          <p className="text-muted-foreground">Find courses in your area of interest</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}`}
              className="group bg-card border border-border rounded-2xl p-5 hover:border-primary hover:shadow-md transition-all text-center"
            >
              {cat.icon && (
                <span className="text-3xl mb-3 block">{cat.icon}</span>
              )}
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                {cat.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {cat._count.courses} courses
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
