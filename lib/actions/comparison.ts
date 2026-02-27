// lib/actions/comparison.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function saveComparisonHistory(courseIds: string[]) {
  const session = await auth();
  if (!session?.user || courseIds.length < 2) return;

  await prisma.comparisonHistory.create({
    data: {
      userId: session.user.id,
      courses: {
        create: courseIds.map((id) => ({ courseId: id })),
      },
    },
  });
}
