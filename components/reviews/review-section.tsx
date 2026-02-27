// components/reviews/review-section.tsx
"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitReview } from "@/lib/actions/reviews";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { Review, User as UserType, Course } from "@prisma/client";
import { useSession } from "next-auth/react";

type ReviewWithUser = Review & { user: Pick<UserType, "name" | "image"> };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
    >
      {pending ? "Submitting..." : "Submit Review"}
    </button>
  );
}

interface ReviewSectionProps {
  course: Course;
  reviews: ReviewWithUser[];
}

export function ReviewSection({ course, reviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  async function handleSubmit(formData: FormData) {
    formData.set("rating", String(selectedRating));
    formData.set("courseId", course.id);
    const result = await submitReview(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Review submitted successfully!");
    }
  }

  return (
    <div className="space-y-8">
      {/* Review Form */}
      {session ? (
        <div className="bg-muted/30 rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-5">Write a Review</h3>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverRating || selectedRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Title (optional)
              </label>
              <input
                name="title"
                type="text"
                placeholder="Summarize your experience"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Review
              </label>
              <textarea
                name="body"
                rows={4}
                placeholder="Share your detailed experience with this course..."
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>

            <SubmitButton />
          </form>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-2xl p-6 border border-border text-center">
          <p className="text-muted-foreground text-sm">
            <a href="/login" className="text-primary hover:underline">Sign in</a> to leave a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-5">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <div className="shrink-0">
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name ?? ""}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">
                    {review.user.name ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                {review.title && (
                  <p className="font-medium text-sm text-foreground">{review.title}</p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
