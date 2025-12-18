"use client";

import AnnouncementBar from "./AnnouncementBar";
import MainHeader from "./MainHeader";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <AnnouncementBar />
      <MainHeader />
      <Navbar />
    </header>
  );
}
