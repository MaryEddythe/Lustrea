"use client";

import type React from "react";

import { Clock } from "lucide-react";
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

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
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

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedService || !selectedTime}
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
            Confirm Your Appointment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
