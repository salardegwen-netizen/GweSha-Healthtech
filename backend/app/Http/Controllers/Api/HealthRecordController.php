<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HealthRecordController extends Controller
{
    /**
     * Get all health records
     */
    public function index()
    {
        try {
            $healthRecords = HealthRecord::with([
                'patient:id,first_name,last_name,email',
            ])->select([
                'id',
                'patient_id',
                'title',
                'type',
                'date',
                'status',
                'description',
                'created_at',
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $healthRecords,
                'message' => 'Health records retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve health records',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Create a new health record
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_id' => 'required|exists:patients,id',
                'title' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'date' => 'required|date',
                'status' => 'sometimes|string',
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $healthRecord = HealthRecord::create([
                'patient_id' => $request->patient_id,
                'title' => $request->title,
                'type' => $request->type,
                'date' => $request->date,
                'status' => $request->status ?? 'active',
                'description' => $request->description,
            ]);

            $healthRecord = $healthRecord->load([
                'patient:id,first_name,last_name,email',
            ]);

            return response()->json([
                'success' => true,
                'data' => $healthRecord,
                'message' => 'Health record created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create health record',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get a specific health record
     */
    public function show($id)
    {
        try {
            $healthRecord = HealthRecord::with([
                'patient:id,first_name,last_name,email,phone',
            ])->find($id);

            if (!$healthRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Health record not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $healthRecord,
                'message' => 'Health record retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve health record',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get health records for a specific patient
     */
    public function byPatient($patientId)
    {
        try {
            $healthRecords = HealthRecord::where('patient_id', $patientId)
                ->with([
                    'patient:id,first_name,last_name,email',
                ])->select([
                    'id',
                    'patient_id',
                    'title',
                    'type',
                    'date',
                    'status',
                    'description',
                    'created_at',
                ])->get();

            return response()->json([
                'success' => true,
                'data' => $healthRecords,
                'message' => 'Patient health records retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve patient health records',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update a health record
     */
    public function update(Request $request, $id)
    {
        try {
            $healthRecord = HealthRecord::find($id);

            if (!$healthRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Health record not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'patient_id' => 'sometimes|exists:patients,id',
                'title' => 'sometimes|string|max:255',
                'type' => 'sometimes|string|max:255',
                'date' => 'sometimes|date',
                'status' => 'sometimes|string',
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $healthRecord->update($request->all());
            $healthRecord = $healthRecord->load([
                'patient:id,first_name,last_name,email',
            ]);

            return response()->json([
                'success' => true,
                'data' => $healthRecord,
                'message' => 'Health record updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update health record',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Delete a health record
     */
    public function destroy($id)
    {
        try {
            $healthRecord = HealthRecord::find($id);

            if (!$healthRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Health record not found',
                ], 404);
            }

            $healthRecord->delete();

            return response()->json([
                'success' => true,
                'message' => 'Health record deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete health record',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
