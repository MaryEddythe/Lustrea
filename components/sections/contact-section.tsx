import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Beauty Street", "Downtown, City 12345"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["(555) 123-NAIL", "(555) 123-6245"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@luxenails.com", "booking@luxenails.com"],
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Studio</h2>
          <p className="text-gray-600">Located in the heart of the city, easily accessible and beautifully designed.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
              <div className="text-gray-600">
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
