<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class GalleryController extends Controller
{
    /**
     * Display a listing of gallery items.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Gallery::query();
        
        // Filter by category
        if ($request->has('category') && $request->category !== 'All') {
            $query->byCategory($request->category);
        }
        
        // Filter by featured
        if ($request->has('featured') && $request->boolean('featured')) {
            $query->featured();
        }
        
        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        $galleries = $query->ordered()->get();
        
        return response()->json([
            'success' => true,
            'data' => $galleries,
            'message' => 'Gallery items retrieved successfully'
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'image_url' => 'required|url|max:500',
                'description' => 'nullable|string|max:1000',
                'featured' => 'boolean',
                'sort_order' => 'integer|min:0'
            ]);

            // Set default sort order if not provided
            if (!isset($validated['sort_order'])) {
                $validated['sort_order'] = Gallery::max('sort_order') + 1;
            }

            $gallery = Gallery::create($validated);

            return response()->json([
                'success' => true,
                'data' => $gallery,
                'message' => 'Gallery item created successfully'
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
     * Display the specified gallery item.
     */
    public function show(Gallery $gallery): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $gallery,
            'message' => 'Gallery item retrieved successfully'
        ]);
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request, Gallery $gallery): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|max:100',
                'image_url' => 'sometimes|url|max:500',
                'description' => 'nullable|string|max:1000',
                'featured' => 'boolean',
                'sort_order' => 'integer|min:0'
            ]);

            $gallery->update($validated);

            return response()->json([
                'success' => true,
                'data' => $gallery->fresh(),
                'message' => 'Gallery item updated successfully'
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
     * Remove the specified gallery item.
     */
    public function destroy(Gallery $gallery): JsonResponse
    {
        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery item deleted successfully'
        ]);
    }

    /**
     * Get all gallery categories.
     */
    public function getCategories(): JsonResponse
    {
        $categories = Gallery::getCategories();

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }

    /**
     * Get featured gallery items.
     */
    public function getFeatured(): JsonResponse
    {
        $featured = Gallery::featured()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $featured,
            'message' => 'Featured gallery items retrieved successfully'
        ]);
    }

    /**
     * Update sort order of gallery items.
     */
    public function updateSortOrder(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'items' => 'required|array',
                'items.*.id' => 'required|exists:galleries,id',
                'items.*.sort_order' => 'required|integer|min:0'
            ]);

            foreach ($validated['items'] as $item) {
                Gallery::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Sort order updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }
}
