"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { useAppSelector } from "@/redux/hooks";
import { Book } from "@/types/book";

// Generate distinct colors for each category
function generateColors(count: number) {
  const colors: string[] = [];
  const hueStep = Math.floor(360 / count);

  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${i * hueStep}, 70%, 50%)`);
  }
  return colors;
}

export default function AnalyticsCharts() {
  const booksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const usersCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const booksChart = useRef<Chart | null>(null);
  const usersChart = useRef<Chart | null>(null);

  const [mounted, setMounted] = useState(false);
  const { books } = useAppSelector((state) => state.books); // Redux books
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !books) return;

    const fetchAndRenderCharts = async () => {
      try {
        if (!token) return console.error("No auth token found");

        // Fetch users analytics
        const [buyersRes, sellersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/buyers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics/sellers`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const totalUsers = (buyersRes.data.total || 0) + (sellersRes.data.total || 0);

        // ---------------- BOOKS BY CATEGORY ----------------
        const categoryMap: Record<string, number> = {};
        books.forEach((book: Book) => {
          const name = book.categoryName || "Uncategorized";
          categoryMap[name] = (categoryMap[name] || 0) + 1;
        });

        const labels = Object.keys(categoryMap);
        const data = Object.values(categoryMap);
        const bookColors = generateColors(labels.length); // Dynamic colors

        // Destroy previous charts
        booksChart.current?.destroy();
        usersChart.current?.destroy();

        if (booksCanvasRef.current) {
          booksChart.current = new Chart(booksCanvasRef.current, {
            type: "doughnut",
            data: { labels, datasets: [{ data, backgroundColor: bookColors, borderColor: "#FFFFFF", borderWidth: 2 }] },
            options: {
              responsive: true,
              plugins: {
                title: { display: true, text: "Books by Category", color: "#0F172A", font: { size: 16, weight: "bold" } },
                subtitle: { display: true, text: `Total Categories: ${labels.length}`, color: "#4B5563", font: { size: 13 } },
                legend: { labels: { color: "#374151" }, position: "bottom" },
              },
            },
          });
        }

        // ---------------- USERS DISTRIBUTION ----------------
        if (usersCanvasRef.current) {
          usersChart.current = new Chart(usersCanvasRef.current, {
            type: "pie",
            data: { labels: ["Buyers", "Sellers"], datasets: [{ data: [buyersRes.data.total || 0, sellersRes.data.total || 0], backgroundColor: ["#1E2A5E", "#D35400"], borderColor: "#FFFFFF", borderWidth: 2 }] },
            options: {
              responsive: true,
              plugins: {
                title: { display: true, text: "Users Distribution", color: "#0F172A", font: { size: 16, weight: "bold" } },
                subtitle: { display: true, text: `Total Users: ${totalUsers}`, color: "#4B5563", font: { size: 13 } },
                legend: { labels: { color: "#374151" }, position: "bottom" },
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
  }, [mounted, books, token]);

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
