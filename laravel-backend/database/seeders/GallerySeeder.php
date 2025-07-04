<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gallery;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galleryItems = [
            [
                'title' => 'French Manicure',
                'category' => 'Classic',
                'image_url' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
                'description' => 'Elegant French manicure with perfect white tips',
                'featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Floral Nail Art',
                'category' => 'Nail Art',
                'image_url' => 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400',
                'description' => 'Beautiful hand-painted floral designs',
                'featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Gel Pedicure',
                'category' => 'Pedicure',
                'image_url' => 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400',
                'description' => 'Relaxing gel pedicure with vibrant colors',
                'featured' => false,
                'sort_order' => 3,
            ],
            [
                'title' => 'Geometric Design',
                'category' => 'Nail Art',
                'image_url' => 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400',
                'description' => 'Modern geometric patterns in gold and black',
                'featured' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Ombre Nails',
                'category' => 'Gel',
                'image_url' => 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400',
                'description' => 'Stunning ombre effect from pink to white',
                'featured' => false,
                'sort_order' => 5,
            ],
            [
                'title' => 'Luxury Pedicure',
                'category' => 'Pedicure',
                'image_url' => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
                'description' => 'Premium pedicure treatment with spa experience',
                'featured' => false,
                'sort_order' => 6,
            ],
            [
                'title' => 'Marble Effect',
                'category' => 'Nail Art',
                'image_url' => 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
                'description' => 'Sophisticated marble effect nail art',
                'featured' => true,
                'sort_order' => 7,
            ],
            [
                'title' => 'Classic Red',
                'category' => 'Classic',
                'image_url' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
                'description' => 'Timeless classic red manicure',
                'featured' => false,
                'sort_order' => 8,
            ],
            [
                'title' => 'Glitter Accent',
                'category' => 'Gel',
                'image_url' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
                'description' => 'Glamorous glitter accent nails',
                'featured' => false,
                'sort_order' => 9,
            ],
        ];

        foreach ($galleryItems as $item) {
            Gallery::create($item);
        }
    }
}
