<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            ServiceSeeder::class,
            GallerySeeder::class,
            TimeSlotSeeder::class,
            AppointmentSeeder::class, // Uncommented for demo appointments
            MessageSeeder::class,
        ]);
    }
}
