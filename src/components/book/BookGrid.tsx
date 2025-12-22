"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBooks, addBook, updateBook, deleteBook } from "@/redux/slices/bookSlice";
import { Book } from "@/types/book";
import BookCard from "./BookCard";
import BookForm from "./BookForm";
import DeleteModal from "./DeleteModal";
import axios from "axios";

interface BookGridProps {
  userRole: "admin" | "seller" | "buyer";
}

type Category = { _id: string; name: string };

type BookFormState = {
  title: string;
  authorName: string;
  price: number;
  discount?: number;
  categoryId: string;
  newCategory?: string;
  coverImage?: string;
  coverImageFile?: File;
};

export default function BookGrid({ userRole }: BookGridProps) {
  const dispatch = useAppDispatch();
  const { books, loading, error } = useAppSelector((state) => state.books);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormState | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    dispatch(fetchBooks());
    fetchCategories();
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const openAdd = () => {
    setEditingId("new");
    setForm({ title: "", authorName: "", price: 0, discount: 0, categoryId: "" });
  };

  const openEdit = (book: Book) => {
    setEditingId(book._id);
    setForm({ title: book.title, authorName: book.authorName, price: book.price, discount: book.discount, categoryId: book.categoryId as string, coverImage: book.coverImage });
  };

  const submit = async (fd: FormData) => {
    setSaving(true);
    try {
      if (editingId === "new") await dispatch(addBook(fd)).unwrap();
      else if (editingId) await dispatch(updateBook({ id: editingId, formData: fd })).unwrap();
    } catch (err: any) {
      alert(err);
    } finally {
      setForm(null);
      setEditingId(null);
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await dispatch(deleteBook(deleteId)).unwrap();
    } catch (err: any) {
      alert(err);
    } finally {
      setDeleteId(null);
      setDeleting(false);
    }
  };

  if (!mounted) return null;
  if (loading) return <p className="text-center py-10">Loading books…</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="text-black">
      {(userRole === "admin" || userRole === "seller") && (
        <div className="flex justify-end mb-4">
          <button onClick={openAdd} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">+ Add Book</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            userRole={userRole}
            onEdit={() => openEdit(book)}
            onDelete={() => setDeleteId(book._id)}
            onAddToCart={() => {}}
            onToggleWishlist={() => {}}
          />
        ))}
      </div>

      {form && <BookForm book={form as Book} onSave={submit} onCancel={() => { setForm(null); setEditingId(null); }} />}

      {deleteId && <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} deleting={deleting} />}
    </div>
  );
}
