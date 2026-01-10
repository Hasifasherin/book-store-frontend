"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "@/types/book";

type Category = { _id: string; name: string };

type BookFormProps = {
  book?: Book | null;
  onSave: (fd: FormData) => void;
  onCancel: () => void;
};

export default function BookForm({ book, onSave, onCancel }: BookFormProps) {
  const [form, setForm] = useState({
    title: book?.title || "",
    authorName: book?.authorName || "",
    description: book?.description || "",
    price: book?.price || 0,
    discount: book?.discount ?? 0,
    categoryId: (book?.categoryId as string) || "",
    coverImage: book?.coverImage || "",
    coverImageFile: null as File | null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */
  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as any;

    if (name === "coverImage" && files?.[0]) {
      setForm({ ...form, coverImageFile: files[0] });
    } else {
      setForm({
        ...form,
        [name]:
          name === "price" || name === "discount" ? Number(value) : value,
      });
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoryId) {
      alert("Please select a category");
      return;
    }

    setSaving(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("authorName", form.authorName);
    fd.append("description", form.description || "");
    fd.append("price", String(form.price));
    fd.append("discount", String(form.discount ?? 0));
    fd.append("categoryId", form.categoryId);

    if (form.coverImageFile) {
      fd.append("coverImage", form.coverImageFile);
    }

    onSave(fd);
    setSaving(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={submit}
        className="bg-white dark:bg-[#1E293B] rounded-xl w-full max-w-lg p-8 space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          {book ? "Edit Book" : "Add Book"}
        </h2>

        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Title"
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Author */}
        <input
          name="authorName"
          value={form.authorName}
          onChange={onChange}
          placeholder="Author"
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={4}
          placeholder="Book Description (optional)"
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Category */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          required
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            min={0}
            value={form.price || ""}
            onChange={onChange}
            placeholder="Price"
            required
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            name="discount"
            min={0}
            value={form.discount > 0 ? form.discount : ""}
            onChange={onChange}
            placeholder="Discount %"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
          <label className="cursor-pointer text-gray-800 dark:text-gray-100">
            {form.coverImageFile
              ? form.coverImageFile.name
              : "Choose Cover Image"}
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Image Preview */}
        {(form.coverImageFile || form.coverImage) && (
          <img
            src={
              form.coverImageFile
                ? URL.createObjectURL(form.coverImageFile)
                : form.coverImage
            }
            className="h-48 w-full object-cover rounded-md border border-gray-300 dark:border-gray-600"
          />
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            disabled={saving}
            className="w-1/2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {saving ? "Saving…" : book ? "Update Book" : "Add Book"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
