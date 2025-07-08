"use client"

import { useState } from "react"
import Navigation from "@/components/layout/navigation"
import HomePage from "@/components/pages/home-page"
import ServicesPage from "@/components/pages/services-page"
import GalleryPage from "@/components/pages/gallery-page"
import BookingPage from "@/components/pages/booking"
import AdminPage from "@/components/pages/admin-page"

export default function NailSalonApp() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onBookClick={() => setCurrentPage("booking")} onViewWorkClick={() => setCurrentPage("gallery")} />
      case "services":
        return <ServicesPage />
      case "gallery":
        return <GalleryPage />
      case "booking":
        return <BookingPage />
      case "admin":
        return <AdminPage />
      default:
        return <HomePage onBookClick={() => setCurrentPage("booking")} onViewWorkClick={() => setCurrentPage("gallery")} />
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  )
}
