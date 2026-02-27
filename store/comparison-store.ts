// store/comparison-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComparisonCourse {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  price: number;
  rating: number;
  platform: { name: string; slug: string };
  category: { name: string };
}

interface ComparisonState {
  courses: ComparisonCourse[];
  isBarOpen: boolean;
  addCourse: (course: ComparisonCourse) => void;
  removeCourse: (id: string) => void;
  clearAll: () => void;
  setBarOpen: (open: boolean) => void;
  hasCourse: (id: string) => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      courses: [],
      isBarOpen: false,

      addCourse: (course) => {
        const { courses } = get();
        if (courses.length >= 3 || courses.some((c) => c.id === course.id)) return;
        set({ courses: [...courses, course], isBarOpen: true });
      },

      removeCourse: (id) => {
        const courses = get().courses.filter((c) => c.id !== id);
        set({ courses, isBarOpen: courses.length > 0 });
      },

      clearAll: () => set({ courses: [], isBarOpen: false }),

      setBarOpen: (open) => set({ isBarOpen: open }),

      hasCourse: (id) => get().courses.some((c) => c.id === id),
    }),
    {
      name: "skillcompare-comparison",
      partialize: (state) => ({ courses: state.courses }),
    }
  )
);
