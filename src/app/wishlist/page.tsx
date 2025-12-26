"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromWishlist, clearWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import Link from "next/link";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Looks like you haven't added any books yet.
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  const handleMoveToCart = (book: any) => {
    dispatch(removeFromWishlist(book._id)); // remove from wishlist
    dispatch(addToCart(book)); // add to cart
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {items.map((book, index) => (
          <div
            key={`${book._id}-${index}`}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2"
          >
            <img
              src={book.coverImage || "/placeholder-book.png"}
              alt={book.title}
              className="w-full h-64 object-cover rounded"
            />
            <h2 className="font-semibold text-lg text-black dark:text-white">{book.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">by {book.authorName}</p>
            <p className="text-lg font-bold text-black dark:text-white">₹{book.price}</p>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(removeFromWishlist(book._id))}
                className="flex-1 px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black transition"
              >
                Remove
              </button>

              <button
                onClick={() => handleMoveToCart(book)}
                className="flex-1 px-4 py-2 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-black transition"
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => dispatch(clearWishlist())}
          className="px-6 py-2 rounded border border-gray-600 dark:border-gray-400 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Clear Wishlist
        </button>
      </div>
    </div>
  );
}
