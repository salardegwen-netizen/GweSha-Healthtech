<?php

namespace Database\Factories;

use App\Models\ScheduleBlock;
use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Patient;
use App\Models\StaffMember;

/**
 * @extends Factory<ScheduleBlock>
 */
class ScheduleBlockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'time' => $this->faker->time('H:i'),
            'patient_id' => Patient::inRandomOrder()->first()->id ?? Patient::factory(),
            'doctor_id' => StaffMember::inRandomOrder()->first()->id ?? StaffMember::factory(),
            'procedure' => $this->faker->randomElement(['Cardiac Consult', 'MRI Scan', 'Physical Therapy', 'Post-Op Check', 'Routine Bloodwork']),
            'length' => $this->faker->randomElement(['15m', '30m', '45m', '60m']),
            'status' => $this->faker->randomElement(['Scheduled', 'Confirmed', 'In Progress']),
            'day' => $this->faker->randomElement(['Today', 'Tomorrow', 'Week']),
        ];
    }
}
