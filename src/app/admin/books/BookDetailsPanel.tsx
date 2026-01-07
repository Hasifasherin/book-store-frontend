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
    <div className="bg-white p-5 rounded shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Book Details</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-52 object-cover rounded"
      />

      <div className="space-y-2 text-sm">
        <p><b>Title:</b> {book.title}</p>
        <p><b>Author:</b> {book.authorName}</p>
        <p><b>Category:</b> {categoryName}</p>
        <p><b>Price:</b> ₹{book.price}</p>
        {book.discount && <p><b>Discount:</b> {book.discount}%</p>}
      </div>
    </div>
  );
}
