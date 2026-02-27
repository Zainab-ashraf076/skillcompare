// app/api/courses/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(20).default(8),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = searchSchema.safeParse({
      q: searchParams.get("q"),
      limit: searchParams.get("limit"),
    });

    if (!parsed.success) {
      return NextResponse.json({ results: [] });
    }

    const { q, limit } = parsed.data;

    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { instructor: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        price: true,
        rating: true,
        platform: { select: { name: true, slug: true } },
        category: { select: { name: true } },
      },
      orderBy: { rating: "desc" },
    });

    return NextResponse.json({ results: courses });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
