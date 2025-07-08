import Link from "next/link"
import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import ContactSection from "@/components/sections/contact-section"

export default function HomePage({ onBookClick, onViewWorkClick }: { onBookClick: () => void, onViewWorkClick: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <HeroSection onBookClick={onBookClick} onViewWorkClick={onViewWorkClick} />
      <FeaturesSection />
      {/* <div className="text-center my-12">
        <Link href="/booking" legacyBehavior>
          <a className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-pink-700 hover:to-purple-700 transition">
            Book Appointment
          </a>
        </Link>
      </div> */}
      <ContactSection />
    </div>
  )
}
