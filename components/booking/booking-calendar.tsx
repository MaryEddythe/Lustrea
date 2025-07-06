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
import { CalendarDays, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeSlots } from "@/lib/data/time-slots";
import { appointmentsData } from "@/lib/data/appointments-data";

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
  return appointmentsData
    .filter((appointment) => appointment.date === dateString)
    .map((appointment) => appointment.time);
};

// Get available time slots for a specific date
const getAvailableTimeSlots = (date: Date): string[] => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return [];
  }
  const bookedSlots = getBookedSlotsForDate(date);
  return timeSlots.filter((slot) => !bookedSlots.includes(slot));
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

  // Disable past dates and dates too far in future
  const disabledMatcher = React.useCallback((date: Date) => {
    return isPastDate(date) || isTooFarInFuture(date);
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

      if (!isPastDate(date) && !isTooFarInFuture(date)) {
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Appointment Date</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Availability Guide</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Available slot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 opacity-50" />
                  <span>Booked slot</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Choose a date for your appointment. Dots indicate available slots.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            available: "available",
            full: "full",
          }}
          className="rounded-md border"
        />
        {selectedDate && (
          <div className="mt-4">
            <Badge variant="outline" className="flex gap-2 items-center">
              <CalendarDays className="h-4 w-4" />
              Available slots: {getAvailableSlots(selectedDate)}
            </Badge>
          </div>
        )}
      </CardContent>

      {/* Time slot selection sheet */}
      <Sheet open={slotSheetOpen} onOpenChange={setSlotSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Choose a Time Slot
            </SheetTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handleSlotSelect(slot)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {slot}
                </Button>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">
                  No available time slots for this date
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Please select a different date
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
