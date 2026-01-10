"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
}

export default function SellersList() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]); // Track toggle loading

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sellersData = res.data
          .filter((u: any) => u.role === "seller")
          .map((s: any) => ({ ...s, isBlocked: s.isBlocked || false }));

        setSellers(sellersData);
      } catch (err) {
        console.error("Failed to fetch sellers:", err);
      }
    };

    fetchSellers();
  }, []);

  // Block / Unblock seller
  const toggleBlock = async (seller: Seller) => {
    try {
      setLoadingIds((prev) => [...prev, seller._id]);
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${seller._id}/block`,
        { isBlocked: !seller.isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSellers((prev) =>
        prev.map((s) =>
          s._id === seller._id ? { ...s, isBlocked: !s.isBlocked } : s
        )
      );
    } catch (err) {
      console.error("Failed to block/unblock seller:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== seller._id));
    }
  };

  return (
    <div className="space-y-3">
      {sellers.length === 0 && <p className="text-gray-500">No sellers found.</p>}

      {sellers.map((seller) => (
        <div
          key={seller._id}
          className={`flex justify-between items-center p-4 rounded-lg shadow-sm transition hover:shadow-md ${
            seller.isBlocked ? "bg-red-50 border border-red-200" : "bg-white"
          }`}
        >
          <div className="flex flex-col">
            <span className={`font-semibold ${seller.isBlocked ? "line-through text-red-600" : ""}`}>
              {seller.firstName} {seller.lastName}
            </span>
            <span className="text-gray-500 text-sm">{seller.email}</span>
          </div>

          <button
            onClick={() => toggleBlock(seller)}
            disabled={loadingIds.includes(seller._id)}
            className={`px-4 py-1 rounded-md font-medium text-white transition ${
              seller.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } ${loadingIds.includes(seller._id) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loadingIds.includes(seller._id)
              ? "Processing..."
              : seller.isBlocked
              ? "Unblock"
              : "Block"}
          </button>
        </div>
      ))}
    </div>
  );
}
