<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Message;
use App\Models\Appointment;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get some existing appointments
        $appointments = Appointment::take(3)->get();

        if ($appointments->count() > 0) {
            foreach ($appointments as $appointment) {
                // Create a conversation with multiple messages
                $messages = [
                    [
                        'appointment_id' => $appointment->id,
                        'sender_type' => 'client',
                        'sender_name' => $appointment->name,
                        'message' => 'Hi! I just booked an appointment. Can you confirm the details?',
                        'is_read' => true,
                        'created_at' => now()->subHours(2),
                    ],
                    [
                        'appointment_id' => $appointment->id,
                        'sender_type' => 'admin',
                        'sender_name' => 'Admin',
                        'message' => 'Hello! Yes, I can see your appointment for ' . $appointment->service->name . ' on ' . $appointment->appointment_date->format('M d, Y') . '. Everything looks good!',
                        'is_read' => false,
                        'created_at' => now()->subHours(1),
                    ],
                    [
                        'appointment_id' => $appointment->id,
                        'sender_type' => 'client',
                        'sender_name' => $appointment->name,
                        'message' => 'Perfect! Do I need to bring anything special?',
                        'is_read' => false,
                        'created_at' => now()->subMinutes(30),
                    ],
                ];

                foreach ($messages as $messageData) {
                    Message::create($messageData);
                }
            }
        }

        // Create some standalone messages for other appointments
        $otherAppointments = Appointment::skip(3)->take(2)->get();
        
        foreach ($otherAppointments as $appointment) {
            Message::create([
                'appointment_id' => $appointment->id,
                'sender_type' => 'client',
                'sender_name' => $appointment->name,
                'message' => 'I uploaded a design reference image. Can you let me know if this style is possible?',
                'is_read' => false,
                'created_at' => now()->subHours(3),
            ]);
        }
    }
}
