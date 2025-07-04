<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_time',
        'end_time',
        'active',
        'days_of_week'
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'active' => 'boolean',
        'days_of_week' => 'array'
    ];

    /**
     * Scope a query to only include active time slots.
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope a query to filter by day of week.
     */
    public function scopeForDay($query, $dayOfWeek)
    {
        return $query->whereJsonContains('days_of_week', $dayOfWeek);
    }

    /**
     * Get formatted time range.
     */
    public function getFormattedTimeAttribute(): string
    {
        return Carbon::parse($this->start_time)->format('g:i A') . ' - ' . 
               Carbon::parse($this->end_time)->format('g:i A');
    }

    /**
     * Check if time slot is available for a specific date.
     */
    public function isAvailableForDate($date): bool
    {
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;
        
        if ($this->days_of_week && !in_array($dayOfWeek, $this->days_of_week)) {
            return false;
        }

        // Check if there's already an appointment at this time
        return !Appointment::where('appointment_date', $date)
                          ->where('appointment_time', $this->start_time)
                          ->whereNotIn('status', ['cancelled'])
                          ->exists();
    }
}
