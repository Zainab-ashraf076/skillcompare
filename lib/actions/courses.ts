// lib/actions/courses.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import slugify from "slugify";
import type { Level, CourseStatus } from "@prisma/client";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDesc: z.string().optional(),
  instructor: z.string().optional(),
  language: z.string().default("English"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
  lessonsCount: z.coerce.number().optional(),
  hasCertificate: z.coerce.boolean().default(false),
  hasJobSupport: z.coerce.boolean().default(false),
  url: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  platformId: z.string().cuid(),
  categoryId: z.string().cuid(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createCourse(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = courseSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;
  const slug = slugify(data.title, { lower: true, strict: true });

  try {
    await prisma.course.create({
      data: {
        ...data,
        slug,
        level: data.level as Level,
        status: data.status as CourseStatus,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
        originalPrice: data.originalPrice ?? null,
      },
    });
  } catch {
    return { error: "Failed to create course. The title may already exist." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

export async function updateCourse(id: string, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = courseSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  try {
    await prisma.course.update({
      where: { id },
      data: {
        ...data,
        level: data.level as Level,
        status: data.status as CourseStatus,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
        originalPrice: data.originalPrice ?? null,
      },
    });
  } catch {
    return { error: "Failed to update course." };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/courses/${id}`);
  redirect("/admin/courses");
}

export async function deleteCourse(id: string) {
  await requireAdmin();

  await prisma.course.delete({ where: { id } });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function deleteReview(id: string) {
  await requireAdmin();

  const review = await prisma.review.delete({ where: { id } });

  revalidatePath(`/courses/${review.courseId}`);
}
