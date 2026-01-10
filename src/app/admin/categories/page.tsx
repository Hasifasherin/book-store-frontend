"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import { Plus } from "lucide-react"; // icon for Add button

interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= TOAST ================= */
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ================= ADD CATEGORY ================= */
  const handleAdd = async () => {
    if (!currentName.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        { name: currentName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([res.data, ...categories]);
      setCurrentName("");
      setShowAddModal(false);
      showToast("Category added successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add category.", "error");
    }
  };

  /* ================= EDIT CATEGORY ================= */
  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setCurrentName(category.name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!currentName.trim() || !editingId) return;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editingId}`,
        { name: currentName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categories.map(c => (c._id === editingId ? res.data : c)));
      setShowEditModal(false);
      setEditingId(null);
      setCurrentName("");
      showToast("Category updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update category.", "error");
    }
  };

  /* ================= DELETE CATEGORY ================= */
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete this category? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter(c => c._id !== id));
      showToast("Category deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete category.", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold">Category Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 ${
              toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Add New Category</h2>
              <input
                type="text"
                placeholder="Category name"
                value={currentName}
                onChange={e => setCurrentName(e.target.value)}
                className="border px-3 py-2 rounded w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Edit Category</h2>
              <input
                type="text"
                value={currentName}
                onChange={e => setCurrentName(e.target.value)}
                className="border px-3 py-2 rounded w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Table */}
        <div className="overflow-x-auto bg-white rounded shadow-md">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{category.name}</td>
                    <td className="px-4 py-2">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
