"use client";

import type React from "react";

import { useState, useEffect } from "react";
import ServiceSelection from "@/components/booking/service-selection";
import BookingCalendar from "@/components/booking/booking-calendar";
import BookingForm from "@/components/booking/booking-form";
import BookingSuccess from "@/components/booking/booking-success";
import { servicesData } from "@/lib/data/services-data";
import { timeSlots } from "@/lib/data/time-slots";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type BookingStep = "calendar" | "service" | "details";

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Mock booked slots data - in real app this would come from API
  const [bookedSlots] = useState<Record<string, number>>({
    // Example: some dates with booked slots
    [new Date(Date.now() + 86400000).toISOString().split("T")[0]]: 2, // Tomorrow: 2 slots booked
    [new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]]: 4, // Day after: 4 slots booked (full weekday)
    [new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]]: 3, // Next week: 3 slots booked (full weekend)
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate booking
    setBookingSuccess(true);
    // Reset form
    setFormData({ name: "", email: "", phone: "", notes: "" });
    setSelectedService("");
    setSelectedTime("");
    setCurrentStep("calendar");
  };

  const resetBooking = () => {
    setBookingSuccess(false);
    setSelectedDate(undefined);
    setCurrentStep("calendar");
  };

  const canProceedToService = selectedDate !== undefined;
  const canProceedToDetails = selectedService !== "";

  if (bookingSuccess) {
    return (
      <BookingSuccess
        selectedService={selectedService}
        selectedDate={selectedDate?.toISOString().split("T")[0] || ""}
        selectedTime={selectedTime}
        onReset={resetBooking}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-gray-600">
            Follow these simple steps to schedule your visit
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${currentStep === "calendar" ? "text-pink-600" : currentStep === "service" || currentStep === "details" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "calendar" ? "bg-pink-600 text-white" : currentStep === "service" || currentStep === "details" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                1
              </div>
              <span className="text-sm font-medium">Select Date</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div
              className={`flex items-center space-x-2 ${currentStep === "service" ? "text-pink-600" : currentStep === "details" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "service" ? "bg-pink-600 text-white" : currentStep === "details" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                2
              </div>
              <span className="text-sm font-medium">Choose Service</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div
              className={`flex items-center space-x-2 ${currentStep === "details" ? "text-pink-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "details" ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-600"}`}
              >
                3
              </div>
              <span className="text-sm font-medium">Your Details</span>
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === "calendar" && (
            <div className="space-y-6">
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                bookedSlots={bookedSlots}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => setCurrentStep("service")}
                  disabled={!canProceedToService}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Continue to Service Selection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "service" && (
            <div className="space-y-6">
              <ServiceSelection
                services={servicesData}
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("calendar")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Calendar
                </Button>
                <Button
                  onClick={() => setCurrentStep("details")}
                  disabled={!canProceedToDetails}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Continue to Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === "details" && (
            <div className="space-y-6">
              <BookingForm
                formData={formData}
                setFormData={setFormData}
                selectedDate={selectedDate?.toISOString().split("T")[0] || ""}
                setSelectedDate={() => {}} // Not needed in this step
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                timeSlots={timeSlots}
                selectedService={selectedService}
                onSubmit={handleBooking}
              />
              <div className="flex justify-start">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("service")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Service Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
