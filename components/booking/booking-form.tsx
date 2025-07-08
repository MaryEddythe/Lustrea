"use client";

import type React from "react";
import { useState } from "react";

import { Clock, DollarSign, Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { servicesData } from "@/lib/data/services-data";
import ImageUpload from "@/components/booking/image-upload";

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  paymentProof?: File;
  designImage?: File;
}

interface BookingFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  timeSlots: string[];
  selectedService: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BookingForm({
  formData,
  setFormData,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  timeSlots,
  selectedService,
  onSubmit,
}: BookingFormProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg border-b">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Appointment Details
          </span>
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Complete your booking with personal details and time selection
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="Enter your full name"
                className="h-12 border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                placeholder="+63 912 345 6789"
                className="h-12 border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="your.email@example.com"
              className="h-12 border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base"
            />
          </div>

          <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-pink-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <svg
                  className="w-4 h-4 text-white"
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
              <Label className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Selected Date
              </Label>
            </div>
            <p className="text-gray-800 font-medium text-lg">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No date selected"}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="time"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Preferred Time *
            </Label>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              required
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base">
                <SelectValue placeholder="Choose your preferred time slot" />
              </SelectTrigger>
              <SelectContent className="border-2 border-gray-200 rounded-lg">
                {timeSlots.map((slot) => (
                  <SelectItem
                    key={slot}
                    value={slot}
                    className="hover:bg-pink-50 focus:bg-pink-50 py-3 text-base"
                  >
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requests, allergies, or preferences we should know about..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="min-h-[120px] border-2 border-gray-200 focus:border-pink-400 focus:ring-pink-400 rounded-lg text-base resize-none"
            />
          </div>

          {/* Design Reference Image Upload */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
            <ImageUpload
              onImageSelect={(file) =>
                setFormData({ ...formData, designImage: file || undefined })
              }
              selectedImage={formData.designImage}
              label="Design Reference Image (Optional)"
              description="Upload a photo of your desired nail design to help our artists understand your vision"
            />
          </div>

          {/* GCash Payment Proof Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              GCash Payment Proof *
            </Label>

            {/* GCash Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">
                    Send ₱150 to our GCash:
                  </h4>
                  <p className="text-blue-700 font-mono text-lg">
                    09XX XXX XXXX
                  </p>
                  <p className="text-sm text-blue-600">
                    After sending, take a screenshot of your GCash receipt and
                    upload it below to confirm your appointment.
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
              {!formData.paymentProof ? (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium">
                      Upload GCash Receipt Screenshot
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, paymentProof: file });
                      }
                    }}
                    className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <span className="text-green-700 font-semibold">
                      Payment proof uploaded!
                    </span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <strong>File:</strong> {formData.paymentProof.name}
                    </p>
                    <p className="text-sm text-green-600">
                      Size:{" "}
                      {(formData.paymentProof.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentProof: undefined })
                    }
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                    Remove file
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary with Placement Fee */}
          {selectedService && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <Label className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Payment Summary
                </Label>
              </div>
              <div className="space-y-3">
                {(() => {
                  const service = servicesData.find(
                    (s) => s.id.toString() === selectedService,
                  );
                  const servicePrice = service?.price || 0;
                  const placementFee = 150;
                  const remainingBalance = servicePrice - placementFee;

                  return (
                    <>
                      <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">
                          Service: {service?.name}
                        </span>
                        <span className="font-semibold">₱{servicePrice}</span>
                      </div>
                      <div className="flex justify-between items-center text-green-700">
                        <span className="font-medium">
                          Placement Fee (Pay Now)
                        </span>
                        <span className="font-semibold">₱{placementFee}</span>
                      </div>
                      <div className="border-t border-green-300 pt-3">
                        <div className="flex justify-between items-center text-lg font-bold text-green-800">
                          <span>Remaining Balance</span>
                          <span>₱{remainingBalance}</span>
                        </div>
                      </div>
                      <div className="text-xs text-green-700 bg-green-100 p-3 rounded-lg space-y-1">
                        <p>
                          <strong>How it works:</strong>
                        </p>
                        <p>
                          • Pay ₱150 placement fee now via GCash to secure your
                          slot
                        </p>
                        <p>
                          • Pay remaining ₱{remainingBalance} when you arrive
                          for your appointment
                        </p>
                        <p>
                          • Upload your GCash receipt screenshot below to
                          confirm
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !selectedService || !selectedTime || !formData.paymentProof
            }
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {!formData.paymentProof
              ? "Upload Payment Proof to Continue"
              : "Confirm Your Appointment"}
          </Button>

          {(!selectedService || !selectedTime || !formData.paymentProof) && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Please complete all required fields including GCash payment
                proof to proceed
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
