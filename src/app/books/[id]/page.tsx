"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBookById } from "@/redux/slices/bookSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selectedBook, loading } = useAppSelector((state) => state.books);
  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    if (id) dispatch(fetchBookById(id));
  }, [id, dispatch]);

  if (loading || !selectedBook) {
    return <div className="py-10 text-center">Loading book...</div>;
  }

  const isInCart = cartItems.some((i) => i.bookId === selectedBook._id);

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart(selectedBook));
      toast.success("Book added to cart!");
    } else {
      router.push("/cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      {/* Image */}
      <img
        src={selectedBook.coverImage}
        alt={selectedBook.title}
        className="w-full h-[420px] object-cover rounded"
      />

      {/* Details */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
        <p className="text-gray-600 mb-4">by {selectedBook.authorName}</p>

        <p className="mb-4 text-lg">{selectedBook.description}</p>

        <p className="text-xl font-semibold">
          ₹
          {selectedBook.discount
            ? Math.round(
                selectedBook.price -
                  (selectedBook.price * selectedBook.discount) / 100
              )
            : selectedBook.price}
        </p>

        {/* Cart / Wishlist buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            {isInCart ? "Go to Cart" : "Add to Cart"}
          </button>
          <button className="border px-6 py-2 rounded hover:bg-gray-100">
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
