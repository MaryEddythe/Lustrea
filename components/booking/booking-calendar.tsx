"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { weekdayTimeSlots, weekendTimeSlots } from "@/lib/data/time-slots";
import {
  appointmentsData,
  getAppointmentsForDate,
} from "@/lib/data/appointments-data";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onSlotSelect?: (date: Date, time: string) => void;
  bookedSlots?: Record<string, string[]>; // Date string -> array of booked time slots
}

// Get booked time slots for a specific date from appointment data
const getBookedSlotsForDate = (date: Date): string[] => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return [];
  }
  const dateString = date.toISOString().split("T")[0];
  const appointments = getAppointmentsForDate(dateString);
  return appointments.map((appointment) => appointment.time);
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

export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  onSlotSelect,
  bookedSlots = {},
}: BookingCalendarProps) {
  // Use state for current month to keep stable across renders
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const now = new Date();
    now.setDate(1);
    now.setHours(0, 0, 0, 0);
    return now;
  });

  // Disable past dates, dates too far in future, and Sundays
  const disabledMatcher = React.useCallback((date: Date) => {
    return isPastDate(date) || isTooFarInFuture(date) || isSunday(date);
  }, []);

  // Custom modifiers for different slot availability states
  const modifiers = React.useMemo(() => {
    const today = new Date();
    const availableDates: Date[] = [];
    const fullDates: Date[] = [];

    // Check next 90 days for availability
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (!isPastDate(date) && !isTooFarInFuture(date) && !isSunday(date)) {
        const available = getAvailableSlots(date);
        if (available > 0) {
          availableDates.push(new Date(date));
        } else {
          fullDates.push(new Date(date));
        }
      }
    }

    return {
      available: availableDates,
      full: fullDates,
    };
  }, []);

  // State for slot selection sheet
  const [slotSheetOpen, setSlotSheetOpen] = React.useState(false);
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

  // Open sheet and set available slots when a date is selected
  React.useEffect(() => {
    if (
      selectedDate &&
      !isPastDate(selectedDate) &&
      !isTooFarInFuture(selectedDate)
    ) {
      const slots = getAvailableTimeSlots(selectedDate);
      setAvailableSlots(slots);
      setSlotSheetOpen(true);
    } else {
      setSlotSheetOpen(false);
    }
  }, [selectedDate]);

  // Handle slot selection
  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    if (selectedDate && onSlotSelect) {
      onSlotSelect(selectedDate, slot);
    }
    setSlotSheetOpen(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
            <CalendarDays className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Select Your Appointment Date
          </CardTitle>
        </div>
        <CardDescription className="text-base">
          Choose a date to see available time slots
        </CardDescription>

        {/* Availability Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm" />
            <span className="text-sm font-medium text-green-700">
              Available
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
            <span className="text-sm font-medium text-red-700">
              Fully Booked
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-300 shadow-sm" />
            <span className="text-sm font-medium text-gray-600">
              Sundays Closed
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="calendar-container">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateSelect(date);
              setSelectedSlot(null); // reset slot selection on new date
            }}
            disabled={disabledMatcher}
            modifiers={modifiers}
            modifiersClassNames={{
              available: "calendar-available",
              full: "calendar-full",
            }}
            className="mx-auto border-0 bg-white"
          />
        </div>
        {selectedDate && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <Badge
                variant="outline"
                className="mt-2 flex gap-2 items-center text-sm"
              >
                <Clock className="h-4 w-4" />
                {getAvailableSlots(selectedDate)} slots available
              </Badge>
            </div>
          </div>
        )}
      </CardContent>

      {/* Time slot selection sheet */}
      <Sheet open={slotSheetOpen} onOpenChange={setSlotSheetOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px] bg-gradient-to-br from-white to-gray-50"
        >
          <SheetHeader className="pb-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <SheetTitle className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Choose Your Time Slot
              </SheetTitle>
              {selectedDate && (
                <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {availableSlots.length} slots available
                  </p>
                </div>
              )}
            </div>
          </SheetHeader>
          <div className="space-y-3">
            {selectedDate && (
              <div className="space-y-4">
                {/* Available Slots */}
                {availableSlots.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-green-700 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Available times ({availableSlots.length}):
                    </div>
                    <div className="space-y-3">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={
                            selectedSlot === slot ? "default" : "outline"
                          }
                          className={cn(
                            "w-full h-14 text-left justify-start font-medium transition-all duration-200 text-base",
                            selectedSlot === slot
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg scale-105"
                              : "hover:border-pink-300 hover:bg-pink-50 hover:shadow-md hover:scale-105",
                          )}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <Clock className="h-5 w-5 mr-3" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Booked Slots */}
                {(() => {
                  const bookedSlots = getBookedSlotsForDate(selectedDate);
                  return (
                    bookedSlots.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Already booked ({bookedSlots.length}):
                        </div>
                        <div className="space-y-2">
                          {bookedSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="w-full h-12 px-4 flex items-center bg-red-50 border border-red-200 rounded-lg text-red-700"
                            >
                              <Clock className="h-4 w-4 mr-3" />
                              <span className="font-medium">{slot}</span>
                              <span className="ml-auto text-xs text-red-500">
                                Unavailable
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })()}

                {availableSlots.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      No Available Slots
                    </div>
                    <div className="text-sm text-gray-600">
                      This date is fully booked. Please select a different date.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
