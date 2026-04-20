<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScheduleBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    /**
     * Get all schedule blocks
     */
    public function index()
    {
        try {
            $scheduleBlocks = ScheduleBlock::with([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ])->select([
                'id',
                'time',
                'day',
                'patient_id',
                'doctor_id',
                'procedure',
                'length',
                'status',
                'created_at',
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $scheduleBlocks,
                'message' => 'Schedule blocks retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve schedule blocks',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Create a new schedule block
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'time' => 'required|date_format:H:i:s',
                'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'patient_id' => 'required|exists:patients,id',
                'doctor_id' => 'required|exists:staff_members,id',
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

            $scheduleBlock = ScheduleBlock::create([
                'time' => $request->time,
                'day' => $request->day,
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'procedure' => $request->procedure,
                'length' => $request->length,
                'status' => $request->status ?? 'scheduled',
            ]);

            $scheduleBlock = $scheduleBlock->load([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ]);

            return response()->json([
                'success' => true,
                'data' => $scheduleBlock,
                'message' => 'Schedule block created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create schedule block',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get a specific schedule block
     */
    public function show($id)
    {
        try {
            $scheduleBlock = ScheduleBlock::with([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ])->find($id);

            if (!$scheduleBlock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule block not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $scheduleBlock,
                'message' => 'Schedule block retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve schedule block',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update a schedule block
     */
    public function update(Request $request, $id)
    {
        try {
            $scheduleBlock = ScheduleBlock::find($id);

            if (!$scheduleBlock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule block not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'time' => 'sometimes|date_format:H:i:s',
                'day' => 'sometimes|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
                'patient_id' => 'sometimes|exists:patients,id',
                'doctor_id' => 'sometimes|exists:staff_members,id',
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

            $scheduleBlock->update($request->all());
            $scheduleBlock = $scheduleBlock->load([
                'patient:id,first_name,last_name,email,phone',
                'doctor:id,name,email,role,title',
            ]);

            return response()->json([
                'success' => true,
                'data' => $scheduleBlock,
                'message' => 'Schedule block updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update schedule block',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Delete a schedule block
     */
    public function destroy($id)
    {
        try {
            $scheduleBlock = ScheduleBlock::find($id);

            if (!$scheduleBlock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule block not found',
                ], 404);
            }

            $scheduleBlock->delete();

            return response()->json([
                'success' => true,
                'message' => 'Schedule block deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete schedule block',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
