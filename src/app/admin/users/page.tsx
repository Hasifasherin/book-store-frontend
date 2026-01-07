"use client";

import AdminLayout from "../AdminLayout";
import AdminUsersPanel from "./AdminUsersPanel";

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-black">List of Users </h1>
        <AdminUsersPanel />
      </div>
    </AdminLayout>
  );
}
