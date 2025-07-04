import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import ContactSection from "@/components/sections/contact-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <HeroSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  )
}
