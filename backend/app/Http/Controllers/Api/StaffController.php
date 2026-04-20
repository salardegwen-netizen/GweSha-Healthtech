<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StaffMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    /**
     * Get all staff members
     */
    public function index()
    {
        try {
            $staff = StaffMember::select([
                'id',
                'name',
                'email',
                'phone',
                'role',
                'department',
                'status',
                'title',
                'profile_image',
                'created_at',
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $staff,
                'message' => 'Staff members retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve staff members',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Create a new staff member
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:staff_members,email',
                'phone' => 'required|string|max:20',
                'role' => 'required|string|in:doctor,nurse,receptionist,admin',
                'department' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'status' => 'sometimes|string|in:active,inactive,on_leave',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $imagePath = null;
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('staff-images', $filename, 'public');
                $imagePath = 'storage/staff-images/' . $filename;
            }

            $staff = StaffMember::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => $request->role,
                'department' => $request->department,
                'title' => $request->title,
                'status' => $request->status ?? 'active',
                'profile_image' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'data' => $staff,
                'message' => 'Staff member created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create staff member',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get a specific staff member
     */
    public function show($id)
    {
        try {
            $staff = StaffMember::with([
                'appointments',
                'scheduleBlocks',
            ])->find($id);

            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staff member not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $staff,
                'message' => 'Staff member retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve staff member',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update a staff member
     */
    public function update(Request $request, $id)
    {
        try {
            $staff = StaffMember::find($id);

            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staff member not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:staff_members,email,' . $id,
                'phone' => 'sometimes|string|max:20',
                'role' => 'sometimes|string|in:doctor,nurse,receptionist,admin',
                'department' => 'sometimes|string|max:255',
                'title' => 'sometimes|string|max:255',
                'status' => 'sometimes|string|in:active,inactive,on_leave',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $staff->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $staff,
                'message' => 'Staff member updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update staff member',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update staff member status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $staff = StaffMember::find($id);

            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staff member not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:active,inactive,on_leave',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $staff->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'data' => $staff,
                'message' => 'Staff member status updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update staff member status',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Delete a staff member
     */
    public function destroy($id)
    {
        try {
            $staff = StaffMember::find($id);

            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staff member not found',
                ], 404);
            }

            $staff->delete();

            return response()->json([
                'success' => true,
                'message' => 'Staff member deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete staff member',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
