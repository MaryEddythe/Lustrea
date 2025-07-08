import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data since we're using the local data system
    // In a real implementation, this would connect to your Laravel backend

    const mockConversations = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@email.com",
        service: {
          name: "Gel Manicure",
        },
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: "09:00",
        messages: [
          {
            id: 1,
            message:
              "Hi! I just booked an appointment. Can you confirm the details?",
            sender_type: "client",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
        unread_messages_count: 1,
      },
      {
        id: 2,
        name: "Emily Davis",
        email: "emily@email.com",
        service: {
          name: "Classic Pedicure",
        },
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: "13:00",
        messages: [
          {
            id: 2,
            message:
              "I uploaded a design reference. Can you check if this style is possible?",
            sender_type: "client",
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
        unread_messages_count: 0,
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockConversations,
      message: "Conversations retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch conversations",
      },
      { status: 500 },
    );
  }
}
