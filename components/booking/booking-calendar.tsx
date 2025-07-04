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
import { CalendarDays, Info } from "lucide-react";
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
  if (!date || !(date instanceof Date)) return true;
  const today = new Date();
  const dateToCheck = new Date(date);
  today.setHours(0, 0, 0, 0);
  dateToCheck.setHours(0, 0, 0, 0);
  return dateToCheck < today;
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
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg border-b">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Select Appointment Date
            </span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                How to Read
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  How to Read the Calendar
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                {/* Date color indicators */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Date Colors:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-green-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 rounded-md flex items-center justify-center text-green-900 font-semibold text-xs">
                        22
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          Available Dates
                        </div>
                        <div className="text-xs text-gray-500">
                          Green background
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-red-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-pink-100 border-2 border-red-200 rounded-md flex items-center justify-center text-red-700 font-semibold text-xs">
                        15
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          Fully Booked
                        </div>
                        <div className="text-xs text-gray-500">
                          Red background
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dot indicators */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Slot Indicators:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex space-x-0.5 bg-gray-50 rounded-full px-2 py-1">
                        {Array.from({ length: 4 }, (_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border border-white shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-gray-700">4 slots available</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex space-x-0.5 bg-gray-50 rounded-full px-2 py-1">
                        {Array.from({ length: 4 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full border border-white shadow-sm ${
                              i < 2
                                ? "bg-gradient-to-br from-green-400 to-emerald-500"
                                : "bg-gradient-to-br from-red-300 to-pink-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-700">2 slots available</span>
                    </div>
                  </div>
                </div>

                {/* Schedule info */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-3">
                    Schedule Information:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                      <span>Monday-Friday: 4 slots max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                      <span>Saturday-Sunday: 3 slots max</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Choose an available date for your luxury nail treatment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="relative">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={disabledMatcher}
            modifiers={modifiers}
            modifiersClassNames={{
              available:
                "bg-gradient-to-br from-green-100 to-emerald-100 text-green-900 hover:bg-gradient-to-br hover:from-green-200 hover:to-emerald-200 border-2 border-green-300 shadow-md font-semibold",
              full: "bg-gradient-to-br from-red-100 to-pink-100 text-red-700 opacity-70 cursor-not-allowed border-2 border-red-200",
            }}
            defaultMonth={currentMonth}
            className="rounded-xl border-2 border-gray-100 shadow-sm mx-auto bg-white w-full"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-lg font-semibold",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell:
                "text-muted-foreground rounded-md w-full font-normal text-sm text-center py-2",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 min-h-[60px]",
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
              ),
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside:
                "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>

        {/* Enhanced availability indicators overlay */}
        <div className="relative -mt-[320px] pointer-events-none z-10">
          <div className="px-3 py-2">
            {/* Skip to calendar body */}
            <div className="h-16"></div> {/* Caption space */}
            <div className="h-8"></div> {/* Header space */}
            {/* Calendar grid overlay */}
            <div className="grid grid-cols-7 gap-2">
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
                  return <div key={i} className="min-h-[60px] p-2"></div>;
                }

                const availableSlots = getAvailableSlots(
                  currentDate,
                  bookedSlots,
                );
                const maxSlots = getMaxSlotsForDay(currentDate);

                return (
                  <div
                    key={i}
                    className="min-h-[60px] p-2 flex flex-col items-center justify-end"
                  >
                    {/* Date number */}
                    <div className="text-sm font-medium mb-1 text-center">
                      {currentDate.getDate()}
                    </div>

                    {/* Availability dots */}
                    <div className="flex space-x-1 justify-center mb-1">
                      {Array.from({ length: maxSlots }, (_, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={cn(
                            "w-2 h-2 rounded-full border border-white shadow-sm transition-all duration-200",
                            slotIndex < availableSlots
                              ? "bg-gradient-to-br from-green-400 to-emerald-500"
                              : "bg-gradient-to-br from-red-300 to-pink-400",
                          )}
                        />
                      ))}
                    </div>

                    {/* Availability badge */}
                    {availableSlots === maxSlots && availableSlots > 0 && (
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    {availableSlots === 0 && (
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-pink-200 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Selected Date
              </div>
            </div>
            <div className="text-gray-800 font-medium text-lg mb-2">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex space-x-0.5 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                {Array.from(
                  { length: getMaxSlotsForDay(selectedDate) },
                  (_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full border border-white shadow-sm transition-all duration-200 ${
                        i < getAvailableSlots(selectedDate, bookedSlots)
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-200"
                          : "bg-gradient-to-br from-red-300 to-pink-400 shadow-red-200"
                      }`}
                    />
                  ),
                )}
              </div>
              <span className="text-gray-700 font-medium">
                {getAvailableSlots(selectedDate, bookedSlots)} of{" "}
                {getMaxSlotsForDay(selectedDate)} slots available
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
