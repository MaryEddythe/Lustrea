"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { servicesData } from "@/lib/data/services-data";
import { weekdayTimeSlots, weekendTimeSlots } from "@/lib/data/time-slots";
import { getAppointmentsForDate } from "@/lib/data/appointments-data";

interface ModernBookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
  selectedService: string;
  onNext?: () => void;
}

// Check if date is in the past
const isPastDate = (date: Date): boolean => {
  if (!date || !(date instanceof Date)) return true;
  const today = new Date();
  const dateToCheck = new Date(date);
  today.setHours(0, 0, 0, 0);
  dateToCheck.setHours(0, 0, 0, 0);
  return dateToCheck < today;
};

// Check if date is a Sunday (unavailable)
const isSunday = (date: Date): boolean => {
  if (!date || !(date instanceof Date)) return false;
  return date.getDay() === 0; // Sunday = 0
};

// Check if date is too far in the future (e.g., more than 3 months)
const isTooFarInFuture = (date: Date): boolean => {
  if (!date || !(date instanceof Date)) return true;
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  return date > threeMonthsFromNow;
};

// Get time slots for a specific date based on weekday/weekend
const getTimeSlotsForDate = (date: Date): string[] => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return [];
  }
  const dayOfWeek = date.getDay();
  // Sunday = 0 (unavailable), Saturday = 6
  if (dayOfWeek === 0) return []; // Sundays are unavailable
  return dayOfWeek === 6 ? weekendTimeSlots : weekdayTimeSlots;
};

// Get booked time slots for a specific date from appointment data
const getBookedSlotsForDate = (date: Date): string[] => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return [];
  }
  const dateString = date.toISOString().split("T")[0];
  const appointments = getAppointmentsForDate(dateString);
  return appointments.map((appointment) => appointment.time);
};

// Get available time slots for a specific date
const getAvailableTimeSlots = (date: Date): string[] => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return [];
  }
  const allSlots = getTimeSlotsForDate(date);
  const bookedSlots = getBookedSlotsForDate(date);
  return allSlots.filter((slot) => !bookedSlots.includes(slot));
};

// Get available slots count for a specific date
const getAvailableSlots = (date: Date): number => {
  return getAvailableTimeSlots(date).length;
};

// Check if date is fully booked
const isFullyBooked = (date: Date): boolean => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const availableSlots = getAvailableSlots(date);
  return availableSlots === 0 && getTimeSlotsForDate(date).length > 0;
};

// Check if date has available slots
const hasAvailableSlots = (date: Date): boolean => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  return getAvailableSlots(date) > 0;
};

