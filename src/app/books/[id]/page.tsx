"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBookById } from "@/redux/slices/bookSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { fetchReviews, addReview, updateReview, deleteReview, Review } from "@/redux/slices/reviewSlice";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BookDetailsPage() {
  const { id: bookId } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  /* ================= REDUX ================= */
  const { selectedBook, loading } = useAppSelector((s) => s.books);
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const { user, token } = useAppSelector((s) => s.auth);
  const reviewData = useAppSelector((s) => s.reviews.items);

  /* ================= LOCAL STATE ================= */
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [visibleReviews, setVisibleReviews] = useState(3);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!bookId) return;
    dispatch(fetchBookById(bookId));
    dispatch(fetchReviews(bookId));
  }, [bookId, dispatch]);

  /* ================= RATING ================= */
  const { averageRating } = useMemo(() => {
    const total = reviewData.length;
    return {
      averageRating: total ? reviewData.reduce((s, r) => s + r.rating, 0) / total : 0,
    };
  }, [reviewData]);

  if (loading || !selectedBook) return <div className="py-10 text-center">Loading book...</div>;

  /* ================= HELPERS ================= */
  const isInCart = cartItems.some((i) => i.bookId === selectedBook._id);
  const isInWishlist = wishlistItems.some((i) => i._id === selectedBook._id);

  const myReviews = reviewData.filter((r) => {
    if (typeof r.userId === "string") return r.userId === user?._id;
    return r.userId._id === user?._id;
  });

  const getReviewerName = (r: Review) => {
    if (typeof r.userId === "string") return "User";
    return `${r.userId.firstName} ${r.userId.lastName}`;
  };

  const getReviewerId = (r: Review) => {
    if (typeof r.userId === "string") return r.userId;
    return r.userId._id;
  };

  /* ================= CART / WISHLIST ================= */
  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart(selectedBook));
      toast.success("Book added to cart");
    } else {
      router.push("/cart");
    }
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(selectedBook._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(selectedBook));
      toast.success("Added to wishlist");
    }
  };

  /* ================= ADD / UPDATE REVIEW ================= */
  const handleSubmitReview = () => {
    if (!rating || !comment.trim()) {
      toast.error("Please rate and write a review");
      return;
    }
    if (!user || !token) {
      toast.error("Login required");
      return;
    }

    if (editingReviewId) {
      dispatch(updateReview({
        bookId,
        reviewId: editingReviewId,
        data: { rating, comment },
        token,
      }))
      .unwrap()
      .then(() => {
        toast.success("Review updated");
        setEditingReviewId(null);
        setRating(0);
        setComment("");
      })
      .catch(() => toast.error("Update failed"));
      return;
    }

    dispatch(addReview({
      bookId,
      review: { rating, comment },
      token,
    }))
    .unwrap()
    .then(() => {
      toast.success("Review added");
      setRating(0);
      setComment("");
    })
    .catch(() => toast.error("Submit failed"));
  };

  /* ================= DELETE REVIEW ================= */
  const confirmDelete = () => {
    if (!deleteId || !token) return;

    dispatch(deleteReview({ bookId, reviewId: deleteId, token }))
      .unwrap()
      .then(() => toast.success("Review deleted"))
      .catch(() => toast.error("Delete failed"))
      .finally(() => setDeleteId(null));
  };

  /* ================= UI ================= */
  return (
    <div className="container mx-auto px-4 py-10">
      {/* BOOK DETAILS */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <img
          src={selectedBook.coverImage || "/placeholder-book.png"}
          className="w-full h-[420px] object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold">{selectedBook.title}</h1>
          <p className="text-gray-600">by {selectedBook.authorName}</p>

          <div className="flex gap-2 items-center my-4">
            <div className="text-yellow-400">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span>({reviewData.length})</span>
          </div>

          <p>{selectedBook.description}</p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-purple-600 text-white px-6 py-2 rounded"
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`border px-6 py-2 rounded ${isInWishlist ? "bg-red-500 text-white" : ""}`}
            >
              {isInWishlist ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEW FORM */}
      {user && (
        <div className="mt-12 border p-4 rounded">
          <h3 className="font-semibold mb-2">{editingReviewId ? "Edit Review" : "Write a Review"}</h3>

          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={`text-2xl ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >★</button>
            ))}
          </div>

          <textarea
            className="border p-2 w-full rounded"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleSubmitReview}
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="mt-10">
        {reviewData.slice(0, visibleReviews).map((r) => (
          <div key={r._id} className="border-b py-4">
            <p className="font-semibold">{getReviewerName(r)}</p>
            <div className="text-yellow-400">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <p className="mt-2">{r.comment}</p>

            {user?._id === getReviewerId(r) && (
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => {
                    setEditingReviewId(r._id);
                    setRating(r.rating);
                    setComment(r.comment);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setDeleteId(r._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
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

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[300px]">
            <h3 className="font-semibold text-lg mb-2">Delete Review?</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
