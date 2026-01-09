"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

interface BookStats {
  category: string;
  count: number;
}

export default function AnalyticsCharts() {
  const booksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const usersCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const booksChart = useRef<Chart | null>(null);
  const usersChart = useRef<Chart | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const fetchAndRenderCharts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No auth token found");

        const [booksRes, buyersRes, sellersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/books`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/buyers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/sellers`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const bookStats: BookStats[] = Array.isArray(booksRes.data) ? booksRes.data : [];
        const totalUsers = (buyersRes.data.total || 0) + (sellersRes.data.total || 0);

        booksChart.current?.destroy();
        usersChart.current?.destroy();

        // Professional dashboard colors
        const bookColors = ["#4B2E2B", "#1E2A5E", "#D35400", "#81B29A", "#6A7FDB", "#F2CC8F"];
        const userColors = ["#1E2A5E", "#D35400"];

        /* ---------------- Books by Category Chart (Doughnut) ---------------- */
        if (booksCanvasRef.current) {
          booksChart.current = new Chart(booksCanvasRef.current, {
            type: "doughnut",
            data: {
              labels: bookStats.map((b) => b.category || "Unknown"),
              datasets: [
                {
                  data: bookStats.map((b) => b.count),
                  backgroundColor: bookColors,
                  borderColor: "#FFFFFF",
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Books by Category",
                  color: "#0F172A", // dark text for clarity
                  font: { size: 16, weight: "bold" },
                },
                subtitle: {
                  display: true,
                  text: `Total Categories: ${bookStats.length}`,
                  color: "#4B5563", // medium gray
                  font: { size: 13 },
                },
                legend: {
                  labels: { color: "#374151" }, // professional gray
                  position: "bottom",
                },
              },
            },
          });
        }

        /* ---------------- Users Distribution ---------------- */
        if (usersCanvasRef.current) {
          usersChart.current = new Chart(usersCanvasRef.current, {
            type: "pie",
            data: {
              labels: ["Buyers", "Sellers"],
              datasets: [
                {
                  data: [buyersRes.data.total || 0, sellersRes.data.total || 0],
                  backgroundColor: userColors,
                  borderColor: "#FFFFFF",
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Users Distribution",
                  color: "#0F172A",
                  font: { size: 16, weight: "bold" },
                },
                subtitle: {
                  display: true,
                  text: `Total Users: ${totalUsers}`,
                  color: "#4B5563",
                  font: { size: 13 },
                },
                legend: {
                  labels: { color: "#374151" },
                  position: "bottom",
                },
              },
            },
          });
        }
      } catch (error) {
        console.error("Failed to load analytics charts:", error);
      }
    };

    fetchAndRenderCharts();

    return () => {
      booksChart.current?.destroy();
      usersChart.current?.destroy();
    };
  }, [mounted]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-[#F8FAFC] p-6 rounded-xl shadow-lg border border-[#E5E7EB]">
        <canvas ref={booksCanvasRef} height={260} />
      </div>
      <div className="bg-[#F8FAFC] p-6 rounded-xl shadow-lg border border-[#E5E7EB]">
        <canvas ref={usersCanvasRef} height={260} />
      </div>
    </div>
  );
}
