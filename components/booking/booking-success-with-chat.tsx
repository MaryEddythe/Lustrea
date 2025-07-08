"use client";

import { useState } from "react";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { servicesData } from "@/lib/data/services-data";
import ChatInterface from "@/components/messaging/chat-interface";

interface BookingSuccessProps {
  appointmentData: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    notes?: string;
  };
  onReset: () => void;
}

export default function BookingSuccessWithChat({
  appointmentData,
  onReset,
}: BookingSuccessProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const service = servicesData.find((s) => s.name === appointmentData.service);

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
              <strong>Service:</strong> {appointmentData.service}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointmentData.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {appointmentData.time}
            </p>
            <p>
              <strong>Client:</strong> {appointmentData.name}
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
                  <span>Service: {appointmentData.service}</span>
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

          {/* Action Buttons */}
          <div className="space-y-3">
            {appointmentData.id && (
              <Button
                onClick={() => setIsChatOpen(true)}
                variant="outline"
                className="w-full border-2 border-pink-300 hover:bg-pink-50 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Admin
              </Button>
            )}
            <Button
              onClick={onReset}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book Another Appointment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {appointmentData.id && (
        <ChatInterface
          appointmentId={appointmentData.id}
          clientName={appointmentData.name}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          isAdmin={false}
        />
      )}
    </div>
  );
}
