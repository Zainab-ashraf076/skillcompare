// components/wishlist/wishlist-button.tsx
"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  courseId: string;
  isWishlisted: boolean;
  userId?: string;
  className?: string;
}

export function WishlistButton({ courseId, isWishlisted: initial, userId, className }: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (!userId) {
      toast.error("Please sign in to save courses");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const result = await toggleWishlist(courseId);
      setWishlisted(result.wishlisted);
      toast.success(result.wishlisted ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "w-11 h-11 flex items-center justify-center rounded-xl transition-all",
        wishlisted
          ? "bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100"
          : "bg-secondary text-muted-foreground hover:bg-red-50 hover:text-red-500",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
    </button>
  );
}
