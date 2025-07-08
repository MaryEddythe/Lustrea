import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { appointmentId: string } },
) {
  try {
    const appointmentId = params.appointmentId;

    // Mock appointment and messages data
    const mockAppointment = {
      id: parseInt(appointmentId),
      name: "Sarah Johnson",
      email: "sarah@email.com",
      service: {
        name: "Gel Manicure",
      },
      appointment_date: new Date().toISOString().split("T")[0],
      appointment_time: "09:00",
    };

    const mockMessages = [
      {
        id: 1,
        sender_type: "client",
        sender_name: "Sarah Johnson",
        message:
          "Hi! I just booked an appointment. Can you confirm the details?",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        is_read: true,
      },
      {
        id: 2,
        sender_type: "admin",
        sender_name: "Admin",
        message:
          "Hello! Yes, I can see your appointment. Everything looks good!",
        created_at: new Date(Date.now() - 1800000).toISOString(),
        is_read: false,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        appointment: mockAppointment,
        messages: mockMessages,
      },
      message: "Messages retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { appointmentId: string } },
) {
  try {
    const appointmentId = params.appointmentId;
    const body = await request.json();

    // Mock creating a new message
    const newMessage = {
      id: Date.now(), // Simple ID generation for mock
      sender_type: body.sender_type,
      sender_name: body.sender_name,
      message: body.message,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 },
    );
  }
}
