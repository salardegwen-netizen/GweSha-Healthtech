<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::where('email', 'admin@sanctuary.com')->first();
        $financeUser = User::where('email', 'finance@sanctuary.com')->first();

        if ($adminUser) {
            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'appointment',
                'title' => 'Upcoming Appointment',
                'message' => 'Dr. Eleanor Sterling has an appointment in 30 minutes - Room 2',
                'read' => false,
                'icon' => 'event_upcoming',
                'color' => 'bg-blue-50 text-blue-700',
            ]);

            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'patient',
                'title' => 'New Patient Added',
                'message' => 'John Michael Doe has been added to the patient directory',
                'read' => false,
                'icon' => 'person_add',
                'color' => 'bg-green-50 text-green-700',
            ]);

            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'billing',
                'title' => 'Outstanding Invoices',
                'message' => '7 invoices are pending payment totaling $1,250',
                'read' => true,
                'icon' => 'receipt_long',
                'color' => 'bg-amber-50 text-amber-700',
            ]);

            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'system',
                'title' => 'System Update',
                'message' => 'Platform will undergo maintenance tonight at 9 PM',
                'read' => true,
                'icon' => 'update',
                'color' => 'bg-gray-50 text-gray-700',
            ]);
        }

        if ($financeUser) {
            Notification::create([
                'user_id' => $financeUser->id,
                'type' => 'billing',
                'title' => 'Payment Received',
                'message' => 'Invoice #INV-2024-0451 has been paid in full - $850',
                'read' => false,
                'icon' => 'check_circle',
                'color' => 'bg-green-50 text-green-700',
            ]);

            Notification::create([
                'user_id' => $financeUser->id,
                'type' => 'billing',
                'title' => 'Overdue Invoice Alert',
                'message' => 'Invoice #INV-2024-0445 is now 15 days overdue - $420',
                'read' => false,
                'icon' => 'warning',
                'color' => 'bg-red-50 text-red-700',
            ]);
        }
    }
}
