// app/(main)/compare/page.tsx
import type { Metadata } from "next";
import { ComparisonTableWrapper } from "@/components/comparison/comparison-table-wrapper";

export const metadata: Metadata = {
  title: "Compare Courses",
  description: "Compare courses side by side to find the best one for you.",
};

export default function ComparePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Course Comparison</h1>
        <p className="text-muted-foreground">
          Compare up to 3 courses side by side to make the best choice
        </p>
      </div>
      <ComparisonTableWrapper />
    </div>
  );
}
