<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vitals;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VitalsController extends Controller
{
    /**
     * Get all vitals records
     */
    public function index()
    {
        try {
            $vitals = Vitals::with([
                'patient:id,first_name,last_name,email',
            ])->select([
                'id',
                'patient_id',
                'heart_rate',
                'sleep_hours',
                'blood_pressure_systolic',
                'blood_pressure_diastolic',
                'temperature',
                'created_at',
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $vitals,
                'message' => 'Vitals retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve vitals',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Record new vitals
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_id' => 'required|exists:patients,id',
                'heart_rate' => 'nullable|integer|min:30|max:200',
                'sleep_hours' => 'nullable|numeric|min:0|max:24',
                'blood_pressure_systolic' => 'nullable|integer|min:60|max:200',
                'blood_pressure_diastolic' => 'nullable|integer|min:30|max:130',
                'temperature' => 'nullable|numeric|min:35|max:42',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $vitals = Vitals::create([
                'patient_id' => $request->patient_id,
                'heart_rate' => $request->heart_rate,
                'sleep_hours' => $request->sleep_hours,
                'blood_pressure_systolic' => $request->blood_pressure_systolic,
                'blood_pressure_diastolic' => $request->blood_pressure_diastolic,
                'temperature' => $request->temperature,
            ]);

            $vitals = $vitals->load([
                'patient:id,first_name,last_name,email',
            ]);

            return response()->json([
                'success' => true,
                'data' => $vitals,
                'message' => 'Vitals recorded successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record vitals',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get current vitals for authenticated patient
     */
    public function getCurrent(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            // Get the most recent vitals for the patient
            $vitals = Vitals::where('patient_id', $user->id)
                ->with([
                    'patient:id,first_name,last_name,email',
                ])
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$vitals) {
                return response()->json([
                    'success' => false,
                    'message' => 'No vitals found for this patient',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $vitals,
                'message' => 'Current vitals retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve current vitals',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get vitals history for a patient
     */
    public function getHistory($patientId)
    {
        try {
            $vitals = Vitals::where('patient_id', $patientId)
                ->with([
                    'patient:id,first_name,last_name,email',
                ])
                ->orderBy('created_at', 'desc')
                ->select([
                    'id',
                    'patient_id',
                    'heart_rate',
                    'sleep_hours',
                    'blood_pressure_systolic',
                    'blood_pressure_diastolic',
                    'temperature',
                    'created_at',
                ])
                ->get();

            if ($vitals->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No vitals history found for this patient',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $vitals,
                'message' => 'Vitals history retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve vitals history',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
