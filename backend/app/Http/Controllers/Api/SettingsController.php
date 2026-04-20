<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Settings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index()
    {
        try {
            $settings = Settings::first() ?? Settings::create([
                'clinic_name' => 'Sanctuary Health',
                'clinic_email' => 'admin@sanctuaryhealth.com',
                'clinic_phone' => '+1 (555) 019-3821',
                'clinic_address' => '1200 Wellness Ave, San Francisco, CA',
            ]);

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Settings retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update settings
     */
    public function update(Request $request, $id = 1)
    {
        try {
            $settings = Settings::findOrCreate(['id' => $id], [
                'clinic_name' => 'Sanctuary Health',
                'clinic_email' => 'admin@sanctuaryhealth.com',
                'clinic_phone' => '+1 (555) 019-3821',
                'clinic_address' => '1200 Wellness Ave, San Francisco, CA',
            ]);

            $allowedFields = [
                'clinic_name', 'clinic_email', 'clinic_phone', 'clinic_address', 'registration_number',
                'tax_id', 'billing_cycle', 'payment_method', 'currency',
                'email_alerts', 'sms_alerts', 'appointment_reminders', 'billing_alerts', 'system_updates',
                'two_factor', 'session_timeout', 'require_password_reset'
            ];

            $data = $request->only($allowedFields);
            $settings->update($data);

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Settings updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update clinic profile
     */
    public function updateClinicProfile(Request $request)
    {
        try {
            $settings = Settings::first() ?? Settings::create([]);

            $settings->update($request->only(['clinic_name', 'clinic_email', 'clinic_phone', 'clinic_address']));

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Clinic profile updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update clinic profile',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update billing configuration
     */
    public function updateBillingConfig(Request $request)
    {
        try {
            $settings = Settings::first() ?? Settings::create([]);

            $settings->update($request->only(['tax_id', 'billing_cycle', 'payment_method', 'currency']));

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Billing configuration updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update billing configuration',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update notifications
     */
    public function updateNotifications(Request $request)
    {
        try {
            $settings = Settings::first() ?? Settings::create([]);

            $settings->update($request->only(['email_alerts', 'sms_alerts', 'appointment_reminders', 'billing_alerts', 'system_updates']));

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Notification preferences updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update notification preferences',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Update security settings
     */
    public function updateSecurity(Request $request)
    {
        try {
            $settings = Settings::first() ?? Settings::create([]);

            $settings->update($request->only(['two_factor', 'session_timeout', 'require_password_reset']));

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Security settings updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update security settings',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
