"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
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
        </Provider>
      </body>
    </html>
  );
}
