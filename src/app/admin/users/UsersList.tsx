"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Buyer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function UsersList() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Filter only buyers
        const buyersData = res.data.filter((u: any) => u.role === "buyer");
        setBuyers(buyersData);
      } catch (err) {
        console.error("Failed to fetch buyers:", err);
      }
    };

    fetchBuyers();
  }, []);

  return (
    <div className="space-y-2">
      {buyers.map((buyer) => (
        <div
          key={buyer._id}
          className="p-4 rounded shadow flex justify-between hover:bg-gray-100"
        >
          <span>{buyer.firstName} {buyer.lastName}</span>
          <span className="text-gray-500 text-sm">{buyer.email}</span>
        </div>
      ))}
      {buyers.length === 0 && <p>No buyers found.</p>}
    </div>
  );
}
