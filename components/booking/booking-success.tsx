"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { servicesData } from "@/lib/data/services-data"

interface BookingSuccessProps {
  selectedService: string
  selectedDate: string
  selectedTime: string
  onReset: () => void
}

export default function BookingSuccess({ selectedService, selectedDate, selectedTime, onReset }: BookingSuccessProps) {
  const service = servicesData.find((s) => s.id.toString() === selectedService)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your appointment has been successfully booked. We'll contact you soon to confirm the details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>
              <strong>Service:</strong> {service?.name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selectedTime}
            </p>
          </div>
          <Button onClick={onReset} className="w-full">
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
