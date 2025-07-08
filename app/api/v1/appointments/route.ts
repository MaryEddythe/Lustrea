import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form data
    const appointmentData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      service_id: formData.get("service_id") as string,
      appointment_date: formData.get("appointment_date") as string,
      appointment_time: formData.get("appointment_time") as string,
      notes: formData.get("notes") as string,
    };

    // Handle design image if uploaded
    const designImage = formData.get("design_image") as File | null;
    let imagePath = null;

    if (designImage && designImage.size > 0) {
      // In a real implementation, you would save the file
      // For now, we'll just simulate it
      imagePath = `/uploads/design_images/${Date.now()}_${designImage.name}`;
      console.log("Design image uploaded:", designImage.name);
    }

    // Mock appointment creation
    const newAppointment = {
      id: Date.now(), // Simple ID generation for mock
      ...appointmentData,
      design_image: imagePath,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create appointment",
      },
      { status: 500 },
    );
  }
}
