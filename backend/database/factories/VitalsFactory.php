<?php

namespace Database\Factories;

use App\Models\Vitals;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Patient;

/**
 * @extends Factory<Vitals>
 */
class VitalsFactory extends Factory
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
            'heart_rate' => $this->faker->numberBetween(60, 100),
            'sleep_hours' => $this->faker->numberBetween(5, 10),
            'blood_pressure_systolic' => $this->faker->numberBetween(110, 140),
            'blood_pressure_diastolic' => $this->faker->numberBetween(70, 90),
            'temperature' => $this->faker->randomFloat(1, 36.5, 37.5),
        ];
    }
}
