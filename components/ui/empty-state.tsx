// components/ui/empty-state.tsx
import Link from "next/link";
import { Search, Heart, GitCompare, BookOpen } from "lucide-react";

const ICONS = {
  search: Search,
  heart: Heart,
  compare: GitCompare,
  book: BookOpen,
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: keyof typeof ICONS;
}

export function EmptyState({ title, description, actionLabel, actionHref, icon = "book" }: EmptyStateProps) {
  const Icon = ICONS[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
