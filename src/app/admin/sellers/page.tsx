"use client";

import AdminLayout from "../AdminLayout";
import AdminSellersPanel from "./AdminSellersPanel";

export default function AdminSellersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-black">List of Sellers</h1>
        <AdminSellersPanel />
      </div>
    </AdminLayout>
  );
}
