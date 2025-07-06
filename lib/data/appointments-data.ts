// Mutable appointments array for dynamic booking
export let appointmentsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "(555) 123-4567",
    service: "Gel Manicure",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "09:00 AM - 11:00 AM",
    status: "confirmed",
    notes: "First time client",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@email.com",
    phone: "(555) 987-6543",
    service: "Classic Pedicure",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    time: "01:00 PM - 03:00 PM",
    status: "pending",
    notes: "Allergic to certain products",
  },
  {
    id: 3,
    name: "Jessica Wilson",
    email: "jessica@email.com",
    phone: "(555) 456-7890",
    service: "Nail Art Design",
    date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], // Day after tomorrow
    time: "10:00 AM - 12:00 PM",
    status: "completed",
    notes: "Wants floral design",
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael@email.com",
    phone: "(555) 234-5678",
    service: "Classic Manicure",
    date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], // Day after tomorrow
    time: "12:00 PM - 02:00 PM",
    status: "confirmed",
    notes: "Regular customer",
  },
  {
    id: 5,
    name: "Amanda White",
    email: "amanda@email.com",
    phone: "(555) 345-6789",
    service: "Spa Pedicure",
    date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], // Day after tomorrow
    time: "02:00 PM - 04:00 PM",
    status: "confirmed",
    notes: "Weekend appointment",
  },
];

// Function to add a new appointment
export const addAppointment = (appointment: {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: string;
  notes: string;
}) => {
  const newAppointment = {
    id: appointmentsData.length + 1,
    ...appointment,
  };
  appointmentsData.push(newAppointment);
  return newAppointment;
};

// Function to get appointments for a specific date
export const getAppointmentsForDate = (date: string) => {
  return appointmentsData.filter((appointment) => appointment.date === date);
};

// Function to check if a specific time slot is booked
export const isTimeSlotBooked = (date: string, time: string) => {
  return appointmentsData.some(
    (appointment) => appointment.date === date && appointment.time === time,
  );
};
