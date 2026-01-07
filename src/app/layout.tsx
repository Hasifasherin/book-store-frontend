"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Detect admin pages
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Provider store={store}>
          {/* User Header only */}
          {!isAdminPage && <Header />}

          {/* Main Content */}
          <main
            className={
              !isAdminPage
                ? "pt-[170px] min-h-screen"
                : "min-h-screen"
            }
          >
            {children}
          </main>

          {/* User Footer only */}
          {!isAdminPage && <Footer />}

          {/* Global Toasts */}
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: { background: "#4B2E2B", color: "#F5F1E9" },
              },
              error: {
                style: { background: "#D35400", color: "#ffffff" },
              },
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
