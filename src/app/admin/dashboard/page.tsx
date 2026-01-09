"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import AnalyticsCharts from "./AnalyticsCharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    books: 0,
    buyers: 0,
    sellers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [booksRes, buyersRes, sellersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/books/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/buyers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/sellers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          books: booksRes.data.total,
          buyers: buyersRes.data.total,
          sellers: sellersRes.data.total,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-[#1E293B]">
          Admin Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Total Books */}
          <div className="bg-[#F1F5F9] p-6 rounded-xl shadow-md border-l-4 border-[#2563EB]">
            <h2 className="text-sm font-semibold text-[#1E293B]">
              Total Books
            </h2>
            <p className="text-3xl font-bold text-[#111827] mt-2">
              {stats.books}
            </p>
          </div>

          {/* Card: Total Buyers */}
          <div className="bg-[#F1F5F9] p-6 rounded-xl shadow-md border-l-4 border-[#10B981]">
            <h2 className="text-sm font-semibold text-[#1E293B]">
              Total Buyers
            </h2>
            <p className="text-3xl font-bold text-[#111827] mt-2">
              {stats.buyers}
            </p>
          </div>

          {/* Card: Total Sellers */}
          <div className="bg-[#F1F5F9] p-6 rounded-xl shadow-md border-l-4 border-[#F59E0B]">
            <h2 className="text-sm font-semibold text-[#1E293B]">
              Total Sellers
            </h2>
            <p className="text-3xl font-bold text-[#111827] mt-2">
              {stats.sellers}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <AnalyticsCharts />
        </div>
      </div>
    </AdminLayout>
  );
}
