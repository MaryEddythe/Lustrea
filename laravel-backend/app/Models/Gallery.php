<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'image_url',
        'description',
        'featured',
        'sort_order'
    ];

    protected $casts = [
        'featured' => 'boolean',
        'sort_order' => 'integer'
    ];

    /**
     * Scope a query to only include featured images.
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to order by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    /**
     * Get all unique categories.
     */
    public static function getCategories(): array
    {
        return self::distinct('category')
                  ->orderBy('category')
                  ->pluck('category')
                  ->toArray();
    }
}
