"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Seller {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function SellersList() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Filter only sellers
        const sellersData = res.data.filter((u: any) => u.role === "seller");
        setSellers(sellersData);
      } catch (err) {
        console.error("Failed to fetch sellers:", err);
      }
    };

    fetchSellers();
  }, []);

  return (
    <div className="space-y-2">
      {sellers.map((seller) => (
        <div
          key={seller._id}
          className="p-4 rounded shadow flex justify-between hover:bg-gray-100"
        >
          <span>{seller.firstName} {seller.lastName}</span>
          <span className="text-gray-500 text-sm">{seller.email}</span>
        </div>
      ))}
      {sellers.length === 0 && <p>No sellers found.</p>}
    </div>
  );
}
