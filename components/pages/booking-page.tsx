"use client";

import type React from "react";

import { useState, useEffect } from "react";
import ServiceSelection from "@/components/booking/service-selection";
import BookingCalendar from "@/components/booking/booking-calendar";
import BookingForm from "@/components/booking/booking-form";
import BookingSuccess from "@/components/booking/booking-success";
import { servicesData } from "@/lib/data/services-data";
import { timeSlots } from "@/lib/data/time-slots";
import { addAppointment } from "@/lib/data/appointments-data";
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

  // Handle slot selection from calendar
  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedTime(time);
    setCurrentStep("service");
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedService) {
      return;
    }

    // Add the appointment to the data
    addAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: selectedService,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      status: "confirmed",
      notes: formData.notes,
    });

    // Show success
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
    setSelectedTime("");
    setSelectedService("");
    setFormData({ name: "", email: "", phone: "", notes: "" });
    setCurrentStep("calendar");
  };

  const canProceedToService = selectedDate !== undefined && selectedTime !== "";
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Book Your Appointment
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience luxury nail care with our simple 3-step booking process
          </p>
        </div>

        {/* Enhanced Step indicator */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200">
              <div
                className={`h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-in-out ${
                  currentStep === "calendar"
                    ? "w-0"
                    : currentStep === "service"
                      ? "w-1/2"
                      : "w-full"
                }`}
              />
            </div>

            <div className="flex items-center space-x-16 lg:space-x-24">
              {/* Step 1 */}
              <div className="flex flex-col items-center space-y-3 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                    currentStep === "calendar"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-110 shadow-pink-200"
                      : currentStep === "service" || currentStep === "details"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {currentStep === "service" || currentStep === "details"
                    ? "✓"
                    : "1"}
                </div>
                <div className="text-center">
                  <span
                    className={`text-sm font-medium block ${
                      currentStep === "calendar"
                        ? "text-pink-600"
                        : currentStep === "service" || currentStep === "details"
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    Select Date
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Choose your day
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center space-y-3 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                    currentStep === "service"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-110 shadow-pink-200"
                      : currentStep === "details"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {currentStep === "details" ? "✓" : "2"}
                </div>
                <div className="text-center">
                  <span
                    className={`text-sm font-medium block ${
                      currentStep === "service"
                        ? "text-pink-600"
                        : currentStep === "details"
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    Choose Service
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Pick your treatment
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center space-y-3 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                    currentStep === "details"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-110 shadow-pink-200"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  3
                </div>
                <div className="text-center">
                  <span
                    className={`text-sm font-medium block ${
                      currentStep === "details"
                        ? "text-pink-600"
                        : "text-gray-400"
                    }`}
                  >
                    Your Details
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Complete booking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step content with animations */}
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden">
            {currentStep === "calendar" && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onSlotSelect={handleSlotSelect}
                />
                <div className="flex justify-center lg:justify-end">
                  <Button
                    onClick={() => setCurrentStep("service")}
                    disabled={!canProceedToService}
                    size="lg"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base font-medium"
                  >
                    {selectedTime
                      ? `Continue with ${selectedTime} slot`
                      : "Select a time slot"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "service" && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                <ServiceSelection
                  services={servicesData}
                  selectedService={selectedService}
                  onServiceSelect={setSelectedService}
                />
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("calendar")}
                    size="lg"
                    className="border-2 hover:bg-gray-50 px-6 py-3 text-base font-medium"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Calendar
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("details")}
                    disabled={!canProceedToDetails}
                    size="lg"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-base font-medium"
                  >
                    Continue to Details
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "details" && (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
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
                <div className="flex justify-center lg:justify-start">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("service")}
                    size="lg"
                    className="border-2 hover:bg-gray-50 px-6 py-3 text-base font-medium"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Service Selection
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
