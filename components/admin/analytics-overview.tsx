import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { appointmentsData } from "@/lib/data/appointments-data"

export default function AnalyticsOverview() {
  const totalAppointments = appointmentsData.length
  const confirmedAppointments = appointmentsData.filter((a) => a.status === "confirmed").length
  const pendingAppointments = appointmentsData.filter((a) => a.status === "pending").length
  const completedAppointments = appointmentsData.filter((a) => a.status === "completed").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAppointments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{confirmedAppointments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{pendingAppointments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{completedAppointments}</div>
        </CardContent>
      </Card>
    </div>
  )
}
