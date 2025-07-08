<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    /**
     * Display messages for a specific appointment.
     */
    public function index(Request $request, $appointmentId): JsonResponse
    {
        $appointment = Appointment::findOrFail($appointmentId);
        
        $messages = Message::where('appointment_id', $appointmentId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'appointment' => $appointment->load('service'),
                'messages' => $messages
            ],
            'message' => 'Messages retrieved successfully'
        ]);
    }

    /**
     * Store a new message.
     */
    public function store(Request $request, $appointmentId): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($appointmentId);

            $validated = $request->validate([
                'sender_type' => 'required|in:client,admin',
                'sender_name' => 'required|string|max:255',
                'message' => 'required|string|max:1000',
            ]);

            $message = Message::create([
                'appointment_id' => $appointmentId,
                'sender_type' => $validated['sender_type'],
                'sender_name' => $validated['sender_name'],
                'message' => $validated['message'],
            ]);

            return response()->json([
                'success' => true,
                'data' => $message,
                'message' => 'Message sent successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(Message $message): JsonResponse
    {
        $message->markAsRead();

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Message marked as read'
        ]);
    }

    /**
     * Get unread messages count for admin.
     */
    public function getUnreadCount(): JsonResponse
    {
        $unreadCount = Message::fromClient()->unread()->count();

        return response()->json([
            'success' => true,
            'data' => ['unread_count' => $unreadCount],
            'message' => 'Unread count retrieved successfully'
        ]);
    }

    /**
     * Get all conversations (for admin dashboard).
     */
    public function getConversations(): JsonResponse
    {
        $conversations = Appointment::whereHas('messages')
            ->with([
                'service',
                'messages' => function($query) {
                    $query->latest()->take(1);
                }
            ])
            ->withCount(['messages as unread_messages_count' => function($query) {
                $query->fromClient()->unread();
            }])
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $conversations,
            'message' => 'Conversations retrieved successfully'
        ]);
    }

    /**
     * Mark all messages in a conversation as read.
     */
    public function markConversationAsRead($appointmentId): JsonResponse
    {
        Message::where('appointment_id', $appointmentId)
            ->fromClient()
            ->unread()
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Conversation marked as read'
        ]);
    }
}