export default function ModernBookingCalendar({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  selectedService,
  onNext,
}: ModernBookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const now = new Date();
    now.setDate(1);
    now.setHours(0, 0, 0, 0);
    return now;
  });

  // State for time slot popup
  const [showTimeSlotPopup, setShowTimeSlotPopup] = React.useState(false);
  const [popupDate, setPopupDate] = React.useState<Date | null>(null);

  // Get service details
  const service = servicesData.find((s) => s.id.toString() === selectedService);
  const serviceName = service?.name || "MANICURE";

  // Disable past dates, dates too far in future, and Sundays
  const disabledMatcher = React.useCallback((date: Date) => {
    return isPastDate(date) || isTooFarInFuture(date) || isSunday(date);
  }, []);

  // Format selected date for display
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white">
      {/* Service Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {serviceName.toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Select a Date and Time
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Timezone: Israel Daylight Time (GMT+3)
            </p>
          </div>

          {/* Custom Calendar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() - 1);
                  setCurrentMonth(newMonth);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(newMonth.getMonth() + 1);
                  setCurrentMonth(newMonth);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const firstDayOfMonth = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  1,
                );
                const lastDayOfMonth = new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  0,
                );
                const startDate = new Date(firstDayOfMonth);
                startDate.setDate(
                  startDate.getDate() - firstDayOfMonth.getDay(),
                );

                const days = [];
                const current = new Date(startDate);

                while (days.length < 42) {
                  // 6 weeks * 7 days
                  const isCurrentMonth =
                    current.getMonth() === currentMonth.getMonth();
                  const isSelected =
                    selectedDate &&
                    current.getDate() === selectedDate.getDate() &&
                    current.getMonth() === selectedDate.getMonth() &&
                    current.getFullYear() === selectedDate.getFullYear();
                  const isDisabled = disabledMatcher(current);
                  const isToday = (() => {
                    const today = new Date();
                    return (
                      current.getDate() === today.getDate() &&
                      current.getMonth() === today.getMonth() &&
                      current.getFullYear() === today.getFullYear()
                    );
                  })();

                  // Color coding for availability
                  const isAvailable =
                    isCurrentMonth && !isDisabled && hasAvailableSlots(current);
                  const isFullyBookedDay =
                    isCurrentMonth && !isDisabled && isFullyBooked(current);

                  days.push(
                    <button
                      key={current.toISOString()}
                      onClick={() => {
                        if (!isDisabled && isCurrentMonth) {
                          const dateToSelect = new Date(current);
                          setPopupDate(dateToSelect);
                          setShowTimeSlotPopup(true);
                        }
                      }}
                      disabled={isDisabled || !isCurrentMonth}
                      className={cn(
                        "h-10 w-full rounded-lg text-sm font-medium transition-all duration-200",
                        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                        isSelected &&
                          "bg-blue-600 text-white hover:bg-blue-700",
                        isToday &&
                          !isSelected &&
                          "bg-blue-50 text-blue-600 font-semibold",
                        !isCurrentMonth && "text-gray-300",
                        isDisabled &&
                          "text-gray-300 cursor-not-allowed hover:bg-transparent",
                        isAvailable &&
                          !isSelected &&
                          !isToday &&
                          "bg-green-100 text-green-800 hover:bg-green-200",
                        isFullyBookedDay &&
                          !isSelected &&
                          !isToday &&
                          "bg-red-100 text-red-800 hover:bg-red-200",
                        isCurrentMonth &&
                          !isDisabled &&
                          !isSelected &&
                          !isToday &&
                          !isAvailable &&
                          !isFullyBookedDay &&
                          "text-gray-900",
                      )}
                    >
                      {current.getDate()}
                    </button>,
                  );

                  current.setDate(current.getDate() + 1);
                }

                return days;
              })()}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              Click on a date to view available time slots
            </p>
          </div>
        </div>

        {/* Service Details Panel */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Service Details
                  </h3>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      {serviceName}
                    </h4>
                    {selectedDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatSelectedDate(selectedDate)}
                        {selectedTime && ` at ${selectedTime}`}
                      </p>
                    )}
                  </div>

                  {service && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Sheikh Zayed Road</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration} minutes</span>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        From ₱{service.price} | Part of a plan
                      </div>
                    </div>
                  )}
                </div>

                {selectedDate && selectedTime && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={onNext}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11 rounded-lg"
                    >
                      Next
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Already a member?{" "}
                      <button className="text-blue-600 hover:underline">
                        Log in
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Time Slot Selection Popup */}
      <Dialog open={showTimeSlotPopup} onOpenChange={setShowTimeSlotPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
              Select Time Slot
            </DialogTitle>
            {popupDate && (
              <p className="text-gray-600">{formatSelectedDate(popupDate)}</p>
            )}
          </DialogHeader>

          <div className="space-y-4">
            {popupDate && (
              <>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Available Times:
                  </h4>
                  {getTimeSlotsForDate(popupDate).map((time) => {
                    const isBooked =
                      getBookedSlotsForDate(popupDate).includes(time);
                    const isSelected = selectedTime === time;

                    return (
                      <Button
                        key={time}
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => {
                          if (!isBooked) {
                            onTimeSelect(time);
                            onDateSelect(popupDate);
                          }
                        }}
                        disabled={isBooked}
                        className={cn(
                          "w-full h-12 text-base font-medium transition-all duration-200 justify-start",
                          isSelected
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : isBooked
                              ? "border-red-300 bg-red-50 text-red-600 cursor-not-allowed"
                              : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50",
                        )}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                        {isBooked && (
                          <span className="ml-auto text-xs">
                            (Fully Booked)
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Continue Button */}
                {selectedTime &&
                  popupDate &&
                  selectedDate &&
                  popupDate.getTime() === selectedDate.getTime() && (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => {
                          setShowTimeSlotPopup(false);
                          onNext && onNext();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11"
                      >
                        Continue to Step 2
                      </Button>
                    </div>
                  )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
