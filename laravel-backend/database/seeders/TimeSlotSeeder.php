<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimeSlot;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeSlots = [
            ['start_time' => '09:00', 'end_time' => '09:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '09:30', 'end_time' => '10:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '10:00', 'end_time' => '10:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '10:30', 'end_time' => '11:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '11:00', 'end_time' => '11:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '11:30', 'end_time' => '12:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '12:00', 'end_time' => '12:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '12:30', 'end_time' => '13:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '13:00', 'end_time' => '13:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '13:30', 'end_time' => '14:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '14:00', 'end_time' => '14:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '14:30', 'end_time' => '15:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '15:00', 'end_time' => '15:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '15:30', 'end_time' => '16:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '16:00', 'end_time' => '16:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '16:30', 'end_time' => '17:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '17:00', 'end_time' => '17:30', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
            ['start_time' => '17:30', 'end_time' => '18:00', 'days_of_week' => [1,2,3,4,5,6], 'active' => true],
        ];

        foreach ($timeSlots as $slot) {
            TimeSlot::create($slot);
        }
    }
}
