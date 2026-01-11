import { Book } from "@/types/book";

export default function BookDetailsPanel({
  book,
  categoryName,
  onClose,
}: {
  book: Book;
  categoryName: string;
  onClose: () => void;
}) {
  return (
    <div className="bg-white p-5 rounded-lg shadow space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Book Details
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Book Cover */}
      <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
        <img
          src={book.coverImage}
          alt={book.title}
          className="max-h-full max-w-full object-contain rounded"
        />
      </div>

      {/* Book Info */}
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Title:</span> {book.title}
        </p>
        <p>
          <span className="font-semibold">Author:</span> {book.authorName}
        </p>
        <p>
          <span className="font-semibold">Category:</span> {categoryName}
        </p>
        <p>
          <span className="font-semibold">Price:</span> ₹{book.price}
        </p>
        {book.discount && (
          <p>
            <span className="font-semibold">Discount:</span>{" "}
            {book.discount}%
          </p>
        )}
      </div>
    </div>
  );
}
