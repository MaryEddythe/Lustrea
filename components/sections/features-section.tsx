import { Star, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: Star,
      title: "Expert Technicians",
      description:
        "Our certified nail technicians have years of experience and stay updated with the latest trends and techniques.",
    },
    {
      icon: Clock,
      title: "Convenient Booking",
      description:
        "Easy online booking system with real-time availability. Book your appointment in just a few clicks.",
    },
    {
      icon: Calendar,
      title: "Premium Products",
      description: "We use only the finest nail products and tools, ensuring long-lasting results and healthy nails.",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Luxe Nails Studio?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional nail services with the highest standards of hygiene and artistry.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
