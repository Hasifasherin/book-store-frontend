"use client";

import { Book } from "@/types/book";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";

interface BookCardProps {
  book: Book;
  userRole: "admin" | "seller" | "buyer";
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
}

export default function BookCard({
  book,
  userRole,
  onEdit,
  onDelete,
  onAddToCart,
  onToggleWishlist,
}: BookCardProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const finalPrice = book.discount
    ? Math.round(book.price - (book.price * book.discount) / 100)
    : book.price;

  const goToDetails = () => {
    router.push(`/books/${book._id}`);
  };

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-64 bg-gray-100 cursor-pointer">
        <img
          src={book.coverImage?.trim() ? book.coverImage : "/placeholder-book.png"}
          alt={book.title}
          onClick={goToDetails} // ✅ navigate on click
          className="h-full w-full object-cover"
        />

        {/* Wishlist (Buyer only) */}
        {userRole === "buyer" && (
          <button
            onClick={() => onToggleWishlist?.()}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:scale-110 transition"
            title="Add to wishlist"
          >
            🤍
          </button>
        )}

        {/* Admin / Seller overlay */}
        {(userRole === "admin" || userRole === "seller") && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => onEdit?.()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        {/* Title (clickable) */}
        <h3
          onClick={goToDetails} // ✅ navigate on click
          className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-purple-600"
        >
          {book.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-1">
          {book.authorName}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          {book.discount ? (
            <>
              <span className="text-gray-400 line-through">₹{book.price}</span>
              <span className="font-bold text-lg text-black">₹{finalPrice}</span>
              <span className="text-sm text-red-500">
                {book.discount}% OFF
              </span>
            </>
          ) : (
            <span className="font-bold text-lg text-black">
              ₹{book.price}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {userRole === "buyer" && (
          <button
            onClick={() => dispatch(addToCart(book))}
            className="mt-3 w-full bg-purple-600 text-white py-2 rounded"
          >
            Add to Cart
          </button>

        )}
      </div>
    </div>
  );
}
