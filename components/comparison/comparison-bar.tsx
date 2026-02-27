// components/comparison/comparison-bar.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, GitCompare, Trash2 } from "lucide-react";
import { useComparisonStore } from "@/store/comparison-store";

export function ComparisonBar() {
  const { courses, isBarOpen, removeCourse, clearAll } = useComparisonStore();

  if (!isBarOpen || courses.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="comparison-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl"
      >
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <GitCompare className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm text-foreground">
                Compare ({courses.length}/3)
              </span>
            </div>

            <div className="flex-1 flex items-center gap-3 overflow-x-auto min-w-0">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 shrink-0 group"
                >
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">
                        {course.title[0]}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground max-w-[140px] truncate">
                    {course.title}
                  </span>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                    aria-label={`Remove ${course.title}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {courses.length < 3 && (
                <div className="w-32 h-12 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0">
                  <span className="text-xs text-muted-foreground">+ Add course</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-muted"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:block">Clear</span>
              </button>

              <Link
                href="/compare"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
