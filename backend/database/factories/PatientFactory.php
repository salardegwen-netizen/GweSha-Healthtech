<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'last_visit' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'next_appointment' => $this->faker->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'next_appointment_doctor' => 'Dr. ' . $this->faker->lastName(),
            'balance' => $this->faker->numberBetween(0, 5000) / 100,
            'status' => $this->faker->randomElement(['Up to Date', 'Action Required', 'Billing hold']),
        ];
    }
}
