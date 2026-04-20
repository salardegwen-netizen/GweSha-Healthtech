<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Invoice;
use App\Models\StaffMember;
use App\Models\HealthRecord;
use App\Models\Vitals;
use App\Models\ScheduleBlock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create demo users with different roles
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sanctuary.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Finance User',
            'email' => 'finance@sanctuary.com',
            'password' => bcrypt('password'),
            'role' => 'finance',
        ]);

        User::factory()->create([
            'name' => 'Patient User',
            'email' => 'patient@sanctuary.com',
            'password' => bcrypt('password'),
            'role' => 'patient',
        ]);

        // Create test data
        // Staff members first (needed for relationships)
        $staffMembers = StaffMember::factory(15)->create();

        // Create patients
        $patients = Patient::factory(50)->create();

        // Create appointments
        Appointment::factory(100)->create();

        // Create invoices
        Invoice::factory(80)->create();

        // Create health records
        HealthRecord::factory(60)->create();

        // Create vitals (3 per patient)
        foreach ($patients as $patient) {
            Vitals::factory(3)->create(['patient_id' => $patient->id]);
        }

        // Create schedule blocks
        ScheduleBlock::factory(150)->create();

        // Create notifications
        $this->call(NotificationSeeder::class);
    }
}
