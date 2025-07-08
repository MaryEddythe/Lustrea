<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Display a listing of appointments (Admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with('service');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->withStatus($request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('appointment_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('appointment_date', '<=', $request->date_to);
        }

        // Filter by service
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        // Search by customer name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
                             ->orderBy('appointment_time', 'desc')
                             ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $appointments,
            'message' => 'Appointments retrieved successfully'
        ]);
    }

    /**
     * Store a newly created appointment.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'service_id' => 'required|exists:services,id',
                'appointment_date' => 'required|date|after_or_equal:today',
                'appointment_time' => 'required|date_format:H:i',
                'notes' => 'nullable|string|max:1000',
                'design_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
            ]);

            // Handle design image upload
            if ($request->hasFile('design_image')) {
                $image = $request->file('design_image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/design_images'), $imageName);
                $validated['design_image'] = 'uploads/design_images/' . $imageName;
            }

            // Check if the service is active
            $service = Service::findOrFail($validated['service_id']);
            if (!$service->active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected service is not available'
                ], 422);
            }

            // Check if slot is available
            $existingAppointment = Appointment::where('appointment_date', $validated['appointment_date'])
                ->where('appointment_time', $validated['appointment_time'])
                ->whereNotIn('status', ['cancelled'])
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Time slot is not available'
                ], 422);
            }

            // Check if appointment is within business hours
            $appointmentTime = Carbon::parse($validated['appointment_time']);
            $businessStart = Carbon::parse('09:00');
            $businessEnd = Carbon::parse('18:00');

            if ($appointmentTime->lt($businessStart) || $appointmentTime->gt($businessEnd)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment time must be between 9:00 AM and 6:00 PM'
                ], 422);
            }

            $appointment = Appointment::create($validated);
            $appointment->load('service');

            // Here you could send confirmation email/SMS
            // $this->sendConfirmationNotification($appointment);

            return response()->json([
                'success' => true,
                'data' => $appointment,
                'message' => 'Appointment booked successfully'
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
     * Display the specified appointment.
     */
    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load('service');

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Appointment retrieved successfully'
        ]);
    }

    /**
     * Update the specified appointment (Admin only).
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|max:255',
                'phone' => 'sometimes|string|max:20',
                'service_id' => 'sometimes|exists:services,id',
                'appointment_date' => 'sometimes|date|after_or_equal:today',
                'appointment_time' => 'sometimes|date_format:H:i',
                'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
                'notes' => 'nullable|string|max:1000',
            ]);

            // If updating date/time, check availability
            if (isset($validated['appointment_date']) || isset($validated['appointment_time'])) {
                $date = $validated['appointment_date'] ?? $appointment->appointment_date->format('Y-m-d');
                $time = $validated['appointment_time'] ?? $appointment->appointment_time;

                $existingAppointment = Appointment::where('appointment_date', $date)
                    ->where('appointment_time', $time)
                    ->where('id', '!=', $appointment->id)
                    ->whereNotIn('status', ['cancelled'])
                    ->first();

                if ($existingAppointment) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Time slot is not available'
                    ], 422);
                }
            }

            $appointment->update($validated);
            $appointment->load('service');

            return response()->json([
                'success' => true,
                'data' => $appointment,
                'message' => 'Appointment updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Remove the specified appointment.
     */
    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }

    /**
     * Get available time slots for a specific date.
     */
    public function getAvailableSlots(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'service_id' => 'nullable|exists:services,id'
        ]);

        $date = $request->date;
        $serviceId = $request->service_id;

        // Get booked slots for the date
        $bookedSlots = Appointment::forDate($date)
            ->whereNotIn('status', ['cancelled'])
            ->pluck('appointment_time')
            ->map(function ($time) {
                return Carbon::parse($time)->format('H:i');
            })
            ->toArray();

        // Define all possible time slots (9 AM to 6 PM, 30-minute intervals)
        $allSlots = [];
        $start = Carbon::parse('09:00');
        $end = Carbon::parse('18:00');

        while ($start->lt($end)) {
            $allSlots[] = $start->format('H:i');
            $start->addMinutes(30);
        }

        // Remove booked slots
        $availableSlots = array_diff($allSlots, $bookedSlots);

        // If it's today, remove past time slots
        if (Carbon::parse($date)->isToday()) {
            $now = Carbon::now();
            $availableSlots = array_filter($availableSlots, function($slot) use ($now) {
                return Carbon::parse($slot)->gt($now->addHour()); // Need at least 1 hour notice
            });
        }

        return response()->json([
            'success' => true,
            'data' => array_values($availableSlots),
            'message' => 'Available slots retrieved successfully'
        ]);
    }

    /**
     * Get appointment statistics (Admin only).
     */
    public function statistics(): JsonResponse
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        $stats = [
            'total_appointments' => Appointment::count(),
            'today_appointments' => Appointment::forDate($today)->count(),
            'week_appointments' => Appointment::where('appointment_date', '>=', $thisWeek)->count(),
            'month_appointments' => Appointment::where('appointment_date', '>=', $thisMonth)->count(),
            'pending_appointments' => Appointment::withStatus('pending')->count(),
            'confirmed_appointments' => Appointment::withStatus('confirmed')->count(),
            'completed_appointments' => Appointment::withStatus('completed')->count(),
            'cancelled_appointments' => Appointment::withStatus('cancelled')->count(),
            'upcoming_appointments' => Appointment::upcoming()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Statistics retrieved successfully'
        ]);
    }
}
