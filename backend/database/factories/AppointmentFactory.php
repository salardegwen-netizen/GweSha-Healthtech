<?php

namespace Database\Factories;

use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Patient;
use App\Models\StaffMember;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::inRandomOrder()->first()->id ?? Patient::factory(),
            'doctor_id' => StaffMember::inRandomOrder()->first()->id ?? StaffMember::factory(),
            'date_time' => $this->faker->dateTimeBetween('now', '+3 months'),
            'procedure' => $this->faker->randomElement(['Cardiac Consult', 'MRI Scan', 'Physical Therapy', 'Post-Op Check', 'Routine Bloodwork', 'Prenatal Checkup', 'Annual Physical', 'Dental Screening']),
            'length' => $this->faker->randomElement(['15m', '30m', '45m', '60m', '1h 30m']),
            'status' => $this->faker->randomElement(['Scheduled', 'Confirmed', 'In Progress', 'Waiting', 'Completed', 'Cancelled']),
        ];
    }
}
