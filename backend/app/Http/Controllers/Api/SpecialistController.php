<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;

class SpecialistController extends Controller
{
    /**
     * Get all specialists (doctors)
     */
    public function index()
    {
        try {
            $specialists = StaffMember::where('role', 'doctor')
                ->select([
                    'id',
                    'name',
                    'email',
                    'phone',
                    'title',
                    'department',
                    'status',
                    'profile_image',
                    'created_at',
                ])
                ->get()
                ->map(function ($specialist) {
                    // Split name into first and last name
                    $nameParts = explode(' ', $specialist->name, 2);

                    // Generate full URL for profile image
                    $imageUrl = null;
                    if ($specialist->profile_image) {
                        $imageUrl = asset($specialist->profile_image);
                    }

                    return [
                        'id' => $specialist->id,
                        'first_name' => $nameParts[0] ?? '',
                        'last_name' => $nameParts[1] ?? '',
                        'email' => $specialist->email,
                        'phone' => $specialist->phone,
                        'specialization' => $specialist->title,
                        'department' => $specialist->department,
                        'status' => $specialist->status,
                        'image_url' => $imageUrl,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $specialists,
                'message' => 'Specialists retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve specialists',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
