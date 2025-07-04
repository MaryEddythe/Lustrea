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
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  bookedSlots?: Record<string, number>; // Date string -> number of booked slots
}

// Get number of available slots based on day of week
const getMaxSlotsForDay = (date: Date): number => {
  const dayOfWeek = date.getDay();
  // Sunday = 0, Saturday = 6
  return dayOfWeek === 0 || dayOfWeek === 6 ? 3 : 4;
};

// Get available slots for a specific date
const getAvailableSlots = (
  date: Date,
  bookedSlots: Record<string, number> = {},
): number => {
  const dateString = date.toISOString().split("T")[0];
  const maxSlots = getMaxSlotsForDay(date);
  const booked = bookedSlots[dateString] || 0;
  return Math.max(0, maxSlots - booked);
};

// Check if date is in the past
const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

// Check if date is too far in the future (e.g., more than 3 months)
const isTooFarInFuture = (date: Date): boolean => {
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  return date > threeMonthsFromNow;
};

export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  bookedSlots = {},
}: BookingCalendarProps) {
  // Get current month for display
  const currentMonth = new Date();

  // Disable past dates and dates too far in future
  const disabledMatcher = React.useCallback((date: Date) => {
    return isPastDate(date) || isTooFarInFuture(date);
  }, []);

  // Custom modifiers for different slot availability states
  const modifiers = React.useMemo(() => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const availableDates: Date[] = [];
    const fullDates: Date[] = [];

    // Check next 90 days for availability
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (!isPastDate(date) && !isTooFarInFuture(date)) {
        const available = getAvailableSlots(date, bookedSlots);
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
  }, [bookedSlots]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5" />
          <span>Select Appointment Date</span>
        </CardTitle>
        <CardDescription>
          Choose an available date for your appointment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={disabledMatcher}
          modifiers={modifiers}
          modifiersClassNames={{
            available: "bg-green-50 text-green-900 hover:bg-green-100",
            full: "bg-red-50 text-red-700 opacity-50 cursor-not-allowed",
          }}
          defaultMonth={currentMonth}
          className="rounded-md border"
        />

        {/* Custom slot indicators overlay */}
        <div className="relative -mt-64 pointer-events-none">
          <div className="grid grid-cols-7 gap-1 px-3 py-2">
            {/* Skip the header row */}
            <div className="col-span-7 h-8"></div>
            {Array.from({ length: 42 }, (_, i) => {
              const startOfMonth = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                1,
              );
              const startOfCalendar = new Date(startOfMonth);
              startOfCalendar.setDate(
                startOfCalendar.getDate() - startOfMonth.getDay(),
              );

              const currentDate = new Date(startOfCalendar);
              currentDate.setDate(currentDate.getDate() + i);

              const isPast = isPastDate(currentDate);
              const isFuture = isTooFarInFuture(currentDate);
              const isCurrentMonth =
                currentDate.getMonth() === currentMonth.getMonth();

              if (!isCurrentMonth || isPast || isFuture) {
                return <div key={i} className="h-9 w-9"></div>;
              }

              const availableSlots = getAvailableSlots(
                currentDate,
                bookedSlots,
              );
              const maxSlots = getMaxSlotsForDay(currentDate);

              return (
                <div
                  key={i}
                  className="h-9 w-9 flex flex-col items-center justify-end pb-1"
                >
                  <div className="flex space-x-0.5">
                    {Array.from({ length: maxSlots }, (_, slotIndex) => (
                      <div
                        key={slotIndex}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          slotIndex < availableSlots
                            ? "bg-green-500"
                            : "bg-red-300",
                        )}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Available slot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-300 rounded-full" />
              <span>Booked slot</span>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            <div>Weekdays: Up to 4 slots available</div>
            <div>Weekends: Up to 3 slots available</div>
          </div>
        </div>

        {selectedDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900">
              Selected:{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-xs text-blue-700 mt-1">
              {getAvailableSlots(selectedDate, bookedSlots)} of{" "}
              {getMaxSlotsForDay(selectedDate)} slots available
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
