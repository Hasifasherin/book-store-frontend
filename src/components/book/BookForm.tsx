"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Book } from "@/types/book";
import { useAppSelector } from "@/redux/hooks";

type Category = { _id: string; name: string };

type BookFormProps = {
  book?: Book | null;
  onSave: (fd: FormData) => void;
  onCancel: () => void;
};

export default function BookForm({ book, onSave, onCancel }: BookFormProps) {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    title: book?.title || "",
    authorName: book?.authorName || "",
    price: book?.price || 0,
    discount: book?.discount ?? 0,
    categoryId: book?.categoryId as string || "",
    newCategory: "",
    coverImage: book?.coverImage || "",
    coverImageFile: null as File | null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "coverImage" && files?.[0]) setForm({ ...form, coverImageFile: files[0] });
    else setForm({ ...form, [name]: name === "price" || name === "discount" ? Number(value) : value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("authorName", form.authorName);
    fd.append("price", String(form.price));
    fd.append("discount", String(form.discount ?? 0));

    try {
      let categoryId = form.categoryId;

      // Only admin can add new category
      if (isAdmin && !categoryId && form.newCategory) {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          { name: form.newCategory },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        categoryId = res.data._id;
      }

      fd.append("categoryId", categoryId);
    } catch {
      alert("Failed to create category");
      setSaving(false);
      return;
    }

    if (form.coverImageFile) fd.append("coverImage", form.coverImageFile);

    onSave(fd);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <form
        onSubmit={submit}
        className="bg-white dark:bg-[#1E293B] rounded-xl w-full max-w-lg p-8 space-y-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          {book ? "Edit Book" : "Add Book"}
        </h2>

        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
          placeholder="Title"
          required
        />

        {/* Author */}
        <input
          name="authorName"
          value={form.authorName}
          onChange={onChange}
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
          placeholder="Author"
          required
        />

        {/* Category */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
          required={!form.newCategory}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Admin can add new category */}
        {isAdmin && (
          <input
            name="newCategory"
            value={form.newCategory}
            onChange={onChange}
            placeholder="Or type new category"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
          />
        )}

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            min={0}
            value={form.price || ""}
            onChange={onChange}
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
            placeholder="Price"
            required
          />
          <input
            name="discount"
            type="number"
            min={0}
            value={form.discount! > 0 ? form.discount : ""}
            onChange={onChange}
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
            placeholder="Discount %"
          />
        </div>

        {/* Image Upload */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 cursor-pointer text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <label className="w-full cursor-pointer text-gray-800 dark:text-gray-100">
            {form.coverImageFile ? form.coverImageFile.name : "Choose Cover Image"}
            <input type="file" name="coverImage" accept="image/*" onChange={onChange} className="hidden" />
          </label>
        </div>

        {/* Image Preview */}
        {(form.coverImageFile || form.coverImage) && (
          <img
            src={form.coverImageFile ? URL.createObjectURL(form.coverImageFile) : form.coverImage}
            className="h-48 w-full object-cover rounded-md border border-gray-300 dark:border-gray-600"
          />
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md w-1/2 hover:bg-indigo-700 transition"
            disabled={saving}
          >
            {saving ? "Saving…" : book ? "Update Book" : "Add Book"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-md w-1/2 hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
