<?php

namespace Database\Factories;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Patient;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
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
            'amount' => $this->faker->numberBetween(50, 5000) / 100,
            'date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['Paid', 'Pending', 'Overdue']),
            'description' => $this->faker->randomElement([
                'Consultation with specialist',
                'General health checkup',
                'Laboratory diagnostics',
                'Follow-up visit',
                'Diagnostic imaging services',
                'Vaccination and immunization',
                'Post-operative review',
                'Preventive screening'
            ]),
        ];
    }
}
