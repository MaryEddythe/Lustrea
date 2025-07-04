<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ServiceController extends Controller
{
    /**
     * Display a listing of active services.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Service::active();

        // Filter by category if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $services = $query->orderBy('category')
                         ->orderBy('name')
                         ->get();

        return response()->json([
            'success' => true,
            'data' => $services,
            'message' => 'Services retrieved successfully'
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:services,name',
                'description' => 'required|string|max:1000',
                'duration' => 'required|integer|min:15|max:480', // 15 minutes to 8 hours
                'price' => 'required|numeric|min:0|max:9999.99',
                'features' => 'nullable|array',
                'features.*' => 'string|max:255',
                'category' => 'required|string|max:100',
                'image_url' => 'nullable|url|max:500',
                'active' => 'boolean'
            ]);

            $service = Service::create($validated);

            return response()->json([
                'success' => true,
                'data' => $service,
                'message' => 'Service created successfully'
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
     * Display the specified service.
     */
    public function show(Service $service): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $service->load('appointments'),
            'message' => 'Service retrieved successfully'
        ]);
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, Service $service): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|unique:services,name,' . $service->id,
                'description' => 'sometimes|string|max:1000',
                'duration' => 'sometimes|integer|min:15|max:480',
                'price' => 'sometimes|numeric|min:0|max:9999.99',
                'features' => 'nullable|array',
                'features.*' => 'string|max:255',
                'category' => 'sometimes|string|max:100',
                'image_url' => 'nullable|url|max:500',
                'active' => 'boolean'
            ]);

            $service->update($validated);

            return response()->json([
                'success' => true,
                'data' => $service->fresh(),
                'message' => 'Service updated successfully'
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
     * Remove the specified service.
     */
    public function destroy(Service $service): JsonResponse
    {
        // Check if service has any appointments
        if ($service->appointments()->whereNotIn('status', ['cancelled', 'completed'])->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete service with active appointments'
            ], 422);
        }

        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }

    /**
     * Get service categories.
     */
    public function categories(): JsonResponse
    {
        $categories = Service::active()
                           ->distinct('category')
                           ->orderBy('category')
                           ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }
}
