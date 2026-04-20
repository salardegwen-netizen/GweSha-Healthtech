<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PatientController extends Controller
{
    /**
     * Get current authenticated patient
     */
    public function getMe()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated',
                ], 401);
            }

            // Look up patient by email (matching with current user)
            $patient = Patient::where('email', $user->email)
                ->with(['appointments', 'invoices', 'healthRecords', 'vitals'])
                ->first();

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $patient,
                'message' => 'Patient retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve patient',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get all patients
     */
    public function index()
    {
        try {
            $patients = Patient::with([
                'appointments',
                'invoices',
                'healthRecords',
                'vitals',
                'scheduleBlocks',
            ])->select([
                'id',
                'first_name',
                'last_name',
                'email',
                'phone',
                'last_visit',
                'next_appointment',
                'balance',
                'status',
            ])->paginate(15);

            return response()->json([
                'success' => true,
                'data' => $patients->items(),
                'pagination' => [
                    'current_page' => $patients->currentPage(),
                    'total' => $patients->total(),
                    'per_page' => $patients->perPage(),
                    'last_page' => $patients->lastPage(),
                ],
                'message' => 'Patients retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve patients',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Create a new patient
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:patients,email',
                'phone' => 'required|string|max:20',
                'balance' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $patient = Patient::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'balance' => $request->balance ?? 0,
                'status' => 'active',
            ]);

            return response()->json([
                'success' => true,
                'data' => $patient,
                'message' => 'Patient created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create patient',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get a specific patient
     */
    public function show($id)
    {
        try {
            $patient = Patient::with([
                'appointments',
                'invoices',
                'healthRecords',
                'vitals',
                'scheduleBlocks',
            ])->find($id);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $patient,
                'message' => 'Patient retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve patient',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update a patient
     */
    public function update(Request $request, $id)
    {
        try {
            $patient = Patient::find($id);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:patients,email,' . $id,
                'phone' => 'sometimes|string|max:20',
                'balance' => 'sometimes|numeric|min:0',
                'status' => 'sometimes|string',
                'last_visit' => 'sometimes|date',
                'next_appointment' => 'sometimes|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $patient->update($request->all());

            return response()->json([
                'success' => true,
                'data' => $patient,
                'message' => 'Patient updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update patient',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Delete a patient
     */
    public function destroy($id)
    {
        try {
            $patient = Patient::find($id);

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Patient not found',
                ], 404);
            }

            $patient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Patient deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete patient',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
