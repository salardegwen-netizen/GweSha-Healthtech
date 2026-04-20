<?php

namespace Database\Factories;

use App\Models\HealthRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Patient;

/**
 * @extends Factory<HealthRecord>
 */
class HealthRecordFactory extends Factory
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
            'title' => $this->faker->randomElement(['Comprehensive Blood Panel', 'Wellness Summary', 'Cardiac Stress Test', 'Chest X-Ray', 'Blood Pressure Check']),
            'date' => $this->faker->dateTimeBetween('-12 months', 'now')->format('Y-m-d'),
            'type' => $this->faker->randomElement(['Lab Result', 'Review', 'Imaging/Test']),
            'status' => $this->faker->randomElement(['Normal', 'Reviewed', 'Action Needed']),
            'description' => $this->faker->paragraph(),
        ];
    }
}
