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
      if (!categoryId && form.newCategory) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white p-6 rounded w-full max-w-md space-y-3 shadow-lg">
        <h2 className="text-xl font-bold text-center">{book ? "Edit Book" : "Add Book"}</h2>

        <input
          name="title"
          value={form.title}
          onChange={onChange}
          className="w-full border border-gray-400 px-3 py-2 rounded"
          placeholder="Title"
          required
        />

        <input
          name="authorName"
          value={form.authorName}
          onChange={onChange}
          className="w-full border border-gray-400 px-3 py-2 rounded"
          placeholder="Author"
          required
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={onChange}
          className="w-full border border-gray-400 px-3 py-2 rounded"
          required={!form.newCategory}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input
          name="newCategory"
          value={form.newCategory || ""}
          onChange={onChange}
          placeholder="Or type new category"
          className="w-full border border-gray-400 px-3 py-2 rounded"
        />

        <input
          name="price"
          type="number"
          min={0.01}
          value={form.price || ""}
          onChange={onChange}
          className="w-full border border-gray-400 px-3 py-2 rounded"
          placeholder="Price"
          required
        />

        <input
          name="discount"
          type="number"
          min={0}
          value={form.discount! > 0 ? form.discount : ""}
          onChange={onChange}
          className="w-full border border-gray-400 px-3 py-2 rounded"
          placeholder="Discount %"
        />

        <div className="border border-gray-400 rounded p-2 cursor-pointer text-center hover:bg-gray-100">
          <label className="w-full cursor-pointer">
            {form.coverImageFile ? form.coverImageFile.name : "Choose Image"}
            <input type="file" name="coverImage" accept="image/*" onChange={onChange} className="hidden" />
          </label>
        </div>

        {(form.coverImageFile || form.coverImage) && (
          <img
            src={form.coverImageFile ? URL.createObjectURL(form.coverImageFile) : form.coverImage}
            className="h-40 w-full object-cover rounded"
          />
        )}

        <div className="flex gap-2 mt-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded w-1/2 hover:bg-green-700">
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded w-1/2 hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
