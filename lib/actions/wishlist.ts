// lib/actions/wishlist.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(courseId: string): Promise<{ wishlisted: boolean }> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { id: existing.id },
    });
    revalidatePath("/dashboard/wishlist");
    return { wishlisted: false };
  } else {
    await prisma.wishlist.create({
      data: { userId: session.user.id, courseId },
    });
    revalidatePath("/dashboard/wishlist");
    return { wishlisted: true };
  }
}
