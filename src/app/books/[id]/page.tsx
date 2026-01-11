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

  const { selectedBook, loading } = useAppSelector((s) => s.books);
  const cartItems = useAppSelector((s) => s.cart.items);
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const { user, token } = useAppSelector((s) => s.auth);
  const reviewData = useAppSelector((s) => s.reviews.items);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [visibleReviews, setVisibleReviews] = useState(3);

  useEffect(() => {
    if (!bookId) return;
    dispatch(fetchBookById(bookId));
    dispatch(fetchReviews(bookId));
  }, [bookId, dispatch]);

  const { averageRating } = useMemo(() => {
    const total = reviewData.length;
    return {
      averageRating: total ? reviewData.reduce((s, r) => s + r.rating, 0) / total : 0,
    };
  }, [reviewData]);

  if (loading || !selectedBook) return <div className="py-10 text-center text-indigo-200">Loading book...</div>;

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

  const confirmDelete = () => {
    if (!deleteId || !token) return;

    dispatch(deleteReview({ bookId, reviewId: deleteId, token }))
      .unwrap()
      .then(() => toast.success("Review deleted"))
      .catch(() => toast.error("Delete failed"))
      .finally(() => setDeleteId(null));
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-900 text-gray-200 min-h-screen">
      {/* BOOK DETAILS */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <img
          src={selectedBook.coverImage || "/placeholder-book.png"}
          alt={selectedBook.title}
          className="w-full h-[420px] md:h-[500px] lg:h-[550px] object-contain rounded shadow-lg border border-gray-700 bg-gray-800"
        />

        <div>
          <h1 className="text-3xl font-bold text-indigo-300">{selectedBook.title}</h1>
          <p className="text-gray-400 mt-1">by {selectedBook.authorName}</p>

          <div className="flex gap-2 items-center my-4">
            <div className="text-yellow-400">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span>({reviewData.length})</span>
          </div>

          <p className="text-gray-300">{selectedBook.description}</p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
            >
              {isInCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`border border-indigo-500 px-6 py-2 rounded hover:bg-indigo-500 hover:text-white transition ${isInWishlist ? "bg-red-600 text-white border-red-600" : "text-indigo-300"
                }`}
            >
              {isInWishlist ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEW FORM */}
      {user && (
        <div className="mt-12 border border-gray-700 p-4 rounded bg-gray-800">
          <h3 className="font-semibold mb-2 text-indigo-300">{editingReviewId ? "Edit Review" : "Write a Review"}</h3>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                className={`text-2xl ${s <= rating ? "text-yellow-400" : "text-gray-600"}`}
              >★</button>
            ))}
          </div>

          <textarea
            className="border border-gray-600 p-2 w-full rounded bg-gray-900 text-gray-200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleSubmitReview}
            className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="mt-10">
        {reviewData.slice(0, visibleReviews).map((r) => (
          <div key={r._id} className="border-b border-gray-700 py-4">
            <p className="font-semibold text-indigo-300">{getReviewerName(r)}</p>
            <div className="text-yellow-400">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <p className="mt-2 text-gray-300">{r.comment}</p>

            {user?._id === getReviewerId(r) && (
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => {
                    setEditingReviewId(r._id);
                    setRating(r.rating);
                    setComment(r.comment);
                  }}
                  className="text-blue-400 hover:text-blue-600 transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setDeleteId(r._id)}
                  className="text-red-600 hover:text-red-800 transition"
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
            className="mt-4 text-indigo-400 hover:text-indigo-600 transition"
          >
            View more reviews
          </button>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-[300px] border border-gray-700">
            <h3 className="font-semibold text-lg text-indigo-300 mb-2">Delete Review?</h3>
            <p className="text-sm text-gray-400 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-3 py-1 border border-gray-600 rounded hover:bg-gray-700 transition">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
