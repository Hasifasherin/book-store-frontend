"use client";

import { useAppDispatch } from "@/redux/hooks";
import { addBook, updateBook } from "@/redux/slices/bookSlice";
import BookForm from "@/components/book/BookForm";
import { Book } from "@/types/book";

export default function BookEditPanel({
  book,
  onClose,
}: {
  book: Book | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const handleSave = async (formData: FormData) => {
    try {
      if (book) {
        // EDIT
        await dispatch(
          updateBook({ id: book._id, formData })
        ).unwrap();
      } else {
        // ADD
        await dispatch(addBook(formData)).unwrap();
      }
      onClose(); 
    } catch (err: any) {
      alert(err?.message || "Failed to save book");
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="font-semibold text-lg">
          {book ? "Edit Book" : "Add New Book"}
        </h2>
        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>

      <BookForm
        book={book || undefined}
        onSave={handleSave}  
        onCancel={onClose}
      />
    </div>
  );
}
