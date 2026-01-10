"use client";

import { Book } from "@/types/book";

interface Props {
  books: Book[];
  loading: boolean;
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onAdd: () => void;
  userRole?: string;
  userId?: string;
}

export default function BooksTable({
  books,
  loading,
  onView,
  onEdit,
  onDelete,
  onAdd,
  userRole,
  userId,
}: Props) {
  if (loading) {
    return <p className="text-center py-6">Loading books...</p>;
  }

  const canDelete = (book: Book) => {
    const createdById =
      typeof book.createdBy === "string" ? book.createdBy : book.createdBy?._id;
    return userRole === "admin" || (userRole === "seller" && createdById === userId);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={onAdd}
          className="bg-[#1E2A5E] text-white px-4 py-2 rounded hover:bg-[#16204A] transition"
        >
          + Add Book
        </button>
      </div>

      <table className="w-full border rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No books found
              </td>
            </tr>
          )}

          {books.map((book) => (
            <tr key={book._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{book.title}</td>
              <td className="p-3">{book.categoryName || "Uncategorized"}</td>

              <td className="p-3 text-right space-x-3">
                <button
                  onClick={() => onView(book)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>

                <button
                  onClick={() => canDelete(book) ? onDelete(book) : alert("You cannot delete this book.")}
                  className={`text-red-600 hover:underline ${
                    !canDelete(book) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!canDelete(book)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
