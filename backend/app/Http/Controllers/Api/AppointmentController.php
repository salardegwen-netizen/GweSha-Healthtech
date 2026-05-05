<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Get all appointments
     */
    public function index()
    {
        try {
            $appointments = Appointment::with([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ])->orderBy('date_time', 'asc')->get();

            return response()->json([
                'success' => true,
                'data' => $appointments,
                'message' => 'Appointments retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve appointments',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Create a new appointment
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_id' => 'required|exists:patients,id',
                'doctor_id' => 'required|exists:staff_members,id',
                'date_time' => 'required|date_format:Y-m-d H:i:s',
                'procedure' => 'required|string|max:255',
                'length' => 'required|integer|min:15',
                'status' => 'sometimes|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $appointment = Appointment::create([
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'date_time' => $request->date_time,
                'procedure' => $request->procedure,
                'length' => $request->length,
                'status' => $request->status ?? 'scheduled',
            ]);

            $appointment = $appointment->load([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ]);

            // Create notification for the patient
            try {
                if ($appointment->patient) {
                    $user = User::where('email', $appointment->patient->email)->first();
                    if ($user) {
                        Notification::create([
                            'user_id' => $user->id,
                            'type' => 'appointment',
                            'title' => 'Appointment Booked',
                            'message' => "Your appointment for {$appointment->procedure} has been scheduled.",
                            'icon' => 'calendar_today',
                            'color' => 'bg-blue-50 text-blue-700',
                        ]);
                    }
                }

                // Create notifications for all admins
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'type' => 'appointment',
                        'title' => 'New Booking',
                        'message' => "{$appointment->patient->first_name} {$appointment->patient->last_name} has booked an appointment for {$appointment->procedure}.",
                        'icon' => 'add_task',
                        'color' => 'bg-emerald-50 text-emerald-700',
                    ]);
                }
            } catch (\Exception $e) {
                // Log notification errors but don't fail the appointment creation
                \Log::error("Failed to create notifications for appointment: " . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'data' => $appointment,
                'message' => 'Appointment created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create appointment',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get a specific appointment
     */
    public function show($id)
    {
        try {
            $appointment = Appointment::with([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ])->find($id);

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $appointment,
                'message' => 'Appointment retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve appointment',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update an appointment
     */
    public function update(Request $request, $id)
    {
        try {
            $appointment = Appointment::find($id);

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'patient_id' => 'sometimes|exists:patients,id',
                'doctor_id' => 'sometimes|exists:staff_members,id',
                'date_time' => 'sometimes|date_format:Y-m-d H:i:s',
                'procedure' => 'sometimes|string|max:255',
                'length' => 'sometimes|integer|min:15',
                'status' => 'sometimes|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $appointment->update($request->all());
            $appointment = $appointment->load([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ]);

            return response()->json([
                'success' => true,
                'data' => $appointment,
                'message' => 'Appointment updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update appointment',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Delete an appointment
     */
    public function destroy($id)
    {
        try {
            $appointment = Appointment::find($id);

            if (!$appointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment not found',
                ], 404);
            }

            $appointment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Appointment deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete appointment',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Delete all appointments
     */
    public function clearAll()
    {
        try {
            Appointment::query()->delete();

            return response()->json([
                'success' => true,
                'message' => 'All appointments cleared successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear appointments',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
