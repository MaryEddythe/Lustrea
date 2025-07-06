"use client";

import { CheckCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { servicesData } from "@/lib/data/services-data";

interface BookingSuccessProps {
  selectedService: string;
  selectedDate: string;
  selectedTime: string;
  onReset: () => void;
}

export default function BookingSuccess({
  selectedService,
  selectedDate,
  selectedTime,
  onReset,
}: BookingSuccessProps) {
  const service = servicesData.find((s) => s.id.toString() === selectedService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Booking Confirmed!
          </CardTitle>
          <CardDescription>
            Your appointment has been successfully booked. We'll contact you
            soon to confirm the details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>
              <strong>Service:</strong> {service?.name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selectedTime}
            </p>
          </div>

          {/* Payment Status */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-800 text-sm">
                Payment Confirmed
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Service: {service?.name}</span>
                  <span>₱{service?.price}</span>
                </div>
                <div className="flex justify-between text-green-700 mb-2">
                  <span>✓ Placement Fee (Paid)</span>
                  <span>₱150</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold text-orange-700">
                    <span>Remaining Balance</span>
                    <span>₱{(service?.price || 0) - 150}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                <p>
                  <strong>Payment Instructions:</strong>
                </p>
                <p>• Your ₱150 placement fee has been received</p>
                <p>
                  • Pay the remaining ₱{(service?.price || 0) - 150} when you
                  arrive
                </p>
                <p>
                  • We'll contact you within 24 hours to confirm your
                  appointment
                </p>
              </div>
            </div>
          </div>

          <Button onClick={onReset} className="w-full">
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
