"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { appointmentsData } from "@/lib/data/appointments-data";
import { weekdayTimeSlots, weekendTimeSlots } from "@/lib/data/time-slots";

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes: string;
}

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateAppointmentStatus = (id: number, status: string) => {
    setAppointments(
      appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
    );
  };

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
    setIsDialogOpen(false);
  };

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  // Group appointments by date
  const appointmentsByDate = appointments.reduce(
    (acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = {};
      }
      if (!acc[appointment.date][appointment.time]) {
        acc[appointment.date][appointment.time] = [];
      }
      acc[appointment.date][appointment.time].push(appointment);
      return acc;
    },
    {} as Record<string, Record<string, Appointment[]>>,
  );

  const getUniqueSlots = () => {
    const slots = new Set<string>();
    appointments.forEach((apt) => slots.add(apt.time));
    return Array.from(slots).sort();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 border-green-200 text-green-800";
      case "pending":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "completed":
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "cancelled":
        return "bg-red-100 border-red-200 text-red-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const uniqueDates = Array.from(
    new Set(appointments.map((apt) => apt.date)),
  ).sort();
  const uniqueSlots = getUniqueSlots();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Appointments Kanban Board</CardTitle>
          <CardDescription>
            View and manage appointments organized by date and time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div
              className="grid grid-flow-col auto-cols-max gap-6 pb-4"
              style={{ width: "max-content" }}
            >
              {uniqueDates.map((date) => (
                <div key={date} className="min-w-80">
                  <div className="mb-4 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                    <h3 className="font-semibold text-lg text-center">
                      {formatDate(date)}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">{date}</p>
                  </div>

                  <div className="space-y-4">
                    {uniqueSlots.map((slot) => {
                      const slotAppointments =
                        appointmentsByDate[date]?.[slot] || [];

                      return (
                        <div key={slot} className="min-h-32">
                          <div className="mb-2 p-2 bg-gray-50 rounded border-l-4 border-pink-300">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-sm">
                                {slot}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {slotAppointments.length}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {slotAppointments.length === 0 ? (
                              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                                <p className="text-sm text-gray-400">
                                  No appointments
                                </p>
                              </div>
                            ) : (
                              slotAppointments.map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${getStatusColor(appointment.status)}`}
                                  onClick={() =>
                                    openAppointmentDetails(appointment)
                                  }
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-sm">
                                        {appointment.name}
                                      </h4>
                                      <Badge
                                        variant={
                                          appointment.status === "confirmed"
                                            ? "default"
                                            : appointment.status === "pending"
                                              ? "secondary"
                                              : appointment.status ===
                                                  "completed"
                                                ? "outline"
                                                : "destructive"
                                        }
                                        className="text-xs"
                                      >
                                        {appointment.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs font-medium text-gray-700">
                                      {appointment.service}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                      <Phone className="w-3 h-3" />
                                      <span className="text-xs">
                                        {appointment.phone}
                                      </span>
                                    </div>
                                    {appointment.notes && (
                                      <p className="text-xs text-gray-600 italic truncate">
                                        {appointment.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information for this appointment
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedAppointment.name}</p>
                    <p className="text-sm text-gray-500">Client Name</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedAppointment.email}</p>
                    <p className="text-sm text-gray-500">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedAppointment.phone}</p>
                    <p className="text-sm text-gray-500">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedAppointment.service}</p>
                    <p className="text-sm text-gray-500">Service</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">
                      {formatDate(selectedAppointment.date)} -{" "}
                      {selectedAppointment.time}
                    </p>
                    <p className="text-sm text-gray-500">Date & Time</p>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedAppointment.notes}</p>
                      <p className="text-sm text-gray-500">Special Notes</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedAppointment.status === "confirmed"
                          ? "bg-green-500"
                          : selectedAppointment.status === "pending"
                            ? "bg-yellow-500"
                            : selectedAppointment.status === "completed"
                              ? "bg-blue-500"
                              : "bg-red-500"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {selectedAppointment.status}
                    </p>
                    <p className="text-sm text-gray-500">Status</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Select
                  value={selectedAppointment.status}
                  onValueChange={(value) =>
                    updateAppointmentStatus(selectedAppointment.id, value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  onClick={() => deleteAppointment(selectedAppointment.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
