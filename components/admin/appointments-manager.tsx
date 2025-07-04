"use client"

import { useState } from "react"
import { Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { appointmentsData } from "@/lib/data/appointments-data"

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState(appointmentsData)

  const updateAppointmentStatus = (id: number, status: string) => {
    setAppointments(appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)))
  }

  const deleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Appointments</CardTitle>
        <CardDescription>View and manage all customer appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium">{appointment.name}</h3>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "pending"
                            ? "secondary"
                            : appointment.status === "completed"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{appointment.email}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {appointment.service} - {appointment.date} at {appointment.time}
                      </span>
                    </p>
                    {appointment.notes && <p className="text-gray-500 italic">Notes: {appointment.notes}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Select
                    value={appointment.status}
                    onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" size="sm" onClick={() => deleteAppointment(appointment.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
