<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'sender_type',
        'sender_name',
        'message',
        'is_read'
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    /**
     * Get the appointment that owns the message.
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Scope a query to only include messages from clients.
     */
    public function scopeFromClient($query)
    {
        return $query->where('sender_type', 'client');
    }

    /**
     * Scope a query to only include messages from admin.
     */
    public function scopeFromAdmin($query)
    {
        return $query->where('sender_type', 'admin');
    }

    /**
     * Scope a query to only include unread messages.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Check if message is from client.
     */
    public function isFromClient(): bool
    {
        return $this->sender_type === 'client';
    }

    /**
     * Check if message is from admin.
     */
    public function isFromAdmin(): bool
    {
        return $this->sender_type === 'admin';
    }
}
