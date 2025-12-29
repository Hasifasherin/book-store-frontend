"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBookById } from "@/redux/slices/bookSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { fetchReviews, addReview } from "@/redux/slices/reviewSlice";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  /* ================= REDUX ================= */
  const { selectedBook, loading } = useAppSelector((state) => state.books);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const { user, token } = useAppSelector((state) => state.auth);

  const reviewData: Review[] = useAppSelector((state) =>
    Array.isArray(state.reviews.items) ? state.reviews.items : []
  );

  /* ================= LOCAL STATE ================= */
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visibleReviews, setVisibleReviews] = useState(3);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) return;
    dispatch(fetchBookById(id));
    dispatch(fetchReviews(id));
  }, [id, dispatch]);

  /* ================= RATING STATS ================= */
  const { totalReviews, averageRating } = useMemo(() => {
    const total = reviewData.length;
    const avg = total
      ? reviewData.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;
    return { totalReviews: total, averageRating: avg };
  }, [reviewData]);

  if (loading || !selectedBook) {
    return <div className="py-10 text-center">Loading book...</div>;
  }

  /* ================= HELPERS ================= */
  const isInCart = cartItems.some((i) => i.bookId === selectedBook._id);
  const isInWishlist = wishlistItems.some((i) => i._id === selectedBook._id);

  /* ================= CART ================= */
  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart(selectedBook));
      toast.success("Book added to cart");
    } else {
      router.push("/cart");
    }
  };

  /* ================= WISHLIST ================= */
  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(selectedBook._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(selectedBook));
      toast.success("Added to wishlist");
    }
  };

  /* ================= SUBMIT REVIEW ================= */
  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) {
      toast.error("Please select rating and write a review");
      return;
    }

    if (!user || !token) {
      toast.error("Please login to submit a review");
      return;
    }

    if (reviewData.some((r) => r.userId === user._id)) {
      toast.error("You have already reviewed this book");
      return;
    }

    dispatch(
      addReview({
        bookId: selectedBook._id,
        review: {
          bookId: selectedBook._id,                    // ✅ include bookId
          rating,
          comment,
          userId: user._id,                            // ✅ include userId
          userName: `${user.firstName} ${user.lastName}`,
        },
        token,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchReviews(selectedBook._id));       // refresh reviews
        setRating(0);
        setComment("");
        toast.success("Review submitted");
      })
      .catch(() => toast.error("Failed to submit review"));
  };

  /* ================= UI ================= */
  return (
    <div className="container mx-auto px-4 py-10">
      {/* BOOK DETAILS */}
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={selectedBook.coverImage || "/placeholder-book.png"}
          alt={selectedBook.title}
          className="w-full h-[420px] object-cover rounded"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
          <p className="text-gray-600 mb-2">by {selectedBook.authorName}</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="text-yellow-400 text-lg">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="text-gray-600">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>

          <p className="mb-4 text-lg">{selectedBook.description}</p>

          <p className="text-xl font-semibold mb-6">
            ₹
            {selectedBook.discount
              ? Math.round(
                  selectedBook.price -
                    (selectedBook.price * selectedBook.discount) / 100
                )
              : selectedBook.price}
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-purple-600 text-white px-6 py-2 rounded"
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`border px-6 py-2 rounded ${
                isInWishlist ? "bg-red-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {isInWishlist ? "Added to Wishlist" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* WRITE REVIEW */}
      {user && (
        <div className="mt-12 border p-4 rounded">
          <h3 className="font-semibold mb-2">Write a Review</h3>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={`text-2xl ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Share your experience"
          />

          <button
            onClick={handleSubmitReview}
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="mt-10">
        {reviewData.slice(0, visibleReviews).map((r) => (
          <div key={r._id} className="border-b py-4">
            <p className="font-semibold">{r.userName}</p>
            <div className="text-yellow-400">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <p className="text-sm text-gray-500">{new Date(r.createdAt).toDateString()}</p>
            <p className="mt-2">{r.comment}</p>
          </div>
        ))}

        {reviewData.length > visibleReviews && (
          <button
            onClick={() => setVisibleReviews((v) => v + 3)}
            className="mt-4 text-purple-600"
          >
            View more reviews
          </button>
        )}
      </div>
    </div>
  );
}
