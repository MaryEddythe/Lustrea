import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data since we're using the local data system
    // In a real implementation, this would connect to your Laravel backend

    const mockUnreadCount = 3;

    return NextResponse.json({
      success: true,
      data: { unread_count: mockUnreadCount },
      message: "Unread count retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch unread count",
      },
      { status: 500 },
    );
  }
}
