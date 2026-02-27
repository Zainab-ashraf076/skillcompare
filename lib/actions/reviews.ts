// lib/actions/reviews.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, "Review must be at least 10 characters"),
  courseId: z.string().cuid(),
});

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Please sign in to leave a review" };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const { rating, title, body, courseId } = parsed.data;

  try {
    await prisma.review.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      create: { userId: session.user.id, courseId, rating, title, body },
      update: { rating, title, body },
    });

    // Update course rating aggregate
    const reviews = await prisma.review.findMany({
      where: { courseId },
      select: { rating: true },
    });
    const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

    await prisma.course.update({
      where: { id: courseId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch {
    return { error: "Failed to submit review. Please try again." };
  }
}
