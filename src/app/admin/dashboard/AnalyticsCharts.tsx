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

                const bookColors = ["#E07A5F", "#81B29A", "#F2CC8F", "#588157", "#6A7FDB", "#D9B08C"];

                const userColors = ["#6B8E23", "#FF7F50"];

                /* ---------------- Books by Category Chart (Doughnut) ---------------- */
                if (booksCanvasRef.current) {
                    booksChart.current = new Chart(booksCanvasRef.current, {
                        type: "doughnut", 
                        data: {
                            labels: bookStats.map((b) => b.category || "Unknown"),
                            datasets: [
                                {
                                    data: bookStats.map((b) => b.count),
                                    backgroundColor: [
                                        "#E07A5F", 
                                        "#81B29A", 
                                        "#F2CC8F", 
                                        "#588157", 
                                        "#6A7FDB", 
                                        "#D9B08C", 
                                    ],
                                    borderColor: "#ffffff",
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
                                    color: "#111827",
                                    font: { size: 12, weight: "bold" },
                                },
                                subtitle: {
                                    display: true,
                                    text: `Total Categories: ${bookStats.length}`,
                                    color: "#374151",
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
                                    borderColor: "#ffffff",
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
                                    color: "#111827",
                                    font: { size: 18, weight: "bold" },
                                },
                                subtitle: {
                                    display: true,
                                    text: `Total Users: ${totalUsers}`,
                                    color: "#374151",
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
            <div className="bg-white p-6 rounded shadow">
                <canvas ref={booksCanvasRef} height={260} />
            </div>
            <div className="bg-white p-6 rounded shadow">
                <canvas ref={usersCanvasRef} height={260} />
            </div>
        </div>
    );
}
