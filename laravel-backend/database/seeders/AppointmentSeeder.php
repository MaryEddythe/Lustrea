<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Service;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = Service::all();
        
        if ($services->isEmpty()) {
            $this->command->warn('No services found. Please run ServiceSeeder first.');
            return;
        }

        $appointments = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@email.com',
                'phone' => '(555) 123-4567',
                'service_id' => $services->where('name', 'Gel Manicure')->first()->id,
                'appointment_date' => Carbon::today()->addDays(1),
                'appointment_time' => '10:00',
                'status' => 'confirmed',
                'notes' => 'First time client, prefers light colors',
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@email.com',
                'phone' => '(555) 987-6543',
                'service_id' => $services->where('name', 'Classic Pedicure')->first()->id,
                'appointment_date' => Carbon::today()->addDays(1),
                'appointment_time' => '14:30',
                'status' => 'pending',
                'notes' => 'Allergic to certain nail products, please check ingredients',
            ],
            [
                'name' => 'Jessica Wilson',
                'email' => 'jessica.wilson@email.com',
                'phone' => '(555) 456-7890',
                'service_id' => $services->where('name', 'Nail Art Design')->first()->id,
                'appointment_date' => Carbon::today()->addDays(2),
                'appointment_time' => '11:00',
                'status' => 'confirmed',
                'notes' => 'Wants floral design similar to Instagram post shared',
            ],
            [
                'name' => 'Amanda Brown',
                'email' => 'amanda.brown@email.com',
                'phone' => '(555) 321-0987',
                'service_id' => $services->where('name', 'French Manicure')->first()->id,
                'appointment_date' => Carbon::today()->addDays(3),
                'appointment_time' => '15:00',
                'status' => 'pending',
                'notes' => 'Wedding next week, needs classic look',
            ],
            [
                'name' => 'Lisa Garcia',
                'email' => 'lisa.garcia@email.com',
                'phone' => '(555) 654-3210',
                'service_id' => $services->where('name', 'Gel Pedicure')->first()->id,
                'appointment_date' => Carbon::yesterday(),
                'appointment_time' => '13:00',
                'status' => 'completed',
                'notes' => 'Regular client, loves bright colors',
            ],
        ];

        foreach ($appointments as $appointment) {
            Appointment::create($appointment);
        }
    }
}
