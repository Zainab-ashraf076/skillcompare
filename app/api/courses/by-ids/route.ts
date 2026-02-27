// app/api/courses/by-ids/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json() as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ courses: [] });
    }

    const courses = await prisma.course.findMany({
      where: {
        id: { in: ids.slice(0, 3) },
        status: "PUBLISHED",
      },
      include: { platform: true, category: true },
    });

    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
