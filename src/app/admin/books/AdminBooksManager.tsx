"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBooks } from "@/redux/slices/bookSlice";
import { Book } from "@/types/book";

import BooksTable from "./BooksTable";
import BookDetailsPanel from "./BookDetailsPanel";
import BookEditPanel from "./BookEditPanel";

type Category = { _id: string; name: string };
type PanelMode = "view" | "edit" | "add" | null;

export default function AdminBooksManager() {
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);

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

  // ✅ FILTER BOOKS BY CATEGORY
  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter((b) => b.categoryId === selectedCategory);

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c._id === categoryId)?.name || "Uncategorized";

  const closePanel = () => {
    setSelectedBook(null);
    setPanelMode(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this book?")) return;
    console.log("Delete:", id);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT PANEL */}
      <div className="col-span-7 bg-white rounded shadow p-4 space-y-4">

        {/* ✅ CATEGORY FILTER (Professional) */}
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
