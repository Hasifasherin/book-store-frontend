"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Header />

          {/* Offset because header is fixed */}
          <main className="pt-[170px] min-h-screen">{children}</main>

          <Footer />

          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: { background: "#4B2E2B", color: "#F5F1E9" },
              },
              error: {
                style: { background: "#D35400", color: "#fff" },
              },
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
