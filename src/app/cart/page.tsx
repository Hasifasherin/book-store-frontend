"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromCart, clearCart, updateQuantity, addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const handleRemove = (bookId: string) => dispatch(removeFromCart(bookId));

  const handleMoveToWishlist = (item: any) => {
    dispatch(addToWishlist({ ...item, _id: item.bookId }));
    dispatch(removeFromCart(item.bookId));
  };

  const handleQuantityChange = (bookId: string, delta: number) => {
    const item = items.find((i) => i.bookId === bookId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    dispatch(updateQuantity({ bookId, quantity: newQty }));
  };

  const isInWishlist = (bookId: string) =>
    wishlistItems.some((w) => w._id === bookId);

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-indigo-900">Your Cart is Empty</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Looks like you haven't added any books yet.
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-[#1E2A5E] text-white rounded hover:bg-[#16204A] transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* CART ITEMS */}
        <div className="md:col-span-3 space-y-4">
          {items.map((item) => (
            <div
              key={item.bookId}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.coverImage || "/placeholder-book.png"}
                  alt={item.title}
                  className="w-20 h-28 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold text-lg text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                    {item.title}{" "}
                    {isInWishlist(item.bookId) && <span className="text-red-500">❤️</span>}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    ₹{item.price * item.quantity}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-indigo-900 dark:text-indigo-300 font-medium">Qty:</span>
                    <button
                      onClick={() => handleQuantityChange(item.bookId, -1)}
                      className="w-8 h-8 bg-indigo-200 text-indigo-900 rounded hover:bg-indigo-300 flex items-center justify-center transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-indigo-900 dark:text-indigo-300">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.bookId, 1)}
                      className="w-8 h-8 bg-indigo-200 text-indigo-900 rounded hover:bg-indigo-300 flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleRemove(item.bookId)}
                  className="px-4 py-2 rounded font-medium border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleMoveToWishlist(item)}
                  className={`px-4 py-2 rounded font-medium border transition-colors ${
                    isInWishlist(item.bookId)
                      ? "border-red-500 text-red-500 hover:bg-red-100"
                      : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  {isInWishlist(item.bookId) ? "In Wishlist" : "Move to Wishlist"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-300">Order Summary</h2>
          <p className="flex justify-between text-indigo-900 dark:text-indigo-300 font-medium">
            Total: <span>₹{total}</span>
          </p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
            Proceed to Checkout
          </button>
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full border border-indigo-600 text-indigo-600 py-2 rounded hover:bg-indigo-100 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
