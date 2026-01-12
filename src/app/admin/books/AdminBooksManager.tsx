"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBooks, deleteBook } from "@/redux/slices/bookSlice";
import { Book } from "@/types/book";

import BooksTable from "./BooksTable";
import BookDetailsPanel from "./BookDetailsPanel";
import BookEditPanel from "./BookEditPanel";
import { Toaster, toast } from "react-hot-toast";

type Category = { _id: string; name: string };
type PanelMode = "view" | "edit" | "add" | null;

export default function AdminBooksManager() {
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);
  const user = useAppSelector((state) => state.auth.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>(null);

  useEffect(() => {
    dispatch(fetchBooks());

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [dispatch]);

  /* ================= HELPERS ================= */

  const getCategoryId = (categoryId: any) =>
    typeof categoryId === "object" ? categoryId._id : categoryId;

  const getCategoryName = (categoryId: any) => {
    if (typeof categoryId === "object") return categoryId.name;
    return categories.find((c) => c._id === categoryId)?.name || "Uncategorized";
  };

  /* ================= FILTER ================= */

  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter((b) => getCategoryId(b.categoryId) === selectedCategory);

  /* ================= PANEL ================= */

  const closePanel = () => {
    setSelectedBook(null);
    setPanelMode(null);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (book: Book) => {
    // Seller can only delete own books
    const createdById =
      typeof book.createdBy === "string" ? book.createdBy : book.createdBy?._id;

    if (user?.role === "seller" && createdById !== user?._id) {
      toast.error("You are not allowed to delete this book.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteBook(book._id)).unwrap();
      toast.success("Book deleted successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete the book.");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* LEFT PANEL */}
      <div className="col-span-7 bg-white rounded shadow p-4 space-y-4">
        {/* CATEGORY FILTER */}
        <div className="flex justify-between items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <BooksTable
          books={filteredBooks}
          loading={loading}
          onView={(book) => {
            setSelectedBook(book);
            setPanelMode("view");
          }}
          onEdit={(book) => {
            setSelectedBook(book);
            setPanelMode("edit");
          }}
          onAdd={() => {
            setSelectedBook(null);
            setPanelMode("add");
          }}
          onDelete={handleDelete} 
          userRole={user?.role}
          userId={user?._id}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-5">
        {panelMode === "view" && selectedBook && (
          <BookDetailsPanel
            book={selectedBook}
            categoryName={getCategoryName(selectedBook.categoryId)}
            onClose={closePanel}
          />
        )}

        {(panelMode === "edit" || panelMode === "add") && (
          <BookEditPanel book={selectedBook} onClose={closePanel} />
        )}
      </div>
    </div>
  );
}
