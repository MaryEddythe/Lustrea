<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Classic Manicure',
                'description' => 'Traditional nail care with cuticle treatment, shaping, and polish application.',
                'duration' => 30,
                'price' => 25.00,
                'features' => ['Nail shaping', 'Cuticle care', 'Hand massage', 'Polish application'],
                'category' => 'Manicure',
                'active' => true,
            ],
            [
                'name' => 'Gel Manicure',
                'description' => 'Long-lasting gel polish that stays chip-free for up to 2 weeks.',
                'duration' => 45,
                'price' => 35.00,
                'features' => ['Nail preparation', 'Gel base coat', 'Color application', 'UV curing', 'Top coat'],
                'category' => 'Manicure',
                'active' => true,
            ],
            [
                'name' => 'Classic Pedicure',
                'description' => 'Relaxing foot treatment with exfoliation, massage, and polish.',
                'duration' => 45,
                'price' => 30.00,
                'features' => ['Foot soak', 'Exfoliation', 'Callus removal', 'Foot massage', 'Polish application'],
                'category' => 'Pedicure',
                'active' => true,
            ],
            [
                'name' => 'Gel Pedicure',
                'description' => 'Premium pedicure with long-lasting gel polish finish.',
                'duration' => 60,
                'price' => 40.00,
                'features' => ['Luxury foot soak', 'Exfoliation', 'Massage', 'Gel polish', 'Moisturizing treatment'],
                'category' => 'Pedicure',
                'active' => true,
            ],
            [
                'name' => 'Nail Art Design',
                'description' => 'Custom nail art designs created by our talented artists.',
                'duration' => 60,
                'price' => 50.00,
                'features' => ['Consultation', 'Custom design', 'Hand-painted art', 'Protective top coat'],
                'category' => 'Nail Art',
                'active' => true,
            ],
            [
                'name' => 'French Manicure',
                'description' => 'Timeless French tip design with natural or colored base.',
                'duration' => 40,
                'price' => 30.00,
                'features' => ['Nail preparation', 'Base application', 'French tip design', 'Glossy finish'],
                'category' => 'Manicure',
                'active' => true,
            ],
            [
                'name' => 'Acrylic Extensions',
                'description' => 'Durable acrylic nail extensions for length and strength.',
                'duration' => 90,
                'price' => 60.00,
                'features' => ['Nail preparation', 'Extension application', 'Shaping', 'Polish', 'Aftercare advice'],
                'category' => 'Extensions',
                'active' => true,
            ],
            [
                'name' => 'Dip Powder Manicure',
                'description' => 'Long-lasting dip powder system for strong, beautiful nails.',
                'duration' => 50,
                'price' => 45.00,
                'features' => ['Nail prep', 'Base application', 'Dip powder', 'Shaping', 'Top coat'],
                'category' => 'Manicure',
                'active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
