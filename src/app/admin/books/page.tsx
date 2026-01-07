"use client";

import AdminLayout from "../AdminLayout";
import AdminBooksManager from "./AdminBooksManager";

export default function AdminBooksPage() {
  return (
    <AdminLayout>
      <AdminBooksManager />
    </AdminLayout>
  );
}
