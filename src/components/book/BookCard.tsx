"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { useRouter } from "next/navigation";
import { addToCart } from "@/redux/slices/cartSlice";

interface BookCardProps {
  book: Book;
  userRole: "admin" | "seller" | "buyer";
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleWishlist?: () => void; 
}

export default function BookCard({ book, userRole, onEdit, onDelete, onToggleWishlist }: BookCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wishlist = useAppSelector((state) => state.wishlist.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Check if this book is in wishlist
  const isInWishlist = wishlist.some((item) => item._id === book._id);

  const handleToggleWishlist = () => {
    if (onToggleWishlist) {
      onToggleWishlist(); 
    } else {
      if (isInWishlist) {
        dispatch(removeFromWishlist(book._id));
      } else {
        dispatch(addToWishlist(book));
      }
    }
  };

  const finalPrice = book.discount
    ? Math.round(book.price - (book.price * book.discount) / 100)
    : book.price;

  const goToDetails = () => router.push(`/books/${book._id}`);

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-64 cursor-pointer" onClick={goToDetails}>
        <img
          src={book.coverImage?.trim() || "/placeholder-book.png"}
          alt={book.title}
          className="h-full w-full object-cover"
        />

        {/* Wishlist Heart */}
        {userRole === "buyer" && mounted && (
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleWishlist(); }}
            className="absolute top-2 right-2 text-2xl transition-transform hover:scale-110"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        )}

        {/* Admin / Seller overlay */}
        {(userRole === "admin" || userRole === "seller") && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
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
          className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-purple-600"
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-1">{book.authorName}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          {book.discount ? (
            <>
              <span className="text-gray-400 line-through">₹{book.price}</span>
              <span className="font-bold text-lg text-black">₹{finalPrice}</span>
              <span className="text-sm text-red-500">{book.discount}% OFF</span>
            </>
          ) : (
            <span className="font-bold text-lg text-black">₹{book.price}</span>
          )}
        </div>

        {/* Add to Cart */}
        {userRole === "buyer" && (
          <button
            onClick={() => dispatch(addToCart(book))}
            className="mt-3 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
