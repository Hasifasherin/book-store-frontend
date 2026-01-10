"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";

interface BookCardProps {
  book: Book;
  userRole: "admin" | "seller" | "buyer";
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleWishlist?: () => void;
}

export default function BookCard({
  book,
  userRole,
  onEdit,
  onDelete,
  onToggleWishlist,
}: BookCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isInWishlist = wishlist.some((item) => item._id === book._id);

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist();
    } else {
      isInWishlist
        ? dispatch(removeFromWishlist(book._id))
        : dispatch(addToWishlist(book));
    }
  };

  // ✅ SAFE DISCOUNT CALCULATION
  const finalPrice =
    book.discount && book.discount > 0
      ? Math.round(book.price - (book.price * book.discount) / 100)
      : book.price;

  const goToDetails = () => router.push(`/books/${book._id}`);

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl border-gray-100">
      
      {/* Image */}
      <div
        className="relative h-64 cursor-pointer overflow-hidden bg-black"
        onClick={goToDetails}
      >
        <img
          src={book.coverImage?.trim() || "/placeholder-book.png"}
          alt={book.title}
          className="block w-full h-full object-contain object-center bg-[#0f172a]"
        />

        {/* Wishlist */}
        {userRole === "buyer" && mounted && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
            className="absolute top-2 right-2 text-xl bg-white/90 rounded-full p-1 shadow hover:scale-110 transition"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        )}

        {/* Admin / Seller Actions */}
        {(userRole === "admin" || userRole === "seller") && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        <h3
          onClick={goToDetails}
          className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-[#1E2A5E]"
        >
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-1">
          {book.authorName}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          {book.discount && book.discount > 0 ? (
            <>
              <span className="text-gray-400 line-through">
                ₹{book.price}
              </span>
              <span className="font-bold text-lg text-[#1E2A5E]">
                ₹{finalPrice}
              </span>
              <span className="text-sm text-red-500">
                {book.discount}% OFF
              </span>
            </>
          ) : (
            <span className="font-bold text-lg text-[#1E2A5E]">
              ₹{book.price}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {userRole === "buyer" && (
          <button
            onClick={() => dispatch(addToCart(book))}
            className="mt-3 w-full bg-[#1E2A5E] hover:bg-[#16204A] text-white py-2 rounded transition"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
