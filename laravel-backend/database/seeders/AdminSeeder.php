<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Admin User',
            'email' => 'admin@luxenails.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'active' => true,
        ]);

        Admin::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@luxenails.com',
            'password' => Hash::make('superadmin123'),
            'role' => 'super_admin',
            'active' => true,
        ]);
    }
}
