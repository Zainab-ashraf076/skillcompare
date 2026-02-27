// app/(dashboard)/dashboard/wishlist/page.tsx
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";

export const metadata: Metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session) return null;

  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      course: {
        include: { platform: true, category: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
        <p className="text-muted-foreground mt-1">
          {wishlistItems.length} saved {wishlistItems.length === 1 ? "course" : "courses"}
        </p>
      </div>
      <WishlistGrid items={wishlistItems} />
    </div>
  );
}
